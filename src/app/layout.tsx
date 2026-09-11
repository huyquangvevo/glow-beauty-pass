import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

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
  themeColor: '#236B38',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`scroll-smooth ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-[#17231A] selection:bg-[#236B38] selection:text-white pb-20">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t border-stone-200/80 bg-white py-5 text-center text-xs text-[#5B6B58] mb-8">
          <p className="font-bold text-[#093E06]">
            glow beauty pass
          </p>
          <p className="mt-1 text-[11px] text-[#5B6B58]">
            Mạng lưới spa nhỏ chuẩn hóa • Quận Cầu Giấy, Hà Nội
          </p>
        </footer>
      </body>
    </html>
  )
}
