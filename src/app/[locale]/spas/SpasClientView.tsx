'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import {
  ArrowLeft,
  Star,
  ChevronDown,
  MapPin,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Store,
  ShieldCheck,
} from 'lucide-react';
import {
  MVP_SERVICES,
  MVP_SPAS,
  CITIES,
  formatPrice,
} from '@/lib/mvp-data';
import { useSearch } from '@/context/SearchContext';
import { useLocation } from '@/context/LocationContext';
import { getMvpTranslation } from '@/lib/mvp-i18n';
import BookingBottomSheet from '@/components/BookingBottomSheet';
import GlowGoogleMap from '@/components/GlowGoogleMap';

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

const CITY_CENTERS: Record<'hn' | 'hcm' | 'dn', { lat: number; lng: number }> = {
  hn: { lat: 21.0333, lng: 105.7925 }, // Cầu Giấy, Hà Nội
  hcm: { lat: 10.7769, lng: 106.7009 }, // Bến Nghé, Quận 1, TP.HCM
  dn: { lat: 16.0544, lng: 108.2022 }, // Hải Châu, Đà Nẵng
};

const KNOWN_AREAS: { keywords: string[]; coords: { lat: number; lng: number } }[] = [
  { keywords: ['dinh cong', 'định công', 'ward liet'], coords: { lat: 20.984503, lng: 105.835853 } },
  { keywords: ['cau giay', 'cầu giấy'], coords: { lat: 21.0333, lng: 105.7925 } },
  { keywords: ['dich vong', 'dịch vọng'], coords: { lat: 21.0313, lng: 105.7934 } },
  { keywords: ['yen hoa', 'yên hòa'], coords: { lat: 21.0182, lng: 105.7950 } },
  { keywords: ['trung hoa', 'trung hòa'], coords: { lat: 21.0118, lng: 105.8010 } },
  { keywords: ['dong da', 'đống đa'], coords: { lat: 21.0181, lng: 105.8277 } },
  { keywords: ['ba dinh', 'ba đình'], coords: { lat: 21.0341, lng: 105.8242 } },
  { keywords: ['hoan kiem', 'hoàn kiếm', 'ho guom', 'hồ gươm'], coords: { lat: 21.0285, lng: 105.8542 } },
  { keywords: ['tay ho', 'tây hồ', 'ho tay', 'hồ tây'], coords: { lat: 21.0718, lng: 105.8227 } },
  { keywords: ['hai ba trung', 'hai bà trưng'], coords: { lat: 21.0069, lng: 105.8524 } },
  { keywords: ['thanh xuan', 'thanh xuân'], coords: { lat: 20.9980, lng: 105.8058 } },
  { keywords: ['hoang mai', 'hoàng mai'], coords: { lat: 20.9754, lng: 105.8527 } },
  { keywords: ['ha dong', 'hà đông'], coords: { lat: 20.9634, lng: 105.7766 } },
  { keywords: ['nam tu liem', 'nam từ liêm', 'my dinh', 'mỹ đình'], coords: { lat: 21.0177, lng: 105.7645 } },
  { keywords: ['bac tu liem', 'bắc từ liêm'], coords: { lat: 21.0664, lng: 105.7616 } },
  { keywords: ['long bien', 'long biên'], coords: { lat: 21.0428, lng: 105.8890 } },
  { keywords: ['quan 1', 'quận 1', 'ben nghe', 'bến nghé'], coords: { lat: 10.7756, lng: 106.7004 } },
  { keywords: ['quan 3', 'quận 3'], coords: { lat: 10.7844, lng: 106.6845 } },
  { keywords: ['hai chau', 'hải châu'], coords: { lat: 16.0592, lng: 108.2208 } },
];

interface SpasClientViewProps {
  locale: string;
}

export default function SpasClientView({ locale }: SpasClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = getMvpTranslation(locale);

  // Initial params
  const initialServiceId = searchParams.get('service') || 'duong-sinh';
  const initialCityId = (searchParams.get('city') as 'hn' | 'hcm' | 'dn') || 'hn';
  const initialViewMode = searchParams.get('view') === 'list' ? 'list' : 'map';

  // State
  const { searchQuery, setSearchQuery } = useSearch();
  const { userCoords, locationLabel, setCustomLocation } = useLocation();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedCityId, setSelectedCityId] = useState<'hn' | 'hcm' | 'dn'>(initialCityId);
  const [viewMode, setViewMode] = useState<'map' | 'list'>(initialViewMode);
  const [selectedSpaId, setSelectedSpaId] = useState<string | null>('la-xanh-cau-giay');
  const [minRating, setMinRating] = useState<boolean>(false);
  const [openNow, setOpenNow] = useState<boolean>(false);
  const [isCityMenuOpen, setIsCityMenuOpen] = useState<boolean>(false);

  // Booking Bottom Sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [sheetSpaId, setSheetSpaId] = useState<string>('la-xanh-cau-giay');
  const [sheetInitialServiceId, setSheetInitialServiceId] = useState<string>(initialServiceId);

  // Synchronize URL search params: q, lat, lng/lon
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && qParam !== searchQuery) {
      setSearchQuery(qParam);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

  // Parse explicit coordinates from URL (e.g. ?lat=20.984503&lng=105.835853 or ?lat=20984503&lng=105835853)
  const urlCoords = useMemo(() => {
    const rawLat = searchParams.get('lat');
    const rawLng = searchParams.get('lng') || searchParams.get('lon');
    if (!rawLat || !rawLng) return null;
    let pLat = parseFloat(rawLat);
    let pLng = parseFloat(rawLng);
    if (pLat > 1000) pLat = pLat / 1e6;
    if (pLng > 1000) pLng = pLng / 1e6;
    if (!isNaN(pLat) && !isNaN(pLng)) {
      return { lat: pLat, lng: pLng };
    }
    return null;
  }, [searchParams]);

  // Match keyword in search query against known districts / wards
  const queryMatchedCoords = useMemo(() => {
    const q = (searchQuery || searchParams.get('q') || '').trim().toLowerCase();
    if (!q) return null;
    for (const area of KNOWN_AREAS) {
      if (area.keywords.some((k) => q.includes(k))) {
        return area.coords;
      }
    }
    return null;
  }, [searchQuery, searchParams]);

  // Dynamic geocoding for arbitrary address search
  const [geocodedCoords, setGeocodedCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const q = (searchQuery || searchParams.get('q') || '').trim();
    if (!q || urlCoords || queryMatchedCoords) {
      setGeocodedCoords(null);
      return;
    }

    let isCancelled = false;
    const timer = setTimeout(() => {
      const g = typeof window !== 'undefined' ? (window as any).google?.maps : null;
      if (!g?.Geocoder) return;
      const geocoder = new g.Geocoder();
      geocoder.geocode(
        { address: q, componentRestrictions: { country: 'vn' } },
        (results: any[], status: any) => {
          if (isCancelled) return;
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            const loc = results[0].geometry.location;
            const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
            const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
            setGeocodedCoords({ lat, lng });
          }
        }
      );
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, searchParams, urlCoords, queryMatchedCoords]);

  // Active search reference coordinate (Pink pulsing pin on map)
  const activeSearchCenter = useMemo(() => {
    if (urlCoords) return urlCoords;
    if (queryMatchedCoords) return queryMatchedCoords;
    if (geocodedCoords) return geocodedCoords;
    if (userCoords) return { lat: userCoords.lat, lng: userCoords.lon };
    return CITY_CENTERS[selectedCityId] || CITY_CENTERS.hn;
  }, [urlCoords, queryMatchedCoords, geocodedCoords, userCoords, selectedCityId]);

  const searchTitle = useMemo(() => {
    const q = (searchQuery || searchParams.get('q') || '').trim();
    if (q) return q;
    if (locationLabel && locationLabel !== 'Bật vị trí') return locationLabel;
    if (selectedCityId === 'hn') return 'Cầu Giấy, Hà Nội';
    if (selectedCityId === 'hcm') return 'Quận 1, TP.HCM';
    return 'Hải Châu, Đà Nẵng';
  }, [searchQuery, searchParams, locationLabel, selectedCityId]);

  // Hide footer when in full-screen map mode
  useEffect(() => {
    const isFullScreen = viewMode === 'map';
    if (isFullScreen) {
      document.body.classList.add('hide-footer-for-map');
    } else {
      document.body.classList.remove('hide-footer-for-map');
    }
    return () => {
      document.body.classList.remove('hide-footer-for-map');
    };
  }, [viewMode]);

  const activeService =
    MVP_SERVICES.find((s) => s.id === selectedServiceId) || MVP_SERVICES[2];
  const activeCity = CITIES.find((c) => c.id === selectedCityId) || CITIES[0];

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

    // Check if query directly matches any spa by name or address
    const directMatches = q
      ? MVP_SPAS.filter((s) => {
          return (
            s.name.toLowerCase().includes(q) ||
            s.ward.toLowerCase().includes(q) ||
            (s.district && s.district.toLowerCase().includes(q)) ||
            s.address.toLowerCase().includes(q) ||
            s.cityName.toLowerCase().includes(q)
          );
        })
      : [];

    // If text search directly matched spas, use them.
    // Otherwise, show all spas in the selected city sorted by distance to activeSearchCenter!
    const spasToFilter =
      q && directMatches.length > 0
        ? directMatches
        : MVP_SPAS.filter((s) => s.city === selectedCityId);

    const refCoords = activeSearchCenter;

    return spasToFilter
      .filter((s) => {
        if (minRating && s.rating < 4.8) return false;
        if (openNow && !s.open) return false;
        return true;
      })
      .map((s) => {
        let distanceKm: number | null = null;
        let formattedDist = s.dist;
        if (refCoords) {
          distanceKm = computeDistanceKm(refCoords.lat, refCoords.lng, s.lat, s.lng);
          formattedDist = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm}km`;
        }
        return {
          ...s,
          distanceKm,
          formattedDist,
        };
      })
      .sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        return b.rating - a.rating;
      });
  }, [selectedCityId, minRating, openNow, searchQuery, activeSearchCenter]);

  const activeSelectedSpa =
    filteredSpas.find((s) => s.id === selectedSpaId) || filteredSpas[0] || MVP_SPAS[0];

  const handleOpenBooking = (spaId: string, serviceId?: string) => {
    setSheetSpaId(spaId);
    if (serviceId) setSheetInitialServiceId(serviceId);
    setIsBottomSheetOpen(true);
  };

  const handleBookSpaZalo = (e: React.MouseEvent, spaId: string) => {
    e.stopPropagation();
    handleOpenBooking(spaId, activeService.id);
  };

  const isFullScreenApp = viewMode === 'map';

  return (
    <div
      className={`w-full bg-[#FAF8F5] flex flex-col items-center justify-start ${
        isFullScreenApp ? 'p-0 h-[calc(100dvh-56px)] overflow-hidden' : 'p-0 sm:py-6'
      } font-sans`}
    >
      <div
        className={`w-full max-w-[440px] bg-[#F5F7F4] relative flex flex-col sm:rounded-[32px] sm:shadow-xl sm:border sm:border-stone-200/80 transition-all ${
          isFullScreenApp
            ? 'h-full sm:h-[calc(100dvh-56px)] overflow-hidden mb-0'
            : 'mb-0 sm:mb-10'
        }`}
      >
        <div id="danh-sach-spa" className="flex-1 flex flex-col h-full animate-in fade-in duration-200">
          {/* Top Green Bar with Navigation & Map/List Switcher */}
          <div className="bg-[#40813D] pt-4 pb-3.5 px-4 flex-none text-white border-b border-[#356F32]">
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
                aria-label={t.back}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
              </Link>

              <div className="flex-1 min-w-0">
                <h1 className="text-[14.5px] font-bold text-white truncate m-0">
                  {getServiceInfo(activeService.id).name}
                </h1>
                <div className="text-[11.5px] text-[#E8FDE7]">
                  {formatPrice(activeService.price)} · {t.fixedPriceNotice}
                </div>
              </div>

              {/* View Switcher: Bản đồ | Danh sách */}
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

            {/* Filter Row: City dropdown & Quick filter chips */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/15 overflow-x-auto no-scrollbar">
              {/* City selector */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11.5px] font-semibold transition-colors cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-[#D4F4D3]" />
                  <span>{activeCity.name}</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {isCityMenuOpen && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-30 min-w-[130px] text-[#093E06] animate-in fade-in zoom-in-95 duration-100">
                    {CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCityId(c.id);
                          setIsCityMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-between cursor-pointer ${
                          selectedCityId === c.id ? 'text-[#40813D] bg-emerald-50/50' : 'text-stone-700'
                        }`}
                      >
                        <span>{c.name}</span>
                        {selectedCityId === c.id && <span className="w-1.5 h-1.5 rounded-full bg-[#40813D]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating 4.8+ filter */}
              <button
                type="button"
                onClick={() => setMinRating(!minRating)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all shrink-0 cursor-pointer ${
                  minRating
                    ? 'bg-white text-[#093E06] shadow-xs'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
              >
                <Star className={`w-3 h-3 ${minRating ? 'fill-amber-400 text-amber-400' : 'text-white/80'}`} />
                <span>{t.ratingFilter}</span>
              </button>

              {/* Open Now filter */}
              <button
                type="button"
                onClick={() => setOpenNow(!openNow)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all shrink-0 cursor-pointer ${
                  openNow
                    ? 'bg-white text-[#093E06] shadow-xs'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{t.openNowFilter}</span>
              </button>

              {/* Clear filters if active */}
              {(minRating || openNow || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setMinRating(false);
                    setOpenNow(false);
                    setSearchQuery('');
                  }}
                  className="px-2 py-1 rounded-full text-[11px] text-[#D4F4D3] hover:text-white underline cursor-pointer shrink-0"
                >
                  {t.clearFilter}
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: MAP VIEW */}
          {viewMode === 'map' && (
            <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden bg-stone-100">
              <GlowGoogleMap
                spas={filteredSpas}
                selectedSpaId={selectedSpaId}
                onSelectSpa={(id) => setSelectedSpaId(id)}
                searchCenter={activeSearchCenter}
                searchTitle={searchTitle}
                userCoords={userCoords}
                activePrice={activeService.price}
                className="w-full h-full"
              />

              {/* Selected Spa Floating Card at Bottom of Map */}
              {activeSelectedSpa && (
                <div className="absolute bottom-4 left-3 right-3 z-10 animate-in slide-in-from-bottom-3 duration-200">
                  <div
                    onClick={() => router.push(`/spa/${activeSelectedSpa.id}`)}
                    className="bg-white/95 backdrop-blur-md rounded-[22px] p-3.5 border border-stone-200 shadow-xl flex gap-3 cursor-pointer hover:border-[#40813D] transition-all"
                  >
                    <div className="relative w-20 h-20 rounded-[16px] overflow-hidden bg-[#E8FDE7] shrink-0">
                      <Image
                        src={activeSelectedSpa.photos[0] || '/spas/spa_thumb_1.jpg'}
                        alt={activeSelectedSpa.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[10px] font-bold text-[#093E06]">
                        {activeSelectedSpa.tier === 'Certified' ? (locale === 'en' ? 'TOP' : locale === 'ko' ? '인증' : 'Chuẩn') : 'OK'}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-bold text-[14.5px] text-[#093E06] truncate m-0">
                            {activeSelectedSpa.name}
                          </h2>
                          <span className="text-[11.5px] font-bold text-[#40813D] shrink-0">
                            {activeSelectedSpa.formattedDist}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-[#6B7869] line-clamp-1 mt-0.5">
                          {activeSelectedSpa.address}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#093E06]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{activeSelectedSpa.rating}</span>
                          <span className="text-[#6B7869] font-medium text-[11px]">
                            ({activeSelectedSpa.reviews})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-[15px] sm:text-[16px] font-extrabold text-[#093E06] tracking-tight whitespace-nowrap">
                            {formatPrice(activeService.price)}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleBookSpaZalo(e, activeSelectedSpa.id)}
                            className="h-8.5 px-3.5 rounded-full bg-[#40813D] hover:bg-[#356F32] active:bg-[#093E06] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Image
                              src="/brand/Logo-Zalo-App-Rec.webp"
                              alt="Zalo"
                              width={16}
                              height={16}
                              className="w-4 h-4 rounded-xs shrink-0 object-contain shadow-2xs"
                            />
                            <span>{t.bookZalo}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIST VIEW */}
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
                    onClick={() => router.push(`/spa/${s.id}`)}
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
                        {s.tier === 'Certified' ? (locale === 'en' ? 'TOP' : locale === 'ko' ? '인증' : 'Chuẩn') : 'OK'}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-bold text-[14.5px] text-[#093E06] truncate m-0">
                            {s.name}
                          </h2>
                          <span className="text-[11.5px] font-bold text-[#40813D] shrink-0">
                            {s.formattedDist}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-[#6B7869] line-clamp-1 mt-0.5">
                          {s.address}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#093E06]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{s.rating}</span>
                          <span className="text-[#6B7869] font-medium text-[11px]">
                            ({s.reviews})
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="text-[15px] sm:text-[16px] font-extrabold text-[#093E06] tracking-tight whitespace-nowrap">
                            {formatPrice(activeService.price)}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleBookSpaZalo(e, s.id)}
                            className="h-8.5 px-3.5 rounded-full bg-[#40813D] hover:bg-[#356F32] active:bg-[#093E06] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Image
                              src="/brand/Logo-Zalo-App-Rec.webp"
                              alt="Zalo"
                              width={16}
                              height={16}
                              className="w-4 h-4 rounded-xs shrink-0 object-contain shadow-2xs"
                            />
                            <span>{t.bookZalo}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Zalo Booking Bottom Sheet */}
        <BookingBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          spa={MVP_SPAS.find((s) => s.id === sheetSpaId) || MVP_SPAS[0]}
          initialServiceId={sheetInitialServiceId}
          locale={locale}
        />
      </div>
    </div>
  );
}
