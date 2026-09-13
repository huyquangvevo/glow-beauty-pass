'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { LANGUAGE_OPTIONS, type AppLocale } from '@/i18n/locales'
import { ChevronDown, Check } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const currentLang =
    LANGUAGE_OPTIONS.find((l) => l.code === locale) || LANGUAGE_OPTIONS[0]

  const handleSelect = (code: AppLocale) => {
    setOpen(false)
    router.replace(pathname, { locale: code })
  }

  return (
    <div ref={containerRef} className="relative z-50 text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
        aria-label={`Ngôn ngữ: ${currentLang.name}`}
      >
        <div className="relative w-5 h-3.5 rounded-xs overflow-hidden shrink-0 shadow-xs">
          <Image
            src={currentLang.flagSrc}
            alt={currentLang.flagAlt}
            fill
            sizes="20px"
            className="object-cover"
          />
        </div>
        <span className="text-[11px] font-extrabold tracking-wide uppercase">
          {currentLang.label}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-white/80 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 text-stone-800">
          <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Chọn Ngôn Ngữ
          </div>
          {LANGUAGE_OPTIONS.map((l) => {
            const isSelected = locale === l.code
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 font-bold text-[#236B38]'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative w-5 h-3.5 rounded-xs overflow-hidden shrink-0 shadow-xs border border-stone-200">
                    <Image
                      src={l.flagSrc}
                      alt={l.flagAlt}
                      fill
                      sizes="20px"
                      className="object-cover"
                    />
                  </div>
                  <span className="font-semibold">{l.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#40813D]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
