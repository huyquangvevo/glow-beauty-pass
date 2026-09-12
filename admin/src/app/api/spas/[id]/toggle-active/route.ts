import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const spa = await prisma.spa.findUnique({ where: { id } })
    if (!spa) {
      return NextResponse.json({ error: 'Không tìm thấy spa.' }, { status: 404 })
    }

    const updatedSpa = await prisma.spa.update({
      where: { id },
      data: { isActive: !spa.isActive },
    })

    return NextResponse.json({
      success: true,
      isActive: updatedSpa.isActive,
      message: `Đã ${updatedSpa.isActive ? 'kích hoạt' : 'tạm dừng'} spa "${updatedSpa.name}".`,
    })
  } catch (error) {
    console.error('Error toggling spa active state:', error)
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi thay đổi trạng thái spa.' },
      { status: 500 }
    )
  }
}
