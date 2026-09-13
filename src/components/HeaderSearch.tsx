'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  MapPin,
  X,
  Clock,
  ArrowLeft,
  Navigation,
  ChevronRight,
  Star,
  Tag,
  Loader2,
} from 'lucide-react'
import { useSearch } from '@/context/SearchContext'
import { useLocation } from '@/context/LocationContext'
import { useTranslations } from 'next-intl'
import {
  fetchGooglePlacePredictions,
  getGooglePlaceDetails,
  type GooglePlacePrediction,
} from '@/lib/googlePlaces'

interface AutocompleteSpa {
  id: string
  name: string
  slug: string
  address: string
  ward: string
  rating: number
  imageUrl?: string
  exclusiveOffer?: string
}

const RECENT_SEARCHES_KEY = 'glow_recent_searches'
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentSearch(item: string) {
  if (typeof window === 'undefined' || !item.trim()) return
  try {
    let list = getRecentSearches()
    list = list.filter((s) => s.toLowerCase() !== item.toLowerCase())
    list.unshift(item.trim())
    if (list.length > MAX_RECENT) list = list.slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list))
  } catch {}
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {}
}

export function HeaderSearch() {
  const tNav = useTranslations('Navbar')
  const tCommon = useTranslations('Common')
  const tWards = useTranslations('Wards')
  const tSpaNetwork = useTranslations('SpaNetwork')
  const router = useRouter()
  const pathname = usePathname()
  const { searchQuery, setSearchQuery } = useSearch()
  const { requestLocation, setCustomLocation, isLocating, userCoords, locationLabel } = useLocation()

  const [isOpen, setIsOpen] = useState(false)
  const [localInput, setLocalInput] = useState(searchQuery)
  const [recentList, setRecentList] = useState<string[]>([])
  const [spas, setSpas] = useState<AutocompleteSpa[]>([])

  // Google Maps Places state
  const [googlePredictions, setGooglePredictions] = useState<GooglePlacePrediction[]>([])
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false)

  const desktopContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // Sync external search query with local state
  useEffect(() => {
    setLocalInput(searchQuery)
  }, [searchQuery])

  // Load spas list for instantaneous client-side autocomplete
  useEffect(() => {
    async function loadSpas() {
      try {
        const res = await fetch('/api/spas')
        const data = await res.json()
        if (data.spas) {
          setSpas(data.spas)
        }
      } catch (err) {
        console.error('Failed to load spas for autocomplete:', err)
      }
    }
    loadSpas()
  }, [])

  // Refresh recent searches when opening
  useEffect(() => {
    if (isOpen) {
      setRecentList(getRecentSearches())
    }
  }, [isOpen])

  // Google Maps autocomplete with debounce
  useEffect(() => {
    const q = localInput.trim()
    if (q.length < 2) {
      setGooglePredictions([])
      return
    }

    let active = true
    setIsSearchingGoogle(true)

    const timer = setTimeout(async () => {
      try {
        const preds = await fetchGooglePlacePredictions(q)
        if (active) {
          setGooglePredictions(preds)
        }
      } catch (e) {
        console.warn('Google predictions error:', e)
      } finally {
        if (active) setIsSearchingGoogle(false)
      }
    }, 250)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [localInput])

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        desktopContainerRef.current &&
        !desktopContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Prevent background scroll when mobile modal is open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Helper calculating Haversine distance
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10
  }

  // Dynamic Popular Area Chips based on userCoords and spa count
  const popularAreas = useMemo(() => {
    const hubs = [
      { name: 'Dịch Vọng', street: 'Trần Thái Tông', lat: 21.0345, lon: 105.7930 },
      { name: 'Trung Hòa', street: 'Hoàng Đạo Thúy', lat: 21.0062, lon: 105.8021 },
      { name: 'Yên Hòa', street: 'Vũ Phạm Hàm', lat: 21.0220, lon: 105.7940 },
      { name: 'Duy Tân', street: 'Duy Tân', lat: 21.0315, lon: 105.7830 },
      { name: 'Tô Hiệu', street: 'Tô Hiệu', lat: 21.0450, lon: 105.7960 },
    ]

    return hubs
      .map((h) => {
        const matching = spas.filter(
          (s) =>
            s.ward?.toLowerCase().includes(h.name.toLowerCase()) ||
            s.address?.toLowerCase().includes(h.name.toLowerCase()) ||
            s.address?.toLowerCase().includes(h.street.toLowerCase())
        )
        const count = matching.length || 2

        let distanceKm: number | null = null
        let formattedDistance = ''
        if (userCoords) {
          distanceKm = getDistanceKm(userCoords.lat, userCoords.lon, h.lat, h.lon)
          formattedDistance = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm}km`
        }

        const localizedName = tWards.has(h.name as any) ? tWards(h.name as any) : h.name
        const spasCountStr = tSpaNetwork('spasCount', { count })

        return {
          label: userCoords && formattedDistance
            ? `${localizedName} (${spasCountStr} • ${formattedDistance})`
            : `${localizedName} (${spasCountStr})`,
          value: h.name,
          count,
          distanceKm,
          formattedDistance,
        }
      })
      .sort((a, b) => {
        if (userCoords && a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm
        }
        return b.count - a.count
      })
  }, [spas, userCoords])

  const serviceChips = [
    { label: 'Gội 49K', value: '49K' },
    { label: 'Trị liệu 149K', value: '149K' },
    { label: 'Gội dưỡng sinh SOP', value: 'dưỡng sinh' },
  ]

  // Filtered matching spas & wards based on input
  const matchingSpas = useMemo(() => {
    const q = localInput.trim().toLowerCase()
    if (!q) return []
    return spas
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.ward.toLowerCase().includes(q)
      )
      .slice(0, 5)
  }, [localInput, spas])

  const matchingWards = useMemo(() => {
    const q = localInput.trim().toLowerCase()
    if (!q) return []
    return popularAreas.filter(
      (w) =>
        w.label.toLowerCase().includes(q) || w.value.toLowerCase().includes(q)
    )
  }, [localInput, popularAreas])

  const navigateToSpasList = useCallback(() => {
    const isHome = pathname === '/' || pathname === '/en' || pathname === '/ko'
    if (!isHome) {
      const localePrefix = pathname.startsWith('/en')
        ? '/en'
        : pathname.startsWith('/ko')
        ? '/ko'
        : ''
      router.push(`${localePrefix}/#danh-sach-spa`)
    } else {
      const el = document.getElementById('danh-sach-spa')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [pathname, router])

  const executeSearch = useCallback(
    (term: string) => {
      const q = term.trim()
      if (q) {
        saveRecentSearch(q)
        setSearchQuery(q)
      } else {
        setSearchQuery('')
      }
      setIsOpen(false)
      navigateToSpasList()
    },
    [navigateToSpasList, setSearchQuery]
  )

  // When user selects a place from Google Maps
  const handleSelectGooglePlace = async (prediction: GooglePlacePrediction) => {
    try {
      saveRecentSearch(prediction.mainText)
      setIsOpen(false)
      setLocalInput(prediction.mainText)
      setSearchQuery('') // Clear text search filter so all partner spas are shown sorted by distance

      const details = await getGooglePlaceDetails(prediction.placeId, prediction.description)
      if (details) {
        setCustomLocation({ lat: details.lat, lon: details.lng }, prediction.mainText)
      }

      navigateToSpasList()
    } catch (err) {
      console.error('Failed to select Google Place:', err)
      executeSearch(prediction.mainText)
    }
  }

  const handleClear = () => {
    setLocalInput('')
    setSearchQuery('')
    setGooglePredictions([])
    if (inputRef.current) inputRef.current.focus()
    if (mobileInputRef.current) mobileInputRef.current.focus()
  }

  const handleRemoveRecent = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentList.filter((s) => s !== itemToRemove)
    setRecentList(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    }
  }

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearRecentSearches()
    setRecentList([])
  }

  return (
    <div ref={desktopContainerRef} className="relative flex-1 min-w-0 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
      {/* DESKTOP / INLINE SEARCH PILL */}
      <div
        data-header-search-pill
        className="flex items-center h-10 bg-white text-stone-900 rounded-full pl-3.5 pr-2 shadow-sm border border-stone-200/90 hover:border-stone-300 focus-within:ring-2 focus-within:ring-[#40813D]/25 focus-within:border-[#40813D] transition-all cursor-text"
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        {isSearchingGoogle ? (
          <Loader2 className="w-4 h-4 text-[#40813D] animate-spin shrink-0 mr-2.5" />
        ) : (
          <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={localInput}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setLocalInput(e.target.value)
            setSearchQuery(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              executeSearch(localInput)
            }
          }}
          placeholder={tNav('searchPlaceholder')}
          className="w-full bg-transparent text-[14px] text-stone-900 placeholder:text-stone-400 font-normal outline-none"
        />

        {localInput && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="p-1 text-stone-400 hover:text-stone-700 active:scale-90 transition-transform cursor-pointer"
            aria-label={tCommon('clear')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* DESKTOP AUTOCOMPLETE & RECENT SEARCHES DROPDOWN */}
      {isOpen && (
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-[460px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl shadow-stone-900/12 border border-stone-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto">
          {/* Near Me Quick Action Row */}
          <div className="p-1 pb-2 border-b border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                requestLocation()
              }}
              disabled={isLocating}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#40813D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-stone-800 group-hover:text-[#40813D] transition-colors">
                    {isLocating
                      ? 'Đang xác định vị trí của bạn...'
                      : userCoords
                      ? `Vị trí đã chọn: ${locationLabel}`
                      : 'Sử dụng vị trí hiện tại'}
                  </div>
                  <div className="text-xs text-stone-500">
                    {userCoords ? 'Bấm để cập nhật lại GPS' : 'Xem các spa đối tác gần bạn nhất'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
            </button>
          </div>

          {/* If typing: Show instant matching Google Places, Spas, and Wards */}
          {localInput.trim() ? (
            <div className="space-y-2 py-1">
              {/* 1. GOOGLE PLACES PREDICTIONS */}
              {googlePredictions.length > 0 && (
                <div className="border-b border-stone-100 pb-2">
                  <div className="px-3.5 pt-2 pb-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Địa điểm gợi ý</span>
                  </div>
                  {googlePredictions.map((pred) => (
                    <button
                      key={pred.placeId}
                      type="button"
                      onClick={() => handleSelectGooglePlace(pred)}
                      className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-left rounded-xl hover:bg-stone-50 active:bg-stone-100 transition-colors group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-500 group-hover:bg-emerald-50 group-hover:text-[#40813D] flex items-center justify-center shrink-0 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] sm:text-[15px] font-medium text-stone-900 group-hover:text-[#234E21] transition-colors truncate">
                          {pred.mainText}
                        </div>
                        {pred.secondaryText && (
                          <div className="text-xs text-stone-500 truncate mt-0.5">
                            {pred.secondaryText}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* 2. MATCHING WARDS */}
              {matchingWards.length > 0 && (
                <div className="px-3.5 py-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Khu vực phù hợp
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingWards.map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => executeSearch(w.value)}
                        className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-[#234E21] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-[#40813D]" />
                        <span>{w.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. MATCHING SPAS */}
              {matchingSpas.length > 0 && (
                <div className="pt-1">
                  <div className="px-3.5 pt-2 pb-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Spa đối tác phù hợp ({matchingSpas.length})
                  </div>
                  {matchingSpas.map((spa) => (
                    <Link
                      key={spa.id}
                      href={`/spa/${spa.slug}`}
                      onClick={() => {
                        saveRecentSearch(spa.name)
                        setIsOpen(false)
                      }}
                      className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-stone-100 relative overflow-hidden shrink-0 border border-stone-200">
                        {spa.imageUrl ? (
                          <Image
                            src={spa.imageUrl}
                            alt={spa.name}
                            fill
                            sizes="40px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-bold">
                            SPA
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-stone-900 group-hover:text-[#40813D] transition-colors truncate">
                          {spa.name}
                        </h4>
                        <p className="text-xs text-stone-500 truncate mt-0.5">{spa.address}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{spa.rating}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {googlePredictions.length === 0 &&
                matchingSpas.length === 0 &&
                matchingWards.length === 0 &&
                !isSearchingGoogle && (
                  <div className="py-8 text-center text-sm text-stone-500">
                    Không tìm thấy địa điểm hoặc spa nào với từ khóa &ldquo;{localInput}&rdquo;.
                  </div>
                )}
            </div>
          ) : (
            /* When empty: Show Recent Searches & Popular Chips */
            <div className="space-y-3 py-1">
              {recentList.length > 0 && (
                <div className="px-1 border-b border-stone-100 pb-2">
                  <div className="flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                    <span>Tìm kiếm gần đây</span>
                    <button
                      type="button"
                      onClick={handleClearAllRecent}
                      className="text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      Xoá lịch sử
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recentList.map((item) => (
                      <div
                        key={item}
                        onClick={() => executeSearch(item)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-50 text-[14px] text-stone-700 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(item, e)}
                          className="p-1 text-stone-300 hover:text-stone-600 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          aria-label="Xoá mục này"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Area Chips */}
              <div className="px-3 pt-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                  <MapPin className={`w-3.5 h-3.5 ${userCoords ? 'text-[#236B38]' : 'text-stone-400'}`} />
                  <span>
                    {userCoords
                      ? tSpaNetwork('suggestNearYou')
                      : tSpaNetwork('suggestPopular')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularAreas.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => executeSearch(w.value)}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Services */}
              <div className="px-3 pt-1 pb-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Gói dịch vụ hot</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {serviceChips.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => executeSearch(s.value)}
                      className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/70 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOBILE FULL-SCREEN SEARCH MODAL */}
      <div
        className={`fixed inset-0 z-[99999] flex-col bg-[#FAF8F5] md:hidden ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center gap-2.5 bg-[#40813D] px-3.5 py-2.5 shadow-md">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-white hover:bg-white/15 rounded-full transition-colors active:scale-90 cursor-pointer"
            aria-label="Đóng tìm kiếm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-1 items-center h-11 rounded-full bg-white px-3.5 shadow-inner">
            {isSearchingGoogle ? (
              <Loader2 className="mr-2.5 w-4 h-4 text-[#40813D] animate-spin shrink-0" />
            ) : (
              <Search className="mr-2.5 w-4 h-4 text-stone-400 shrink-0" />
            )}
            <input
              ref={mobileInputRef}
              type="text"
              inputMode="search"
              enterKeyHint="search"
              placeholder={tNav('searchPlaceholder')}
              value={localInput}
              autoFocus
              onChange={(e) => {
                setLocalInput(e.target.value)
                setSearchQuery(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  executeSearch(localInput)
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-[15px] text-stone-900 font-normal outline-none placeholder:text-stone-400"
            />
            {localInput && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {localInput.trim().length > 0 && (
            <button
              type="button"
              onClick={() => executeSearch(localInput)}
              className="shrink-0 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Tìm
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Near Me button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              requestLocation()
            }}
            disabled={isLocating}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-sm text-[#234E21] active:scale-98 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#40813D] flex items-center justify-center shrink-0">
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-semibold text-sm text-stone-900">
                {isLocating
                  ? 'Đang xác định vị trí của bạn...'
                  : userCoords
                  ? `Vị trí đã chọn: ${locationLabel}`
                  : 'Sử dụng vị trí hiện tại'}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {userCoords ? 'Bấm để cập nhật lại GPS' : 'Xem các spa đối tác gần bạn nhất'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </button>

          {/* Autocomplete Results when typing */}
          {localInput.trim() ? (
            <div className="space-y-3">
              {/* 1. GOOGLE PLACES PREDICTIONS IN MOBILE MODAL */}
              {googlePredictions.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm divide-y divide-stone-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Địa điểm gợi ý ({googlePredictions.length})</span>
                  </div>
                  {googlePredictions.map((pred) => (
                    <button
                      key={pred.placeId}
                      type="button"
                      onClick={() => handleSelectGooglePlace(pred)}
                      className="w-full flex items-center gap-3.5 p-3.5 text-left hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium text-stone-900">
                          {pred.mainText}
                        </div>
                        {pred.secondaryText && (
                          <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                            {pred.secondaryText}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* 2. MATCHING WARDS */}
              {matchingWards.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Khu vực phù hợp
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchingWards.map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => executeSearch(w.value)}
                        className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 active:bg-stone-200 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-[#40813D]" />
                        <span>{w.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. MATCHING SPAS */}
              {matchingSpas.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm divide-y divide-stone-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Spa đối tác phù hợp ({matchingSpas.length})
                  </div>
                  {matchingSpas.map((spa) => (
                    <Link
                      key={spa.id}
                      href={`/spa/${spa.slug}`}
                      onClick={() => {
                        saveRecentSearch(spa.name)
                        setIsOpen(false)
                      }}
                      className="flex items-center gap-3.5 p-3.5 hover:bg-stone-50 active:bg-stone-100 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-stone-100 relative overflow-hidden shrink-0 border border-stone-200">
                        {spa.imageUrl ? (
                          <Image
                            src={spa.imageUrl}
                            alt={spa.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-bold">
                            SPA
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[15px] font-semibold text-stone-900 truncate">
                          {spa.name}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{spa.address}</p>
                        {spa.exclusiveOffer && (
                          <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {spa.exclusiveOffer}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}

              {googlePredictions.length === 0 &&
                matchingSpas.length === 0 &&
                matchingWards.length === 0 &&
                !isSearchingGoogle && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-sm text-stone-500">
                    Không tìm thấy địa điểm hoặc spa nào với từ khóa &ldquo;{localInput}&rdquo;.
                  </div>
                )}
            </div>
          ) : (
            /* When empty: Recent searches & Categories */
            <div className="space-y-4">
              {recentList.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400">
                    <span>Tìm kiếm gần đây</span>
                    <button
                      type="button"
                      onClick={handleClearAllRecent}
                      className="text-xs font-medium text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      Xoá tất cả
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentList.map((item) => (
                      <div
                        key={item}
                        onClick={() => executeSearch(item)}
                        className="flex items-center justify-between py-2.5 px-1 text-sm text-stone-800 border-b border-stone-50 last:border-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                          <span className="font-normal truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(item, e)}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Area Chips */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <MapPin className={`w-3.5 h-3.5 ${userCoords ? 'text-[#40813D]' : 'text-stone-500'}`} />
                  <span>
                    {userCoords
                      ? tSpaNetwork('suggestNearYou')
                      : tSpaNetwork('suggestPopular')}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularAreas.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => executeSearch(w.value)}
                      className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 text-stone-700 text-xs font-medium active:bg-stone-200 transition-colors cursor-pointer"
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Service Chips */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gói dịch vụ hot</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {serviceChips.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => executeSearch(s.value)}
                      className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 text-xs font-medium active:bg-amber-200 transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
