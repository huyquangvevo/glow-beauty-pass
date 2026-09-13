/**
 * Google Maps Places Autocomplete & Geocoding Service
 * Loaded dynamically using NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 */

export interface GooglePlacePrediction {
  placeId: string
  mainText: string
  secondaryText: string
  description: string
}

export interface GooglePlaceDetail {
  lat: number
  lng: number
  address: string
  name: string
}

const SCRIPT_ID = 'glow-google-maps-places-sdk'
const API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
  'AIzaSyD3YIsbyA_4gb6LM5ydwfIYnktrGrIYxsQ'

let sdkLoadingPromise: Promise<void> | null = null

export function ensureGoogleMapsSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'))

  const w = window as any
  if (w.google?.maps?.places) {
    return Promise.resolve()
  }

  if (sdkLoadingPromise) return sdkLoadingPromise

  sdkLoadingPromise = new Promise<void>((resolve, reject) => {
    // Check if already injected
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      if (w.google?.maps?.places) {
        resolve()
      } else {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps SDK')))
      }
      return
    }

    const callbackName = '__glowMapsInitCallback'
    w[callbackName] = () => {
      resolve()
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      API_KEY
    )}&libraries=places&language=vi&region=VN&callback=${callbackName}`

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'))
    }

    document.head.appendChild(script)
  }).finally(() => {
    sdkLoadingPromise = null
  })

  return sdkLoadingPromise
}

let autocompleteService: any = null
let placesService: any = null
let geocoder: any = null

/**
 * Fetch autocomplete predictions from Google Places
 */
export async function fetchGooglePlacePredictions(input: string): Promise<GooglePlacePrediction[]> {
  const query = input.trim()
  if (!query || query.length < 2) return []

  await ensureGoogleMapsSdk()

  const w = window as any
  if (!w.google?.maps?.places) return []

  if (!autocompleteService) {
    autocompleteService = new w.google.maps.places.AutocompleteService()
  }

  return new Promise((resolve) => {
    try {
      autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'vn' },
          locationBias: new w.google.maps.Circle({
            center: { lat: 21.0333, lng: 105.7925 }, // Cầu Giấy, Hà Nội
            radius: 15000,
          }),
        },
        (predictions: any[], status: any) => {
          if (status !== w.google.maps.places.PlacesServiceStatus.OK || !Array.isArray(predictions)) {
            resolve([])
            return
          }

          const results: GooglePlacePrediction[] = predictions.slice(0, 5).map((p) => ({
            placeId: p.place_id,
            mainText: p.structured_formatting?.main_text || p.description,
            secondaryText: p.structured_formatting?.secondary_text || '',
            description: p.description,
          }))

          resolve(results)
        }
      )
    } catch (err) {
      console.warn('Autocomplete fetch error:', err)
      resolve([])
    }
  })
}

/**
 * Get coordinates and formatted address for a selected placeId
 */
export async function getGooglePlaceDetails(
  placeId: string,
  fallbackDescription: string
): Promise<GooglePlaceDetail | null> {
  await ensureGoogleMapsSdk()

  const w = window as any
  if (!w.google?.maps) return null

  // Method 1: Use Geocoder with placeId
  if (!geocoder) {
    geocoder = new w.google.maps.Geocoder()
  }

  return new Promise((resolve) => {
    geocoder.geocode({ placeId }, (results: any[], status: any) => {
      if (status === 'OK' && results && results[0]?.geometry?.location) {
        const loc = results[0].geometry.location
        const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat
        const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng
        resolve({
          lat,
          lng,
          address: results[0].formatted_address || fallbackDescription,
          name: fallbackDescription || results[0].formatted_address || 'Địa điểm đã chọn',
        })
        return
      }

      // Method 2: Fallback to PlacesService
      try {
        const dummyDiv = document.createElement('div')
        if (!placesService) {
          placesService = new w.google.maps.places.PlacesService(dummyDiv)
        }
        placesService.getDetails(
          {
            placeId,
            fields: ['geometry', 'formatted_address', 'name'],
          },
          (place: any, placeStatus: any) => {
            if (
              placeStatus === w.google.maps.places.PlacesServiceStatus.OK &&
              place?.geometry?.location
            ) {
              const loc = place.geometry.location
              const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat
              const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng
              resolve({
                lat,
                lng,
                address: place.formatted_address || fallbackDescription,
                name: place.name || fallbackDescription,
              })
            } else {
              resolve(null)
            }
          }
        )
      } catch (e) {
        resolve(null)
      }
    })
  })
}
