'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  MapPin,
  Headphones,
  ArrowLeft,
  X,
} from 'lucide-react'
import { BrandWordmark } from './BrandLogo'
import { useSearch } from '@/context/SearchContext'
import { useLocation } from '@/context/LocationContext'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useSearch()
  const { locationLabel, openPrompt, userCoords } = useLocation()

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
      <header className="sticky top-0 z-40 bg-[#40813D] text-white shadow-xs">
        <div className="max-w-md sm:max-w-xl md:max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-2.5">
          {/* Back Button for Detail Pages */}
          {isSpaDetail && (
            <button
              onClick={() => router.back()}
              className="p-1.5 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95 shrink-0"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Clean Vector SVG Logo (Wordmark: 'glow' + 'Beauty Pass') */}
          <Link
            href="/"
            className="flex items-center group py-0.5 shrink-0"
            aria-label="glow beauty pass - Trang chủ"
          >
            <BrandWordmark className="h-10 sm:h-11 w-auto text-white drop-shadow-xs group-hover:opacity-95 transition-opacity" />
          </Link>

          {/* Integrated Search Bar (Single Row - Space Efficient) */}
          <div className="flex-1 min-w-0 relative">
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
            title={userCoords ? 'Đã bật vị trí GPS' : 'Bấm để bật vị trí GPS gần bạn'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/15 hover:bg-black/25 active:scale-95 text-[11px] font-bold text-white shrink-0 border border-white/10 shadow-2xs transition-all cursor-pointer"
          >
            <MapPin className={`w-3 h-3 ${userCoords ? 'text-emerald-300 fill-emerald-300' : 'text-amber-300'} shrink-0`} />
            <span className="max-w-[70px] sm:max-w-none truncate">{locationLabel}</span>
          </button>
        </div>
      </header>

      {/* FLOATING SUPPORT ZALO (Placed at bottom-5 since bottom tab bar is removed) */}
      {!isSpaDetail && (
        <aside
          aria-label="Hỗ trợ và đặt lịch Zalo"
          className="fixed bottom-5 right-4 z-40"
        >
          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white shadow-lg shadow-[#40813D]/40 border border-white/20 active:scale-95 transition-all text-xs sm:text-sm font-bold"
          >
            <Headphones className="w-4 h-4 text-emerald-100" />
            <span>Zalo Hotline</span>
          </a>
        </aside>
      )}
    </>
  )
}
