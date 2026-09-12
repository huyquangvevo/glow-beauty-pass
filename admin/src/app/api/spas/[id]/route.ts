import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const spa = await prisma.spa.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true, reviews: true },
        },
      },
    })

    if (!spa) {
      return NextResponse.json({ error: 'Không tìm thấy spa.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, spa })
  } catch (error) {
    console.error('Error fetching spa detail:', error)
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi lấy chi tiết spa.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      name,
      address,
      district,
      ward,
      phone,
      latitude,
      longitude,
      openHours,
      tier,
      exclusiveOffer,
      imageUrl,
      isActive,
      yellowCards,
      redCards,
    } = body

    const existingSpa = await prisma.spa.findUnique({ where: { id } })
    if (!existingSpa) {
      return NextResponse.json({ error: 'Không tìm thấy spa.' }, { status: 404 })
    }

    const updatedSpa = await prisma.spa.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        address: address !== undefined ? address.trim() : undefined,
        district: district !== undefined ? district.trim() : undefined,
        ward: ward !== undefined ? ward.trim() : undefined,
        phone: phone !== undefined ? phone.trim() : undefined,
        latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
        longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
        openHours: openHours !== undefined ? openHours.trim() : undefined,
        tier: tier !== undefined ? tier : undefined,
        exclusiveOffer: exclusiveOffer !== undefined ? exclusiveOffer?.trim() || null : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl?.trim() || null : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        yellowCards: yellowCards !== undefined ? parseInt(yellowCards, 10) : undefined,
        redCards: redCards !== undefined ? parseInt(redCards, 10) : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin spa thành công!',
      spa: updatedSpa,
    })
  } catch (error) {
    console.error('Error updating spa:', error)
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi cập nhật spa.' },
      { status: 500 }
    )
  }
}
