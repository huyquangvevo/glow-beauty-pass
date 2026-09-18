import { MVPReview, MVPSpa } from './mvp-data';

interface ReviewTemplate {
  name: string;
  phonePrefix: string;
  phoneSuffix: string;
  stars: 4 | 5;
  category: 'shampoo' | 'herbal' | 'massage' | 'skin' | 'wax' | 'service';
  daysAgo: number;
  photoCount: number;
  textVi: string;
  textEn: string;
  textKo: string;
  serviceUsedVi: string;
  serviceUsedEn: string;
  serviceUsedKo: string;
}

const REVIEW_POOL: ReviewTemplate[] = [
  {
    name: 'Ngọc Ánh',
    phonePrefix: '0912',
    phoneSuffix: '886',
    stars: 5,
    category: 'herbal',
    daysAgo: 2,
    photoCount: 2,
    serviceUsedVi: 'Gội dưỡng sinh 149K',
    serviceUsedEn: 'Herbal Head Spa 149K',
    serviceUsedKo: '허브 헤드스파 149K',
    textVi: 'Cực kỳ thích ở điểm không bị chèo kéo mua thẻ liệu trình 10-20 buổi như mấy spa khác. Bạn kỹ thuật viên làm chuẩn 65 phút, chu đáo từ khâu đắp mắt thảo dược đến ngâm chân nước ấm. Phòng sạch sẽ thơm nức mùi sả chanh.',
    textEn: 'Loved that there was zero pushy upselling for package deals. The technician gave a full 65-minute treatment, very attentive from herbal eye mask to warm foot bath. Clean room with a relaxing lemongrass scent.',
    textKo: '패키지 강매나 추가 권유가 전혀 없어서 정말 편했어요. 65분 코스 꽉 채워서 정성껏 해주시고, 허브 안대와 따뜻한 족욕까지 완벽했습니다. 룸도 레몬그라스 향 솔솔 나고 쾌적해요.',
  },
  {
    name: 'Thu Trang',
    phonePrefix: '0989',
    phoneSuffix: '123',
    stars: 5,
    category: 'shampoo',
    daysAgo: 3,
    photoCount: 1,
    serviceUsedVi: 'Gội đầu cặp 59K',
    serviceUsedEn: 'Couple Shampoo 59K',
    serviceUsedKo: '커플 샴푸 케어 59K',
    textVi: 'Đúng giá 59.000đ không phát sinh thêm phụ phí sấy tóc hay tinh dầu. Nước gội ấm vừa phải, gối đỡ cổ êm ái không bị mỏi hay ướt cổ áo. Bạn KTV massage huyệt thái dương rất nhẹ nhàng dễ chịu.',
    textEn: 'Exactly 59,000 VND with no hidden blow-dry or hair serum fees. Water temp was perfect, soft neck pillow so clothes never got wet. Gentle temple massage was super soothing.',
    textKo: '정찰제 59,000동 그대로 추가 비용 전혀 없었어요. 물 온도도 딱 맞고 목 받침이 푹신해서 옷에 물 한 방울 안 튀었습니다. 관자놀이 마사지도 아주 시원했어요.',
  },
  {
    name: 'Hoàng Nam',
    phonePrefix: '0978',
    phoneSuffix: '456',
    stars: 5,
    category: 'massage',
    daysAgo: 5,
    photoCount: 0,
    serviceUsedVi: 'Massage body 199K',
    serviceUsedEn: 'Full Body Massage 199K',
    serviceUsedKo: '바디 전신 마사지 199K',
    textVi: 'Mình làm văn phòng ngồi máy tính nhiều nên vai gáy lúc nào cũng ê ẩm. Ghé làm 60 phút massage đá nóng bấm huyệt xong người nhẹ bẫng. Đặt qua Zalo tầm 2 phút là có nhân viên gọi xác nhận lịch ngay.',
    textEn: 'Office worker with constant stiff shoulders here. 60-minute hot stone acupressure completely relieved the pain. Booking via Zalo took just 2 minutes for immediate confirmation.',
    textKo: '사무직이라 목과 어깨가 항상 결렸는데, 60분 핫스톤 마사지 받고 몸이 날아갈 듯 가벼워졌어요. 잘로(Zalo) 예약 후 2분 만에 바로 확정되어 편리했습니다.',
  },
  {
    name: 'Mai Phương',
    phonePrefix: '0966',
    phoneSuffix: '892',
    stars: 5,
    category: 'herbal',
    daysAgo: 6,
    photoCount: 2,
    serviceUsedVi: 'Gội dưỡng sinh 149K',
    serviceUsedEn: 'Herbal Head Spa 149K',
    serviceUsedKo: '허브 헤드스파 149K',
    textVi: 'Không gian tĩnh lặng, mở nhạc thiền êm dịu giúp xả stress cực tốt. Thích nhất là không phải mang tiền mặt hay chuyển khoản lòng vòng, giá niêm yết minh bạch rõ ràng ngay từ trên hệ thống Glow Beauty Pass.',
    textEn: 'Calm ambiance with soothing meditation music. Best part was full transparent pricing on Glow Beauty Pass—no awkward tipping or confusion at checkout.',
    textKo: '조용하고 아늑한 분위기에 은은한 명상 음악 덕분에 힐링 제대로 했어요. 글로우 뷰티 패스에서 정찰제로 안내된 가격 그대로라 결제도 깔끔했습니다.',
  },
  {
    name: 'Bích Ngọc',
    phonePrefix: '0903',
    phoneSuffix: '418',
    stars: 4,
    category: 'skin',
    daysAgo: 7,
    photoCount: 1,
    serviceUsedVi: 'Combo gội + da 199K',
    serviceUsedEn: 'Head Spa & Facial 199K',
    serviceUsedKo: '헤드스파 + 페이셜 콤보 199K',
    textVi: 'Trưa tranh thủ 1 tiếng nghỉ ngơi ghé gội đầu và đắp mặt nạ, đúng giờ chuẩn chỉ không bị trễ nải giờ làm việc. Phòng hơi đông một chút vào giờ trưa nhưng các bạn KTV vẫn rất niềm nở và chu đáo.',
    textEn: 'Squeezed in a 1-hour lunch break for head spa & facial mask. On-time service with no delay for work. A bit crowded around noon, but the technicians remained very friendly and attentive.',
    textKo: '점심시간 1시간 동안 헤드스파와 페이셜 팩 받았는데 시간 약속 칼같이 지켜주셔서 업무에 지장 없었어요. 점심때 손님이 좀 많았지만 직원분들이 무척 친절하셨습니다.',
  },
  {
    name: 'Quốc Huy',
    phonePrefix: '0915',
    phoneSuffix: '336',
    stars: 5,
    category: 'massage',
    daysAgo: 9,
    photoCount: 0,
    serviceUsedVi: 'Massage body 199K',
    serviceUsedEn: 'Body Therapy 199K',
    serviceUsedKo: '바디 테라피 199K',
    textVi: 'Massage trị liệu chuẩn chỉ, bấm huyệt sâu đúng chỗ đau mỏi ở bả vai và thắt lưng. Dịch vụ chăm sóc khách hàng phản hồi cực kỳ lịch sự và nhanh chóng.',
    textEn: 'Proper therapeutic massage hitting the right spots on sore shoulders and lower back. Customer service was polite and responsive.',
    textKo: '어깨 결림과 허리 뭉친 곳을 정확하게 짚어주는 정통 지압 마사지였습니다. 고객 응대도 신속하고 정중해서 기분 좋았어요.',
  },
  {
    name: 'Thanh Thảo',
    phonePrefix: '0943',
    phoneSuffix: '562',
    stars: 5,
    category: 'shampoo',
    daysAgo: 10,
    photoCount: 1,
    serviceUsedVi: 'Gội đầu cặp 59K',
    serviceUsedEn: 'Couple Shampoo 59K',
    serviceUsedKo: '커플 샴푸 59K',
    textVi: 'Khăn và bồn gội cực kỳ thơm sạch, gối đỡ cổ êm ái. Dầu gội cặp mùi thơm lưu hương đến tận ngày hôm sau. 59K mà chất lượng thế này là quá tuyệt vời.',
    textEn: 'Fresh clean towels and wash basins with comfortable neck support. The premium shampoo aroma lasted well into the next day. Outstanding quality for just 59K.',
    textKo: '타월과 샴푸대가 정말 깨끗하고 목 받침도 편했습니다. 프리미엄 샴푸 향기가 다음날까지 은은하게 남네요. 59K에 이 정도 퀄리티면 대만족입니다.',
  },
  {
    name: 'Hương Giang',
    phonePrefix: '0905',
    phoneSuffix: '779',
    stars: 5,
    category: 'skin',
    daysAgo: 12,
    photoCount: 2,
    serviceUsedVi: 'Combo gội + da 199K',
    serviceUsedEn: 'Head Spa & Facial 199K',
    serviceUsedKo: '헤드스파 + 페이셜 199K',
    textVi: 'Combo 199K tính ra quá hời: vừa gội dưỡng sinh vừa được chăm sóc da mặt, hút dầu thừa đắp mặt nạ cấp ẩm. Nước gội thảo dược cô đặc nấu thật chứ không dùng hoá chất xốp bọt. Chắc chắn sẽ quay lại.',
    textEn: 'The 199K combo is incredible value: herbal head spa plus facial cleansing, sebum extraction, and hydrating mask. Genuine herbal brew rather than chemical foam. Will definitely return.',
    textKo: '199K 콤보는 진짜 가성비 대박이에요. 허브 헤드스파에 피부 모공 케어와 수분 마스크팩까지 한 번에 해결됩니다. 인공 거품제가 아닌 진짜 허브 달인 물이라 좋았어요.',
  },
  {
    name: 'Minh Tú',
    phonePrefix: '0936',
    phoneSuffix: '214',
    stars: 5,
    category: 'service',
    daysAgo: 14,
    photoCount: 0,
    serviceUsedVi: 'Gội dưỡng sinh 149K',
    serviceUsedEn: 'Herbal Head Spa 149K',
    serviceUsedKo: '허브 헤드스파 149K',
    textVi: 'Đặt một lần là xong, không phải gọi từng nơi hỏi giá. Giá niêm yết minh bạch, chi nhánh nào cũng tuân thủ đúng chuẩn dịch vụ của hệ thống Glow Beauty Pass.',
    textEn: 'Booked once and done without calling around to check prices. Transparent pricing, and every branch strictly maintains the Glow Beauty Pass service standards.',
    textKo: '일일이 전화해서 가격 물어볼 필요 없이 원스톱으로 예약 완료. 투명한 정찰제에 지점마다 서비스 수준이 균일해서 믿고 방문합니다.',
  },
  {
    name: 'Khánh Linh',
    phonePrefix: '0972',
    phoneSuffix: '905',
    stars: 5,
    category: 'herbal',
    daysAgo: 16,
    photoCount: 2,
    serviceUsedVi: 'Gội dưỡng sinh 149K',
    serviceUsedEn: 'Herbal Head Spa 149K',
    serviceUsedKo: '허브 헤드스파 149K',
    textVi: 'Quy trình bấm huyệt vùng đầu và cổ vai gáy rất bài bản. Nước gội bồ kết nấu với vỏ bưởi, sả và hương nhu thơm ngát tự nhiên. Tóc gội xong tơi phồng bồng bềnh không bị bết rít.',
    textEn: 'Methodical head and neck acupressure techniques. The shampoo brewed with locust fruit, pomelo peel, lemongrass, and holy basil smells natural and divine. Hair felt voluminous and light.',
    textKo: '두피와 목, 어깨 지압 순서가 아주 체계적이었어요. 보켓 열매와 자몽 껍질, 레몬그라스로 직접 우려낸 천연 샴푸라 머릿결이 가볍고 산뜻합니다.',
  },
  {
    name: 'Thùy Dung',
    phonePrefix: '0983',
    phoneSuffix: '721',
    stars: 5,
    category: 'shampoo',
    daysAgo: 18,
    photoCount: 1,
    serviceUsedVi: 'Gội đầu sạch 39K',
    serviceUsedEn: 'Clean Shampoo 39K',
    serviceUsedKo: '클린 샴푸 39K',
    textVi: 'Giá chỉ 39K mà phục vụ nhiệt tình chu đáo như gói VIP. Gội 2 nước sạch sẽ, kỹ thuật viên gãi đúng lực không cào xước da đầu, sấy khô bôi tinh dầu dưỡng ngọn tóc cẩn thận.',
    textEn: 'Only 39K but received VIP-level care. Double-washed thoroughly, gentle scalp massage without harsh scratching, and finished with protective hair serum.',
    textKo: '39K 가격인데도 VIP 코스 못지않게 친절하게 대해주셨어요. 샴푸 두 번에 두피 자극 없이 꼼꼼히 씻겨주고 마무리 에센스까지 정성껏 발라주셨습니다.',
  },
  {
    name: 'Diệu Linh',
    phonePrefix: '0947',
    phoneSuffix: '382',
    stars: 5,
    category: 'wax',
    daysAgo: 19,
    photoCount: 1,
    serviceUsedVi: 'Triệt lông nách 99K',
    serviceUsedEn: 'Underarm Laser 99K',
    serviceUsedKo: '겨드랑이 레이저 제모 99K',
    textVi: 'Máy triệt công nghệ lạnh đời mới, đầu bắn băng tuyết êm ru không hề châm chích hay bỏng rát. KTV thao tác nhanh gọn, vệ sinh đầu máy kỹ trước khi làm cho khách.',
    textEn: 'Modern ice-cooling laser technology, smooth and virtually painless with no burning sensation. Quick, hygienic process with sanitized equipment.',
    textKo: '최신 쿨링 아이스 레이저 장비라 통증이나 따가움 없이 시원하게 잘 끝났습니다. 시술 전 기구 소독도 철저히 해주셔서 안심이었어요.',
  },
  {
    name: 'Bảo Trâm',
    phonePrefix: '0932',
    phoneSuffix: '665',
    stars: 4,
    category: 'herbal',
    daysAgo: 21,
    photoCount: 0,
    serviceUsedVi: 'Gội dưỡng sinh 149K',
    serviceUsedEn: 'Herbal Head Spa 149K',
    serviceUsedKo: '허브 헤드스파 149K',
    textVi: 'Kỹ thuật viên gội rất đều tay, đắp mặt nạ mắt thư giãn ngủ quên lúc nào không hay. Cơ sở nằm trong ngõ một chút nhưng biển hiệu rõ ràng, bên trong thiết kế ấm cúng.',
    textEn: 'Technician had steady rhythmic hands, warm herbal eye pillow put me straight to sleep. Spa is slightly tucked in an alley but well-signed and cozy inside.',
    textKo: '관리사님 손길이 부드러워서 눈 찜질하다가 스르륵 잠들었네요. 골목 안쪽에 있지만 간판이 눈에 띄고 내부는 아주 아늑했습니다.',
  },
  {
    name: 'Anh Dũng',
    phonePrefix: '0938',
    phoneSuffix: '654',
    stars: 5,
    category: 'shampoo',
    daysAgo: 23,
    photoCount: 0,
    serviceUsedVi: 'Gội đầu cặp 59K',
    serviceUsedEn: 'Couple Shampoo 59K',
    serviceUsedKo: '커플 샴푸 59K',
    textVi: 'Tiết kiệm thời gian vô cùng, không cần gọi điện hỏi còn giường không. Bấm đặt xác nhận cái là có chỗ ngay, đến đúng giờ được phục vụ chu đáo tận tình.',
    textEn: 'Saved so much time without calling back and forth. Instant confirmation, arrived on time and was served promptly with great hospitality.',
    textKo: '전화로 자리 있는지 확인할 필요 없이 원클릭 예약이라 편해요. 예약 시간 맞춰 가니 대기 없이 바로 안내받았습니다.',
  },
  {
    name: 'Phương Thảo',
    phonePrefix: '0908',
    phoneSuffix: '912',
    stars: 5,
    category: 'skin',
    daysAgo: 25,
    photoCount: 2,
    serviceUsedVi: 'Combo gội + da 199K',
    serviceUsedEn: 'Head Spa & Facial 199K',
    serviceUsedKo: '헤드스파 + 페이셜 199K',
    textVi: 'Đi làm về ghé làm combo này là chuẩn bài, vừa được gội đầu thư thái vừa được làm sạch da mặt sâu. Da mịn màng hơn hẳn, lỗ chân lông thông thoáng sạch bụi bẩn.',
    textEn: 'Best after-work treat: relaxing scalp wash combined with deep facial cleansing. Skin felt noticeably smoother with clear, refreshed pores.',
    textKo: '퇴근 후 피로 풀기에 딱 좋은 코스예요. 시원한 두피 스파에 딥 클렌징 페이셜까지 받고 나니 피부 결이 한결 매끄럽고 모공도 깨끗해졌어요.',
  },
  {
    name: 'Trần Bách',
    phonePrefix: '0918',
    phoneSuffix: '724',
    stars: 5,
    category: 'massage',
    daysAgo: 28,
    photoCount: 1,
    serviceUsedVi: 'Massage body 199K',
    serviceUsedEn: 'Body Massage 199K',
    serviceUsedKo: '바디 마사지 199K',
    textVi: 'Phòng massage riêng tư, ga gối thơm tho sạch sẽ. Bạn KTV hỏi thăm mức lực liên tục để điều chỉnh cho phù hợp. Tay nghề tốt, bấm đúng huyệt đạo.',
    textEn: 'Private room with freshly scented linens. Technician checked pressure levels regularly to match my preference. Great acupressure technique.',
    textKo: '프라이빗 룸에 베개와 시트도 뽀송뽀송했어요. 마사지 강도를 수시로 체크해주셔서 맞춤 케어를 받았습니다. 지압 실력이 상당해요.',
  },
  {
    name: 'Kim Ngân',
    phonePrefix: '0975',
    phoneSuffix: '519',
    stars: 5,
    category: 'herbal',
    daysAgo: 30,
    photoCount: 1,
    serviceUsedVi: 'Gội dưỡng sinh 149K',
    serviceUsedEn: 'Herbal Head Spa 149K',
    serviceUsedKo: '허브 헤드스파 149K',
    textVi: 'Bát thảo dược nấu sôi bốc khói nghi ngút, mùi quế hồi và vỏ bưởi ấm nồng khắp phòng. Bạn nhân viên massage vai gáy rất tận tâm, làm đủ thời gian không ăn bớt phút nào.',
    textEn: 'Steaming herbal bowl with cinnamon, star anise, and citrus notes filling the room. The neck-shoulder massage was thorough with full treatment duration respected.',
    textKo: '김이 모락모락 나는 따뜻한 허브 탕에 계피와 감귤 향이 가득했습니다. 목과 어깨 마사지도 시간 꽉 채워서 정성껏 해주셨어요.',
  },
  {
    name: 'Hải Đăng',
    phonePrefix: '0982',
    phoneSuffix: '168',
    stars: 5,
    category: 'shampoo',
    daysAgo: 33,
    photoCount: 0,
    serviceUsedVi: 'Gội đầu cặp 59K',
    serviceUsedEn: 'Couple Shampoo 59K',
    serviceUsedKo: '커플 샴푸 59K',
    textVi: 'Giá hạt dẻ mà dịch vụ rất chuyên nghiệp. Dầu gội mùi thảo mộc thơm mát dễ chịu, sấy tạo kiểu tóc tự nhiên không bị xơ khô.',
    textEn: 'Budget-friendly price yet highly professional service. Pleasant herbal scented shampoo, natural blow-dry styling without dryness.',
    textKo: '착한 가격인데도 프로페셔널한 서비스였습니다. 은은한 허브 샴푸 향도 좋고 드라이 후에도 모발이 촉촉했어요.',
  },
  {
    name: 'Lan Hương',
    phonePrefix: '0902',
    phoneSuffix: '837',
    stars: 5,
    category: 'wax',
    daysAgo: 36,
    photoCount: 1,
    serviceUsedVi: 'Triệt lông nách 99K',
    serviceUsedEn: 'Underarm Laser 99K',
    serviceUsedKo: '겨드랑이 제모 99K',
    textVi: 'Đã làm buổi thứ 3 ở cơ sở này, lông tơ mảnh hẳn đi rõ rệt. Không gian spa sạch sẽ, nhân viên lịch thiệp không ép mua thêm dịch vụ khác.',
    textEn: 'Third session at this clinic and hair regrowth is visibly thinner. Spotless clinic, polite staff without any upsell pressure.',
    textKo: '벌써 3회차 시술인데 모발이 눈에 띄게 가늘어졌어요. 매장 내부가 청결하고 추가 구매 강요 없이 편안합니다.',
  },
  {
    name: 'Đức Huy',
    phonePrefix: '0944',
    phoneSuffix: '693',
    stars: 4,
    category: 'service',
    daysAgo: 40,
    photoCount: 0,
    serviceUsedVi: 'Gội đầu cặp 59K',
    serviceUsedEn: 'Couple Shampoo 59K',
    serviceUsedKo: '커플 샴푸 59K',
    textVi: 'Dịch vụ nhanh gọn lẹ, nhân viên đón tiếp nhiệt tình dắt xe chu đáo. Lúc thanh toán đúng giá niêm yết của hệ thống không chênh lệch đồng nào.',
    textEn: 'Prompt service, staff warmly greeted and assisted with parking. Paid exact listed system price with zero discrepancy.',
    textKo: '빠르고 신속한 응대에 주차 안내까지 친절했습니다. 결제할 때도 안내된 정찰 가격 그대로였어요.',
  },
];

const PHOTO_ASSETS = [
  '/reviews/review_1.jpg',
  '/reviews/review_2.jpg',
  '/reviews/review_3.jpg',
];

// City & District localizers to append realistic locality context
function getLocalityTag(spa: MVPSpa, index: number, locale: string): string {
  const cityStr = `${spa.city || ''} ${spa.cityName || ''} ${spa.address || ''}`.toLowerCase();
  const isHcm = cityStr.includes('hcm') || cityStr.includes('hồ chí minh') || cityStr.includes('sài gòn') || cityStr.includes('saigon');
  const isDn = cityStr.includes('đà nẵng') || cityStr.includes('da nang') || spa.city === 'dn';
  const isHn = !isHcm && !isDn;

  if (locale === 'en') {
    if (isHcm) return index % 2 === 0 ? ' (HCMC)' : ' (Local Customer)';
    if (isDn) return index % 2 === 0 ? ' (Da Nang)' : ' (Local Customer)';
    return index % 2 === 0 ? ' (Hanoi)' : ' (Local Customer)';
  }

  if (locale === 'ko') {
    if (isHcm) return index % 2 === 0 ? ' (호치민)' : '';
    if (isDn) return index % 2 === 0 ? ' (다낭)' : '';
    return index % 2 === 0 ? ' (하노이)' : '';
  }

  // Vietnamese locality tags
  if (isHcm) {
    const districts = ['Quận 1', 'Quận 3', 'Bình Thạnh', 'Phú Nhuận', 'Quận 7', 'Quận 10', 'Thủ Đức'];
    const d = districts[(index + (spa.id ? spa.id.length : 0)) % districts.length];
    return index % 2 === 0 ? ` (${d}, TP.HCM)` : ` (${d})`;
  }
  if (isDn) {
    const districts = ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Ngũ Hành Sơn'];
    const d = districts[(index + (spa.id ? spa.id.length : 0)) % districts.length];
    return index % 2 === 0 ? ` (${d}, ĐN)` : ` (${d})`;
  }

  const districts = ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Hoàn Kiếm', 'Thanh Xuân', 'Tây Hồ', 'Nam Từ Liêm'];
  const d = districts[(index + (spa.id ? spa.id.length : 0)) % districts.length];
  return index % 2 === 0 ? ` (${d}, HN)` : ` (${d})`;
}

function formatWhen(daysAgo: number, locale: string): string {
  if (locale === 'en') {
    if (daysAgo <= 1) return 'Yesterday';
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 14) return '1 week ago';
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    return '1 month ago';
  }
  if (locale === 'ko') {
    if (daysAgo <= 1) return '어제';
    if (daysAgo < 7) return `${daysAgo}일 전`;
    if (daysAgo < 14) return '1주 전';
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}주 전`;
    return '1개월 전';
  }
  // Vietnamese
  if (daysAgo <= 1) return 'Hôm qua';
  if (daysAgo < 7) return `${daysAgo} ngày trước`;
  if (daysAgo < 14) return '1 tuần trước';
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} tuần trước`;
  return '1 tháng trước';
}

/**
 * Deterministically generates a unique, authentic list of 4-5 customer reviews
 * customized for a specific spa, varying names, ratings, text, and photos.
 */
export function getSpaSpecificReviews(spa: MVPSpa, locale: string = 'vi'): MVPReview[] {
  // Stable hash based on spa id/name
  const seedStr = `${spa.id || ''}_${spa.name || ''}_${spa.ward || ''}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }

  // Review count: 4 or 5 reviews
  const reviewCount = 4 + (hash % 2);

  // Pick indices from pool spread out by hash
  const pickedTemplates: ReviewTemplate[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < reviewCount; i++) {
    let index = (hash + i * 7 + (i * i * 3)) % REVIEW_POOL.length;
    let attempts = 0;
    while (usedIndices.has(index) && attempts < REVIEW_POOL.length) {
      index = (index + 1) % REVIEW_POOL.length;
      attempts++;
    }
    usedIndices.add(index);
    pickedTemplates.push(REVIEW_POOL[index]);
  }

  // Transform templates into MVPReview
  return pickedTemplates.map((tpl, i) => {
    const localityTag = getLocalityTag(spa, i, locale);
    const fullName = `${tpl.name}${localityTag}`;

    const text =
      locale === 'en' ? tpl.textEn : locale === 'ko' ? tpl.textKo : tpl.textVi;

    const serviceUsed =
      locale === 'en'
        ? tpl.serviceUsedEn
        : locale === 'ko'
        ? tpl.serviceUsedKo
        : tpl.serviceUsedVi;

    const stars = tpl.stars === 5 ? '★★★★★' : '★★★★☆';

    // Distinct photo distribution per spa
    const photoUrls: string[] = [];
    if (tpl.photoCount > 0) {
      const primaryPhotoIdx = (hash + i) % PHOTO_ASSETS.length;
      photoUrls.push(PHOTO_ASSETS[primaryPhotoIdx]);
      if (tpl.photoCount > 1) {
        const secondaryPhotoIdx = (primaryPhotoIdx + 1) % PHOTO_ASSETS.length;
        photoUrls.push(PHOTO_ASSETS[secondaryPhotoIdx]);
      }
    }

    // Days ago offset slightly by spa hash
    const daysOffset = (hash + i * 2) % 4;
    const actualDaysAgo = Math.max(1, tpl.daysAgo + daysOffset - 2);

    return {
      initial: tpl.name.trim()[0].toUpperCase(),
      name: fullName,
      phoneMask: `${tpl.phonePrefix}***${tpl.phoneSuffix}`,
      serviceUsed,
      stars,
      rating: tpl.stars,
      when: formatWhen(actualDaysAgo, locale),
      text,
      photos: photoUrls.length,
      photoUrls,
      verifiedPhone: true,
    };
  });
}
