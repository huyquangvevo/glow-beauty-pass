'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Sparkles,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Check,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react'
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel'
import { useSearch } from '@/context/SearchContext'
import { useLocation } from '@/context/LocationContext'
import { useTranslations } from 'next-intl'
import { NearbySpaCard, type SpaCardData } from '@/components/NearbySpaCard'
import { NearbySpaMobileCard } from '@/components/NearbySpaMobileCard'
import { PaginationControls } from '@/components/PaginationControls'
import { getOpeningStatus } from '@/lib/formatters'

interface SkuItem {
  id: string
  name: string
  code: string
  durationMinutes: number
  pricePhase1: number
  pricePhase2: number
  description: string
}

const ITEMS_PER_PAGE = 6

const SPA_THUMBNAILS = [
  '/spas/spa_thumb_1.jpg',
  '/spas/spa_thumb_2.jpg',
  '/spas/spa_thumb_3.jpg',
  '/spas/spa_thumb_4.jpg',
  '/spas/spa_thumb_5.jpg',
]

export default function HomePage() {
  const tCommon = useTranslations('Common')
  const tServices = useTranslations('Services')
  const tSpaNetwork = useTranslations('SpaNetwork')
  const tWards = useTranslations('Wards')

  const [spas, setSpas] = useState<SpaCardData[]>([])
  const [skus, setSkus] = useState<SkuItem[]>([])
  const [selectedWard, setSelectedWard] = useState<string>('ALL')
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false)
  const [topRatedOnly, setTopRatedOnly] = useState<boolean>(false)
  const [deal49kOnly, setDeal49kOnly] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'reviews'>('nearest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showAll, setShowAll] = useState<boolean>(false)

  const { searchQuery, setSearchQuery } = useSearch()
  const { userCoords, openPrompt, locationLabel } = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  // Calculate spa counts per ward / hot area
  const wardCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: spas.length }
    for (const s of spas) {
      const w = s.ward || 'Dịch Vọng'
      counts[w] = (counts[w] || 0) + 1
    }
    return counts
  }, [spas])

  // Sort wards dynamically based on userCoords or spa count
  const sortedWards = useMemo(() => {
    const baseWards = [
      { key: 'Dịch Vọng', street: 'Trần Thái Tông' },
      { key: 'Trung Hòa', street: 'Hoàng Đạo Thúy' },
      { key: 'Yên Hòa', street: 'Vũ Phạm Hàm' },
      { key: 'Dịch Vọng Hậu', street: 'Duy Tân' },
      { key: 'Nghĩa Tân', street: 'Tô Hiệu' },
    ]

    const mapped = baseWards.map((item) => {
      const count = wardCounts[item.key] || 0
      const wardSpas = spas.filter((s) => s.ward === item.key)
      let minDistanceKm: number | null = null
      let formattedDistance = ''
      if (userCoords && wardSpas.length > 0) {
        const validDistances = wardSpas
          .map((s) => s.distanceKm)
          .filter((d): d is number => typeof d === 'number')
        if (validDistances.length > 0) {
          minDistanceKm = Math.min(...validDistances)
          formattedDistance = minDistanceKm < 1 ? `${Math.round(minDistanceKm * 1000)}m` : `${minDistanceKm}km`
        }
      }
      return {
        ...item,
        count,
        minDistanceKm,
        formattedDistance,
      }
    })

    // If userCoords -> nearest first. If not -> most spas first!
    mapped.sort((a, b) => {
      if (userCoords && a.minDistanceKm !== null && b.minDistanceKm !== null) {
        return a.minDistanceKm - b.minDistanceKm
      }
      return b.count - a.count
    })

    return mapped
  }, [spas, wardCounts, userCoords])

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
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
  }, [userCoords])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedWard, openNowOnly, topRatedOnly, deal49kOnly, sortBy, searchQuery])

  // Filter and sort spas (Tuoi-fe style)
  const filteredAndSortedSpas = useMemo(() => {
    let list = [...spas]

    // 1. Text Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.ward.toLowerCase().includes(q)
      )
    }

    // 2. Ward Filter
    if (selectedWard !== 'ALL') {
      list = list.filter((s) => s.ward.toLowerCase().includes(selectedWard.toLowerCase()))
    }

    // 3. Open Now Filter
    if (openNowOnly) {
      list = list.filter((s) => getOpeningStatus(s.openHours).isOpen)
    }

    // 4. Top Rated Filter (>= 4.8)
    if (topRatedOnly) {
      list = list.filter((s) => s.rating >= 4.8)
    }

    // 5. Deal 49K Filter
    if (deal49kOnly) {
      list = list.filter(() => true) // All 15 partner spas support standardized 49K packages
    }

    // 6. Sort
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewCount - a.reviewCount)
    } else {
      // Default: Nearest (distanceKm)
      list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    }

    return list
  }, [spas, searchQuery, selectedWard, openNowOnly, topRatedOnly, deal49kOnly, sortBy])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedSpas.length / ITEMS_PER_PAGE))
  const paginatedSpas = useMemo(() => {
    if (showAll) return filteredAndSortedSpas
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedSpas.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedSpas, currentPage, showAll])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    const el = document.getElementById('danh-sach-spa')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-7 sm:space-y-10 pb-16">
      {/* 1. VISUAL HERO BANNER CAROUSEL */}
      <section className="w-full">
        <HeroBannerCarousel />
      </section>

      {/* 2. 3 GÓI DỊCH VỤ NIÊM YẾT (Đồng Giá Toàn Hệ Thống - Taste Design Upgrade) */}
      <section id="goi-dich-vu" className="space-y-3.5 sm:space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#0B3A08] tracking-tight">
                {tServices('heading')}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1D541B] bg-[#EAF5E9] px-2.5 py-0.5 rounded-full border border-[#B7DDB5]/70 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#356F32]" />
                {tServices('fixedBadge')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6B58] font-medium leading-normal">
              {tServices('subheading')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {skus.map((sku, index) => {
            const isPopular = index === 1 // Gói 2: Gội Toàn Diện Chuẩn Sạch là Hot Nhất
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
                className={`p-4.5 sm:p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between relative group ${
                  isPopular
                    ? 'border-[#356F32] shadow-md shadow-[#356F32]/10 ring-1 ring-[#356F32]/20'
                    : 'border-[#DDE5DC] shadow-xs hover:border-[#356F32]/50 hover:shadow-md'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Package Header: Title, Badge & Price */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-black text-base sm:text-[17px] text-[#0A3C08] tracking-tight leading-snug">
                          {localizedName}
                        </h3>
                        {localizedBadge && (
                          <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-2xs shrink-0 tracking-wider ${
                            index === 1 ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}>
                            {localizedBadge}
                          </span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#5B6B58] font-medium bg-[#F4F8F3] px-2.5 py-0.5 rounded-full border border-[#E0EBE0]">
                        <Clock className="w-3.5 h-3.5 text-[#356F32]" />
                        <span>
                          {sku.durationMinutes} {tCommon('minutes')}
                        </span>
                      </div>
                    </div>

                    {/* Clean Price Display */}
                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-black text-[#1B5E20] leading-none tracking-tight">
                        {sku.pricePhase1.toLocaleString('vi-VN')}đ
                      </div>
                      {sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1 && (
                        <div className="flex items-center justify-end gap-1 mt-1 leading-none">
                          <span className="text-[11px] text-stone-400 line-through font-medium">
                            {sku.pricePhase2.toLocaleString('vi-VN')}đ
                          </span>
                          {discountPercent && (
                            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1 py-0.2 rounded-xs">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#4A5E47] leading-relaxed font-normal">
                    {localizedDesc}
                  </p>

                  {/* Feature Highlights (Micro-bullets for real value!) */}
                  <div className="space-y-1.5 pt-1.5 border-t border-stone-100">
                    {[1, 2, 3].map((fNum) => {
                      const fKey = `${pkgKey}.f${fNum}` as any
                      if (!tServices.has(fKey)) return null
                      return (
                        <div key={fNum} className="flex items-start gap-2 text-xs text-[#3E4F3B] leading-snug">
                          <Check className="w-3.5 h-3.5 text-[#356F32] shrink-0 mt-0.5" />
                          <span>{tServices(fKey)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* CTA Button Row */}
                <div className="pt-3.5 mt-3.5 border-t border-stone-100 flex items-center justify-between gap-2.5">
                  <span className="text-[11px] font-bold text-[#356F32] flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>SOP Chuẩn</span>
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#356F32] to-[#40813D] hover:from-[#2E602C] hover:to-[#356F32] active:scale-95 text-white text-xs sm:text-[13px] font-bold transition-all shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Đặt lịch • {sku.pricePhase1.toLocaleString('vi-VN')}đ</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. SPAS NEAR YOU (MOBILE FIRST LISTING & FILTERS) */}
      <section id="danh-sach-spa" className="space-y-3 scroll-mt-20">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] sm:text-[21px] font-black tracking-tight text-[#093E06] truncate">
              {tSpaNetwork('heading')}
            </h2>
            <p className="text-xs text-[#5B6B58] mt-0.5 truncate">
              {tSpaNetwork('spasFoundCauGiay', { count: filteredAndSortedSpas.length })}
              {locationLabel && locationLabel !== 'Bật vị trí' && ` · Gần ${locationLabel}`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white rounded-xl border border-[#DDE4D9] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#40813D] text-white font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Dạng thẻ lớn"
                aria-label="Xem dạng thẻ lớn"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#40813D] text-white font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Dạng danh sách gọn"
                aria-label="Xem dạng danh sách gọn"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {!userCoords && (
              <button
                onClick={openPrompt}
                className="flex items-center gap-1 text-[11px] font-bold text-[#40813D] bg-[#EBF4EA] hover:bg-[#DCF0DA] px-2.5 py-1.5 rounded-full border border-[#B7DDB5] transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <MapPin className="w-3 h-3 text-amber-600" />
                <span className="hidden xs:inline">{tSpaNetwork('enableLocation')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Active search filter badge (Slim inline pill) */}
        {searchQuery && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EA] border border-[#B7DDB5] text-xs text-[#234E21] shadow-2xs self-start w-fit">
            <span>
              {tCommon('searchResultsFor')} &ldquo;<strong className="font-bold text-[#40813D]">{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 hover:bg-emerald-200/60 rounded-full cursor-pointer ml-1 text-[#40813D]"
              aria-label={tCommon('clear')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MOBILE-FIRST STREAMLINED FILTER BAR */}
        <div className="space-y-2 pt-0.5">
          {/* Row 1: Ward Filter Chips (Horizontal Scroll with Counts & Distance) */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* ALL Chip */}
            <button
              type="button"
              onClick={() => setSelectedWard('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                selectedWard === 'ALL'
                  ? 'bg-[#40813D] text-white border-[#40813D] shadow-2xs'
                  : 'bg-white text-[#5B6B58] hover:bg-[#F5F7F4] border-[#DDE4D9]'
              }`}
            >
              {tWards('ALL')} ({spas.length})
            </button>

            {/* Dynamic Ward & Hot Spot Chips */}
            {sortedWards.map((w) => {
              const label = tWards.has(w.key as any) ? tWards(w.key as any) : w.key
              const isSelected = selectedWard === w.key
              return (
                <button
                  key={w.key}
                  type="button"
                  onClick={() => setSelectedWard(w.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#40813D] text-white border-[#40813D] shadow-2xs'
                      : 'bg-white text-[#5B6B58] hover:bg-[#F5F7F4] border-[#DDE4D9]'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-emerald-100 font-bold' : 'text-stone-400'}`}>
                    ({w.count}{w.formattedDistance ? ` • ${w.formattedDistance}` : ''})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Row 2: Sort Dropdown & Quick Toggle Chips on single horizontal scroll row */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-[#DDE4D9] rounded-full px-2.5 py-1 text-xs shrink-0 shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-stone-700 outline-none cursor-pointer pr-1"
              >
                <option value="nearest">Gần nhất</option>
                <option value="rating">Điểm cao nhất</option>
                <option value="reviews">Nhiều review nhất</option>
              </select>
            </div>

            {/* Quick Toggle Chips */}
            <button
              type="button"
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer shadow-2xs ${
                openNowOnly
                  ? 'bg-emerald-50 text-[#234E21] border-[#40813D]'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${openNowOnly ? 'bg-[#40813D]' : 'bg-stone-300'}`} />
              <span>Đang mở cửa</span>
              {openNowOnly && <Check className="w-3 h-3 text-[#40813D]" />}
            </button>

            <button
              type="button"
              onClick={() => setTopRatedOnly(!topRatedOnly)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer shadow-2xs ${
                topRatedOnly
                  ? 'bg-amber-50 text-amber-900 border-amber-400'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <span>★ 4.8+ sao</span>
              {topRatedOnly && <Check className="w-3 h-3 text-amber-600" />}
            </button>

            <button
              type="button"
              onClick={() => setDeal49kOnly(!deal49kOnly)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer shadow-2xs ${
                deal49kOnly
                  ? 'bg-emerald-50 text-[#234E21] border-[#40813D]'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <span>Gói 49K</span>
              {deal49kOnly && <Check className="w-3 h-3 text-[#40813D]" />}
            </button>
          </div>
        </div>

        {/* Spa List Rendering */}
        {isLoading ? (
          <div className="py-16 text-center text-sm text-[#5B6B58]">
            {tCommon('loadingSpas')}
          </div>
        ) : paginatedSpas.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-[#DDE4D9] text-sm text-[#5B6B58] space-y-2">
            <div>Không tìm thấy spa nào phù hợp với bộ lọc đã chọn.</div>
            <button
              type="button"
              onClick={() => {
                setSelectedWard('ALL')
                setOpenNowOnly(false)
                setTopRatedOnly(false)
                setDeal49kOnly(false)
                setSearchQuery('')
              }}
              className="text-xs font-bold text-[#40813D] hover:underline"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* View Mode: Grid (Desktop Cards) vs List (Mobile Cards) */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
                {paginatedSpas.map((spa, index) => (
                  <NearbySpaCard
                    key={spa.id}
                    spa={spa}
                    fallbackImage={SPA_THUMBNAILS[index % SPA_THUMBNAILS.length]}
                    zaloHubLink={zaloHubLink}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {paginatedSpas.map((spa, index) => (
                  <NearbySpaMobileCard
                    key={spa.id}
                    spa={spa}
                    fallbackImage={SPA_THUMBNAILS[index % SPA_THUMBNAILS.length]}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls & Show All Toggle (Tuoi-fe style) */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#5B6B58] order-2 sm:order-1">
                Hiển thị <strong className="text-[#093E06]">{paginatedSpas.length}</strong> / {filteredAndSortedSpas.length} spa đối tác tại Cầu Giấy
              </div>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                {!showAll && totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}

                {filteredAndSortedSpas.length > ITEMS_PER_PAGE && (
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs font-bold text-[#40813D] hover:text-[#356F32] bg-[#EBF4EA] px-3.5 py-2 rounded-xl border border-[#B7DDB5] transition-colors cursor-pointer shrink-0"
                  >
                    {showAll ? 'Thu gọn phân trang' : `Xem tất cả ${filteredAndSortedSpas.length} spa`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
