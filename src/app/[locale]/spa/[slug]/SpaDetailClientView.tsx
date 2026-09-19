'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import {
  MVP_SERVICES,
  MVPService,
  MVPSpa,
  MVPReview,
  SERVICE_BANNER_MAP,
  formatPrice,
} from '@/lib/mvp-data';
import { getMvpTranslation, formatDayRange, formatTodayHours } from '@/lib/mvp-i18n';
import { getSpaSpecificReviews } from '@/lib/spa-reviews-data';
import { useLocation } from '@/context/LocationContext';
import { computeDistanceKm, formatDistanceKm, DEFAULT_CITY_CENTERS } from '@/lib/formatters';
import BookingBottomSheet from '@/components/BookingBottomSheet';
import GlowGoogleMap from '@/components/GlowGoogleMap';

function formatReviewTime(when: string, createdAt?: string, locale?: string): string {
  if (!createdAt) return when;
  const date = new Date(createdAt);
  const diffHours = Math.max(1, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60)));

  if (locale === 'en') {
    if (diffHours >= 24 * 30) {
      const m = Math.floor(diffHours / (24 * 30));
      return m === 1 ? '1 month ago' : `${m} months ago`;
    }
    if (diffHours >= 24 * 7) {
      const w = Math.floor(diffHours / (24 * 7));
      return w === 1 ? '1 week ago' : `${w} weeks ago`;
    }
    if (diffHours >= 24) {
      const d = Math.floor(diffHours / 24);
      return d === 1 ? 'Yesterday' : `${d} days ago`;
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }
  if (locale === 'ko') {
    if (diffHours >= 24 * 30) return `${Math.floor(diffHours / (24 * 30))}개월 전`;
    if (diffHours >= 24 * 7) return `${Math.floor(diffHours / (24 * 7))}주 전`;
    if (diffHours >= 24) return `${Math.floor(diffHours / 24)}일 전`;
    return `${diffHours}시간 전`;
  }
  // Vietnamese default
  if (diffHours >= 24 * 30) return `${Math.floor(diffHours / (24 * 30))} tháng trước`;
  if (diffHours >= 24 * 7) return `${Math.floor(diffHours / (24 * 7))} tuần trước`;
  if (diffHours >= 24) return `${Math.floor(diffHours / 24)} ngày trước`;
  return `${diffHours} giờ trước`;
}

interface SpaDetailClientViewProps {
  spa: MVPSpa;
  locale: string;
  initialServices?: MVPService[];
  initialReviews?: MVPReview[];
}

export default function SpaDetailClientView({
  spa,
  locale,
  initialServices,
  initialReviews,
}: SpaDetailClientViewProps) {
  const t = getMvpTranslation(locale);
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get('service');

  const servicesList =
    initialServices && initialServices.length > 0 ? initialServices : MVP_SERVICES;

  const reviewsList = useMemo(() => {
    if (initialReviews && initialReviews.length > 0) {
      return initialReviews;
    }
    return getSpaSpecificReviews(spa, locale);
  }, [initialReviews, spa, locale]);

  const { userCoords } = useLocation();

  // Dynamic distance based on user's live GPS coords (or city reference center)
  const displayDistance = useMemo(() => {
    if (typeof spa.lat !== 'number' || typeof spa.lng !== 'number') {
      return spa.dist || null;
    }
    // 1. If user has active GPS coordinates, compute real distance from user
    if (userCoords) {
      const km = computeDistanceKm(userCoords.lat, userCoords.lon, spa.lat, spa.lng);
      // Nếu người dùng đang ở tỉnh/thành phố khác (> 70 km, ví dụ đang ở Hà Nội xem spa Đà Nẵng),
      // hiển thị cự ly so với trung tâm thành phố sở tại (spa.dist) để tránh gây nhầm lẫn
      if (km > 70) {
        return spa.dist || null;
      }
      return formatDistanceKm(km);
    }
    // 2. Otherwise compute distance from city center reference
    const cityCenter = DEFAULT_CITY_CENTERS[spa.city] || DEFAULT_CITY_CENTERS.hn;
    const km = computeDistanceKm(cityCenter.lat, cityCenter.lng, spa.lat, spa.lng);
    return formatDistanceKm(km);
  }, [userCoords, spa.lat, spa.lng, spa.city, spa.dist]);

  // Filter only services that THIS spa offers!
  const spaServices = useMemo(() => {
    return servicesList.filter((s) => spa.serviceIds && spa.serviceIds.includes(s.id));
  }, [spa, servicesList]);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (serviceFromQuery && spa.serviceIds?.includes(serviceFromQuery)) {
      return serviceFromQuery;
    }
    return spaServices[0]?.id || 'duong-sinh';
  });

  const [activePreviewPhoto, setActivePreviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (serviceFromQuery && spa.serviceIds?.includes(serviceFromQuery)) {
      setSelectedServiceId(serviceFromQuery);
    }
  }, [serviceFromQuery, spa]);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const selectedService =
    spaServices.find((s) => s.id === selectedServiceId) || spaServices[0] || servicesList[0] || MVP_SERVICES[2];

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) setSelectedServiceId(serviceId);
    setIsBottomSheetOpen(true);
  };

  return (
    <div className="w-full bg-[#FAF8F5] flex flex-col items-center justify-start p-0 sm:py-6 font-sans">
      <div className="w-full max-w-[440px] bg-[#F5F7F4] relative flex flex-col sm:rounded-[36px] sm:shadow-xl sm:border sm:border-stone-200/80 mb-0 sm:mb-10 overflow-hidden">
        <div className="flex-1 pb-10">
          {/* Photo Gallery with Back Button to /spas */}
          <div className="relative">
            <div className="flex gap-1 overflow-x-auto bg-[#DDE4D9] no-scrollbar">
              {spa.photos.map((ph, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-64 h-52 relative bg-[#E8FDE7]"
                >
                  <Image
                    src={ph}
                    alt={`${spa.name} photo ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Back Button to /spas */}
            <Link
              href={`/spas?service=${selectedServiceId}`}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-[#093E06] transition-transform active:scale-90 cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
            </Link>



            {/* Photos Count Badge */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
              {spa.photos.length} {t.photosCount}
            </div>
          </div>

          {/* Spa Header Info */}
          <div className="px-5 pt-4">
            <h1 className="font-sans text-[21px] sm:text-[23px] font-extrabold text-[#093E06] leading-tight tracking-tight m-0">
              {spa.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[13px] sm:text-[13.5px] text-[#4A5848] mt-1 leading-normal">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>
                {spa.rating.toFixed(1)} · {spa.reviews} {t.reviewsCount}
                {displayDistance ? ` · ${displayDistance}` : ''} · {spa.ward}, {t.cities[spa.city] || spa.cityName}
              </span>
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 mt-2.5">
              <span
                className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${
                  spa.open
                    ? 'bg-[#E8FDE7] text-[#1F5E1B]'
                    : 'bg-[#FBF1D8] text-[#7A5A12]'
                }`}
              >
                {spa.open ? t.openNowStatus : t.closedStatus}
              </span>
              <span className="text-[12.5px] text-[#4A5848]">{formatTodayHours(spa.today, locale)}</span>
            </div>

            {/* Hours Box */}
            <div className="bg-white border border-[#DDE4D9] rounded-[16px] p-3 mt-2.5 space-y-1.5 shadow-xs">
              {spa.hours.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[13px] text-[#4A5848]"
                >
                  <span>{formatDayRange(h.d, locale)}</span>
                  <span className="font-semibold text-[#093E06]">{h.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standardized Price Menu */}
          <div className="px-5 pt-5">
            <h2 className="text-[14px] sm:text-[14.5px] font-bold text-[#093E06] mb-2">
              {t.menuTitle}
            </h2>
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] overflow-hidden shadow-xs divide-y divide-[#EFF2EE]">
              {spaServices.map((s) => {
                const isCurrent = s.id === selectedServiceId;
                const sInfo = t.services[s.id] || { name: s.name, dur: s.dur };
                const sPhoto = s.imageUrl || SERVICE_BANNER_MAP[s.id] || '/services/goi-sach.png';
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      isCurrent ? 'bg-[#F3FAF2] border-l-4 border-l-[#40813D]' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#DDE4D9] bg-[#E8FDE7]">
                        <Image
                          src={sPhoto}
                          alt={sInfo.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[14.5px] font-semibold text-[#093E06] leading-tight">
                            {sInfo.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[11px] font-bold text-[#40813D] bg-[#E8FDE7] px-1.5 py-0.5 rounded-full shrink-0">
                              {t.selecting}
                            </span>
                          )}
                        </div>
                        {sInfo.dur && (
                          <div className="text-[12px] text-[#6B7869] mt-0.5">
                            {sInfo.dur}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[14.5px] font-bold text-[#093E06] shrink-0">
                      {formatPrice(s.price)}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11.5px] text-[#6B7869] mt-1.5">
              {t.menuNotice}
            </p>
          </div>

          {/* Location Mini Map */}
          <div className="px-5 pt-5">
            <h2 className="text-[14px] sm:text-[14.5px] font-bold text-[#093E06] mb-2">
              {t.mapLocationTitle}
            </h2>
            <div className="rounded-[18px] overflow-hidden border border-[#DDE4D9] bg-[#EEF1EC] shadow-xs">
              <div className="relative h-44 sm:h-48 w-full">
                <GlowGoogleMap
                  spas={[spa]}
                  selectedSpaId={spa.id}
                  initialCenter={{ lat: spa.lat, lng: spa.lng }}
                  initialZoom={15}
                  interactive={true}
                  className="w-full h-full"
                  locale={locale}
                />
              </div>
              <div className="p-3 bg-white flex items-center justify-between gap-3">
                <div className="text-[13px] leading-relaxed text-[#4A5848] flex-1">
                  {spa.address}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${spa.lat},${spa.lng}`,
                      '_blank'
                    )
                  }
                  className="shrink-0 text-[12.5px] font-bold text-[#093E06] bg-[#E8FDE7] hover:bg-[#d8f5d7] rounded-full px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#093E06]" strokeWidth={2} />
                  <span>{t.getDirections}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews from Database */}
          <div className="px-5 pt-5 pb-24">
            <div className="flex items-baseline justify-between mb-2.5 px-0.5">
              <h2 className="text-[14px] sm:text-[14.5px] font-bold text-[#093E06] flex items-center gap-2">
                <span>{t.customerReviewsTitle}</span>
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#E8FDE7] text-[#1F5E1B]">
                  {reviewsList.length}
                </span>
              </h2>
            </div>

            <div className="space-y-2.5">
              {reviewsList.map((r, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 shadow-xs"
                >
                  <div className="flex gap-2.5 items-center mb-1.5">
                    <div className="w-8.5 h-8.5 rounded-full bg-[#E8FDE7] text-[#2F672E] flex items-center justify-center text-[13.5px] font-bold shrink-0">
                      {r.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13.5px] font-bold text-stone-900 leading-tight">
                          {r.name}
                        </span>
                        {r.verifiedPhone && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E8FDE7] text-[#1F5E1B] text-[10.5px] font-semibold border border-emerald-200/50">
                            <CheckCircle2 className="w-3 h-3 text-[#236B38]" />
                            <span>{locale === 'en' ? 'Verified' : locale === 'ko' ? '인증됨' : 'Đã xác thực'}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11.5px] text-stone-500 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, sIdx) => {
                            const starCount = typeof (r as any).rating === 'number' ? (r as any).rating : (r.stars?.includes('☆') ? 4 : 5);
                            const isFilled = sIdx < starCount;
                            return (
                              <Star
                                key={sIdx}
                                className={`w-3 h-3 ${
                                  isFilled
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-stone-200 text-stone-300'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <span>· {formatReviewTime(r.when, (r as any).createdAt, locale)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-[#4A5848]">
                    {r.text}
                  </p>

                  {r.photoUrls && r.photoUrls.length > 0 && (
                    <div className="flex gap-2 mt-2.5">
                      {r.photoUrls.map((photoUrl, phIdx) => (
                        <button
                          key={phIdx}
                          type="button"
                          onClick={() => setActivePreviewPhoto(photoUrl)}
                          title={t.viewPhotoZoom}
                          className="w-14 h-14 sm:w-15 sm:h-15 rounded-[13px] overflow-hidden relative border border-[#DDE4D9] shadow-2xs cursor-pointer group active:scale-95 transition-all focus:outline-none"
                        >
                          <Image
                            src={photoUrl}
                            alt={locale === 'en' ? `Review photo ${phIdx + 1} - ${r.name}` : locale === 'ko' ? `리뷰 사진 ${phIdx + 1} - ${r.name}` : `Ảnh đánh giá ${phIdx + 1} - ${r.name}`}
                            fill
                            sizes="100px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Compact Fixed Bottom Bar for Booking - Guaranteed Viewport Stick */}
      {!isBottomSheetOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8EDE6] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] z-50 shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
          <div className="max-w-[440px] mx-auto flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[20px] sm:text-[21px] font-black text-[#093E06] leading-tight">
                {formatPrice(selectedService.price)}
              </span>
              <span className="text-[13.5px] text-[#6B7869] truncate mt-0.5 font-medium">
                {t.services[selectedServiceId]?.name || selectedService.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBooking(selectedServiceId)}
              className="h-11 px-5 sm:px-5.5 rounded-full bg-[#236B38] hover:bg-[#1D5A2E] active:scale-95 text-white text-[15.5px] sm:text-[16px] font-bold shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Image
                src="/brand/Logo-Zalo-App-Rec.webp"
                alt="Zalo"
                width={18}
                height={18}
                className="rounded-[4px] shrink-0 object-contain shadow-2xs"
              />
              <span>{t.bookNow}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      <BookingBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        spa={spa}
        services={spaServices}
        initialServiceId={selectedServiceId}
        onServiceChange={setSelectedServiceId}
        zaloPhone="0359178342"
        locale={locale}
      />

      {/* Lightbox Preview Modal for Review Photos */}
      {activePreviewPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePreviewPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePreviewPhoto(null)}
              aria-label={t.closePhoto}
              className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              <Image
                src={activePreviewPhoto}
                alt={locale === 'en' ? 'Enlarged review photo' : locale === 'ko' ? '확대된 리뷰 사진' : 'Ảnh đánh giá phóng to'}
                fill
                sizes="(max-width: 600px) 95vw, 500px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
