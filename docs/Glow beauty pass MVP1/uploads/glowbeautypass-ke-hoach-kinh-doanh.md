# GlowBeautyPass

### Kế hoạch kinh doanh & lộ trình 12 tháng

---

## Tóm tắt

**GlowBeautyPass là một mạng lưới spa nhỏ chạy chung ba thứ:** một bảng giá niêm yết công khai, một bộ quy trình chuẩn, và **một tài khoản Zalo duy nhất để đặt lịch cho cả mạng lưới**.

| | |
|---|---|
| **Khách được gì** | Nhắn một chỗ duy nhất là có lịch. Biết giá trước khi đến. Chọn theo đánh giá thật |
| **Spa được gì** | Khách mới mà không phải tự chạy quảng cáo. Lấp được ghế trống giờ vắng. Không phải đổi cách làm việc |
| **Mình được gì** | Nắm đầu mối nhu cầu của cả một ngành phân mảnh, mà không sở hữu một mét vuông mặt bằng nào |

**Cơ chế giữ khách:** giá lẻ nâng lên ở Pha 2, còn khách mua gói 10–20 buổi thì giữ nguyên giá ra mắt.

**Doanh thu:** spa nhận mức giá đã ký từ Pha 1 và giữ nguyên mức đó. Phần giá lẻ nâng thêm ở Pha 2 là lãi của mình. Khách mua gói thì mình không lấy lãi, đổi lại cầm được tiền trước. Từ tháng 9 bổ sung **phí niêm yết hàng năm**.

**Pilot:** một quận, 20 spa, 90 ngày, để trả lời ba câu hỏi — khách có chịu nhắn một đầu mối trung gian không, khách có quay lại không, và spa có giữ đúng giá niêm yết không.

---

## Mục lục

1. Mô hình kinh doanh
2. Sản phẩm & bảng giá
3. Gói mua trước — cơ chế giữ khách
4. Cấu trúc pháp nhân
5. Thứ tự kiếm tiền
6. Phần mềm
7. Lộ trình
8. Phụ lục — thuật ngữ

---

## 1. Mô hình kinh doanh

### 1.1. Vấn đề

**Phía khách.** Đi spa nhỏ là một canh bạc: không biết giá thật cho tới lúc nằm xuống, sợ bị chèo kéo mua gói, không biết chỗ nào làm được chỗ nào không. Muốn đặt lịch thì phải nhắn Zalo từng nơi để hỏi còn chỗ không, nhắn ba nơi mới có một nơi trả lời.

**Phía spa.** Spa nhỏ có ghế trống rất nhiều trong giờ hành chính, marketing yếu, sống nhờ khách quen và vài bài Facebook. Họ không thiếu tay nghề — họ thiếu khách mới và thiếu cách lấp giờ chết.

Hai vấn đề này khớp nhau. Mạng lưới là chỗ nối.

### 1.2. Sản phẩm

Một mạng lưới spa nhỏ chạy chung **một bảng giá niêm yết, một bộ quy trình chuẩn, và một đầu mối đặt lịch duy nhất qua Zalo**.

Spa vẫn là chủ của họ, vẫn tự vận hành, vẫn giữ nguyên cách làm việc. Cái họ nhận từ mình là khách và là nhãn chứng nhận. Cái mình yêu cầu ngược lại là giữ đúng giá, đúng quy trình, và chấp nhận bị đánh giá công khai.

> Khách thấy biển GlowBeautyPass là biết ngay: dịch vụ gì — giá bao nhiêu — chất lượng tối thiểu ra sao.
>
> Khách nhắn một chỗ duy nhất là có lịch, không phải dò từng spa.

### 1.3. Cách vận hành

**Zalo GlowBeautyPass** là một tài khoản Zalo duy nhất, đóng vai trò **tổng đài đặt lịch** cho cả mạng lưới. Luồng chạy như sau:

```
Khách nhắn Zalo GlowBeautyPass
        ↓
Tổng đài nhắn Zalo spa, hỏi chỗ trống
        ↓
Tổng đài xác nhận lịch lại với khách
```

Khách không phải tự đi hỏi từng nơi. Spa không phải cài phần mềm hay đổi quy trình gì cả — họ vẫn nhận tin nhắn Zalo như mọi ngày, chỉ khác là tin nhắn đến từ tổng đài thay vì từ khách lẻ.

**Sản phẩm thật sự của tổng đài là tốc độ.** Đây là cam kết vận hành, đo hằng ngày như đo doanh thu:

| Tình huống | Cam kết |
|---|---|
| Giờ hành chính | Phản hồi dưới 5 phút |
| Ngoài giờ | Phản hồi dưới 15 phút |
| Xác nhận lịch với khách | Dưới 20 phút kể từ tin nhắn đầu |

Mỗi hội thoại đồng thời là một bản ghi dữ liệu: khách nào, spa nào, dịch vụ gì, chốt hay không. Đây là thứ một danh bạ thuần không bao giờ có được, và là cơ sở để chứng minh giá trị với spa: *"Tháng này tổng đài chuyển cho chị 63 lịch."*

| | Khách được gì | Spa được gì |
|---|---|---|
| **Trước khi đến** | Giá niêm yết công khai, đánh giá có ảnh, không sợ bị chèo kéo | Khách mới mà không phải tự chạy quảng cáo |
| **Lúc đặt lịch** | Nhắn một đầu mối, có lịch trong 20 phút | Lấp được ghế trống giờ hành chính |
| **Khi quay lại** | Mua gói 10–20 buổi giá tốt hơn, dùng được ở mọi điểm | Tiền mặt trả trước, lấp thêm giờ chết |
| **Dài hạn** | Chất lượng đồng đều ở mọi điểm | Nhãn chứng nhận và bộ nhận diện chuẩn |

### 1.4. Doanh thu

**Spa nhận đúng mức giá đã ký ở Pha 1 và giữ nguyên mức đó về sau.** Mình không lấy hoa hồng, không đòi phí gia nhập. Lãi đến từ phần giá lẻ được nâng thêm ở Pha 2.

| Dòng doanh thu | Cơ chế | Bật khi |
|---|---|---|
| **Chênh lệch giá lẻ** | Khách lẻ trả 179K, spa nhận 149K | Tháng 4 |
| **Phí niêm yết hàng năm** | Suất hiển thị và quyền dùng nhãn | Tháng 9–12 |
| **Certified Kit** | Bộ nhận diện và setup chuẩn | Năm 2 |

**Khách mua gói thì mình không lấy lãi** — họ trả đúng giá ra mắt và spa nhận trọn số đó. Đổi lại mình cầm tiền trước cho 10 đến 20 buổi và neo được khách vào mạng lưới. Đây là đánh đổi có chủ đích: bán lẻ để có lãi, bán gói để giữ khách và có dòng tiền.

Mình cũng **không bán vật tư hay mỹ phẩm cho spa** — làm phân phối sẽ biến mình thành nhà buôn có thêm cái web, và sẽ bắt đầu tối ưu cho việc spa mua hàng thay vì cho việc khách quay lại.

**Ba tháng đầu chủ động không có doanh thu.** Giai đoạn pilot dồn toàn lực xây mật độ điểm và dữ liệu đặt lịch. Từ tháng 4, chênh lệch giá lẻ bắt đầu chạy. Đến tháng 9, khi spa đã thấy rõ lượng khách nhận về mỗi tháng, việc thu phí niêm yết trở thành hiển nhiên chứ không phải đi thuyết phục.

### 1.5. Vì sao là mình

Không phải xây từ số không. Glow đã có sẵn:

- Tập khách làm đẹp tại Việt Nam để đẩy chéo
- Năng lực chạy quảng cáo theo bán kính địa lý
- Hệ thống đánh giá và kiểm duyệt nội dung
- Cơ chế thẻ vàng/thẻ đỏ để kỷ luật đối tác
- Hạ tầng SEO tự sinh trang theo quận/phường
- Đội chăm sóc khách hàng quen vận hành marketplace dịch vụ

Phần phải xây mới chỉ là quy trình tổng đài.

### 1.6. Vì sao khó bắt chước

**Spa khó chạy hai mạng lưới cùng lúc.** Một spa đã treo biển GlowBeautyPass, dùng sản phẩm đạt chuẩn, chạy quy trình GlowBeautyPass thì không thể đồng thời treo biển đối thủ. So với marketplace giao đồ ăn — nơi một quán bật cả ShopeeFood, Grab, Be trong năm phút — ở đây rào cản cao hơn hẳn.

**Mật độ là thứ phải xây lại từ đầu ở từng quận.** Khi một quận đã có 20 điểm, tổng đài luôn tìm được chỗ trống cho khách trong bán kính đi bộ. Đối thủ mới không thể sao chép điều đó bằng tiền một sớm một chiều.

### 1.7. Vì sao chọn mô hình tổng đài Zalo

Nếu chỉ làm danh bạ có đánh giá và đặt lịch thì đã có Ohbeauti, Lookme, BeautyX, Fresha, Booksy — và Google Maps miễn phí. Không thắng được bằng "có web". Còn nếu bắt spa nhỏ dùng phần mềm đặt lịch riêng thì gần như không ai chịu đổi quy trình.

| | Danh bạ thuần | **Tổng đài Zalo (đã chọn)** | Phần mềm đặt lịch riêng |
|---|---|---|---|
| Dữ liệu giao dịch | Không có | **Có, đầy đủ** | Có |
| Spa phải đổi quy trình | Không | **Không** | Có — rất khó thuyết phục |
| Chi phí lập trình | Rất nhẹ | **Nhẹ** | Nặng |
| Chi phí vận hành | Gần bằng 0 | **Nhân sự trực tổng đài** | Thấp sau khi xây xong |
| Chứng minh được giá trị với spa | Không | **Có** | Có |
| Ghi nhận được khách quay lại | Không | **Có** | Có |

Cái giá phải trả là nhân sự trực tổng đài. Đổi lại mình nắm được đầu mối nhu cầu — và **đó mới là tài sản**, không phải web, không phải kho hàng.

### 1.8. Chuỗi giá trị

```
Lưu lượng khách (Glow + quảng cáo + SEO + biển hiệu)
        ↓
Zalo GlowBeautyPass — đầu mối đặt lịch duy nhất    ← tài sản cốt lõi
        ↓
Dịch vụ chuẩn hóa, giá niêm yết
        ↓
Chênh lệch giá lẻ + gói mua trước                  ← lãi và dòng tiền trước
        ↓
Phí niêm yết hàng năm                              ← nguồn thu chính, từ tháng 9
        ↓
Certified Kit / nhượng quyền nhẹ
```

**Về nguồn khách:** bốn nguồn, không phải một. Glow đẩy chéo tập khách sẵn có. **Quảng cáo Facebook, TikTok, Google chạy theo bán kính là nguồn chủ lực giai đoạn đầu**, vì SEO cần thời gian. SEO tự sinh trang theo quận/phường xây dần để hạ chi phí lấy khách về sau. Cuối cùng là biển hiệu, Google Maps, và chính mật độ điểm trong khu dân cư.

---

## 2. Sản phẩm & bảng giá

Bảng giá đi theo **hai giai đoạn có chủ đích**, không phải một bảng cố định.

| Dịch vụ | **Spa nhận** | Giá lẻ Pha 1 | Giá lẻ Pha 2 | Giá trong gói |
|---|---|---|---|---|
| Gội sạch thư giãn | **49K** | 49K | 59K | 49K |
| Gội Premium — cặp dầu gội/xả cao cấp | **69K** | 69K | 85K | 69K |
| **Gội đầu dưỡng sinh** | **149K** | 149K | **179K** | **149K** |
| Chăm sóc da cơ bản | **169K** | 169K | 199K | 169K |

Ba điều đọc ra từ bảng này:

- **Spa luôn nhận đúng một mức, ký từ Pha 1 và không đổi.** Họ không bị giảm thu ở bất kỳ tình huống nào.
- **Ở Pha 1 mình không lấy đồng nào** — giá khách trả bằng đúng giá spa nhận. Đây là điều kiện để mời được 20 spa đầu tiên khi mạng lưới chưa chứng minh được gì.
- **Từ Pha 2, phần nâng thêm của giá lẻ là lãi của mình.** Còn giá trong gói giữ nguyên mức ra mắt, nên bán gói là hòa vốn.

### 2.1. Vì sao đi hai giai đoạn

Giá ra mắt thấp để **mở mạng lưới nhanh và ký được giá tốt với spa**. Giá lẻ nâng khoảng 20% đúng lúc ra mắt gói mua trước, và giá gói giữ nguyên ở mức ra mắt.

Thông điệp bán hàng vì thế rất gọn: *"Giá ra mắt sắp hết. Mua gói để giữ giá cũ."* Khách đã quen mức 149K trong ba tháng pilot, nên khi giá lẻ lên 179K thì gói 149K là mức họ đã biết và đã tin, không phải một con số mới phải cân nhắc.

Mức spa nhận không đổi qua hai pha. Việc nâng giá lẻ là để tạo phần biên cho mình và tạo khoảng cách cho gói, không phải để chia lại với spa — nên khi đàm phán hợp đồng Pha 1 cần nói rõ điều này ngay từ đầu, kèm kỳ hạn 12 tháng.

### 2.2. Ba nguyên tắc bắt buộc khi nâng giá

**1. Công bố ngay từ ngày đầu rằng đây là giá ra mắt có thời hạn.** Ghi rõ trên web, trên menu, trong mọi quảng cáo: *"Giá ra mắt mạng lưới, áp dụng đến hết tháng X."* Nói trước thì việc nâng giá là một cam kết được giữ đúng, và tạo được áp lực mua sớm ngay trong giai đoạn pilot.

**2. Nâng giá phải đi kèm nâng chất lượng ở dịch vụ chủ lực.** Dưỡng sinh 149K/45 phút thành 179K/60 phút. Chênh 30K vừa đủ trả cho 15 phút thêm. Nâng giá mà giữ nguyên dịch vụ thì khách cũ cảm thấy bị lừa.

**3. Giá lẻ phải là giá bán thật.** Mọi thông điệp so sánh giá đều dựa trên một mức giá đang thực sự bán được.

> **Ngưỡng tự kiểm:** giữ ít nhất 30% doanh thu đến từ khách mua lẻ. Luật sư rà điều khoản khuyến mại và giá so sánh trước chiến dịch đầu tiên.

### 2.3. Bốn điểm khóa trong quy cách dịch vụ

- **Dưỡng sinh là 45 phút ở giá ra mắt, 60 phút ở giá chính thức.** Đừng hứa thời lượng mà giá không nuôi được — spa sẽ tự cắt và khách đổ lỗi cho mình.
- **Sản phẩm gói Premium do spa tự mua theo danh mục được duyệt.** Mình quy định tiêu chuẩn và danh sách sản phẩm đạt chuẩn, spa tự nhập. Vì mình không bán hàng cho spa nên việc kiểm soát dựa vào khách hàng bí mật, không dựa vào đơn hàng.
- **Đổi tên gói 69K.** "Gội cặp" đứng cạnh "Gội sạch" sẽ bị hiểu là gội cho hai người. Gọi là **"Gội Premium — cặp dầu gội/xả cao cấp"**, ghi rõ *"1 người"* trên menu.
- **Gói rẻ nhất chỉ mở khung giờ vắng** (9h–16h thứ Hai đến thứ Sáu). Đây là gói lấp ghế trống, không phải gói phục vụ giờ đông.

**Chăm sóc da vào sau và vào hẹp.** Gội đầu dễ chuẩn hóa, chăm sóc da thì không — khách có da dầu, da khô, da nhạy cảm, da mụn. Giai đoạn đầu chỉ một quy trình tối giản: **làm sạch → massage nhẹ → mask → dưỡng ẩm.** Không nặn mụn, không peel, không laser, không máy móc. Càng ít bước càng ít sự cố.

---

## 3. Gói mua trước — cơ chế giữ khách

Khách mua trước 10 hoặc 20 buổi và **được giữ nguyên giá ra mắt**, trong khi giá lẻ đã nâng lên.

Đây là cơ chế giữ khách mạnh nhất trong ngành dịch vụ lặp lại: khách đã trả tiền thì sẽ quay lại, và quay lại đúng vào mạng lưới. Nó cũng là dòng tiền trả trước, rất quý với một mô hình tự bỏ vốn.

### 3.1. Bán lẻ có lãi, bán gói lấy tiền trước

Spa nhận cùng một mức trong cả hai trường hợp. Khác nhau nằm ở phần mình giữ.

| Một buổi dưỡng sinh | Khách lẻ | Khách mua gói |
|---|---|---|
| Khách trả | 179.000 | **149.000** — bằng đúng giá ra mắt |
| **Spa nhận** | **149.000** | **149.000** |
| **Mình giữ** | **30.000** | 0 |

**Bán lẻ là chỗ có lãi.** Spa đã ký mức 149K từ Pha 1 và giữ nguyên mức đó, nên toàn bộ 30K nâng thêm về mình. Đây là lý do phải ký giá với spa từ sớm và ký kỳ hạn đủ dài.

**Bán gói là hòa vốn, đổi lấy hai thứ khác:**

1. **Tiền trước.** Một gói 10 buổi dưỡng sinh là 1,49 triệu vào tài khoản ngay, tiêu dần trong sáu tháng. Với mô hình tự bỏ vốn thì đây là nguồn vốn lưu động không phải đi vay.
2. **Khách bị neo vào mạng lưới.** Đã trả tiền cho 10 buổi thì sẽ quay lại đủ 10 lần, và quay lại qua Zalo GlowBeautyPass chứ không đi chỗ khác.

Vì gói không sinh lãi nên **tỷ trọng bán lẻ là chỉ số phải theo dõi sát**. Ngưỡng ở Mục 2 — giữ ít nhất 30% doanh thu từ khách mua lẻ — không chỉ là chuyện giá niêm yết trung thực, mà là điều kiện để mảng dịch vụ có lãi.

Nhìn từ phía spa thì không có gì phải cân nhắc: khách lẻ hay khách gói đều mang về 149K, đúng mức họ đã đồng ý. Không có xung đột lợi ích nào phải dàn xếp.

**Buổi trong gói dùng ở khung giờ vắng** (9h–16h thứ Hai đến thứ Sáu). Đây là chỗ spa có nhiều ghế trống nhất, nên gói vừa là tiền trả trước vừa là cách lấp giờ chết.

### 3.2. Bốn điểm khóa trong thiết kế gói

| Vấn đề | Cách xử lý |
|---|---|
| Hạn dùng | 6 tháng cho gói 10 buổi, 12 tháng cho gói 20. Nhắc khách khi còn 30 ngày |
| Dùng ở đâu | Toàn mạng lưới, không khóa vào một spa — đây là điểm khác biệt so với gói của spa lẻ |
| Đối soát với spa | Tổng đài xác nhận từng lượt, thanh toán theo chu kỳ tuần hoặc nửa tháng |
| Spa rời mạng lưới | Buổi còn lại chuyển sang spa khác, không hoàn tiền — ghi rõ trong điều khoản |

**Kế toán và pháp lý:** tiền bán gói ghi nhận theo số buổi đã dùng, phần chưa dùng để ở khoản dự phòng. Luật sư dựng điều khoản bán gói và cấu trúc dòng tiền trước khi bán gói đầu tiên.

### 3.3. Thời điểm bật

**Ra mắt gói và nâng giá lẻ cùng một ngày, ngay sau cổng ngày 90.** Hai việc phải đi đôi: nâng giá trước mà chưa có gói thì chỉ là tăng giá trần trụi; ra gói trước khi nâng giá thì mất hiệu ứng chênh lệch.

Điều kiện bắt buộc là tỷ lệ spa giữ đúng giá niêm yết đã đạt ngưỡng 90% ở cổng ngày 90.

### 3.4. Ưu đãi riêng của từng điểm

Chạy song song với gói, không thay thế. Mỗi spa tự chọn ưu đãi riêng, miễn là có ít nhất một — đây là điều kiện tham gia mạng lưới:

- Tặng kèm dịch vụ: ủ tóc, thêm 10 phút massage vai gáy, cắt tỉa mái
- Tặng kèm sản phẩm hoặc đồ uống
- Ưu đãi riêng khung giờ vắng

**Ưu đãi luân phiên hằng tháng.** Mỗi tháng tổng đài đẩy một bộ ưu đãi mới — lý do để khách mở tin nhắn thay vì quên mất mạng lưới.

### 3.5. Khi spa huỷ lịch

Tổng đài đặt lại điểm khác và spa nhận thẻ vàng. Ba thẻ vàng thì tụt hạng hiển thị. Với khách đang dùng gói thì mức độ nghiêm trọng cao hơn — huỷ lịch của người đã trả tiền trước là lỗi nặng, xử lý ở mức thẻ đỏ nếu lặp lại.

---

## 4. Cấu trúc pháp nhân

*Không phải tư vấn pháp lý — cần luật sư xác nhận.*

**GlowBeautyPass nên là pháp nhân riêng, không nằm trong Glow.** Khi đã ấn định giá, ấn định quy trình, kiểm tra đối tác, môi giới đặt lịch — đó là dấu hiệu của chuỗi hoặc nhượng quyền, không phải nền tảng quảng cáo. Trộn vào Glow là làm yếu lập luận "chỉ là bên kết nối, không phải nhà cung cấp dịch vụ" mà Glow đang giữ trên 3–4 thị trường.

Tách pháp nhân, chia sẻ hạ tầng công nghệ và nguồn khách qua hợp đồng dịch vụ nội bộ. **Làm việc này trước khi ký spa đầu tiên**, vì hợp đồng đối tác phải đứng tên đúng pháp nhân ngay từ bản đầu.

---

## 5. Thứ tự kiếm tiền

Thu phí gia nhập hay phí setup trước khi chứng minh mang được khách sẽ **lọc ngược**: spa đông khách không đóng phí, spa chịu đóng là spa đang ế.

| Thứ tự | Nguồn thu | Bật khi nào | Ghi chú |
|---|---|---|---|
| 1 | **Không thu gì** | Tháng 1–3 | Giá khách trả bằng giá spa nhận. Đổi lại spa nhận giá chuẩn, quy trình chuẩn, kiểm tra định kỳ, đánh giá công khai |
| 2 | **Chênh lệch giá lẻ** | Tháng 4 | Nâng giá lẻ, giữ nguyên mức spa nhận. Nguồn thu đầu tiên |
| 3 | **Phí niêm yết hàng năm** | Tháng 9–12 | Nguồn thu ổn định và có thể dự báo |
| 4 | **Certified Kit** | Năm 2 | Bán khi spa tự muốn nâng cấp, theo đơn đặt trước |

### 5.1. Phí niêm yết hàng năm

Mình bán **suất hiển thị, luồng đặt lịch từ tổng đài, và quyền dùng nhãn**. Ba điều kiện phải đủ trước khi bật:

1. **Thương hiệu đã có sức kéo.** Khách chủ động tìm "GlowBeautyPass" thay vì tình cờ thấy.
2. **Có số liệu lịch đã chuyển cho từng spa.** Tổng đài đã sẵn có dữ liệu này.
3. **Đã có danh sách chờ.** Chừng nào còn phải đi mời spa thì chưa thu được phí. Khi spa xếp hàng xin vào thì phí niêm yết tự nhiên bán được.

| Tầng | Phí/năm | Quyền lợi |
|---|---|---|
| Standard | Miễn phí | Có mặt trong danh bạ, giữ giá chuẩn, hiển thị theo khoảng cách |
| Verified | 3–6tr | Ưu tiên hiển thị trong quận, huy hiệu |
| **Certified** | **9–15tr** | Đồng bộ setup, dùng sản phẩm đạt chuẩn, hiển thị đầu trang, độc quyền khu vực nhỏ |

Thu theo năm chứ không theo tháng: hợp hành vi chủ spa nhỏ, giảm chi phí thu tiền, và tạo chu kỳ gia hạn — mỗi lần gia hạn là một lần mình đưa số liệu ra và nâng tầng.

> **Nguyên tắc xếp hạng, ghi vào hợp đồng ngay từ bản đầu:** điểm đánh giá quyết định thứ tự hiển thị, phí chỉ quyết định tầng quyền lợi. Spa tụt dưới ngưỡng đánh giá thì mất suất hiển thị và được hoàn phần phí còn lại. Đây là thứ giữ cho danh bạ đáng tin trong mắt khách.

---

## 6. Phần mềm

Không cần phần mềm đặt lịch đầy đủ — tổng đài chạy trên Zalo, phần mềm chỉ đỡ phía sau.

### 6.1. Web giai đoạn 1

- Bản đồ và bộ lọc theo khoảng cách
- Trang chi tiết spa: ảnh, menu giá niêm yết, ưu đãi riêng của điểm đó, giờ mở cửa, đánh giá có ảnh
- **Nút nhắn Zalo GlowBeautyPass** làm nút hành động chính, kèm nút gọi qua số chuyển tiếp
- Trang riêng cho từng quận/phường phục vụ SEO
- Mua gói, tra cứu số buổi còn lại, xem ưu đãi đang có

### 6.2. Công cụ cho tổng đài — phần dev đáng đầu tư nhất

- Tích hợp zca-js, chia tải nhiều tài khoản, giới hạn nhịp gửi
- **Lưu toàn bộ hội thoại về cơ sở dữ liệu riêng**, không phụ thuộc vào tài khoản Zalo
- Bảng trống lịch của từng spa, cập nhật đầu ngày
- Hàng đợi hội thoại, trừ buổi trong gói, chặn đặt gói vào giờ cao điểm
- Mẫu tin nhắn theo kịch bản, ghi nhận kết quả từng ca
- Nhắc khi một hội thoại sắp chạm ngưỡng cam kết thời gian

### 6.3. Bảng điều khiển cho spa

```
THÁNG NÀY
· 63 lịch tổng đài chuyển tới
· 47 lịch đã hoàn thành
· 12 lượt dùng gói mua trước
· 1.240 lượt xem trang
· Điểm đánh giá 4.8 (37 lượt)
```

### 6.4. Kiểm soát chất lượng — ba lớp

- **Khách hàng bí mật** — mỗi spa tối thiểu 1 lượt/tháng trong pilot, sau đó 1 lượt/quý. Kiểm tra đúng giá, đúng thời lượng, sản phẩm gói Premium có nằm trong danh mục được duyệt không, và có áp dụng ưu đãi đã đăng ký không. Vì mình không bán hàng cho spa nên đây là **cách kiểm soát duy nhất** với gói Premium.
- **Dữ liệu tổng đài** — spa từ chối lịch nhiều, huỷ nhiều, hoặc khách phản hồi xấu thì tụt hạng ngay.
- **Đánh giá có ảnh, xác thực số điện thoại** — chống đánh giá giả, và là kênh phát hiện vi phạm giá nhanh nhất.

**Tận dụng lại từ Glow:** hệ thống đánh giá, kiểm duyệt nội dung tự động, cơ chế thẻ vàng/thẻ đỏ, SEO tự sinh trang theo quận, năng lực chạy quảng cáo, đội chăm sóc khách hàng.

---

## 7. Lộ trình

### Pha 0 — Chuẩn bị (Tuần 1–4)

- Chọn **một quận** mật độ dân cư hoặc văn phòng cao. Khảo sát thực địa 40–60 spa, lọc còn 20.
- **Dựng hạ tầng Zalo trên zca-js**: nhiều tài khoản chia tải theo cụm spa, giới hạn nhịp gửi, **lưu toàn bộ hội thoại về cơ sở dữ liệu riêng**, mở sẵn Zalo OA chính thức làm kênh dự phòng.
- **Chatbot mời spa tham gia.** Bot chủ động nhắn Zalo từng spa trong danh sách khảo sát, giới thiệu mô hình, trả lời câu hỏi thường gặp, chốt lịch hẹn gặp trực tiếp cho nhân sự phát triển đối tác. Không dùng biểu mẫu đăng ký — chủ spa nhỏ không điền biểu mẫu, nhưng có trả lời tin nhắn.
- Chạy kịch bản mời với nhịp gửi thấp và độ trễ ngẫu nhiên, theo dõi từng tài khoản.
- Dựng quy trình tổng đài: kịch bản tin nhắn, bảng trống lịch, cam kết thời gian, phân ca. Chạy thử nội bộ trước khi mở cho khách.
- Viết quy trình chuẩn cho 3 dịch vụ đầu (gội sạch, Premium, dưỡng sinh): thời lượng, từng bước, sản phẩm, câu thoại, ảnh minh hoạ. Quay video hướng dẫn.
- **Lập danh mục sản phẩm đạt chuẩn cho gói Premium** — vài cặp dầu gội/xả cụ thể spa được phép dùng, kèm khoảng giá tham khảo. Spa tự nhập, mình không bán và không ôm tồn kho.
- Khóa dạng rút gọn của tên trên biển hiệu và trong app (logo lớn kèm **GBP** hoặc **Glow Beauty**) trước khi in biển đầu tiên.
- Trang giới thiệu mạng lưới.

### Pha 1 — Pilot (Tháng 1–3)

**Phạm vi:** 1 quận, 15–20 spa, 3 dịch vụ, **không thu phí nào từ spa**.

- Kết nạp theo **cụm**, không rải: 20 điểm trong 1 quận. Mật độ là điều kiện để tổng đài luôn tìm được chỗ trống cho khách mua gói ở Pha 2.
- **Ký sẵn mức giá spa nhận cho buổi trong gói ngay ở hợp đồng đầu tiên**, kỳ hạn 12 tháng. Đây là việc quan trọng nhất khi kết nạp — mức này quyết định toàn bộ biên của gói ở Pha 2. Kèm ít nhất một ưu đãi riêng của spa.
- **Quảng cáo là nguồn khách chính**, chạy theo bán kính quanh cụm spa, kết hợp đẩy chéo từ tập khách Glow.
- Tổng đài chạy bằng người thật, ghi lại mọi hội thoại để rút kịch bản cho giai đoạn tự động hóa.
- Khách hàng bí mật toàn bộ spa, tối thiểu 1 lượt/tháng/spa.

**Cổng go/no-go ngày 90:**

| Chỉ số | Ngưỡng đạt | Nếu không đạt |
|---|---|---|
| **Lịch chốt thành công/spa/tháng** | **≥ 40** | Nguồn khách hoặc tỷ lệ chốt không đủ |
| Tỷ lệ hội thoại chốt được lịch | ≥ 55% | Kịch bản sai hoặc spa không có chỗ |
| Chi phí quảng cáo cho một lịch chốt | ≤ 35.000đ | Không có đường về hòa vốn |
| Phản hồi dưới 5 phút | ≥ 90% | Thiếu người hoặc quy trình chưa chuẩn |
| **Khách quay lại đặt lần 2 trong 45 ngày** | **≥ 30%** | Dưới 20% thì chưa có lý do quay lại |
| **Tỷ lệ spa giữ đúng giá niêm yết** | **≥ 90%** | Lời hứa thương hiệu không đứng được |
| Điểm đánh giá trung bình | ≥ 4,6 | Quy trình chưa chặt hoặc chọn sai spa |

**Ba câu hỏi thật sự của pilot:**

1. Khách có chịu nhắn một đầu mối trung gian thay vì nhắn thẳng spa không?
2. Khách có quay lại qua tổng đài không?
3. Spa có giữ đúng giá khi mình không cầm tiền không?

> Câu thứ ba là quan trọng nhất: cam kết đúng giá là thứ phân biệt mạng lưới này với một danh bạ thông thường.

### Pha 2 — Giữ khách & mở rộng (Tháng 4–6)

- Mở rộng lên 3 quận, mục tiêu 60 spa. Đủ mật độ để khách mua gói luôn tìm được chỗ trong khung giờ vắng.
- **Nâng giá lẻ lên bảng giá chính thức và ra mắt gói mua trước trong cùng một ngày.** Gói 10 và 20 buổi cho cả bốn dịch vụ, chỉ dùng khung giờ vắng, trần 30% số chỗ giờ vắng mỗi spa.
- Bắt đầu tự động hóa tổng đài — chatbot xử lý luồng lặp lại, người can thiệp ca khó.
- Ra mắt bảng điều khiển cho spa.

**Cổng go/no-go tháng 6:** ≥ 300 gói đã bán; **tỷ lệ buổi đã dùng sau 60 ngày ≥ 40%**; **doanh thu từ khách mua lẻ vẫn ≥ 30%**; **tỷ lệ spa từ chối buổi gói < 15%**; chi phí tổng đài mỗi lịch ≤ 3.000đ; tỷ lệ spa rời mạng lưới < 15%/quý.

### Pha 3 — Bật doanh thu từ spa (Tháng 7–12)

- Bật **phí niêm yết hàng năm** ba tầng, có kỳ chuyển tiếp và số liệu chứng minh: *"Năm nay tổng đài chuyển cho chị 740 lịch."*
- Đưa spa Certified vào cam kết giữ chỗ giờ vắng cố định cho khách mua gói.
- Mở thành phố thứ hai chỉ khi thành phố một đã đạt 150+ spa và dương dòng tiền.

### Pha 4 — Năm 2

**Certified Kit** (biển hiệu, menu, khăn, tạp dề, khay dụng cụ, chai lọ, mùi hương, bố trí không gian, quy trình chuẩn, mã QR đánh giá) bán theo đơn đặt trước. Mở rộng đa thành phố, nhượng quyền nhẹ đầy đủ.

---

## 8. Phụ lục — thuật ngữ

| Thuật ngữ | Nghĩa trong tài liệu này |
|---|---|
| **Zalo GlowBeautyPass** | Tài khoản Zalo duy nhất khách nhắn để đặt lịch cho cả mạng lưới |
| **Tổng đài** | Đội nhân sự vận hành tài khoản Zalo đó — nhận yêu cầu, hỏi spa, xác nhận lịch |
| **Khung giờ vắng** | 9h–16h thứ Hai đến thứ Sáu, lúc spa nhiều ghế trống nhất |
| **Cổng go/no-go** | Bộ chỉ số phải đạt mới được sang giai đoạn sau; không đạt thì sửa hoặc dừng |
| **Khách hàng bí mật** | Người được thuê đóng vai khách để kiểm tra spa có làm đúng cam kết không |
| **Certified Kit** | Bộ nhận diện và trang bị chuẩn bán cho spa muốn nâng cấp toàn diện |
| **Nhượng quyền nhẹ** | Cấp nhãn và tiêu chuẩn nhưng không sở hữu, không điều hành cửa hàng |
| **zca-js** | Thư viện không chính thức cho phép lập trình gửi/nhận tin nhắn Zalo |
| **Zalo OA** | Tài khoản Zalo chính thức dành cho doanh nghiệp |
| **Ví trả trước** | Khái niệm pháp lý về việc giữ tiền khách trả trước, chịu quản lý riêng |
