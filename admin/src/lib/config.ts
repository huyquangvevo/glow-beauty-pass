/**
 * Configuration constants for Glow Beauty Pass Admin
 */

export const PORTAL_BASE_URL = (
  process.env.NEXT_PUBLIC_PORTAL_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowbeautypass.com')
).replace(/\/+$/, '')
