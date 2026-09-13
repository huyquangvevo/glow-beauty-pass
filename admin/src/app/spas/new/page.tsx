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
} from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import { GoogleMapPicker } from '@/components/GoogleMapPicker'

// Tọa độ gợi ý trung tâm các phường Cầu Giấy để hỗ trợ nhập nhanh
const WARD_PRESETS: Record<string, { lat: number; lon: number; addressHint: string }> = {
  'Dịch Vọng': { lat: 21.0345, lon: 105.7930, addressHint: 'Ngõ 165 Cầu Giấy / Phố Thọ Tháp' },
  'Dịch Vọng Hậu': { lat: 21.0315, lon: 105.7830, addressHint: 'Phố Duy Tân / Trần Thái Tông' },
  'Trung Hòa': { lat: 21.0110, lon: 105.8010, addressHint: 'Phố Hoàng Đạo Thúy / Trung Hòa' },
  'Yên Hòa': { lat: 21.0220, lon: 105.7940, addressHint: 'Phố Vũ Phạm Hàm / Trung Kính' },
  'Nghĩa Tân': { lat: 21.0450, lon: 105.7960, addressHint: 'Phố Tô Hiệu / Nghĩa Tân' },
  'Quan Hoa': { lat: 21.0360, lon: 105.8010, addressHint: 'Đường Nguyễn Khánh Toàn / Quan Hoa' },
  'Mai Dịch': { lat: 21.0390, lon: 105.7760, addressHint: 'Đường Hồ Tùng Mậu / Mai Dịch' },
}

const STOCK_PHOTOS = [
  { url: '/spas/spa_thumb_1.jpg', label: 'Bồn gội thảo dược & gương vòm' },
  { url: '/spas/spa_thumb_2.jpg', label: 'Massage vai gáy trị liệu' },
  { url: '/spas/spa_thumb_3.jpg', label: 'Không gian ấm cúng sang trọng' },
  { url: '/spas/spa_thumb_4.jpg', label: 'Khay thảo mộc & bồ kết hoa cúc' },
  { url: '/spas/spa_thumb_5.jpg', label: 'Gội đầu dưỡng sinh thư giãn' },
]

export default function OnboardSpaPage() {
  const router = useRouter()

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [address, setAddress] = useState('')
  const [ward, setWard] = useState('Dịch Vọng')
  const [district, setDistrict] = useState('Cầu Giấy')
  const [phone, setPhone] = useState('')
  const [latitude, setLatitude] = useState('21.0345')
  const [longitude, setLongitude] = useState('105.7930')
  const [openHours, setOpenHours] = useState('09:00 - 21:30')
  const [tier, setTier] = useState('STANDARD')
  const [exclusiveOffer, setExclusiveOffer] = useState('Tặng 1 ly trà thảo mộc dưỡng nhan hạt chia')
  const [imageUrl, setImageUrl] = useState('/spas/spa_thumb_1.jpg')
  const [isActive, setIsActive] = useState(true)
  const [initSlots, setInitSlots] = useState(true)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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

  // Tự động điền tọa độ mẫu theo phường
  const handleWardChange = (val: string) => {
    setWard(val)
    const preset = WARD_PRESETS[val]
    if (preset) {
      setLatitude(preset.lat.toString())
      setLongitude(preset.lon.toString())
    }
  }

  // Dùng GPS thiết bị
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4))
          setLongitude(pos.coords.longitude.toFixed(4))
        },
        () => alert('Không thể lấy tọa độ hiện tại. Vui lòng cho phép quyền truy cập GPS.')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !address.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Tên, Địa chỉ và Số điện thoại hotline.')
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
          ward,
          district,
          phone: phone.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          openHours: openHours.trim(),
          tier,
          exclusiveOffer: exclusiveOffer.trim(),
          imageUrl,
          isActive,
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
      router.refresh()
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
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
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
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
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
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
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
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
                2. Địa Chỉ & Tọa Độ GPS (Tính Khoảng Cách)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#40813D] hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>Dùng GPS Hiện Tại</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phường */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Phường (Khu Vực)</label>
              <select
                value={ward}
                onChange={(e) => handleWardChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              >
                {Object.keys(WARD_PRESETS).map((w) => (
                  <option key={w} value={w}>
                    {w} ({WARD_PRESETS[w].addressHint})
                  </option>
                ))}
              </select>
            </div>

            {/* Quận */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Quận (Thí điểm)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-100 border border-stone-200 text-sm text-stone-600 focus:outline-none"
                readOnly
              />
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
                placeholder="VD: Số 18 Ngõ 165 Cầu Giấy, P. Dịch Vọng, Cầu Giấy, Hà Nội"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            {/* Google Map Picker */}
            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#40813D]" />
                <span>Chọn & Ghim Tọa Độ Trên Bản Đồ Google Maps</span>
              </label>
              <GoogleMapPicker
                latitude={parseFloat(latitude) || 21.0345}
                longitude={parseFloat(longitude) || 105.7930}
                address={address}
                onLocationChange={(loc) => {
                  setLatitude(loc.lat.toString())
                  setLongitude(loc.lng.toString())
                  if (loc.address) setAddress(loc.address)
                  if (loc.ward && Object.keys(WARD_PRESETS).includes(loc.ward)) {
                    setWard(loc.ward)
                  }
                  if (loc.district) {
                    setDistrict(loc.district)
                  }
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

        {/* Section 3: Tier & Exclusive Offer */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              3. Phân Hạng Hợp Tác & Ưu Đãi Độc Quyền
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

        {/* Section 4: Imagery & Settings */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Layers className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              4. Ảnh Đại Diện & Cấu Hình Khởi Tạo
            </h2>
          </div>

          <div className="space-y-4">
            <ImageUploader
              currentImageUrl={imageUrl}
              onImageChange={setImageUrl}
              stockPhotos={STOCK_PHOTOS}
            />

            {/* Toggles */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
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
