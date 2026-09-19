'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Trash2,
  RotateCcw,
  CheckSquare,
} from 'lucide-react'
import { PORTAL_BASE_URL } from '@/lib/config'

interface SpaItem {
  id: string
  name: string
  slug: string
  address: string
  district: string
  ward: string
  city?: string
  cityName?: string
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
  isVirtual?: boolean
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
  virtual?: number
  real?: number
}

export default function AdminSpasPage() {
  const [spas, setSpas] = useState<SpaItem[]>([])
  const [stats, setStats] = useState<StatsData>({ total: 0, active: 0, inactive: 0, withViolations: 0 })
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Filters & Search
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('ALL')
  const [selectedWard, setSelectedWard] = useState('ALL')
  const [selectedTier, setSelectedTier] = useState('ALL')
  const [selectedActive, setSelectedActive] = useState('ALL')
  const [selectedVirtual, setSelectedVirtual] = useState('ALL')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Bulk Selection States
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  // Dynamic Wards computed from spas list
  const dynamicWards = useMemo(() => {
    const list = Array.from(new Set(spas.map((s) => s.ward).filter(Boolean))).sort()
    return [{ id: 'ALL', name: 'Tất cả phường/xã' }, ...list.map((w) => ({ id: w, name: w }))]
  }, [spas])

  const loadSpas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCity !== 'ALL') params.set('city', selectedCity)
      if (selectedWard !== 'ALL') params.set('ward', selectedWard)
      if (selectedTier !== 'ALL') params.set('tier', selectedTier)
      if (selectedActive === 'true') params.set('active', 'true')
      if (selectedActive === 'false') params.set('active', 'false')
      if (selectedVirtual === 'REAL') params.set('isVirtual', 'false')
      if (selectedVirtual === 'VIRTUAL') params.set('isVirtual', 'true')
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/spas?${params.toString()}`)
      const data = await res.json()

      if (res.ok && data.spas) {
        setSpas(data.spas)
        if (data.stats) setStats(data.stats)
        // Lọc lại selectedIds chỉ giữ lại các id còn tồn tại
        setSelectedIds((prev) => prev.filter((id) => data.spas.some((s: SpaItem) => s.id === id)))
      }
    } catch (err) {
      console.error('Error loading spas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSpas()
  }, [selectedCity, selectedWard, selectedTier, selectedActive, selectedVirtual])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadSpas()
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedCity('ALL')
    setSelectedWard('ALL')
    setSelectedTier('ALL')
    setSelectedActive('ALL')
    setSelectedVirtual('ALL')
  }

  // Bulk selection toggles
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === spas.length && spas.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(spas.map((s) => s.id))
    }
  }

  const handleSelectAllVirtual = () => {
    const virtualIds = spas.filter((s) => s.isVirtual).map((s) => s.id)
    setSelectedIds(virtualIds)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    const count = selectedIds.length
    const confirmed = window.confirm(
      `CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn XOÁ VĨNH VIỄN ${count} cơ sở spa đã chọn?\n\nTất cả dữ liệu liên quan (lịch slot, đánh giá, đơn đặt) của các spa này cũng sẽ bị xoá khỏi cơ sở dữ liệu và không thể khôi phục.`
    )
    if (!confirmed) return

    try {
      setIsBulkDeleting(true)
      const res = await fetch('/api/spas/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSelectedIds([])
        await loadSpas()
        alert(`Đã xoá vĩnh viễn thành công ${count} cơ sở spa!`)
      } else {
        alert(data.error || 'Không thể xoá danh sách spa đã chọn.')
      }
    } catch (err) {
      console.error('Bulk delete error:', err)
      alert('Đã xảy ra lỗi khi kết nối máy chủ để xoá hàng loạt.')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleDeleteSpa = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `CẢNH BÁO: Bạn có chắc chắn muốn XOÁ VĨNH VIỄN spa "${name}"?\n\nTất cả dữ liệu liên quan (lịch slot, đánh giá, đơn đặt) của spa này cũng sẽ bị xoá khỏi cơ sở dữ liệu.`
    )
    if (!confirmed) return

    try {
      setDeletingId(id)
      const res = await fetch(`/api/spas/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSpas((prev) => prev.filter((s) => s.id !== id))
        setSelectedIds((prev) => prev.filter((item) => item !== id))
        loadSpas()
      } else {
        alert(data.error || 'Không thể xoá spa.')
      }
    } catch (err) {
      console.error('Delete spa error:', err)
      alert('Đã xảy ra lỗi khi kết nối máy chủ để xoá.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean, spaName: string) => {
    try {
      setTogglingId(id)
      const res = await fetch(`/api/spas/${id}/toggle-active`, {
        method: 'PATCH',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSpas((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: data.isActive } : s))
        )
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

  const isAllSelected = spas.length > 0 && selectedIds.length === spas.length
  const hasActiveFilters = Boolean(
    search ||
    selectedCity !== 'ALL' ||
    selectedWard !== 'ALL' ||
    selectedTier !== 'ALL' ||
    selectedActive !== 'ALL' ||
    selectedVirtual !== 'ALL'
  )

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
              Pilot Toàn Hệ Thống
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Tổng Cơ Sở
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#1A3B18]">{stats.total}</span>
            <span className="text-xs text-stone-500 font-medium">spa</span>
          </div>
          <p className="text-[11px] text-stone-400">Toàn bộ trên hệ thống</p>
        </div>

        {/* Card 2: Real Spas */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-300/90 bg-emerald-50/40 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Điểm Thật Đối Tác
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800">{stats.real ?? 0}</span>
            <span className="text-xs text-emerald-600 font-bold">
              ({stats.total > 0 ? Math.round(((stats.real ?? 0) / stats.total) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-emerald-700/80">Cơ sở thật nhận khách</p>
        </div>

        {/* Card 3: Virtual Spas */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-200/90 bg-purple-50/40 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Điểm Ảo Demo
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-800">{stats.virtual ?? 0}</span>
            <span className="text-xs text-purple-600 font-bold">
              ({stats.total > 0 ? Math.round(((stats.virtual ?? 0) / stats.total) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-purple-700/80">Dữ liệu mẫu demo</p>
        </div>

        {/* Card 4: Active */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đang Hoạt Động
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-800">{stats.active}</span>
            <span className="text-xs text-stone-500 font-medium">mở cửa</span>
          </div>
          <p className="text-[11px] text-stone-400">Hiển thị cho khách book</p>
        </div>

        {/* Card 5: Violations */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/90 bg-amber-50/30 shadow-xs space-y-1 col-span-2 md:col-span-1">
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
          <p className="text-[11px] text-amber-800/80">Có thẻ phạt SOP</p>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR (2-TIER REDESIGNED LAYOUT) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
        {/* ROW 1: SEARCH INPUT & SEARCH/RESET BUTTONS */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên spa, địa chỉ, số điện thoại hoặc slug..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#40813D] focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1.5 py-0.5 rounded-full hover:bg-stone-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tìm kiếm</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                title="Đặt lại toàn bộ bộ lọc"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}
          </div>
        </form>

        {/* ROW 2: 5-COLUMN RESPONSIVE FILTERS GRID */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Filter 1: Real vs Virtual */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Phân loại cơ sở
            </label>
            <select
              value={selectedVirtual}
              onChange={(e) => setSelectedVirtual(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] text-stone-700 cursor-pointer"
            >
              <option value="ALL">Mọi loại điểm (Thật & Ảo)</option>
              <option value="REAL">🟢 Chỉ điểm thật đối tác</option>
              <option value="VIRTUAL">🟣 Chỉ điểm ảo demo</option>
            </select>
          </div>

          {/* Filter 2: City */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Tỉnh / Thành phố
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setSelectedWard('ALL')
              }}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] text-stone-700 cursor-pointer"
            >
              <option value="ALL">Toàn quốc (Mọi tỉnh/TP)</option>
              <option value="dn">Đà Nẵng / Miền Trung</option>
              <option value="hn">Hà Nội & Miền Bắc</option>
              <option value="hcm">TP.HCM & Miền Nam</option>
            </select>
          </div>

          {/* Filter 3: Ward */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Khu vực / Phường xã
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] text-stone-700 cursor-pointer"
            >
              {dynamicWards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Tier */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Phân hạng chất lượng
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] text-stone-700 cursor-pointer"
            >
              <option value="ALL">Tất cả phân hạng (Tier)</option>
              <option value="STANDARD">STANDARD (Tiêu chuẩn)</option>
              <option value="VERIFIED">VERIFIED (Đã kiểm định)</option>
              <option value="CERTIFIED">CERTIFIED (Chứng chỉ cao)</option>
            </select>
          </div>

          {/* Filter 5: Active */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Trạng thái mở cửa
            </label>
            <select
              value={selectedActive}
              onChange={(e) => setSelectedActive(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#40813D] text-stone-700 cursor-pointer"
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="true">Đang mở (Active)</option>
              <option value="false">Tạm dừng (Inactive)</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUICK SELECTION BAR */}
      {spas.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-stone-500 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-[#40813D]" />
              Chọn nhanh:
            </span>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                isAllSelected
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {isAllSelected ? 'Bỏ chọn tất cả' : `Chọn tất cả (${spas.length})`}
            </button>
            {stats.virtual && stats.virtual > 0 && (
              <button
                type="button"
                onClick={handleSelectAllVirtual}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold transition-colors cursor-pointer"
              >
                🟣 Chọn {spas.filter((s) => s.isVirtual).length} điểm ảo demo
              </button>
            )}
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-stone-400 hover:text-stone-700 font-medium underline cursor-pointer"
              >
                Bỏ chọn ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="text-xs text-stone-400">
            Hiển thị <strong className="text-stone-700">{spas.length}</strong> cơ sở
            {selectedIds.length > 0 && (
              <span className="ml-2 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Đã chọn {selectedIds.length}
              </span>
            )}
          </div>
        </div>
      )}

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
                  {/* Select All Checkbox Column */}
                  <th className="py-3.5 px-3 sm:px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      aria-label="Chọn tất cả spa trên trang"
                      title="Chọn tất cả spa trên trang"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-stone-300 text-[#40813D] focus:ring-[#40813D] cursor-pointer"
                    />
                  </th>
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
                  const isSelected = selectedIds.includes(spa.id)

                  return (
                    <tr
                      key={spa.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/70 border-l-4 border-l-[#40813D]'
                          : !spa.isActive
                          ? 'bg-stone-50/40 opacity-70'
                          : ''
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="py-3.5 px-3 sm:px-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Chọn spa ${spa.name}`}
                          checked={isSelected}
                          onChange={() => handleToggleSelect(spa.id)}
                          className="w-4 h-4 rounded border-stone-300 text-[#40813D] focus:ring-[#40813D] cursor-pointer"
                        />
                      </td>

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
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-extrabold text-stone-900 tracking-tight leading-snug">
                                {spa.name}
                              </h3>
                              {spa.isVirtual ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                                  Điểm ảo demo
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                  Điểm thật đối tác
                                </span>
                              )}
                            </div>
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

                          <button
                            type="button"
                            onClick={() => handleDeleteSpa(spa.id, spa.name)}
                            disabled={deletingId === spa.id}
                            title="Xoá vĩnh viễn cơ sở này"
                            className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className={`w-4 h-4 ${deletingId === spa.id ? 'animate-spin text-rose-600' : ''}`} />
                          </button>
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

      {/* FLOATING BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-6 z-30 bg-stone-900 text-white p-4 rounded-3xl shadow-2xl border border-stone-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 font-black text-sm border border-rose-500/30 shrink-0">
              {selectedIds.length}
            </span>
            <div>
              <p className="font-bold text-sm text-white">
                Đang chọn <span className="text-rose-400 font-black">{selectedIds.length}</span> cơ sở spa
              </p>
              <p className="text-[11px] text-stone-400">
                Thao tác xoá sẽ loại bỏ vĩnh viễn dữ liệu spa cùng lịch slot, đánh giá và đơn đặt liên quan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Hủy chọn
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 className={`w-4 h-4 ${isBulkDeleting ? 'animate-spin' : ''}`} />
              <span>{isBulkDeleting ? 'Đang xoá...' : `Xoá vĩnh viễn ${selectedIds.length} spa`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
