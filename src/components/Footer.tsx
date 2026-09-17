'use client';

import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { BrandWordmark } from './BrandLogo';
import { ShieldCheck, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();
  const zaloHubLink =
    process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0359178342';

  // Không hiển thị Footer trên trang /spas để màn hình bản đồ full viewport 100% không bị cuộn
  if (pathname?.includes('/spas')) {
    return null;
  }

  return (
    <footer className="bg-[#40813D] text-white pt-8 pb-10 sm:py-10 border-t border-white/15 font-sans">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Main Row: Brand Info & Clean Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Brand Wordmark & Concise Tagline */}
          <div className="space-y-1.5 max-w-md">
            <Link href="/" className="inline-block group" aria-label="Glow Beauty Pass">
              <BrandWordmark className="h-8 sm:h-9 w-auto text-white hover:opacity-90 transition-opacity drop-shadow-xs" />
            </Link>
            <p className="text-[13.5px] sm:text-[14px] text-emerald-100/90 leading-relaxed font-normal">
              {t.has('shortTagline') ? t('shortTagline') : t('tagline')}
            </p>
          </div>

          {/* Clean Horizontal Navigation Pills */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[13px] font-semibold text-white transition-colors"
            >
              {t.has('navHome') ? t('navHome') : 'Home'}
            </Link>
            <Link
              href="/about"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[13px] font-semibold text-white transition-colors"
            >
              {t.has('navAbout') ? t('navAbout') : 'About Us'}
            </Link>
            <Link
              href="/spas"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[13px] font-semibold text-white transition-colors"
            >
              {t.has('navSpas') ? t('navSpas') : 'Find Spas'}
            </Link>
            <a
              href={zaloHubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#093E06] hover:bg-emerald-50 text-[13px] font-bold shadow-xs transition-all active:scale-95"
            >
              <Image
                src="/brand/Logo-Zalo-App-Rec.webp"
                alt="Zalo"
                width={14}
                height={14}
                className="w-3.5 h-3.5 rounded-xs object-contain"
              />
              <span>{t.has('navContact') ? t('navContact') : 'Zalo: 0359 178 342'}</span>
            </a>
          </nav>
        </div>

        {/* Compact Trust & Value Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15 text-[12.5px] sm:text-[13px] text-emerald-100/85">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('commitNoExtra')}</span>
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('commitSop')}</span>
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <a href="tel:0359178342" className="hover:text-white transition-colors">
                0359 178 342
              </a>
            </span>
          </div>

          {/* Official App Download Badges (Compact) */}
          <div className="flex items-center gap-2">
            <a
              href="https://apps.apple.com/us/app/glow-home-massage-beauty/id6443428819"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity active:scale-95 inline-block"
              aria-label="App Store"
            >
              <Image
                src="/assets/images/app-store.svg"
                alt="App Store"
                width={100}
                height={30}
                className="h-[26px] w-auto object-contain"
                unoptimized
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.glow.mobileApp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity active:scale-95 inline-block"
              aria-label="Google Play"
            >
              <Image
                src="/assets/images/google-play.svg"
                alt="Google Play"
                width={100}
                height={30}
                className="h-[26px] w-auto object-contain"
                unoptimized
              />
            </a>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-100/65 text-center sm:text-left">
          <p>© 2026 Glow Vietnam. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>{t('sopBadge')}</span>
            <span>•</span>
            <span>{t('privacyBadge')}</span>
            <span>•</span>
            <span>{t('locationBadge')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
