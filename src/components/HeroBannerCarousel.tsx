'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BannerSlide {
  id: string
  image: string
  tag: string
  title: string
  highlight: string
  description: string
  ctaText: string
  ctaLink: string
  badgeColor: string
}

export function HeroBannerCarousel() {
  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'
  const tHero = useTranslations('Hero')
  const tTrust = useTranslations('TrustBadges')

  const slides: BannerSlide[] = [
    {
      id: 'slide-1',
      image: '/banners/banner_herbal_wash.jpg',
      tag: tHero('slide1.tag'),
      title: tHero('slide1.title'),
      highlight: tHero('slide1.highlight'),
      description: tHero('slide1.description'),
      ctaText: tHero('slide1.cta'),
      ctaLink: `${zaloHubLink}?text=Gói%20Gội%20Thư%20Giãn%2049K`,
      badgeColor: 'bg-emerald-600/90 text-white border-emerald-400/40',
    },
    {
      id: 'slide-2',
      image: '/banners/banner_neck_massage.jpg',
      tag: tHero('slide2.tag'),
      title: tHero('slide2.title'),
      highlight: tHero('slide2.highlight'),
      description: tHero('slide2.description'),
      ctaText: tHero('slide2.cta'),
      ctaLink: `${zaloHubLink}?text=Trị%20Liệu%20Cổ%20Vai%20Gáy%20149K`,
      badgeColor: 'bg-amber-600/90 text-white border-amber-300/40',
    },
    {
      id: 'slide-3',
      image: '/banners/banner_spa_ambiance.jpg',
      tag: tHero('slide3.tag'),
      title: tHero('slide3.title'),
      highlight: tHero('slide3.highlight'),
      description: tHero('slide3.description'),
      ctaText: tHero('slide3.cta'),
      ctaLink: '#danh-sach-spa',
      badgeColor: 'bg-[#40813D]/90 text-white border-white/30',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  // Auto advance slide every 5.5s
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5500)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, slides.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false)
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (diff > 40) {
      nextSlide()
    } else if (diff < -40) {
      prevSlide()
    }
    touchStartX.current = null
  }

  return (
    <div
      className="space-y-3.5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* MAIN CAROUSEL BANNER */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-900 group aspect-[16/10] sm:aspect-[16/8] min-h-[280px]">
        {/* Slides Images */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 visible' : 'opacity-0 pointer-events-none z-0 invisible'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority={index === 0}
                className="object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700"
              />

              {/* Gradient Scrims: Dark gradient on bottom/left for high text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between z-20 text-white">
                {/* Top Row: Category Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md border shadow-2xs ${slide.badgeColor}`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>{slide.tag}</span>
                  </span>
                </div>

                {/* Bottom Text & CTA Row */}
                <div className="space-y-2.5 max-w-sm sm:max-w-md pr-4 sm:pr-8">
                  <div className="space-y-0.5">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base font-extrabold text-amber-300 drop-shadow-sm">
                      {slide.highlight}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed line-clamp-2 drop-shadow-sm font-normal">
                    {slide.description}
                  </p>

                  <div className="pt-1 flex items-center gap-2.5">
                    <a
                      href={slide.ctaLink}
                      target={slide.ctaLink.startsWith('http') ? '_blank' : '_self'}
                      rel={slide.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#356F32] to-[#40813D] hover:from-[#2E602C] hover:to-[#356F32] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-black/40 border border-white/20 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-100" />
                      <span>{slide.ctaText}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Next Slide Arrow Button (Right edge, completely clear of text) */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/65 active:scale-90 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-md transition-all cursor-pointer group/btn"
          aria-label="Chuyển sang banner tiếp theo"
          title="Banner tiếp theo"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/95 group-hover/btn:text-amber-300 transition-colors" />
        </button>

        {/* Bottom-Right Minimalist Pagination Indicators */}
        <div className="absolute bottom-3.5 right-3.5 sm:right-5 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 shadow-md">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-6 bg-white shadow-xs'
                  : 'w-1.5 bg-white/45 hover:bg-white/80'
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3 CORE TRUST PILLARS (Elevated Bento Style, Prominent, Clean Micro-Pills) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="relative overflow-hidden p-3 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-white to-[#F7FAF6] border border-[#C5E0C8] shadow-[0_4px_16px_rgba(20,60,25,0.06)] hover:shadow-md hover:border-[#356F32]/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-between text-center group cursor-default">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#40813D]/40 to-transparent" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#D5EDD7] text-[#1E6020] flex items-center justify-center mb-2 sm:mb-2.5 shadow-2xs border border-[#BDDFBF] group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#2E722A]" />
          </div>
          <div className="space-y-1.5 flex flex-col items-center">
            <h4 className="text-[12.5px] sm:text-[15px] md:text-base font-black text-[#0A3C08] tracking-tight leading-tight">
              {tTrust('badge1.title')}
            </h4>
            <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EAF5EB] text-[#245D21] text-[10px] sm:text-[11.5px] font-extrabold tracking-tight border border-[#C2E3C6] shadow-2xs">
              {tTrust('badge1.desc')}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden p-3 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-white to-[#F7FAF6] border border-[#C5E0C8] shadow-[0_4px_16px_rgba(20,60,25,0.06)] hover:shadow-md hover:border-[#356F32]/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-between text-center group cursor-default">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#40813D]/40 to-transparent" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#D5EDD7] text-[#1E6020] flex items-center justify-center mb-2 sm:mb-2.5 shadow-2xs border border-[#BDDFBF] group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#2E722A]" />
          </div>
          <div className="space-y-1.5 flex flex-col items-center">
            <h4 className="text-[12.5px] sm:text-[15px] md:text-base font-black text-[#0A3C08] tracking-tight leading-tight">
              {tTrust('badge2.title')}
            </h4>
            <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EAF5EB] text-[#245D21] text-[10px] sm:text-[11.5px] font-extrabold tracking-tight border border-[#C2E3C6] shadow-2xs">
              {tTrust('badge2.desc')}
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden p-3 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-white to-[#F7FAF6] border border-[#C5E0C8] shadow-[0_4px_16px_rgba(20,60,25,0.06)] hover:shadow-md hover:border-[#356F32]/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-between text-center group cursor-default">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#40813D]/40 to-transparent" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#D5EDD7] text-[#1E6020] flex items-center justify-center mb-2 sm:mb-2.5 shadow-2xs border border-[#BDDFBF] group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#2E722A]" />
          </div>
          <div className="space-y-1.5 flex flex-col items-center">
            <h4 className="text-[12.5px] sm:text-[15px] md:text-base font-black text-[#0A3C08] tracking-tight leading-tight">
              {tTrust('badge3.title')}
            </h4>
            <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EAF5EB] text-[#245D21] text-[10px] sm:text-[11.5px] font-extrabold tracking-tight border border-[#C2E3C6] shadow-2xs">
              {tTrust('badge3.desc')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

