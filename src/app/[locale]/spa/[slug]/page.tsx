'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import snapshotData from '@/lib/spas-snapshot.json'
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Gift,
  Phone,
  CheckCircle2,
  ChevronDown,
  Award,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { ZaloIcon } from '@/components/ZaloIcon'
import { useTranslations } from 'next-intl'

function ReviewBreakdownBoard({
  spa,
  travelersChoiceLabel,
  reviewsCountLabel,
}: {
  spa: any
  travelersChoiceLabel: string
  reviewsCountLabel: string
}) {
  const bd = spa.reviewBreakdown || {
    stars5: Math.round((spa.reviewCount || 20) * 0.85),
    stars4: Math.max(1, Math.round((spa.reviewCount || 20) * 0.15)),
    stars3: 0,
    stars2: 0,
    stars1: 0,
  }
  const totalRaw =
    (bd.stars5 || 0) +
    (bd.stars4 || 0) +
    (bd.stars3 || 0) +
    (bd.stars2 || 0) +
    (bd.stars1 || 0)
  const total = totalRaw > 0 ? totalRaw : 1

  const tags =
    Array.isArray(spa.reviewTags) && spa.reviewTags.length > 0
      ? spa.reviewTags
      : ['Kỹ thuật viên tận tâm', 'Không phụ thu', 'Không ép mua thẻ', 'Đúng quy trình SOP']

  return (
    <div className="w-full flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#236B38] bg-[#F9FCF9] shadow-xs">
      {/* Banner */}
      <div className="flex items-center justify-center gap-2 bg-[#236B38] py-2.5 px-3 text-white">
        <Award className="w-4 h-4 text-emerald-200" />
        <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wide">
          {travelersChoiceLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex flex-col items-center pl-1 shrink-0">
            <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#093E06]">
              {Number(spa.rating || 4.9).toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5 mt-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="mt-1 text-[11px] font-semibold text-[#5B6B58]">
              {totalRaw} {reviewsCountLabel}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = bd[`stars${stars}`] || 0
              const pct = Math.round((count / total) * 100)
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 text-right font-bold text-[#5B6B58]">{stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E9E4]">
                    <div
                      className="h-full rounded-full bg-[#236B38]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[11px] font-medium text-stone-500">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-[#E5E9E4] flex flex-wrap gap-1.5">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#093E06] border border-[#D5E7D8] shadow-2xs"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SpaDetailPage() {
  const tSpaDetail = useTranslations('SpaDetail')
  const tServices = useTranslations('Services')
  const tCommon = useTranslations('Common')

  const params = useParams()
  const slug = params?.slug as string

  const initialSpa = useMemo(() => {
    if (!slug) return null
    return (snapshotData.spas as any[]).find((s) => s.slug === slug) || null
  }, [slug])

  const [spa, setSpa] = useState<any>(() => initialSpa)
  const [skus, setSkus] = useState<any[]>(() => (snapshotData.skus as any[]) || [])
  const [loading, setLoading] = useState(() => !initialSpa)

  useEffect(() => {
    if (initialSpa && (!spa || spa.slug !== slug)) {
      setSpa(initialSpa)
      setLoading(false)
    }
  }, [slug, initialSpa])

  useEffect(() => {
    async function loadSpa() {
      try {
        if (!spa) {
          setLoading(true)
        }
        const res = await fetch(`/api/spas/${slug}`)
        const data = await res.json()
        if (data.spa) {
          setSpa(data.spa)
          if (data.skus && data.skus.length > 0) {
            setSkus(data.skus)
          }
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
        <span>{tSpaDetail('loading')}</span>
      </div>
    )
  }

  if (!spa) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-[#5B6B58] text-sm">{tSpaDetail('notFound')}</p>
        <Link href="/" className="text-[#236B38] font-bold text-sm underline">
          {tSpaDetail('backToList')}
        </Link>
      </div>
    )
  }

  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true })
  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const minPrice = useMemo(() => {
    if (skus && skus.length > 0) {
      return Math.min(...skus.map((s) => s.pricePhase1))
    }
    return 49000
  }, [skus])

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  // Build reviews list: priority for curatedReviews, fallback to reviews relation
  const reviewsList =
    Array.isArray(spa.curatedReviews) && spa.curatedReviews.length > 0
      ? spa.curatedReviews
      : Array.isArray(spa.reviews) && spa.reviews.length > 0
      ? spa.reviews.map((r: any) => ({
          id: r.id,
          authorName: r.customerName || r.customerPhone,
          authorInitials: (r.customerName || 'KH').slice(0, 2).toUpperCase(),
          authorMeta: 'Khách hàng Glow',
          body: r.comment,
          stars: r.rating || 5,
          avatarUrl: r.photoUrls ? JSON.parse(r.photoUrls)[0] : undefined,
          googleMapUrl: undefined,
        }))
      : []

  return (
    <div className="max-w-xl sm:max-w-2xl mx-auto px-4 py-5 space-y-6 pb-28 sm:pb-32">
      {/* SPA HEADER CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2EBE2] shadow-xs space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#093E06] border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#236B38]" />
              <span>{tSpaDetail('verifiedPartner')}</span>
            </span>
            <span className="text-xs sm:text-sm text-[#236B38] font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{tSpaDetail('guarantee100')}</span>
            </span>
          </div>

          {spa.imageUrl && (
            <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs">
              <Image
                src={spa.imageUrl}
                alt={spa.name}
                fill
                sizes="(max-width: 640px) 100vw, 672px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-black text-[#093E06] tracking-tight leading-tight">
            {spa.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#5B6B58] flex items-start gap-1.5 leading-relaxed">
            <MapPin className="w-4 h-4 text-[#236B38] shrink-0 mt-0.5" />
            <span>{spa.address}</span>
          </p>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-[#5B6B58] pt-0.5">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-[#093E06] font-extrabold">{spa.rating}</span>
              <span className="text-[#5B6B58] font-normal text-xs">
                ({spa.reviewCount} {tCommon('reviews')})
              </span>
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
              <strong className="font-bold">{tSpaDetail('exclusiveOffer')} </strong>
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
            className="flex-1 py-3 px-4 rounded-2xl bg-[#0068FF] hover:bg-[#0052CC] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md shadow-blue-500/20"
          >
            <ZaloIcon className="w-5 h-5 text-white" />
            <span>{tSpaDetail('bookZalo')}</span>
          </a>

          <a
            href={`tel:${spa.phone}`}
            className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-stone-200/80 active:scale-98 transition-all"
          >
            <Phone className="w-4 h-4 text-stone-700" />
            <span>{tSpaDetail('hotline')}</span>
          </a>
        </div>
      </div>

      {/* 3 SKU MENU - HIGH-IMPACT PROMINENT DISPLAY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#093E06]">
              {tServices('heading')}
            </h2>
            <p className="text-xs text-[#5B6B58] mt-0.5">
              Đồng giá niêm yết toàn mạng lưới • Không phụ thu • Đúng chuẩn quy trình SOP
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#236B38] bg-[#E8F5E9] px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            3 Gói Chuẩn Hoá
          </span>
        </div>

        <div className="space-y-4">
          {skus.map((sku, index) => {
            const pkgKey = index === 0 ? 'pkg1' : index === 1 ? 'pkg2' : 'pkg3'
            const localizedName = tServices.has(`${pkgKey}.name` as any) ? tServices(`${pkgKey}.name` as any) : sku.name
            const localizedDesc = tServices.has(`${pkgKey}.desc` as any) ? tServices(`${pkgKey}.desc` as any) : sku.description

            const isBestSeller = index === 1
            const isEntryDeal = index === 0

            const badgeText = isEntryDeal
              ? tSpaDetail('pkg1Badge')
              : isBestSeller
              ? tSpaDetail('pkg2Badge')
              : tSpaDetail('pkg3Badge')

            const discountPercent =
              sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1
                ? Math.round(((sku.pricePhase2 - sku.pricePhase1) / sku.pricePhase2) * 100)
                : null

            // Steps/features from messages
            const features = [
              tServices.has(`${pkgKey}.f1` as any) ? tServices(`${pkgKey}.f1` as any) : null,
              tServices.has(`${pkgKey}.f2` as any) ? tServices(`${pkgKey}.f2` as any) : null,
              tServices.has(`${pkgKey}.f3` as any) ? tServices(`${pkgKey}.f3` as any) : null,
              tServices.has(`${pkgKey}.f4` as any) ? tServices(`${pkgKey}.f4` as any) : null,
            ].filter(Boolean)

            return (
              <div
                key={sku.id}
                className={`relative rounded-3xl transition-all duration-200 overflow-hidden ${
                  isBestSeller
                    ? 'bg-gradient-to-b from-[#F2F9F3] via-white to-white border-2 border-[#236B38] shadow-md'
                    : 'bg-white border border-[#D5E7D8] shadow-xs hover:border-[#236B38]/60 hover:shadow-sm'
                }`}
              >
                {/* Highlight Badge Ribbon */}
                <div
                  className={`py-1.5 px-4 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-between ${
                    isBestSeller
                      ? 'bg-[#236B38] text-white'
                      : isEntryDeal
                      ? 'bg-amber-100 text-amber-900 border-b border-amber-200'
                      : 'bg-stone-100 text-stone-700 border-b border-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isBestSeller && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                    {isEntryDeal && <span>🔥</span>}
                    {!isBestSeller && !isEntryDeal && <span>👑</span>}
                    {badgeText}
                  </span>
                  <span className="text-[10px] font-bold opacity-90">
                    {tCommon('noSurcharge')}
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="font-black text-base sm:text-lg text-[#0B3B0F] leading-snug">
                        {localizedName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          {sku.durationMinutes} {tCommon('minutes')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          • {tSpaDetail('sopGuaranteed')}
                        </span>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="shrink-0 flex flex-col items-end text-right">
                      {sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1 && (
                        <div className="flex items-center gap-1.5 leading-none mb-1">
                          <span className="text-xs font-semibold text-stone-400 line-through">
                            {sku.pricePhase2.toLocaleString('vi-VN')}đ
                          </span>
                          {discountPercent && (
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-baseline leading-none">
                        <span className="font-black text-2xl sm:text-3xl text-[#1E5C23] tracking-tight">
                          {sku.pricePhase1.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-sm sm:text-base font-black text-[#1E5C23] ml-0.5">đ</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 mt-1">
                        ✓ {tSpaDetail('guarantee100')}
                      </span>
                    </div>
                  </div>

                  {/* Features steps */}
                  {features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {features.map((f: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[#2F4431]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#236B38] shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs sm:text-[13px] text-[#4E5C4C] leading-relaxed bg-[#F8FAF8] p-3 rounded-xl border border-[#E5EFE5]">
                    {localizedDesc}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 gap-3">
                    <span className="text-xs text-stone-500 font-medium">
                      {tSpaDetail('freeCancel')}
                    </span>
                    <a
                      href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20${encodeURIComponent(sku.name)}%20tại%20${encodeURIComponent(spa.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-[#0068FF] hover:bg-[#0052CC] text-white font-black text-xs sm:text-[13px] shadow-xs active:scale-95 transition-all flex items-center gap-2"
                    >
                      <ZaloIcon className="w-4 h-4 text-white" />
                      <span>{tSpaDetail('bookViaZalo')} • {sku.pricePhase1.toLocaleString('vi-VN')}đ</span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* WHAT OUR CUSTOMERS SAY & REVIEWS (Matching luggage-storage) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2EBE2] shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#236B38]" />
            <h2 className="text-base font-black uppercase tracking-wide text-[#093E06]">
              {spa.reviewSectionTitle || tSpaDetail('reviewsTitle')}
            </h2>
          </div>
          <p className="text-xs text-[#5B6B58] mt-1">
            {spa.reviewSectionSubtitle || 'Đánh giá từ trải nghiệm dịch vụ thực tế của khách hàng'}
          </p>
        </div>

        {/* Review Breakdown Board */}
        <ReviewBreakdownBoard
          spa={spa}
          travelersChoiceLabel="★ TOP RATED • ĐÁNH GIÁ CAO"
          reviewsCountLabel={tCommon('reviews')}
        />

        {/* Customer Reviews Cards */}
        {reviewsList.length > 0 ? (
          <div className="space-y-3 pt-2">
            {reviewsList.map((r: any) => (
              <article
                key={r.id}
                className="rounded-2xl border border-[#E5E9E4] bg-[#FDFEFC] p-4 shadow-2xs space-y-2.5 hover:border-[#236B38]/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  {r.avatarUrl?.trim() ? (
                    <img
                      src={r.avatarUrl}
                      alt={r.authorName}
                      className="h-10 w-10 shrink-0 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-xs font-black text-[#093E06] border border-emerald-200">
                      {r.authorInitials?.trim() || (r.authorName ? r.authorName.slice(0, 2).toUpperCase() : 'KH')}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#093E06] truncate">
                        {r.authorName}
                      </h4>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: r.stars || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#5B6B58] mt-0.5">
                      <span>{r.authorMeta || 'Khách hàng Glow'}</span>
                      {r.googleMapUrl && r.googleMapUrl.trim() !== '' && (
                        <>
                          <span className="text-stone-300">•</span>
                          <a
                            href={r.googleMapUrl.startsWith('http') ? r.googleMapUrl : `https://${r.googleMapUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#2271b1] hover:underline font-medium"
                          >
                            <span>Google Maps</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3 w-3 shrink-0">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-[#2C382A] leading-relaxed">
                  {r.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5B6B58] italic py-2">{tSpaDetail('noReviews')}</p>
        )}
      </div>

      {/* REDESIGNED BEAUTIFUL FAQ ACCORDION */}
      {spa.faqs && Array.isArray(spa.faqs) && spa.faqs.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2EBE2] shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center shrink-0 text-[#236B38]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#093E06] tracking-tight">
                {tSpaDetail('faqTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6B58] mt-0.5">
                {tSpaDetail('faqSubtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {spa.faqs.map((faq: any, i: number) => {
              const isOpen = !!openFaqs[i]
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-[#F4F9F4] border-[#A3D6A9] shadow-xs'
                      : 'bg-[#FCFDFC] border-[#E5ECE5] hover:border-[#236B38]/40 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? 'bg-[#236B38] text-white' : 'bg-emerald-100/60 text-[#236B38]'
                        }`}
                      >
                        Q{i + 1}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-[#093E06] leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isOpen ? 'bg-[#236B38] text-white rotate-180' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#DDE7DF]/80">
                      <p className="text-xs sm:text-[13.5px] text-[#344433] leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-[#236B38]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cam kết kiểm định Glow Beauty Pass</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PROMINENT STICKY BOTTOM BAR (MOBILE & DESKTOP) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDE7DF] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] py-2.5 sm:py-3 px-4">
        <div className="max-w-xl sm:max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Price Teaser */}
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 uppercase tracking-wider leading-none">
              {tSpaDetail('fromPrice')}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#1B522B] tracking-tight leading-none">
                {minPrice.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-bold text-[#1B522B]">đ</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 mt-0.5 leading-none truncate">
              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
              <span>{tSpaDetail('noDeposit')}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Hotline Icon Button */}
            <a
              href={`tel:${spa.phone}`}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center border border-stone-200 transition-all active:scale-95 shrink-0"
              title={tSpaDetail('hotline')}
            >
              <Phone className="w-5 h-5 text-stone-700" />
            </a>

            {/* Big High-Impact Zalo Button with Official Zalo Icon */}
            <a
              href={`${zaloHubLink}?text=Tôi%20muốn%20đặt%20lịch%20tại%20${encodeURIComponent(spa.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-xs sm:max-w-sm h-12 sm:h-13 px-4 rounded-2xl bg-gradient-to-r from-[#0068FF] to-[#0052CC] hover:from-[#005FE8] hover:to-[#0047B3] text-white flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/25 transition-all active:scale-[0.98] group"
            >
              <ZaloIcon className="w-7 h-7 shrink-0 drop-shadow-xs" />
              <div className="flex flex-col text-left leading-tight min-w-0">
                <span className="font-black text-xs sm:text-sm tracking-tight truncate">
                  {tSpaDetail('bookZaloMain')}
                </span>
                <span className="text-[10px] sm:text-[11px] text-blue-100 font-medium truncate">
                  {tSpaDetail('bookZaloSub')}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
