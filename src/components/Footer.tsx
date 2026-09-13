'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BrandWordmark } from './BrandLogo'
import { ShieldCheck, Sparkles, MessageCircle, Phone, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')
  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <footer className="bg-[#40813D] text-white pt-12 pb-16 border-t border-white/15">
      <div className="max-w-md sm:max-w-xl md:max-w-4xl mx-auto px-5 sm:px-6 space-y-10">
        {/* BRAND IDENTITY & APP STORE ROW */}
        <div className="space-y-4">
          <Link href="/" className="inline-block group" aria-label="glow beauty pass">
            <BrandWordmark className="h-10 sm:h-11 text-white hover:opacity-90 transition-opacity drop-shadow-xs" />
          </Link>
          <p className="text-xs sm:text-sm text-emerald-50/90 max-w-md leading-relaxed font-normal">
            {t('tagline')}
          </p>

          {/* OFFICIAL APP STORE & GOOGLE PLAY BADGES (Exact from Glow Explore) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://apps.apple.com/us/app/glow-home-massage-beauty/id6443428819"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity active:scale-95 drop-shadow-sm inline-block"
            >
              <Image
                src="/assets/images/app-store.svg"
                alt="Download on the App Store"
                width={140}
                height={42}
                className="w-[140px] h-[42px] object-contain"
                unoptimized
              />
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.glow.mobileApp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity active:scale-95 drop-shadow-sm inline-block"
            >
              <Image
                src="/assets/images/google-play.svg"
                alt="Get it on Google Play"
                width={140}
                height={42}
                className="w-[140px] h-[42px] object-contain"
                unoptimized
              />
            </a>
          </div>
        </div>

        {/* NAVIGATION LINKS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/20 text-xs sm:text-[13px]">
          {/* Col 1: Dịch vụ đồng giá */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white">
              {t('colPackages')}
            </h4>
            <ul className="space-y-2 text-emerald-100/90">
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  {t('pkg1')}
                </Link>
              </li>
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  {t('pkg2')}
                </Link>
              </li>
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  {t('pkg3')}
                </Link>
              </li>
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  {t('pkg4')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Khu Vực Cầu Giấy */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white">
              {t('colCoverage')}
            </h4>
            <ul className="space-y-2 text-emerald-100/90">
              <li>
                <Link href="/#danh-sach-spa" className="hover:text-white transition-colors">
                  {t('wardDichVong')}
                </Link>
              </li>
              <li>
                <Link href="/#danh-sach-spa" className="hover:text-white transition-colors">
                  {t('wardDuyTan')}
                </Link>
              </li>
              <li>
                <Link href="/#danh-sach-spa" className="hover:text-white transition-colors">
                  {t('wardHoangDaoThuy')}
                </Link>
              </li>
              <li>
                <Link href="/#danh-sach-spa" className="hover:text-white transition-colors">
                  {t('wardVuPhamHam')}
                </Link>
              </li>
              <li>
                <Link href="/#danh-sach-spa" className="hover:text-white transition-colors">
                  {t('wardToHieu')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cam kết & Hỗ trợ */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white">
              {t('colCommitment')}
            </h4>
            <ul className="space-y-2 text-emerald-100/90">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t('commitNoExtra')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t('commitSop')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t('commitNoUpsell')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t('commitZalo5min')}</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={zaloHubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-amber-200 hover:text-white transition-colors bg-black/15 px-3 py-1.5 rounded-full border border-white/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('hotlineZaloLabel')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & ECOSYSTEM NOTE */}
        <div className="pt-6 border-t border-white/20 text-[11px] text-emerald-50/75 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            {t('copyright')}
          </p>
          <div className="flex items-center gap-4 text-emerald-50/80">
            <span>{t('sopBadge')}</span>
            <span>•</span>
            <span>{t('privacyBadge')}</span>
            <span>•</span>
            <span>{t('locationBadge')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
