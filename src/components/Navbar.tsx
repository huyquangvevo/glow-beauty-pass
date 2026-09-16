'use client'

import Image from 'next/image'
import { Link, usePathname } from '@/i18n/routing'
import { BrandWordmark } from './BrandLogo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { HeaderSearch } from './HeaderSearch'

export function Navbar() {
  const pathname = usePathname()

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0359178342'
  const isSpaDetail = pathname.startsWith('/spa/')

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

          {/* Advanced Search Pill with Autocomplete & Mobile Modal */}
          <HeaderSearch />

          {/* Language Switcher Dropdown (VI • EN • KO) */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* FLOATING SUPPORT ZALO FAB (Clean, Premium, Non-intrusive) */}
      {!isSpaDetail && (
        <aside
          aria-label="Nhắn Zalo tư vấn và đặt lịch"
          className="fixed bottom-6 right-4 sm:right-6 z-40 group pointer-events-auto"
        >
          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn tin Zalo"
            title="Nhắn Zalo tư vấn và đặt lịch"
            className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white shadow-[0_4px_20px_rgba(0,104,255,0.25)] border border-[#E5EAE3] flex items-center justify-center p-0.5 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,104,255,0.35)] active:scale-95 transition-all duration-200"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/brand/zalo-logo.webp"
                alt="Zalo"
                width={52}
                height={52}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            {/* Subtle Online Status Dot (Solid, No Ping) */}
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
          </a>
        </aside>
      )}
    </>
  )
}
