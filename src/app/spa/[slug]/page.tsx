'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Gift,
  ArrowLeft,
  MessageCircle,
  Phone,
  CheckCircle2,
} from 'lucide-react'

export default function SpaDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [spa, setSpa] = useState<any>(null)
  const [skus, setSkus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSpa() {
      try {
        setLoading(true)
        const res = await fetch(`/api/spas/${slug}`)
        const data = await res.json()
        if (data.spa) {
          setSpa(data.spa)
          setSkus(data.skus || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (slug) loadSpa()
  }, [slug])

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#5B6B58] flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-[#236B38] border-t-transparent rounded-full animate-spin" />
        <span>Đang tải thông tin spa</span>
      </div>
    )
  }

  if (!spa) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-[#5B6B58] text-sm">Không tìm thấy thông tin spa này.</p>
        <Link href="/" className="text-[#236B38] font-bold text-sm underline">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-20">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5B6B58] hover:text-[#093E06] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Danh sách 15 spa Cầu Giấy</span>
      </Link>

      {/* SPA HEADER CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E9E4] shadow-xs space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-[#E8F5E9] text-[#093E06] border border-emerald-200">
              glow beauty pass • {spa.tier}
            </span>
            <span className="text-xs sm:text-sm text-[#236B38] font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Đúng giá 100%</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#093E06] tracking-tight leading-tight">
            {spa.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#5B6B58] flex items-start gap-1.5 leading-relaxed">
            <MapPin className="w-4 h-4 text-[#236B38] shrink-0 mt-0.5" />
            <span>{spa.address}</span>
          </p>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-[#5B6B58] pt-1">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-[#093E06] font-extrabold">{spa.rating}</span>
              <span className="text-[#5B6B58] font-normal text-xs">({spa.reviewCount} đánh giá)</span>
            </div>
            <span className="text-stone-300">•</span>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{spa.openHours}</span>
            </div>
          </div>
        </div>

        {/* Ưu đãi độc quyền */}
        {spa.exclusiveOffer && (
          <div className="p-3.5 rounded-2xl bg-amber-50 text-xs sm:text-sm text-amber-900 border border-amber-200/80 flex items-start gap-2.5">
            <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold">Ưu đãi điểm: </strong>
              {spa.exclusiveOffer}
            </p>
          </div>
        )}

        {/* Action Buttons Top */}
        <div className="pt-1 flex items-center gap-2.5">
          <a
            href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Đặt lịch Zalo</span>
          </a>

          <a
            href={`tel:${spa.phone}`}
            className="py-3 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-stone-600" />
            <span>Hotline</span>
          </a>
        </div>
      </div>

      {/* 3 SKU MENU */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold uppercase tracking-wider text-[#093E06] px-1">
          3 Gói Dịch Vụ Niêm Yết
        </h2>

        <div className="space-y-3.5">
          {skus.map((sku) => {
            const discountPercent = sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1
              ? Math.round(((sku.pricePhase2 - sku.pricePhase1) / sku.pricePhase2) * 100)
              : null

            return (
              <div
                key={sku.id}
                className="p-4.5 sm:p-5 rounded-2xl bg-white border border-[#D5E7D8] shadow-xs space-y-3 hover:border-[#40813D]/60 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="font-black text-base sm:text-[17px] text-[#234E21] leading-snug">
                      {sku.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#5B6B58] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#40813D]" />
                      <span>Thời lượng: <strong className="text-[#234E21]">{sku.durationMinutes} phút</strong></span>
                    </div>
                  </div>

                  {/* High-Impact Prominent Price Badge */}
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
                    <span className="text-[10px] font-extrabold text-[#40813D] mt-1">
                      Đồng giá • Không phụ thu
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-[#4E5C4C] leading-relaxed bg-[#F9FCF9] p-3 rounded-xl border border-[#E8F2E8]">
                  {sku.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100 gap-2">
                  <span className="text-xs text-[#40813D] font-bold">
                    ✓ Cam kết chuẩn SOP
                  </span>
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}%20tại%20${encodeURIComponent(spa.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4.5 py-2.5 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white font-bold text-xs sm:text-sm shadow-sm shadow-[#40813D]/25 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Đặt gói này</span>
                    <span className="opacity-90 font-extrabold">• {sku.pricePhase1.toLocaleString('vi-VN')}đ</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E9E4] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#093E06] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#236B38]" />
            <span>Đánh Giá Khách Hàng</span>
          </h3>
        </div>

        {spa.reviews && spa.reviews.length > 0 ? (
          <div className="space-y-3 divide-y divide-stone-100">
            {spa.reviews.map((r: any) => (
              <div key={r.id} className="pt-3 space-y-1 first:pt-0">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-[#093E06]">{r.customerName || r.customerPhone}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#5B6B58] leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5B6B58]">Chưa có đánh giá nào cho điểm spa này.</p>
        )}
      </div>

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-2.5 sm:hidden shadow-xs">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <a
            href={`tel:${spa.phone}`}
            className="p-2.5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center shrink-0"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>

          <a
            href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-full bg-[#40813D] hover:bg-[#356F32] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Đặt chỗ qua Zalo (&lt; 5p)</span>
          </a>
        </div>
      </div>
    </div>
  )
}
