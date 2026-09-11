'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import { BrandIcon, BrandWordmark } from '@/components/BrandLogo'

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
      {/* 1. HERO SECTION: TO RÕ, THOÁNG ĐÃNG */}
      <section className="bg-white rounded-3xl p-6 border border-[#E5E9E4] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#236B38]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#236B38]"></span>
          <span>15 Spa Tuyển Chọn • Quận Cầu Giấy</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="sr-only">glow beauty pass</h1>
              <BrandWordmark className="h-8 text-[#093E06]" />
            </div>
            <span className="text-xs font-bold text-[#236B38] px-3 py-1 rounded-full bg-[#E8F5E9] border border-emerald-200">
              Pilot 90 Ngày
            </span>
          </div>
          <p className="text-sm text-[#5B6B58] leading-relaxed">
            Mạng lưới spa nhỏ đạt chuẩn: Giá niêm yết rõ trước, quy trình SOP kiểm định, đặt lịch qua Zalo trong 5 phút.
          </p>
        </div>

        {/* 3 Core Pillars: Grid layout with zero horizontal scroll */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="py-2 px-1 rounded-2xl bg-[#E8F5E9] text-[#093E06] flex flex-col items-center justify-center">
            <span className="text-xs font-bold leading-tight">Đúng giá 100%</span>
            <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">Không phát sinh</span>
          </div>
          <div className="py-2 px-1 rounded-2xl bg-[#E8F5E9] text-[#093E06] flex flex-col items-center justify-center">
            <span className="text-xs font-bold leading-tight">Không chèo kéo</span>
            <span className="text-[10px] text-[#5B6B58] mt-0.5 font-medium">Quy trình SOP</span>
          </div>
          <div className="py-2 px-1 rounded-2xl bg-[#E8F5E9] text-[#093E06] flex flex-col items-center justify-center">
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
            className="w-full py-3 px-5 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-emerald-200" />
            <span>Nhắn Zalo Đặt Lịch Ngay</span>
          </a>
        </div>
      </section>

      {/* 2. BẢNG GIÁ 3 GÓI NIÊM YẾT */}
      <section id="bang-gia" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-[#093E06]">
            3 Gói Dịch Vụ Niêm Yết
          </h2>
          <span className="text-xs text-[#5B6B58] font-medium">Đồng giá tại cả 15 spa</span>
        </div>

        <div className="space-y-3">
          {skus.map((sku) => {
            const isPopular = sku.code === 'GOI_DUONG_SINH'
            return (
              <div
                key={sku.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all space-y-3 ${
                  isPopular
                    ? 'border-[#236B38] shadow-xs ring-1 ring-[#236B38]/15'
                    : 'border-[#E5E9E4]'
                }`}
              >
                {/* Header: Title + Popular Badge + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-[#093E06] leading-snug">
                        {sku.name}
                      </h3>
                      {isPopular && (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#236B38] shrink-0">
                          Phổ biến nhất
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5B6B58] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#236B38]" />
                      <span>{sku.durationMinutes} phút</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg sm:text-xl text-[#093E06] block leading-none">
                      {sku.pricePhase1.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[11px] text-[#5B6B58] block mt-1">Đồng giá toàn quận</span>
                  </div>
                </div>

                {/* Description without truncation or line-clamp */}
                <p className="text-xs sm:text-[13px] text-[#5B6B58] leading-relaxed">
                  {sku.description}
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 gap-2">
                  <span className="text-xs font-semibold text-[#236B38] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cam kết chuẩn SOP</span>
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-xs"
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
            <h2 className="text-base font-extrabold uppercase tracking-wider text-[#093E06]">
              Điểm Spa Gần Bạn
            </h2>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              {spas.length} spa đạt tiêu chuẩn kiểm định tại Cầu Giấy
            </p>
          </div>
        </div>

        {/* Filter Chips: Clean wrapping grid without horizontal scrolling */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {wards.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWard(w.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                selectedWard === w.id
                  ? 'bg-[#236B38] text-white border-[#236B38] shadow-xs'
                  : 'bg-white text-[#5B6B58] hover:bg-stone-50 border-[#E5E9E4]'
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
        ) : spas.length === 0 ? (
          <div className="py-10 text-center bg-white rounded-2xl border border-[#E5E9E4] text-sm text-[#5B6B58]">
            Không tìm thấy spa trong khu vực này.
          </div>
        ) : (
          <div className="space-y-3">
            {spas.map((spa) => (
              <div
                key={spa.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#236B38]/50 shadow-xs space-y-3 transition-all"
              >
                {/* Header: Name + Distance Badge */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <Link href={`/spa/${spa.slug}`}>
                      <h3 className="font-bold text-base sm:text-[17px] leading-snug tracking-tight text-[#093E06] hover:text-[#236B38] transition-colors">
                        {spa.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-[#5B6B58] mt-1 leading-relaxed">
                      {spa.address}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#093E06] shrink-0 border border-emerald-200">
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
        )}
      </section>
    </div>
  )
}
