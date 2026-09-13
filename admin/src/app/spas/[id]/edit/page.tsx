'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  AlertTriangle,
  Layers,
  Save,
  MessageSquare,
  HelpCircle,
  UploadCloud,
  Trash2,
  Plus,
  Star,
  ExternalLink,
} from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import { GoogleMapPicker } from '@/components/GoogleMapPicker'

const STOCK_PHOTOS = [
  { url: '/spas/spa_thumb_1.jpg', label: 'Bồn gội thảo dược' },
  { url: '/spas/spa_thumb_2.jpg', label: 'Massage vai gáy' },
  { url: '/spas/spa_thumb_3.jpg', label: 'Không gian ấm cúng' },
  { url: '/spas/spa_thumb_4.jpg', label: 'Khay thảo mộc' },
  { url: '/spas/spa_thumb_5.jpg', label: 'Gội đầu dưỡng sinh' },
]

interface ReviewBreakdown {
  stars5: number
  stars4: number
  stars3: number
  stars2: number
  stars1: number
}

interface CuratedReview {
  id: string
  authorName: string
  authorInitials: string
  authorMeta: string
  body: string
  avatarUrl?: string
  googleMapUrl?: string
  stars: number
}

interface FaqItem {
  question: string
  answer: string
}

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

  // Review System Fields (Matching luggage-storage)
  const [reviewSectionTitle, setReviewSectionTitle] = useState('Khách hàng nói gì về chúng tôi')
  const [reviewSectionSubtitle, setReviewSectionSubtitle] = useState('Đánh giá từ trải nghiệm dịch vụ thực tế')
  const [reviewBreakdown, setReviewBreakdown] = useState<ReviewBreakdown>({
    stars5: 0,
    stars4: 0,
    stars3: 0,
    stars2: 0,
    stars1: 0,
  })
  const [reviewTagsInput, setReviewTagsInput] = useState('')
  const [curatedReviews, setCuratedReviews] = useState<CuratedReview[]>([])
  const [uploadingAvatarIdx, setUploadingAvatarIdx] = useState<number | null>(null)
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  // FAQ Fields (Matching luggage-storage)
  const [faqs, setFaqs] = useState<FaqItem[]>([])

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

          // Load Reviews & FAQs
          setReviewSectionTitle(s.reviewSectionTitle || 'Khách hàng nói gì về chúng tôi')
          setReviewSectionSubtitle(s.reviewSectionSubtitle || 'Đánh giá từ trải nghiệm dịch vụ thực tế')
          if (s.reviewBreakdown) {
            setReviewBreakdown({
              stars5: s.reviewBreakdown.stars5 ?? 0,
              stars4: s.reviewBreakdown.stars4 ?? 0,
              stars3: s.reviewBreakdown.stars3 ?? 0,
              stars2: s.reviewBreakdown.stars2 ?? 0,
              stars1: s.reviewBreakdown.stars1 ?? 0,
            })
          }
          if (Array.isArray(s.reviewTags)) {
            setReviewTagsInput(s.reviewTags.join(', '))
          }
          if (Array.isArray(s.curatedReviews)) {
            setCuratedReviews(s.curatedReviews)
          }
          if (Array.isArray(s.faqs)) {
            setFaqs(s.faqs)
          }
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

  // Recalculate breakdown
  const handleBreakdownChange = (key: keyof ReviewBreakdown, rawVal: string) => {
    const val = rawVal === '' ? 0 : parseInt(rawVal, 10)
    if (!Number.isNaN(val) && val >= 0) {
      setReviewBreakdown((prev) => ({
        ...prev,
        [key]: val,
      }))
    }
  }

  // Avatar upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingAvatarIdx(idx)
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`/api/upload?filename=avatar-${Date.now()}.webp`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setCuratedReviews((prev) => {
          const rev = [...prev]
          rev[idx] = { ...rev[idx], avatarUrl: data.url }
          return rev
        })
      } else {
        alert(data.error || 'Upload ảnh đại diện thất bại.')
      }
    } catch (err) {
      console.error('Avatar upload error:', err)
      alert('Không thể tải ảnh avatar lên.')
    } finally {
      setUploadingAvatarIdx(null)
    }
  }

  const addReview = () => {
    setCuratedReviews((prev) => [
      ...prev,
      {
        id: `rev-${Date.now()}`,
        authorName: '',
        authorInitials: '',
        authorMeta: 'Google Maps',
        body: '',
        avatarUrl: '',
        googleMapUrl: '',
        stars: 5,
      },
    ])
  }

  const removeReview = (idx: number) => {
    setCuratedReviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const addFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        question: '',
        answer: '',
      },
    ])
  }

  const removeFaq = (idx: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    try {
      setSaving(true)

      const parsedTags = reviewTagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

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
          reviewSectionTitle: reviewSectionTitle.trim(),
          reviewSectionSubtitle: reviewSectionSubtitle.trim(),
          reviewBreakdown,
          reviewTags: parsedTags,
          curatedReviews,
          faqs,
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

  const inp = "w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white"

  const totalReviewsCount =
    (reviewBreakdown.stars5 || 0) +
    (reviewBreakdown.stars4 || 0) +
    (reviewBreakdown.stars3 || 0) +
    (reviewBreakdown.stars2 || 0) +
    (reviewBreakdown.stars1 || 0)

  const computedAvg =
    totalReviewsCount > 0
      ? (
          ((reviewBreakdown.stars5 || 0) * 5 +
            (reviewBreakdown.stars4 || 0) * 4 +
            (reviewBreakdown.stars3 || 0) * 3 +
            (reviewBreakdown.stars2 || 0) * 2 +
            (reviewBreakdown.stars1 || 0) * 1) /
          totalReviewsCount
        ).toFixed(1)
      : '5.0'

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
            Cập nhật chi tiết cơ sở, điều chỉnh thẻ phạt kiểm soát SOP, quản lý reviews & FAQ
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
                className={inp}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={inp}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Giờ Hoạt Động</label>
              <input
                type="text"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className={inp}
              />
            </div>

            {/* Google Map Picker */}
            <div className="space-y-2 sm:col-span-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#40813D]" />
                <span>Định Vị Tọa Độ & Bản Đồ Google Maps</span>
              </label>
              <GoogleMapPicker
                latitude={parseFloat(latitude) || 0}
                longitude={parseFloat(longitude) || 0}
                address={address}
                onLocationChange={(loc) => {
                  setLatitude(loc.lat.toString())
                  setLongitude(loc.lng.toString())
                  if (loc.address) setAddress(loc.address)
                  if (loc.district) setDistrict(loc.district)
                  if (loc.ward) setWard(loc.ward)
                }}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-stone-700">Địa Chỉ Chi Tiết</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className={inp}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Vĩ Độ (Latitude)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className={`${inp} font-mono`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Kinh Độ (Longitude)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className={`${inp} font-mono`}
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
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium"
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
                className="w-full px-4 py-2.5 rounded-xl bg-amber-50/50 border border-amber-300 text-sm font-bold text-amber-900 focus:outline-none"
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
                className="w-full px-4 py-2.5 rounded-xl bg-red-50/50 border border-red-300 text-sm font-bold text-red-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-3">
              <label className="text-xs font-bold text-stone-700">Ưu Đãi Độc Quyền</label>
              <input
                type="text"
                value={exclusiveOffer}
                onChange={(e) => setExclusiveOffer(e.target.value)}
                placeholder="VD: Tặng 1 ly trà thảo mộc..."
                className={inp}
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

        {/* Section 3: Imagery */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Layers className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900">
              3. Ảnh Đại Diện Cơ Sở
            </h2>
          </div>

          <ImageUploader
            currentImageUrl={imageUrl}
            onImageChange={setImageUrl}
            stockPhotos={STOCK_PHOTOS}
          />
        </div>

        {/* Section 4: WHAT OUR CUSTOMERS SAY (Matching luggage-storage) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#40813D]" />
              <h2 className="text-base font-extrabold text-stone-900 uppercase tracking-wide">
                4. WHAT OUR CUSTOMERS SAY (Đánh Giá Khách Hàng)
              </h2>
            </div>
            {totalReviewsCount > 0 && (
              <span className="text-xs font-bold bg-emerald-50 text-[#236B38] px-3 py-1 rounded-full border border-emerald-200">
                ★ {computedAvg} ({totalReviewsCount} đánh giá)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Review section title</label>
              <input
                type="text"
                className={inp}
                value={reviewSectionTitle}
                onChange={(e) => setReviewSectionTitle(e.target.value)}
                placeholder="What customers are saying"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Review section subtitle</label>
              <input
                type="text"
                className={inp}
                value={reviewSectionSubtitle}
                onChange={(e) => setReviewSectionSubtitle(e.target.value)}
                placeholder="Reviews come from real customer experiences"
              />
            </div>
          </div>

          {/* Review Breakdown Board */}
          <div className="rounded-2xl border border-[#dcdcde] bg-[#f6f7f7] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-stone-900">Review Breakdown Board</h4>
              <span className="text-xs text-stone-500 font-medium">
                Tự động đồng bộ điểm trung bình & tổng số review
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const key = `stars${stars}` as keyof ReviewBreakdown
                return (
                  <div key={stars} className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <span>{stars} Stars Count</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`${inp} bg-white`}
                      value={reviewBreakdown[key] === 0 ? '' : reviewBreakdown[key]}
                      onChange={(e) => handleBreakdownChange(key, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                )
              })}
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-stone-700">
                Review Tags (comma separated)
              </label>
              <input
                type="text"
                className={`${inp} bg-white`}
                value={reviewTagsInput}
                onChange={(e) => setReviewTagsInput(e.target.value)}
                placeholder="Convenient location, Fast service, Friendly staff, Đúng quy trình SOP"
              />
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-stone-900">Customer Reviews</h4>
              <span className="text-xs text-stone-500">
                {curatedReviews.length} nhận xét chi tiết
              </span>
            </div>

            {curatedReviews.map((r, idx) => (
              <div
                key={r.id || idx}
                className="grid gap-3 rounded-2xl border border-[#dcdcde] bg-[#f6f7f7] p-4 sm:grid-cols-2"
              >
                {/* Body Textarea */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nội dung đánh giá</label>
                  <textarea
                    rows={3}
                    className={`${inp} bg-white`}
                    placeholder="Nội dung trải nghiệm thực tế của khách hàng..."
                    value={r.body}
                    onChange={(e) => {
                      const rev = [...curatedReviews]
                      rev[idx] = { ...r, body: e.target.value }
                      setCuratedReviews(rev)
                    }}
                  />
                </div>

                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Họ tên khách hàng</label>
                  <input
                    type="text"
                    className={`${inp} bg-white`}
                    placeholder="Liam Carter, Thu Trang..."
                    value={r.authorName}
                    onChange={(e) => {
                      const rev = [...curatedReviews]
                      const name = e.target.value
                      const initials = name
                        .split(' ')
                        .filter(Boolean)
                        .map((w) => w[0]?.toUpperCase())
                        .slice(-2)
                        .join('')
                      rev[idx] = {
                        ...r,
                        authorName: name,
                        authorInitials: r.authorInitials || initials,
                      }
                      setCuratedReviews(rev)
                    }}
                  />
                </div>

                {/* Avatar Uploader & URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700">Avatar</label>
                  <div className="flex items-center gap-3">
                    {r.avatarUrl?.trim() ? (
                      <img
                        src={r.avatarUrl}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full border border-stone-300 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e2e9f2] text-sm font-bold text-[#151c23]">
                        {r.authorInitials?.trim() || '?'}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                          fileInputRefs.current[idx] = el
                        }}
                        onChange={(e) => handleAvatarFileChange(e, idx)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingAvatarIdx === idx}
                        className="rounded-lg border border-[#2271b1] px-3 py-1.5 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc] transition-colors cursor-pointer"
                        onClick={() => fileInputRefs.current[idx]?.click()}
                      >
                        {uploadingAvatarIdx === idx ? 'Đang tải...' : 'Upload ảnh'}
                      </button>
                      {r.avatarUrl?.trim() ? (
                        <button
                          type="button"
                          className="rounded-lg border border-[#b32d2e] px-3 py-1.5 text-xs font-semibold text-[#b32d2e] hover:bg-[#fff1f1] transition-colors cursor-pointer"
                          onClick={() => {
                            const rev = [...curatedReviews]
                            rev[idx] = { ...r, avatarUrl: '' }
                            setCuratedReviews(rev)
                          }}
                        >
                          Xóa ảnh
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <input
                    type="text"
                    className={`${inp} bg-white text-xs`}
                    placeholder="Hoặc dán URL avatar (https://...)"
                    value={r.avatarUrl ?? ''}
                    onChange={(e) => {
                      const rev = [...curatedReviews]
                      rev[idx] = { ...r, avatarUrl: e.target.value }
                      setCuratedReviews(rev)
                    }}
                  />
                </div>

                {/* Platform / Meta */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nguồn / Thời gian</label>
                  <input
                    type="text"
                    className={`${inp} bg-white`}
                    placeholder="Google Maps, 3 days ago..."
                    value={r.authorMeta}
                    onChange={(e) => {
                      const rev = [...curatedReviews]
                      rev[idx] = { ...r, authorMeta: e.target.value }
                      setCuratedReviews(rev)
                    }}
                  />
                </div>

                {/* Google Map Link */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Google Map Link (Tuỳ chọn)</label>
                  <input
                    type="text"
                    className={`${inp} bg-white`}
                    placeholder="https://maps.google.com/..."
                    value={r.googleMapUrl ?? ''}
                    onChange={(e) => {
                      const rev = [...curatedReviews]
                      rev[idx] = { ...r, googleMapUrl: e.target.value }
                      setCuratedReviews(rev)
                    }}
                  />
                </div>

                {/* Initials & Stars */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Initials</label>
                    <input
                      type="text"
                      className={`${inp} bg-white`}
                      placeholder="LC, TT..."
                      value={r.authorInitials}
                      onChange={(e) => {
                        const rev = [...curatedReviews]
                        rev[idx] = { ...r, authorInitials: e.target.value }
                        setCuratedReviews(rev)
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Stars (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className={`${inp} bg-white font-bold`}
                      value={r.stars ?? 5}
                      onChange={(e) => {
                        const raw = Number(e.target.value)
                        const n = Number.isFinite(raw) ? Math.max(1, Math.min(5, Math.round(raw))) : 5
                        const rev = [...curatedReviews]
                        rev[idx] = { ...r, stars: n }
                        setCuratedReviews(rev)
                      }}
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    className="text-sm font-bold text-[#d92d20] hover:text-red-700 transition-colors inline-flex items-center gap-1 cursor-pointer py-2"
                    onClick={() => removeReview(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#175cd3] hover:text-blue-800 transition-colors py-1 cursor-pointer"
              onClick={addReview}
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm review</span>
            </button>
          </div>
        </div>

        {/* Section 5: FAQ — Frequently Asked Questions (SEO) (Matching luggage-storage Screenshot 2) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <HelpCircle className="w-5 h-5 text-[#40813D]" />
            <h2 className="text-base font-extrabold text-stone-900 uppercase tracking-wide">
              5. FAQ — FREQUENTLY ASKED QUESTIONS (SEO)
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="grid gap-3 rounded-2xl border border-[#dcdcde] bg-[#f6f7f7] p-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Câu hỏi (Question)</label>
                  <input
                    type="text"
                    className={`${inp} bg-white`}
                    placeholder="VD: Đặt lịch tại cơ sở có cần cọc trước không?"
                    value={faq.question}
                    onChange={(e) => {
                      const f = [...faqs]
                      f[idx] = { ...faq, question: e.target.value }
                      setFaqs(f)
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Câu trả lời (Answer)</label>
                  <textarea
                    rows={2}
                    className={`${inp} bg-white`}
                    placeholder="VD: Bạn không cần cọc trước, chỉ cần xác nhận khung giờ qua Zalo..."
                    value={faq.answer}
                    onChange={(e) => {
                      const f = [...faqs]
                      f[idx] = { ...faq, answer: e.target.value }
                      setFaqs(f)
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-bold text-[#d92d20] hover:text-red-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    onClick={() => removeFaq(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#175cd3] hover:text-blue-800 transition-colors py-1 cursor-pointer"
              onClick={addFaq}
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm câu hỏi FAQ</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
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
