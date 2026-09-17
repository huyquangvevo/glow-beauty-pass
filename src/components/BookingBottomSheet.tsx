'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { MVP_SERVICES, MVPService, MVPSpa, formatPrice, formatShortPrice } from '@/lib/mvp-data';
import { getMvpTranslation, getLocalizedBookingMessage } from '@/lib/mvp-i18n';
import Image from 'next/image';
import { X, ArrowRight, Check, Copy } from 'lucide-react';

interface BookingBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
  spa?: MVPSpa | null;
  services?: MVPService[];
  initialServiceId?: string;
  zaloPhone?: string;
  spaName?: string;
  spaAddress?: string;
  onServiceChange?: (serviceId: string) => void;
}

const TIMES = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30', '19:00'];
const FULL_TIMES = ['17:30'];

export default function BookingBottomSheet({
  isOpen,
  onClose,
  locale,
  spa,
  services,
  initialServiceId,
  zaloPhone = '0359178342',
  spaName,
  spaAddress,
  onServiceChange,
}: BookingBottomSheetProps) {
  const params = useParams();
  const currentLocale = (locale || (params?.locale as string) || 'vi') as 'vi' | 'en' | 'ko';
  const t = getMvpTranslation(currentLocale);

  const serviceList = React.useMemo(() => {
    if (services && services.length > 0) return services;
    if (spa && spa.serviceIds && spa.serviceIds.length > 0) {
      return MVP_SERVICES.filter((s) => spa.serviceIds.includes(s.id));
    }
    return MVP_SERVICES;
  }, [services, spa]);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (initialServiceId && serviceList.some((s) => s.id === initialServiceId)) {
      return initialServiceId;
    }
    return serviceList[0]?.id || 'duong-sinh';
  });
  const [selectedDayId, setSelectedDayId] = useState<string>('d0');
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Phone validation
  const phoneDigits = guestPhone.replace(/\D/g, '');
  const phoneOk = phoneDigits.length >= 9;

  // Localized days of appointment
  const days = [
    { id: 'd0', label: t.booking.today, date: '16/09' },
    { id: 'd1', label: t.booking.tomorrow, date: '17/09' },
    { id: 'd2', label: t.booking.thu, date: '18/09' },
  ];

  const prevIsOpenRef = React.useRef(false);

  // Sync selectedServiceId ONLY when sheet transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (initialServiceId && serviceList.some((s) => s.id === initialServiceId)) {
        setSelectedServiceId(initialServiceId);
      } else if (serviceList.length > 0) {
        setSelectedServiceId((prev) =>
          serviceList.some((s) => s.id === prev) ? prev : serviceList[0].id
        );
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialServiceId, serviceList]);

  if (!isOpen) return null;

  const activeService =
    serviceList.find((s) => s.id === selectedServiceId) || serviceList[0];
  const activeDay = days.find((d) => d.id === selectedDayId) || days[0];
  const slotLabel = `${activeDay.label} ${activeDay.date}, ${selectedTime}`;

  const getServiceName = (id: string) => {
    return t.services[id]?.name || activeService.name;
  };
  const getServiceShort = (id: string) => {
    return t.services[id]?.short || activeService.short;
  };

  const displayName = spa
    ? `${spa.name} - ${spa.ward}`
    : spaName
    ? `${spaName}`
    : t.booking.subtitle;

  const message = getLocalizedBookingMessage(
    currentLocale,
    getServiceName(activeService?.id || ''),
    formatPrice(activeService?.price || 0),
    displayName,
    slotLabel,
    guestPhone,
    guestName
  );

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return true;
      }
    } catch {
      // Fallback below
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return true;
    } catch {
      return false;
    }
  };

  const handleOpenZalo = async () => {
    if (!phoneOk) {
      setPhoneError(true);
      return;
    }
    await copyToClipboard(message);
    const cleanPhone = zaloPhone.replace(/\D/g, '');
    const zaloUrl = `https://zalo.me/${cleanPhone}`;
    window.open(zaloUrl, '_blank', 'noopener,noreferrer');
    setIsDone(true);
  };

  const handleCopyPreview = async () => {
    if (!phoneOk) {
      setPhoneError(true);
      return;
    }
    await copyToClipboard(message);
  };

  const handleClose = () => {
    setIsDone(false);
    setPhoneError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-[#093E06]/40 backdrop-blur-[2px] transition-opacity"
        onClick={handleClose}
      />

      {/* Bottom Sheet Card with Fixed Header & Bottom Bar */}
      <div
        id="booking-bottom-sheet-card"
        className="relative w-full max-w-[440px] mx-auto bg-white rounded-t-[28px] max-h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300 overflow-hidden"
      >
        {/* Pinned Top Bar: Drag handle & Header */}
        <div className="flex-none px-5 pt-3 pb-2.5 bg-white border-b border-stone-100 z-10">
          <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-3" />
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[17.5px] font-bold text-[#093E06] leading-snug tracking-tight">
                {t.booking.title}
              </h3>
              <p className="text-[12px] text-[#6B7869] mt-0.5 font-medium">
                {spa ? `${spa.name} · ${spa.ward}` : spaName || t.booking.subtitle}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {!isDone ? (
          <>
            {/* Scrollable Form Content */}
            <div
              id="booking-bottom-sheet-content"
              className="flex-1 overflow-y-auto px-5 py-3.5 overscroll-contain space-y-4"
            >
              {/* Step 1: Dịch vụ */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#093E06] mb-1.5 uppercase tracking-wide">
                  {t.booking.serviceLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {serviceList.map((s) => {
                    const isSelected = s.id === selectedServiceId;
                    const localizedShort = getServiceShort(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedServiceId(s.id);
                          onServiceChange?.(s.id);
                        }}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#40813F] text-white shadow-xs ring-1 ring-[#40813F]'
                            : 'bg-white text-[#3E4A3C] border border-[#DDE4D9] hover:border-[#40813F]/50 active:bg-stone-50'
                        }`}
                      >
                        {localizedShort} · {formatShortPrice(s.price)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Ngày */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#093E06] mb-1.5 uppercase tracking-wide">
                  {t.booking.dateLabel}
                </label>
                <div className="flex gap-2">
                  {days.map((d) => {
                    const isSelected = d.id === selectedDayId;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDayId(d.id)}
                        className={`flex-1 py-2 px-1.5 rounded-2xl text-center border transition-all ${
                          isSelected
                            ? 'bg-[#40813F] border-[#40813F] text-white shadow-xs'
                            : 'bg-white border-[#DDE4D9] text-[#093E06] hover:border-[#40813F]/50'
                        }`}
                      >
                        <div
                          className={`text-[12px] font-bold ${
                            isSelected ? 'text-white' : 'text-[#093E06]'
                          }`}
                        >
                          {d.label}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 ${
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
              <div>
                <label className="block text-[11.5px] font-bold text-[#093E06] mb-1.5 uppercase tracking-wide">
                  {t.booking.timeLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TIMES.map((time) => {
                    const isFull = FULL_TIMES.includes(time);
                    const isSelected = time === selectedTime && !isFull;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isFull}
                        onClick={() => !isFull && setSelectedTime(time)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                          isFull
                            ? 'bg-[#F1F3F0] text-[#9BA69A] border border-[#F1F3F0] cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#40813F] text-white shadow-xs ring-1 ring-[#40813F]'
                            : 'bg-white text-[#3E4A3C] border border-[#DDE4D9] hover:border-[#40813F]/50'
                        }`}
                      >
                        {isFull ? `${time} · ${t.booking.fullyBooked}` : time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Tên của bạn & Số điện thoại */}
              <div>
                <div className="flex gap-2.5">
                  <div className="flex-1 min-w-0">
                    <label className="block text-[12px] font-semibold text-[#093E06] mb-1.5">
                      {t.booking.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={t.booking.namePlaceholder}
                      className="w-full box-border h-[46px] rounded-[14px] border border-[#DDE4D9] bg-white px-3.5 text-[13.5px] text-[#1E2B1C] placeholder:text-[#9BA69A] outline-none focus:border-[#40813F] transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[12px] font-semibold text-[#093E06] mb-1.5">
                      {t.booking.phoneLabel} <span className="text-[#C0392B]">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={guestPhone}
                      onChange={(e) => {
                        setGuestPhone(e.target.value);
                        if (phoneError) setPhoneError(false);
                      }}
                      placeholder={t.booking.phonePlaceholder}
                      className={`w-full box-border h-[46px] rounded-[14px] border px-3.5 text-[13.5px] text-[#1E2B1C] placeholder:text-[#9BA69A] outline-none transition-colors ${
                        phoneError && !phoneOk
                          ? 'border-[#C0392B] bg-[#FFF8F8] focus:border-[#C0392B]'
                          : 'border-[#DDE4D9] bg-white focus:border-[#40813F]'
                      }`}
                    />
                  </div>
                </div>
                {phoneError && !phoneOk && (
                  <p className="text-[11.5px] text-[#C0392B] mt-1.5 font-medium">
                    {t.booking.phoneErrorNotice}
                  </p>
                )}
              </div>

              {/* Message preview box */}
              <div className="bg-[#F5F7F4] rounded-[18px] p-3.5 border border-[#E8ECE6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-[#6B7869] uppercase">
                    {t.booking.messagePreviewTitle}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPreview}
                    className={`inline-flex items-center gap-1 text-[11.5px] font-semibold rounded-full px-3 py-1 border transition-colors cursor-pointer ${
                      copied
                        ? 'bg-[#40813F] text-white border-[#40813F]'
                        : 'bg-white text-[#093E06] border-[#DDE4D9] hover:bg-stone-50'
                    }`}
                  >
                    <span>{copied ? t.booking.copiedBtn : t.booking.copyBtn}</span>
                  </button>
                </div>
                <div className="bg-[#E8FDE7] border border-[#D4F4D3] rounded-[14px] p-3 text-[12.5px] leading-relaxed text-[#1E2B1C] whitespace-pre-line font-medium">
                  {message}
                </div>
              </div>
            </div>

            {/* FIXED BOTTOM ACTION BAR (Always visible at the bottom) */}
            <div className="flex-none bg-white border-t border-[#E8EDE6] px-5 pt-3 pb-5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20">
              <button
                type="button"
                onClick={handleOpenZalo}
                className="w-full bg-[#236B38] hover:bg-[#1D5A2E] active:scale-[0.99] text-white rounded-full h-12.5 flex items-center justify-center gap-2 font-bold text-[15px] shadow-md transition-all cursor-pointer"
              >
                <Image
                  src="/brand/Logo-Zalo-App-Rec.webp"
                  alt="Zalo"
                  width={20}
                  height={20}
                  className="rounded-[5px] shrink-0 object-contain shadow-2xs"
                />
                <span>{t.booking.openZaloBtn}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <div className="mt-2 text-center space-y-1">
                {t.booking.pasteGuide && (
                  <p className="text-[11px] text-[#6B7869] leading-snug">
                    {t.booking.pasteGuide}
                  </p>
                )}
                <p className="text-[11px] text-[#6B7869]">
                  {t.booking.slaNotice}
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation State */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto px-5 py-5">
            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-[#E8FDE7] text-[#236B38] flex items-center justify-center mx-auto mb-3 ring-4 ring-[#E8FDE7]/60">
                <Check className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h3 className="text-[19px] font-bold text-[#093E06] tracking-tight">
                {t.booking.confirmedTitle}
              </h3>
              <div className="mt-1.5 text-center max-w-[320px] mx-auto space-y-0.5">
                <p className="text-[12.5px] font-medium text-[#1E2B1C] leading-snug">
                  {t.booking.confirmedAction}
                </p>
                <p className="text-[11.5px] text-[#556353] leading-snug">
                  {t.booking.pasteGuide}
                </p>
                <p className="text-[11px] text-[#6B7869]">
                  {t.booking.confirmedSla}
                </p>
              </div>

              {/* Recap Card */}
              <div className="bg-[#F5F7F4] rounded-[16px] p-3.5 mt-4 text-left flex flex-col gap-2 border border-[#E8ECE6]">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#6B7869]">{t.booking.branchLabel}</span>
                  <span className="font-bold text-[#093E06]">
                    {spa?.name || (spaName ? `${spaName}` : t.booking.subtitle)}
                  </span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#6B7869]">{t.booking.serviceSummaryLabel}</span>
                  <span className="font-bold text-[#093E06]">
                    {getServiceName(activeService?.id || '')}
                  </span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#6B7869]">{t.booking.timeSummaryLabel}</span>
                  <span className="font-bold text-[#093E06]">{slotLabel}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#6B7869]">{t.booking.contactLabel}</span>
                  <span className="font-bold text-[#093E06]">
                    {guestName.trim() ? `${guestName.trim()} · ` : ''}{guestPhone.trim() || '—'}
                  </span>
                </div>
                <div className="flex justify-between text-[12px] border-t border-stone-200 pt-1.5">
                  <span className="text-[#6B7869]">{t.booking.fixedPriceLabel}</span>
                  <span className="font-bold text-[#093E06]">
                    {formatPrice(activeService?.price || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-[#E8FDE7] hover:bg-[#d8f5d7] text-[#093E06] font-bold rounded-full h-12 flex items-center justify-center text-[14.5px] transition-colors cursor-pointer"
              >
                {t.booking.doneBtn}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => copyToClipboard(message)}
                  className="inline-flex items-center justify-center gap-1.5 text-[11.5px] font-medium text-[#40813D] hover:underline cursor-pointer py-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? t.booking.copiedAgainBtn : t.booking.copyAgainBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
