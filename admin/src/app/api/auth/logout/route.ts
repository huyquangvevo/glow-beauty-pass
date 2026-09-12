import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/admin-auth'

export async function POST() {
  try {
    await clearAdminSessionCookie()
    return NextResponse.json({ success: true, message: 'Đã đăng xuất.' })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi đăng xuất.' },
      { status: 500 }
    )
  }
}
