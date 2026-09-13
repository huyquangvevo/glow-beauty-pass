import { NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  setAdminSessionCookie,
  validateAdminCredentials,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, passcode } = body
    const pwd = password || passcode

    if (!username?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập tên đăng nhập.' },
        { status: 400 }
      )
    }

    if (!pwd?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mật khẩu.' },
        { status: 400 }
      )
    }

    if (!validateAdminCredentials(username, pwd)) {
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
        { status: 401 }
      )
    }

    const token = await createAdminSessionToken(username.trim())
    await setAdminSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công.',
      username: username.trim(),
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi máy chủ.' },
      { status: 500 }
    )
  }
}
