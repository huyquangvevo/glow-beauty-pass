'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
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
  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0359178342'
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
      ctaLink: zaloHubLink,
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
      ctaLink: zaloHubLink,
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
                {/* Top Row: Subtle Category Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-md border border-white/20">
                    {slide.tag}
                  </span>
                </div>

                {/* Bottom Text & CTA Row */}
                <div className="space-y-2 max-w-sm sm:max-w-md pr-4 sm:pr-8">
                  <div className="space-y-0.5">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-emerald-200 drop-shadow-xs">
                      {slide.highlight}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed line-clamp-2 font-normal">
                    {slide.description}
                  </p>

                  <div className="pt-1 flex items-center gap-2.5">
                    <a
                      href={slide.ctaLink}
                      target={slide.ctaLink.startsWith('http') ? '_blank' : '_self'}
                      rel={slide.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#1B4D20] hover:bg-[#F2F6F0] text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                    >
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

      {/* 3 VALUE REASSURANCE PILL-CARDS */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-0.5">
        {/* Badge 1: 15 Spa Kiểm Định */}
        <a
          href="#danh-sach-spa"
          className="group relative flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 py-2.5 px-2 sm:p-3.5 rounded-2xl bg-gradient-to-b from-white to-[#F8FAF8] hover:to-white border border-stone-200/90 hover:border-emerald-500/50 shadow-[0_2px_8px_rgba(23,35,26,0.04)] hover:shadow-[0_4px_16px_rgba(35,107,56,0.12)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-[#1B4D20] border border-emerald-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-100/90 transition-all duration-300">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
          </div>
          <div className="min-w-0 w-full">
            <div className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight group-hover:text-[#1B4D20] transition-colors whitespace-nowrap">
              {tTrust('badge1.title')}
            </div>
            <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight whitespace-nowrap mt-0.5">
              {tTrust('badge1.desc')}
            </div>
          </div>
        </a>

        {/* Badge 2: Đồng Giá Từ 49K */}
        <a
          href="#goi-dich-vu"
          className="group relative flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 py-2.5 px-2 sm:p-3.5 rounded-2xl bg-gradient-to-b from-white to-[#FCFBF7] hover:to-white border border-stone-200/90 hover:border-amber-400/70 shadow-[0_2px_8px_rgba(23,35,26,0.04)] hover:shadow-[0_4px_16px_rgba(217,119,6,0.12)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-100/90 transition-all duration-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <div className="min-w-0 w-full">
            <div className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight group-hover:text-amber-800 transition-colors whitespace-nowrap">
              {tTrust('badge2.title')}
            </div>
            <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight whitespace-nowrap mt-0.5">
              {tTrust('badge2.desc')}
            </div>
          </div>
        </a>

        {/* Badge 3: Không Cần Cọc */}
        <a
          href={zaloHubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 py-2.5 px-2 sm:p-3.5 rounded-2xl bg-gradient-to-b from-white to-[#F8FAF8] hover:to-white border border-stone-200/90 hover:border-emerald-500/50 shadow-[0_2px_8px_rgba(23,35,26,0.04)] hover:shadow-[0_4px_16px_rgba(35,107,56,0.12)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-[#1B4D20] border border-emerald-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-100/90 transition-all duration-300">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
          </div>
          <div className="min-w-0 w-full">
            <div className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight group-hover:text-[#1B4D20] transition-colors whitespace-nowrap">
              {tTrust('badge3.title')}
            </div>
            <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight whitespace-nowrap mt-0.5">
              {tTrust('badge3.desc')}
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

