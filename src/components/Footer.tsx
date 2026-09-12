import Link from 'next/link'
import { BrandWordmark } from './BrandLogo'
import { ShieldCheck, Sparkles, MessageCircle, Phone, Heart } from 'lucide-react'

export function Footer() {
  const zaloHubLink = process.env.NEXT_PUBLIC_ZALO_HUB_LINK || 'https://zalo.me/0988888888'

  return (
    <footer className="bg-[#0B2A0F] text-white pt-12 pb-16 border-t border-emerald-950/80">
      <div className="max-w-md sm:max-w-xl md:max-w-4xl mx-auto px-5 sm:px-6 space-y-10">
        {/* BRAND IDENTITY & APP STORE ROW */}
        <div className="space-y-4">
          <Link href="/" className="inline-block group" aria-label="glow beauty pass">
            <BrandWordmark className="h-10 sm:h-11 text-white hover:opacity-90 transition-opacity drop-shadow-xs" />
          </Link>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md leading-relaxed font-normal">
            Mạng lưới spa gội đầu dưỡng sinh & trị liệu chuẩn hoá độc lập tại Quận Cầu Giấy. Đồng giá niêm yết, không phụ thu, bảo vệ quyền lợi khách hàng tuyệt đối.
          </p>

          {/* APP STORE DOWNLOAD BADGES (Glow Ecosystem) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 transition-all text-white active:scale-95 shadow-xs"
            >
              <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z"/>
              </svg>
              <div className="text-left leading-none">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold">Tải trên</span>
                <span className="text-xs font-bold tracking-tight">App Store</span>
              </div>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 transition-all text-white active:scale-95 shadow-xs"
            >
              <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.008 2.008 0 0 1-.22-.964V2.778c0-.361.08-.694.219-.964zm11.235 11.238l2.259 2.259-11.78 6.782 9.521-9.041zm0-2.104L5.323 1.907l11.78 6.782-2.259 2.259zm1.096 1.052l3.414 1.964c.96.552.96 1.452 0 2.004l-3.414 1.964-1.745-1.745 1.745-1.745z" />
              </svg>
              <div className="text-left leading-none">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold">Khám phá trên</span>
                <span className="text-xs font-bold tracking-tight">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* NAVIGATION LINKS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-emerald-900/60 text-xs sm:text-[13px]">
          {/* Col 1: Dịch vụ đồng giá */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-emerald-300">
              Gói Dịch Vụ Đồng Giá
            </h4>
            <ul className="space-y-2 text-emerald-100/70">
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  Gội Thư Giãn (49.000đ)
                </Link>
              </li>
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  Gội Dưỡng Sinh SOP (69.000đ)
                </Link>
              </li>
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  Trị Liệu Cổ Vai Gáy (149.000đ)
                </Link>
              </li>
              <li>
                <Link href="/#goi-dich-vu" className="hover:text-white transition-colors">
                  Bấm Huyệt Khai Thông Kinh Lạc
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Khu Vực Cầu Giấy */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-emerald-300">
              Khu Vực Phủ Sóng
            </h4>
            <ul className="space-y-2 text-emerald-100/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Spa Phường Dịch Vọng
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Spa Cụm Duy Tân (Dịch Vọng Hậu)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Spa Hoàng Đạo Thúy (Trung Hòa)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Spa Vũ Phạm Hàm (Yên Hòa)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Spa Tô Hiệu (Nghĩa Tân)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cam kết & Hỗ trợ */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-emerald-300">
              Cam Kết Thương Hiệu
            </h4>
            <ul className="space-y-2 text-emerald-100/70">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Đúng giá niêm yết</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Quy trình SOP kiểm định</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Không chèo kéo mua gói</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Xác nhận Zalo trong 5 phút</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={zaloHubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hotline Zalo: 0988 888 888</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & ECOSYSTEM NOTE */}
        <div className="pt-6 border-t border-emerald-950 text-[11px] text-emerald-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © 2026 Glow Vietnam. Nền tảng thành viên thuộc hệ sinh thái Glow (Glow Explore).
          </p>
          <div className="flex items-center gap-4 text-emerald-200/60">
            <span>Tiêu chuẩn SOP</span>
            <span>•</span>
            <span>Bảo mật dữ liệu</span>
            <span>•</span>
            <span>Cầu Giấy, Hà Nội</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
