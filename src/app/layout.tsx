import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LocationPrompt } from '@/components/LocationPrompt'
import { SearchProvider } from '@/context/SearchContext'
import { LocationProvider } from '@/context/LocationContext'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`scroll-smooth ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-[#17231A] selection:bg-[#40813D] selection:text-white">
        <LocationProvider>
          <SearchProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <LocationPrompt />
          </SearchProvider>
        </LocationProvider>
      </body>
    </html>
  )
}
