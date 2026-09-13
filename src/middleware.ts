import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Bỏ qua /api, /_next, /icons, /banners, /brand, /spas và các file tĩnh có đuôi
  matcher: ['/((?!api|_next|_vercel|icons|banners|brand|spas|.*\\..*).*)'],
}
