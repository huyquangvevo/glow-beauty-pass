'use client'

import React from 'react'
import {
  Check,
  Sparkles,
  HeartHandshake,
  Flame,
  Smile,
  Gift,
  Zap,
  CheckCheck,
  RotateCcw,
} from 'lucide-react'

export interface ServiceItem {
  id: string
  name: string
  short: string
  price: string
  priceNum: number
  badge?: string
  desc: string
  iconName: string
}

export const HOME_MENU_SERVICES: ServiceItem[] = [
  {
    id: 'goi-sach',
    name: 'Gội đầu sạch',
    short: 'Gội sạch',
    price: '39.000đ',
    priceNum: 39000,
    badge: 'Đồng giá 39K',
    desc: 'Quy trình 6 bước gội bồ kết cô đặc & xả dưỡng bưởi tự nhiên, sấy khô nhẹ nhàng.',
    iconName: 'Sparkles',
  },
  {
    id: 'goi-dau-cap',
    name: 'Gội đầu dầu cặp',
    short: 'Gội dầu cặp',
    price: '59.000đ',
    priceNum: 59000,
    desc: 'Dầu cặp chuyên sâu phục hồi, kiểm định chính hãng, ủ dưỡng mượt tóc.',
    iconName: 'Sparkles',
  },
  {
    id: 'duong-sinh',
    name: 'Gội dưỡng sinh',
    short: 'Dưỡng sinh',
    price: '149.000đ',
    priceNum: 149000,
    badge: 'Được chọn nhiều nhất',
    desc: 'Khai thông huyệt đạo, canh thảo mộc ấm, massage thư giãn vùng đầu cổ vai gáy.',
    iconName: 'Flame',
  },
  {
    id: 'massage-body',
    name: 'Massage body',
    short: 'Massage body',
    price: '199.000đ',
    priceNum: 199000,
    badge: '60 phút trị liệu',
    desc: 'Massage body toàn thân đá nóng, ấn huyệt chuyên sâu giải tỏa đau mỏi văn phòng.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'cham-soc-da',
    name: 'Chăm sóc da cơ bản',
    short: 'Chăm sóc da',
    price: '169.000đ',
    priceNum: 169000,
    desc: 'Tẩy trang, hút bã nhờn, massage nâng cơ và đắp mặt nạ tinh chất dưỡng ẩm.',
    iconName: 'Smile',
  },
  {
    id: 'combo-goi-da',
    name: 'Combo gội + chăm sóc da',
    short: 'Combo gội + da',
    price: '199.000đ',
    priceNum: 199000,
    badge: 'Gói tiết kiệm',
    desc: 'Trọn gói kép gội đầu dưỡng sinh kết hợp chăm sóc da mặt chuyên sâu 75 phút.',
    iconName: 'Gift',
  },
  {
    id: 'triet-long',
    name: 'Triệt lông',
    short: 'Triệt lông',
    price: '99.000đ',
    priceNum: 99000,
    badge: '1 buổi / 1 vùng',
    desc: 'Công nghệ ánh sáng lạnh Diode Laser không đau rát, se khít lỗ chân lông.',
    iconName: 'Zap',
  },
]

interface ServiceSelectorProps {
  selectedServiceIds: string[]
  onChange: (serviceIds: string[]) => void
}

export function ServiceSelector({
  selectedServiceIds,
  onChange,
}: ServiceSelectorProps) {
  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      onChange(selectedServiceIds.filter((item) => item !== id))
    } else {
      onChange([...selectedServiceIds, id])
    }
  }

  const selectAll = () => {
    onChange(HOME_MENU_SERVICES.map((s) => s.id))
  }

  const selectBasic = () => {
    onChange(['goi-sach', 'duong-sinh', 'massage-body'])
  }

  const clearAll = () => {
    onChange([])
  }

  const renderIcon = (iconName: string, isSelected: boolean) => {
    const className = `w-4 h-4 ${isSelected ? 'text-[#326B30]' : 'text-stone-400'}`
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />
      case 'HeartHandshake':
        return <HeartHandshake className={className} />
      case 'Smile':
        return <Smile className={className} />
      case 'Gift':
        return <Gift className={className} />
      case 'Zap':
        return <Zap className={className} />
      default:
        return <Sparkles className={className} />
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700">Chọn nhanh:</span>
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-stone-100 text-stone-700 hover:bg-[#E8F5E9] hover:text-[#236B38] transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tất cả ({HOME_MENU_SERVICES.length})</span>
          </button>
          <button
            type="button"
            onClick={selectBasic}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-stone-100 text-stone-700 hover:bg-[#E8F5E9] hover:text-[#236B38] transition-colors cursor-pointer"
          >
            <span>Gói phổ biến (3 món)</span>
          </button>
          {selectedServiceIds.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-xl text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Bỏ chọn</span>
            </button>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#236B38] border border-emerald-200">
          <Check className="w-3.5 h-3.5" />
          <span>Đã chọn: {selectedServiceIds.length}/{HOME_MENU_SERVICES.length} dịch vụ</span>
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {HOME_MENU_SERVICES.map((srv) => {
          const isSelected = selectedServiceIds.includes(srv.id)
          return (
            <div
              key={srv.id}
              onClick={() => toggleService(srv.id)}
              className={`relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                isSelected
                  ? 'bg-[#F2F8F1] border-[#40813D] shadow-xs ring-1 ring-[#40813D]'
                  : 'bg-white border-stone-200/90 hover:border-stone-300 hover:bg-stone-50/70'
              }`}
            >
              <div>
                {/* Header: Icon, Name & Checkbox */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white shadow-2xs' : 'bg-stone-100'
                      }`}
                    >
                      {renderIcon(srv.iconName, isSelected)}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          isSelected ? 'text-[#1A3B18]' : 'text-stone-800'
                        }`}
                      >
                        {srv.name}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {srv.id}
                      </span>
                    </div>
                  </div>

                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-[#40813D] border-[#40813D] text-white shadow-xs'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              {/* Bottom: Price and Badge */}
              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-stone-100/90">
                <span
                  className={`text-xs font-black tracking-tight ${
                    isSelected ? 'text-[#236B38]' : 'text-stone-700'
                  }`}
                >
                  {srv.price}
                </span>

                {srv.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white text-[#236B38] border border-emerald-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {srv.badge}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-[11.5px] text-stone-500 leading-relaxed">
        💡 <strong className="text-stone-700">Cơ chế dẫn link từ Menu Trang chủ:</strong> Khi khách hàng bấm vào một dịch vụ trên Menu Trang chủ (ví dụ <em>Gội sạch 39K</em>, <em>Dưỡng sinh 149K</em> hay <em>Massage body</em>), hệ thống sẽ lọc và dẫn khách trực tiếp tới các cơ sở được tích chọn dịch vụ này.
      </div>
    </div>
  )
}
