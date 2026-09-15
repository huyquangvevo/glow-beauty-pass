'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Star, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { formatDistanceKm, getOpeningStatus } from '@/lib/formatters'
import type { SpaCardData } from './NearbySpaCard'

export function NearbySpaMobileCard({
  spa,
  fallbackImage,
}: {
  spa: SpaCardData
  fallbackImage: string
}) {
  const tSpaNetwork = useTranslations('SpaNetwork')
  const tCommon = useTranslations('Common')

  const [imgSrc, setImgSrc] = useState(spa.imageUrl || fallbackImage)
  const openingStatus = getOpeningStatus(spa.openHours)
  const distanceText = formatDistanceKm(spa.distanceKm)
  const href = `/spa/${spa.slug}`

  return (
    <Link
      href={href}
      className="group flex items-center h-[96px] w-full gap-3 rounded-[16px] bg-white p-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] active:scale-[0.99] border border-[#E5E9E4] overflow-hidden transition-all"
    >
      {/* Thumbnail bên trái (Chuẩn xác 74x74 px, nền #F5F7F4) */}
      <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[12px] bg-[#F5F7F4] aspect-square">
        <Image
          src={imgSrc}
          alt={spa.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="74px"
          quality={85}
          onError={() => setImgSrc(fallbackImage)}
        />
      </div>

      {/* Thông tin bên phải (Cao chuẩn 74px tương xứng với ảnh, gồm 3 dòng tinh gọn) */}
      <div className="flex flex-1 h-[74px] flex-col justify-between min-w-0 py-0.5">
        {/* Tên Spa: 1 dòng ellipsis */}
        <h3 className="truncate text-[14.5px] leading-[18px] font-bold tracking-tight text-stone-900 group-hover:text-[#2E6B30] transition-colors">
          {spa.name}
        </h3>

        {/* Dòng meta: Rating | Review Count · Distance · Opening */}
        <div className="flex flex-wrap items-center gap-1 text-[12px] leading-[13px] text-stone-500 truncate">
          {/* Rating */}
          <span className="flex items-center gap-0.5 font-bold text-stone-900 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0 -mt-0.5" />
            <span>{Number(spa.rating || 4.8).toFixed(1)}</span>
          </span>

          <span className="text-[#9BA898] font-normal shrink-0">|</span>

          {/* Reviews */}
          <span className="text-[#5B6B58] shrink-0">
            ({spa.reviewCount || 128} {tCommon('reviews')})
          </span>

          {/* Distance */}
          {distanceText && (
            <>
              <span className="text-stone-300 font-normal shrink-0">·</span>
              <span className="font-medium text-[#236B38] shrink-0 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span>{distanceText}</span>
              </span>
            </>
          )}

          {/* Opening Status */}
          <span className="text-stone-300 font-normal shrink-0">·</span>
          <span
            className={`font-medium shrink-0 ${
              openingStatus.isOpen ? 'text-[#236B38]' : 'text-amber-600'
            }`}
          >
            {openingStatus.isOpen ? tSpaNetwork('filterOpenNow') : tSpaNetwork('filterClosed')}
          </span>
        </div>

        {/* Dòng Giá: Tinh tế, thanh lịch */}
        <div className="flex items-baseline flex-wrap gap-1.5 min-w-0">
          <span className="text-[14.5px] leading-[18px] font-bold text-[#1B4D20]">
            Từ 49.000đ
          </span>
          <span className="text-[11.5px] font-normal text-stone-400 line-through shrink-0">
            179.000đ
          </span>
        </div>
      </div>
    </Link>
  )
}
