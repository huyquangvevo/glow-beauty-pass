'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Sparkles, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { formatDistanceKm, getOpeningStatus } from '@/lib/formatters'

export interface SpaCardData {
  id: string
  name: string
  slug: string
  address: string
  ward: string
  phone: string
  openHours: string
  rating: number
  reviewCount: number
  tier: string
  imageUrl?: string
  exclusiveOffer?: string
  formattedDistance?: string
  distanceKm?: number
}

export function NearbySpaCard({
  spa,
  fallbackImage,
  zaloHubLink,
}: {
  spa: SpaCardData
  fallbackImage: string
  zaloHubLink: string
}) {
  const tSpaNetwork = useTranslations('SpaNetwork')
  const tServices = useTranslations('Services')
  const tCommon = useTranslations('Common')

  const [imgSrc, setImgSrc] = useState(spa.imageUrl || fallbackImage)
  const openingStatus = getOpeningStatus(spa.openHours)
  const distanceText = formatDistanceKm(spa.distanceKm)
  const href = `/spa/${spa.slug}`

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] bg-white border border-[#E5E9E4] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group">
      {/* 1. Image Banner Block (Aspect ratio 298/150 like tuoi-fe) */}
      <Link
        href={href}
        className="group/img relative aspect-[298/150] w-full shrink-0 overflow-hidden bg-stone-100 block"
      >
        <Image
          src={imgSrc}
          alt={spa.name}
          fill
          className="object-cover transition-transform duration-500 group-hover/img:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          quality={85}
          onError={() => setImgSrc(fallbackImage)}
        />

        {/* Top-Left SOP Tag */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-bold text-[#234E21] shadow-xs border border-white/60">
            <Sparkles className="w-3 h-3 text-[#40813D]" />
            <span>{tSpaNetwork('sopStandard')}</span>
          </span>
        </div>

        {/* Top-Right Distance Tag */}
        {distanceText && (
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#40813D]/90 backdrop-blur-xs text-white px-2.5 py-0.5 text-[11px] font-bold shadow-xs">
              <MapPin className="w-3 h-3" />
              <span>{distanceText}</span>
            </span>
          </div>
        )}
      </Link>

      {/* 2. Content Info & Best Deal Box */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between gap-2.5">
        <div className="flex flex-col gap-1.5">
          {/* Spa Name */}
          <Link href={href} className="group/title block">
            <h3 className="truncate text-[15px] sm:text-[16px] font-bold tracking-tight text-[#093E06] group-hover/title:text-[#40813D] transition-colors">
              {spa.name}
            </h3>
          </Link>

          {/* Meta Row: Rating | Review Count · Distance */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] leading-tight text-[#5B6B58]">
            <span className="flex items-center gap-1 font-bold text-[#093E06] shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{Number(spa.rating || 4.8).toFixed(1)}</span>
            </span>

            <span className="text-[#9BA898] font-normal shrink-0">|</span>

            <span className="text-[#5B6B58] shrink-0">
              ({spa.reviewCount || 128} {tCommon('reviews')})
            </span>

            <span className="text-[#9BA898] font-normal shrink-0">·</span>

            {/* Opening Status Dot */}
            <div className="flex items-center gap-1 shrink-0">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  openingStatus.isOpen ? 'bg-[#40813D]' : 'bg-amber-500'
                }`}
              />
              <span
                className={`font-medium ${
                  openingStatus.isOpen ? 'text-[#40813D]' : 'text-amber-600'
                }`}
              >
                {openingStatus.isOpen ? tSpaNetwork('filterOpenNow') : tSpaNetwork('filterClosed')}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1 text-[12px] text-[#5B6B58] truncate">
            <MapPin className="w-3 h-3 text-[#9BA898] shrink-0" />
            <span className="truncate">{spa.address}</span>
          </div>

          {/* Exclusive Offer Badge (if any) */}
          {spa.exclusiveOffer && (
            <div className="mt-0.5 text-[11.5px] text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg font-medium leading-snug line-clamp-1">
              ✨ {spa.exclusiveOffer}
            </div>
          )}
        </div>

        {/* 3. Tuoi-fe Signature Deal Box at bottom (bg-[#DDE4D9]) */}
        <div className="mt-auto pt-1">
          <Link
            href={href}
            className="flex flex-col justify-center rounded-xl bg-[#DDE4D9]/80 p-2.5 sm:p-3 transition-all duration-200 hover:bg-[#DDE4D9] group/deal"
          >
            <div className="text-[12.5px] font-semibold text-[#093E06] line-clamp-1 group-hover/deal:text-[#184515]">
              {tServices('pkg1.name')}
            </div>
            <div className="flex items-baseline flex-wrap gap-2 mt-1">
              <span className="text-[15px] sm:text-[16px] font-extrabold text-[#093E06]">
                49.000 đ
              </span>
              <span className="text-[12px] font-medium text-[#7D8E7B] line-through">
                179.000 đ
              </span>
              <span className="shrink-0 rounded-md bg-[#FCEDEA] px-1.5 py-0.5 text-[10.5px] leading-none font-bold text-[#C0392B]">
                -72%
              </span>
            </div>
          </Link>
        </div>

        {/* 4. Action Row: View Details & Quick Book */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Link
            href={href}
            className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold text-center transition-colors"
          >
            {tSpaNetwork('viewDetails')}
          </Link>
          <a
            href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(
              spa.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-[#40813D] hover:bg-[#356F32] active:bg-[#2E602C] text-white text-xs font-bold text-center transition-all shadow-xs"
          >
            {tSpaNetwork('bookSlot')}
          </a>
        </div>
      </div>
    </div>
  )
}
