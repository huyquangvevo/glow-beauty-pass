# TÀI LIỆU KIẾN TRÚC VÀ HẠ TẦNG TRIỂN KHAI GLOWBEAUTYPASS
> **Dự án:** GlowBeautyPass — Mạng lưới Spa nhỏ chuẩn hóa (Pilot 90 Ngày tại Quận Cầu Giấy)  
> **Repository:** [https://github.com/huyquangvevo/glow-beauty-pass](https://github.com/huyquangvevo/glow-beauty-pass)  
> **Production URL:** [https://glow-beauty-pass.vercel.app](https://glow-beauty-pass.vercel.app)  
> **Mục tiêu hạ tầng:** Tối ưu hóa chi phí vận hành **0đ / tháng (100% Free Tier)** nhưng đảm bảo độ tin cậy và khả năng mở rộng.

---

## 1. Tổng Quan Kiến Trúc (Architecture Overview)

Hệ thống được thiết kế theo mô hình **Decoupled Architecture (Tách biệt Stateless & Stateful)** để tận dụng tối đa các gói Free Tier đám mây mà không vi phạm giới hạn kỹ thuật của Serverless:

```mermaid
flowchart TD
    subgraph ClientLayer["KÊNH KHÁCH HÀNG & CSKH"]
        Customer["Khách Hàng (Mobile / Web)"]
        Staff["Điều Phối Viên CSKH (Hub CRM)"]
        Admin["Ban Quản Trị (Dashboard 5 KPIs)"]
    end

    subgraph VercelApp["VERCEL CLOUD (Stateless Serverless)"]
        WebCatalog["Next.js App Router (SSR Web Catalog)"]
        HubCRM["Hub Ops Live Chat & Slot Board (/hub)"]
        KPIDash["Bảng Giám Sát Go/No-Go (/admin/kpi)"]
        APIs["API Engine (/api/spas, /api/bookings, /api/metrics)"]
        InboundWebhook["Receiver Webhook (/api/webhooks/zalo)"]
    end

    subgraph SupabaseDB["SUPABASE CLOUD (Database Layer)"]
        Pooler["Supavisor Transaction Pooler (Port 6543)"]
        PostgresDB[("PostgreSQL 17 (Singapore - 500MB Free)")]
    end

    subgraph ZaloWorkerLayer["ZALO CONNECTOR WORKER (Stateful 24/7)"]
        WorkerService["Node.js Daemon (worker/index.js)"]
        ZcaDriver["zca-js (Zalo Personal Protocol)"]
        JitterEngine["Rate Limiter & Anti-Ban Jitter (2-4s)"]
    end

    subgraph ZaloEcosystem["ZALO ECOSYSTEM"]
        ZaloChat["Tài Khoản Zalo Cá Nhân (Hub Tổng Đài)"]
    end

    Customer -->|Duyệt bảng giá, khoảng cách| WebCatalog
    Customer -->|Nhắn nhu cầu đặt lịch| ZaloChat
    Staff -->|Điều phối & Chốt lịch 1-click| HubCRM
    Admin -->|Theo dõi 5 chỉ số Go/No-Go| KPIDash

    WebCatalog --> APIs
    HubCRM --> APIs
    KPIDash --> APIs

    APIs -->|Prisma ORM| Pooler
    InboundWebhook -->|Prisma ORM| Pooler
    Pooler --> PostgresDB

    ZaloChat <-->|WebSocket Realtime| ZcaDriver
    ZcaDriver --> WorkerService
    WorkerService -->|HTTP POST + Secret Key| InboundWebhook
    HubCRM -->|HTTP POST /send| WorkerService
    WorkerService --> JitterEngine
    JitterEngine --> ZcaDriver
```

---

## 2. Danh Mục Các Thành Phần Hạ Tầng Đã Triển Khai

| Thành phần | Nền tảng đảm nhiệm | Trạng thái | Chi phí | Ghi chú kỹ thuật |
| :--- | :--- | :---: | :---: | :--- |
| **Source Code** | **GitHub** | Hoạt động | 0đ | Repo: `huyquangvevo/glow-beauty-pass` |
| **Web + APIs** | **Vercel** | Hoạt động | 0đ | Domain: `glow-beauty-pass.vercel.app` |
| **PostgreSQL Database** | **Supabase** | Hoạt động | 0đ | Project: `olujbvuvtxuaybeedhjh` (Singapore) |
| **Zalo Connector Worker** | **Worker Daemon** | Đã đóng gói | 0đ | Chạy độc lập qua Docker / Node.js 24/7 |

---

## 3. Chi Tiết Cấu Hình Từng Nền Tảng

### A. Vercel (Web & API Serverless)
* **Framework:** Next.js 16 (App Router, Turbopack, TypeScript, TailwindCSS v4).
* **Build Command:** `prisma generate && next build` *(Bắt buộc phải có `prisma generate` để Vercel sinh Prisma client khi build)*.
* **Biến môi trường (Environment Variables) trên Vercel:**
  ```env
  DATABASE_URL=postgresql://postgres.olujbvuvtxuaybeedhjh:GlowBeautyPass2026!%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  DIRECT_URL=postgresql://postgres:GlowBeautyPass2026!%23@db.olujbvuvtxuaybeedhjh.supabase.co:5432/postgres
  NEXT_PUBLIC_APP_NAME=GlowBeautyPass
  NEXT_PUBLIC_PILOT_DISTRICT=Cầu Giấy
  NEXT_PUBLIC_ZALO_HUB_PHONE=0988888888
  NEXT_PUBLIC_ZALO_HUB_LINK=https://zalo.me/0988888888
  ZALO_WEBHOOK_SECRET=glow_secret_key_2026
  ZALO_WORKER_URL=https://<dia-chi-worker-cua-ban>
  ```

---

### B. Supabase (PostgreSQL Database)
* **Project Name:** `glow-beauty-pass`
* **Project ID:** `olujbvuvtxuaybeedhjh`
* **Region:** `ap-southeast-1` (Singapore)
* **Database Password:** `GlowBeautyPass2026!#` *(Trong URL connection encode là `%23`)*.
* **Bảng dữ liệu đã khởi tạo (8 Tables):**
  1. `Spa`: Lưu danh mục 15 spa Cầu Giấy, tọa độ GPS, rating, thẻ vàng/thẻ đỏ.
  2. `ServiceSku`: 3 gói niêm yết (Gội sạch 49k, Gội Premium 69k, Gội dưỡng sinh 149k).
  3. `Slot`: Quản lý ghế trống đầu ngày (Sáng, Chiều, Tối).
  4. `Customer`: Định danh khách hàng bằng Số điện thoại (chống mất khách khi mất Zalo).
  5. `Conversation`: Quản lý phiên chat Zalo, tính toán thời gian phản hồi SLA.
  6. `Message`: Lưu trữ 100% nội dung tin nhắn 2 chiều.
  7. `Booking`: Lịch hẹn đã chốt kèm mã `GBP-xxxxx`.
  8. `Review`: Đánh giá có ảnh kèm xác thực SĐT chống review ảo.

---

### C. Zalo Connector Worker (`worker/`)
Thư viện `zca-js` là một tiến trình **Stateful (duy trì kết nối socket liên tục)**. Mã nguồn đã được đóng gói sẵn trong thư mục `worker/` gồm:
* `worker/index.js`: Express server quản lý kết nối Zalo, endpoint `/health`, `/status`, `/send` và webhook listener.
* `worker/Dockerfile`: Docker container siêu nhẹ chạy trên Alpine Linux.
* `worker/package.json`: Chứa `zca-js`, `express`, `dotenv`.

#### 3 Phương Án Triển Khai Worker 0đ:

####  Phương Án 1: Chạy trực tiếp trên Máy tính / Laptop Văn phòng Hub (KHUYÊN DÙNG NHẤT CHO ZALO)
> **Lý do:** Zalo rất nhạy cảm với việc tài khoản cá nhân đăng nhập từ IP Datacenter nước ngoài. Chạy worker trực tiếp trên máy bàn của CSKH (IP mạng dân cư VNPT/Viettel/FPT) giúp **giảm 99% rủi ro bị checkpoint/khóa số**.

* **Cách chạy bằng Node.js trực tiếp:**
  ```bash
  cd worker
  npm install
  # Tạo file .env với thông tin Zalo
  npm start
  ```
* **Cách chạy nền 24/7 bằng PM2:**
  ```bash
  npm install -g pm2
  pm2 start index.js --name "zalo-worker"
  pm2 startup
  pm2 save
  ```
* Dùng công cụ miễn phí như **Cloudflare Tunnel** hoặc **ngrok** để mở port public về Vercel:
  ```bash
  cloudflared tunnel --url http://localhost:8000
  ```

####  Phương Án 2: Render.com (Miễn phí 750 giờ/tháng)
* Truy cập [Render.com](https://render.com) $\rightarrow$ **New Web Service** $\rightarrow$ Kết nối GitHub repo `huyquangvevo/glow-beauty-pass`.
* Cấu hình:
  * **Root Directory:** `worker`
  * **Environment:** `Node` (hoặc `Docker`)
  * **Plan:** `Free` (0$/tháng)
  * **Environment Variables:** Điền `PORT=8000`, `VERCEL_WEBHOOK_URL`, `ZALO_WEBHOOK_SECRET`, `ZALO_COOKIES`, `ZALO_IMEI`.

####  Phương Án 3: Fly.io (Miễn phí 3 máy ảo 256MB RAM)
* Dùng Fly CLI chạy:
  ```bash
  cd worker
  fly launch --no-deploy
  fly deploy
  ```

---

## 4. Đặc Tả Giao Tiếp Webhook 2 Chiều

### Luồng 1: Khách gửi tin nhắn Zalo $\rightarrow$ Vercel Hub CRM
* **Phương thức:** `POST`
* **URL:** `https://glow-beauty-pass.vercel.app/api/webhooks/zalo`
* **Header:** `x-webhook-secret: glow_secret_key_2026`
* **Body:**
  ```json
  {
    "zaloChatId": "1234567890",
    "senderZaloId": "1234567890",
    "senderName": "Chị Hoàng Lan",
    "senderPhone": "0912345678",
    "content": "Em ơi 14h30 chiều nay còn chỗ gội đầu dưỡng sinh không?",
    "messageId": "zalo_1788662999"
  }
  ```
* **Xử lý:** Vercel tự động tìm hoặc tạo Customer, mở Conversation, khởi động bộ đếm SLA (< 5 phút) và hiển thị lên màn hình `/hub`.

### Luồng 2: CSKH bấm trả lời trên Hub CRM $\rightarrow$ Zalo Khách
* **Phương thức:** `POST`
* **URL:** `https://<zalo-worker-host>/send`
* **Header:** `x-webhook-secret: glow_secret_key_2026`
* **Body:**
  ```json
  {
    "threadId": "1234567890",
    "content": "Dạ em chào chị Lan! Bạch Cúc Duy Tân lúc 14h30 còn đúng 1 giường gội dưỡng sinh 149k ạ. Em giữ chỗ cho chị nhé!"
  }
  ```
* **Xử lý:** Worker nhận lệnh $\rightarrow$ Thêm độ trễ ngẫu nhiên 2–4s (Jitter delay) $\rightarrow$ Gửi tin nhắn thực tế tới Zalo khách.

---

## 5. Hướng Dẫn Lấy Zalo Cookies & IMEI (1 Lần Duy Nhất)

1. Đăng nhập tài khoản Zalo Hub tại **[chat.zalo.me](https://chat.zalo.me)** trên trình duyệt Chrome/Brave.
2. Cài đặt tiện ích mở rộng: **Cookie-Editor** hoặc **EditThisCookie**.
3. Bấm vào icon tiện ích $\rightarrow$ Bấm nút **Export** (dưới định dạng JSON) $\rightarrow$ Dán vào biến môi trường `ZALO_COOKIES`.
4. Mở tab **Console** của trình duyệt (bấm F12), gõ lệnh sau để lấy IMEI:
   ```javascript
   localStorage.getItem('chat.zalo.me_imei')
   ```
5. Copy chuỗi trả về (dạng UUID) $\rightarrow$ Dán vào biến môi trường `ZALO_IMEI`.

---

## 6. Runbook: Các Lệnh Quản Trị Hệ Thống Thường Dùng

```bash
# 1. Chạy dev server tại máy local
cd docs/app
pnpm dev

# 2. Đồng bộ Prisma Schema lên Supabase khi thay đổi model
pnpm exec prisma db push

# 3. Nạp lại dữ liệu mẫu (15 Spa Cầu Giấy, 3 SKU, Slots)
pnpm dlx tsx prisma/seed.ts

# 4. Mở giao diện trực quan xem database (Prisma Studio)
pnpm exec prisma studio

# 5. Build kiểm tra lỗi trước khi push git
pnpm run build
```

---
*Tài liệu được biên soạn tự động và lưu trữ tại [DEPLOYMENT_ARCHITECTURE.md](file:///Users/quanghuy/Documents/Glow/docs/app/DEPLOYMENT_ARCHITECTURE.md).*
