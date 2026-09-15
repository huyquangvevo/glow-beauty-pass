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
  CheckCircle2,
  MessageCircle,
  Camera,
  Info,
  Leaf,
  BadgePercent,
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

interface SkuPhotoSpec {
  image: string
  photoSpec: string
  photoHint: string
  shortBenefit: string
  pills: string[]
}

const SKU_PHOTO_SPECS: Record<number, SkuPhotoSpec> = {
  0: {
    image: '/banners/banner_herbal_wash.jpg',
    photoSpec: 'Ảnh 4:3 (600x450px)',
    photoHint: 'Cận cảnh vòi sen xối nước ấm, bọt bồ kết & làn tóc thư giãn',
    shortBenefit: 'Làn nước thảo dược ấm xoa dịu căng thẳng, sạch sâu da đầu sau ngày làm việc.',
    pills: ['Bồ kết cô đặc', 'Massage 15p', 'Sấy tạo kiểu'],
  },
  1: {
    image: '/spas/spa_thumb_1.jpg',
    photoSpec: 'Ảnh 4:3 (600x450px)',
    photoHint: 'Khách thư giãn ủ kem collagen, kỹ thuật viên bấm huyệt đầu',
    shortBenefit: 'Chăm sóc da đầu chuyên sâu, 100% mỹ phẩm chuẩn công khai, tóc mềm mượt.',
    pills: ['Ủ tóc collagen', 'Bấm huyệt thái dương', 'Trà thảo mộc'],
  },
  2: {
    image: '/banners/banner_neck_massage.jpg',
    photoSpec: 'Ảnh 4:3 (600x450px)',
    photoHint: 'Chườm đá nóng ngải cứu / massage đả thông kinh lạc cổ vai gáy',
    shortBenefit: 'Giải phóng cơn đau nhức cổ vai gáy do ngồi máy tính nhiều với tinh dầu ấm.',
    pills: ['Đá nóng ngải cứu', 'Đả thông kinh lạc', 'Xông thảo dược'],
  },
}

const VISUAL_CATEGORIES = [
  {
    id: 'cat-1',
    title: 'Gội Đầu Dưỡng Sinh',
    image: '/banners/banner_herbal_wash.jpg',
    anchor: '#goi-dich-vu',
  },
  {
    id: 'cat-2',
    title: 'Trị Liệu Cổ Vai Gáy',
    image: '/banners/banner_neck_massage.jpg',
    anchor: '#goi-dich-vu',
  },
  {
    id: 'cat-3',
    title: 'Thải Độc & Phục Hồi',
    image: '/spas/spa_thumb_1.jpg',
    anchor: '#goi-dich-vu',
  },
  {
    id: 'cat-4',
    title: 'Không Gian & Combo',
    image: '/banners/banner_spa_ambiance.jpg',
    anchor: '#danh-sach-spa',
  },
]

const SOP_PROOF_CARDS = [
  {
    id: 'sop-1',
    title: 'Mỹ Phẩm Niêm Yết Công Khai',
    desc: 'Dầu gội bồ kết & thảo dược có tem kiểm định, 100% không dùng hóa chất trôi nổi.',
    image: '/spas/spa_thumb_2.jpg',
    photoSpec: 'Ảnh 4:3 (400x300px)',
    photoHint: 'Chai dầu gội thảo dược & tinh dầu có nhãn mác niêm yết rõ ràng',
  },
  {
    id: 'sop-2',
    title: 'Khăn Hấp & Dụng Cụ Tiệt Trùng',
    desc: 'Mỗi khách 1 bộ khăn tiệt trùng nhiệt độ cao và lược chải riêng biệt 100%.',
    image: '/spas/spa_thumb_3.jpg',
    photoSpec: 'Ảnh 4:3 (400x300px)',
    photoHint: 'Tủ sấy tiệt trùng khăn & bộ lược gội sạch ngăn nắp',
  },
  {
    id: 'sop-3',
    title: 'Kỹ Thuật Viên Chuẩn SOP',
    desc: 'Thực hiện đủ thời lượng, đúng quy trình, tuyệt đối không chèo kéo mua thẻ gói.',
    image: '/spas/spa_thumb_4.jpg',
    photoSpec: 'Ảnh 4:3 (400x300px)',
    photoHint: 'Kỹ thuật viên thao tác chuyên nghiệp trong đồng phục spa',
  },
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

      {/* 2. DỊCH VỤ NỔI BẬT (Visual Category Grid - Phong cách a.SENSE Ảnh 2: Đơn giản, ít chữ, thu hút) */}
      <section className="space-y-3.5 scroll-mt-20">
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-base sm:text-xl font-bold text-stone-900 tracking-tight whitespace-nowrap">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <a
            href="#goi-dich-vu"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-[#236B38] hover:text-[#174823] transition-colors shrink-0 whitespace-nowrap"
          >
            <span>04 Liệu trình tuyển chọn</span>
            <span className="text-stone-400 group-hover:text-[#236B38] group-hover:translate-x-0.5 transition-transform text-xs">→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {VISUAL_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={cat.anchor}
              className="group relative aspect-[4/5] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block bg-stone-900"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Subtle bottom gradient for clean text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Bottom Content: Minimalist, centered title only (Chuẩn a.SENSE) */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 z-10 text-center">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug group-hover:text-emerald-200 transition-colors drop-shadow-xs">
                  {cat.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. DỊCH VỤ NỔI BẬT (Chuẩn a.SENSE: Tối giản chữ tuyệt đối, chỉ có tên + ảnh + viên giá + nút đặt lịch) */}
      <section id="goi-dich-vu" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Dịch Vụ Nổi Bật
          </h2>
          <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Đồng giá tại 15 Spa Cầu Giấy</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {skus.map((sku, index) => {
            const isPopular = index === 1
            const pkgKey = index === 0 ? 'pkg1' : index === 1 ? 'pkg2' : 'pkg3'
            const localizedName = tServices.has(`${pkgKey}.name` as any) ? tServices(`${pkgKey}.name` as any) : sku.name
            const spec = SKU_PHOTO_SPECS[index] || SKU_PHOTO_SPECS[0]

            const discountPercent =
              sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1
                ? Math.round(((sku.pricePhase2 - sku.pricePhase1) / sku.pricePhase2) * 100)
                : 0

            return (
              <div
                key={sku.id}
                className={`relative p-3.5 sm:p-4 rounded-3xl transition-all duration-300 flex flex-col justify-between bg-white ${
                  isPopular
                    ? 'border-2 border-[#236B38] shadow-[0_8px_30px_rgba(35,107,56,0.12)] ring-1 ring-[#236B38]/20'
                    : 'border border-stone-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-lg'
                }`}
              >
                <div className="space-y-3">
                  {/* Top: Title & Recommended Tag */}
                  <div className="flex items-center justify-between gap-2 px-1 min-h-[26px]">
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-snug">
                      {localizedName}
                    </h3>
                    {isPopular && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B4D20] bg-emerald-50 border border-emerald-300/80 px-2 py-0.5 rounded-md shadow-2xs">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                        Được chọn nhiều nhất
                      </span>
                    )}
                  </div>

                  {/* Visual Image Frame with Dual-tone Floating Price Pill (Chuẩn a.SENSE) */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 group/img shadow-inner">
                    <Image
                      src={spec.image}
                      alt={localizedName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {discountPercent > 0 && (
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}

                    {/* DUAL-TONE FLOATING PRICE PILL (Chính xác như a.SENSE) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-stretch rounded-full overflow-hidden shadow-lg border border-white/60 whitespace-nowrap">
                      <div className="bg-[#236B38] text-white font-black text-sm sm:text-base px-3.5 py-1.5 flex items-center tracking-tight">
                        {sku.pricePhase1.toLocaleString('vi-VN')}đ
                      </div>
                      <div className="bg-white/95 backdrop-blur-xs text-stone-800 text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{sku.durationMinutes} {tServices('durationUnit')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area: Clean Rounded-Full Button (Chuẩn a.SENSE) */}
                <div className="pt-3 mt-3">
                  <a
                    href={zaloHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 sm:py-3 px-4 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] active:bg-[#164723] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Image
                      src="/brand/Logo-Zalo-App-Rec.webp"
                      alt="Zalo"
                      width={18}
                      height={18}
                      className="w-4 h-4 rounded-xs shrink-0 object-contain"
                    />
                    <span>Đặt lịch ngay</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. VÌ SAO NÊN CHỌN GLOW BEAUTY PASS (Chuẩn Anti-AI / Taste-Skill: Typographic Proof Metrics & Hairline Dividers) */}
      <section className="py-8 sm:py-12 border-y border-stone-200/70">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-1 px-2">
            <h2 className="text-lg sm:text-2xl font-bold text-stone-900 tracking-tight">
              Vì Sao Nên Chọn Glow Beauty Pass
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Tiêu chuẩn dịch vụ minh bạch, đồng nhất trên toàn hệ thống 15 spa Cầu Giấy
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200/70 pt-2 border-t border-stone-200/50 md:border-t-0">
            {/* Stat 1 */}
            <div className="p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left group">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#236B38] tracking-tight">
                15+
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 mt-2">
                Spa Kiểm Định
              </h3>
              <p className="text-[11.5px] text-stone-500 mt-1 leading-relaxed">
                Thẩm định cơ sở & tay nghề KTV khắt khe
              </p>
            </div>

            {/* Stat 2 */}
            <div className="p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left group">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#236B38] tracking-tight">
                49K
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 mt-2">
                Đồng Giá Chuẩn
              </h3>
              <p className="text-[11.5px] text-stone-500 mt-1 leading-relaxed">
                Cam kết 100% không phát sinh phụ thu
              </p>
            </div>

            {/* Stat 3 */}
            <div className="p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left group">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#236B38] tracking-tight">
                100%
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 mt-2">
                Thảo Dược Sạch
              </h3>
              <p className="text-[11.5px] text-stone-500 mt-1 leading-relaxed">
                Bồ kết nấu tươi & tinh dầu chuẩn nguồn gốc
              </p>
            </div>

            {/* Stat 4 */}
            <div className="p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left group">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#236B38] tracking-tight">
                0đ
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 mt-2">
                Đặt Lịch Không Cọc
              </h3>
              <p className="text-[11.5px] text-stone-500 mt-1 leading-relaxed">
                Giữ chỗ qua Zalo 30s, dùng xong mới thanh toán
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPAS NEAR YOU (MOBILE FIRST LISTING & FILTERS) */}
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
