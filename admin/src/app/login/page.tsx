'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react'
import { BrandWordmark } from '@/components/BrandLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [username, setUsername] = useState('Admin Glow')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!passcode.trim()) {
      setErrorMsg('Vui lòng nhập mật mã quản trị.')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim(), username: username.trim() }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Mật mã quản trị không chính xác.')
        return
      }

      router.push('/spas')
      router.refresh()
    } catch {
      setErrorMsg('Không thể kết nối máy chủ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#40813D]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl space-y-7 z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#40813D]/20 border border-[#40813D]/40 text-[#40813D] shadow-inner mb-1">
            <Lock className="w-7 h-7 text-emerald-400" />
          </div>

          <div className="flex justify-center">
            <BrandWordmark className="h-9 w-auto text-white drop-shadow-sm" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Cổng Quản Trị & Vận Hành
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Dành riêng cho ban quản trị & đội ngũ BD / Ops Glow Beauty Pass
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs font-medium flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">Tên hiển thị người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="VD: Admin Glow, BD Leader..."
              className="w-full px-4 py-2.5 rounded-xl bg-stone-800/80 border border-stone-700/80 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">Mật khẩu quản trị (Passcode)</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Nhập mật khẩu truy cập hệ thống"
                autoFocus
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-stone-800/80 border border-stone-700/80 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
                aria-label={showPassword ? 'Ẩn mật mã' : 'Hiện mật mã'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 pt-0.5">
              Mật khẩu mặc định hệ thống: <code className="text-stone-400 font-mono">glowadmin2026</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#356F32] to-[#40813D] hover:from-[#2E602C] hover:to-[#356F32] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 border border-white/10 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng Nhập Quản Trị</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge & Return link */}
        <div className="pt-2 border-t border-stone-800/80 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Xác thực phiên bảo mật HMAC-SHA256 • HTTP-only</span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <span>Mở trang web khách hàng</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
