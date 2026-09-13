'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Clock,
  Star,
  Sparkles,
  X,
  Tag,
} from 'lucide-react'
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel'
import { useSearch } from '@/context/SearchContext'
import { useLocation } from '@/context/LocationContext'
import { useTranslations } from 'next-intl'

interface SpaItem {
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

interface SkuItem {
  id: string
  name: string
  code: string
  durationMinutes: number
  pricePhase1: number
  pricePhase2: number
  description: string
}

export default function HomePage() {
  const tCommon = useTranslations('Common')
  const tServices = useTranslations('Services')
  const tSpaNetwork = useTranslations('SpaNetwork')
  const tWards = useTranslations('Wards')

  const [spas, setSpas] = useState<SpaItem[]>([])
  const [skus, setSkus] = useState<SkuItem[]>([])
  const [selectedWard, setSelectedWard] = useState<string>('ALL')
  const { searchQuery, setSearchQuery } = useSearch()
  const { userCoords, openPrompt } = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  const wardKeys = [
    'ALL',
    'Dịch Vọng',
    'Dịch Vọng Hậu',
    'Trung Hòa',
    'Yên Hòa',
    'Nghĩa Tân',
  ]

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (selectedWard !== 'ALL') {
          params.append('ward', selectedWard)
        }
        if (userCoords) {
          params.append('lat', userCoords.lat.toString())
          params.append('lon', userCoords.lon.toString())
        }
        const res = await fetch(`/api/spas?${params.toString()}`)
        const data = await res.json()
        if (data.spas) {
          setSpas(data.spas)
          setSkus(data.skus || [])
        }
      } catch (err) {
        console.error('Failed to load spas:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [selectedWard, userCoords])

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4 py-5 space-y-7 pb-12">
      {/* 1. VISUAL HERO BANNER CAROUSEL (Lifestyle Photography & Promo) */}
      <section className="w-full">
        <HeroBannerCarousel />
      </section>

      {/* 2. 3 GÓI DỊCH VỤ NIÊM YẾT (Đồng Giá Toàn Hệ Thống) */}
      <section id="goi-dich-vu" className="space-y-3.5 scroll-mt-20">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wide text-[#234E21]">
                {tServices('heading')}
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#40813D] text-white shadow-2xs">
                {tServices('priceTag')}
              </span>
            </div>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              {tServices('subheading')}
            </p>
          </div>
          <span className="text-xs font-bold text-[#40813D] bg-[#EBF4EA] px-2.5 py-1 rounded-full border border-[#B7DDB5] shrink-0">
            {tServices('fixedBadge')}
          </span>
        </div>

        <div className="space-y-3.5">
          {skus.map((sku, index) => {
            const isPopular = index === 0
            const pkgKey = index === 0 ? 'pkg1' : index === 1 ? 'pkg2' : 'pkg3'
            const localizedName = tServices.has(`${pkgKey}.name` as any) ? tServices(`${pkgKey}.name` as any) : sku.name
            const localizedDesc = tServices.has(`${pkgKey}.desc` as any) ? tServices(`${pkgKey}.desc` as any) : sku.description
            const localizedBadge = tServices.has(`${pkgKey}.badge` as any) ? tServices(`${pkgKey}.badge` as any) : null

            const discountPercent = sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1
              ? Math.round(((sku.pricePhase2 - sku.pricePhase1) / sku.pricePhase2) * 100)
              : null

            return (
              <div
                key={sku.id}
                className={`p-4.5 sm:p-5 rounded-2xl bg-white border transition-all space-y-3.5 relative ${
                  isPopular
                    ? 'border-[#40813D] ring-2 ring-[#40813D]/20 shadow-md shadow-[#40813D]/5'
                    : 'border-[#D5E7D8] shadow-xs hover:border-[#40813D]/60'
                }`}
              >
                {/* Package Header with Ultra-Prominent Price Block */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-base sm:text-[17px] text-[#234E21] leading-snug">
                        {localizedName}
                      </h3>
                      {localizedBadge && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs shrink-0 tracking-wider">
                          {localizedBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5B6B58] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#40813D]" />
                      <span>
                        {tCommon('duration')}{' '}
                        <strong className="text-[#234E21]">
                          {sku.durationMinutes} {tCommon('minutes')}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* HIGH-IMPACT PROMINENT PRICE BADGE */}
                  <div className="shrink-0 flex flex-col items-end">
                    <div className="bg-gradient-to-br from-[#EBF6EA] to-[#DCF0DA] px-3.5 py-2 rounded-2xl border border-[#A4D5A1] shadow-2xs flex flex-col items-end text-right">
                      {sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1 && (
                        <div className="flex items-center gap-1 leading-none mb-1">
                          <span className="text-[11px] font-semibold text-stone-400 line-through">
                            {sku.pricePhase2.toLocaleString('vi-VN')}đ
                          </span>
                          {discountPercent && (
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-200/80 px-1.5 py-0.2 rounded-md">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-baseline leading-none">
                        <span className="font-black text-2xl sm:text-[27px] text-[#1E5C23] tracking-tight">
                          {sku.pricePhase1.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-sm font-black text-[#2E7234] ml-0.5">đ</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#40813D] mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#40813D] animate-pulse"></span>
                      {tCommon('noSurcharge')}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[#4E5C4C] leading-relaxed bg-[#F9FCF9] p-3 rounded-xl border border-[#E8F2E8]">
                  {localizedDesc}
                </p>

                {/* Action Row with Clear Price on CTA Button */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 gap-2">
                  <span className="text-xs font-bold text-[#40813D] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{tCommon('sopCommitment')}</span>
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4.5 py-2.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm shadow-[#40813D]/25 flex items-center gap-1.5"
                  >
                    <span>{tCommon('bookNow')}</span>
                    <span className="opacity-90 font-extrabold">• {sku.pricePhase1.toLocaleString('vi-VN')}đ</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. MẠNG LƯỚI 15 SPA (To rõ, thoáng đãng) */}
      <section id="danh-sach-spa" className="space-y-3.5 scroll-mt-20">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-[#234E21]">
                {tSpaNetwork('heading')}
              </h2>
              {userCoords ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#236B38] border border-emerald-200 shadow-2xs">
                  {tSpaNetwork('gpsActive')}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              {tSpaNetwork('spasFoundCauGiay', { count: spas.length })}
            </p>
          </div>

          {!userCoords && (
            <button
              onClick={openPrompt}
              className="flex items-center gap-1 text-xs font-bold text-[#40813D] bg-[#EBF4EA] hover:bg-[#DCF0DA] px-2.5 py-1 rounded-full border border-[#B7DDB5] transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{tSpaNetwork('enableLocation')}</span>
            </button>
          )}
        </div>

        {/* Active search filter badge (if user typed in header search) */}
        {searchQuery && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#EBF4EA] border border-[#B7DDB5] text-xs text-[#234E21] shadow-2xs">
            <span>
              {tCommon('searchResultsFor')} &ldquo;<strong className="font-bold text-[#40813D]">{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#40813D] hover:text-[#356F32] flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-[#B7DDB5] shadow-2xs"
              aria-label={tCommon('clear')}
            >
              <span>{tCommon('clear')}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Chips: Clean wrapping grid without horizontal scrolling */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {wardKeys.map((wardKey) => {
            const label = tWards.has(wardKey as any) ? tWards(wardKey as any) : wardKey
            return (
              <button
                key={wardKey}
                onClick={() => setSelectedWard(wardKey)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                  selectedWard === wardKey
                    ? 'bg-[#40813D] text-white border-[#40813D] shadow-xs'
                    : 'bg-white text-[#4E5C4C] hover:bg-[#F7FAF7] border-[#D5E7D8]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Spa List */}
        {isLoading ? (
          <div className="py-10 text-center text-sm text-[#5B6B58]">
            {tCommon('loadingSpas')}
          </div>
        ) : (() => {
          const displaySpas = spas.filter((spa) => {
            if (!searchQuery.trim()) return true
            const q = searchQuery.toLowerCase()
            return (
              spa.name.toLowerCase().includes(q) ||
              spa.address.toLowerCase().includes(q) ||
              spa.ward.toLowerCase().includes(q)
            )
          })

          if (displaySpas.length === 0) {
            return (
              <div className="py-10 text-center bg-white rounded-2xl border border-[#DCE8DE] text-sm text-[#5B6B58]">
                {tCommon('noSpasFound')} &ldquo;{searchQuery}&rdquo;.
              </div>
            )
          }

          const spaThumbnails = [
            '/spas/spa_thumb_1.jpg',
            '/spas/spa_thumb_2.jpg',
            '/spas/spa_thumb_3.jpg',
            '/spas/spa_thumb_4.jpg',
            '/spas/spa_thumb_5.jpg',
          ]

          return (
            <div className="space-y-3">
              {displaySpas.map((spa, index) => (
                <div
                  key={spa.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCE8DE] hover:border-[#40813D]/60 shadow-xs space-y-3 transition-all"
                >
                  {/* Upper: Thumbnail + Info */}
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <Link
                      href={`/spa/${spa.slug}`}
                      className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200/80 shadow-2xs group"
                    >
                      <Image
                        src={spa.imageUrl || spaThumbnails[index % spaThumbnails.length]}
                        alt={spa.name}
                        fill
                        sizes="88px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Header: Name + Distance Badge */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <Link href={`/spa/${spa.slug}`} className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-[15px] sm:text-[16px] leading-snug tracking-tight text-[#234E21] hover:text-[#40813D] transition-colors truncate">
                            {spa.name}
                          </h3>
                        </Link>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EBF4EA] text-[#40813D] shrink-0 border border-[#B7DDB5]">
                          {spa.formattedDistance || tCommon('nearYou')}
                        </span>
                      </div>

                      <p className="text-xs text-[#5B6B58] line-clamp-1 leading-normal">
                        {spa.address}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 text-xs pt-0.5">
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-[#093E06] font-extrabold text-xs">{spa.rating}</span>
                          <span className="text-[#5B6B58] font-normal text-[11px]">
                            ({spa.reviewCount} {tCommon('reviews')})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exclusive Offer without truncation */}
                  {spa.exclusiveOffer && (
                    <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200/70 px-3 py-2 rounded-xl font-medium leading-snug flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">{tSpaNetwork('exclusiveOffer')}</span>
                      <span>{spa.exclusiveOffer}</span>
                    </div>
                  )}

                  {/* Price Guarantee & Action Row */}
                  <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs text-[#2E682A]">
                      <Tag className="w-3.5 h-3.5 text-[#40813D] shrink-0" />
                      <span className="font-bold">{tCommon('priceFrom49k')}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/spa/${spa.slug}`}
                        className="py-2 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
                      >
                        {tCommon('viewDetails')}
                      </Link>
                      <a
                        href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white text-xs font-bold text-center transition-all active:scale-95 shadow-xs"
                      >
                        {tCommon('bookZalo')}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </section>
    </div>
  )
}
