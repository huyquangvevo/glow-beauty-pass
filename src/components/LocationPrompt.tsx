'use client'

import { useLocation } from '@/context/LocationContext'
import { usePathname } from 'next/navigation'
import { MapPin, X, Loader2 } from 'lucide-react'

export function LocationPrompt() {
  const pathname = usePathname()
  const { isPromptOpen, isLocating, requestLocation, dismissPrompt } = useLocation()

  if (!isPromptOpen) return null

  return (
    <aside
      aria-label="Yêu cầu vị trí"
      className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-white rounded-3xl p-4.5 sm:p-5 shadow-2xl border border-stone-200/90 relative">
        {/* Close Button */}
        <button
          onClick={dismissPrompt}
          className="absolute right-3.5 top-3.5 p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors active:scale-90"
          aria-label="Đóng thông báo vị trí"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#40813D] flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5 shadow-2xs">
            <MapPin className="w-5 h-5 fill-[#40813D]/20" />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
            <h4 className="font-extrabold text-[14px] text-[#1D3E1B] leading-snug">
              Bật vị trí để tìm spa gần bạn nhất
            </h4>
            <p className="text-xs text-[#5B6B58] leading-relaxed">
              Cho phép truy cập vị trí để hệ thống gợi ý và tính khoảng cách đến các spa đồng giá gần bạn nhất.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={requestLocation}
                disabled={isLocating}
                className="px-4 py-2 rounded-xl bg-[#40813D] hover:bg-[#356F32] disabled:bg-[#40813D]/60 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang lấy vị trí...</span>
                  </>
                ) : (
                  <span>Bật vị trí</span>
                )}
              </button>
              <button
                onClick={dismissPrompt}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors py-2 px-1"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
