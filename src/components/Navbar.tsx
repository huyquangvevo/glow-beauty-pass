'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

export function Navbar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  const isSpaDetail = pathname.startsWith('/spa/')
  const isHub = pathname.startsWith('/hub')
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {/* TOP HEADER: GLOW BEAUTY PASS (Bigger text & breathable spacing) */}
      <header className="sticky top-0 z-40 bg-[#236B38] text-white shadow-xs">
        <div className="max-w-md mx-auto px-4 pt-3.5 pb-3 space-y-3">
          {/* Brand Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isSpaDetail && (
                <Link
                  href="/"
                  className="p-1 -ml-1 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/90"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}

              <Link href="/" className="flex items-center gap-1.5 group">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white">
                  glow
                </span>
                <span className="font-normal text-xl sm:text-2xl tracking-tight text-emerald-100">
                  beauty pass
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-300 ml-0.5"></span>
              </Link>
            </div>

            {/* Region Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/15 text-xs text-emerald-100 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Cầu Giấy, Hà Nội</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm spa hoặc dịch vụ gội"
              className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm pl-10 pr-9 py-2.5 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] text-white shadow-lg shadow-[#236B38]/35 border border-white/20 active:scale-95 transition-all text-sm font-bold"
          >
            <Headphones className="w-4 h-4 text-emerald-200" />
            <span>Zalo Hotline</span>
          </a>
        </aside>
      )}

      {/* BOTTOM APP NAVIGATION BAR */}
      <nav
        aria-label="Điều hướng glow beauty pass"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-sm"
      >
        <div className="max-w-md mx-auto px-6 h-15 flex items-center justify-between">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              pathname === '/'
                ? 'text-[#236B38] font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[11.5px]">Khám Phá</span>
          </Link>

          <Link
            href="/#bang-gia"
            className="flex flex-col items-center gap-1 py-1 text-stone-400 hover:text-[#236B38] font-medium transition-colors"
          >
            <Tag className="w-5 h-5" />
            <span className="text-[11.5px]">Bảng Giá</span>
          </Link>

          <Link
            href="/hub"
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              isHub
                ? 'text-[#236B38] font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span className="text-[11.5px]">Lịch Hẹn</span>
          </Link>

          <Link
            href="/admin/kpi"
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              isAdmin
                ? 'text-[#236B38] font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[11.5px]">KPIs</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
