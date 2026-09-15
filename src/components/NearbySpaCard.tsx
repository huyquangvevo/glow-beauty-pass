'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Star, MapPin, Sparkles } from 'lucide-react'
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
          <span className="inline-flex items-center rounded-md bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[11px] font-medium text-stone-700 shadow-xs border border-stone-100/80">
            {tSpaNetwork('sopStandard')}
          </span>
        </div>

        {/* Top-Right Distance Tag */}
        {distanceText && (
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/65 backdrop-blur-xs text-white px-2 py-0.5 text-[11px] font-medium shadow-xs">
              <MapPin className="w-3 h-3" />
              <span>{distanceText}</span>
            </span>
          </div>
        )}
      </Link>

      {/* 2. Content Info & Best Deal Box */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-2.5">
        <div className="flex flex-col gap-1.5">
          {/* Spa Name */}
          <Link href={href} className="group/title block">
            <h3 className="truncate text-[16px] font-bold tracking-tight text-stone-900 group-hover/title:text-[#2E6B30] transition-colors">
              {spa.name}
            </h3>
          </Link>

          {/* Meta Row: Rating | Review Count · Distance */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] leading-tight text-stone-500">
            <span className="flex items-center gap-1 font-bold text-stone-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{Number(spa.rating || 4.8).toFixed(1)}</span>
            </span>

            <span className="text-stone-300 font-normal shrink-0">|</span>

            <span className="text-stone-500 shrink-0">
              ({spa.reviewCount || 128} {tCommon('reviews')})
            </span>

            <span className="text-stone-300 font-normal shrink-0">·</span>

            {/* Opening Status */}
            <div className="flex items-center gap-1 shrink-0">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  openingStatus.isOpen ? 'bg-[#236B38]' : 'bg-amber-500'
                }`}
              />
              <span
                className={`font-medium ${
                  openingStatus.isOpen ? 'text-[#236B38]' : 'text-amber-600'
                }`}
              >
                {openingStatus.isOpen ? tSpaNetwork('filterOpenNow') : tSpaNetwork('filterClosed')}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1 text-[12px] text-stone-500 truncate">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{spa.address}</span>
          </div>

          {/* Exclusive Offer Badge (Crisp modern badge, not a puffy yellow pill) */}
          {spa.exclusiveOffer && (
            <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-amber-900 bg-amber-50/70 border border-amber-200/70 px-2 py-0.5 rounded-md line-clamp-1">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500 shrink-0" />
              <span className="truncate">{spa.exclusiveOffer}</span>
            </div>
          )}
        </div>

        {/* 3. Curated Pricing Teaser Box */}
        <div className="mt-auto pt-1">
          <Link
            href={href}
            className="flex flex-col justify-center rounded-xl bg-[#F7F9F6] border border-[#E8ECE6] p-2.5 transition-all duration-200 hover:bg-[#EFF4EE] hover:border-emerald-200 group/deal"
          >
            <div className="text-[12px] font-medium text-stone-600 line-clamp-1">
              {tServices('pkg1.name')} (45p)
            </div>
            <div className="flex items-baseline flex-wrap gap-2 mt-0.5">
              <span className="text-[16px] font-bold text-[#1B4D20]">
                49.000đ
              </span>
              <span className="text-[12px] font-normal text-stone-400 line-through">
                179.000đ
              </span>
            </div>
          </Link>
        </div>

        {/* 4. Action Row: View Details & Quick Book */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Link
            href={href}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold text-center transition-colors active:scale-95"
          >
            {tSpaNetwork('viewDetails')}
          </Link>
          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#236B38] hover:bg-[#1D5A2E] active:bg-[#164723] text-white text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Image
              src="/brand/Logo-Zalo-App-Rec.webp"
              alt="Zalo"
              width={16}
              height={16}
              className="w-4 h-4 rounded-xs shrink-0 object-contain"
            />
            <span>Đặt Zalo</span>
          </a>
        </div>
      </div>
    </div>
  )
}
