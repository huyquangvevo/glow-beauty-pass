'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  PlusCircle,
  BarChart3,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'
import { BrandWordmark } from '@/components/BrandLogo'
import { PORTAL_BASE_URL } from '@/lib/config'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [username, setUsername] = useState('Admin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLoginPage = pathname === '/login'

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true)
      return
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true)
          if (data.username) setUsername(data.username)
        } else {
          setIsAuthenticated(false)
          router.push('/login')
        }
      } catch {
        setIsAuthenticated(false)
        router.push('/login')
      }
    }

    checkAuth()
  }, [pathname, isLoginPage, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navLinks = [
    {
      name: 'Quản Lý Spa',
      href: '/spas',
      icon: Building2,
      active: pathname === '/spas' || pathname.startsWith('/spas/edit'),
    },
    {
      name: '+ Onboard Spa Mới',
      href: '/spas/new',
      icon: PlusCircle,
      active: pathname === '/spas/new',
    },
    {
      name: 'Chỉ Số KPI 90 Ngày',
      href: '/kpi',
      icon: BarChart3,
      active: pathname === '/kpi',
    },
  ]

  return (
    <html lang="vi">
      <head>
        <title>Glow Beauty Pass - Cổng Quản Trị Vận Hành (Ops & BD)</title>
        <meta name="description" content="Hệ thống quản trị mạng lưới spa Glow Beauty Pass" />
      </head>
      <body className="min-h-screen bg-[#F6F8F6] text-[#19241B] flex flex-col font-sans">
        {isLoginPage ? (
          children
        ) : isAuthenticated === null ? (
          <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#40813D] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-500 font-medium">Đang xác thực bảo mật quản trị...</p>
          </div>
        ) : (
          <>
            {/* ADMIN HEADER / TOPBAR */}
            <header className="sticky top-0 z-50 bg-[#1D3A1B] text-white border-b border-[#2E582B] shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Brand Left */}
                <div className="flex items-center gap-4">
                  <Link href="/spas" className="flex items-center gap-2">
                    <BrandWordmark className="h-8 sm:h-8.5 w-auto text-white" />
                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300">
                      Portal Vận Hành
                    </span>
                  </Link>

                  {/* Desktop Navigation Links */}
                  <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/15">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            link.active
                              ? 'bg-[#40813D] text-white shadow-xs'
                              : 'text-stone-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{link.name}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                {/* Right User Bar */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <a
                    href={PORTAL_BASE_URL}
                    target="_blank"
                    rel="noreferrer"
                    title="Xem giao diện người dùng trên web/app"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium border border-white/10 transition-all"
                  >
                    <span>Web Khách</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  {/* User Profile Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/25 border border-white/10 text-xs text-white">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold max-w-[90px] sm:max-w-none truncate">{username}</span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất khỏi hệ thống"
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-200 hover:text-white transition-all cursor-pointer"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                  {/* Mobile Hamburger Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl bg-white/10 text-white"
                    aria-label="Menu"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Dropdown */}
              {mobileMenuOpen && (
                <div className="md:hidden bg-[#162D15] border-t border-white/10 px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          link.active
                            ? 'bg-[#40813D] text-white'
                            : 'text-stone-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </Link>
                    )
                  })}
                  <div className="pt-2 border-t border-white/10">
                    <a
                      href={PORTAL_BASE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3.5 py-2 text-xs text-stone-300 hover:text-white"
                    >
                      <span>Mở trang người dùng</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </header>

            {/* MAIN ADMIN WORKSPACE */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {children}
            </main>

            {/* ADMIN SUB-FOOTER */}
            <footer className="border-t border-stone-200 bg-white/60 text-stone-500 py-3 text-center text-xs">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>© 2026 Glow Vietnam • Hệ Thống Quản Trị Mạng Lưới Glow Beauty Pass Cầu Giấy</p>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Bảo Mật Cấp Quản Trị
                  </span>
                  <span>•</span>
                  <span>Phiên Bản Độc Lập v1.0</span>
                </div>
              </div>
            </footer>
          </>
        )}
      </body>
    </html>
  )
}
