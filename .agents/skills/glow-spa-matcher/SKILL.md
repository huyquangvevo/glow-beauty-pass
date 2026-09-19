---
name: glow-spa-matcher
description: "Dùng khi người dùng gửi ảnh menu, bảng giá, tờ rơi hoặc thông tin dịch vụ của một spa/nail/salon để kiểm tra, so sánh độ khớp dịch vụ và mức độ phù hợp về giá so với hệ thống Glow Beauty Pass (bang-gia.txt). Đưa ra đánh giá tiềm năng hợp tác và kịch bản kết nối đối tác."
metadata:
  version: 1.0.0
---

# Glow Spa Matcher (Bộ Đối Soát & Thẩm Định Menu Spa)

Kỹ năng chuyên dụng giúp phân tích, bóc tách và đối soát bảng giá, thực đơn dịch vụ (qua ảnh chụp, OCR, text hoặc link mạng xã hội) của các cơ sở Spa / Nail / Gội đầu / Thẩm mỹ so với danh mục và khung giá chuẩn của **Glow Beauty Pass**.

---

## 1. Khung Dịch Vụ & Giá Chuẩn Glow Beauty Pass

Căn cứ theo văn bản đối tác tiêu chuẩn (`docs/bang-gia.txt`) và cơ sở dữ liệu hệ sinh thái Glow:

| Mã Dịch Vụ | Tên Dịch Vụ Chuẩn Glow | Giá Ưu Đãi Glow | Quy Chuẩn Dịch Vụ |
| :--- | :--- | :--- | :--- |
| `goi-sach` | **Gội đầu sạch** | **39.000đ** (39K) | Gội sạch 2 lần nước, sấy khô cơ bản |
| `goi-dau-cap` | **Gội đầu cặp** | **59.000đ** (59K) | Gội dầu cặp chuyên dụng / phục hồi, xả sấy |
| `duong-sinh` | **Gội dưỡng sinh** | **149.000đ** (149K) | Rửa mặt, massage bấm huyệt đầu, cổ vai gáy, canh thảo dược |
| `massage-body` | **Massage body 60 phút** | **199.000đ** (199K) | Liệu trình body toàn thân tối thiểu 60 phút (tinh dầu/đá nóng) |
| `cham-soc-da` | **Chăm sóc da cơ bản** | **169.000đ** (169K) | Tẩy trang, rửa mặt, tẩy da chết, hút nhờn, đắp mask, dưỡng ẩm |
| `combo-goi-da` | **Combo gội + chăm sóc da** | **199.000đ** (199K) | Kết hợp gội sạch/thảo dược và gói làm sạch, chăm sóc da |
| `triet-long` | **Triệt lông** | **99.000đ** (99K / buổi / vùng) | Triệt công nghệ Diode/IPL theo buổi/vùng lẻ |

*Lưu ý: Mảng Nail (móng), Mi, Phun xăm thẩm mỹ hiện KHÔNG nằm trong danh mục cốt lõi của Glow Beauty Pass.*

---

## 2. Quy Trình Đánh Giá (Workflow)

Khi nhận được ảnh bảng giá hoặc văn bản thông tin từ người dùng:

### Bước 1: Trích xuất dữ liệu (OCR & Phân loại)
- Đọc tất cả các dịch vụ trên bảng giá: Tên dịch vụ, giá niêm yết, thời lượng (nếu có).
- Nhận diện loại hình cơ sở:
  - **Spa Dưỡng sinh chuyên biệt**: Tỷ lệ khớp cao nhất (gội dưỡng sinh, massage, cổ vai gáy).
  - **Skin Care / Spa Thẩm mỹ**: Khớp mảng chăm sóc da, triệt lông.
  - **Hair Salon / Tiệm Tóc**: Khớp gội sạch, gội cặp.
  - **Nail / Mi Salon**: Đa phần lệch danh mục, chỉ có gội đầu hoặc massage ngắn là phụ trợ.

### Bước 2: Lập ma trận so khớp (Service & Price Mapping)
1. **Khớp trực tiếp (Direct Match)**: Tên và nội dung tương đồng (ví dụ: Gội dưỡng sinh, Massage body).
2. **Khớp bán phần (Partial Match)**: Dịch vụ nhỏ lẻ (ví dụ: "Massage cổ vai gáy 90k" vs "Massage body 60p 199k" -> chỉ là massage cục bộ; "Đắp mặt nạ 20k" -> chỉ là add-on, không phải Chăm sóc da cơ bản).
3. **Lệch danh mục (Out of Scope)**: Làm móng, nối mi, uốn tóc, filler, phun xăm.

### Bước 3: Phân tích chênh lệch giá & Khả năng đàm phán
- **Giá spa < Giá Glow**: Rất dễ onboard, spa có biên lợi nhuận tốt khi bán giá Glow.
- **Giá spa xấp xỉ Giá Glow (chênh lệch 10% - 30%)**: Khả thi cao, spa dễ dàng giảm nhẹ để nhận lượng khách đông từ Glow.
- **Giá spa > 2x Giá Glow**: Phân khúc cao cấp hoặc dịch vụ định giá cao, cần đàm phán gói trải nghiệm rút gọn thời lượng hoặc gói dùng thử cho khách Glow.

---

## 3. Cấu Trúc Báo Cáo Chuẩn Cho Người Dùng

Mỗi khi người dùng gửi ảnh hoặc thông tin bảng giá, luôn phản hồi theo định dạng sau:

```markdown
### 1. Thông Tin Cơ Sở
- **Tên cơ sở / Hotline**: ...
- **Mô hình kinh doanh**: (Nail & Eyelash / Dưỡng Sinh / Salon / Clinic...)

### 2. Ma Trận Đối Soát Dịch Vụ & Giá
| Dịch vụ Glow | Dịch vụ tương ứng tại Spa | Giá Spa niêm yết | Giá chuẩn Glow | Trạng thái & Khả năng khớp |
| :--- | :--- | :--- | :--- | :--- |
| Gội đầu sạch | ... | ... | 39.000đ | Khớp / Cần đàm phán / Không có |
| Gội đầu cặp | ... | ... | 59.000đ | ... |
| Gội dưỡng sinh | ... | ... | 149.000đ | ... |
| Massage body | ... | ... | 199.000đ | ... |
| Chăm sóc da cơ bản | ... | ... | 169.000đ | ... |
| Combo gội + da | ... | ... | 199.000đ | ... |
| Triệt lông | ... | ... | 99.000đ | ... |

### 3. Dịch Vụ Ngoài Hệ Thống Glow (Nếu có)
- Liệt kê các dịch vụ spa có nhưng Glow chưa hỗ trợ (VD: Nail, Uốn mi, Tẩy tế bào chết gót chân...)

### 4. Kết Luận & Đánh Giá Tiềm Năng
- **Điểm phù hợp (Fit Score)**: Thang điểm 1 - 5 sao
- **Đánh giá về giá**: ...
- **Đánh giá về mô hình & cơ sở vật chất**: ...

### 5. Đề Xuất Kịch Bản Gửi Spa (Nếu phù hợp hợp tác)
- Tạo sẵn tin nhắn mời tham gia theo format chuẩn `bang-gia.txt`.
```
