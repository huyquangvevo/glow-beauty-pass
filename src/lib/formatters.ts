export const DEFAULT_CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  hn: { lat: 21.0333, lng: 105.7925 }, // Cầu Giấy, Hà Nội
  hcm: { lat: 10.7769, lng: 106.7009 }, // Bến Nghé, Quận 1, TP.HCM
  dn: { lat: 16.0544, lng: 108.2022 }, // Hải Châu, Đà Nẵng
};

export function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Format distance according to Vietnamese & international standard:
 * - If km < 1: "800 m" (or "< 50 m")
 * - If km >= 1: "1,2 km"
 */
export function formatDistanceKm(km: number | null | undefined): string {
  if (km == null || Number.isNaN(km) || km < 0) return 'Gần bạn'
  if (km < 1) {
    const meters = Math.round(km * 1000)
    if (meters < 50) return '< 50 m'
    return `${meters} m`
  }
  return `${Number(km || 0).toFixed(1).replace('.', ',')} km`
}

export interface OpeningStatus {
  isOpen: boolean
  text: string
  subText?: string
}

export function getOpeningStatus(openHoursStr?: string): OpeningStatus {
  if (!openHoursStr) {
    return { isOpen: true, text: 'Đang mở cửa', subText: '09:00 - 21:00' }
  }

  try {
    const parts = openHoursStr.split('-').map((s) => s.trim())
    if (parts.length === 2) {
      const [start, end] = parts
      const [startH, startM] = start.split(':').map(Number)
      const [endH, endM] = end.split(':').map(Number)
      const now = new Date()
      const currentMin = now.getHours() * 60 + now.getMinutes()
      const startMin = startH * 60 + (startM || 0)
      const endMin = endH * 60 + (endM || 0)

      if (currentMin >= startMin && currentMin < endMin) {
        return { isOpen: true, text: 'Đang mở cửa', subText: `Đến ${end}` }
      } else {
        return { isOpen: false, text: 'Đã đóng cửa', subText: `Mở lúc ${start}` }
      }
    }
  } catch {}

  return { isOpen: true, text: 'Đang mở cửa', subText: openHoursStr }
}
