# Kế hoạch Triển Khai MVP GlowBeautyPass trong 2 Tuần (Pilot-Ready)

Kế hoạch này nhằm đưa hệ thống phần mềm GlowBeautyPass vào trạng thái **sẵn sàng chạy Pilot thực tế (1 quận, 15–20 spa, 3 SKU dịch vụ)** trong đúng **10 ngày làm việc (2 tuần)**, với nguồn lực **1 Senior Fullstack Dev + AI**.

---

## 1. Nguyên Tắc Cắt Giảm Phạm Vi (Scope Cutting Strategy)

Để hoàn thành trong 2 tuần mà vẫn đảm bảo **100% năng lực kiểm chứng 3 câu hỏi của Pilot** (*Khách có đặt qua Zalo không? Khách có quay lại không? Spa có giữ đúng giá không?*), chúng ta cần triệt để phân định cái gì **CẦN LÀM NGAY** và cái gì **HOÃN SANG PHA 2**:

### 🚫 TẠM HOÃN (Chưa làm trong 2 tuần này):
1. **Module Mua gói & Quản lý ví buổi (Pass/Wallet)**: Kế hoạch kinh doanh ghi rõ: Gói mua trước chỉ ra mắt ở **Tháng 4 (Pha 2)**. Pilot 3 tháng đầu chạy thuần **bán lẻ đúng giá**. Cắt phần này tiết kiệm được 40% công sức (không cần cổng thanh toán, không cần logic trừ lượt, không cần QR check-in off-peak).
2. **Spa Portal / Dashboard cho chủ spa**: Ở Pha 1, chủ spa không cần đổi phần mềm hay cài app. Điều phối viên Hub gọi điện hoặc nhắn tin Zalo báo spa. Spa chỉ cần xác nhận còn chỗ hay không.
3. **Chatbot AI Inbound tự động trả lời khách**: Pha 1 ưu tiên người thật trực 100% để học kịch bản khách hỏi và đảm bảo tỷ lệ chốt $\ge 55\%$. Thay bằng **Hệ thống tin nhắn mẫu 1-click (Quick Replies)**.
4. **Programmatic SEO quy mô lớn**: Chỉ cần Landing page chính + danh mục 15–20 spa của 1 quận pilot.

###  BẮT BUỘC PHẢI CÓ (Core MVP trong 2 tuần):
1. **Web Catalog & Landing Page**: Bản đồ/khoảng cách, bảng giá 3 SKU niêm yết, cam kết dịch vụ, CTA nút nhắn Zalo Hub.
2. **Zalo Messaging Gateway & Data Persistence**: Tích hợp `zca-js` (kèm đường lui Zalo OA), lưu 100% tin nhắn vào PostgreSQL thời gian thực để không bao giờ mất khách khi tài khoản Zalo gặp sự cố.
3. **Hub Ops Tool (CRM nội bộ cho CSKH)**: Giao diện chat tập trung, bảng quản lý ghế trống của 20 spa, kịch bản trả lời nhanh, bộ đếm & cảnh báo vi phạm SLA (< 5 phút).
4. **Định danh Khách & Đo lường KPI Pilot**: Thu thập SĐT ở lần đặt đầu, đo tỷ lệ chốt, tỷ lệ khách quay lại 45 ngày, ghi nhận phản ánh giá và rating.

---

## 2. Kiến Trúc Kỹ Thuật Tối Giản (Lean Tech Stack)

| Thành phần | Công nghệ lựa chọn | Lý do chọn để dev siêu tốc với AI |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router) + TailwindCSS + shadcn/ui** | Tốc độ dựng UI nhanh x3 với AI, hỗ trợ SSR SEO tốt, giao diện responsive chuẩn mobile cho khách. |
| **Backend API** | **Node.js (NestJS hoặc Fastify)** | Đồng nhất TypeScript với Frontend và thư viện `zca-js`. Dễ viết worker. |
| **Database** | **PostgreSQL (Supabase hoặc Neon DB)** | Miễn phí setup ban đầu, có sẵn Realtime engine, backup tự động, hỗ trợ Prisma ORM cực mượt. |
| **Hàng đợi / Cache** | **Redis + BullMQ** | Quản lý hàng đợi gửi tin nhắn Zalo, rate limit chống khóa nick, cache lịch trống. |
| **Zalo Connector** | **Node Worker (`zca-js`) + Zalo OA Webhook fallback** | Chạy độc lập trong Docker container riêng biệt để không ảnh hưởng app chính nếu crash. |

---

## 3. Lộ Trình Sprint 10 Ngày (Day-by-Day Breakdown)

```
TUẦN 1: HẠ TẦNG DỮ LIỆU, ZALO GATEWAY & WEB CATALOG KHÁCH HÀNG
├── Ngày 1: Setup Monorepo / DB Schema / Zalo zca-js Session Worker
├── Ngày 2: Hoàn thiện Zalo Gateway: Sync tin nhắn 2 chiều về PostgreSQL + Rate Limiter
├── Ngày 3: Web Client: Landing Page thương hiệu + Bảng giá 3 SKU + Bản đồ định vị Spa
├── Ngày 4: Web Client: Trang chi tiết Spa, Menu dịch vụ, Form Review có ảnh + OTP SMS
└── Ngày 5: Kiểm thử luồng Web -> Nút chat Zalo -> DB lưu nhận diện khách hàng

TUẦN 2: HUB OPS CRM (CÔNG CỤ ĐIỀU PHỐI) & METRICS PILOT
├── Ngày 6: Hub Ops UI: Màn hình Live Chat tập trung gom tin nhắn Zalo + Quick Replies
├── Ngày 7: Hub Ops Tool: Bảng trạng thái ghế trống (Slot Board) của 20 Spa
├── Ngày 8: SLA Tracker: Bộ đếm thời gian phản hồi (< 5p, < 20p) & Cảnh báo âm thanh/màu
├── Ngày 9: Module Chốt lịch & Mini Admin: Báo cáo 5 chỉ số Go/No-Go theo tuần
└── Ngày 10: Chạy thử nghiệm nội bộ (Internal Dry Run), Hướng dẫn CSKH & Ready Go-Live
```

### Chi tiết từng ngày:

#### Ngày 1: Setup Nền tảng & Zalo Worker
* Khởi tạo codebase TypeScript (Next.js + Fastify backend).
* Thiết kế Database Schema (PostgreSQL): `Spa`, `ServiceSku`, `Customer`, `Conversation`, `Message`, `Booking`, `AuditLog`.
* Setup module `zca-js`: login QR, lưu session cookie bảo mật, cơ chế auto-reconnect khi rớt mạng.

#### Ngày 2: Zalo Message Persistence & Anti-ban Protection
* Thiết lập BullMQ: rate limit tin nhắn đi (tối đa 1 tin/5s với người lạ, jitter ngẫu nhiên 3–10s).
* Webhook/Listener hứng tin nhắn đến: Lưu ngay lập tức vào bảng `Message` và `Conversation`.
* Tạo sẵn interface `IMessagingGateway` để có thể cắm Zalo OA webhook khi cần.

#### Ngày 3: Web Client – Trang chủ & Định vị Spa
* Dựng giao diện Web Mobile-first phong cách làm đẹp cao cấp (Glow style).
* Hiển thị cam kết: "1 Bảng giá - 1 Quy trình - 1 Zalo đặt lịch".
* Tích hợp bản đồ / Geolocation tính khoảng cách tới 15–20 spa trong quận ("Cách bạn 500m").

#### Ngày 4: Web Client – Chi tiết Spa & Review
* Trang chi tiết từng spa: Ảnh thực tế, bảng giá niêm yết 3 dịch vụ (Gội sạch, Premium, Dưỡng sinh), ưu đãi riêng của điểm.
* Form gửi đánh giá/review sau khi làm: Upload ảnh + nhập mã OTP qua SĐT (dùng Firebase Auth hoặc SMS giá rẻ).
* Nút CTA chính: "Đặt lịch qua Zalo" (mở deep link trực tiếp tới tài khoản Hub đang phụ trách quận).

#### Ngày 5: Kết nối & Test luồng Khách hàng
* Khách bấm Zalo từ web -> Tin nhắn về hệ thống -> DB lưu SĐT và thông tin khách.
* Review code tuần 1, chuẩn bị sẵn sàng dữ liệu của 15–20 spa mẫu.

#### Ngày 6: Hub Ops Tool – Màn hình Live Chat tập trung
* Xây dựng giao diện web nội bộ cho nhân viên trực Hub:
  * Danh sách hội thoại bên trái (phân loại: Chờ phản hồi, Đang trao đổi, Đã chốt).
  * Khung chat ở giữa (gửi nhận tin nhắn Zalo thời gian thực qua WebSocket).
  * Bảng tin nhắn mẫu bên phải (Quick Replies: kịch bản chào, gửi bảng giá, hỏi thời gian muốn làm...).

#### Ngày 7: Hub Ops Tool – Bảng trống lịch Spa (Slot Board)
* Giao diện ma trận lịch của 20 spa trong quận: các khung giờ sáng / chiều / tối.
* Nút thao tác nhanh cho nhân viên: Nhấn giữ chỗ khi điều phối với khách, đánh dấu "Đã xác nhận với spa".

#### Ngày 8: Bộ giám sát SLA & Cảnh báo vi phạm
* Logic tính thời gian:
  * `first_response_time`: Thời gian từ tin nhắn đầu của khách tới tin phản hồi đầu tiên.
  * Cảnh báo đổi màu: Vàng (> 2 phút), Đỏ (> 4 phút) để bảo vệ cam kết < 5 phút.
  * `booking_confirm_time`: Cảnh báo nếu ca tư vấn kéo dài > 15 phút mà chưa chốt.
* Cảnh báo âm thanh (ding/beep) khi có tin nhắn mới hoặc SLA sắp vỡ.

#### Ngày 9: Dispatching Flow & Dashboard 5 KPI Pilot
* Nút bấm "Chốt lịch": Ghi nhận Spa được chọn, dịch vụ, giờ hẹn, SĐT khách.
* Nút "Ghi nhận vi phạm": Spa báo sai giá, Spa từ chối lịch -> Tự động ghi thẻ vàng.
* Trang Dashboard theo dõi 5 chỉ số Go/No-Go:
  1. Tổng booking/spa trong tháng (Bar chart so với mốc 40).
  2. Tỷ lệ hội thoại -> chốt booking (so với mốc 55%).
  3. Tỷ lệ khách quay lại đặt lần 2 trong 45 ngày (so với mốc 30%).
  4. Tỷ lệ phản hồi đúng SLA < 5 phút (so với mốc 90%).
  5. Điểm rating trung bình (so với mốc 4.6).

#### Ngày 10: Chạy thử toàn diện (Dry Run) & Bàn giao
* Mời toàn bộ team (Ops, CSKH, BD) vào test đóng vai khách hàng và spa.
* Đào tạo nhân sự trực Hub thao tác trên màn hình CRM.
* Bàn giao và đóng băng code (Code Freeze), sẵn sàng đón đợt khách đầu tiên từ chiến dịch Ads.

---

## 4. Kế Hoạch Kiểm Thử & Xác Thực (Verification Plan)

### Kiểm thử Tự động (Automated Tests):
* **Zalo Worker Session Test**: Kiểm tra tự động reconnect khi mất mạng, xử lý refresh cookie.
* **BullMQ Rate Limiter Test**: Giả lập gửi 50 tin nhắn liên tục -> Xác nhận hệ thống phân tán cách nhau 3–7s, không bị block.
* **Database Persistence Test**: Ngắt kết nối Zalo client, xác nhận mọi dữ liệu tin nhắn đã gửi trước đó vẫn nguyên vẹn trong DB.

### Kiểm thử Thủ công (Manual Scenario Testing):
1. **Luồng Khách đặt lịch thành công**: Khách vào web -> bấm nút Zalo -> chat hỏi lịch dưỡng sinh -> CSKH dùng Quick Reply tư vấn -> kiểm tra slot board -> chốt lịch -> hệ thống ghi nhận booking và đo đúng SLA.
2. **Luồng Cảnh báo SLA**: Để một tin nhắn đến chờ quá 3 phút -> Kiểm tra cảnh báo hiển thị màu đỏ trên màn hình CSKH.
3. **Luồng Đo khách quay lại**: Dùng cùng 1 SĐT đặt lần 2 sau 3 ngày -> Dashboard ghi nhận tỷ lệ khách quay lại tăng lên.

---

## 5. Các Rủi Ro Kỹ Thuật Trong 2 Tuần & Phương Án Dự Phòng

| Rủi ro | Mức độ | Phương án xử lý ngay |
| :--- | :---: | :--- |
| **`zca-js` bị checkpoint tài khoản trong lúc test** | Cao | Chuẩn bị sẵn 3 SIM cá nhân đã kích hoạt Zalo lâu năm. Cấu hình sẵn 1 Zalo OA chính thức để switch sang OA webhook trong 30 phút nếu cần. |
| **Hết giờ làm Web Review OTP** | Trung bình | Tạm thời dùng Google Review link hoặc form typeform nhúng, tập trung 100% thời gian cho Hub CRM và Zalo. |
| **Nhân viên CSKH chưa quen giao diện** | Thấp | Thiết kế UI Hub CRM theo bố cục giống hệt Zalo Web / Facebook Messenger để nhân viên làm quen trong 15 phút. |
