'use client'

import Image from 'next/image'
import { Link, usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { BrandWordmark } from './BrandLogo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { HeaderSearch } from './HeaderSearch'

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0359178342'
  const isSpaDetail = pathname.startsWith('/spa/')
  const isSpasMap = pathname.includes('/spas')
  const isHub = pathname.includes('/hub')

  // Trên trang /spas (Bản đồ & Danh sách spa), SpasClientView đã có thanh điều hướng chuyên biệt, ẩn Navbar để tránh trùng lặp 2 header
  if (isSpasMap) {
    return null
  }

  return (
    <>
      {/* TOP HEADER: GLOW BEAUTY PASS (Brand Green #40813D, Logo + Search + Language) */}
      <header className="sticky top-0 z-40 bg-[#40813D] shadow-sm border-b border-[#356F32]">
        <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Brand Logo (Always fixed logo like Home screen) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 shrink-0 hover:opacity-95 transition-opacity"
            aria-label="Glow Beauty Pass Trang Chủ"
          >
            <BrandWordmark className="h-10 sm:h-11 w-auto text-white drop-shadow-xs" />
          </Link>

          {/* Tạm ẩn thanh search để người dùng tập trung vào dịch vụ & USP giá */}
          {/* <HeaderSearch /> */}

          {/* Language Switcher Dropdown (VI • EN • KO) */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* FLOATING SUPPORT ZALO FAB (v1.0 Round Icon Only) */}
      {!isSpaDetail && !isSpasMap && !isHub && (
        <aside
          aria-label="Liên hệ Zalo Hotline tư vấn"
          className="fixed bottom-6 right-4 sm:right-6 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Liên hệ Zalo Hotline"
            title="Liên hệ Zalo Hotline tư vấn & hỗ trợ"
            className="group relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-white shadow-[0_8px_25px_rgba(0,104,255,0.38)] border-2 border-white flex items-center justify-center p-0.5 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {/* Zalo Icon */}
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-xs">
              <Image
                src="/brand/zalo-logo.webp"
                alt="Zalo"
                width={60}
                height={60}
                className="w-full h-full object-cover rounded-full group-hover:rotate-6 transition-transform"
                priority
              />
            </div>

            {/* Pulsing radar effect + online status indicator */}
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs"></span>
            </span>
          </a>
        </aside>
      )}
    </>
  )
}
