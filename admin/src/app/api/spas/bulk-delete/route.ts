import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * POST /api/spas/bulk-delete
 * Xóa hàng loạt nhiều spa cùng lúc theo danh sách ID
 */
export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng chọn ít nhất một cơ sở spa để xóa.' },
        { status: 400 }
      )
    }

    // Xóa an toàn trong một transaction duy nhất
    await prisma.$transaction(async (tx) => {
      // 1. Xóa các đặt chỗ liên quan
      await tx.booking.deleteMany({
        where: { spaId: { in: ids } },
      })

      // 2. Xóa các đánh giá liên quan
      await tx.review.deleteMany({
        where: { spaId: { in: ids } },
      })

      // 3. Xóa các khung giờ slot
      await tx.slot.deleteMany({
        where: { spaId: { in: ids } },
      })

      // 4. Xóa các spa được chọn
      await tx.spa.deleteMany({
        where: { id: { in: ids } },
      })
    })

    return NextResponse.json({
      success: true,
      message: `Đã xóa vĩnh viễn thành công ${ids.length} cơ sở spa.`,
      deletedCount: ids.length,
    })
  } catch (error) {
    console.error('Error in bulk delete spas:', error)
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi thực hiện xóa hàng loạt spa.' },
      { status: 500 }
    )
  }
}
