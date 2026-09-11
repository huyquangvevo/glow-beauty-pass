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

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#093E06] leading-tight">
            glow beauty pass
          </h1>
          <p className="text-sm text-[#5B6B58] leading-relaxed">
            Mạng lưới spa nhỏ đạt chuẩn: Giá niêm yết rõ trước, quy trình SOP kiểm định, đặt lịch qua Zalo trong 5 phút.
          </p>
        </div>

        {/* 3 Core Pillars - Clean Pills */}
        <div className="flex items-center gap-2 pt-1 text-xs text-[#093E06] font-semibold overflow-x-auto no-scrollbar">
          <span className="px-3 py-1.5 rounded-full bg-[#E8F5E9] whitespace-nowrap">
            ✓ Đúng giá niêm yết
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#E8F5E9] whitespace-nowrap">
            ✓ Không chèo kéo
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#E8F5E9] whitespace-nowrap">
            ✓ Phản hồi &lt; 5p
          </span>
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

        <div className="space-y-2.5">
          {skus.map((sku) => {
            const isPopular = sku.code === 'GOI_DUONG_SINH'
            return (
              <div
                key={sku.id}
                className={`p-4.5 rounded-2xl bg-white border transition-all flex items-center justify-between gap-3 ${
                  isPopular
                    ? 'border-[#236B38] shadow-xs'
                    : 'border-[#E5E9E4]'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#093E06] truncate">
                      {sku.name}
                    </h3>
                    {isPopular && (
                      <span className="text-[10.5px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#236B38] shrink-0">
                        Phổ biến
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#5B6B58] line-clamp-1 leading-normal">
                    {sku.description}
                  </p>
                  <p className="text-xs text-[#5B6B58] flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#236B38]" />
                    <span>Thời lượng: {sku.durationMinutes} phút</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="font-black text-lg sm:text-xl text-[#093E06]">
                    {sku.pricePhase1.toLocaleString('vi-VN')}đ
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
                  >
                    Đặt lịch
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

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-4 px-4">
          {wards.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWard(w.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all border shrink-0 ${
                selectedWard === w.id
                  ? 'bg-[#236B38] text-white border-[#236B38] font-bold shadow-xs'
                  : 'bg-white text-[#5B6B58] hover:bg-stone-50 border-[#E5E9E4] font-medium'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* Spa List */}
        {isLoading ? (
          <div className="py-10 text-center text-sm text-[#5B6B58]">
            Đang tải danh sách spa...
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
                  <div className="min-w-0">
                    <Link href={`/spa/${spa.slug}`}>
                      <h3 className="font-bold text-base sm:text-[17px] leading-snug tracking-tight text-[#093E06] hover:text-[#236B38] transition-colors truncate">
                        {spa.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-[#5B6B58] mt-1 line-clamp-1">
                      {spa.address}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#093E06] shrink-0 border border-emerald-200">
                    {spa.formattedDistance || 'Gần bạn'}
                  </span>
                </div>

                {/* Rating & Exclusive Offer */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-[#5B6B58]">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-[#093E06] text-sm font-extrabold">{spa.rating}</span>
                    <span className="text-[#5B6B58] font-normal text-xs">
                      ({spa.reviewCount} đánh giá)
                    </span>
                  </div>

                  {spa.exclusiveOffer && (
                    <span className="text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg truncate max-w-[210px] font-medium">
                      🎁 {spa.exclusiveOffer}
                    </span>
                  )}
                </div>

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
