'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, MessageCircle, BarChart3, MapPin } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">GlowBeautyPass</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pilot 90D
              </span>
            </div>
            <p className="text-[11px] text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" /> Quận Cầu Giấy • 15 Spa
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              pathname === '/'
                ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            Mạng Lưới Spa
          </Link>

          <Link
            href="/hub"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              pathname.startsWith('/hub')
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-rose-300" />
            <span>Hub Điều Phối</span>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </Link>

          <Link
            href="/admin/kpi"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              pathname.startsWith('/admin')
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">5 Chỉ Số Go/No-Go</span>
            <span className="sm:hidden">KPIs</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
