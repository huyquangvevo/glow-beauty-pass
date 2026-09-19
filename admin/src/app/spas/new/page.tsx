'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertCircle,
  HelpCircle,
  LocateFixed,
  Layers,
  MessageSquareText,
  Zap,
  ClipboardCopy,
} from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import { MultiImageUploader } from '@/components/MultiImageUploader'
import { GoogleMapPicker } from '@/components/GoogleMapPicker'
import { ServiceSelector } from '@/components/ServiceSelector'

const STOCK_PHOTOS = [
  { url: '/spas/spa_thumb_1.jpg', label: 'Bồn gội thảo dược & vòm LED' },
  { url: '/spas/spa_thumb_2.jpg', label: 'Massage vai gáy trị liệu' },
  { url: '/spas/spa_thumb_3.jpg', label: 'Không gian ấm cúng sang trọng' },
  { url: '/spas/spa_thumb_4.jpg', label: 'Khay thảo mộc & bồ kết' },
  { url: '/spas/spa_thumb_5.jpg', label: 'Gội đầu dưỡng sinh thư giãn' },
  { url: '/banners/banner_spa_ambiance.jpg', label: 'Không gian spa thiên nhiên' },
  { url: '/banners/banner_herbal_wash.jpg', label: 'Bồn thảo mộc dưỡng sinh' },
  { url: '/banners/banner_neck_massage.jpg', label: 'Massage cổ vai gáy chuyên sâu' },
  { url: '/spas/spa_real_01.jpg', label: 'Giường massage SOP 01' },
  { url: '/spas/spa_real_02.jpg', label: 'Giường massage SOP 02' },
  { url: '/spas/spa_real_03.jpg', label: 'Không gian gội dưỡng sinh 03' },
]

export default function OnboardSpaPage() {
  const router = useRouter()

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [address, setAddress] = useState('')
  const [ward, setWard] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('dn')
  const [cityName, setCityName] = useState('')
  const [phone, setPhone] = useState('')
  const [latitude, setLatitude] = useState('15.9320')
  const [longitude, setLongitude] = useState('108.3180')
  const [openHours, setOpenHours] = useState('09:00 - 21:30')
  const [tier, setTier] = useState('STANDARD')
  const [exclusiveOffer, setExclusiveOffer] = useState('Tặng 1 ly trà thảo mộc dưỡng nhan hạt chia')
  const [imageUrl, setImageUrl] = useState('/spas/spa_thumb_1.jpg')
  const [photos, setPhotos] = useState<string[]>(['/spas/spa_thumb_1.jpg'])
  const [serviceIds, setServiceIds] = useState<string[]>([
    'goi-sach',
    'goi-dau-cap',
    'duong-sinh',
    'massage-body',
  ])
  const [isActive, setIsActive] = useState(true)
  const [isVirtual, setIsVirtual] = useState(false)
  const [initSlots, setInitSlots] = useState(true)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Zalo Fast Parser State
  const [zaloText, setZaloText] = useState('')
  const [showZaloParser, setShowZaloParser] = useState(true)

  // Phân tích thông tin tự động từ tin nhắn Zalo của Spa
  const handleParseZaloText = () => {
    if (!zaloText.trim()) return

    const lines = zaloText.split('\n').map((l) => l.trim()).filter(Boolean)
    let extractedName = ''
    let extractedAddress = ''
    let extractedPhone = ''
    let extractedWard = ''
    let extractedDistrict = ''
    let extractedCity = ''
    let extractedCityName = ''

    // 1. Hotline / Số điện thoại
    const phoneMatch =
      zaloText.match(/(?:sđt|zalo|hotline|liên hệ|phone|tel)[\s:•\.-]*([0-9\.\s]{9,15})/i) ||
      zaloText.match(/(0[235789][0-9\.\s]{8,12})/)
    if (phoneMatch) {
      extractedPhone = phoneMatch[1].replace(/[^0-9]/g, '')
    }

    // 2. Tìm Tên và Địa chỉ theo dòng
    for (const line of lines) {
      if (!extractedName && /(?:tên cửa hàng|tên spa|tên cơ sở|tên:|^•\s*tên)/i.test(line)) {
        extractedName = line
          .replace(/^[•\-\*]\s*/, '')
          .replace(/^(?:tên cửa hàng|tên spa|tên cơ sở|tên)[\s:•\.-]*/i, '')
          .trim()
      }
      if (!extractedAddress && /(?:địa chỉ|đ\/c|address|^•\s*địa chỉ)/i.test(line)) {
        extractedAddress = line
          .replace(/^[•\-\*]\s*/, '')
          .replace(/^(?:địa chỉ|đ\/c|address)[\s:•\.-]*/i, '')
          .trim()
      }
    }

    // Fallback tên nếu không có nhãn
    if (!extractedName && lines.length > 0) {
      const firstLine = lines[0].replace(/^[•\-\*]\s*/, '')
      if (!firstLine.includes('0') && firstLine.length < 50) {
        extractedName = firstLine
      }
    }

    // 3. Phân tích Phường/Xã từ địa chỉ hoặc toàn bộ văn bản
    const searchTarget = extractedAddress || zaloText
    const wardMatch = searchTarget.match(/(?:phường|p\.|xã|x\.|thị trấn|tt\.)\s*([^,•\n\.]+)/i)
    if (wardMatch) {
      extractedWard = wardMatch[1].trim()
      // Chuẩn hóa viết hoa chữ cái đầu
      extractedWard = extractedWard
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }

    // 4. Phân tích Quận/Huyện/Thị xã/Thành phố trực thuộc
    const distMatch = searchTarget.match(/(?:quận|q\.|huyện|h\.|thị xã|tx\.|tp\.|thành phố)\s*([^,•\n\.]+)/i)
    if (distMatch) {
      extractedDistrict = distMatch[1].trim()
      extractedDistrict = extractedDistrict
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }

    // 5. Phân tích Tỉnh / Thành Phố & Map tới mã hệ thống (hn, dn, hcm)
    const lower = searchTarget.toLowerCase()
    if (
      lower.includes('hồ chí minh') ||
      lower.includes('sài gòn') ||
      lower.includes('thủ dầu một') ||
      lower.includes('bình dương') ||
      lower.includes('đồng nai') ||
      lower.includes('vũng tàu') ||
      lower.includes('cần thơ')
    ) {
      extractedCity = 'hcm'
      if (lower.includes('thủ dầu một') || lower.includes('bình dương')) {
        extractedCityName = 'Bình Dương'
      } else {
        extractedCityName = 'TP.HCM'
      }
    } else if (
      lower.includes('đà nẵng') ||
      lower.includes('quảng nam') ||
      lower.includes('hội an') ||
      lower.includes('huế')
    ) {
      extractedCity = 'dn'
      if (lower.includes('hội an') || lower.includes('quảng nam')) {
        extractedCityName = 'Quảng Nam'
      } else {
        extractedCityName = 'Đà Nẵng'
      }
    } else if (
      lower.includes('hà nội') ||
      lower.includes('hải phòng') ||
      lower.includes('quảng ninh') ||
      lower.includes('bắc ninh')
    ) {
      extractedCity = 'hn'
      extractedCityName = 'Hà Nội'
    }

    // Áp dụng dữ liệu trích xuất vào form
    if (extractedName) handleNameChange(extractedName)
    if (extractedAddress) setAddress(extractedAddress)
    if (extractedPhone) setPhone(extractedPhone)
    if (extractedWard) setWard(extractedWard)
    if (extractedDistrict) setDistrict(extractedDistrict)
    if (extractedCity) setCity(extractedCity)
    if (extractedCityName) setCityName(extractedCityName)

    alert(
      `Đã tự động điền form từ tin nhắn Zalo:\n- Tên Spa: ${extractedName || '(chưa rõ)'}\n- Hotline: ${extractedPhone || '(chưa rõ)'}\n- Địa chỉ: ${extractedAddress || '(chưa rõ)'}\n- Phường/Xã: ${extractedWard || '(chưa rõ)'}\n- Tỉnh/Khu vực: ${extractedCityName || '(chưa rõ)'}`
    )
  }

  // Tự động sinh slug khi nhập tên
  const handleNameChange = (val: string) => {
    setName(val)
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setSlug(generatedSlug)
  }

  // Dùng GPS thiết bị
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6))
          setLongitude(pos.coords.longitude.toFixed(6))
        },
        () => alert('Không thể lấy tọa độ hiện tại. Vui lòng cho phép quyền truy cập GPS.')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !address.trim() || !phone.trim() || !ward.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Tên, Địa chỉ, Phường/Xã và Số điện thoại hotline.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/spas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          address: address.trim(),
          ward: ward.trim(),
          district: district.trim() || 'Thành phố',
          city: city || 'dn',
          cityName: cityName.trim() || 'Việt Nam',
          phone: phone.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          openHours: openHours.trim(),
          tier,
          exclusiveOffer: exclusiveOffer.trim(),
          imageUrl: photos[0] || imageUrl,
          photos,
          serviceIds,
          isActive,
          isVirtual,
          initSlots,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không thể tạo mới spa. Vui lòng kiểm tra lại dữ liệu.')
        return
      }

      // Onboard thành công -> Quay lại danh sách
      router.push('/spas')
    } catch (err) {
      console.error('Submit error:', err)
      setErrorMsg('Lỗi kết nối máy chủ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const inp =
    'w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white'

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* HEADER & BACK BUTTON */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/spas"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#40813D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại danh sách Spa</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A3B18] tracking-tight">
            Onboard Spa Đối Tác Mới
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Khai báo cơ sở đạt chuẩn kiểm định để tự động hiển thị trên web Glow Beauty Pass
          </p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* QUICK EXTRACT FROM ZALO CHAT MESSAGE */}
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/80 rounded-3xl p-5 border border-blue-200/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <MessageSquareText className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <span>⚡ Điền Nhanh Từ Tin Nhắn Zalo Đối Tác</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300">
                    Bóc tách tự động
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Copy toàn bộ đoạn chat giới thiệu spa từ nhóm Zalo rồi dán vào đây để điền form tự động trong 1 giây!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowZaloParser(!showZaloParser)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors self-start sm:self-auto cursor-pointer"
            >
              {showZaloParser ? 'Thu gọn' : 'Mở rộng'}
            </button>
          </div>

          {showZaloParser && (
            <div className="space-y-2.5 pt-1">
              <textarea
                rows={3}
                value={zaloText}
                onChange={(e) => setZaloText(e.target.value)}
                placeholder={`Dán nội dung tin nhắn Zalo vào đây, ví dụ:\n• Tên cửa hàng Habi spa\n• Địa chỉ Đường N6 khu dân cư Phú hoà 1 phường Phú lợi tp thủ dầu một\n• Sđt/Zalo liên hệ 0772.132.715`}
                className="w-full p-3.5 rounded-2xl bg-white border border-blue-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-blue-800 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tự động nhận diện Tên, Hotline, Phường/Xã, Quận/Huyện và Tỉnh/Thành</span>
                </div>

                <div className="flex items-center gap-2">
                  {zaloText && (
                    <button
                      type="button"
                      onClick={() => setZaloText('')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
                    >
                      Xóa nội dung
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleParseZaloText}
                    disabled={!zaloText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ Bóc Tách & Điền Vào Form Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building2 className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              1. Thông Tin Nhận Diện Cơ Sở
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700">
                Tên Cơ Sở Spa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: An Nhiên Dưỡng Sinh Spa Cầu Giấy"
                required
                className={inp}
              />
            </div>

            {/* Slug URL */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Đường dẫn SEO (Slug URL)</span>
                <span className="text-[11px] text-stone-400 font-normal">
                  URL chi tiết: /spa/{slug || 'ten-spa'}
                </span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="an-nhien-duong-sinh-cau-giay"
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-mono text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            {/* Hotline */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                Hotline Tiếp Nhận Khách <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912345001"
                required
                className={inp}
              />
            </div>

            {/* Open Hours */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Giờ Mở Cửa</label>
              <input
                type="text"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                placeholder="09:00 - 21:30"
                className={inp}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & GPS Coordinates */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#40813D]" />
              <h2 className="text-base font-extrabold text-stone-900">
                2. Địa Chỉ & Tọa Độ Vị Trí
              </h2>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#40813D] hover:underline cursor-pointer"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>Dùng GPS thiết bị</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phường / Xã */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Phường / Xã / Thị Trấn <span className="text-red-500">*</span></span>
                <span className="text-[11px] text-emerald-600 font-medium">Tự động lấy theo Map</span>
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="VD: Phường Điện Dương, Dịch Vọng..."
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            {/* Quận / Huyện / Thị xã */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Quận / Huyện / Thị Xã</span>
                <span className="text-[11px] text-emerald-600 font-medium">Tự động lấy theo Map</span>
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="VD: Thị xã Điện Bàn, Quận Cầu Giấy..."
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            {/* Tỉnh / Thành phố */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Tỉnh / Thành Phố</span>
                <span className="text-[11px] text-emerald-600 font-medium">Tự động nhận diện toàn quốc</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => {
                    setCityName(e.target.value)
                    const lower = e.target.value.toLowerCase()
                    if (lower.includes('hồ chí minh') || lower.includes('sài gòn')) setCity('hcm')
                    else if (lower.includes('đà nẵng') || lower.includes('quảng nam') || lower.includes('hội an')) setCity('dn')
                    else if (lower.includes('hà nội')) setCity('hn')
                  }}
                  placeholder="VD: Quảng Nam, Đà Nẵng, Hà Nội, TP.HCM..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
                />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
                >
                  <option value="dn">Khu vực Web: Đà Nẵng / Quảng Nam / Miền Trung (dn)</option>
                  <option value="hn">Khu vực Web: Hà Nội & Miền Bắc (hn)</option>
                  <option value="hcm">Khu vực Web: TP.HCM & Miền Nam (hcm)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700">
                Địa Chỉ Chính Xác <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: 70 Đường Ven Biển, P. Điện Dương, TX. Điện Bàn, Quảng Nam"
                required
                className={inp}
              />
            </div>

            {/* Google Map Picker */}
            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#40813D]" />
                <span>Chọn & Ghim Tọa Độ Trên Bản Đồ Google Maps</span>
              </label>
              <GoogleMapPicker
                latitude={parseFloat(latitude) || 15.9320}
                longitude={parseFloat(longitude) || 108.3180}
                address={address}
                onLocationChange={(loc) => {
                  setLatitude(loc.lat.toString())
                  setLongitude(loc.lng.toString())
                  if (loc.address) setAddress(loc.address)
                  if (loc.ward) setWard(loc.ward)
                  if (loc.district) setDistrict(loc.district)
                  if (loc.cityName) setCityName(loc.cityName)
                  if (loc.city) setCity(loc.city)
                }}
              />
            </div>

            {/* Lat */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Vĩ Độ (Latitude)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="21.0345"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            {/* Lon */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Kinh Độ (Longitude)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="105.7930"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Services on Home Menu */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#40813D]" />
              <div>
                <h2 className="text-base font-extrabold text-stone-900">
                  3. Phân Loại Dịch Vụ Cung Cấp (Dẫn Từ Menu Trang Chủ)
                </h2>
                <p className="text-xs text-stone-500">
                  Tích chọn các dịch vụ mà cơ sở này nhận khách. Khi khách bấm dịch vụ tương ứng trên Menu Home sẽ được điều hướng tới Spa này.
                </p>
              </div>
            </div>
          </div>

          <ServiceSelector
            selectedServiceIds={serviceIds}
            onChange={setServiceIds}
          />
        </div>

        {/* Section 4: Tier & Exclusive Offer */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              4. Phân Hạng Hợp Tác & Ưu Đãi Độc Quyền
            </h2>
          </div>

          <div className="space-y-4">
            {/* Tier Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">
                Phân Hạng Kiểm Định (Tier)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'STANDARD',
                    label: 'STANDARD',
                    desc: 'Đạt kiểm tra đầu vào, cam kết không phụ thu.',
                  },
                  {
                    id: 'VERIFIED',
                    label: 'VERIFIED',
                    desc: 'Đã qua kiểm tra Mystery Shopper thực tế.',
                  },
                  {
                    id: 'CERTIFIED',
                    label: 'CERTIFIED',
                    desc: 'Chuẩn cao nhất, cam kết slot off-peak cố định.',
                  },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTier(t.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      tier === t.id
                        ? 'border-[#40813D] bg-emerald-50/50 shadow-xs ring-2 ring-[#40813D]/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-stone-900">{t.label}</span>
                      {tier === t.id && <Check className="w-4 h-4 text-[#40813D]" />}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-normal">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Exclusive Offer */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Ưu Đãi Độc Quyền Riêng Của Điểm (Exclusive Offer)</span>
              </label>
              <input
                type="text"
                value={exclusiveOffer}
                onChange={(e) => setExclusiveOffer(e.target.value)}
                placeholder="VD: Tặng 10 phút cạo gió đầu lưu thông khí huyết"
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-stone-400">Gợi ý nhanh:</span>
                {[
                  'Tặng 1 ly trà thảo mộc dưỡng nhan',
                  'Tặng 10 phút cạo gió đầu',
                  'Tặng bài ngải cứu xông ấm vai gáy',
                  'Giảm 10% đi nhóm 2 người (13h-16h)',
                ].map((sample) => (
                  <button
                    type="button"
                    key={sample}
                    onClick={() => setExclusiveOffer(sample)}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Imagery & Settings */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Layers className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              5. Bộ Sưu Tập Ảnh & Cấu Hình Khởi Tạo
            </h2>
          </div>

          <div className="space-y-4">
            <MultiImageUploader
              photos={photos}
              onChange={(newPhotos) => {
                setPhotos(newPhotos)
                if (newPhotos.length > 0) {
                  setImageUrl(newPhotos[0])
                }
              }}
              stockPhotos={STOCK_PHOTOS}
            />

            {/* Toggles */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <input
                  type="checkbox"
                  checked={isVirtual}
                  onChange={(e) => setIsVirtual(e.target.checked)}
                  className="w-4.5 h-4.5 text-purple-600 rounded border-stone-300 focus:ring-purple-600"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>Đánh dấu là Điểm Ảo (Demo)</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isVirtual
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isVirtual ? 'Điểm ảo demo' : 'Điểm thật đối tác'}
                    </span>
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Bật tùy chọn này nếu đây là spa tạo phục vụ mục đích chạy thử/demo. Mặc định tắt để tạo điểm thật đối tác.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4.5 h-4.5 text-[#40813D] rounded border-stone-300 focus:ring-[#40813D]"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                    Kích hoạt hiển thị ngay trên web khách hàng
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Khách hàng trên trang chủ và trang tìm kiếm sẽ thấy spa này ngay lập tức.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={initSlots}
                  onChange={(e) => setInitSlots(e.target.checked)}
                  className="w-4.5 h-4.5 text-[#40813D] rounded border-stone-300 focus:ring-[#40813D]"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                    Khởi tạo sẵn 3 ca đặt lịch đầu ngày (Sáng, Chiều, Tối)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Tự động tạo 3 slot lịch trống trong database để nhân viên Zalo Hub có thể điều phối ngay.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/spas"
            className="px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            Hủy Bỏ
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#356F32] to-[#40813D] hover:from-[#2E602C] hover:to-[#356F32] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang lưu vào hệ thống...</span>
              </div>
            ) : (
              <span>Xác Nhận Onboard & Đưa Lên Web</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
