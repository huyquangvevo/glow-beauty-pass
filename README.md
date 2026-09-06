# 🌸 GlowBeautyPass — MVP Pilot 90 Ngày

Mạng lưới spa nhỏ chuẩn hóa quy trình, giá rõ trước, đặt lịch qua Zalo tại Quận Cầu Giấy, Hà Nội.

* **Website Production:** [https://glow-beauty-pass.vercel.app](https://glow-beauty-pass.vercel.app)
* **GitHub Repository:** [https://github.com/huyquangvevo/glow-beauty-pass](https://github.com/huyquangvevo/glow-beauty-pass)
* **Supabase Project:** `glow-beauty-pass` (`olujbvuvtxuaybeedhjh` - Singapore)

---

## 📖 Tài Liệu Kiến Trúc & Vận Hành Chi Tiết
Toàn bộ sơ đồ kiến trúc, luồng webhook 2 chiều, hướng dẫn triển khai 0đ (Vercel, Supabase, Koyeb/Local Worker) và runbook quản trị được lưu tại:
👉 **[DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)**

---

## 🚀 Các Trang Chính Của Ứng Dụng

| Đường dẫn | Đối tượng sử dụng | Mô tả chức năng |
| :--- | :--- | :--- |
| **`/`** | **Khách Hàng** | Xem bảng giá 3 gói niêm yết (49k, 69k, 149k), danh mục 15 spa Cầu Giấy kèm tính khoảng cách GPS, đặt lịch qua Zalo. |
| **`/spa/[slug]`** | **Khách Hàng** | Chi tiết điểm spa, ảnh thực tế, giờ mở cửa, ưu đãi độc quyền và review xác thực SĐT. |
| **`/hub`** | **CSKH / Điều Phối** | Hub Ops CRM: Hàng đợi chat Zalo tập trung, bộ đếm SLA (< 5 phút), kịch bản mẫu 1-click, form chốt lịch 1-click sinh mã `GBP-xxxxx`. |
| **`/admin/kpi`** | **Ban Quản Trị** | Giám sát trực tiếp 5 chỉ số sống còn Go/No-Go sau ngày thứ 90 (Booking/spa, tỷ lệ chốt, tỷ lệ quay lại 45 ngày, giữ đúng giá, rating TB). |

---

## 🛠️ Chạy Ứng Dụng Tại Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Đồng bộ Prisma Database
pnpm exec prisma db push

# 3. Nạp dữ liệu mẫu 15 spa Cầu Giấy
pnpm dlx tsx prisma/seed.ts

# 4. Khởi động server
pnpm dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).
