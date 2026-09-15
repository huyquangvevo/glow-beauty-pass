'use client';

import React, { useState } from 'react';
import { MVP_SERVICES, MVPService, MVPSpa, formatPrice, formatShortPrice } from '@/lib/mvp-data';
import Image from 'next/image';
import { X, ArrowRight, Check } from 'lucide-react';

interface BookingBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  spa?: MVPSpa | null;
  services?: MVPService[];
  initialServiceId?: string;
  zaloPhone?: string;
  spaName?: string;
  spaAddress?: string;
}

const DAYS = [
  { id: 'd0', label: 'Hôm nay', date: '16/09' },
  { id: 'd1', label: 'Mai', date: '17/09' },
  { id: 'd2', label: 'T5', date: '18/09' },
];

const TIMES = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30', '19:00'];
const FULL_TIMES = ['17:30'];

export default function BookingBottomSheet({
  isOpen,
  onClose,
  spa,
  services,
  initialServiceId,
  zaloPhone = '0359178342',
  spaName,
  spaAddress,
}: BookingBottomSheetProps) {
  const serviceList = services && services.length > 0 ? services : MVP_SERVICES;
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || (serviceList[2] ? serviceList[2].id : serviceList[0]?.id || '')
  );
  const [selectedDayId, setSelectedDayId] = useState<string>('d0');
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  const [isDone, setIsDone] = useState<boolean>(false);

  // Keep selectedService in sync if initialServiceId changes
  React.useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  if (!isOpen) return null;

  const activeService =
    serviceList.find((s) => s.id === selectedServiceId) || serviceList[0];
  const activeDay = DAYS.find((d) => d.id === selectedDayId) || DAYS[0];
  const slotLabel = `${activeDay.label} ${activeDay.date}, ${selectedTime}`;

  const displayName = spa ? `${spa.name} - ${spa.ward}` : spaName ? `${spaName} ${spaAddress ? `- ${spaAddress}` : ''}` : 'chi nhánh';
  const message = `Xin chào GlowBeautyPass, mình muốn đặt ${
    activeService?.name
  } (${formatPrice(activeService?.price || 0)}) tại ${
    displayName
  }, ${slotLabel}. Nhờ tổng đài kiểm tra chỗ trống giúp mình.`;

  const handleOpenZalo = () => {
    const cleanPhone = zaloPhone.replace(/\D/g, '');
    const zaloUrl = `https://zalo.me/${cleanPhone}`;
    window.open(zaloUrl, '_blank', 'noopener,noreferrer');
    setIsDone(true);
  };

  const handleClose = () => {
    setIsDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-[#093E06]/40 backdrop-blur-[2px] transition-opacity"
        onClick={handleClose}
      />

      {/* Bottom Sheet Card */}
      <div className="relative w-full max-w-[440px] mx-auto bg-white rounded-t-[28px] px-5 pt-3 pb-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-4" />

        {!isDone ? (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#093E06] leading-snug tracking-tight">
                  Đặt lịch ưu tiên qua Zalo
                </h3>
                <p className="text-[12.5px] text-[#6B7869] mt-0.5">
                  {spa ? `${spa.name} · ${spa.ward}` : 'Hệ thống Glow Beauty'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Step 1: Dịch vụ */}
            <div className="mt-5">
              <label className="block text-[12px] font-bold text-[#093E06] mb-2 uppercase tracking-wide">
                Dịch vụ
              </label>
              <div className="flex flex-wrap gap-2">
                {serviceList.map((s) => {
                  const isSelected = s.id === selectedServiceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium transition-all ${
                        isSelected
                          ? 'bg-[#40813F] text-white shadow-sm ring-1 ring-[#40813F]'
                          : 'bg-white text-[#3E4A3C] border border-[#DDE4D9] hover:border-[#40813F]/50'
                      }`}
                    >
                      {s.short} · {formatShortPrice(s.price)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Ngày */}
            <div className="mt-5">
              <label className="block text-[12px] font-bold text-[#093E06] mb-2 uppercase tracking-wide">
                Ngày
              </label>
              <div className="flex gap-2">
                {DAYS.map((d) => {
                  const isSelected = d.id === selectedDayId;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDayId(d.id)}
                      className={`flex-1 py-2.5 px-2 rounded-2xl text-center border transition-all ${
                        isSelected
                          ? 'bg-[#40813F] border-[#40813F] text-white shadow-sm'
                          : 'bg-white border-[#DDE4D9] text-[#093E06] hover:border-[#40813F]/50'
                      }`}
                    >
                      <div
                        className={`text-[12.5px] font-bold ${
                          isSelected ? 'text-white' : 'text-[#093E06]'
                        }`}
                      >
                        {d.label}
                      </div>
                      <div
                        className={`text-[10.5px] mt-0.5 ${
                          isSelected ? 'text-[#E8FDE7]' : 'text-[#6B7869]'
                        }`}
                      >
                        {d.date}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Khung giờ */}
            <div className="mt-5">
              <label className="block text-[12px] font-bold text-[#093E06] mb-2 uppercase tracking-wide">
                Khung giờ
              </label>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => {
                  const isFull = FULL_TIMES.includes(t);
                  const isSelected = t === selectedTime && !isFull;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isFull}
                      onClick={() => !isFull && setSelectedTime(t)}
                      className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium transition-all ${
                        isFull
                          ? 'bg-[#F1F3F0] text-[#9BA69A] border border-[#F1F3F0] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#40813F] text-white shadow-sm ring-1 ring-[#40813F]'
                          : 'bg-white text-[#3E4A3C] border border-[#DDE4D9] hover:border-[#40813F]/50'
                      }`}
                    >
                      {isFull ? `${t} · hết chỗ` : t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message preview box */}
            <div className="bg-[#F5F7F4] rounded-[18px] p-3.5 mt-5 border border-[#E8ECE6]">
              <div className="text-[10.5px] font-bold tracking-wider text-[#6B7869] mb-2 uppercase">
                Tin nhắn sẽ gửi tới tổng đài
              </div>
              <div className="bg-[#E8FDE7] border border-[#D4F4D3] rounded-[14px] rounded-bl-sm p-3 text-[12.5px] leading-relaxed text-[#1E2B1C]">
                {message}
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handleOpenZalo}
              className="w-full mt-4 bg-[#236B38] hover:bg-[#1D5A2E] active:scale-[0.99] text-white rounded-full h-14 flex items-center justify-center gap-2 font-bold text-[15.5px] shadow-md transition-all cursor-pointer"
            >
              <span>Mở Zalo GlowBeautyPass</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
            </button>
            <p className="text-center text-[11px] text-[#6B7869] mt-2.5">
              Chưa trừ tiền. Tổng đài hỏi chỗ trống rồi xác nhận lại với bạn.
            </p>
          </div>
        ) : (
          /* Confirmation State */
          <div className="pt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8FDE7] text-[#236B38] flex items-center justify-center mx-auto mb-4 ring-4 ring-[#E8FDE7]/60">
              <Check className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <h3 className="text-[19px] font-bold text-[#093E06]">
              Đã chuyển sang Zalo
            </h3>
            <p className="text-[13px] leading-relaxed text-[#4A5848] mt-2 max-w-[300px] mx-auto">
              Tổng đài GlowBeautyPass đã nhận yêu cầu và sẽ xác nhận lịch với bạn trong 20 phút.
            </p>

            {/* Recap Card */}
            <div className="bg-[#F5F7F4] rounded-[18px] p-4 mt-5 text-left flex flex-col gap-2.5 border border-[#E8ECE6]">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-[#6B7869]">Chi nhánh</span>
                <span className="font-bold text-[#093E06]">
                  {spa?.name || 'Chi nhánh Glow Beauty'}
                </span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-[#6B7869]">Dịch vụ</span>
                <span className="font-bold text-[#093E06]">
                  {activeService?.name}
                </span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-[#6B7869]">Thời gian</span>
                <span className="font-bold text-[#093E06]">{slotLabel}</span>
              </div>
              <div className="flex justify-between text-[12.5px] border-t border-stone-200 pt-2">
                <span className="text-[#6B7869]">Giá niêm yết</span>
                <span className="font-bold text-[#093E06]">
                  {formatPrice(activeService?.price || 0)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full mt-5 bg-[#E8FDE7] hover:bg-[#d8f5d7] text-[#093E06] font-bold rounded-full h-12 flex items-center justify-center text-[15px] transition-colors cursor-pointer"
            >
              Xong
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
