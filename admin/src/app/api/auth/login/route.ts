import { NextResponse } from 'next/server'
import {
  ADMIN_PASSCODE,
  createAdminSessionToken,
  setAdminSessionCookie,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { passcode, username } = body

    if (!passcode) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mật khẩu quản trị.' },
        { status: 400 }
      )
    }

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu quản trị không chính xác.' },
        { status: 401 }
      )
    }

    const token = await createAdminSessionToken(username || 'Admin Glow')
    await setAdminSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công.',
      username: username || 'Admin Glow',
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi máy chủ.' },
      { status: 500 }
    )
  }
}
