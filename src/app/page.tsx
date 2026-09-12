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
} from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { useSearch } from '@/context/SearchContext'

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
  }, [selectedWard])

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-7 pb-24">
      {/* 1. HERO SECTION: TO RÕ, THOÁNG ĐÃNG, NỔI BẬT THƯƠNG HIỆU */}
      <section className="bg-gradient-to-b from-white via-[#F7FAF7] to-white rounded-3xl p-5 sm:p-6 border border-[#D5E7D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#40813D]">
            <span className="w-2 h-2 rounded-full bg-[#40813D] animate-pulse"></span>
            <span>15 Spa Tuyển Chọn • Q. Cầu Giấy</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#40813D] px-2.5 py-0.5 rounded-full bg-[#EBF4EA] border border-[#B7DDB5] shrink-0 shadow-2xs">
            Pilot 90 Ngày
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#234E21] tracking-tight leading-snug">
            Gội Thư Giãn & Trị Liệu Chuẩn SOP
          </h1>
          <p className="text-xs sm:text-sm text-[#4E5C4C] leading-relaxed">
            Mạng lưới spa kiểm định độc lập tại Cầu Giấy: Giá niêm yết rõ trước, cam kết không chèo kéo, xác nhận lịch qua Zalo trong 5 phút.
          </p>
        </div>

        {/* 3 Core Pillars: Bento format */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="py-2.5 px-1.5 rounded-2xl bg-white border border-[#D5E7D8] text-[#234E21] shadow-2xs flex flex-col items-center justify-center">
            <span className="text-xs font-bold leading-tight">Đúng giá 100%</span>
            <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">Không phụ thu</span>
          </div>
          <div className="py-2.5 px-1.5 rounded-2xl bg-white border border-[#D5E7D8] text-[#234E21] shadow-2xs flex flex-col items-center justify-center">
            <span className="text-xs font-bold leading-tight">Không chèo kéo</span>
            <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">Quy trình SOP</span>
          </div>
          <div className="py-2.5 px-1.5 rounded-2xl bg-white border border-[#D5E7D8] text-[#234E21] shadow-2xs flex flex-col items-center justify-center">
            <span className="text-xs font-bold leading-tight">Phản hồi 5 phút</span>
            <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">Xác nhận Zalo</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-1.5">
          <a
            href={zaloHubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#356F32] to-[#40813D] hover:from-[#2E602C] hover:to-[#356F32] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#40813D]/30 active:scale-98 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-emerald-100" />
            <span>Nhắn Zalo Đặt Lịch Ngay</span>
          </a>
        </div>
      </section>

      {/* 2. BẢNG GIÁ 3 GÓI NIÊM YẾT */}
      <section id="bang-gia" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-[#234E21]">
            3 Gói Dịch Vụ Niêm Yết
          </h2>
          <span className="text-xs text-[#5B6B58] font-semibold">Đồng giá tại cả 15 spa</span>
        </div>

        <div className="space-y-3">
          {skus.map((sku) => {
            const isPopular = sku.code === 'GOI_DUONG_SINH'
            return (
              <div
                key={sku.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all space-y-3 ${
                  isPopular
                    ? 'border-2 border-[#40813D] shadow-md ring-2 ring-[#40813D]/15'
                    : 'border-[#DCE8DE] shadow-xs'
                }`}
              >
                {/* Header: Title + Popular Badge + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base text-[#234E21] leading-snug">
                        {sku.name}
                      </h3>
                      {isPopular && (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#40813D] text-white shadow-2xs shrink-0">
                          Phổ biến nhất
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5B6B58] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#40813D]" />
                      <span>{sku.durationMinutes} phút</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg sm:text-xl text-[#234E21] block leading-none">
                      {sku.pricePhase1.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[11px] text-[#5B6B58] block mt-1">Đồng giá toàn quận</span>
                  </div>
                </div>

                {/* Description without truncation or line-clamp */}
                <p className="text-xs sm:text-[13px] text-[#4E5C4C] leading-relaxed">
                  {sku.description}
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 gap-2">
                  <span className="text-xs font-bold text-[#40813D] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cam kết chuẩn SOP</span>
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-xs"
                  >
                    Đặt lịch gói này
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. MẠNG LƯỚI 15 SPA (To rõ, thoáng đãng) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-[#234E21]">
              Điểm Spa Gần Bạn
            </h2>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              {spas.length} spa đạt tiêu chuẩn kiểm định tại Cầu Giấy
            </p>
          </div>
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
                      ({spa.reviewCount} đánh giá thật)
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

                {/* Action Row */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-stone-100">
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] text-white text-xs sm:text-sm font-bold text-center transition-all active:scale-98 shadow-xs"
                  >
                    Đặt lịch Zalo
                  </a>

                  <Link
                    href={`/spa/${spa.slug}`}
                    className="py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-all"
                  >
                    Chi tiết
                  </Link>
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
