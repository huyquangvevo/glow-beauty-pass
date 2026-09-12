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
  dismissPrompt: () => void
  openPrompt: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

// Tọa độ trung tâm Cầu Giấy (mặc định)
const DEFAULT_COORDS: Coords = {
  lat: 21.0333,
  lon: 105.7925,
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userCoords, setUserCoords] = useState<Coords | null>(null)
  const [locationLabel, setLocationLabel] = useState<string>('Cầu Giấy')
  const [isLocating, setIsLocating] = useState<boolean>(false)
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false)

  useEffect(() => {
    // Kiểm tra xem người dùng đã từng cấp quyền hoặc bỏ qua chưa
    const savedPermission = localStorage.getItem('glow_location_permission')
    if (savedPermission === 'granted') {
      // Tự động lấy vị trí hiện tại
      silentGetLocation()
    } else if (!savedPermission) {
      // Hiển thị prompt nhẹ nhàng sau 1 giây như Glow Explore
      const timer = setTimeout(() => {
        setIsPromptOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const silentGetLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }
          setUserCoords(coords)
          setLocationLabel('Vị trí của bạn')
        },
        (error) => {
          console.warn('Geolocation silent error:', error)
          setUserCoords(DEFAULT_COORDS)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  }

  const requestLocation = async () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.')
      setIsPromptOpen(false)
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        setUserCoords(coords)
        setLocationLabel('Vị trí của bạn')
        setIsLocating(false)
        setIsPromptOpen(false)
        localStorage.setItem('glow_location_permission', 'granted')
      },
      (error) => {
        console.warn('User denied or error locating:', error)
        setIsLocating(false)
        setIsPromptOpen(false)
        localStorage.setItem('glow_location_permission', 'dismissed')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const dismissPrompt = () => {
    setIsPromptOpen(false)
    localStorage.setItem('glow_location_permission', 'dismissed')
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
