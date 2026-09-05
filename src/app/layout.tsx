import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'GlowBeautyPass — Mạng lưới spa nhỏ: giá rõ trước, quy trình chuẩn, đặt lịch qua Zalo',
  description:
    'Kết nối nhu cầu làm đẹp với ghế trống của spa nhỏ tại Cầu Giấy. 1 Bảng giá niêm yết, 1 Quy trình SOP chuẩn, 1 Đầu mối đặt lịch Zalo.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
          <p>
            © 2026 GlowBeautyPass • Mạng lưới spa nhỏ chuẩn hóa quy trình • Thử nghiệm Pilot 90 Ngày tại Quận Cầu Giấy
          </p>
        </footer>
      </body>
    </html>
  )
}
