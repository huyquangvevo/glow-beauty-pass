'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Clock,
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

  return (
    <div
      className="space-y-3.5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
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
                {/* Top Row: Category Tag & Integrated Header Nav Pill */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md border shadow-2xs ${slide.badgeColor}`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>{slide.tag}</span>
                  </span>

                  {/* Top-Right Control Pill */}
                  <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/20 text-white shadow-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevSlide()
                      }}
                      className="p-1 hover:text-amber-300 hover:bg-white/10 active:scale-90 transition-all rounded-full cursor-pointer"
                      aria-label="Banner trước"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-extrabold text-white/90 px-1 tracking-wider">
                      {currentIndex + 1}/{slides.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextSlide()
                      }}
                      className="p-1 hover:text-amber-300 hover:bg-white/10 active:scale-90 transition-all rounded-full cursor-pointer"
                      aria-label="Banner kế tiếp"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

        {/* Bottom-Right Navigation & Pagination Pill (No overlapping with text!) */}
        <div className="absolute bottom-3.5 right-3.5 sm:right-5 z-30 flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 shadow-md">
          <button
            onClick={prevSlide}
            className="p-1 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer rounded-full hover:bg-white/10"
            aria-label="Banner trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 px-0.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? 'w-5 bg-white shadow-xs'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Chuyển đến banner ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-1 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer rounded-full hover:bg-white/10"
            aria-label="Banner kế tiếp"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 CORE TRUST PILLARS (Below Visual Banner) */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="py-2.5 px-2 rounded-2xl bg-white border border-[#D5E7D8] text-[#234E21] shadow-2xs flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#40813D]" />
            <span className="text-xs font-bold leading-tight">{tTrust('badge1.title')}</span>
          </div>
          <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">{tTrust('badge1.desc')}</span>
        </div>

        <div className="py-2.5 px-2 rounded-2xl bg-white border border-[#D5E7D8] text-[#234E21] shadow-2xs flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#40813D]" />
            <span className="text-xs font-bold leading-tight">{tTrust('badge2.title')}</span>
          </div>
          <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">{tTrust('badge2.desc')}</span>
        </div>

        <div className="py-2.5 px-2 rounded-2xl bg-white border border-[#D5E7D8] text-[#234E21] shadow-2xs flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#40813D]" />
            <span className="text-xs font-bold leading-tight">{tTrust('badge3.title')}</span>
          </div>
          <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">{tTrust('badge3.desc')}</span>
        </div>
      </div>
    </div>
  )
}
