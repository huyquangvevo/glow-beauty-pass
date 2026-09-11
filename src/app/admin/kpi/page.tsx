'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Calendar,
  Users,
  Building2,
  Phone,
  Star,
  ShieldAlert,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

interface MetricItem {
  current: number
  target: number
  unit: string
  isPassing: boolean
}

interface MetricsData {
  metrics: {
    bookingsPerSpa: MetricItem
    conversionRate: MetricItem
    repeatRate: MetricItem
    correctPriceRate: MetricItem
    avgRating: MetricItem
  }
  summary: {
    totalSpas: number
    totalBookings: number
    totalConversations: number
    totalCustomers: number
  }
  recentBookings: any[]
}

export default function AdminKpiPage() {
  const [data, setData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMetrics = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/metrics')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-xs text-stone-500 flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-[#236B38] border-t-transparent rounded-full animate-spin" />
        <span>Đang tải số liệu KPI Go/No-Go Pilot 90 ngày...</span>
      </div>
    )
  }

  const { metrics, summary, recentBookings } = data

  const kpiCards = [
    {
      title: '1. Booking / Spa / Tháng',
      desc: 'Đo mật độ nhu cầu thực tế chảy về từng điểm spa',
      current: metrics.bookingsPerSpa.current,
      target: metrics.bookingsPerSpa.target,
      unit: metrics.bookingsPerSpa.unit,
      isPassing: metrics.bookingsPerSpa.isPassing,
      benchmark: 'Mục tiêu: ≥ 40 lượt',
    },
    {
      title: '2. Tỷ Lệ Hội Thoại → Booking',
      desc: 'Hiệu quả tư vấn và kịch bản chốt lịch Zalo Hub',
      current: `${metrics.conversionRate.current}%`,
      target: `${metrics.conversionRate.target}%`,
      unit: '',
      isPassing: metrics.conversionRate.isPassing,
      benchmark: 'Mục tiêu: ≥ 55%',
    },
    {
      title: '3. Khách Quay Lại (45 Ngày)',
      desc: 'Đo lường độ hài lòng và giá trị giữ chân khách',
      current: `${metrics.repeatRate.current}%`,
      target: `${metrics.repeatRate.target}%`,
      unit: '',
      isPassing: metrics.repeatRate.isPassing,
      benchmark: 'Mục tiêu: ≥ 30%',
    },
    {
      title: '4. Tỷ Lệ Spa Giữ Đúng Giá',
      desc: 'Lời hứa thương hiệu phân biệt tuyệt đối với Google Maps',
      current: `${metrics.correctPriceRate.current}%`,
      target: `${metrics.correctPriceRate.target}%`,
      unit: '',
      isPassing: metrics.correctPriceRate.isPassing,
      benchmark: 'Mục tiêu: ≥ 90% (Trượt = Dừng dự án)',
      highlight: true,
    },
    {
      title: '5. Điểm Đánh Giá Rating TB',
      desc: 'Kiểm soát chất lượng tay nghề và sự tuân thủ SOP',
      current: metrics.avgRating.current,
      target: metrics.avgRating.target,
      unit: 'sao',
      isPassing: metrics.avgRating.isPassing,
      benchmark: 'Mục tiêu: ≥ 4.6 sao',
    },
  ]

  return (
    <div className="space-y-6 px-3.5 sm:px-6 py-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
            <span>Cổng Đánh Giá Go / No-Go (Pilot 90 Ngày)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            5 Chỉ Số Sống Còn Của Mạng Lưới Spa
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Kiểm chứng mô hình ghế trống spa tại Quận Cầu Giấy trước khi quyết định mở rộng.
          </p>
        </div>

        <button
          onClick={loadMetrics}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-[#236B38] hover:bg-[#1D5A2E] text-white rounded-full text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm Mới Số Liệu</span>
        </button>
      </div>

      {/* TỔNG QUAN VẬN HÀNH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#236B38]" /> Tổng Spa Đối Tác
          </p>
          <p className="text-2xl font-black text-stone-900">{summary.totalSpas} spa</p>
          <p className="text-[10px] text-stone-400">100% tại Cầu Giấy</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Tổng Lịch Đã Chốt
          </p>
          <p className="text-2xl font-black text-stone-900">{summary.totalBookings}</p>
          <p className="text-[10px] text-stone-400">Qua đầu mối Zalo Hub</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> Hội Thoại Khách
          </p>
          <p className="text-2xl font-black text-stone-900">{summary.totalConversations}</p>
          <p className="text-[10px] text-stone-400">Lưu trữ database 100%</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-600" /> Khách Định Danh
          </p>
          <p className="text-2xl font-black text-stone-900">{summary.totalCustomers}</p>
          <p className="text-[10px] text-stone-400">Thu thập SĐT lần đầu</p>
        </div>
      </div>

      {/* 5 KPI CARDS */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#236B38]" />
          <span>5 Tiêu Chí Đánh Giá Quyết Định Tiếp Tục Hay Dừng</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {kpiCards.map((kpi, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 bg-white shadow-sm ${
                kpi.highlight ? 'ring-2 ring-[#236B38] border-[#236B38]' : 'border-stone-200/90'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
                    {kpi.title}
                  </span>
                  {kpi.isPassing ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đạt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3 text-amber-600" /> Cần cải thiện
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-stone-900">
                    {kpi.current} {kpi.unit}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{kpi.desc}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700 font-semibold">
                <span>{kpi.benchmark}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DANH SÁCH BOOKING GẦN ĐÂY */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#236B38]" />
          <span>Danh Sách Lịch Hẹn Đã Chốt Qua Zalo Hub Gần Nhất</span>
        </h3>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-stone-400 py-4 text-center">Chưa có lịch booking nào được chốt.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase border-y border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Mã Booking</th>
                  <th className="py-2.5 px-3">Khách Hàng</th>
                  <th className="py-2.5 px-3">Spa Đối Tác</th>
                  <th className="py-2.5 px-3">Dịch Vụ</th>
                  <th className="py-2.5 px-3">Giờ Hẹn</th>
                  <th className="py-2.5 px-3">Giá Niêm Yết</th>
                  <th className="py-2.5 px-3">Trạng Thái Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">{b.code}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-stone-800">{b.customerName || 'Khách Zalo'}</p>
                      <p className="text-stone-400 text-[11px]">{b.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3 text-stone-700">{b.spa?.name}</td>
                    <td className="py-3 px-3 text-stone-700">{b.sku?.name}</td>
                    <td className="py-3 px-3 text-stone-700">
                      {b.bookingTime} ({b.bookingDate})
                    </td>
                    <td className="py-3 px-3 font-bold text-stone-900">
                      {b.pricePaid.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-3">
                      {b.priceViolated ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                          <ShieldAlert className="w-3 h-3" /> Vi phạm giá
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Đúng giá chuẩn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
