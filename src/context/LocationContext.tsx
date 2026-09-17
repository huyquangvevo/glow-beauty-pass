'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Coords {
  lat: number
  lon: number
}

interface LocationContextType {
  userCoords: Coords | null
  locationLabel: string
  isLocating: boolean
  isPromptOpen: boolean
  requestLocation: () => Promise<void>
  setCustomLocation: (coords: Coords, label: string) => void
  dismissPrompt: () => void
  openPrompt: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

// Tọa độ trung tâm Cầu Giấy (mặc định)
const DEFAULT_COORDS: Coords = {
  lat: 21.0333,
  lon: 105.7925,
}

const COORDS_KEY = 'glow_user_coords'
const LABEL_KEY = 'glow_location_label'
const PERM_KEY = 'glow_location_permission'

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userCoords, setUserCoords] = useState<Coords | null>(null)
  const [locationLabel, setLocationLabel] = useState<string>('Bật vị trí')
  const [isLocating, setIsLocating] = useState<boolean>(false)
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false)

  // Hàm tra cứu tên khu vực thực tế từ tọa độ GPS
  const resolveAreaName = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.area) {
          setLocationLabel(data.area)
          localStorage.setItem(LABEL_KEY, data.area)
          return data.area
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err)
    }
    const fallback = 'Cầu Giấy'
    setLocationLabel(fallback)
    localStorage.setItem(LABEL_KEY, fallback)
    return fallback
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Khôi phục vị trí & nhãn đã lưu từ bộ nhớ tạm (không gọi lại navigator.geolocation)
    try {
      const cachedCoords = localStorage.getItem(COORDS_KEY)
      if (cachedCoords) {
        const parsed = JSON.parse(cachedCoords)
        if (parsed?.lat && parsed?.lon) {
          setUserCoords(parsed)
        }
      }
      const cachedLabel = localStorage.getItem(LABEL_KEY)
      if (cachedLabel) {
        setLocationLabel(cachedLabel)
      }
    } catch (e) {
      console.warn('Error restoring location cache:', e)
    }

    // 2. Tuyệt đối không tự động hiện prompt hoặc kích hoạt định vị trên trang chi tiết spa hoặc admin
    const pathname = window.location.pathname
    if (pathname.includes('/spa/') || pathname.includes('/admin')) {
      return
    }

    // 3. Nếu người dùng chưa từng tương tác (chưa cho phép hoặc chưa bỏ qua), hiện prompt nhẹ nhàng sau 1.5s
    const savedPermission = localStorage.getItem(PERM_KEY)
    if (!savedPermission) {
      const timer = setTimeout(() => {
        if (!window.location.pathname.includes('/spa/') && !window.location.pathname.includes('/admin')) {
          setIsPromptOpen(true)
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const requestLocation = async () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.')
      setIsPromptOpen(false)
      return
    }

    setIsLocating(true)
    setLocationLabel('Đang định vị...')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        setUserCoords(coords)
        localStorage.setItem(COORDS_KEY, JSON.stringify(coords))
        localStorage.setItem(PERM_KEY, 'granted')
        await resolveAreaName(coords.lat, coords.lon)
        setIsLocating(false)
        setIsPromptOpen(false)
      },
      (error) => {
        console.warn('User denied or error locating:', error)
        setIsLocating(false)
        setIsPromptOpen(false)
        localStorage.setItem(PERM_KEY, 'dismissed')
        const cachedLabel = localStorage.getItem(LABEL_KEY)
        setLocationLabel(cachedLabel || 'Bật vị trí')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const dismissPrompt = () => {
    setIsPromptOpen(false)
    localStorage.setItem(PERM_KEY, 'dismissed')
  }

  const setCustomLocation = (coords: Coords, label: string) => {
    setUserCoords(coords)
    setLocationLabel(label)
    localStorage.setItem(COORDS_KEY, JSON.stringify(coords))
    localStorage.setItem(LABEL_KEY, label)
    localStorage.setItem(PERM_KEY, 'granted')
  }

  const openPrompt = () => {
    setIsPromptOpen(true)
  }

  return (
    <LocationContext.Provider
      value={{
        userCoords,
        locationLabel,
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
