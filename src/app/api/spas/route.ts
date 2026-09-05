import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const whereCondition: any = { isActive: true }
    if (ward) {
      whereCondition.ward = ward
    }

    const [spas, skus] = await Promise.all([
      prisma.spa.findMany({
        where: whereCondition,
        include: {
          reviews: {
            take: 2,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.serviceSku.findMany(),
    ])

    // Gắn thêm khoảng cách tính toán đến người dùng
    const spasWithDistance = spas.map((spa) => {
      const distanceKm = calculateDistanceKm(userLat, userLon, spa.latitude, spa.longitude)
      return {
        ...spa,
        distanceKm,
        formattedDistance: distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm}km`,
      }
    })

    // Sắp xếp theo thứ tự: Spa gần nhất lên đầu
    spasWithDistance.sort((a, b) => a.distanceKm - b.distanceKm)

    return NextResponse.json({
      spas: spasWithDistance,
      skus,
      totalCount: spas.length,
      pilotDistrict: 'Cầu Giấy',
    })
  } catch (error) {
    console.error('Error fetching spas:', error)
    return NextResponse.json({ error: 'Failed to fetch spas' }, { status: 500 })
  }
}
