'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
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
  Navigation,
} from 'lucide-react';
import {
  MVP_SERVICES,
  MVP_SPAS,
  MVPService,
  MVPSpa,
  CITIES,
  formatPrice,
} from '@/lib/mvp-data';
import { useSearch } from '@/context/SearchContext';
import { useLocation, detectCityFromCoords } from '@/context/LocationContext';
import { getMvpTranslation } from '@/lib/mvp-i18n';
import BookingBottomSheet from '@/components/BookingBottomSheet';
import GlowGoogleMap from '@/components/GlowGoogleMap';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
  { keywords: ['quan 1', 'quận 1', 'ben nghe', 'bến nghé', 'ben thanh', 'bến thành', 'hcm', 'tp hcm', 'tphcm', 'sai gon', 'sài gòn'], coords: { lat: 10.7756, lng: 106.7004 } },
  { keywords: ['quan 3', 'quận 3', 'vo thi sau', 'võ thị sáu'], coords: { lat: 10.7844, lng: 106.6845 } },
  { keywords: ['binh thanh', 'bình thạnh'], coords: { lat: 10.8039, lng: 106.7101 } },
  { keywords: ['phu nhuan', 'phú nhuận', 'phan xich long', 'phan xích long'], coords: { lat: 10.7967, lng: 106.689 } },
  { keywords: ['quan 10', 'quận 10', 'su van hanh', 'sư vạn hạnh'], coords: { lat: 10.7725, lng: 106.6685 } },
  { keywords: ['tan binh', 'tân bình', 'cong hoa', 'cộng hòa'], coords: { lat: 10.8015, lng: 106.654 } },
  { keywords: ['quan 7', 'quận 7', 'phu my hung', 'phú mỹ hưng'], coords: { lat: 10.738, lng: 106.7112 } },
  { keywords: ['hai chau', 'hải châu', 'da nang', 'đà nẵng', 'bach dang', 'bạch đằng'], coords: { lat: 16.0592, lng: 108.2208 } },
  { keywords: ['son tra', 'sơn trà'], coords: { lat: 16.0745, lng: 108.244 } },
  { keywords: ['thanh khe', 'thanh khê'], coords: { lat: 16.064, lng: 108.1965 } },
  { keywords: ['ngu hanh son', 'ngũ hành sơn'], coords: { lat: 16.0545, lng: 108.2435 } },
];

interface SpasClientViewProps {
  locale: string;
  initialSpas?: MVPSpa[];
  initialServices?: MVPService[];
}

export default function SpasClientView({
  locale,
  initialSpas,
  initialServices,
}: SpasClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = getMvpTranslation(locale);

  const allSpas = useMemo(
    () => (initialSpas && initialSpas.length > 0 ? initialSpas : MVP_SPAS),
    [initialSpas]
  );
  const allServices = useMemo(
    () => (initialServices && initialServices.length > 0 ? initialServices : MVP_SERVICES),
    [initialServices]
  );

  // Initial params
  const initialServiceId = searchParams.get('service') || 'duong-sinh';
  const initialCityId = (searchParams.get('city') as 'hn' | 'hcm' | 'dn') || 'hn';
  const initialViewMode = searchParams.get('view') === 'list' ? 'list' : 'map';

  // State
  const { searchQuery, setSearchQuery } = useSearch();
  const { userCoords, locationLabel, detectedCity, requestLocation, isLocating } = useLocation();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedCityId, setSelectedCityId] = useState<'hn' | 'hcm' | 'dn'>(initialCityId);
  const [viewMode, setViewMode] = useState<'map' | 'list'>(initialViewMode);
  const [selectedSpaId, setSelectedSpaId] = useState<string | null>('la-xanh-cau-giay');
  const [minRating, setMinRating] = useState<boolean>(false);
  const [openNow, setOpenNow] = useState<boolean>(false);
  const [isCityMenuOpen, setIsCityMenuOpen] = useState<boolean>(false);
  const cityMenuRef = useRef<HTMLDivElement | null>(null);

  // Track if user explicitly chose a city from dropdown or URL query
  const hasUserSelectedCity = useRef<boolean>(!!searchParams.get('city'));

  // Auto-switch selectedCityId when user's actual city is detected and user hasn't explicitly chosen another city
  useEffect(() => {
    if (!hasUserSelectedCity.current && detectedCity && detectedCity !== selectedCityId) {
      setSelectedCityId(detectedCity);
      const citySpas = allSpas.filter((s) => s.city === detectedCity);
      const matchingSpa =
        citySpas.find((s) => s.serviceIds?.includes(selectedServiceId) && (openNow ? s.open : true)) ||
        citySpas[0];
      if (matchingSpa) {
        setSelectedSpaId(matchingSpa.id);
      }
    }
  }, [detectedCity, selectedCityId, selectedServiceId, openNow, allSpas]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityMenuRef.current && !cityMenuRef.current.contains(e.target as Node)) {
        setIsCityMenuOpen(false);
      }
    };
    if (isCityMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCityMenuOpen]);

  const handleSelectCity = (cityId: 'hn' | 'hcm' | 'dn') => {
    hasUserSelectedCity.current = true;
    setSelectedCityId(cityId);
    setIsCityMenuOpen(false);

    // Pick first matching spa in the newly selected city
    const citySpas = allSpas.filter((s) => s.city === cityId);
    const matchingSpa =
      citySpas.find((s) => s.serviceIds?.includes(selectedServiceId) && (openNow ? s.open : true)) ||
      citySpas[0];
    if (matchingSpa) {
      setSelectedSpaId(matchingSpa.id);
    }

    // Update URL query param ?city=...
    const params = new URLSearchParams(searchParams.toString());
    params.set('city', cityId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Booking Bottom Sheet
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [sheetSpaId, setSheetSpaId] = useState<string>('la-xanh-cau-giay');
  const [sheetInitialServiceId, setSheetInitialServiceId] = useState<string>(initialServiceId);

  // Synchronize URL search params: q, lat, lng/lon, service
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && qParam !== searchQuery) {
      setSearchQuery(qParam);
    }
    const svcParam = searchParams.get('service');
    if (svcParam && svcParam !== selectedServiceId) {
      setSelectedServiceId(svcParam);
    }
  }, [searchParams, searchQuery, setSearchQuery, selectedServiceId]);

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

    // Use user GPS coords if user is in selected city
    if (userCoords) {
      const userCity = detectedCity || detectCityFromCoords(userCoords.lat, userCoords.lon);
      if (userCity === selectedCityId) {
        return { lat: userCoords.lat, lng: userCoords.lon };
      }
      const cityCenter = CITY_CENTERS[selectedCityId] || CITY_CENTERS.hn;
      const distToCity = computeDistanceKm(userCoords.lat, userCoords.lon, cityCenter.lat, cityCenter.lng);
      if (distToCity < 60) {
        return { lat: userCoords.lat, lng: userCoords.lon };
      }
    }
    return CITY_CENTERS[selectedCityId] || CITY_CENTERS.hn;
  }, [urlCoords, queryMatchedCoords, geocodedCoords, userCoords, selectedCityId, detectedCity]);

  const searchTitle = useMemo(() => {
    const q = (searchQuery || searchParams.get('q') || '').trim();
    if (q) return q;
    if (userCoords) {
      const userCity = detectedCity || detectCityFromCoords(userCoords.lat, userCoords.lon);
      if (userCity === selectedCityId && locationLabel && locationLabel !== 'Bật vị trí') {
        return locationLabel;
      }
    }
    if (selectedCityId === 'hn') return t.defaultCityAreas?.hn || 'Cầu Giấy, Hà Nội';
    if (selectedCityId === 'hcm') return t.defaultCityAreas?.hcm || 'Quận 1, TP.HCM';
    return t.defaultCityAreas?.dn || 'Hải Châu, Đà Nẵng';
  }, [searchQuery, searchParams, locationLabel, selectedCityId, userCoords, detectedCity, t]);

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
    allServices.find((s) => s.id === selectedServiceId) || allServices[0] || MVP_SERVICES[2];
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

    // Direct matches strictly within the selected city
    const directMatches = q
      ? allSpas.filter((s) => {
          const inCity = s.city === selectedCityId;
          const matchText =
            s.name.toLowerCase().includes(q) ||
            s.ward.toLowerCase().includes(q) ||
            (s.district && s.district.toLowerCase().includes(q)) ||
            s.address.toLowerCase().includes(q) ||
            s.cityName.toLowerCase().includes(q);
          return inCity && matchText;
        })
      : [];

    const spasToFilter =
      q && directMatches.length > 0
        ? directMatches
        : allSpas.filter((s) => s.city === selectedCityId);

    const refCoords = activeSearchCenter;

    return spasToFilter
      .filter((s) => {
        // Critical: Only include spas that offer the selected service category!
        if (selectedServiceId && (!s.serviceIds || !s.serviceIds.includes(selectedServiceId))) {
          return false;
        }
        if (minRating && s.rating < 4.8) return false;
        if (openNow && !s.open) return false;
        return true;
      })
      .map((s) => {
        let distanceKm: number | null = null;
        let formattedDist = s.dist;
        if (refCoords) {
          distanceKm = computeDistanceKm(refCoords.lat, refCoords.lng, s.lat, s.lng);
          formattedDist = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1).replace('.', ',')} km`;
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
  }, [allSpas, selectedCityId, selectedServiceId, minRating, openNow, searchQuery, activeSearchCenter]);

  // Fallback Spa Selection for Floating Bottom Card
  const activeSelectedSpa =
    filteredSpas.find((s) => s.id === selectedSpaId) || filteredSpas[0] || allSpas[0];

  // If currently selected spa is no longer in filteredSpas (e.g. after switching service), switch to first available spa
  useEffect(() => {
    if (filteredSpas.length > 0 && !filteredSpas.some((s) => s.id === selectedSpaId)) {
      setSelectedSpaId(filteredSpas[0].id);
    }
  }, [filteredSpas, selectedSpaId]);

  const handleOpenBooking = (spaId: string, serviceId?: string) => {
    setSheetSpaId(spaId);
    if (serviceId) setSheetInitialServiceId(serviceId);
    setIsBottomSheetOpen(true);
  };

  const handleBookSpaZalo = (e: React.MouseEvent, spaId: string) => {
    e.stopPropagation();
    handleOpenBooking(spaId, activeService.id);
  };

  // Ensure page is pinned to top when viewing spas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div
      className="w-full bg-[#FAF8F5] flex flex-col items-center justify-start p-0 h-[100dvh] h-screen overflow-hidden font-sans fixed inset-0 sm:relative sm:inset-auto sm:h-[100dvh]"
    >
      <div
        className="w-full max-w-[440px] bg-[#F5F7F4] relative flex flex-col sm:rounded-[32px] sm:shadow-xl sm:border sm:border-stone-200/80 transition-all h-full overflow-hidden mb-0"
      >
        <div id="danh-sach-spa" className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
          {/* Top Green Bar with Navigation & Map/List Switcher */}
          <div className="bg-[#40813D] pt-3 pb-2.5 px-3 sm:px-4 flex-none text-white border-b border-[#356F32] relative z-40">
            <div className="flex items-center gap-2 relative z-30">
              <Link
                href="/"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
                aria-label={t.back}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
              </Link>

              <div className="flex-1 min-w-0 pr-1">
                <h1 className="text-[17px] sm:text-[18px] font-bold text-white truncate m-0 leading-tight">
                  {getServiceInfo(activeService.id).name}
                </h1>
                <div className="text-[13.5px] text-[#E8FDE7] truncate">
                  {formatPrice(activeService.price)} · {t.fixedPriceNotice}
                </div>
              </div>

              {/* View Switcher: Bản đồ | Danh sách */}
              <div className="flex bg-black/20 rounded-full p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
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
                  className={`px-3 py-1 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#093E06] shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {t.listView}
                </button>
              </div>

              {/* Language Switcher */}
              <div className="shrink-0 scale-90 -mr-1 relative z-50">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Filter Row: City dropdown (fixed, unclipped) & Quick filter chips (scrollable) */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/15 relative z-20">
              {/* City selector */}
              <div ref={cityMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[13.5px] font-semibold transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4F4D3]" />
                  <span>{t.cities[selectedCityId] || activeCity.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {isCityMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 py-1.5 z-50 min-w-[145px] text-[#093E06] animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-1 text-[11.5px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                      {t.selectCity || (locale === 'en' ? 'Select City' : locale === 'ko' ? '지역 선택' : 'Chọn khu vực')}
                    </div>
                    {CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCity(c.id)}
                        className={`w-full text-left px-3.5 py-2 text-[14px] font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-between cursor-pointer ${
                          selectedCityId === c.id ? 'text-[#40813D] bg-emerald-50/70 font-bold' : 'text-stone-700'
                        }`}
                      >
                        <span>{t.cities[c.id as 'hn' | 'hcm' | 'dn'] || c.name}</span>
                        {selectedCityId === c.id && <span className="w-2 h-2 rounded-full bg-[#40813D]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick filter chips (scrollable) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar min-w-0 flex-1">
                {/* GPS Current Location button */}
                <button
                  type="button"
                  onClick={() => requestLocation(false)}
                  disabled={isLocating}
                  title={
                    userCoords
                      ? t.currentGpsTitle
                        ? t.currentGpsTitle.replace('{loc}', locationLabel || t.located)
                        : `Vị trí hiện tại: ${locationLabel || 'Đã định vị'}`
                      : t.clickToLocate
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13.5px] font-semibold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 ${
                    userCoords
                      ? 'bg-white text-[#093E06] shadow-xs'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  <Navigation
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isLocating
                        ? 'animate-spin text-[#40813D]'
                        : userCoords
                        ? 'text-[#40813D] fill-[#40813D]'
                        : 'text-[#D4F4D3]'
                    }`}
                  />
                  <span className="truncate max-w-[130px] sm:max-w-[160px]">
                    {isLocating
                      ? t.locating
                      : userCoords
                      ? (locationLabel && locationLabel !== 'Bật vị trí' && locationLabel !== 'Vị trí của bạn'
                          ? locationLabel
                          : t.nearYou)
                      : t.currentLocation}
                  </span>
                </button>

                {/* Rating 4.8+ filter */}
                <button
                  type="button"
                  onClick={() => setMinRating(!minRating)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13.5px] font-semibold transition-all shrink-0 cursor-pointer ${
                    minRating
                      ? 'bg-white text-[#093E06] shadow-xs'
                      : 'bg-white/15 text-white/90 hover:bg-white/25'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${minRating ? 'fill-amber-400 text-amber-400' : 'text-white/80'}`} />
                  <span>{t.ratingFilter}</span>
                </button>

                {/* Open Now filter */}
                <button
                  type="button"
                  onClick={() => setOpenNow(!openNow)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13.5px] font-semibold transition-all shrink-0 cursor-pointer ${
                    openNow
                      ? 'bg-white text-[#093E06] shadow-xs'
                      : 'bg-white/15 text-white/90 hover:bg-white/25'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
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
                    className="px-2 py-1 rounded-full text-[13px] font-medium text-[#D4F4D3] hover:text-white underline cursor-pointer shrink-0"
                  >
                    {t.clearFilter}
                  </button>
                )}
              </div>
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
                locale={locale}
              />

              {/* Selected Spa Floating Card at Bottom of Map */}
              {activeSelectedSpa && (
                <div className="absolute bottom-[max(12px,calc(8px+env(safe-area-inset-bottom)))] sm:bottom-4 left-3 right-3 z-10 animate-in slide-in-from-bottom-3 duration-200">
                  <div
                    onClick={() => router.push(`/spa/${activeSelectedSpa.id}?service=${selectedServiceId}`)}
                    className="bg-white/95 backdrop-blur-md rounded-[18px] p-3 sm:p-3.5 border border-[#DDE4D9] shadow-lg flex gap-3 sm:gap-3.5 cursor-pointer hover:border-[#40813D] transition-all active:scale-[0.99] overflow-hidden"
                  >
                    <div className="relative w-[70px] h-[70px] rounded-[14px] overflow-hidden bg-[#E8FDE7] shrink-0">
                      <Image
                        src={activeSelectedSpa.photos[0] || '/spas/spa_thumb_1.jpg'}
                        alt={activeSelectedSpa.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="font-bold text-[17.5px] text-[#093E06] truncate">
                          {activeSelectedSpa.name}
                        </div>
                        <div className="font-bold text-[16px] text-[#093E06] shrink-0 whitespace-nowrap">
                          {formatPrice(activeService.price)}
                        </div>
                      </div>
                      <div className="text-[13.5px] text-[#6B7869] mt-1 truncate">
                        ★ {activeSelectedSpa.rating} ({activeSelectedSpa.reviews}) · {activeSelectedSpa.formattedDist || activeSelectedSpa.dist} · {activeSelectedSpa.ward || activeSelectedSpa.district || activeSelectedSpa.address}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[12.5px] font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap ${
                          activeSelectedSpa.open ? 'bg-[#E8FDE7] text-[#093E06]' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {activeSelectedSpa.open ? t.openNowStatus : t.closedStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIST VIEW */}
          {viewMode === 'list' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[max(24px,calc(1.5rem+env(safe-area-inset-bottom)))] sm:pb-8">
              {/* Service Count Summary Header */}
              <div className="text-[14.5px] font-bold text-[#093E06] px-1 flex items-center justify-between">
                <span>
                  {filteredSpas.length} {t.spasOffering} &quot;{getServiceInfo(activeService.id).name}&quot;
                </span>
                <span className="text-[13.5px] font-medium text-[#6B7869]">
                  {t.cities[selectedCityId] || activeCity.name}
                </span>
              </div>

              {filteredSpas.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-base">
                  <p>{t.noSpasFound}</p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-3 px-4 py-2 rounded-full bg-[#40813D] text-white text-[13px] font-semibold cursor-pointer"
                    >
                      {t.clearFilter}
                    </button>
                  )}
                </div>
              ) : (
                filteredSpas.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => router.push(`/spa/${s.id}?service=${selectedServiceId}`)}
                    className="bg-white rounded-[18px] p-3 sm:p-3.5 border border-[#DDE4D9] flex gap-3 sm:gap-3.5 cursor-pointer hover:border-[#40813D] hover:shadow-xs transition-all active:scale-[0.99] overflow-hidden"
                  >
                    <div className="relative w-[70px] h-[70px] rounded-[14px] overflow-hidden bg-[#E8FDE7] shrink-0">
                      <Image
                        src={s.photos[0] || '/spas/spa_thumb_1.jpg'}
                        alt={s.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="font-bold text-[17.5px] text-[#093E06] truncate">
                          {s.name}
                        </div>
                        <div className="font-bold text-[16px] text-[#093E06] shrink-0 whitespace-nowrap">
                          {formatPrice(activeService.price)}
                        </div>
                      </div>
                      <div className="text-[13.5px] text-[#6B7869] mt-1 truncate">
                        ★ {s.rating} ({s.reviews}) · {s.formattedDist || s.dist} · {s.ward || s.district || s.address}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[12.5px] font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap ${
                          s.open ? 'bg-[#E8FDE7] text-[#093E06]' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {s.open ? t.openNowStatus : t.closedStatus}
                        </span>
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
          spa={allSpas.find((s) => s.id === sheetSpaId) || allSpas[0]}
          initialServiceId={sheetInitialServiceId}
          onServiceChange={setSheetInitialServiceId}
          locale={locale}
        />
      </div>
    </div>
  );
}
