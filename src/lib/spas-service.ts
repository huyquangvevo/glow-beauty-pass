import { prisma } from '@/lib/prisma'
import { MVPSpa, MVPService, MVP_SPAS, MVP_SERVICES } from '@/lib/mvp-data'

interface CacheEntry {
  data: {
    spas: MVPSpa[]
    services: MVPService[]
  }
  timestamp: number
}

// Global in-memory cache with 60 seconds TTL for blazing speed & realtime admin updates
let memoryCache: CacheEntry | null = null
const CACHE_TTL_MS = 60 * 1000

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
    dist: '0,8 km',
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
 * Get single Spa detail by slug or ID from real DB
 */
export async function getRealSpaDetailFromDb(
  slugOrId: string
): Promise<{ spa: MVPSpa; services: MVPService[] } | null> {
  const { spas, services } = await getCachedSpasAndSkus()
  const found = spas.find((s) => s.id === slugOrId)

  if (found) {
    return { spa: found, services }
  }

  // If not found in cache, perform single direct DB lookup
  try {
    const dbSpa = await prisma.spa.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
        isActive: true,
      },
    })
    if (dbSpa) {
      return { spa: mapPrismaSpaToMVPSpa(dbSpa), services }
    }
  } catch (e) {
    console.warn('Direct lookup error:', e)
  }

  return null
}
