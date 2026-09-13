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
import { PaginationControls } from '@/components/PaginationControls'
import { useTranslations, useLocale } from 'next-intl'

// Minimalist Clean Rating Summary (Anti-Slop)
function RatingSummary({
  rating,
  summaryText,
}: {
  rating: number | string
  summaryText: string
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-stone-900 tracking-tight leading-none">
          {Number(rating || 4.9).toFixed(1)}
        </span>
        <div className="flex items-center text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
      <span className="text-stone-300">•</span>
      <span className="text-xs text-stone-500 font-medium">
        {summaryText}
      </span>
    </div>
  )
}

export default function SpaDetailPage() {
  const tSpaDetail = useTranslations('SpaDetail')
  const tServices = useTranslations('Services')
  const tCommon = useTranslations('Common')
  const locale = useLocale()

  const params = useParams()
  const slug = params?.slug as string

  const getLocalizedExclusiveOffer = (offer: string) => {
    if (!offer) return ''
    if (locale === 'ko') {
      return '등·목 온석(핫스톤) 마사지 15분 무료 증정'
    }
    if (locale === 'en') {
      return 'Complimentary 15-minute hot stone back & neck massage'
    }
    return offer
  }

  const getLocalizedFaq = (faq: any, i: number, spaName: string) => {
    if (locale === 'ko') {
      if (i === 0) {
        return {
          question: `Glow Beauty Pass를 통해 ${spaName} 예약 시 사전 결제가 필요한가요?`,
          answer: '사전 결제가 필요 없습니다. 희망 시간을 선택하고 Zalo Hub 또는 핫라인을 통해 예약 확정 후, 스파에 방문하여 예약 코드를 제시하면 즉시 서비스를 받고 현장에서 정찰가로 결제하시면 됩니다.'
        }
      }
      if (i === 1) {
        return {
          question: '주말이나 피크 시간대에 추가 요금이 발생하나요?',
          answer: '전혀 없습니다. 주말이나 공휴일, 피크 시간대에도 100% 정찰제로 운영되며 추가 요금이나 팁을 일체 요구하지 않습니다.'
        }
      }
      if (i === 2) {
        return {
          question: '해당 스파 지점에 주차(오토바이 및 자동차)가 가능한가요?',
          answer: '네, 건물 내에 안전한 오토바이 및 자동차 주차장이 마련되어 있으며 보안 요원의 친절한 안내를 받으실 수 있습니다.'
        }
      }
    }
    if (locale === 'en') {
      if (i === 0) {
        return {
          question: `Do I need to pay in advance when booking ${spaName} via Glow Beauty Pass?`,
          answer: 'No advance payment is needed. Simply choose your preferred time slot and confirm your booking via Zalo Hub or Hotline. Upon arrival, present your booking code to receive immediate service and pay the transparent fixed price on-site.'
        }
      }
      if (i === 1) {
        return {
          question: 'Are there any extra surcharges for weekends or peak hours?',
          answer: 'Zero extra fees. All services are strictly transparent and fixed-price at all times, with no weekend, holiday, or peak hour surcharges.'
        }
      }
      if (i === 2) {
        return {
          question: 'Is parking available for motorbikes and cars at this location?',
          answer: 'Yes, secure on-site parking for both motorbikes and cars is available with dedicated building security staff assistance.'
        }
      }
    }
    return faq
  }

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

  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0359178342'

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

  // Customer Reviews Filtering & Pagination
  const [reviewPage, setReviewPage] = useState<number>(1)
  const [reviewFilter, setReviewFilter] = useState<'ALL' | '5_STARS' | 'WITH_PHOTOS'>('ALL')
  const REVIEWS_PER_PAGE = 3

  const fiveStarCount = useMemo(() => {
    return reviewsList.filter((r: any) => (r.stars || 5) === 5).length
  }, [reviewsList])

  const photoCount = useMemo(() => {
    return reviewsList.filter((r: any) => Boolean(r.avatarUrl?.trim())).length
  }, [reviewsList])

  const filteredReviews = useMemo(() => {
    if (!reviewsList || reviewsList.length === 0) return []
    let list = [...reviewsList]
    if (reviewFilter === '5_STARS') {
      list = list.filter((r: any) => (r.stars || 5) === 5)
    } else if (reviewFilter === 'WITH_PHOTOS') {
      list = list.filter((r: any) => Boolean(r.avatarUrl?.trim()))
    }
    return list
  }, [reviewsList, reviewFilter])

  const totalReviewPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1

  const currentReviews = useMemo(() => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE
    return filteredReviews.slice(start, start + REVIEWS_PER_PAGE)
  }, [filteredReviews, reviewPage])

  // Generate JSON-LD for LocalBusiness / HealthAndBeautyBusiness + FAQPage + Breadcrumbs
  const spaJsonLd = useMemo(() => {
    if (!spa) return null
    const baseUrl = 'https://glowbeautypass.com'
    const fullUrl = `${baseUrl}/vi/spa/${spa.slug}`

    const businessSchema: any = {
      '@context': 'https://schema.org',
      '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
      name: spa.name,
      description: `${spa.name} - Đối tác kiểm định mạng lưới Glow Beauty Pass Cầu Giấy, Hà Nội. Gói gội đầu dưỡng sinh, massage trị liệu tiêu chuẩn SOP.`,
      url: fullUrl,
      telephone: spa.phone || '+84-359-178-342',
      image: spa.imageUrl ? `${baseUrl}${spa.imageUrl}` : `${baseUrl}/brand/banner-meta.webp`,
      priceRange: '49.000đ - 149.000đ',
      address: {
        '@type': 'PostalAddress',
        streetAddress: spa.address,
        addressLocality: spa.ward || 'Cầu Giấy',
        addressRegion: 'Hà Nội',
        addressCountry: 'VN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: spa.latitude || 21.0336,
        longitude: spa.longitude || 105.7942,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '21:30',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: spa.rating || 4.9,
        reviewCount: spa.reviewCount || 20,
        bestRating: 5,
        worstRating: 1,
      },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang Chủ',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Spa Cầu Giấy',
          item: `${baseUrl}/#danh-sach-spa`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: spa.name,
          item: fullUrl,
        },
      ],
    }

    const faqSchema = spa.faqs && spa.faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spa.faqs.map((f: any) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    } : null

    return { businessSchema, breadcrumbSchema, faqSchema }
  }, [spa])

  return (
    <div className="max-w-xl sm:max-w-2xl mx-auto px-4 py-5 space-y-6 pb-28 sm:pb-32">
      {spaJsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(spaJsonLd.businessSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(spaJsonLd.breadcrumbSchema) }}
          />
          {spaJsonLd.faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(spaJsonLd.faqSchema) }}
            />
          )}
        </>
      )}
      {/* SPA HEADER CARD - MINIMALIST & EDITORIAL */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 space-y-4">
        {spa.imageUrl && (
          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-stone-100">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {tSpaDetail('verifiedPartnerDistrict')}
            </span>
            <div className="flex items-center gap-1 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{spa.openHours}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
            {spa.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 flex items-start gap-1.5 leading-relaxed">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>{spa.address}</span>
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-stone-900 font-bold text-sm">{spa.rating}</span>
            </div>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">
              {spa.reviewCount} {tCommon('reviews')}
            </span>
          </div>
        </div>

        {/* Ưu đãi ngắn gọn (nếu có) */}
        {spa.exclusiveOffer && (
          <div className="p-3 rounded-xl bg-amber-50/80 text-xs text-amber-900 border border-amber-200/60 flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="font-medium">
              <strong className="font-semibold">{tSpaDetail('exclusiveOffer')} </strong>
              {getLocalizedExclusiveOffer(spa.exclusiveOffer)}
            </p>
          </div>
        )}
      </div>

      {/* 3 SKU MENU - CLEAN SERVICE MENU (SCANNABLE IN 3 SECONDS) */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            {tSpaDetail('servicesTitle')}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {tSpaDetail('servicesMenuSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {skus.map((sku, index) => {
            const pkgKey = index === 0 ? 'pkg1' : index === 1 ? 'pkg2' : 'pkg3'
            const localizedName = tServices.has(`${pkgKey}.name` as any) ? tServices(`${pkgKey}.name` as any) : sku.name

            const isPopular = index === 1
            const badgeLabel = index === 0 ? tSpaDetail('pkg1Badge') : index === 1 ? tSpaDetail('pkg2Badge') : tSpaDetail('pkg3Badge')

            // Extract 3 clean bullet points
            const bullet1 = tServices.has(`${pkgKey}.f1` as any) ? tServices(`${pkgKey}.f1` as any) : ''
            const bullet2 = tServices.has(`${pkgKey}.f2` as any) ? tServices(`${pkgKey}.f2` as any) : ''
            const bullet3 = tServices.has(`${pkgKey}.f3` as any) ? tServices(`${pkgKey}.f3` as any) : ''
            const highlights = [bullet1, bullet2, bullet3].filter(Boolean)

            return (
              <div
                key={sku.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all ${
                  isPopular
                    ? 'border-stone-900 shadow-xs'
                    : 'border-stone-200/80 hover:border-stone-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-stone-900 leading-snug">
                        {localizedName}
                      </h3>
                      {isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white px-2 py-0.5 rounded-md">
                          {badgeLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{sku.durationMinutes} {tCommon('minutes')}</span>
                      <span>•</span>
                      <span>{tSpaDetail('sopProcess')}</span>
                    </div>
                  </div>

                  {/* Clean Price */}
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-stone-900 tracking-tight">
                      {sku.pricePhase1.toLocaleString('vi-VN')}đ
                    </div>
                    {sku.pricePhase2 && sku.pricePhase2 > sku.pricePhase1 && (
                      <div className="text-[11px] text-stone-400 line-through">
                        {sku.pricePhase2.toLocaleString('vi-VN')}đ
                      </div>
                    )}
                  </div>
                </div>

                {/* Micro Steps (Easy to scan in 3 seconds) */}
                {highlights.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                    {highlights.map((h: string, idx: number) => (
                      <div key={idx} className="text-xs text-stone-600 flex items-start gap-1.5 leading-snug">
                        <span className="text-stone-400 font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Zalo Booking CTA */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-400 font-medium">
                    {tSpaDetail('noExtraFee')}
                  </span>
                  <a
                    href={zaloHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold active:scale-95 transition-all"
                  >
                    <ZaloIcon className="w-3.5 h-3.5 text-white" />
                    <span>{tCommon('bookNow')} • {sku.pricePhase1.toLocaleString('vi-VN')}đ</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* WHAT OUR CUSTOMERS SAY & REVIEWS */}
      <div id="customer-reviews" className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 tracking-tight">
            {tSpaDetail('reviewsTitle')}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {reviewsList.length} {tCommon('reviews')}
          </span>
        </div>

        {/* Minimalist Clean Rating Summary */}
        <RatingSummary
          rating={spa.rating}
          summaryText={tSpaDetail('reviewsSummary', { count: spa.reviewCount || reviewsList.length })}
        />

        {/* Review Filter Tabs */}
        {reviewsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setReviewFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                reviewFilter === 'ALL'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {tSpaDetail('allReviews')} ({reviewsList.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('5_STARS')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                reviewFilter === '5_STARS'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <span>5 sao</span>
              <span>({fiveStarCount})</span>
            </button>
            {photoCount > 0 && (
              <button
                type="button"
                onClick={() => setReviewFilter('WITH_PHOTOS')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  reviewFilter === 'WITH_PHOTOS'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                <span>Có ảnh</span>
                <span>({photoCount})</span>
              </button>
            )}
          </div>
        )}

        {/* Customer Reviews Cards (Paginated) */}
        {currentReviews.length > 0 ? (
          <div className="space-y-3 pt-1">
            {currentReviews.map((r: any) => (
              <article
                key={r.id}
                className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 space-y-2"
              >
                <div className="flex items-start gap-3">
                  {r.avatarUrl?.trim() ? (
                    <img
                      src={r.avatarUrl}
                      alt={r.authorName}
                      className="h-9 w-9 shrink-0 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-700">
                      {r.authorInitials?.trim() || (r.authorName ? r.authorName.slice(0, 2).toUpperCase() : 'KH')}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {r.authorName}
                      </h4>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: r.stars || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                      <span>{r.authorMeta || 'Khách hàng Glow'}</span>
                      {r.googleMapUrl && r.googleMapUrl.trim() !== '' && (
                        <>
                          <span className="text-stone-300">•</span>
                          <a
                            href={r.googleMapUrl.startsWith('http') ? r.googleMapUrl : `https://${r.googleMapUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-500 hover:text-stone-800 underline font-medium"
                          >
                            Google Maps
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                  {r.body}
                </p>
              </article>
            ))}

            {/* Pagination Controls */}
            {totalReviewPages > 1 && (
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-stone-500 font-medium order-2 sm:order-1">
                  {tSpaDetail('showingReviews', {
                    from: (reviewPage - 1) * REVIEWS_PER_PAGE + 1,
                    to: Math.min(reviewPage * REVIEWS_PER_PAGE, filteredReviews.length),
                    total: filteredReviews.length,
                  })}
                </span>
                <div className="order-1 sm:order-2">
                  <PaginationControls
                    currentPage={reviewPage}
                    totalPages={totalReviewPages}
                    onPageChange={(p) => {
                      setReviewPage(p)
                      document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic py-2">{tSpaDetail('noReviews')}</p>
        )}
      </div>

      {/* MINIMALIST CLEAN FAQ ACCORDION */}
      {spa.faqs && Array.isArray(spa.faqs) && spa.faqs.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 space-y-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              {tSpaDetail('faqTitle')}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {tSpaDetail('faqSubtitle')}
            </p>
          </div>

          <div className="divide-y divide-stone-100 pt-1">
            {spa.faqs.map((rawFaq: any, i: number) => {
              const faq = getLocalizedFaq(rawFaq, i, spa.name)
              const isOpen = !!openFaqs[i]
              return (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left flex items-center justify-between gap-3 cursor-pointer select-none py-1 group"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-stone-800 group-hover:text-stone-950 leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-stone-800' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pt-2 pb-1 text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PROMINENT STICKY BOTTOM BAR (MINIMALIST & CRISP) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-2.5 sm:py-3 px-4">
        <div className="max-w-xl sm:max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Price Minimalist Teaser */}
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider leading-none">
              {tSpaDetail('fromPrice')}
            </span>
            <div className="flex items-baseline gap-0.5 mt-1 leading-none">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {minPrice.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-semibold text-stone-900">đ</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Hotline Icon Button */}
            <a
              href={`tel:${spa.phone || '0359178342'}`}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center border border-stone-200/80 transition-all active:scale-95 shrink-0"
              title={tSpaDetail('callHotline')}
            >
              <Phone className="w-5 h-5 text-stone-700" />
            </a>

            {/* Clean, High-Impact Zalo Button with Prominent Zalo Icon */}
            <a
              href={zaloHubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-xs sm:max-w-sm h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-[#0068FF] hover:bg-[#0052CC] text-white flex items-center justify-center gap-2.5 shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <ZaloIcon className="w-5.5 h-5.5 shrink-0" />
              <span className="font-bold text-sm sm:text-base tracking-tight truncate">
                {tSpaDetail('bookViaZalo')}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
