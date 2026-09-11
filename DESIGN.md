# DESIGN.md — GlowBeautyPass Design System Specification
> Authoritative Design System & Visual Tokens for GlowBeautyPass (Mobile-First Web App).
> Aligned with getdesign.md & awesome-design-md specifications and Glow Brand Guidelines.

---

## 1. PRODUCT & VISUAL IDENTITY

- **Product Name**: GlowBeautyPass (Dự án thí điểm 90 ngày — Cụm Spa Cầu Giấy, Hà Nội)
- **Host App Ecosystem**: Tích hợp trên nền tảng **Glow Explore** (Ứng dụng phong cách sống & chăm sóc sức khỏe / sắc đẹp).
- **Core Value Proposition**: 
  - *1 Bảng giá niêm yết* (Minh bạch tuyệt đối, hoàn tiền nếu bị phụ thu sai cam kết).
  - *1 Quy trình chuẩn SOP* (Kiểm định tay nghề kỹ thuật viên, sản phẩm chính hãng).
  - *1 Tổng đài Zalo đặt lịch* (Phản hồi giờ hành chính < 5 phút, chốt lịch trong 20 phút).
- **Vibe & Design Personality**: 
  - *Serene Asian Wellness & Modern Mobile Experience*: Tươi mới, thư thái, mộc mạc cao cấp (Organic Modernism), tạo niềm tin tuyệt đối.
  - Mang lại cảm giác mượt mà, tiện lợi như đang thao tác trực tiếp trên Native App của Glow.
- **Signature Visual Device**:
  - **Glow Forest Header**: Thanh header xanh lá rừng (`#236B38`) bo tròn với logo `glow explore` và thanh tìm kiếm dạng viên thuốc (pill) màu trắng nổi bật.
  - **Glow Support Floating Action**: Nút tổng đài Zalo hình viên thuốc màu xanh ngọc bích với biểu tượng tai nghe / chat chuẩn app Glow.
  - **Bottom Mobile Navigation**: 4 tab điều hướng chuẩn mobile [Khám phá / Explore], [Lịch hẹn / Activity], [Ưu đãi / Offers], [Quản trị KPI / Account].

---

## 2. COLOR TOKEN SYSTEM

Bảng màu được trích xuất trực tiếp từ nhận diện thương hiệu Glow (`docs/brand/IMG_7436.JPG`, `IMG_7437.PNG`, và tài liệu Kick-off):

| Token Name | HEX | HSL | Vai Trò & Hướng Dẫn Sử Dụng |
| :--- | :--- | :--- | :--- |
| `--glow-primary` | `#236B38` | `137°, 51%, 28%` | **Xanh lá rừng thương hiệu Glow (Primary Brand)**: Header, nút chính CTA, active tab |
| `--glow-primary-hover` | `#1D5A2E` | `137°, 51%, 23%` | Trạng thái hover / pressed của nút chính |
| `--glow-primary-subtle` | `#E8F5E9` | `127°, 44%, 94%` | Nền icon, badge nhẹ, tag khoảng cách GPS |
| `--glow-primary-border` | `#A5D6A7` | `123°, 42%, 75%` | Đường viền tinh tế cho các thành phần mang sắc xanh |
| `--glow-secondary` | `#2C7A39` | `130°, 47%, 32%` | Sắc xanh phối cảnh trên gradient hoặc banner phụ trợ |
| `--glow-accent-gold` | `#D97706` | `38°, 92%, 44%` | **Vàng hổ phách cao cấp**: Điểm rating sao ⭐, huy hiệu VIP/Certified |
| `--glow-accent-light` | `#FEF3C7` | `48°, 96%, 89%` | Nền cho badge giảm giá, tag "Gói được yêu thích nhất" |
| `--glow-bg` | `#FAF8F5` | `36°, 33%, 97%` | **Warm Linen**: Nền toàn trang, tạo cảm giác thư thái, chống mỏi mắt |
| `--glow-surface` | `#FFFFFF` | `0°, 0%, 100%` | Mặt phẳng thẻ (Card surface), dialog, bottom bar |
| `--glow-surface-muted` | `#F4EFEB` | `33°, 27%, 94%` | Thẻ phân loại thứ cấp, nền input phụ |
| `--glow-text-title` | `#17231A` | `135°, 20%, 12%` | Tiêu đề chính, chữ có sắc thái rừng sâu sang trọng |
| `--glow-text-body` | `#3F4941` | `133°, 8%, 27%` | Nội dung mô tả, dễ đọc trên màn hình di động |
| `--glow-text-muted` | `#727D74` | `131°, 5%, 47%` | Nhãn phụ, giờ mở cửa, khoảng cách, thông tin phụ |
| `--glow-border` | `#E3E8E4` | `132°, 10%, 90%` | Đường viền chia mảng hairline siêu mảnh |
| `--glow-danger` | `#DC2626` | `0°, 72%, 51%` | Cảnh báo vi phạm SLA hoặc vi phạm giá |

---

## 3. TYPOGRAPHY & TYPE SCALE

- **Font Family**:
  - Headings & Brand: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (Bo tròn, hiện đại, thân thiện).
  - Body & Form Controls: `Inter`, `-apple-system`, `Roboto`, `sans-serif` (Độ tương phản và khả năng đọc tuyệt vời trên mobile).
  - Price & Metrics: `font-semibold` hoặc `font-black` với định dạng số Việt Nam (`149.000đ`).

| Tên Scale | Kích Thước | Line Height | Letter Spacing | Sử Dụng Cho |
| :--- | :--- | :--- | :--- | :--- |
| `text-2xs` | 10px / 0.625rem | 14px | +0.02em | Tag khoảng cách, nhãn nhỏ trên badge |
| `text-xs` | 12px / 0.75rem | 16px | 0 | Giờ mở cửa, ghi chú phụ, label điều hướng |
| `text-sm` | 14px / 0.875rem | 20px | -0.01em | Đoạn văn nội dung, mô tả dịch vụ |
| `text-base` | 16px / 1rem | 24px | -0.015em | Tên spa, tên SKU, nút bấm chạm |
| `text-lg` | 18px / 1.125rem | 26px | -0.02em | Tiêu đề khối (Section title) |
| `text-xl` | 20px / 1.25rem | 28px | -0.025em | Giá tiền nổi bật, tên điểm spa chi tiết |
| `text-2xl` | 24px / 1.5rem | 32px | -0.03em | Tiêu đề trang, banner chính |

---

## 4. SPACING, RADIUS & SURFACE MATERIALS

- **Mobile Viewport Optimization**: Khung hiển thị tối ưu hóa cho màn hình 375px - 430px (iPhone / Android) với `max-w-md mx-auto` trên desktop để giữ nguyên trải nghiệm app mượt mà, hoặc hiển thị responsive mở rộng trên desktop lớn.
- **Border Radius**:
  - `rounded-2xl` (16px) — Thẻ spa, thẻ dịch vụ, pop-up dialog.
  - `rounded-3xl` (24px) — Khung hero banner, cụm container chính.
  - `rounded-full` (9999px) — Nút bấm Zalo, thanh tìm kiếm search bar, badge phân loại.
- **Shadow System**:
  - *Card Ambient*: `0 2px 10px rgba(23, 35, 26, 0.04)`
  - *Card Elevated / Active*: `0 6px 20px -2px rgba(35, 107, 56, 0.12)`
  - *Bottom Bar Shadow*: `0 -4px 16px rgba(0, 0, 0, 0.06)`

---

## 5. CORE COMPONENT GUIDELINES

### 5.1. Glow Explore App Header (Mobile-First)
- Nền xanh lá rừng `--glow-primary` (`#236B38`).
- Thanh tìm kiếm màu trắng bo cong `rounded-full` kèm icon kính lúp: *"Tìm dịch vụ, spa Cầu Giấy..."*.
- Nhãn chọn khu vực: `📍 Cầu Giấy, Hà Nội` kèm nút đổi vị trí hoặc định vị GPS gần bạn.

### 5.2. Quick Category Grid
- Hàng 4 cột icon dịch vụ phong cách chuẩn app Glow (Massage & Spa, Gội Đầu Dưỡng Sinh, Chăm Sóc Da, Combo Thư Giãn) với viền mềm và hiệu ứng bấm nhạy (active scale 0.96).

### 5.3. Service Pass Cards (3 SKU Chuẩn Hóa)
- Gói 49k (Gội sạch thư giãn 45p), Gói 69k (Gội Premium phục hồi 55p), Gói 149k (Gội dưỡng sinh Trung Hoa 65p).
- Gói 149k có dải băng "Được yêu thích nhất" và viền xanh `--glow-primary`.
- 1-Click CTA: Mở Zalo kèm tin nhắn đặt chỗ soạn sẵn chính xác gói dịch vụ.

### 5.4. Spa List ("Open Near You")
- Khoảng cách GPS tính tự động theo thời gian thực (ví dụ: `400m`, `850m`).
- Huy hiệu chuẩn hóa: `CERTIFIED` (Spa đạt chuẩn cao nhất) và `VERIFIED` (Đã kiểm tra cơ sở).
- Tag ưu đãi độc quyền: Nền kem hổ phách hoặc xanh dịu với biểu tượng hộp quà.
- Hai nút thao tác nhanh: **Nhắn Zalo Đặt Chỗ** (xanh Glow) và **Chi Tiết** (nền kem xám).

### 5.5. Bottom Mobile Navigation & Floating Zalo Support
- Cố định đáy màn hình với 4 tab: Khám Phá, Hub Điều Phối (Lịch Hẹn), Ưu Đãi, KPI Pilot.
- Nút nổi **Support Zalo** bo tròn hình oval góc phải: Nền xanh lá đậm `#236B38`, icon tai nghe & chat, cam kết phản hồi < 5 phút.

---

## 6. ANTI-PATTERNS & AI DEFAULTS TO AVOID

- ❌ **Tuyệt đối không dùng màu cam cháy (`#c2410c`) hay đỏ rose tối**: Đây là màu mặc định cũ, đi ngược với nhận diện xanh lá rừng thư thái của thương hiệu Glow.
- ❌ **Không thiết kế dàn trải kiểu desktop 3 cột đơn điệu**: Phải thiết kế Mobile-First để hiển thị chuẩn xác như một ứng dụng di động thực tế.
- ❌ **Không dùng font chữ mặc định Serif nặng nề**: Dùng Sans hiện đại, thoáng đãng, mang tính chất dịch vụ chăm sóc sắc đẹp & thư giãn.
- ❌ **Không dùng khoảng cách click quá nhỏ**: Các nút bấm phải đạt tối thiểu 44px chiều cao để tiện thao tác bằng ngón tay cái trên điện thoại.
