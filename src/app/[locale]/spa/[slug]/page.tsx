'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft,
  Star,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import {
  MVP_SERVICES,
  MVP_SPAS,
  MVPSpa,
  formatPrice,
} from '@/lib/mvp-data';
import { getMvpTranslation, formatDayRange, formatTodayHours } from '@/lib/mvp-i18n';
import BookingBottomSheet from '@/components/BookingBottomSheet';

export default function SpaDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = (params?.locale as string) || 'vi';
  const t = getMvpTranslation(locale);

  // Find matching spa or fallback
  const spa: MVPSpa =
    MVP_SPAS.find((s) => s.id === slug) ||
    MVP_SPAS.find((s) => s.name.toLowerCase().includes(slug?.replace(/-/g, ' '))) ||
    MVP_SPAS[0];

  const [selectedServiceId, setSelectedServiceId] = useState<string>('duong-sinh');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const miniMapIframeRef = useRef<HTMLIFrameElement>(null);

  const selectedService =
    MVP_SERVICES.find((s) => s.id === selectedServiceId) || MVP_SERVICES[2];

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) setSelectedServiceId(serviceId);
    setIsBottomSheetOpen(true);
  };

  return (
    <div className="w-full bg-[#FAF8F5] flex flex-col items-center justify-start p-0 sm:py-6 font-sans">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-[#F5F7F4] relative overflow-hidden flex flex-col sm:rounded-[36px] sm:shadow-xl sm:border sm:border-stone-200/80 mb-0 sm:mb-6">
        <div className="flex-1 overflow-y-auto">
          {/* Photo Gallery with Back Button */}
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

            {/* Back Button to Home */}
            <Link
              href="/"
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-[#093E06] transition-transform active:scale-90 cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
            </Link>

            {/* Certified / Verified Badge */}
            <div className="absolute top-4 right-4 bg-[#093E06] text-white text-[10.5px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
              {spa.tier === 'Certified' ? t.certifiedBadge : t.verifiedBadge}
            </div>

            {/* Photos Count Badge */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
              {spa.photos.length} {t.photosCount}
            </div>
          </div>

          {/* Spa Header Info */}
          <div className="px-5 pt-4.5">
            <h1 className="font-serif text-[22px] font-bold text-[#093E06] leading-tight">
              {spa.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[12.5px] text-[#4A5848] mt-1 leading-normal">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>
                {spa.rating.toFixed(1)} · {spa.reviews} {t.reviewsCount} · {spa.dist} · {spa.ward}, {t.cities[spa.city] || spa.cityName}
              </span>
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${
                  spa.open
                    ? 'bg-[#E8FDE7] text-[#1F5E1B]'
                    : 'bg-[#FBF1D8] text-[#7A5A12]'
                }`}
              >
                {spa.open ? t.openNowStatus : t.closedStatus}
              </span>
              <span className="text-[12px] text-[#4A5848]">{formatTodayHours(spa.today, locale)}</span>
            </div>

            {/* Hours Box */}
            <div className="bg-white border border-[#DDE4D9] rounded-[16px] p-3.5 mt-3 space-y-1.5 shadow-xs">
              {spa.hours.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[12.5px] text-[#4A5848]"
                >
                  <span>{formatDayRange(h.d, locale)}</span>
                  <span className="font-semibold text-[#093E06]">{h.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standardized Price Menu */}
          <div className="px-5 pt-6">
            <h2 className="text-[13.5px] font-bold text-[#093E06] mb-2.5">
              {t.menuTitle}
            </h2>
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] overflow-hidden shadow-xs divide-y divide-[#EFF2EE]">
              {MVP_SERVICES.map((s) => {
                const isCurrent = s.id === selectedServiceId;
                const sInfo = t.services[s.id] || { name: s.name, dur: s.dur };
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
                      isCurrent ? 'bg-[#F3FAF2]' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="text-[13.5px] font-semibold text-[#093E06]">
                        {sInfo.name}
                      </div>
                      {sInfo.dur && (
                        <div className="text-[11px] text-[#6B7869] mt-0.5">
                          {sInfo.dur}
                        </div>
                      )}
                    </div>
                    <div className="text-[14px] font-bold text-[#093E06] shrink-0">
                      {formatPrice(s.price)}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#6B7869] mt-2">
              {t.menuNotice}
            </p>
          </div>

          {/* Location Mini Map */}
          <div className="px-5 pt-6">
            <h2 className="text-[13.5px] font-bold text-[#093E06] mb-2.5">
              {t.mapLocationTitle}
            </h2>
            <div className="rounded-[18px] overflow-hidden border border-[#DDE4D9] bg-[#EEF1EC] shadow-xs">
              <div className="relative h-40">
                <iframe
                  ref={miniMapIframeRef}
                  src="/map.html?mini=1"
                  title={t.mapLocationTitle}
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
              <div className="p-3.5 bg-white flex items-center justify-between gap-3">
                <div className="text-[12.5px] leading-relaxed text-[#4A5848] flex-1">
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
                  className="shrink-0 text-[12.5px] font-bold text-[#093E06] bg-[#E8FDE7] hover:bg-[#d8f5d7] rounded-full px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#093E06]" strokeWidth={2} />
                  <span>{t.getDirections}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="px-5 pt-6 pb-28">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[13.5px] font-bold text-[#093E06]">
                {t.customerReviewsTitle}
              </h2>
              <div className="flex items-center gap-1 text-[#40813F] text-[11.5px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{t.verifiedCustomerBadge}</span>
              </div>
            </div>

            <div className="space-y-3">
              {t.reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 shadow-xs"
                >
                  <div className="flex gap-2.5 items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#40813F] flex items-center justify-center text-xs font-bold shrink-0">
                      {r.initial}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#093E06]">
                        {r.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#6B7869]">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star key={sIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span>· {r.when}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[12.5px] leading-relaxed text-[#4A5848]">
                    {r.text}
                  </p>

                  <div className="flex gap-2 mt-2.5">
                    {Array.from({ length: r.photos }).map((_, phIdx) => (
                      <div
                        key={phIdx}
                        className="w-16 h-16 rounded-[12px] bg-[#E8FDE7] overflow-hidden relative"
                      >
                        <Image
                          src={
                            phIdx === 0
                              ? '/banners/banner_herbal_wash.jpg'
                              : '/banners/banner_spa_ambiance.jpg'
                          }
                          alt="Review photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Compact Fixed Bottom Bar for Booking */}
        <div className="flex-none bg-white/95 backdrop-blur-md border-t border-[#E8EDE6] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[18px] sm:text-[19px] font-bold text-[#093E06] leading-tight">
                {formatPrice(selectedService.price)}
              </span>
              <span className="text-[11.5px] text-[#6B7869] truncate mt-0.5">
                {t.services[selectedServiceId]?.name || selectedService.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBooking(selectedServiceId)}
              className="h-11 px-5 rounded-full bg-[#40813D] hover:bg-[#356F32] active:bg-[#093E06] text-white text-[13.5px] font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Image
                src="/brand/Logo-Zalo-App-Rec.webp"
                alt="Zalo"
                width={16}
                height={16}
                className="w-4 h-4 rounded-xs shrink-0 object-contain"
              />
              <span>{t.bookNow}</span>
            </button>
          </div>
        </div>

        {/* Bottom Sheet */}
        <BookingBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          spa={spa}
          services={MVP_SERVICES}
          initialServiceId={selectedServiceId}
          zaloPhone="0359178342"
          locale={locale}
        />
      </div>
    </div>
  );
}
