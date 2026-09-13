'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  MapPin,
  Search,
  LocateFixed,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'

interface GoogleMapPickerProps {
  latitude: number
  longitude: number
  address?: string
  onLocationChange: (data: {
    lat: number
    lng: number
    address?: string
    district?: string
    ward?: string
  }) => void
}

const DEFAULT_LAT = 21.0345 // Cầu Giấy, Hà Nội
const DEFAULT_LNG = 105.7930

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
  'AIzaSyAPIBP4yEJQLTp58U3uQp4FdldaDPong4w'

export function GoogleMapPicker({
  latitude,
  longitude,
  address,
  onLocationChange,
}: GoogleMapPickerProps) {
  const mapCanvasRef = useRef<HTMLDivElement | null>(null)
  const mapSearchRef = useRef<HTMLInputElement | null>(null)

  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const geocoderRef = useRef<any>(null)
  const autocompleteRef = useRef<any>(null)

  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  // 1. Tải Google Maps SDK & Places Library
  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = window as any
    if (w.google?.maps?.places) {
      setMapReady(true)
      return
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setMapError('Thiếu API Key Google Maps. Vui lòng kiểm tra NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.')
      return
    }

    const existingScript = document.getElementById('glow-google-maps-sdk') as HTMLScriptElement | null
    if (existingScript) {
      if (w.google?.maps) {
        setMapReady(true)
      } else {
        existingScript.addEventListener('load', () => setMapReady(true))
      }
      return
    }

    w.__glowGoogleMapsInit = () => {
      setMapReady(true)
    }

    const script = document.createElement('script')
    script.id = 'glow-google-maps-sdk'
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY
    )}&libraries=places&language=vi&region=VN&callback=__glowGoogleMapsInit`

    script.onerror = () => {
      setMapError('Không thể tải Google Maps SDK. Vui lòng kiểm tra kết nối mạng hoặc API key.')
    }

    document.head.appendChild(script)
  }, [])

  // Helper trích xuất thành phần địa chỉ
  const parseAddressComponents = (place: any) => {
    const list = place?.address_components
    if (!Array.isArray(list)) return { district: undefined, ward: undefined }

    let district: string | undefined
    let ward: string | undefined

    for (const c of list) {
      const types: string[] = c?.types || []
      // Phường / Xã
      if (
        types.includes('sublocality_level_1') ||
        types.includes('sublocality') ||
        types.includes('administrative_area_level_3')
      ) {
        ward = c.long_name || c.short_name
      }
      // Quận / Huyện
      if (types.includes('administrative_area_level_2')) {
        district = c.long_name || c.short_name
      }
    }

    return { district, ward }
  }

  // Cập nhật vị trí điểm ghim
  const updateMarkerPosition = useCallback(
    (lat: number, lng: number, shouldPan = true) => {
      if (!markerRef.current || !mapRef.current) return

      const latLng = { lat, lng }
      markerRef.current.setPosition(latLng)
      if (shouldPan) {
        mapRef.current.panTo(latLng)
      }
    },
    []
  )

  // 2. Khởi tạo Bản đồ & Places Autocomplete khi SDK sẵn sàng
  useEffect(() => {
    if (!mapReady || !mapCanvasRef.current) return
    const w = window as any
    const g = w.google
    if (!g?.maps) return

    const initialLat = Number.isFinite(latitude) && latitude !== 0 ? latitude : DEFAULT_LAT
    const initialLng = Number.isFinite(longitude) && longitude !== 0 ? longitude : DEFAULT_LNG

    // Khởi tạo Map
    if (!mapRef.current) {
      const map = new g.maps.Map(mapCanvasRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      })
      mapRef.current = map

      // Ghim vị trí (cho phép kéo thả draggable)
      const marker = new g.maps.Marker({
        position: { lat: initialLat, lng: initialLng },
        map,
        draggable: true,
        title: 'Vị trí Spa',
        animation: g.maps.Animation.DROP,
      })
      markerRef.current = marker

      geocoderRef.current = new g.maps.Geocoder()

      // Sự kiện: Click trực tiếp lên bản đồ
      map.addListener('click', (e: any) => {
        if (!e?.latLng) return
        const lat = Number(e.latLng.lat().toFixed(6))
        const lng = Number(e.latLng.lng().toFixed(6))
        updateMarkerPosition(lat, lng, false)

        // Reverse geocode lấy địa chỉ tại điểm click
        geocoderRef.current?.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
          if (status === 'OK' && results?.[0]) {
            const parsed = parseAddressComponents(results[0])
            onLocationChange({
              lat,
              lng,
              address: results[0].formatted_address,
              district: parsed.district,
              ward: parsed.ward,
            })
          } else {
            onLocationChange({ lat, lng })
          }
        })
      })

      // Sự kiện: Kéo thả ghim Marker
      marker.addListener('dragend', (e: any) => {
        if (!e?.latLng) return
        const lat = Number(e.latLng.lat().toFixed(6))
        const lng = Number(e.latLng.lng().toFixed(6))

        geocoderRef.current?.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
          if (status === 'OK' && results?.[0]) {
            const parsed = parseAddressComponents(results[0])
            onLocationChange({
              lat,
              lng,
              address: results[0].formatted_address,
              district: parsed.district,
              ward: parsed.ward,
            })
          } else {
            onLocationChange({ lat, lng })
          }
        })
      })
    }

    // Khởi tạo Places Autocomplete
    if (mapSearchRef.current && !autocompleteRef.current) {
      const autocomplete = new g.maps.places.Autocomplete(mapSearchRef.current, {
        fields: ['geometry', 'formatted_address', 'address_components', 'name'],
        componentRestrictions: { country: 'vn' },
      })
      autocompleteRef.current = autocomplete

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place?.geometry?.location) {
          setMapError('Không tìm thấy tọa độ cho địa điểm này.')
          return
        }

        setMapError(null)
        const lat = Number(place.geometry.location.lat().toFixed(6))
        const lng = Number(place.geometry.location.lng().toFixed(6))

        updateMarkerPosition(lat, lng, true)
        mapRef.current?.setZoom(17)

        const formattedAddress = place.formatted_address || place.name || ''
        if (formattedAddress) {
          setSearchQuery(formattedAddress)
        }

        const parsed = parseAddressComponents(place)
        onLocationChange({
          lat,
          lng,
          address: formattedAddress,
          district: parsed.district,
          ward: parsed.ward,
        })
      })
    }
  }, [mapReady, latitude, longitude, onLocationChange, updateMarkerPosition])

  // Đồng bộ vị trí marker khi props latitude/longitude thay đổi từ bên ngoài
  useEffect(() => {
    if (
      mapReady &&
      markerRef.current &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude !== 0 &&
      longitude !== 0
    ) {
      const curPos = markerRef.current.getPosition()
      if (
        !curPos ||
        Math.abs(curPos.lat() - latitude) > 0.00001 ||
        Math.abs(curPos.lng() - longitude) > 0.00001
      ) {
        updateMarkerPosition(latitude, longitude, true)
      }
    }
  }, [latitude, longitude, mapReady, updateMarkerPosition])

  // Tìm kiếm bằng Geocoder khi bấm nút hoặc Enter
  const handleSearchAddress = () => {
    if (!mapReady || !geocoderRef.current) {
      setMapError('Bản đồ chưa sẵn sàng. Vui lòng thử lại sau giây lát.')
      return
    }

    const q = searchQuery.trim() || address?.trim()
    if (!q) {
      setMapError('Vui lòng nhập địa chỉ để tìm kiếm vị trí.')
      return
    }

    setMapError(null)
    geocoderRef.current.geocode(
      { address: q, componentRestrictions: { country: 'vn' } },
      (results: any[], status: string) => {
        if (status !== 'OK' || !results?.length) {
          setMapError('Không tìm thấy vị trí phù hợp trên bản đồ. Hãy thử nhập chi tiết hơn.')
          return
        }

        const first = results[0]
        const lat = Number(first.geometry.location.lat().toFixed(6))
        const lng = Number(first.geometry.location.lng().toFixed(6))

        updateMarkerPosition(lat, lng, true)
        mapRef.current?.setZoom(17)

        const parsed = parseAddressComponents(first)
        onLocationChange({
          lat,
          lng,
          address: first.formatted_address,
          district: parsed.district,
          ward: parsed.ward,
        })
      }
    )
  }

  // Lấy GPS hiện tại từ trình duyệt
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError('Trình duyệt không hỗ trợ định vị GPS.')
      return
    }

    setIsLocating(true)
    setMapError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false)
        const lat = Number(pos.coords.latitude.toFixed(6))
        const lng = Number(pos.coords.longitude.toFixed(6))

        updateMarkerPosition(lat, lng, true)
        mapRef.current?.setZoom(17)

        geocoderRef.current?.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
          if (status === 'OK' && results?.[0]) {
            const parsed = parseAddressComponents(results[0])
            onLocationChange({
              lat,
              lng,
              address: results[0].formatted_address,
              district: parsed.district,
              ward: parsed.ward,
            })
          } else {
            onLocationChange({ lat, lng })
          }
        })
      },
      (err) => {
        setIsLocating(false)
        setMapError(`Không thể lấy vị trí GPS: ${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-3">
      {/* THANH TÌM KIẾM GOOGLE PLACES */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            ref={mapSearchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearchAddress()
              }
            }}
            placeholder="Tìm kiếm địa chỉ trên Google Maps (VD: 165 Cầu Giấy, Hà Nội)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSearchAddress}
            className="px-4 py-2.5 rounded-2xl bg-[#40813D] hover:bg-[#356F32] text-white text-xs sm:text-sm font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tìm Trên Map</span>
          </button>

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-[#2E602C] border border-emerald-200 text-xs sm:text-sm font-bold active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Lấy tọa độ GPS thiết bị hiện tại"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Đang lấy GPS...' : 'GPS Của Tôi'}</span>
          </button>
        </div>
      </div>

      {/* ERROR ALERT NẾU CÓ */}
      {mapError && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{mapError}</span>
        </div>
      )}

      {/* KHUNG BẢN ĐỒ INTERACTIVE GOOGLE MAP */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-inner bg-stone-100">
        <div
          ref={mapCanvasRef}
          className="w-full h-72 sm:h-80"
          style={{ minHeight: '280px' }}
        />

        {!mapReady && !mapError && (
          <div className="absolute inset-0 bg-stone-100/90 flex flex-col items-center justify-center gap-2 text-stone-500">
            <div className="w-6 h-6 border-2 border-[#40813D] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải Google Maps...</span>
          </div>
        )}

        {/* THÔNG TIN TỌA ĐỘ NỔI TRÊN BẢN ĐỒ */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200 shadow-md text-xs flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-stone-700">Tọa Độ Đã Ghim:</span>
          </div>
          <div className="font-mono text-stone-900 font-bold">
            {latitude ? latitude.toFixed(6) : DEFAULT_LAT.toFixed(6)},{' '}
            {longitude ? longitude.toFixed(6) : DEFAULT_LNG.toFixed(6)}
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude || DEFAULT_LAT},${
              longitude || DEFAULT_LNG
            }`}
            target="_blank"
            rel="noreferrer"
            className="text-stone-400 hover:text-[#40813D] transition-colors ml-1"
            title="Mở trên Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* HƯỚNG DẪN TƯƠNG TÁC */}
      <div className="flex items-start gap-1.5 text-[11px] text-stone-500 pt-0.5">
        <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <span>
          <strong>Mẹo:</strong> Bạn có thể gõ tìm kiếm gợi ý địa chỉ, hoặc <strong>click trực tiếp</strong>, hoặc <strong>kéo thả ghim đỏ</strong> trên bản đồ để định vị chính xác vị trí cơ sở spa. Tọa độ (Lat/Lng) và địa chỉ sẽ tự động được điền.
        </span>
      </div>
    </div>
  )
}
