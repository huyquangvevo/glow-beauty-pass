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
  return Math.round(R * c * 10) / 10 // làm tròn 1 chữ số thập phân
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 21.0333 // Mặc định trung tâm Cầu Giấy
    const userLon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : 105.7925
    const ward = searchParams.get('ward')

    const { spas, skus } = await getCachedSpasAndSkus()

    let filteredSpas = spas
    if (ward) {
      filteredSpas = filteredSpas.filter(
        (s) => s.ward && s.ward.toLowerCase().includes(ward.toLowerCase())
      )
    }

    // Gắn thêm khoảng cách tính toán đến người dùng
    const spasWithDistance = filteredSpas.map((spa) => {
      const distanceKm = calculateDistanceKm(userLat, userLon, spa.latitude, spa.longitude)
      return {
        ...spa,
        distanceKm,
        formattedDistance: distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm}km`,
      }
    })

    // Sắp xếp theo thứ tự: Spa gần nhất lên đầu
    spasWithDistance.sort((a, b) => a.distanceKm - b.distanceKm)

    return NextResponse.json(
      {
        spas: spasWithDistance,
        skus,
        totalCount: spasWithDistance.length,
        pilotDistrict: 'Cầu Giấy',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching spas:', error)
    return NextResponse.json({ error: 'Failed to fetch spas' }, { status: 500 })
  }
}

