import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

// Helper tạo slug URL chuẩn từ tên tiếng Việt
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * GET /api/admin/spas
 * Lấy toàn bộ danh sách spa (kể cả active và inactive) cho Admin
 */
export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ward = searchParams.get('ward')
    const tier = searchParams.get('tier')
    const active = searchParams.get('active')
    const search = searchParams.get('search')?.toLowerCase()

    const where: any = {}
    if (ward && ward !== 'ALL') where.ward = ward
    if (tier && tier !== 'ALL') where.tier = tier
    if (active === 'true') where.isActive = true
    if (active === 'false') where.isActive = false

    const spas = await prisma.spa.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    })

    // Lọc tìm kiếm client-like nếu có query search
    let filteredSpas = spas
    if (search) {
      filteredSpas = spas.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.address.toLowerCase().includes(search) ||
          s.phone.includes(search)
      )
    }

    const stats = {
      total: spas.length,
      active: spas.filter((s) => s.isActive).length,
      inactive: spas.filter((s) => !s.isActive).length,
      withViolations: spas.filter((s) => s.yellowCards > 0 || s.redCards > 0).length,
    }

    return NextResponse.json({
      success: true,
      spas: filteredSpas,
      stats,
    })
  } catch (error) {
    console.error('Error fetching admin spas:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách spa.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/spas
 * Onboard tạo mới một đối tác Spa
 */
export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      slug: customSlug,
      address,
      district = 'Cầu Giấy',
      ward,
      phone,
      latitude,
      longitude,
      openHours = '09:00 - 21:30',
      tier = 'STANDARD',
      exclusiveOffer,
      imageUrl,
      isActive = true,
      initSlots = true,
      reviewSectionTitle = 'Khách hàng nói gì về chúng tôi',
      reviewSectionSubtitle = 'Đánh giá từ trải nghiệm dịch vụ thực tế',
      reviewBreakdown,
      reviewTags,
      curatedReviews,
      faqs,
    } = body

    // Validation
    if (!name || !address || !ward || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ Tên, Địa chỉ, Phường và Hotline.' },
        { status: 400 }
      )
    }

    const latNum = parseFloat(latitude)
    const lonNum = parseFloat(longitude)
    if (isNaN(latNum) || isNaN(lonNum)) {
      return NextResponse.json(
        { error: 'Tọa độ GPS (Latitude, Longitude) không hợp lệ.' },
        { status: 400 }
      )
    }

    // Tạo slug duy nhất
    let baseSlug = customSlug?.trim() ? slugify(customSlug) : slugify(name)
    let slug = baseSlug
    let counter = 1
    while (await prisma.spa.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    let computedRating: number | undefined = undefined
    let computedReviewCount: number | undefined = undefined

    if (reviewBreakdown && typeof reviewBreakdown === 'object') {
      const s5 = Number(reviewBreakdown.stars5) || 0
      const s4 = Number(reviewBreakdown.stars4) || 0
      const s3 = Number(reviewBreakdown.stars3) || 0
      const s2 = Number(reviewBreakdown.stars2) || 0
      const s1 = Number(reviewBreakdown.stars1) || 0
      const totalCount = s5 + s4 + s3 + s2 + s1
      if (totalCount > 0) {
        const totalScore = s5 * 5 + s4 * 4 + s3 * 3 + s2 * 2 + s1 * 1
        computedRating = Math.round((totalScore / totalCount) * 10) / 10
        computedReviewCount = totalCount
      }
    }

    // Tạo Spa trong Database
    const newSpa = await prisma.spa.create({
      data: {
        name: name.trim(),
        slug,
        address: address.trim(),
        district: district.trim(),
        ward: ward.trim(),
        phone: phone.trim(),
        latitude: latNum,
        longitude: lonNum,
        openHours: openHours.trim(),
        tier,
        exclusiveOffer: exclusiveOffer?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: Boolean(isActive),
        reviewSectionTitle: reviewSectionTitle?.trim() || 'Khách hàng nói gì về chúng tôi',
        reviewSectionSubtitle: reviewSectionSubtitle?.trim() || 'Đánh giá từ trải nghiệm dịch vụ thực tế',
        reviewBreakdown: reviewBreakdown || undefined,
        reviewTags: reviewTags || undefined,
        curatedReviews: curatedReviews || undefined,
        faqs: faqs || undefined,
        rating: computedRating !== undefined ? computedRating : (body.rating ? Number(body.rating) : 4.8),
        reviewCount: computedReviewCount !== undefined ? computedReviewCount : (body.reviewCount ? Number(body.reviewCount) : 0),
      },
    })

    // Khởi tạo trước 3 slot lịch cho ngày hôm nay nếu được chọn
    if (initSlots) {
      const todayStr = new Date().toISOString().split('T')[0]
      const defaultSlots = [
        { timeSlot: 'MORNING', isOffPeak: true, totalSeats: 3 },
        { timeSlot: 'AFTERNOON', isOffPeak: true, totalSeats: 3 },
        { timeSlot: 'EVENING', isOffPeak: false, totalSeats: 3 },
      ]

      for (const slot of defaultSlots) {
        await prisma.slot.upsert({
          where: {
            spaId_date_timeSlot: {
              spaId: newSpa.id,
              date: todayStr,
              timeSlot: slot.timeSlot,
            },
          },
          update: {},
          create: {
            spaId: newSpa.id,
            date: todayStr,
            timeSlot: slot.timeSlot,
            isOffPeak: slot.isOffPeak,
            totalSeats: slot.totalSeats,
            bookedSeats: 0,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Onboard Spa thành công!',
      spa: newSpa,
    })
  } catch (error) {
    console.error('Error creating spa:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo spa.' },
      { status: 500 }
    )
  }
}
