'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import {
  ChevronRight,
  Store,
  BadgePercent,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  MVP_SERVICES,
  MVP_SPAS,
  MVPSpa,
  formatPrice,
} from '@/lib/mvp-data';
import { useSearch } from '@/context/SearchContext';
import { getMvpTranslation } from '@/lib/mvp-i18n';
import BookingBottomSheet from '@/components/BookingBottomSheet';

interface HomeClientViewProps {
  locale: string;
}

export default function HomeClientView({ locale }: HomeClientViewProps) {
  const router = useRouter();
  const t = getMvpTranslation(locale);
  const { searchQuery, setSearchQuery } = useSearch();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('goi-dau-cap');
  const [selectedSpa, setSelectedSpa] = useState<MVPSpa>(MVP_SPAS[0]);

  const getServiceInfo = (id: string) => {
    return t.services[id] || {
      name: MVP_SERVICES.find((s) => s.id === id)?.name || '',
      short: MVP_SERVICES.find((s) => s.id === id)?.short || '',
      dur: MVP_SERVICES.find((s) => s.id === id)?.dur || '',
    };
  };

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    setIsBottomSheetOpen(true);
  };

  return (
    <div className="w-full bg-[#FAF8F5] flex flex-col items-center justify-start p-0 sm:py-6 font-sans">
      <div className="w-full max-w-[440px] bg-[#F5F7F4] relative flex flex-col sm:rounded-[32px] sm:shadow-xl sm:border sm:border-stone-200/80 mb-0 sm:mb-10 overflow-hidden animate-in fade-in duration-200">
        
        {/* Sub-Hero Header */}
        <div className="bg-white border-b border-[#E8EDE6] pt-5 pb-4 px-4 sm:px-5 flex-none sm:rounded-t-[32px]">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-bold text-[20px] sm:text-[22px] tracking-tight text-[#141E16] leading-tight m-0">
              {t.brandTagline}
            </h1>
            <Link
              href="/about"
              className="group inline-flex items-center gap-1.5 pl-3.5 pr-1.5 py-1 rounded-full bg-[#F5F7F4] hover:bg-[#EBF0E7] border border-[#DCE3D8] hover:border-[#CAD5C5] text-[12px] font-semibold text-stone-700 hover:text-stone-950 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              aria-label={t.introButton}
            >
              <span>{t.introButton}</span>
              <span className="w-5 h-5 rounded-full bg-white border border-[#DCE3D8] flex items-center justify-center text-stone-400 group-hover:text-[#3A7B37] group-hover:translate-x-0.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <ChevronRight className="w-3 h-3" strokeWidth={2.2} />
              </span>
            </Link>
          </div>

          {/* 3 Information Value Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
            {t.valuePills.map((pill, idx) => {
              const Icon = idx === 0 ? Store : idx === 1 ? BadgePercent : ShieldCheck;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F9F6] border border-[#DEE5DC] text-[11px] sm:text-[11.5px] font-medium text-stone-700 tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.02)] select-none"
                >
                  <Icon className="w-3.5 h-3.5 text-[#3A7B37] shrink-0" strokeWidth={2} />
                  <span>{pill}</span>
                </div>
              );
            })}
          </div>

          {/* Active Location Search Indicator if user searched in Header */}
          {searchQuery && (
            <div className="mt-3 flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-xs text-[#093E06]">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#40813D] shrink-0" />
                <span className="truncate">
                  {t.searchingAt} <strong className="font-semibold">{searchQuery}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-semibold text-[#40813D] hover:underline shrink-0 ml-2 cursor-pointer"
              >
                {t.clearFilter}
              </button>
            </div>
          )}
        </div>

        {/* Content Body: Standardized Service Cards with Prominent Zalo CTAs */}
        <div className="p-3.5 pb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#3A7B37]" />
              <span className="text-[13px] font-bold text-[#093E06] uppercase tracking-wide">
                {t.servicesTitle}
              </span>
            </div>
            <Link
              href="/spas"
              className="text-[12px] font-semibold text-[#3A7B37] hover:text-[#093E06] flex items-center gap-0.5 transition-colors"
            >
              <span>{locale === 'en' ? 'View 15+ Spas' : locale === 'ko' ? '15개 스파 보기' : 'Xem 15+ Spa'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {MVP_SERVICES.map((s) => {
              const sInfo = getServiceInfo(s.id);
              const servicePhoto =
                s.id === 'goi-sach'
                  ? '/banners/banner_herbal_wash.jpg'
                  : s.id === 'goi-dau-cap'
                  ? '/spas/spa_thumb_1.jpg'
                  : s.id === 'duong-sinh'
                  ? '/banners/banner_spa_ambiance.jpg'
                  : s.id === 'massage-body'
                  ? '/banners/banner_neck_massage.jpg'
                  : s.id === 'cham-soc-da'
                  ? '/spas/spa_thumb_2.jpg'
                  : s.id === 'combo-goi-da'
                  ? '/spas/spa_thumb_3.jpg'
                  : '/spas/spa_thumb_4.jpg';

              return (
                <div
                  key={s.id}
                  onClick={() => handleOpenBooking(s.id)}
                  className={`${
                    s.wide ? 'col-span-2' : 'col-span-1'
                  } group bg-white rounded-[22px] border border-[#DDE4D9] overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-200 hover:border-[#3A7B37] hover:shadow-md active:scale-[0.99]`}
                >
                  {/* Top Image Box */}
                  <div>
                    <div
                      className={`relative ${
                        s.wide ? 'h-[140px]' : 'h-[118px]'
                      } bg-[#E8FDE7] overflow-hidden`}
                    >
                      <Image
                        src={servicePhoto}
                        alt={sInfo.name}
                        fill
                        priority={s.id === 'goi-sach'}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Floating Price Pill at top-left (Mockup Style) */}
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-1 text-[12.5px] font-bold text-[#093E06] shadow-[0_2px_8px_rgba(9,62,6,0.15)] border border-white/60 pointer-events-none">
                        {formatPrice(s.price)}
                      </div>

                      {s.wide && (
                        <div className="absolute top-2.5 right-2.5 bg-[#236B38] text-white rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-xs">
                          {locale === 'en' ? 'Best Value' : locale === 'ko' ? '베스트' : 'Phổ Biến Nhất'}
                        </div>
                      )}
                    </div>

                    {/* Card Body: Title + Duration on Left, Circular Arrow Button on Right (Mockup Style) */}
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-[13.5px] sm:text-[14px] text-[#093E06] group-hover:text-[#3A7B37] transition-colors leading-tight line-clamp-2 m-0">
                          {sInfo.name}
                        </h2>
                        {sInfo.dur && (
                          <div className="text-[11px] text-[#6B7869] mt-0.5 font-medium">
                            {sInfo.dur}
                          </div>
                        )}
                      </div>

                      {/* Circular Arrow Button from Mockup */}
                      <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#2E6B34] flex items-center justify-center shrink-0 group-hover:bg-[#2E6B34] group-hover:text-white transition-all shadow-2xs">
                        <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explore All Spas Banner */}
        <div className="px-3.5 pb-6">
          <Link
            href="/spas"
            className="w-full bg-[#2E6B34] hover:bg-[#25572A] active:scale-[0.99] text-white rounded-[22px] p-4 flex items-center justify-between shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-white leading-tight">
                  {locale === 'en'
                    ? 'Explore Map & 15+ Spas'
                    : locale === 'ko'
                    ? '지도 & 15개 제휴 스파 확인'
                    : 'Bản Đồ 15+ Spa Đối Tác'}
                </div>
                <div className="text-[12px] text-[#E8FDE7] mt-0.5">
                  {locale === 'en'
                    ? 'Find verified partner spas in Cau Giay'
                    : locale === 'ko'
                    ? '가장 가까운 하노i 꼬우저i 스파 찾기'
                    : 'Tìm chi nhánh gần bạn nhất tại Cầu Giấy'}
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-[#093E06] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform shadow-xs">
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
            </div>
          </Link>
        </div>

        {/* Booking Bottom Sheet Modal */}
        <BookingBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          locale={locale}
          initialServiceId={selectedServiceId}
          spa={selectedSpa}
        />

      </div>
    </div>
  );
}
