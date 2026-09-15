'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import snapshotData from '@/lib/spas-snapshot.json'

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

  const [spas, setSpas] = useState<SpaCardData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('glow_spas_cache')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch {}
    }
    return (snapshotData.spas as any[]) || []
  })

  const [skus, setSkus] = useState<SkuItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('glow_skus_cache')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch {}
    }
    return (snapshotData.skus as any[]) || []
  })

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
  const [isLoading, setIsLoading] = useState(false)

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
        if (spas.length === 0) {
          setIsLoading(true)
        }
        const params = new URLSearchParams()
        if (userCoords) {
          params.append('lat', userCoords.lat.toString())
          params.append('lon', userCoords.lon.toString())
        }
        const res = await fetch(`/api/spas?${params.toString()}`)
        const data = await res.json()
        if (data.spas && data.spas.length > 0) {
          setSpas(data.spas)
          if (data.skus && data.skus.length > 0) {
            setSkus(data.skus)
          }
          try {
            sessionStorage.setItem('glow_spas_cache', JSON.stringify(data.spas))
            if (data.skus) {
              sessionStorage.setItem('glow_skus_cache', JSON.stringify(data.skus))
            }
          } catch {}
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

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0359178342'

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-7 sm:space-y-10 pb-16">
      {/* 1. VISUAL HERO BANNER CAROUSEL */}
      <section className="w-full">
        <HeroBannerCarousel />
      </section>

      {/* 2. 3 GÓI DỊCH VỤ NIÊM YẾT (Clean Service Menu) */}
      <section id="goi-dich-vu" className="space-y-3.5 scroll-mt-20">
        <div className="px-1">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            {tServices('heading')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {tServices('subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {skus.map((sku, index) => {
            const isPopular = index === 1
            const pkgKey = index === 0 ? 'pkg1' : index === 1 ? 'pkg2' : 'pkg3'
            const localizedName = tServices.has(`${pkgKey}.name` as any) ? tServices(`${pkgKey}.name` as any) : sku.name

            const bullet1 = tServices.has(`${pkgKey}.f1` as any) ? tServices(`${pkgKey}.f1` as any) : ''
            const bullet2 = tServices.has(`${pkgKey}.f2` as any) ? tServices(`${pkgKey}.f2` as any) : ''
            const bullet3 = tServices.has(`${pkgKey}.f3` as any) ? tServices(`${pkgKey}.f3` as any) : ''
            const highlights = [bullet1, bullet2, bullet3].filter(Boolean)
            const discountPercent =
              sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1
                ? Math.round(((sku.pricePhase2 - sku.pricePhase1) / sku.pricePhase2) * 100)
                : 0

            return (
              <div
                key={sku.id}
                className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between bg-white ${
                  isPopular
                    ? 'border-2 border-[#236B38] shadow-[0_8px_30px_rgba(35,107,56,0.12)] ring-1 ring-[#236B38]/20'
                    : 'border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  {/* Package Top: Title, Duration & Recommended Tag */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-[18px] text-stone-900 tracking-tight leading-snug">
                        {localizedName}
                      </h3>
                      {isPopular && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B4D20] bg-emerald-50 border border-emerald-300/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                          Được chọn nhiều nhất
                        </span>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium bg-stone-100/80 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>Thời lượng {sku.durationMinutes} {tServices('durationUnit')}</span>
                    </div>
                  </div>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-2 pt-2 border-t border-stone-100">
                    <span className="text-2xl sm:text-[28px] font-bold text-[#1B4D20] tracking-tight">
                      {sku.pricePhase1.toLocaleString('vi-VN')}đ
                    </span>
                    {sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1 && (
                      <span className="text-xs text-stone-400 line-through font-normal">
                        {sku.pricePhase2.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-md">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Highlights Bullet List (Clean Checkmarks) */}
                  {highlights.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {highlights.map((h: string, idx: number) => (
                        <div key={idx} className="text-xs sm:text-[13px] text-stone-600 flex items-start gap-2.5 leading-relaxed">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
                          </div>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Area: Large, High-Touch Zalo CTA Button */}
                <div className="pt-4 mt-5 border-t border-stone-100 space-y-2">
                  <a
                    href={zaloHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#236B38] hover:bg-[#1D5A2E] active:bg-[#164723] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Image
                      src="/brand/Logo-Zalo-App-Rec.webp"
                      alt="Zalo"
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-xs shrink-0 object-contain"
                    />
                    <span>Đặt lịch Zalo</span>
                  </a>

                  <p className="text-center text-[11px] text-stone-400 font-normal">
                    Đúng giá niêm yết · Không cần đặt cọc
                  </p>
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
            <h2 className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#17231A] truncate">
              {tSpaNetwork('heading')}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 truncate">
              {tSpaNetwork('spasFoundCauGiay', { count: filteredAndSortedSpas.length })}
              {locationLabel && locationLabel !== 'Bật vị trí' && ` · ${tSpaNetwork('nearLocation', { location: locationLabel })}`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white rounded-xl border border-stone-200 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#236B38] text-white font-bold shadow-xs'
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
                    ? 'bg-[#236B38] text-white font-bold shadow-xs'
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
                className="flex items-center gap-1 text-[11px] font-bold text-[#236B38] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-full border border-emerald-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <MapPin className="w-3 h-3 text-amber-600" />
                <span className="hidden xs:inline">{tSpaNetwork('enableLocation')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Active search filter badge (Slim inline pill) */}
        {searchQuery && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#1B4D20] shadow-2xs self-start w-fit">
            <span>
              {tCommon('searchResultsFor')} &ldquo;<strong className="font-bold text-[#236B38]">{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 hover:bg-emerald-200/60 rounded-full cursor-pointer ml-1 text-[#236B38]"
              aria-label={tCommon('clear')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MOBILE-FIRST STREAMLINED FILTER BAR */}
        <div className="space-y-2.5 pt-0.5">
          {/* Row 1: Ward Filter Chips (Horizontal Scroll with Counts & Distance) */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
              {tSpaNetwork('areaLabel')}
            </span>

            {/* ALL Chip */}
            <button
              type="button"
              onClick={() => setSelectedWard('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                selectedWard === 'ALL'
                  ? 'bg-[#236B38] text-white border-[#236B38] shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-[#F5F7F4] border-stone-200'
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
                      ? 'bg-[#236B38] text-white border-[#236B38] shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-[#F5F7F4] border-stone-200'
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
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
              {tSpaNetwork('filterSortLabel')}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full px-2.5 py-1 text-xs shrink-0 shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-stone-700 outline-none cursor-pointer pr-1"
              >
                <option value="nearest">{tSpaNetwork('sortNearest')}</option>
                <option value="rating">{tSpaNetwork('sortRating')}</option>
                <option value="reviews">{tSpaNetwork('sortReviews')}</option>
              </select>
            </div>

            {/* Quick Toggle Chips */}
            <button
              type="button"
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer shadow-2xs ${
                openNowOnly
                  ? 'bg-emerald-50 text-[#1B4D20] border-[#236B38]'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${openNowOnly ? 'bg-[#236B38]' : 'bg-stone-300'}`} />
              <span>{tSpaNetwork('filterOpenNow')}</span>
              {openNowOnly && <Check className="w-3 h-3 text-[#236B38]" />}
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
              <span>{tSpaNetwork('filterTopRated')}</span>
              {topRatedOnly && <Check className="w-3 h-3 text-amber-600" />}
            </button>

            <button
              type="button"
              onClick={() => setDeal49kOnly(!deal49kOnly)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer shadow-2xs ${
                deal49kOnly
                  ? 'bg-emerald-50 text-[#1B4D20] border-[#236B38]'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <span>{tSpaNetwork('filterDeal49k')}</span>
              {deal49kOnly && <Check className="w-3 h-3 text-[#236B38]" />}
            </button>

            {/* Clear Filters Button if any active */}
            {(selectedWard !== 'ALL' || openNowOnly || topRatedOnly || deal49kOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedWard('ALL')
                  setOpenNowOnly(false)
                  setTopRatedOnly(false)
                  setDeal49kOnly(false)
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 shrink-0 transition-colors cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
                <span>{tSpaNetwork('clearFilter')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Spa List Rendering */}
        {isLoading ? (
          <div className="py-16 text-center text-sm text-[#5B6B58]">
            {tCommon('loadingSpas')}
          </div>
        ) : paginatedSpas.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-[#DDE4D9] text-sm text-[#5B6B58] space-y-2">
            <div>{tSpaNetwork('noSpasFilterMatch')}</div>
            <button
              type="button"
              onClick={() => {
                setSelectedWard('ALL')
                setOpenNowOnly(false)
                setTopRatedOnly(false)
                setDeal49kOnly(false)
                setSearchQuery('')
              }}
              className="text-xs font-bold text-[#40813D] hover:underline cursor-pointer"
            >
              {tSpaNetwork('resetFilters')}
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
                {tSpaNetwork('showingCount', { current: paginatedSpas.length, total: filteredAndSortedSpas.length })}
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
