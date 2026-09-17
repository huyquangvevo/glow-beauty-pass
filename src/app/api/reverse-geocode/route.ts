import { NextResponse } from 'next/server'

// Danh sách các khu vực trọng điểm tại Hà Nội, TP.HCM, Đà Nẵng
const KNOWN_AREAS = [
  // Hà Nội
  { name: 'Dịch Vọng, Cầu Giấy', city: 'hn', lat: 21.0345, lon: 105.7930 },
  { name: 'Duy Tân, Cầu Giấy', city: 'hn', lat: 21.0315, lon: 105.7830 },
  { name: 'Trung Hòa, Cầu Giấy', city: 'hn', lat: 21.0110, lon: 105.8010 },
  { name: 'Yên Hòa, Cầu Giấy', city: 'hn', lat: 21.0220, lon: 105.7940 },
  { name: 'Cầu Giấy, Hà Nội', city: 'hn', lat: 21.0333, lon: 105.7925 },
  { name: 'Mỹ Đình, Nam Từ Liêm', city: 'hn', lat: 21.0280, lon: 105.7720 },
  { name: 'Ba Đình, Hà Nội', city: 'hn', lat: 21.0340, lon: 105.8200 },
  { name: 'Đống Đa, Hà Nội', city: 'hn', lat: 21.0180, lon: 105.8260 },
  { name: 'Thanh Xuân, Hà Nội', city: 'hn', lat: 20.9980, lon: 105.8080 },
  { name: 'Tây Hồ, Hà Nội', city: 'hn', lat: 21.0600, lon: 105.8200 },
  { name: 'Hoàn Kiếm, Hà Nội', city: 'hn', lat: 21.0285, lon: 105.8542 },
  { name: 'Hai Bà Trưng, Hà Nội', city: 'hn', lat: 21.0069, lon: 105.8524 },

  // TP. Hồ Chí Minh
  { name: 'Bến Nghé, Quận 1', city: 'hcm', lat: 10.7769, lon: 106.7009 },
  { name: 'Bến Thành, Quận 1', city: 'hcm', lat: 10.7712, lon: 106.6934 },
  { name: 'Quận 1, TP.HCM', city: 'hcm', lat: 10.7756, lon: 106.7004 },
  { name: 'Võ Thị Sáu, Quận 3', city: 'hcm', lat: 10.7844, lon: 106.6845 },
  { name: 'Quận 3, TP.HCM', city: 'hcm', lat: 10.7841, lon: 106.6855 },
  { name: 'Bình Thạnh, TP.HCM', city: 'hcm', lat: 10.8039, lon: 106.7101 },
  { name: 'Phan Xích Long, Phú Nhuận', city: 'hcm', lat: 10.7967, lon: 106.6890 },
  { name: 'Sư Vạn Hạnh, Quận 10', city: 'hcm', lat: 10.7725, lon: 106.6685 },
  { name: 'Cộng Hòa, Tân Bình', city: 'hcm', lat: 10.8015, lon: 106.6540 },
  { name: 'Tân Phú, Quận 7', city: 'hcm', lat: 10.7380, lon: 106.7112 },

  // Đà Nẵng
  { name: 'Hải Châu, Đà Nẵng', city: 'dn', lat: 16.0678, lon: 108.2208 },
  { name: 'Bạch Đằng, Hải Châu', city: 'dn', lat: 16.0695, lon: 108.2255 },
  { name: 'Sơn Trà, Đà Nẵng', city: 'dn', lat: 16.0745, lon: 108.2440 },
  { name: 'Thanh Khê, Đà Nẵng', city: 'dn', lat: 16.0640, lon: 108.1965 },
  { name: 'Ngũ Hành Sơn, Đà Nẵng', city: 'dn', lat: 16.0545, lon: 108.2435 },
];

function getFallbackArea(lat: number, lon: number): { name: string; city: 'hn' | 'hcm' | 'dn' } {
  let closest = KNOWN_AREAS[0];
  let minDistance = Infinity;
  for (const area of KNOWN_AREAS) {
    const d = Math.hypot(lat - area.lat, lon - area.lon);
    if (d < minDistance) {
      minDistance = d;
      closest = area;
    }
  }
  return { name: closest.name, city: closest.city as 'hn' | 'hcm' | 'dn' };
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

        const city = detectCity(lat, lon)
        if (detected) {
          // Làm sạch tiền tố hành chính dài
          detected = detected
            .replace(/^(Phường|Xã|Thị trấn|Quận|Huyện|Thành phố|Tỉnh)\s+/i, '')
            .trim()

          return NextResponse.json({
            area: detected,
            city,
            fullAddress: data.display_name,
          })
        }
      }
    } catch {
      // Bỏ qua lỗi mạng từ OpenStreetMap và chuyển sang thuật toán khoảng cách
    }

    // Thuật toán dự phòng tính khoảng cách gần nhất
    const fallback = getFallbackArea(lat, lon)
    return NextResponse.json({ area: fallback.name, city: fallback.city })
  } catch (err) {
    return NextResponse.json({ area: 'Cầu Giấy', city: 'hn' })
  }
}

function detectCity(lat: number, lon: number): 'hn' | 'hcm' | 'dn' {
  const distHn = Math.hypot(lat - 21.0285, lon - 105.8048);
  const distHcm = Math.hypot(lat - 10.7769, lon - 106.7009);
  const distDn = Math.hypot(lat - 16.0544, lon - 108.2022);
  if (distHcm <= distHn && distHcm <= distDn) return 'hcm';
  if (distDn <= distHn && distDn <= distHcm) return 'dn';
  return 'hn';
}
