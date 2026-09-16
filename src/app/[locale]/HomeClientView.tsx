'use client';

import React from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import {
  ChevronRight,
  Store,
  BadgePercent,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  MVP_SERVICES,
  formatPrice,
} from '@/lib/mvp-data';
import { useSearch } from '@/context/SearchContext';
import { getMvpTranslation } from '@/lib/mvp-i18n';

interface HomeClientViewProps {
  locale: string;
}

export default function HomeClientView({ locale }: HomeClientViewProps) {
  const router = useRouter();
  const t = getMvpTranslation(locale);
  const { searchQuery, setSearchQuery } = useSearch();

  const getServiceInfo = (id: string) => {
    return t.services[id] || {
      name: MVP_SERVICES.find((s) => s.id === id)?.name || '',
      short: MVP_SERVICES.find((s) => s.id === id)?.short || '',
      dur: MVP_SERVICES.find((s) => s.id === id)?.dur || '',
    };
  };

  const handleSelectService = (serviceId: string) => {
    router.push(`/spas?service=${serviceId}`);
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

        {/* Content Body: Standardized Service Cards */}
        <div className="p-3.5 pb-6">
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
                  onClick={() => handleSelectService(s.id)}
                  className={`${
                    s.wide ? 'col-span-2' : 'col-span-1'
                  } group bg-white rounded-[20px] border border-[#DDE4D9] overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:border-[#40813D] hover:shadow-md active:scale-[0.99]`}
                >
                  {/* Top Image Box */}
                  <div
                    className={`relative ${
                      s.wide ? 'h-[138px]' : 'h-[112px]'
                    } bg-[#E8FDE7] overflow-hidden`}
                  >
                    <Image
                      src={servicePhoto}
                      alt={sInfo.name}
                      fill
                      priority={s.id === 'goi-sach'}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                    {/* Floating Price Pill at top-left */}
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-1 text-[12px] font-bold text-[#093E06] shadow-[0_2px_8px_rgba(9,62,6,0.18)] border border-white/60 pointer-events-none">
                      {formatPrice(s.price)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-[13.5px] sm:text-[14px] text-[#093E06] group-hover:text-[#40813D] transition-colors leading-tight line-clamp-1 m-0">
                        {sInfo.name}
                      </h2>
                      {sInfo.dur && (
                        <div className="flex items-center gap-1 text-[11px] text-[#6B7869] mt-1 font-medium">
                          <Clock className="w-3 h-3 text-[#3A7B37]" />
                          <span>{sInfo.dur}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#F0F4EF] flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#40813D] group-hover:underline flex items-center gap-0.5">
                        <span>{t.chooseBranch}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <span className="text-[10.5px] text-stone-400 font-medium">
                        15+ spa
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explore All Spas Banner */}
        <div className="px-3.5 pb-5">
          <Link
            href="/spas"
            className="w-full bg-[#40813D] hover:bg-[#356F32] active:scale-[0.99] text-white rounded-[22px] p-4 flex items-center justify-between shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-white leading-tight">
                  Xem Bản Đồ & 15+ Spa Đối Tác
                </div>
                <div className="text-[12px] text-[#E8FDE7] mt-0.5">
                  Tìm chi nhánh gần nhất tại Cầu Giấy
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-[#093E06] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform shadow-xs">
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
            </div>
          </Link>
        </div>

        {/* AI Citability & GEO Answer Block (Generative Engine Optimization) */}
        <div className="px-3.5 pb-6">
          <div className="bg-white rounded-[22px] p-4.5 border border-[#DDE4D9] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#40813D]" />
              <h3 className="text-[13px] font-bold text-[#093E06] uppercase tracking-wider m-0">
                Chuẩn Mực SOP Glow Beauty Pass
              </h3>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[#4A5848] m-0">
              Glow Beauty Pass là mạng lưới spa làm đẹp và dưỡng sinh chuẩn hóa đầu tiên tại Cầu Giấy, Hà Nội. Toàn bộ các cơ sở đối tác đều trải qua quy trình thẩm định 30 tiêu chí nghiêm ngặt, đảm bảo mức giá niêm yết cố định từ 49.000đ đến 149.000đ mà không có bất kỳ khoản phụ thu hay tiền boa ép buộc nào.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11.5px] font-semibold text-[#093E06]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#40813D]" />
                <span>Không chèo kéo mua gói</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#40813D]" />
                <span>Hoàn tiền nếu sai giá</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
