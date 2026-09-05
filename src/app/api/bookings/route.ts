import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      conversationId,
      spaId,
      skuId,
      customerPhone,
      customerName,
      bookingDate,
      bookingTime,
      slotId,
      notes,
    } = body

    if (!spaId || !skuId || !customerPhone || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin: Spa, Dịch vụ, SĐT, Ngày và Giờ hẹn' },
        { status: 400 }
      )
    }

    const [spa, sku] = await Promise.all([
      prisma.spa.findUnique({ where: { id: spaId } }),
      prisma.serviceSku.findUnique({ where: { id: skuId } }),
    ])

    if (!spa || !sku) {
      return NextResponse.json({ error: 'Spa hoặc Dịch vụ không tồn tại' }, { status: 404 })
    }

    // Find or create customer
    const customer = await prisma.customer.upsert({
      where: { phone: customerPhone },
      update: {
        name: customerName || undefined,
        lastContactAt: new Date(),
        bookingCount: { increment: 1 },
      },
      create: {
        phone: customerPhone,
        name: customerName || 'Khách đặt lịch',
        firstContactAt: new Date(),
        lastContactAt: new Date(),
        bookingCount: 1,
      },
    })

    // Sinh mã booking ngẫu nhiên dạng GBP-xxxxx
    const randomCode = `GBP-${Math.floor(10000 + Math.random() * 90000)}`

    // Tạo booking
    const booking = await prisma.booking.create({
      data: {
        code: randomCode,
        customerId: customer.id,
        customerPhone,
        customerName: customer.name,
        conversationId,
        spaId,
        skuId,
        slotId,
        bookingDate,
        bookingTime,
        status: 'CONFIRMED',
        pricePaid: sku.pricePhase1, // Pha 1: 49K, 69K, 149K
        spaPayout: sku.spaCost,
        notes,
      },
      include: {
        spa: true,
        sku: true,
      },
    })

    // Nếu có slotId, cập nhật số ghế đã đặt
    if (slotId) {
      await prisma.slot.update({
        where: { id: slotId },
        data: { bookedSeats: { increment: 1 } },
      })
    }

    // Cập nhật trạng thái conversation sang CONFIRMED
    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'CONFIRMED',
          customerId: customer.id,
          customerPhone,
          customerName: customer.name,
        },
      })
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
