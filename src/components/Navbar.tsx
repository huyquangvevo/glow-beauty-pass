'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  MapPin,
  ArrowLeft,
  X,
} from 'lucide-react'
import { BrandWordmark } from './BrandLogo'
import { ZaloIcon } from './ZaloIcon'
import { useSearch } from '@/context/SearchContext'
import { useLocation } from '@/context/LocationContext'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useSearch()
  const { locationLabel, openPrompt, userCoords, isLocating } = useLocation()

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'
  const isSpaDetail = pathname.startsWith('/spa/')

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    if (pathname !== '/') {
      router.push('/')
    }
  }


  return (
    <>
      {/* TOP HEADER: GLOW BEAUTY PASS (Brand Green #40813D, Logo + Search + Location) */}
      <header className="sticky top-0 z-40 bg-[#40813D] shadow-sm border-b border-[#356F32]">
        <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-2.5 sm:gap-3">
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

          {/* Quick Search Input */}
          <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm spa, dịch vụ..."
              className="w-full h-8.5 bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-[13px] pl-8 pr-7 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700 active:scale-90"
                aria-label="Xoá tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Location Badge / Button (Click to share/refresh location) */}
          <button
            onClick={openPrompt}
            title={
              isLocating
                ? 'Đang xác định vị trí...'
                : userCoords
                ? `Vị trí hiện tại: ${locationLabel}. Bấm để làm mới.`
                : 'Bấm để bật vị trí tìm spa gần bạn nhất'
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 border shadow-2xs transition-all cursor-pointer active:scale-95 ${
              userCoords
                ? 'bg-black/20 hover:bg-black/30 border-emerald-300/40 text-emerald-100'
                : 'bg-black/15 hover:bg-black/25 border-amber-300/30 text-white'
            }`}
          >
            {isLocating ? (
              <div className="w-3 h-3 border-1.5 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <MapPin
                className={`w-3.5 h-3.5 shrink-0 ${
                  userCoords ? 'text-emerald-300 fill-emerald-300' : 'text-amber-300'
                }`}
              />
            )}
            <span className="max-w-[90px] sm:max-w-none truncate">{locationLabel}</span>
          </button>
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
