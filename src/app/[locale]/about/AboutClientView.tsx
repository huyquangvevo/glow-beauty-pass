'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BadgePercent,
  Sparkles,
  Award,
  Check,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getMvpTranslation } from '@/lib/mvp-i18n';

interface AboutClientViewProps {
  locale: string;
}

export default function AboutClientView({ locale }: AboutClientViewProps) {
  const t = getMvpTranslation(locale);

  return (
    <div className="w-full bg-[#FAF8F5] flex flex-col items-center justify-start p-0 sm:py-6 font-sans">
      <div className="w-full max-w-[440px] bg-[#F5F7F4] relative flex flex-col sm:rounded-[32px] sm:shadow-xl sm:border sm:border-stone-200/80 mb-0 sm:mb-10 overflow-hidden animate-in fade-in duration-200">
        
        {/* Navigation Bar */}
        <div className="bg-[#40813D] px-4 pt-4 pb-3 flex items-center justify-between text-white border-b border-[#356F32]">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
            aria-label={t.back}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
          </Link>
          <span className="font-bold text-[14.5px] text-white tracking-tight">
            {t.introButton}
          </span>
          <div className="w-8" />
        </div>

        {/* Hero Section */}
        <div className="bg-[#40813D] px-6 pt-2 pb-8 text-white relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold tracking-wide text-[#E8FDE7] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E8FDE7]" />
            <span>{t.intro.heroTag}</span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-white leading-tight mb-2.5">
            {t.intro.heroTitle}
          </h1>

          <p className="text-[14px] leading-relaxed text-[#EAF7E8] max-w-[340px]">
            {t.intro.heroDesc}
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
            <div className="text-center">
              <div className="text-[18px] font-extrabold text-white">15+</div>
              <div className="text-[11px] text-[#D4F4D3] font-medium">
                {locale === 'en' ? 'Verified Spas' : locale === 'ko' ? '제휴 스파' : 'Spa đối tác'}
              </div>
            </div>
            <div className="text-center border-x border-white/15">
              <div className="text-[18px] font-extrabold text-white">39K - 199K</div>
              <div className="text-[11px] text-[#D4F4D3] font-medium">
                {locale === 'en' ? 'Fixed Rates' : locale === 'ko' ? '정찰제 가격' : 'Đồng giá cố định'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-extrabold text-white">100%</div>
              <div className="text-[11px] text-[#D4F4D3] font-medium">
                {locale === 'en' ? 'Quality Verified' : locale === 'ko' ? '품질 검증' : 'Kiểm định chất lượng'}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow: 3 Bước Trải Nghiệm */}
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#40813D] rounded-full" />
            <h2 className="text-[13px] font-bold tracking-wider text-[#093E06] uppercase">
              {t.intro.howItWorks}
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="bg-white rounded-[20px] p-4 border border-[#DDE4D9] flex gap-3.5 items-start shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#093E06] flex items-center justify-center text-sm font-bold shrink-0 border border-[#D4F4D3]">
                1
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="text-[14.5px] font-bold text-[#093E06]">
                  {t.intro.step1Title}
                </div>
                <div className="text-[12.5px] leading-relaxed text-[#4A5848] mt-1">
                  {t.intro.step1Desc}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[20px] p-4 border border-[#DDE4D9] flex gap-3.5 items-start shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#093E06] flex items-center justify-center text-sm font-bold shrink-0 border border-[#D4F4D3]">
                2
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="text-[14.5px] font-bold text-[#093E06]">
                  {t.intro.step2Title}
                </div>
                <div className="text-[12.5px] leading-relaxed text-[#4A5848] mt-1">
                  {t.intro.step2Desc}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[20px] p-4 border border-[#DDE4D9] flex gap-3.5 items-start shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#093E06] flex items-center justify-center text-sm font-bold shrink-0 border border-[#D4F4D3]">
                3
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="text-[14.5px] font-bold text-[#093E06]">
                  {t.intro.step3Title}
                </div>
                <div className="text-[12.5px] leading-relaxed text-[#4A5848] mt-1">
                  {t.intro.step3Desc}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-[#40813D] rounded-full" />
            <h2 className="text-[13px] font-bold tracking-wider text-[#093E06] uppercase">
              {locale === 'en' ? 'Core Values' : locale === 'ko' ? '핵심 가치' : 'Giá trị cốt lõi'}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 text-center shadow-xs">
              <BadgePercent className="w-6 h-6 text-[#40813D] mx-auto mb-2" strokeWidth={1.75} />
              <div className="text-[11.5px] font-bold text-[#093E06] leading-snug">
                {t.intro.prop1Title}
              </div>
            </div>
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 text-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#40813D] mx-auto mb-2" strokeWidth={1.75} />
              <div className="text-[11.5px] font-bold text-[#093E06] leading-snug">
                {t.intro.prop2Title}
              </div>
            </div>
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 text-center shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#40813D] mx-auto mb-2" strokeWidth={1.75} />
              <div className="text-[11.5px] font-bold text-[#093E06] leading-snug">
                {t.intro.prop3Title}
              </div>
            </div>
          </div>
        </div>

        {/* Quality Guarantee / SLA Guarantee Block */}
        <div className="px-5 pt-3 pb-6">
          <div className="bg-[#E8FDE7] rounded-[22px] p-4.5 flex gap-3.5 items-start border border-[#D4F4D3]">
            <Clock className="w-6 h-6 text-[#093E06] shrink-0 mt-0.5" strokeWidth={2} />
            <div className="text-[13px] leading-relaxed text-[#2C4A29]">
              <strong className="font-bold block mb-1 text-[#093E06]">
                {locale === 'en'
                  ? 'Transparent Service Guarantee:'
                  : locale === 'ko'
                  ? '투명한 서비스 보장:'
                  : 'Cam kết dịch vụ minh bạch:'}
              </strong>
              {t.intro.slaNotice}
            </div>
          </div>
        </div>

        {/* Bottom CTA Action */}
        <div className="p-4 bg-white border-t border-[#DDE4D9] flex-none">
          <Link
            href="/spas"
            className="w-full bg-[#40813D] hover:bg-[#357033] active:scale-[0.99] text-white rounded-full h-13 flex items-center justify-center gap-2 font-bold text-[15px] transition-all shadow-md cursor-pointer"
          >
            <span>{t.intro.viewServicesCta}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </Link>
          <div className="text-center text-[11px] text-[#6B7869] mt-2.5">
            {t.intro.branchesCountNotice}
          </div>
        </div>

      </div>
    </div>
  );
}
