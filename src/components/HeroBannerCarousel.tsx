'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
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

  const slides: BannerSlide[] = [
    {
      id: 'slide-1',
      image: '/services/duong-sinh.png',
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
      image: '/services/massage-body.png',
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
      image: '/services/cham-soc-da.png',
      tag: tHero('slide3.tag'),
      title: tHero('slide3.title'),
      highlight: tHero('slide3.highlight'),
      description: tHero('slide3.description'),
      ctaText: tHero('slide3.cta'),
      ctaLink: zaloHubLink,
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
      <div className="relative w-full rounded-3xl overflow-hidden shadow-md border border-[#DDE4D9] bg-stone-900 group aspect-[16/10] sm:aspect-[16/8] min-h-[280px]">
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

              {/* Gradient Scrims: Lighter, cleaner gradient so spa photography stays radiant */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

              {/* Slide Content Overlay - Anchored to bottom, top of photo completely clean & open */}
              <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end z-20 text-white">
                {/* Bottom Text & CTA Row - High-End Editorial Typography (Semibold headline, regular text) */}
                <div className="space-y-2.5 sm:space-y-3 max-w-sm sm:max-w-md pr-4">
                  {/* Category Kicker: Unboxed, delicate letter spacing, subtle hairline indicator */}
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-px bg-emerald-300/80 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium tracking-[0.14em] uppercase text-emerald-200 drop-shadow-xs">
                      {slide.tag}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight drop-shadow-sm">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base font-normal text-emerald-200 drop-shadow-xs">
                      {slide.highlight}
                    </p>
                  </div>

                  <div className="pt-0.5 flex items-center gap-2">
                    <a
                      href={slide.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4.5 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[#F5F7F4] text-[#093E06] text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
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
    </div>
  )
}

