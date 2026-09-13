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
  Sparkles,
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
  const router = useRouter()
  const pathname = usePathname()
  const { searchQuery, setSearchQuery } = useSearch()
  const { openPrompt, requestLocation, setCustomLocation, isLocating, userCoords, locationLabel } = useLocation()

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

  // Quick suggestion chips
  const wardChips = [
    { label: tWards('Dịch Vọng Hậu'), value: 'Duy Tân' },
    { label: tWards('Nghĩa Tân'), value: 'Tô Hiệu' },
    { label: tWards('Trung Hòa'), value: 'Hoàng Đạo Thúy' },
    { label: tWards('Yên Hòa'), value: 'Vũ Phạm Hàm' },
    { label: tWards('Dịch Vọng'), value: 'Dịch Vọng' },
  ]

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
    return wardChips.filter(
      (w) =>
        w.label.toLowerCase().includes(q) || w.value.toLowerCase().includes(q)
    )
  }, [localInput, wardChips])

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
      setSearchQuery('') // Clear search filter so user sees all 15 spas sorted by distance to this place!

      const details = await getGooglePlaceDetails(prediction.placeId, prediction.description)
      if (details) {
        setCustomLocation({ lat: details.lat, lon: details.lng }, details.name)
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
    <div ref={desktopContainerRef} className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
      {/* DESKTOP / INLINE SEARCH PILL */}
      <div
        data-header-search-pill
        className="flex items-center h-9 sm:h-9.5 bg-white text-stone-900 rounded-full pl-3 pr-1.5 shadow-sm border border-emerald-800/20 hover:border-emerald-700/40 focus-within:ring-2 focus-within:ring-amber-300 focus-within:border-amber-400 transition-all cursor-text"
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        {isSearchingGoogle ? (
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#40813D] animate-spin shrink-0 mr-2" />
        ) : (
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 shrink-0 mr-2" />
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
          className="w-full bg-transparent text-xs sm:text-[13px] text-stone-900 placeholder:text-stone-400 font-medium outline-none"
        />

        {localInput && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="p-1 text-stone-400 hover:text-stone-700 active:scale-90 transition-transform"
            aria-label={tCommon('clear')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* DESKTOP AUTOCOMPLETE & RECENT SEARCHES DROPDOWN */}
      {isOpen && (
        <div className="hidden md:block absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto">
          {/* Near Me Quick Action Row */}
          <div className="px-3 pb-2 border-b border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                requestLocation()
              }}
              disabled={isLocating}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/70 text-[#234E21] font-bold text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Navigation className={`w-3.5 h-3.5 text-[#40813D] ${isLocating ? 'animate-spin' : ''}`} />
                <span>
                  {isLocating
                    ? 'Đang lấy vị trí...'
                    : userCoords
                    ? `Vị trí: ${locationLabel} (Ưu tiên spa gần nhất)`
                    : 'Tìm spa gần vị trí của bạn nhất'}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          {/* If typing: Show instant matching Google Places, Spas, and Wards */}
          {localInput.trim() ? (
            <div className="space-y-2 py-1">
              {/* 1. GOOGLE PLACES PREDICTIONS */}
              {googlePredictions.length > 0 && (
                <div className="px-1 border-b border-stone-100 pb-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-rose-700 px-3 py-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Gợi ý địa điểm Google Maps</span>
                  </div>
                  {googlePredictions.map((pred) => (
                    <button
                      key={pred.placeId}
                      type="button"
                      onClick={() => handleSelectGooglePlace(pred)}
                      className="w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-rose-50/50 transition-colors group cursor-pointer rounded-xl"
                    >
                      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-stone-900 group-hover:text-rose-700 transition-colors truncate">
                          {pred.mainText}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {pred.secondaryText}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#40813D] bg-[#EBF4EA] px-2 py-0.5 rounded-full border border-[#B7DDB5] shrink-0 mt-0.5">
                        Tính khoảng cách
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. MATCHING WARDS */}
              {matchingWards.length > 0 && (
                <div className="px-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Khu vực phù hợp
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingWards.map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => executeSearch(w.value)}
                        className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1"
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
                <div className="px-1 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
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
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-stone-50 transition-colors group cursor-pointer rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-xl bg-stone-100 relative overflow-hidden shrink-0 border border-stone-200">
                        {spa.imageUrl ? (
                          <Image
                            src={spa.imageUrl}
                            alt={spa.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] font-bold">
                            SPA
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#234E21] group-hover:text-[#40813D] transition-colors truncate">
                          {spa.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate">{spa.address}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold shrink-0">
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
                  <div className="py-6 text-center text-xs text-stone-500">
                    Không tìm thấy địa điểm hoặc spa nào với từ khóa &ldquo;{localInput}&rdquo;.
                  </div>
                )}
            </div>
          ) : (
            /* When empty: Show Recent Searches & Popular Chips */
            <div className="space-y-3 py-1">
              {recentList.length > 0 && (
                <div className="px-3 border-b border-stone-100 pb-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    <span>Tìm kiếm gần đây</span>
                    <button
                      type="button"
                      onClick={handleClearAllRecent}
                      className="text-[10px] font-medium text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      Xoá lịch sử
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recentList.map((item) => (
                      <div
                        key={item}
                        onClick={() => executeSearch(item)}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-stone-50 text-xs text-stone-700 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(item, e)}
                          className="p-1 text-stone-300 hover:text-stone-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Xoá mục này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Area Chips */}
              <div className="px-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#40813D]" />
                  <span>Khu vực Cầu Giấy phổ biến</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {wardChips.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => executeSearch(w.value)}
                      className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-800 text-xs font-medium transition-colors"
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Services */}
              <div className="px-3 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-600" />
                  <span>Gói dịch vụ hot</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {serviceChips.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => executeSearch(s.value)}
                      className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 text-xs font-medium transition-colors"
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
        <div className="flex items-center gap-2 bg-[#40813D] px-3 py-2.5 shadow-md">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-white hover:bg-white/15 rounded-full transition-colors active:scale-90"
            aria-label="Đóng tìm kiếm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-1 items-center h-10 rounded-full bg-white px-3 shadow-inner">
            {isSearchingGoogle ? (
              <Loader2 className="mr-2 w-4 h-4 text-[#40813D] animate-spin shrink-0" />
            ) : (
              <Search className="mr-2 w-4 h-4 text-stone-400 shrink-0" />
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
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 font-medium outline-none placeholder:text-stone-400"
            />
            {localInput && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {localInput.trim().length > 0 && (
            <button
              type="button"
              onClick={() => executeSearch(localInput)}
              className="shrink-0 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 px-3.5 py-2 text-xs font-black shadow-xs active:scale-95 transition-all"
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
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#D5E7D8] shadow-xs text-[#234E21] font-bold text-sm active:scale-98 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#40813D] flex items-center justify-center shrink-0">
              <Navigation className={`w-4.5 h-4.5 ${isLocating ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-extrabold text-xs sm:text-sm">
                {isLocating ? 'Đang xác định GPS...' : 'Tìm spa gần vị trí của bạn'}
              </div>
              <div className="text-[11px] text-stone-500 font-normal">
                {userCoords ? `Vị trí hiện tại: ${locationLabel}` : 'Tính khoảng cách chính xác theo mét'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </button>

          {/* Autocomplete Results when typing */}
          {localInput.trim() ? (
            <div className="space-y-3">
              {/* 1. GOOGLE PLACES PREDICTIONS IN MOBILE MODAL */}
              {googlePredictions.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#D5E7D8] shadow-xs divide-y divide-stone-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-rose-50 text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Gợi ý Google Maps ({googlePredictions.length})</span>
                  </div>
                  {googlePredictions.map((pred) => (
                    <button
                      key={pred.placeId}
                      type="button"
                      onClick={() => handleSelectGooglePlace(pred)}
                      className="w-full flex items-start gap-3 p-3.5 text-left hover:bg-rose-50/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                          {pred.mainText}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {pred.secondaryText}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#40813D] bg-[#EBF4EA] px-2 py-0.5 rounded-full border border-[#B7DDB5] shrink-0 mt-0.5">
                        Đo khoảng cách
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. MATCHING WARDS */}
              {matchingWards.length > 0 && (
                <div className="bg-white p-3.5 rounded-2xl border border-[#D5E7D8] shadow-xs space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">
                    Khu vực phù hợp
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchingWards.map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => executeSearch(w.value)}
                        className="px-3 py-1.5 rounded-full bg-[#EBF4EA] text-[#234E21] text-xs font-bold border border-[#B7DDB5] flex items-center gap-1.5"
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
                <div className="bg-white rounded-2xl border border-[#D5E7D8] shadow-xs divide-y divide-stone-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-stone-50 text-xs font-black uppercase tracking-wider text-stone-500">
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
                      className="flex items-center gap-3 p-3.5 hover:bg-stone-50 transition-colors"
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
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#234E21] truncate">
                          {spa.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{spa.address}</p>
                        {spa.exclusiveOffer && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded mt-0.5 inline-block">
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
                  <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
                    Không tìm thấy địa điểm hoặc spa nào với từ khóa &ldquo;{localInput}&rdquo;.
                  </div>
                )}
            </div>
          ) : (
            /* When empty: Recent searches & Categories */
            <div className="space-y-4">
              {recentList.length > 0 && (
                <div className="bg-white rounded-2xl p-3.5 border border-[#D5E7D8] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-400">
                    <span>Tìm kiếm gần đây</span>
                    <button
                      type="button"
                      onClick={handleClearAllRecent}
                      className="text-[11px] font-semibold text-stone-400 hover:text-stone-700"
                    >
                      Xoá tất cả
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentList.map((item) => (
                      <div
                        key={item}
                        onClick={() => executeSearch(item)}
                        className="flex items-center justify-between py-2 px-1 text-xs text-stone-800 border-b border-stone-50 last:border-0"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                          <span className="font-medium truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(item, e)}
                          className="p-1 text-stone-400 hover:text-stone-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Area Chips */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#D5E7D8] shadow-xs space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#234E21] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#40813D]" />
                  <span>Khu vực Cầu Giấy phổ biến</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wardChips.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => executeSearch(w.value)}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-800 text-xs font-semibold active:bg-emerald-200 transition-colors"
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Service Chips */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#D5E7D8] shadow-xs space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gói dịch vụ hot</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {serviceChips.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => executeSearch(s.value)}
                      className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold active:bg-amber-200 transition-colors"
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
