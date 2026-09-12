'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Sparkles,
  Search,
  X,
  Tag,
} from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel'
import { useSearch } from '@/context/SearchContext'
import { useLocation } from '@/context/LocationContext'

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
  const [spas, setSpas] = useState<SpaItem[]>([])
  const [skus, setSkus] = useState<SkuItem[]>([])
  const [selectedWard, setSelectedWard] = useState<string>('ALL')
  const { searchQuery, setSearchQuery } = useSearch()
  const { userCoords, openPrompt } = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  const wards = [
    { id: 'ALL', name: 'Tất cả' },
    { id: 'Dịch Vọng', name: 'Dịch Vọng' },
    { id: 'Dịch Vọng Hậu', name: 'Duy Tân' },
    { id: 'Trung Hòa', name: 'Hoàng Đạo Thúy' },
    { id: 'Yên Hòa', name: 'Vũ Phạm Hàm' },
    { id: 'Nghĩa Tân', name: 'Tô Hiệu' },
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

      {/* 2. BẢNG GIÁ 3 GÓI DỊCH VỤ NIÊM YẾT (Nổi Bật Mức Giá Hấp Dẫn) */}
      <section id="bang-gia" className="space-y-3.5 scroll-mt-20">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wide text-[#234E21]">
                3 Gói Dịch Vụ Niêm Yết
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#40813D] text-white shadow-2xs">
                Chỉ từ 49K
              </span>
            </div>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              Đồng giá tại tất cả 15 spa đối tác • Cam kết 100% không phụ thu
            </p>
          </div>
          <span className="text-xs font-bold text-[#40813D] bg-[#EBF4EA] px-2.5 py-1 rounded-full border border-[#B7DDB5] shrink-0">
            Đồng giá 15 spa
          </span>
        </div>

        <div className="space-y-3.5">
          {skus.map((sku, index) => {
            const isPopular = index === 0 // Gói gội thư giãn 49k
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
                        {sku.name}
                      </h3>
                      {isPopular && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs shrink-0 tracking-wider">
                          HOT NHẤT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5B6B58] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#40813D]" />
                      <span>Thời lượng: <strong className="text-[#234E21]">{sku.durationMinutes} phút</strong></span>
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
                      Đồng giá • Không phụ thu
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[#4E5C4C] leading-relaxed bg-[#F9FCF9] p-3 rounded-xl border border-[#E8F2E8]">
                  {sku.description}
                </p>

                {/* Action Row with Clear Price on CTA Button */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 gap-2">
                  <span className="text-xs font-bold text-[#40813D] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cam kết chuẩn SOP</span>
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4.5 py-2.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm shadow-[#40813D]/25 flex items-center gap-1.5"
                  >
                    <span>Đặt lịch</span>
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
                Điểm Spa Gần Bạn
              </h2>
              {userCoords ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#236B38] border border-emerald-200 shadow-2xs">
                  GPS chính xác
                </span>
              ) : null}
            </div>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              {spas.length} spa đạt tiêu chuẩn kiểm định tại Cầu Giấy
            </p>
          </div>

          {!userCoords && (
            <button
              onClick={openPrompt}
              className="flex items-center gap-1 text-xs font-bold text-[#40813D] bg-[#EBF4EA] hover:bg-[#DCF0DA] px-2.5 py-1 rounded-full border border-[#B7DDB5] transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Bật vị trí</span>
            </button>
          )}
        </div>

        {/* Active search filter badge (if user typed in header search) */}
        {searchQuery && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#EBF4EA] border border-[#B7DDB5] text-xs text-[#234E21] shadow-2xs">
            <span>
              Kết quả tìm kiếm cho: &ldquo;<strong className="font-bold text-[#40813D]">{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#40813D] hover:text-[#356F32] flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-[#B7DDB5] shadow-2xs"
              aria-label="Xoá tìm kiếm"
            >
              <span>Xoá</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Chips: Clean wrapping grid without horizontal scrolling */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {wards.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWard(w.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                selectedWard === w.id
                  ? 'bg-[#40813D] text-white border-[#40813D] shadow-xs'
                  : 'bg-white text-[#4E5C4C] hover:bg-[#F7FAF7] border-[#D5E7D8]'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* Spa List */}
        {isLoading ? (
          <div className="py-10 text-center text-sm text-[#5B6B58]">
            Đang tải danh sách spa
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

          return displaySpas.length === 0 ? (
            <div className="py-10 text-center bg-white rounded-2xl border border-[#DCE8DE] text-sm text-[#5B6B58]">
              Không tìm thấy spa phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="space-y-3">
              {displaySpas.map((spa) => (
              <div
                key={spa.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCE8DE] hover:border-[#40813D]/60 shadow-xs space-y-3 transition-all"
              >
                {/* Header: Name + Distance Badge */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <Link href={`/spa/${spa.slug}`}>
                      <h3 className="font-extrabold text-base sm:text-[17px] leading-snug tracking-tight text-[#234E21] hover:text-[#40813D] transition-colors">
                        {spa.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-[#5B6B58] mt-1 leading-relaxed">
                      {spa.address}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EBF4EA] text-[#40813D] shrink-0 border border-[#B7DDB5]">
                    {spa.formattedDistance || 'Gần bạn'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-[#093E06] text-sm font-extrabold">{spa.rating}</span>
                    <span className="text-[#5B6B58] font-normal text-xs">
                      ({spa.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Exclusive Offer without truncation */}
                {spa.exclusiveOffer && (
                  <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200/70 px-3 py-2 rounded-xl font-medium leading-snug flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold shrink-0">Ưu đãi:</span>
                    <span>{spa.exclusiveOffer}</span>
                  </div>
                )}

                {/* Price Guarantee & Action Row */}
                <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-xs text-[#2E682A]">
                    <Tag className="w-3.5 h-3.5 text-[#40813D] shrink-0" />
                    <span className="font-bold">Đồng giá từ <strong className="text-sm font-black text-[#1E5C23]">49K</strong></span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/spa/${spa.slug}`}
                      className="py-2 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
                    >
                      Chi tiết
                    </Link>
                    <a
                      href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white text-xs font-bold text-center transition-all active:scale-95 shadow-xs"
                    >
                      Đặt Zalo
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
