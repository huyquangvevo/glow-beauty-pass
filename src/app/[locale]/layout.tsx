import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LocationPrompt } from '@/components/LocationPrompt'
import { SearchProvider } from '@/context/SearchContext'
import { LocationProvider } from '@/context/LocationContext'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Glow Beauty Pass - Mạng Lưới Spa Chuẩn Hóa Cầu Giấy',
  description:
    'Nền tảng đặt lịch làm đẹp chuẩn hóa đầu tiên tại Cầu Giấy, Hà Nội. 15 spa tuyển chọn, 3 gói gội cố định, 1 quy trình SOP kiểm định nghiêm ngặt. 1 Đầu mối đặt lịch Zalo.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#40813D',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-[#17231A] selection:bg-[#40813D] selection:text-white">
        <NextIntlClientProvider messages={messages}>
          <LocationProvider>
            <SearchProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <LocationPrompt />
            </SearchProvider>
          </LocationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
