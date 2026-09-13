'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Edit3,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Power,
} from 'lucide-react'
import { PORTAL_BASE_URL } from '@/lib/config'

interface SpaItem {
  id: string
  name: string
  slug: string
  address: string
  district: string
  ward: string
  phone: string
  latitude: number
  longitude: number
  openHours: string
  rating: number
  reviewCount: number
  tier: string
  yellowCards: number
  redCards: number
  exclusiveOffer?: string | null
  imageUrl?: string | null
  isActive: boolean
  createdAt: string
  _count?: {
    bookings: number
    reviews: number
  }
}

interface StatsData {
  total: number
  active: number
  inactive: number
  withViolations: number
}

export default function AdminSpasPage() {
  const [spas, setSpas] = useState<SpaItem[]>([])
  const [stats, setStats] = useState<StatsData>({ total: 0, active: 0, inactive: 0, withViolations: 0 })
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Filters & Search
  const [search, setSearch] = useState('')
  const [selectedWard, setSelectedWard] = useState('ALL')
  const [selectedTier, setSelectedTier] = useState('ALL')
  const [selectedActive, setSelectedActive] = useState('ALL')

  const wards = [
    { id: 'ALL', name: 'Tất cả phường' },
    { id: 'Dịch Vọng', name: 'Dịch Vọng' },
    { id: 'Dịch Vọng Hậu', name: 'Duy Tân / Dịch Vọng Hậu' },
    { id: 'Trung Hòa', name: 'Hoàng Đạo Thúy / Trung Hòa' },
    { id: 'Yên Hòa', name: 'Vũ Phạm Hàm / Yên Hòa' },
    { id: 'Nghĩa Tân', name: 'Tô Hiệu / Nghĩa Tân' },
    { id: 'Quan Hoa', name: 'Quan Hoa' },
    { id: 'Mai Dịch', name: 'Mai Dịch' },
  ]

  const loadSpas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedWard !== 'ALL') params.set('ward', selectedWard)
      if (selectedTier !== 'ALL') params.set('tier', selectedTier)
      if (selectedActive === 'true') params.set('active', 'true')
      if (selectedActive === 'false') params.set('active', 'false')
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/spas?${params.toString()}`)
      const data = await res.json()

      if (res.ok && data.spas) {
        setSpas(data.spas)
        if (data.stats) setStats(data.stats)
      }
    } catch (err) {
      console.error('Error loading spas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSpas()
  }, [selectedWard, selectedTier, selectedActive])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadSpas()
  }

  const handleToggleActive = async (id: string, currentStatus: boolean, spaName: string) => {
    try {
      setTogglingId(id)
      const res = await fetch(`/api/spas/${id}/toggle-active`, {
        method: 'PATCH',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // Cập nhật trạng thái trực tiếp trong danh sách
        setSpas((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: data.isActive } : s))
        )
        // Cập nhật thống kê
        setStats((prev) => ({
          ...prev,
          active: data.isActive ? prev.active + 1 : prev.active - 1,
          inactive: data.isActive ? prev.inactive - 1 : prev.inactive + 1,
        }))
      } else {
        alert(data.error || 'Không thể thay đổi trạng thái spa.')
      }
    } catch (err) {
      console.error('Toggle active error:', err)
      alert('Đã xảy ra lỗi khi kết nối máy chủ.')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* TOP TITLE ROW & QUICK ONBOARD CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A3B18] tracking-tight">
              Mạng Lưới Spa Đối Tác
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#236B38] font-bold text-xs border border-emerald-300">
              Pilot Cầu Giấy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Quản lý đối tác, thẩm định quy trình SOP và điều phối slot hiển thị lên web người dùng
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadSpas}
            title="Làm mới dữ liệu"
            className="p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-[#40813D] hover:bg-stone-50 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/spas/new"
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#356F32] to-[#40813D] hover:from-[#2E602C] hover:to-[#356F32] text-white font-bold text-sm shadow-md shadow-emerald-950/20 active:scale-98 transition-all"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>+ Onboard Spa Mới</span>
          </Link>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Tổng Điểm Spa
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#1A3B18]">{stats.total}</span>
            <span className="text-xs text-stone-500 font-medium">cơ sở</span>
          </div>
          <p className="text-[11px] text-stone-400">Chỉ tiêu Pha 1: 15–20 spa</p>
        </div>

        {/* Card 2: Active */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-200/90 bg-emerald-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đang Hoạt Động
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800">{stats.active}</span>
            <span className="text-xs text-emerald-600 font-bold">
              ({stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-emerald-700/80">Hiển thị cho khách book</p>
        </div>

        {/* Card 3: Inactive */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Tạm Dừng Hiển Thị
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-600">{stats.inactive}</span>
            <span className="text-xs text-stone-400">cơ sở</span>
          </div>
          <p className="text-[11px] text-stone-400">Nghỉ lễ hoặc bảo trì</p>
        </div>

        {/* Card 4: Violations */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/90 bg-amber-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Cảnh Báo Vi Phạm
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-900">
              {stats.withViolations}
            </span>
            <span className="text-xs text-amber-700 font-medium">spa</span>
          </div>
          <p className="text-[11px] text-amber-800/80">Có thẻ vàng hoặc thẻ đỏ</p>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên spa, địa chỉ hoặc số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white transition-all"
            />
          </div>

          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D]"
          >
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D]"
          >
            <option value="ALL">Tất cả phân hạng (Tier)</option>
            <option value="STANDARD">STANDARD (Tiêu chuẩn)</option>
            <option value="VERIFIED">VERIFIED (Đã kiểm định)</option>
            <option value="CERTIFIED">CERTIFIED (Chứng chỉ cao nhất)</option>
          </select>

          {/* Active Filter */}
          <select
            value={selectedActive}
            onChange={(e) => setSelectedActive(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D]"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="true">Đang mở (Active)</option>
            <option value="false">Tạm dừng (Inactive)</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Lọc Dữ Liệu
          </button>
        </form>
      </div>

      {/* SPA LIST DATA TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#40813D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Đang tải danh sách spa đối tác...</p>
          </div>
        ) : spas.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-600">Không tìm thấy spa nào phù hợp</p>
            <p className="text-xs text-stone-400">Thử thay đổi bộ lọc tìm kiếm hoặc tạo thêm spa mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Cơ Sở Spa & Ưu Đãi</th>
                  <th className="py-3.5 px-4">Khu Vực / Phường</th>
                  <th className="py-3.5 px-4">Phân Hạng (Tier)</th>
                  <th className="py-3.5 px-4">Đánh Giá & Lịch</th>
                  <th className="py-3.5 px-4 text-center">Thẻ Phạt</th>
                  <th className="py-3.5 px-4 text-center">Hiển Thị</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                {spas.map((spa) => {
                  const isToggling = togglingId === spa.id

                  return (
                    <tr
                      key={spa.id}
                      className={`hover:bg-stone-50/60 transition-colors ${
                        !spa.isActive ? 'bg-stone-50/40 opacity-70' : ''
                      }`}
                    >
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-start gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                            <Image
                              src={spa.imageUrl || '/spas/spa_thumb_1.jpg'}
                              alt={spa.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <h3 className="font-extrabold text-stone-900 tracking-tight leading-snug">
                              {spa.name}
                            </h3>
                            <p className="text-[11px] text-stone-400 font-mono">
                              slug: /{spa.slug}
                            </p>
                            {spa.exclusiveOffer && (
                              <div className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-medium">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                <span className="line-clamp-1">{spa.exclusiveOffer}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Ward & Address */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-800 text-xs px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200">
                            {spa.ward}
                          </span>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-1 max-w-[200px]">
                            {spa.address}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            GPS: {spa.latitude.toFixed(4)}, {spa.longitude.toFixed(4)}
                          </p>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-4">
                        {spa.tier === 'CERTIFIED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300">
                            <ShieldCheck className="w-3 h-3" />
                            CERTIFIED
                          </span>
                        ) : spa.tier === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200">
                            VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px] border border-stone-200">
                            STANDARD
                          </span>
                        )}
                      </td>

                      {/* Rating & Performance */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-amber-600 font-extrabold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{spa.rating.toFixed(1)}</span>
                            <span className="text-stone-400 font-normal">
                              ({spa.reviewCount} đánh giá)
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            Hotline: <strong className="text-stone-700">{spa.phone}</strong>
                          </p>
                        </div>
                      </td>

                      {/* Penalty Cards */}
                      <td className="py-3.5 px-4 text-center">
                        {spa.yellowCards === 0 && spa.redCards === 0 ? (
                          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Chuẩn SOP
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            {spa.yellowCards > 0 && (
                              <span
                                title={`${spa.yellowCards} Thẻ Vàng (Nhắc nhở SOP/giá)`}
                                className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 font-black text-[10px]"
                              >
                                {spa.yellowCards} Vàng
                              </span>
                            )}
                            {spa.redCards > 0 && (
                              <span
                                title={`${spa.redCards} Thẻ Đỏ (Đình chỉ)`}
                                className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px]"
                              >
                                {spa.redCards} Đỏ
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Instant Toggle Active */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(spa.id, spa.isActive, spa.name)}
                          disabled={isToggling}
                          title={spa.isActive ? 'Bấm để tắt hiển thị trên web' : 'Bấm để bật hiển thị lại'}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            spa.isActive ? 'bg-[#40813D]' : 'bg-stone-300'
                          } ${isToggling ? 'opacity-50' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              spa.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {spa.isActive ? 'Đang mở' : 'Tạm tắt'}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/spas/${spa.id}/edit`}
                            title="Chỉnh sửa thông tin"
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <a
                            href={`${PORTAL_BASE_URL}/spa/${spa.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Xem trang web khách hàng"
                            className="p-2 rounded-xl bg-stone-100 hover:bg-[#40813D] hover:text-white text-stone-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
