'use client';

import React from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
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
          <span className="font-bold text-[16px] text-white tracking-tight">
            {t.introButton}
          </span>
          <div className="w-8" />
        </div>

        {/* Hero Section */}
        <div className="bg-[#40813D] px-6 pt-2 pb-8 text-white relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[12px] font-semibold tracking-wide text-[#E8FDE7] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E8FDE7]" />
            <span>{t.intro.heroTag}</span>
          </div>

          <h1 className="font-sans text-[26px] sm:text-[28px] font-extrabold text-white leading-tight tracking-tight mb-2.5">
            {t.intro.heroTitle}
          </h1>

          <p className="text-[15px] leading-relaxed text-[#EAF7E8] max-w-[340px]">
            {t.intro.heroDesc}
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
            <div className="text-center">
              <div className="text-[20px] font-extrabold text-white">500+</div>
              <div className="text-[12px] text-[#D4F4D3] font-medium">
                {locale === 'en' ? 'Verified Spas' : locale === 'ko' ? '제휴 스파' : 'Spa đối tác'}
              </div>
            </div>
            <div className="text-center border-x border-white/15">
              <div className="text-[20px] font-extrabold text-white">39K - 199K</div>
              <div className="text-[12px] text-[#D4F4D3] font-medium">
                {locale === 'en' ? 'Fixed Rates' : locale === 'ko' ? '정찰제 가격' : 'Đồng giá cố định'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-extrabold text-white">100%</div>
              <div className="text-[12px] text-[#D4F4D3] font-medium">
                {locale === 'en' ? 'Quality Verified' : locale === 'ko' ? '품질 검증' : 'Kiểm định chất lượng'}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow: 3 Bước Trải Nghiệm */}
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#40813D] rounded-full" />
            <h2 className="text-[14px] font-bold tracking-wider text-[#093E06] uppercase">
              {t.intro.howItWorks}
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="bg-white rounded-[20px] p-4 border border-[#DDE4D9] flex gap-3.5 items-start shadow-xs">
              <div className="w-8.5 h-8.5 rounded-full bg-[#E8FDE7] text-[#093E06] flex items-center justify-center text-sm font-bold shrink-0 border border-[#D4F4D3]">
                1
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="text-[15.5px] font-bold text-[#093E06]">
                  {t.intro.step1Title}
                </div>
                <div className="text-[13.5px] leading-relaxed text-[#4A5848] mt-1">
                  {t.intro.step1Desc}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[20px] p-4 border border-[#DDE4D9] flex gap-3.5 items-start shadow-xs">
              <div className="w-8.5 h-8.5 rounded-full bg-[#E8FDE7] text-[#093E06] flex items-center justify-center text-sm font-bold shrink-0 border border-[#D4F4D3]">
                2
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="text-[15.5px] font-bold text-[#093E06]">
                  {t.intro.step2Title}
                </div>
                <div className="text-[13.5px] leading-relaxed text-[#4A5848] mt-1">
                  {t.intro.step2Desc}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[20px] p-4 border border-[#DDE4D9] flex gap-3.5 items-start shadow-xs">
              <div className="w-8.5 h-8.5 rounded-full bg-[#E8FDE7] text-[#093E06] flex items-center justify-center text-sm font-bold shrink-0 border border-[#D4F4D3]">
                3
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="text-[15.5px] font-bold text-[#093E06]">
                  {t.intro.step3Title}
                </div>
                <div className="text-[13.5px] leading-relaxed text-[#4A5848] mt-1">
                  {t.intro.step3Desc}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="px-5 pt-4 pb-7 sm:pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-[#40813D] rounded-full" />
            <h2 className="text-[14px] font-bold tracking-wider text-[#093E06] uppercase">
              {locale === 'en' ? 'Core Values' : locale === 'ko' ? '핵심 가치' : 'Giá trị cốt lõi'}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 text-center shadow-xs">
              <BadgePercent className="w-6 h-6 text-[#40813D] mx-auto mb-2" strokeWidth={1.75} />
              <div className="text-[13px] font-bold text-[#093E06] leading-snug">
                {t.intro.prop1Title}
              </div>
            </div>
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 text-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#40813D] mx-auto mb-2" strokeWidth={1.75} />
              <div className="text-[13px] font-bold text-[#093E06] leading-snug">
                {t.intro.prop2Title}
              </div>
            </div>
            <div className="bg-white border border-[#DDE4D9] rounded-[18px] p-3.5 text-center shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#40813D] mx-auto mb-2" strokeWidth={1.75} />
              <div className="text-[13px] font-bold text-[#093E06] leading-snug">
                {t.intro.prop3Title}
              </div>
            </div>
          </div>
        </div>

        {/* FOR SPA PARTNERS SECTION (Thu hút & tạo niềm tin cho các chủ Spa muốn gia nhập) */}
        <div className="px-5 pt-3 pb-8 border-t border-[#E8EDE6] mt-1 bg-[#F9FAF8]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-[#236B38] rounded-full" />
            <h2 className="text-[14px] font-bold tracking-wider text-[#093E06] uppercase">
              {locale === 'en'
                ? 'For Spa Partners'
                : locale === 'ko'
                ? '스파 파트너 제휴'
                : 'Dành Cho Chủ Spa Đối Tác'}
            </h2>
          </div>

          {/* Value proposition card for Spa Owners */}
          <div className="bg-gradient-to-br from-[#093E06] to-[#1D5A2E] rounded-[24px] p-5 text-white shadow-md relative overflow-hidden mb-4">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11.5px] font-bold tracking-wide text-[#E8FDE7] uppercase mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {locale === 'en'
                    ? 'Glow Partner Network'
                    : locale === 'ko'
                    ? 'Glow 파트너스'
                    : 'Mạng Lưới Đối Tác Glow'}
                </span>
              </div>
              <h3 className="text-[18px] sm:text-[19px] font-extrabold leading-tight text-white mb-2">
                {locale === 'en'
                  ? 'Maximize Empty Bed Capacity & Predictable Revenue'
                  : locale === 'ko'
                  ? '비수기 공실 최소화 & 안정적 매출 창출'
                  : 'Tối Ưu Giường Trống & Tăng Trưởng Doanh Thu'}
              </h3>
              <p className="text-[13px] leading-relaxed text-emerald-100/90 mb-4">
                {locale === 'en'
                  ? 'Connect with thousands of verified corporate customers looking for standard self-care services. Zero setup fee, direct Zalo appointment dispatch.'
                  : locale === 'ko'
                  ? '규격화된 케어를 찾는 수천 명의 직장인 고객과 직접 연결됩니다. 초기 가입비 0원, Zalo 실시간 예약 연동.'
                  : 'Kết nối trực tiếp với hàng chục nghìn khách văn phòng văn minh. Lấp đầy khung giờ vắng (10h - 16h), không phí gia nhập, tiếp nhận khách qua Zalo tự động.'}
              </p>

              {/* 4 Key Partner Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20">
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
                  <div className="text-[18px] font-black text-amber-300">+45%</div>
                  <div className="text-[11.5px] text-emerald-100 font-medium">
                    {locale === 'en' ? 'Off-peak Fill Rate' : locale === 'ko' ? '비수기 가동률' : 'Lấp đầy giờ thấp điểm'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
                  <div className="text-[18px] font-black text-white">15.000+</div>
                  <div className="text-[11.5px] text-emerald-100 font-medium">
                    {locale === 'en' ? 'Monthly Bookings' : locale === 'ko' ? '월간 예약 건수' : 'Lượt đặt Zalo / tháng'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
                  <div className="text-[18px] font-black text-amber-300">0 VNĐ</div>
                  <div className="text-[11.5px] text-emerald-100 font-medium">
                    {locale === 'en' ? 'Initial Setup Cost' : locale === 'ko' ? '초기 등록 비용' : 'Phí gia nhập ban đầu'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
                  <div className="text-[18px] font-black text-white">98.6%</div>
                  <div className="text-[11.5px] text-emerald-100 font-medium">
                    {locale === 'en' ? 'Repeat Rate' : locale === 'ko' ? '재방문율' : 'Khách quay lại'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials from Partner Spa Owners */}
          <div className="mb-4">
            <h4 className="text-[13.5px] font-bold text-[#093E06] mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#236B38]" />
              <span>
                {locale === 'en'
                  ? 'Partner Spa Testimonials'
                  : locale === 'ko'
                  ? '제휴 스파 대표님들의 후기'
                  : 'Chủ Spa Đối Tác Nói Gì Về Glow?'}
              </span>
            </h4>

            <div className="space-y-2.5">
              {/* Testimonial 1 */}
              <div className="bg-white border border-[#DDE4D9] rounded-[20px] p-3.5 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#093E06] font-bold text-[13px] flex items-center justify-center shrink-0">
                    MP
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#093E06] leading-tight">
                      {locale === 'en' ? 'Ms. Mai Phuong' : locale === 'ko' ? '마이 프엉 대표' : 'Chị Mai Phương'}
                    </div>
                    <div className="text-[11.5px] text-[#6B7869]">
                      {locale === 'en' ? 'Founder, An Nhien Duong Sinh (Hanoi)' : locale === 'ko' ? '안니엔 두엉신 스파 대표 (하노이)' : 'Chủ sáng lập An Nhiên Dưỡng Sinh (Hà Nội)'}
                    </div>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#4A5848] leading-relaxed italic">
                  {locale === 'en'
                    ? '"Since joining Glow, our midday slot from 11:30 to 14:00 is consistently 85% occupied. Office customers are polite, pay standard rates, and become regular weekly clients."'
                    : locale === 'ko'
                    ? '"Glow 제휴 이후 점심 시간대(11:30~14:00) 가동률이 85%까지 상승했습니다. 직장인 고객들이 정찰제로 깔끔하게 이용하고 주간 단골이 됩니다."'
                    : '"Từ ngày liên kết với Glow, các giường spa vào khung giờ trưa từ 11h-14h luôn kín lịch. Khách văn phòng rất lịch sự, thanh toán đúng giá và tip thêm cho nhân viên."'}
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white border border-[#DDE4D9] rounded-[20px] p-3.5 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8FDE7] text-[#093E06] font-bold text-[13px] flex items-center justify-center shrink-0">
                    HL
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#093E06] leading-tight">
                      {locale === 'en' ? 'Mr. Hoang Long' : locale === 'ko' ? '황 롱 이사' : 'Anh Hoàng Long'}
                    </div>
                    <div className="text-[11.5px] text-[#6B7869]">
                      {locale === 'en' ? 'COO, Moc Tra Beauty & Hair Spa (HCMC)' : locale === 'ko' ? '목짜 뷰티 & 헤어스파 운영총괄 (호치민)' : 'Quản lý Mộc Trà Beauty & Hair Spa (TP.HCM)'}
                    </div>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#4A5848] leading-relaxed italic">
                  {locale === 'en'
                    ? '"Glow does not pressure us with price-slashing discounts. Instead, they elevate standardized quality. Our monthly revenue grew 25-30% steadily without ad spend."'
                    : locale === 'ko'
                    ? '"Glow는 출혈 할인 강요 없이 규격화된 품질 관리에 집중합니다. 별도 광고비 없이 매월 25-30%의 안정적인 매출 성장을 달성했습니다."'
                    : '"Glow không ép giảm giá phá giá mà tập trung chuẩn hoá chất lượng. Mỗi tháng spa có thêm từ 120-150 lượt khách quen mới từ hệ thống mà không tốn tiền chạy ads."'}
                </p>
              </div>
            </div>
          </div>

          {/* Simple 3-step Onboarding Process */}
          <div className="bg-[#F0F5EE] rounded-[20px] p-4 border border-[#DCE5D8] mb-4">
            <h4 className="text-[13px] font-bold text-[#093E06] mb-3">
              {locale === 'en' ? '3 Simple Steps to Become a Partner:' : locale === 'ko' ? '간편한 3단계 제휴 절차:' : '3 Bước Tham Gia Mạng Lưới Glow:'}
            </h4>
            <div className="space-y-2 text-[12.5px] text-[#334231]">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#236B38] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>{locale === 'en' ? 'Verify facility hygiene, ergonomic wash basins & therapist skills.' : locale === 'ko' ? '위생 시설, 인체공학 샴푸대 및 테라피스트 역량 심사' : 'Thẩm định không gian vệ sinh, bồn gội chuẩn & tay nghề KTV.'}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#236B38] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>{locale === 'en' ? 'Commit to transparent fixed prices with zero hidden upselling.' : locale === 'ko' ? '정찰제 준수 및 무분별한 코스 강매 금지 협약 체결' : 'Ký cam kết tuân thủ đúng giá niêm yết, không chèo kéo bán thẻ.'}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#236B38] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>{locale === 'en' ? 'Connect Zalo Booking Hub and receive confirmed clients instantly.' : locale === 'ko' ? 'Zalo 실시간 예약 시스템 연동 및 즉각적인 고객 유치 시작' : 'Kết nối Zalo Hotline tiếp nhận khách đặt lịch tự động từ Glow.'}</span>
              </div>
            </div>
          </div>

          {/* CTA Button for Spa Owners */}
          <a
            href="https://zalo.me/0359178342"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#236B38] hover:bg-[#1D5A2E] active:scale-[0.99] text-white rounded-full h-12 flex items-center justify-center gap-2 font-bold text-[15px] shadow-md transition-all cursor-pointer"
          >
            <Image
              src="/brand/Logo-Zalo-App-Rec.webp"
              alt="Zalo"
              width={18}
              height={18}
              className="rounded-[4px] shrink-0 object-contain shadow-2xs"
            />
            <span>
              {locale === 'en'
                ? 'Register Spa Partnership via Zalo'
                : locale === 'ko'
                ? '스파 파트너 제휴 문의 (Zalo)'
                : 'Đăng Ký Hợp Tác Spa Qua Zalo'}
            </span>
          </a>
        </div>

      </div>
    </div>
  );
}
