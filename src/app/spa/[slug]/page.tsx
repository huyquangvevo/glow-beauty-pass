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
  Calendar,
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
    return <div className="p-12 text-center text-sm text-stone-500">Đang tải thông tin spa...</div>
  }

  if (!spa) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-stone-500 text-sm">Không tìm thấy thông tin spa đối tác này.</p>
        <Link href="/" className="text-rose-600 font-medium text-xs underline">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại mạng lưới spa Cầu Giấy</span>
      </Link>

      {/* SPA HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                  spa.tier === 'CERTIFIED'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : spa.tier === 'VERIFIED'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                GlowBeautyPass {spa.tier}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-emerald-600 font-semibold">Đã ký cam kết giữ đúng giá</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">{spa.name}</h1>

            <p className="text-xs sm:text-sm text-stone-600 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{spa.address}</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm text-amber-900">{spa.rating}</span>
              <span className="text-xs text-stone-400">({spa.reviewCount} đánh giá)</span>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {spa.openHours}
            </div>
          </div>
        </div>

        {/* Ưu đãi độc quyền */}
        {spa.exclusiveOffer && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
            <Gift className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-800 text-sm">Ưu đãi độc quyền của điểm này:</p>
              <p className="text-rose-700 mt-0.5">{spa.exclusiveOffer}</p>
            </div>
          </div>
        )}

        {/* CTA BUTTONS */}
        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Nhắn Zalo Hub Đặt Chỗ Tại Đây (&lt; 5 phút)</span>
          </a>

          <a
            href={`tel:${spa.phone}`}
            className="py-3 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Hotline Spa</span>
          </a>
        </div>
      </div>

      {/* 3 SKU MENU TẠI ĐIỂM */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">Bảng Giá 3 Gói Dịch Vụ Áp Dụng Tại Điểm</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skus.map((sku) => (
            <div key={sku.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">{sku.name}</h3>
                <p className="text-[11px] text-stone-400">{sku.durationMinutes} phút chuẩn</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600">
                  {sku.pricePhase1.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-xs text-stone-400 line-through">
                  {sku.pricePhase2.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{sku.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS ĐÃ XÁC THỰC */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đánh Giá Từ Khách Hàng (Xác Thực SĐT)</span>
          </h3>
          <span className="text-xs text-stone-400">Chống review ảo</span>
        </div>

        {spa.reviews && spa.reviews.length > 0 ? (
          <div className="space-y-3 divide-y divide-stone-100">
            {spa.reviews.map((r: any) => (
              <div key={r.id} className="pt-3 space-y-1.5 first:pt-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{r.customerName || r.customerPhone}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-3">Chưa có đánh giá nào cho spa này.</p>
        )}
      </div>
    </div>
  )
}
