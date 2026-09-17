'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface Coords {
  lat: number
  lon: number
}

export type CityId = 'hn' | 'hcm' | 'dn'

interface LocationContextType {
  userCoords: Coords | null
  locationLabel: string
  detectedCity: CityId | null
  isLocating: boolean
  isPromptOpen: boolean
  requestLocation: (silent?: boolean) => Promise<void>
  setCustomLocation: (coords: Coords, label: string, city?: CityId) => void
  dismissPrompt: () => void
  openPrompt: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const COORDS_KEY = 'glow_user_coords'
const LABEL_KEY = 'glow_location_label'
const PERM_KEY = 'glow_location_permission'
const CITY_KEY = 'glow_detected_city'

export function detectCityFromCoords(lat: number, lon: number): CityId {
  const distHn = Math.hypot(lat - 21.0285, lon - 105.8048)
  const distHcm = Math.hypot(lat - 10.7769, lon - 106.7009)
  const distDn = Math.hypot(lat - 16.0544, lon - 108.2022)
  if (distHcm <= distHn && distHcm <= distDn) return 'hcm'
  if (distDn <= distHn && distDn <= distHcm) return 'dn'
  return 'hn'
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userCoords, setUserCoords] = useState<Coords | null>(null)
  const [locationLabel, setLocationLabel] = useState<string>('Bật vị trí')
  const [detectedCity, setDetectedCity] = useState<CityId | null>(null)
  const [isLocating, setIsLocating] = useState<boolean>(false)
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false)

  // Reverse geocoding to resolve neighborhood/ward name and city
  const resolveAreaName = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.area) {
          setLocationLabel(data.area)
          try {
            localStorage.setItem(LABEL_KEY, data.area)
          } catch {}
        }
        if (data?.city) {
          setDetectedCity(data.city)
          try {
            localStorage.setItem(CITY_KEY, data.city)
          } catch {}
        }
        return data.area || 'Vị trí của bạn'
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err)
    }
    const fallbackCity = detectCityFromCoords(lat, lon)
    setDetectedCity(fallbackCity)
    try {
      localStorage.setItem(CITY_KEY, fallbackCity)
    } catch {}
    const fallbackName =
      fallbackCity === 'hcm'
        ? 'Quận 1, TP.HCM'
        : fallbackCity === 'dn'
        ? 'Hải Châu, Đà Nẵng'
        : 'Cầu Giấy, Hà Nội'
    setLocationLabel(fallbackName)
    try {
      localStorage.setItem(LABEL_KEY, fallbackName)
    } catch {}
    return fallbackName
  }, [])

  const requestLocation = useCallback(
    async (silent = false) => {
      if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        if (!silent) alert('Trình duyệt của bạn không hỗ trợ định vị GPS.')
        setIsPromptOpen(false)
        return
      }

      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: Coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }
          setUserCoords(coords)
          const city = detectCityFromCoords(coords.lat, coords.lon)
          setDetectedCity(city)
          try {
            localStorage.setItem(COORDS_KEY, JSON.stringify(coords))
            localStorage.setItem(CITY_KEY, city)
            localStorage.setItem(PERM_KEY, 'granted')
          } catch {}

          await resolveAreaName(coords.lat, coords.lon)
          setIsLocating(false)
          setIsPromptOpen(false)
        },
        (error) => {
          console.warn('User denied or error locating:', error)
          setIsLocating(false)
          setIsPromptOpen(false)
          if (error.code === error.PERMISSION_DENIED) {
            try {
              localStorage.setItem(PERM_KEY, 'denied')
            } catch {}
          }
          if (!silent) {
            if (error.code === error.PERMISSION_DENIED) {
              alert('Vui lòng cho phép quyền truy cập vị trí trong trình duyệt để tìm spa gần bạn nhất.')
            } else {
              alert('Không thể xác định vị trí hiện tại. Vui lòng thử lại.')
            }
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      )
    },
    [resolveAreaName]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Khôi phục vị trí & nhãn đã lưu từ bộ nhớ tạm
    try {
      const cachedCoords = localStorage.getItem(COORDS_KEY)
      const cachedCity = localStorage.getItem(CITY_KEY) as CityId | null
      const cachedLabel = localStorage.getItem(LABEL_KEY)
      if (cachedCoords) {
        const parsed = JSON.parse(cachedCoords)
        if (parsed?.lat && parsed?.lon) {
          setUserCoords(parsed)
          setDetectedCity(cachedCity || detectCityFromCoords(parsed.lat, parsed.lon))
        }
      }
      if (cachedLabel) {
        setLocationLabel(cachedLabel)
      }
    } catch (e) {
      console.warn('Error restoring location cache:', e)
    }

    // 2. Không tự động gọi nếu đang trong trang admin
    if (window.location.pathname.includes('/admin')) return

    // 3. Tự động kiểm tra quyền & kích hoạt lấy vị trí chính xác của người dùng
    if ('geolocation' in navigator) {
      const savedPerm = localStorage.getItem(PERM_KEY)
      if (savedPerm !== 'denied') {
        // Tự động yêu cầu định vị GPS chính xác của người dùng
        requestLocation(true)
      }
    }
  }, [requestLocation])

  const dismissPrompt = () => {
    setIsPromptOpen(false)
    try {
      localStorage.setItem(PERM_KEY, 'dismissed')
    } catch {}
  }

  const setCustomLocation = (coords: Coords, label: string, city?: CityId) => {
    setUserCoords(coords)
    setLocationLabel(label)
    const resolvedCity = city || detectCityFromCoords(coords.lat, coords.lon)
    setDetectedCity(resolvedCity)
    try {
      localStorage.setItem(COORDS_KEY, JSON.stringify(coords))
      localStorage.setItem(LABEL_KEY, label)
      localStorage.setItem(CITY_KEY, resolvedCity)
      localStorage.setItem(PERM_KEY, 'granted')
    } catch {}
  }

  const openPrompt = () => {
    setIsPromptOpen(true)
  }

  return (
    <LocationContext.Provider
      value={{
        userCoords,
        locationLabel,
        detectedCity,
        isLocating,
        isPromptOpen,
        requestLocation,
        setCustomLocation,
        dismissPrompt,
        openPrompt,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
