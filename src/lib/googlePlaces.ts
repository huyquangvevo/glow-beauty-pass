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

  sdkLoadingPromise = new Promise<void>((resolve) => {
    // 1. Guard against hanging with a 3-second hard timeout
    const timeoutTimer = setTimeout(() => {
      resolve()
    }, 3000)

    // Check if any Google Maps script is already in the document
    const existing =
      (document.getElementById(SCRIPT_ID) as HTMLScriptElement | null) ||
      (document.getElementById('glow-google-maps-sdk') as HTMLScriptElement | null) ||
      (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement | null)

    if (existing) {
      if (w.google?.maps?.places) {
        clearTimeout(timeoutTimer)
        resolve()
        return
      }
      // If script is present, poll briefly for places object instead of relying on replayed event
      let checks = 0
      const poll = setInterval(() => {
        checks++
        if (w.google?.maps?.places || checks > 15) {
          clearInterval(poll)
          clearTimeout(timeoutTimer)
          resolve()
        }
      }, 200)
      return
    }

    const callbackName = '__glowMapsInitCallback'
    w[callbackName] = () => {
      clearTimeout(timeoutTimer)
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
      clearTimeout(timeoutTimer)
      resolve()
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

  try {
    await ensureGoogleMapsSdk()
  } catch {
    return []
  }

  const w = window as any
  if (!w.google?.maps?.places) return []

  try {
    if (!autocompleteService) {
      autocompleteService = new w.google.maps.places.AutocompleteService()
    }
  } catch {
    return []
  }

  return new Promise((resolve) => {
    const fallbackTimer = setTimeout(() => {
      resolve([])
    }, 2000)

    try {
      autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'vn' },
          locationBias: new w.google.maps.Circle({
            center: { lat: 21.0333, lng: 105.7925 },
            radius: 15000,
          }),
        },
        (predictions: any[], status: any) => {
          clearTimeout(fallbackTimer)
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
      clearTimeout(fallbackTimer)
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
