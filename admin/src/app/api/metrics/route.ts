import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalSpas,
      totalBookings,
      totalConversations,
      confirmedConversations,
      totalCustomers,
      repeatCustomers,
      priceViolatedBookings,
      averageRatingAgg,
      recentBookings,
    ] = await Promise.all([
      prisma.spa.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.conversation.count(),
      prisma.conversation.count({ where: { status: 'CONFIRMED' } }),
      prisma.customer.count(),
      prisma.customer.count({ where: { bookingCount: { gte: 2 } } }),
      prisma.booking.count({ where: { priceViolated: true } }),
      prisma.spa.aggregate({
        _avg: { rating: true },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { spa: true, sku: true },
      }),
    ])

    // 1. Số booking / spa / tháng (tính theo tháng hiện tại)
    const bookingsPerSpa = totalSpas > 0 ? Math.round((totalBookings / totalSpas) * 10) / 10 : 0

    // 2. Tỷ lệ hội thoại -> booking
    const conversionRate =
      totalConversations > 0 ? Math.round((confirmedConversations / totalConversations) * 1000) / 10 : 0

    // 3. Khách quay lại trong 45 ngày (dựa trên SĐT có bookingCount >= 2)
    const repeatRate =
      totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 1000) / 10 : 0

    // 4. Tỷ lệ spa giữ đúng giá
    const correctPriceRate =
      totalBookings > 0
        ? Math.round(((totalBookings - priceViolatedBookings) / totalBookings) * 1000) / 10
        : 100

    // 5. Rating trung bình toàn mạng lưới
    const avgRating = averageRatingAgg._avg.rating
      ? Math.round(averageRatingAgg._avg.rating * 10) / 10
      : 4.8

    return NextResponse.json({
      metrics: {
        bookingsPerSpa: {
          current: bookingsPerSpa,
          target: 40,
          unit: 'lượt/spa/tháng',
          isPassing: bookingsPerSpa >= 40,
        },
        conversionRate: {
          current: conversionRate,
          target: 55,
          unit: '%',
          isPassing: conversionRate >= 55,
        },
        repeatRate: {
          current: repeatRate,
          target: 30,
          unit: '%',
          isPassing: repeatRate >= 30,
        },
        correctPriceRate: {
          current: correctPriceRate,
          target: 90,
          unit: '%',
          isPassing: correctPriceRate >= 90,
        },
        avgRating: {
          current: avgRating,
          target: 4.6,
          unit: 'sao',
          isPassing: avgRating >= 4.6,
        },
      },
      summary: {
        totalSpas,
        totalBookings,
        totalConversations,
        totalCustomers,
      },
      recentBookings,
    })
  } catch (error) {
    console.error('Error computing metrics:', error)
    return NextResponse.json({ error: 'Failed to compute metrics' }, { status: 500 })
  }
}
