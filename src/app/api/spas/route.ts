import { NextResponse } from 'next/server'
import { getCachedSpasAndSkus } from '@/lib/spas-service'

// Tính khoảng cách theo công thức Haversine (km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Bán kính Trái Đất theo km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null
    const userLon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : null
    const city = searchParams.get('city')?.toLowerCase()
    const service = searchParams.get('service')
    const q = searchParams.get('q')?.trim().toLowerCase()

    const { spas, services } = await getCachedSpasAndSkus()

    let filtered = spas

    // Lọc theo city nếu có
    if (city && (city === 'hn' || city === 'hcm' || city === 'dn')) {
      filtered = filtered.filter((s) => s.city === city)
    }

    // Lọc theo service nếu có
    if (service) {
      filtered = filtered.filter((s) => s.serviceIds?.includes(service))
    }

    // Lọc theo từ khóa tìm kiếm nếu có
    if (q) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.ward.toLowerCase().includes(q) ||
          (s.district && s.district.toLowerCase().includes(q)) ||
          s.cityName.toLowerCase().includes(q)
      )
    }

    // Gắn thêm khoảng cách tính toán nếu người dùng có GPS
    let result = filtered.map((spa) => {
      let distanceKm: number | null = null
      let formattedDistance = spa.dist
      if (userLat !== null && userLon !== null && !isNaN(userLat) && !isNaN(userLon)) {
        distanceKm = calculateDistanceKm(userLat, userLon, spa.lat, spa.lng)
        formattedDistance = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm}km`
      }
      return {
        ...spa,
        distanceKm,
        formattedDistance,
      }
    })

    if (userLat !== null && userLon !== null) {
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    }

    return NextResponse.json(
      {
        success: true,
        spas: result,
        services,
        totalCount: result.length,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching spas:', error)
    return NextResponse.json({ error: 'Failed to fetch spas' }, { status: 500 })
  }
}
