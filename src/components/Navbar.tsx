'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Compass,
  CalendarCheck,
  Tag,
  BarChart3,
  Search,
  MapPin,
  Headphones,
  ArrowLeft,
  X,
} from 'lucide-react'
import { BrandWordmark } from './BrandLogo'
import { useSearch } from '@/context/SearchContext'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useSearch()

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  const isSpaDetail = pathname.startsWith('/spa/')
  const isHub = pathname.startsWith('/hub')
  const isAdmin = pathname.startsWith('/admin')

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    if (pathname !== '/') {
      router.push('/')
    }
  }

  return (
    <>
      {/* 
        TOP HEADER: 
        - Primary brand color: #40813D
        - Big, sharp official vector Logo (no separate HTML text)
        - Single compact row with integrated search input
        - Location badge on the right
      */}
      <header className="sticky top-0 z-40 bg-[#40813D] text-white shadow-md border-b border-[#356F32]/60 transition-all">
        <div className="max-w-md mx-auto px-3.5 h-14 flex items-center gap-3">
          {/* Back button for detail pages */}
          {isSpaDetail && (
            <Link
              href="/"
              className="p-1.5 -ml-1.5 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white shrink-0"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          {/* Big, Clear Official Brand Logo (Pure Vector 'glow' Wordmark) */}
          <Link
            href="/"
            className="flex items-center shrink-0 group py-1"
            aria-label="glow trang chủ"
          >
            <BrandWordmark className="h-8.5 sm:h-9.5 w-auto text-white drop-shadow-xs group-hover:opacity-90 transition-opacity" />
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

          {/* Quick Location Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/15 text-[11px] font-bold text-white shrink-0 border border-white/10 shadow-2xs">
            <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
            <span>Cầu Giấy</span>
          </div>
        </div>
      </header>

      {/* FLOATING SUPPORT ZALO */}
      {!isSpaDetail && (
        <aside
          aria-label="Hỗ trợ và đặt lịch Zalo"
          className="fixed bottom-20 right-4 z-40"
        >
          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white shadow-lg shadow-[#40813D]/40 border border-white/20 active:scale-95 transition-all text-sm font-bold"
          >
            <Headphones className="w-4 h-4 text-emerald-100" />
            <span>Zalo Hotline</span>
          </a>
        </aside>
      )}

      {/* BOTTOM APP NAVIGATION BAR */}
      <nav
        aria-label="Điều hướng glow beauty pass"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-sm"
      >
        <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors relative ${
              pathname === '/'
                ? 'text-[#40813D] font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[11px]">Khám Phá</span>
            {pathname === '/' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#40813D] absolute -bottom-0.5"></span>
            )}
          </Link>

          <Link
            href="/#bang-gia"
            className="flex flex-col items-center gap-0.5 py-1 text-stone-400 hover:text-[#40813D] font-medium transition-colors"
          >
            <Tag className="w-5 h-5" />
            <span className="text-[11px]">Bảng Giá</span>
          </Link>

          <Link
            href="/hub"
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors relative ${
              isHub
                ? 'text-[#40813D] font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span className="text-[11px]">Lịch Hẹn</span>
            {isHub && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#40813D] absolute -bottom-0.5"></span>
            )}
          </Link>

          <Link
            href="/admin/kpi"
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors relative ${
              isAdmin
                ? 'text-[#40813D] font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[11px]">KPIs</span>
            {isAdmin && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#40813D] absolute -bottom-0.5"></span>
            )}
          </Link>
        </div>
      </nav>
    </>
  )
}
