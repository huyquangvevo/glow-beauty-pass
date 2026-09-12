import { NextResponse } from 'next/server'

// Danh sách các khu vực trọng điểm tại Cầu Giấy & Hà Nội để tính toán dự phòng
const KNOWN_AREAS = [
  { name: 'Dịch Vọng', lat: 21.0345, lon: 105.7930 },
  { name: 'Duy Tân', lat: 21.0315, lon: 105.7830 },
  { name: 'Trung Hòa', lat: 21.0110, lon: 105.8010 },
  { name: 'Yên Hòa', lat: 21.0220, lon: 105.7940 },
  { name: 'Tô Hiệu', lat: 21.0450, lon: 105.7960 },
  { name: 'Xuân Thủy', lat: 21.0365, lon: 105.7850 },
  { name: 'Nghĩa Tân', lat: 21.0440, lon: 105.7910 },
  { name: 'Mai Dịch', lat: 21.0390, lon: 105.7760 },
  { name: 'Mỹ Đình', lat: 21.0280, lon: 105.7720 },
  { name: 'Cầu Giấy', lat: 21.0333, lon: 105.7925 },
  { name: 'Ba Đình', lat: 21.0340, lon: 105.8200 },
  { name: 'Đống Đa', lat: 21.0180, lon: 105.8260 },
  { name: 'Thanh Xuân', lat: 20.9980, lon: 105.8080 },
  { name: 'Tây Hồ', lat: 21.0600, lon: 105.8200 },
]

function getFallbackAreaName(lat: number, lon: number): string {
  let closest = KNOWN_AREAS[0]
  let minDistance = Infinity
  for (const area of KNOWN_AREAS) {
    const d = Math.hypot(lat - area.lat, lon - area.lon)
    if (d < minDistance) {
      minDistance = d
      closest = area
    }
  }
  return closest.name
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const latStr = searchParams.get('lat')
    const lonStr = searchParams.get('lon')

    if (!latStr || !lonStr) {
      return NextResponse.json({ area: 'Cầu Giấy' })
    }

    const lat = parseFloat(latStr)
    const lon = parseFloat(lonStr)

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ area: 'Cầu Giấy' })
    }

    // Thử truy vấn qua OpenStreetMap Nominatim
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3500)

      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`
      const res = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'GlowBeautyPass/1.0 (contact@glowvietnam.com)',
          'Accept-Language': 'vi,en;q=0.9',
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        const addr = data.address || {}

        // Ưu tiên hiển thị tên Phường/Khu phố ngắn gọn, quen thuộc
        let detected =
          addr.quarter ||
          addr.neighbourhood ||
          addr.suburb ||
          addr.city_district ||
          addr.district ||
          addr.city

        if (detected) {
          // Làm sạch tiền tố hành chính dài
          detected = detected
            .replace(/^(Phường|Xã|Thị trấn|Quận|Huyện|Thành phố|Tỉnh)\s+/i, '')
            .trim()

          return NextResponse.json({
            area: detected,
            fullAddress: data.display_name,
          })
        }
      }
    } catch {
      // Bỏ qua lỗi mạng từ OpenStreetMap và chuyển sang thuật toán khoảng cách
    }

    // Thuật toán dự phòng tính khoảng cách gần nhất
    const fallback = getFallbackAreaName(lat, lon)
    return NextResponse.json({ area: fallback })
  } catch (err) {
    return NextResponse.json({ area: 'Cầu Giấy' })
  }
}
