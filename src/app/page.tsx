'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Gift,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Phone,
  Navigation,
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
  standardProducts?: string
}

export default function HomePage() {
  const [spas, setSpas] = useState<SpaItem[]>([])
  const [skus, setSkus] = useState<SkuItem[]>([])
  const [selectedWard, setSelectedWard] = useState<string>('ALL')
  const [isLoading, setIsLoading] = useState(true)

  const wards = [
    { id: 'ALL', name: 'Toàn Quận Cầu Giấy' },
    { id: 'Dịch Vọng', name: 'Dịch Vọng' },
    { id: 'Dịch Vọng Hậu', name: 'Dịch Vọng Hậu (Duy Tân)' },
    { id: 'Trung Hòa', name: 'Trung Hòa (Hoàng Đạo Thúy)' },
    { id: 'Yên Hòa', name: 'Yên Hòa (Vũ Phạm Hàm)' },
    { id: 'Nghĩa Tân', name: 'Nghĩa Tân (Tô Hiệu)' },
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
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Chương Trình Pilot 90 Ngày — Cụm 15 Spa Quận Cầu Giấy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Mạng lưới spa nhỏ chuẩn hóa:
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-orange-300 bg-clip-text text-transparent">
              Giá rõ trước • Quy trình chuẩn • Đặt lịch qua Zalo
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Không sợ chèo kéo mua thẻ. Không sợ mập mờ giá. Chỉ cần nhắn 1 Zalo duy nhất, chúng tôi điều phối ghế trống
            gần bạn nhất với chất lượng dịch vụ đã kiểm định SOP.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={zaloHubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-rose-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Nhắn Zalo Đặt Lịch Ngay (Phản hồi &lt; 5p)</span>
            </a>

            <Link
              href="#bang-gia"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-sm font-medium border border-stone-700 transition-all"
            >
              Xem Bảng Giá Niêm Yết
            </Link>
          </div>

          {/* 3 Cam kết cốt lõi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-stone-800/40 border border-stone-700/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-stone-100">1 Bảng Giá Niêm Yết</p>
                <p className="text-[11px] text-stone-400">Đúng giá công bố, hoàn tiền nếu spa phụ thu sai cam kết.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/40 border border-stone-700/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-stone-100">1 Quy Trình SOP Chuẩn</p>
                <p className="text-[11px] text-stone-400">Thời lượng chuẩn, sản phẩm kiểm định, không chèo kéo bán hàng.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/40 border border-stone-700/60 flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-stone-100">1 Đầu Mối Zalo &lt; 5 Phút</p>
                <p className="text-[11px] text-stone-400">Nhắn 1 đầu mối, điều phối ghế trống ngay, có lịch trong 20 phút.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BẢNG GIÁ 3 SKU */}
      <section id="bang-gia" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-rose-600">Minh Bạch Tuyệt Đối</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Bảng Giá 3 Gói Dịch Vụ Niêm Yết</h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Áp dụng đồng nhất tại toàn bộ 15 spa đối tác được cấp chứng nhận trong Quận Cầu Giấy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skus.map((sku, index) => (
            <div
              key={sku.id}
              className={`relative rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                index === 2
                  ? 'bg-gradient-to-b from-rose-50 to-orange-50/40 border-rose-300 shadow-md ring-1 ring-rose-300'
                  : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              {index === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[11px] font-bold py-0.5 px-3 rounded-full uppercase tracking-wider shadow">
                  Gói Được Yêu Thích Nhất
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">{sku.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Thời lượng chuẩn: {sku.durationMinutes} phút</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">
                    {sku.pricePhase1.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    {sku.pricePhase2.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.5 rounded">
                    Giá Pilot
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{sku.description}</p>

                {sku.standardProducts && (
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] space-y-1">
                    <p className="font-semibold text-stone-700">Dòng sản phẩm kiểm định:</p>
                    <p className="text-stone-500">{sku.standardProducts}</p>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <a
                  href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    index === 2
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow shadow-rose-600/30'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Đặt Lịch Gói Này</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DANH SÁCH 15 SPA ĐỐI TÁC TẠI CẦU GIẤY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-4 h-4" />
              <span>GlowBeautyPass Cách Bạn 400m - 1.2km</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">15 Điểm Spa Trong Mạng Lưới (Cầu Giấy)</h2>
          </div>

          {/* Bộ lọc theo Phường */}
          <div className="flex flex-wrap items-center gap-1.5">
            {wards.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWard(w.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedWard === w.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-stone-500 text-sm">Đang tải danh sách spa...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {spas.map((spa) => (
              <div
                key={spa.id}
                className="rounded-2xl bg-white border border-stone-200/90 hover:border-rose-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top: Distance badge & Tier */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <MapPin className="w-3 h-3" />
                      {spa.formattedDistance || 'Gần bạn'}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                        spa.tier === 'CERTIFIED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : spa.tier === 'VERIFIED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {spa.tier}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-rose-600 transition-colors">
                      {spa.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{spa.address}</span>
                    </p>
                  </div>

                  {/* Rating & Giờ mở cửa */}
                  <div className="flex items-center gap-3 text-xs text-stone-600 pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{spa.rating}</span>
                      <span className="text-stone-400 font-normal">({spa.reviewCount})</span>
                    </div>
                    <span className="text-stone-300">•</span>
                    <div className="flex items-center gap-1 text-stone-500 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{spa.openHours}</span>
                    </div>
                  </div>

                  {/* Ưu đãi độc quyền riêng của điểm */}
                  {spa.exclusiveOffer && (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/70 text-[11px] text-rose-800 flex items-start gap-2">
                      <Gift className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Ưu đãi riêng của điểm: </span>
                        <span>{spa.exclusiveOffer}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nút hành động */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-rose-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-rose-300" />
                    <span>Nhắn Zalo Đặt Chỗ</span>
                  </a>

                  <Link
                    href={`/spa/${spa.slug}`}
                    className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs flex items-center justify-center transition-all"
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
