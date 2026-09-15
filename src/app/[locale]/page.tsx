'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Star,
  ChevronDown,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  Compass,
  BadgePercent,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MVP_SERVICES,
  MVP_SPAS,
  MVP_REVIEWS,
  CITIES,
  MVPService,
  MVPSpa,
  formatPrice,
  formatShortPrice,
} from '@/lib/mvp-data';
import { useSearch } from '@/context/SearchContext';
import { useLocation } from '@/context/LocationContext';
import { getMvpTranslation } from '@/lib/mvp-i18n';
import BookingBottomSheet from '@/components/BookingBottomSheet';

// Helper Haversine calculation
function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function MVPPage() {
  const params = useParams();
  const router = useRouter();
  const currentLocale = (params?.locale as string) || 'vi';
  const t = getMvpTranslation(currentLocale);

  // Search & Location context
  const { searchQuery, setSearchQuery } = useSearch();
  const { userCoords, locationLabel } = useLocation();

  // Navigation / Screen states
  const [screen, setScreen] = useState<'services' | 'intro' | 'spas' | 'detail'>('services');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('duong-sinh');
  const [selectedCityId, setSelectedCityId] = useState<'hn' | 'hcm' | 'dn'>('hn');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedSpaId, setSelectedSpaId] = useState<string | null>('la-xanh-cau-giay');
  const [detailSpaId, setDetailSpaId] = useState<string | null>('la-xanh-cau-giay');

  // Filters
  const [minRating, setMinRating] = useState<boolean>(false);
  const [openNow, setOpenNow] = useState<boolean>(false);
  const [isCityMenuOpen, setIsCityMenuOpen] = useState<boolean>(false);

  // Bottom Sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [sheetInitialServiceId, setSheetInitialServiceId] = useState<string>('duong-sinh');

  // Map Iframe Refs
  const mapIframeRef = useRef<HTMLIFrameElement>(null);
  const miniMapIframeRef = useRef<HTMLIFrameElement>(null);

  // Switch to spas list when search query is typed/selected in HeaderSearch
  useEffect(() => {
    if (searchQuery.trim()) {
      setScreen('spas');
    }
  }, [searchQuery]);

  // Active service & city
  const activeService =
    MVP_SERVICES.find((s) => s.id === selectedServiceId) || MVP_SERVICES[2];
  const activeCity = CITIES.find((c) => c.id === selectedCityId) || CITIES[0];
  const detailSpa =
    MVP_SPAS.find((s) => s.id === detailSpaId) || MVP_SPAS[0];

  // Localized service details
  const getServiceInfo = (id: string) => {
    return t.services[id] || {
      name: activeService.name,
      short: activeService.short,
      dur: activeService.dur,
    };
  };

  // Filtered & Sorted Spas
  const filteredSpas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return MVP_SPAS.filter((s) => {
      if (q) {
        const matchesQuery =
          s.name.toLowerCase().includes(q) ||
          s.ward.toLowerCase().includes(q) ||
          (s.district && s.district.toLowerCase().includes(q)) ||
          s.address.toLowerCase().includes(q) ||
          s.cityName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      } else {
        if (s.city !== selectedCityId) return false;
      }

      if (minRating && s.rating < 4.8) return false;
      if (openNow && !s.open) return false;
      return true;
    }).map((s) => {
      let distanceKm: number | null = null;
      let formattedDist = s.dist;
      if (userCoords) {
        distanceKm = computeDistanceKm(userCoords.lat, userCoords.lon, s.lat, s.lng);
        formattedDist = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm}km`;
      }
      return {
        ...s,
        distanceKm,
        formattedDist,
      };
    }).sort((a, b) => {
      if (userCoords && a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      return b.rating - a.rating;
    });
  }, [selectedCityId, minRating, openNow, searchQuery, userCoords]);

  // Sync Map Pins via postMessage
  const syncMapPins = (force = false) => {
    if (!mapIframeRef.current?.contentWindow) return;
    const pins = filteredSpas.map((s) => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      label: formatShortPrice(activeService.price),
    }));

    mapIframeRef.current.contentWindow.postMessage(
      {
        source: 'gbp-map',
        type: 'setSpas',
        spas: pins,
        selectedId: selectedSpaId,
        fit: true,
      },
      '*'
    );
  };

  const syncMiniMap = () => {
    if (!miniMapIframeRef.current?.contentWindow || !detailSpa) return;
    miniMapIframeRef.current.contentWindow.postMessage(
      {
        source: 'gbp-map',
        type: 'setSpas',
        spas: [
          {
            id: detailSpa.id,
            name: detailSpa.name,
            lat: detailSpa.lat,
            lng: detailSpa.lng,
            label: formatShortPrice(activeService.price),
          },
        ],
        selectedId: detailSpa.id,
        fit: true,
      },
      '*'
    );
  };

  // Listen to iframe map clicks
  useEffect(() => {
    const handleMapMessage = (e: MessageEvent) => {
      const data = e.data || {};
      if (data.source !== 'gbp-map') return;
      if (data.type === 'ready') {
        syncMapPins(true);
        syncMiniMap();
      }
      if (data.type === 'pick') {
        setSelectedSpaId(data.id);
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, [filteredSpas, selectedSpaId, detailSpa]);

  // Update map when screen or filter changes
  useEffect(() => {
    if (screen === 'spas' && viewMode === 'map') {
      const timer = setTimeout(() => syncMapPins(), 150);
      return () => clearTimeout(timer);
    }
  }, [screen, viewMode, selectedCityId, selectedServiceId, minRating, openNow, filteredSpas]);

  const handleOpenSpas = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setScreen('spas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (spaId: string) => {
    setDetailSpaId(spaId);
    setSelectedSpaId(spaId);
    setScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) setSheetInitialServiceId(serviceId);
    setIsBottomSheetOpen(true);
  };

  return (
    <div className="w-full bg-[#FAF8F5] flex flex-col items-center justify-start p-0 sm:py-6 font-sans">
      {/* Mobile-first App Container */}
      <div className="w-full max-w-[440px] bg-[#F5F7F4] relative flex flex-col sm:rounded-[32px] sm:shadow-xl sm:border sm:border-stone-200/80 mb-0 sm:mb-10">

        {/* ========================================================= */}
        {/* SCREEN 1: SERVICES (Trang Chủ Hệ Thống Làm Đẹp Glow Beauty) */}
        {/* ========================================================= */}
        {screen === 'services' && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-200">
            {/* Elegant, Light Sub-Hero (Clean aesthetic directly under v1.0 Header) */}
            <div className="bg-white border-b border-[#E8EDE6] pt-5 pb-4 px-4 sm:px-5 flex-none sm:rounded-t-[32px]">
              <div className="flex items-center justify-between gap-3">
                <h1 className="font-bold text-[21px] sm:text-[23px] tracking-tight text-[#17231A] leading-tight m-0">
                  {t.brandTagline}
                </h1>
                <button
                  type="button"
                  onClick={() => setScreen('intro')}
                  className="text-[12px] font-semibold text-[#40813D] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 active:scale-95 shadow-2xs inline-flex items-center gap-1"
                >
                  <span>{t.introButton}</span>
                </button>
              </div>

              {/* 3 Information Value Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {t.valuePills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-700 bg-[#F5F7F4] border border-[#DDE4D9] rounded-full px-2.5 py-1 whitespace-nowrap"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#40813D] shrink-0" />
                    {pill}
                  </span>
                ))}
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

            {/* Content Body: 2-Column Grid matching mockup */}
            <div className="p-3.5 pb-10">
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
                      onClick={() => handleOpenSpas(s.id)}
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

                      {/* Bottom Info Box */}
                      <div className="px-3.5 py-3 flex items-center justify-between gap-1.5 bg-white min-h-[72px]">
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="font-bold text-[13px] text-[#093E06] group-hover:text-[#40813D] transition-colors leading-[1.25]">
                            {sInfo.name}
                          </div>
                          {sInfo.dur && (
                            <div className="text-[11px] font-medium text-[#40813D] mt-0.5">
                              {sInfo.dur}
                            </div>
                          )}
                        </div>

                        {/* Green Arrow Button with Lucide icon */}
                        <div className="w-7 h-7 rounded-full bg-[#E8FDE7] text-[#40813D] group-hover:bg-[#40813D] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: INTRO (Màn Giới Thiệu - Cách Hoạt Động)        */}
        {/* ========================================================= */}
        {screen === 'intro' && (
          <div className="flex-1 flex flex-col bg-[#F5F7F4] animate-in fade-in duration-200">
            <div className="flex-1 overflow-y-auto">
              {/* Top Green Banner */}
              <div className="bg-[#40813D] px-6 pt-12 pb-9 relative overflow-hidden text-white">
                <div className="relative">
                  <div className="relative h-9 w-36 mb-6">
                    <Image
                      src="/assets/logo-white.png"
                      alt="glow BeautyPass"
                      fill
                      priority
                      className="object-contain object-left"
                    />
                  </div>
                  <div className="text-[11px] font-bold tracking-widest text-[#E8FDE7] uppercase mb-2">
                    {t.intro.heroTag}
                  </div>
                  <h1 className="font-serif text-[32px] leading-[1.18] font-bold tracking-tight text-white mb-3 whitespace-pre-line">
                    {t.intro.heroTitle}
                  </h1>
                  <p className="text-[14px] leading-relaxed text-[#EAF7E8] max-w-[310px]">
                    {t.intro.heroDesc}
                  </p>
                </div>
              </div>

              {/* Steps Section */}
              <div className="px-6 pt-7 pb-2">
                <div className="text-[11px] font-bold tracking-widest text-[#6B7869] uppercase mb-4">
                  {t.intro.howItWorks}
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#40813D] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      1
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[15px] font-bold text-[#093E06]">
                        {t.intro.step1Title}
                      </div>
                      <div className="text-[13px] leading-relaxed text-[#4A5848] mt-0.5">
                        {t.intro.step1Desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#40813D] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      2
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[15px] font-bold text-[#093E06]">
                        {t.intro.step2Title}
                      </div>
                      <div className="text-[13px] leading-relaxed text-[#4A5848] mt-0.5">
                        {t.intro.step2Desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#40813D] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      3
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[15px] font-bold text-[#093E06]">
                        {t.intro.step3Title}
                      </div>
                      <div className="text-[13px] leading-relaxed text-[#4A5848] mt-0.5">
                        {t.intro.step3Desc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-3 gap-2.5 px-6 py-6">
                <div className="bg-white border border-[#DDE4D9] rounded-[16px] p-3 text-center shadow-xs">
                  <BadgePercent className="w-6 h-6 text-[#40813D] mx-auto mb-1.5" strokeWidth={1.75} />
                  <div className="text-[11.5px] font-bold text-[#093E06]">{t.intro.prop1Title}</div>
                </div>
                <div className="bg-white border border-[#DDE4D9] rounded-[16px] p-3 text-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-[#40813D] mx-auto mb-1.5" strokeWidth={1.75} />
                  <div className="text-[11.5px] font-bold text-[#093E06]">{t.intro.prop2Title}</div>
                </div>
                <div className="bg-white border border-[#DDE4D9] rounded-[16px] p-3 text-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-[#40813D] mx-auto mb-1.5" strokeWidth={1.75} />
                  <div className="text-[11.5px] font-bold text-[#093E06]">{t.intro.prop3Title}</div>
                </div>
              </div>

              {/* SLA Card */}
              <div className="mx-6 mb-8 bg-[#E8FDE7] rounded-[20px] p-4 flex gap-3.5 items-center border border-[#D4F4D3]">
                <Clock className="w-6 h-6 text-[#093E06] shrink-0" strokeWidth={2} />
                <div className="text-[12.5px] leading-relaxed text-[#2C4A29]">
                  {t.intro.slaNotice}
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="p-4 bg-white border-t border-[#DDE4D9] flex-none">
              <button
                type="button"
                onClick={() => setScreen('services')}
                className="w-full bg-[#40813D] hover:bg-[#357033] active:scale-[0.99] text-white rounded-full h-14 flex items-center justify-center gap-2 font-bold text-[16px] transition-all shadow-md cursor-pointer"
              >
                <span>{t.intro.viewServicesCta}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <div className="text-center text-[11px] text-[#6B7869] mt-2.5">
                {t.intro.branchesCountNotice}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: SPAS (Bản Đồ & Danh Sách Spa Điểm Đến)          */}
        {/* ========================================================= */}
        {screen === 'spas' && (
          <div id="danh-sach-spa" className="flex-1 flex flex-col h-full animate-in fade-in duration-200">
            {/* Top Green Bar */}
            <div className="bg-[#40813D] pt-5 pb-3.5 px-4 flex-none text-white">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setScreen('services')}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
                  aria-label={t.back}
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-bold text-white truncate">
                    {getServiceInfo(activeService.id).name}
                  </div>
                  <div className="text-[11.5px] text-[#E8FDE7]">
                    {formatPrice(activeService.price)} · {t.fixedPriceNotice}
                  </div>
                </div>

                {/* Tabs: Bản đồ | Danh sách */}
                <div className="flex bg-black/15 rounded-full p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-white text-[#093E06] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t.mapView}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-[#093E06] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t.listView}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-b border-[#DDE4D9] flex-none py-2 px-4 relative z-30">
              <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
                {/* City Picker Pill */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#E8FDE7] text-[#093E06] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{searchQuery ? t.allCities : activeCity.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
                  </button>

                  {/* Dropdown Menu */}
                  {isCityMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsCityMenuOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-[#DDE4D9] rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                        {CITIES.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setSelectedCityId(c.id);
                              setSearchQuery('');
                              setIsCityMenuOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] cursor-pointer ${
                              c.id === selectedCityId && !searchQuery
                                ? 'bg-[#E8FDE7] font-bold text-[#093E06]'
                                : 'text-[#3E4A3C] hover:bg-stone-50'
                            }`}
                          >
                            <span>{c.name}</span>
                            <span className="text-[11px] text-[#6B7869]">
                              {MVP_SPAS.filter((s) => s.city === c.id).length} điểm
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Rating Filter Pill */}
                <button
                  type="button"
                  onClick={() => setMinRating(!minRating)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                    minRating
                      ? 'bg-[#40813D] text-white'
                      : 'bg-[#F5F7F4] text-[#4A5848] hover:bg-[#E8EDE6]'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{t.ratingFilter}</span>
                </button>

                {/* Open Now Filter Pill */}
                <button
                  type="button"
                  onClick={() => setOpenNow(!openNow)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                    openNow
                      ? 'bg-[#40813D] text-white'
                      : 'bg-[#F5F7F4] text-[#4A5848] hover:bg-[#E8EDE6]'
                  }`}
                >
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  <span>{t.openNowFilter}</span>
                </button>

                {/* Active Search Term Pill */}
                {searchQuery && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#093E06] border border-[#40813D]/30 shrink-0">
                    <MapPin className="w-3 h-3 text-[#40813D]" />
                    <span className="max-w-[120px] truncate">{searchQuery}</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 hover:bg-emerald-200 rounded-full cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TAB VIEW 1: MAP VIEW */}
            {viewMode === 'map' && (
              <div className="flex-1 relative flex flex-col min-h-[460px]">
                {/* Map Iframe */}
                <div className="flex-1 relative w-full h-full bg-[#ECEEE9]">
                  <iframe
                    ref={mapIframeRef}
                    src="/map.html"
                    title="Bản đồ spa"
                    className="w-full h-full border-0 absolute inset-0"
                  />
                </div>

                {/* Bottom Floating Card for Selected Spa */}
                {selectedSpaId && (
                  <div className="absolute bottom-4 inset-x-3 z-30 animate-in slide-in-from-bottom-3 duration-200">
                    {(() => {
                      const selSpa =
                        filteredSpas.find((s) => s.id === selectedSpaId) ||
                        filteredSpas[0];
                      if (!selSpa) return null;

                      return (
                        <div
                          onClick={() => handleOpenDetail(selSpa.id)}
                          className="bg-white rounded-[22px] p-3.5 shadow-2xl border border-[#DDE4D9] flex gap-3 cursor-pointer hover:border-[#40813D] transition-all"
                        >
                          <div className="relative w-20 h-20 rounded-[14px] overflow-hidden bg-[#E8FDE7] shrink-0">
                            <Image
                              src={selSpa.photos[0] || '/spas/spa_thumb_1.jpg'}
                              alt={selSpa.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-[14px] text-[#093E06] truncate">
                                  {selSpa.name}
                                </h4>
                                <span className="text-[10px] font-bold text-[#40813D] bg-[#E8FDE7] px-2 py-0.5 rounded-full shrink-0">
                                  {selSpa.tier === 'Certified' ? t.certifiedBadge : t.verifiedBadge}
                                </span>
                              </div>
                              <div className="text-[11.5px] text-[#6B7869] truncate mt-0.5">
                                {selSpa.address}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-1 text-[12px]">
                              <div className="flex items-center gap-1 font-bold text-[#093E06]">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{selSpa.rating}</span>
                                <span className="text-[#6B7869] font-normal">
                                  ({selSpa.reviews})
                                </span>
                              </div>
                              <div className="font-bold text-[#40813D] text-[12px]">
                                {selSpa.formattedDist}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW 2: LIST VIEW */}
            {viewMode === 'list' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-12">
                {filteredSpas.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 text-sm">
                    <p>{t.noSpasFound}</p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-3 px-4 py-2 rounded-full bg-[#40813D] text-white text-xs font-semibold cursor-pointer"
                      >
                        {t.clearFilter}
                      </button>
                    )}
                  </div>
                ) : (
                  filteredSpas.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleOpenDetail(s.id)}
                      className="bg-white rounded-[20px] p-3.5 border border-[#DDE4D9] flex gap-3.5 cursor-pointer hover:border-[#40813D] hover:shadow-md transition-all active:scale-[0.99]"
                    >
                      <div className="relative w-22 h-22 rounded-[16px] overflow-hidden bg-[#E8FDE7] shrink-0">
                        <Image
                          src={s.photos[0] || '/spas/spa_thumb_1.jpg'}
                          alt={s.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[10px] font-bold text-[#093E06]">
                          {s.tier === 'Certified' ? 'SOP' : 'OK'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-[14.5px] text-[#093E06] truncate">
                              {s.name}
                            </h4>
                            <span className="text-[11.5px] font-bold text-[#40813D] shrink-0">
                              {s.formattedDist}
                            </span>
                          </div>
                          <div className="text-[11.5px] text-[#6B7869] line-clamp-1 mt-0.5">
                            {s.address}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                          <div className="flex items-center gap-1 text-[11.5px] font-bold text-[#093E06]">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{s.rating}</span>
                            <span className="text-[#6B7869] font-normal">
                              ({s.reviews})
                            </span>
                          </div>

                          <div className="text-[12.5px] font-bold text-[#093E06]">
                            {formatPrice(activeService.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: SPA DETAIL (Chi Tiết Chi Nhánh & Đặt Lịch)       */}
        {/* ========================================================= */}
        {screen === 'detail' && (
          <div className="flex-1 flex flex-col bg-[#F5F7F4] animate-in fade-in duration-200">
            <div className="flex-1 overflow-y-auto">
              {/* Photo Gallery with Back Button */}
              <div className="relative">
                <div className="flex gap-1 overflow-x-auto bg-[#DDE4D9] no-scrollbar">
                  {detailSpa.photos.map((ph, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 w-64 h-52 relative bg-[#E8FDE7]"
                    >
                      <Image
                        src={ph}
                        alt={`${detailSpa.name} photo ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setScreen('spas')}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                  aria-label={t.back}
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
                </button>

                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {detailSpa.photos.length} ảnh
                </div>
              </div>

              {/* Spa Info Header */}
              <div className="p-5 bg-white border-b border-[#DDE4D9]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-[#40813D] bg-[#E8FDE7] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      {detailSpa.tier === 'Certified' ? t.certifiedBadge : t.verifiedBadge}
                    </span>
                    <h2 className="text-[20px] font-bold text-[#093E06] leading-tight">
                      {detailSpa.name}
                    </h2>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-[14px] font-bold text-[#093E06] justify-end">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{detailSpa.rating}</span>
                    </div>
                    <div className="text-[11px] text-[#6B7869]">
                      {detailSpa.reviews} đánh giá
                    </div>
                  </div>
                </div>

                <div className="text-[13px] text-[#4A5848] mt-2 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#40813D] shrink-0 mt-0.5" />
                  <span>{detailSpa.address}</span>
                </div>
              </div>

              {/* Mini Map */}
              <div className="p-4 bg-white border-b border-[#DDE4D9]">
                <div className="text-[11.5px] font-bold text-[#6B7869] uppercase tracking-wider mb-2.5">
                  Vị trí trên bản đồ
                </div>
                <div className="h-36 rounded-[16px] overflow-hidden border border-[#DDE4D9] relative bg-[#ECEEE9]">
                  <iframe
                    ref={miniMapIframeRef}
                    src="/map.html"
                    title={`Bản đồ ${detailSpa.name}`}
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              {/* Opening Hours */}
              <div className="p-4 bg-white border-b border-[#DDE4D9]">
                <div className="text-[11.5px] font-bold text-[#6B7869] uppercase tracking-wider mb-2">
                  Giờ hoạt động
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#093E06] font-semibold">{detailSpa.today}</span>
                  <span className="text-[#40813D] font-bold">
                    {detailSpa.open ? 'Đang mở cửa' : 'Đã đóng cửa'}
                  </span>
                </div>
              </div>

              {/* Real Reviews */}
              <div className="p-4 bg-white mb-6">
                <div className="text-[11.5px] font-bold text-[#6B7869] uppercase tracking-wider mb-3">
                  Đánh giá từ khách hàng ({MVP_REVIEWS.length})
                </div>
                <div className="space-y-3">
                  {MVP_REVIEWS.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[16px] bg-[#F5F7F4] border border-[#E8EDE6]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#40813D] text-white flex items-center justify-center font-bold text-[12px]">
                            {r.initial}
                          </div>
                          <div>
                            <span className="text-[13px] font-bold text-[#093E06]">{r.name}</span>
                            {r.verifiedPhone && (
                              <span className="text-[10px] text-[#40813D] ml-1.5 font-semibold">✓ Đã xác minh</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-[#6B7869]">{r.when}</span>
                      </div>
                      <p className="text-[12.5px] text-[#4A5848] mt-2 leading-relaxed">
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Sheet for Booking */}
            <div className="p-4 bg-white border-t border-[#DDE4D9] flex-none">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <div className="text-[11px] text-[#6B7869]">{t.serviceDetails}</div>
                  <div className="text-[14px] font-bold text-[#093E06]">
                    {getServiceInfo(activeService.id).name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-bold text-[#093E06]">
                    {formatPrice(activeService.price)}
                  </div>
                  <div className="text-[10.5px] text-[#40813D] font-medium">
                    {t.fixedPriceNotice}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(activeService.id)}
                className="w-full bg-[#40813D] hover:bg-[#357033] active:scale-[0.99] text-white rounded-full h-13 flex items-center justify-center gap-2 font-bold text-[15.5px] transition-all shadow-md cursor-pointer"
              >
                <span>{t.bookNow}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        )}

        {/* Booking Bottom Sheet Modal */}
        <BookingBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          initialServiceId={sheetInitialServiceId}
          spaName={detailSpa.name}
          spaAddress={detailSpa.address}
        />
      </div>
    </div>
  );
}
