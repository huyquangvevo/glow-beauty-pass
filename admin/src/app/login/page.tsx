'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { BrandWordmark } from '@/components/BrandLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập.')
      return
    }

    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu.')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.')
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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-7 sm:p-9 shadow-xl shadow-stone-900/5 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandWordmark className="h-10 w-auto text-[#40813D]" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Đăng nhập Quản trị
          </h1>
          <p className="text-xs text-stone-500">
            Hệ thống quản lý đối tác Spa & Vận hành
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-username"
              className="block text-xs font-semibold text-stone-700"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập (VD: admin)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D]/25 focus:border-[#40813D] transition-all bg-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-stone-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị"
                autoFocus={username === 'admin'}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D]/25 focus:border-[#40813D] transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#40813D] hover:bg-[#356F32] active:bg-[#2E602C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          <span>© Glow Beauty Pass</span>
          <a
            href="https://glowbeautypass.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-stone-500 hover:text-[#40813D] transition-colors"
          >
            <span>Trang khách hàng</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
