'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
  AlertTriangle,
  Layers,
  Save,
} from 'lucide-react'

const STOCK_PHOTOS = [
  { url: '/spas/spa_thumb_1.jpg', label: 'Bồn gội thảo dược' },
  { url: '/spas/spa_thumb_2.jpg', label: 'Massage vai gáy' },
  { url: '/spas/spa_thumb_3.jpg', label: 'Không gian ấm cúng' },
  { url: '/spas/spa_thumb_4.jpg', label: 'Khay thảo mộc' },
  { url: '/spas/spa_thumb_5.jpg', label: 'Gội đầu dưỡng sinh' },
]

export default function EditSpaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form Fields
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [ward, setWard] = useState('Dịch Vọng')
  const [district, setDistrict] = useState('Cầu Giấy')
  const [phone, setPhone] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [openHours, setOpenHours] = useState('09:00 - 21:30')
  const [tier, setTier] = useState('STANDARD')
  const [exclusiveOffer, setExclusiveOffer] = useState('')
  const [imageUrl, setImageUrl] = useState('/spas/spa_thumb_1.jpg')
  const [isActive, setIsActive] = useState(true)
  const [yellowCards, setYellowCards] = useState(0)
  const [redCards, setRedCards] = useState(0)

  useEffect(() => {
    async function loadSpaData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/spas/${id}`)
        const data = await res.json()
        if (res.ok && data.spa) {
          const s = data.spa
          setName(s.name)
          setAddress(s.address)
          setWard(s.ward)
          setDistrict(s.district || 'Cầu Giấy')
          setPhone(s.phone)
          setLatitude(s.latitude.toString())
          setLongitude(s.longitude.toString())
          setOpenHours(s.openHours || '09:00 - 21:30')
          setTier(s.tier || 'STANDARD')
          setExclusiveOffer(s.exclusiveOffer || '')
          setImageUrl(s.imageUrl || '/spas/spa_thumb_1.jpg')
          setIsActive(s.isActive)
          setYellowCards(s.yellowCards || 0)
          setRedCards(s.redCards || 0)
        } else {
          setErrorMsg(data.error || 'Không thể tìm thấy thông tin spa.')
        }
      } catch (err) {
        console.error(err)
        setErrorMsg('Lỗi kết nối máy chủ.')
      } finally {
        setLoading(false)
      }
    }
    if (id) loadSpaData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    try {
      setSaving(true)
      const res = await fetch(`/api/spas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
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
          yellowCards,
          redCards,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không thể cập nhật spa.')
        return
      }

      router.push('/spas')
      router.refresh()
    } catch {
      setErrorMsg('Lỗi máy chủ khi cập nhật.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#40813D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">Đang tải thông tin spa...</p>
      </div>
    )
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
            Chỉnh Sửa Thông Tin Spa
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Cập nhật chi tiết cơ sở, điều chỉnh thẻ phạt kiểm soát chất lượng SOP
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building2 className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              1. Thông Tin Nhận Diện
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700">Tên Cơ Sở Spa</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Giờ Hoạt Động</label>
              <input
                type="text"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700">Địa Chỉ</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Vĩ Độ (Latitude)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#40813D]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Kinh Độ (Longitude)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#40813D]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Quality & Penalty Cards */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-stone-900">
              2. Kiểm Soát Chất Lượng & Thẻ Phạt SOP
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Phân Hạng (Tier)</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-medium"
              >
                <option value="STANDARD">STANDARD</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="CERTIFIED">CERTIFIED</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-800">Thẻ Vàng (Nhắc nhở SOP)</label>
              <input
                type="number"
                min="0"
                max="5"
                value={yellowCards}
                onChange={(e) => setYellowCards(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-300 text-sm font-bold text-amber-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-red-800">Thẻ Đỏ (Đình chỉ hiển thị)</label>
              <input
                type="number"
                min="0"
                max="3"
                value={redCards}
                onChange={(e) => setRedCards(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 rounded-2xl bg-red-50/50 border border-red-300 text-sm font-bold text-red-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-3">
              <label className="text-xs font-bold text-stone-700">Ưu Đãi Độc Quyền</label>
              <input
                type="text"
                value={exclusiveOffer}
                onChange={(e) => setExclusiveOffer(e.target.value)}
                placeholder="VD: Tặng 1 ly trà thảo mộc..."
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4.5 h-4.5 text-[#40813D] rounded border-stone-300 focus:ring-[#40813D]"
              />
              <span className="text-sm font-bold text-stone-900">
                Cho phép cơ sở này hiển thị trên web người dùng (Active)
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/spas"
            className="px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            Hủy Bỏ
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#40813D] hover:bg-[#356F32] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </form>
    </div>
  )
}
