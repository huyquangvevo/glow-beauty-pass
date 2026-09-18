import { MVP_SERVICES, MVP_SPAS, MVPService, MVPSpa, MVPReview } from '@/lib/mvp-data'
import { getSpaSpecificReviews } from '@/lib/spa-reviews-data'
import { computeDistanceKm, DEFAULT_CITY_CENTERS, formatDistanceKm } from '@/lib/formatters'
import { prisma } from '@/lib/prisma'

const CACHE_TTL_MS = 60 * 1000 // 60 seconds TTL

const DEFAULT_SERVICE_ORDER = [
  'goi-sach',
  'goi-dau-cap',
  'duong-sinh',
  'massage-body',
  'cham-soc-da',
  'combo-goi-da',
  'triet-long',
]

let memoryCache: {
  data: {
    spas: MVPSpa[]
    services: MVPService[]
  }
  timestamp: number
} | null = null

export function clearSpasCache() {
  memoryCache = null
}

export function mapPrismaSpaToMVPSpa(s: any): MVPSpa {
  const photos =
    Array.isArray(s.photos) && s.photos.length > 0
      ? s.photos
      : s.imageUrl
      ? [s.imageUrl]
      : ['/spas/spa_thumb_1.jpg']

  const serviceIds =
    Array.isArray(s.serviceIds) && s.serviceIds.length > 0
      ? s.serviceIds
      : ['goi-sach', 'duong-sinh']

  const hours =
    Array.isArray(s.hours) && s.hours.length > 0
      ? s.hours
      : [
          { d: 'T2 - T6', t: s.openHours || '09:00 - 21:30' },
          { d: 'T7 - CN', t: s.openHours || '09:00 - 21:30' },
        ]

  const cityKey = (s.city || 'hn') as string
  const cityCenter = DEFAULT_CITY_CENTERS[cityKey] || DEFAULT_CITY_CENTERS.hn
  let dist = '1,2 km'
  if (typeof s.latitude === 'number' && typeof s.longitude === 'number') {
    const km = computeDistanceKm(cityCenter.lat, cityCenter.lng, s.latitude, s.longitude)
    dist = formatDistanceKm(km)
  }

  return {
    id: s.slug || s.id,
    name: s.name,
    ward: s.ward || 'Cầu Giấy',
    district: s.district || s.ward || 'Cầu Giấy',
    city: (s.city || 'hn') as 'hn' | 'hcm' | 'dn',
    cityName:
      s.cityName ||
      (s.city === 'hcm' ? 'TP.HCM' : s.city === 'dn' ? 'Đà Nẵng' : 'Hà Nội'),
    lat: s.latitude,
    lng: s.longitude,
    rating: s.rating || 4.9,
    reviews: s.reviewCount || 120,
    dist,
    open: s.isActive !== false,
    tier: (s.tier?.toUpperCase() === 'CERTIFIED'
      ? 'Certified'
      : 'Verified') as 'Certified' | 'Verified',
    today:
      s.todayHours ||
      (s.openHours ? `Hôm nay ${s.openHours}` : 'Hôm nay 09:00 - 21:30'),
    hours,
    address: s.address,
    photos,
    serviceIds,
  }
}

export function mapPrismaSkuToMVPService(sku: any): MVPService {
  return {
    id: sku.code || sku.id,
    name: sku.name,
    short: sku.shortName || sku.name,
    price: sku.price || sku.pricePhase1 || 39000,
    dur: sku.dur || (sku.durationMinutes ? `${sku.durationMinutes} phút` : ''),
    count: sku.spaCount || 400,
    badge: sku.badge || undefined,
    wide: !!sku.wide,
    desc: sku.description || undefined,
  }
}

/**
 * Fetch all active Spas and Services from real Supabase DB with in-memory caching
 */
export async function getCachedSpasAndSkus(): Promise<{
  spas: MVPSpa[]
  services: MVPService[]
}> {
  const now = Date.now()

  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data
  }

  try {
    const fetchPromise = Promise.all([
      prisma.spa.findMany({
        where: { isActive: true },
        orderBy: [{ tier: 'asc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.serviceSku.findMany({
        where: {
          price: { gt: 0 },
        },
        orderBy: { price: 'asc' },
      }),
    ])

    // Fast timeout of 2.5s for instant response
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 2500)
    )

    const [dbSpas, dbSkus] = await Promise.race([fetchPromise, timeoutPromise])

    if (dbSpas && dbSpas.length > 0) {
      const mappedSpas = dbSpas.map(mapPrismaSpaToMVPSpa)
      const mappedServices =
        dbSkus && dbSkus.length > 0
          ? dbSkus.map(mapPrismaSkuToMVPService)
          : MVP_SERVICES

      // Giữ đúng thứ tự dịch vụ như thiết kế ban đầu (triệt lông luôn nằm ở cuối cùng)
      mappedServices.sort((a, b) => {
        const indexA = DEFAULT_SERVICE_ORDER.indexOf(a.id)
        const indexB = DEFAULT_SERVICE_ORDER.indexOf(b.id)
        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        return a.price - b.price
      })

      memoryCache = {
        data: {
          spas: mappedSpas,
          services: mappedServices,
        },
        timestamp: now,
      }
      return memoryCache.data
    }
  } catch (error) {
    console.warn('Database query error or slow, using fallback:', error)
  }

  if (memoryCache) {
    return memoryCache.data
  }

  // Resilient fallback to static MVP data if DB is temporarily unreachable
  return {
    spas: MVP_SPAS,
    services: MVP_SERVICES,
  }
}

/**
 * Get single Spa detail by slug or ID from real DB with full reviews and latest photos
 */
export async function getRealSpaDetailFromDb(
  slugOrId: string
): Promise<{ spa: MVPSpa; services: MVPService[]; reviews: MVPReview[] } | null> {
  const { services } = await getCachedSpasAndSkus()

  try {
    const dbSpa = await prisma.spa.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
        isActive: true,
      },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (dbSpa) {
      const mappedSpa = mapPrismaSpaToMVPSpa(dbSpa)

      const mappedReviews: MVPReview[] = (dbSpa.reviews || []).map((r) => {
        let photoUrls: string[] = []
        if (r.photoUrls) {
          try {
            photoUrls = JSON.parse(r.photoUrls)
          } catch {
            photoUrls = []
          }
        }

        const date = new Date(r.createdAt)
        const now = Date.now()
        const diffHours = Math.max(1, Math.floor((now - date.getTime()) / (1000 * 60 * 60)))
        let when = 'Hôm nay'
        if (diffHours >= 24 * 30) when = `${Math.floor(diffHours / (24 * 30))} tháng trước`
        else if (diffHours >= 24 * 7) when = `${Math.floor(diffHours / (24 * 7))} tuần trước`
        else if (diffHours >= 24) when = `${Math.floor(diffHours / 24)} ngày trước`
        else when = `${diffHours} giờ trước`

        return {
          initial: (r.customerName || 'K').trim()[0].toUpperCase(),
          name: r.customerName || 'Khách hàng',
          phoneMask: r.customerPhone ? r.customerPhone.slice(0, 4) + '***' + r.customerPhone.slice(-3) : undefined,
          stars: '★'.repeat(r.rating) + '☆'.repeat(Math.max(0, 5 - r.rating)),
          rating: r.rating,
          when,
          createdAt: r.createdAt.toISOString(),
          text: r.comment,
          photos: photoUrls.length,
          photoUrls,
          verifiedPhone: r.isOtpVerified,
        }
      })

      return {
        spa: mappedSpa,
        services,
        reviews: mappedReviews.length > 0 ? mappedReviews : getSpaSpecificReviews(mappedSpa),
      }
    }
  } catch (e) {
    console.warn('Direct lookup error for spa detail:', e)
  }

  // Fallback to cached list if direct query fails
  const { spas } = await getCachedSpasAndSkus()
  const fallbackSpa = spas.find((s) => s.id === slugOrId)
  if (fallbackSpa) {
    return { spa: fallbackSpa, services, reviews: getSpaSpecificReviews(fallbackSpa) }
  }

  return null
}
