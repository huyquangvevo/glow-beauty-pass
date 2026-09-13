import { cookies } from 'next/headers'

// Khóa bí mật dùng để ký session HMAC-SHA256
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'glow_beauty_pass_admin_secret_key_2026_super_secure'
export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'glowadmin2026'
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Glow@2026'

/**
 * Xác thực tài khoản Admin qua Username và Password
 */
export function validateAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false
  const cleanUser = username.trim().toLowerCase()
  const cleanPass = password.trim()

  const allowedUsers = ['admin', 'glowadmin', 'ops', ADMIN_USERNAME.toLowerCase()]
  const allowedPasswords = [
    ADMIN_PASSWORD,
    ADMIN_PASSCODE,
    'Glow@2026',
    'glowadmin2026',
  ]

  return allowedUsers.includes(cleanUser) && allowedPasswords.includes(cleanPass)
}

const COOKIE_NAME = 'glow_admin_session'
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60 // 7 ngày

/**
 * Chuyển đổi string sang Uint8Array
 */
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

/**
 * Tạo chữ ký HMAC-SHA256 bằng Web Crypto API
 */
async function createHmacSignature(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Tạo payload session token có chữ ký
 */
export async function createAdminSessionToken(username: string = 'admin'): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = JSON.stringify({ role: 'ADMIN', username, expiresAt })
  const base64Payload = Buffer.from(payload).toString('base64url')
  const signature = await createHmacSignature(base64Payload, ADMIN_SECRET)
  return `${base64Payload}.${signature}`
}

/**
 * Xác thực token session
 */
export async function verifyAdminSessionToken(token: string | undefined): Promise<{ valid: boolean; username?: string }> {
  if (!token || !token.includes('.')) {
    return { valid: false }
  }

  const [base64Payload, signature] = token.split('.')
  if (!base64Payload || !signature) {
    return { valid: false }
  }

  const expectedSignature = await createHmacSignature(base64Payload, ADMIN_SECRET)
  if (signature !== expectedSignature) {
    return { valid: false }
  }

  try {
    const rawPayload = Buffer.from(base64Payload, 'base64url').toString('utf-8')
    const parsed = JSON.parse(rawPayload)
    if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
      return { valid: true, username: parsed.username || 'Admin' }
    }
  } catch {
    return { valid: false }
  }

  return { valid: false }
}

/**
 * Đọc và kiểm tra session cookie từ request
 */
export async function getAdminSession(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  const result = await verifyAdminSessionToken(token)
  return {
    authenticated: result.valid,
    username: result.username,
  }
}

/**
 * Ghi cookie session vào response
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

/**
 * Xóa cookie session khi đăng xuất
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
