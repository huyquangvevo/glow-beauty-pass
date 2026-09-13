'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BrandWordmark } from './BrandLogo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { HeaderSearch } from './HeaderSearch'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'
  const isSpaDetail = pathname.startsWith('/spa/')

  return (
    <>
      {/* TOP HEADER: GLOW BEAUTY PASS (Brand Green #40813D, Logo + Search + Language) */}
      <header className="sticky top-0 z-40 bg-[#40813D] shadow-sm border-b border-[#356F32]">
        <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Brand Logo or Back Button */}
          {isSpaDetail ? (
            <button
              onClick={() => router.back()}
              className="p-1.5 -ml-1 text-white hover:text-emerald-200 transition-colors flex items-center gap-1 active:scale-90 cursor-pointer"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 shrink-0 hover:opacity-95 transition-opacity"
              aria-label="Glow Beauty Pass Trang Chủ"
            >
              <BrandWordmark className="h-10 sm:h-11 w-auto text-white drop-shadow-xs" />
            </Link>
          )}

          {/* Advanced Search Pill with Autocomplete & Mobile Modal */}
          <HeaderSearch />

          {/* Language Switcher Dropdown (VI • EN • KO) */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* FLOATING SUPPORT ZALO FAB (Logo Only, High-Impact Radar Waves & Online Beacon) */}
      {!isSpaDetail && (
        <aside
          aria-label="Nhắn Zalo tư vấn và đặt lịch"
          className="fixed bottom-6 right-4.5 z-40 group pointer-events-auto"
        >
          {/* Layer 1: Outer Radar Wave Ping */}
          <span className="absolute -inset-2 rounded-full bg-[#0068FF]/35 animate-ping pointer-events-none duration-1000" />
          {/* Layer 2: Subtle Breathing Glow */}
          <span className="absolute -inset-1 rounded-full bg-[#0068FF]/20 animate-pulse pointer-events-none" />

          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn tin Zalo"
            title="Nhắn Zalo tư vấn & đặt lịch nhanh (< 5p)"
            className="relative w-13.5 h-13.5 sm:w-14 sm:h-14 rounded-full bg-white shadow-2xl shadow-[#0068FF]/50 border-2 border-white flex items-center justify-center p-0.5 hover:scale-110 active:scale-95 transition-all duration-300 group-hover:shadow-[#0068FF]/70"
          >
            {/* Official Zalo Logo from docs/brand/Logo-Zalo-App-Rec.webp */}
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/brand/zalo-logo.webp"
                alt="Zalo"
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            {/* Active Online Green Beacon Dot */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs"></span>
            </span>
          </a>
        </aside>
      )}
    </>
  )
}
