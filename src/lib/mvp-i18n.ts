export interface LocalizedMVP {
  appName: string;
  brandTagline: string;
  introButton: string;
  valuePills: [string, string, string];
  servicesTitle: string;
  selectSpaTitle: string;
  chooseBranch: string;
  mapView: string;
  listView: string;
  allCities: string;
  ratingFilter: string;
  openNowFilter: string;
  viewMap: string;
  bookNow: string;
  bookZalo: string;
  viewDetails: string;
  back: string;
  close: string;
  serviceDetails: string;
  fixedPriceNotice: string;
  searchingAt: string;
  clearFilter: string;
  noSpasFound: string;
  viewServices: string;
  certifiedBadge: string;
  verifiedBadge: string;
  standardBadge: string;

  // Detail & location filter tokens
  cities: Record<'hn' | 'hcm' | 'dn', string>;
  locationsCount: string;
  photosCount: string;
  reviewsCount: string;
  mapLocationTitle: string;
  openingHoursTitle: string;
  openNowStatus: string;
  closedStatus: string;
  todayLabel: string;
  customerReviewsTitle: string;
  verifiedCustomerBadge: string;
  menuTitle: string;
  menuNotice: string;
  getDirections: string;
  bookPriorityZalo: string;
  reviews: Array<{
    initial: string;
    name: string;
    stars: string;
    when: string;
    text: string;
    photos: number;
    verifiedPhone?: boolean;
  }>;

  // Booking Bottom Sheet tokens
  booking: {
    title: string;
    subtitle: string;
    serviceLabel: string;
    dateLabel: string;
    today: string;
    tomorrow: string;
    thu: string;
    timeLabel: string;
    fullyBooked: string;
    messagePreviewTitle: string;
    autoCopyNotice: string;
    copyBtn: string;
    copiedBtn: string;
    openZaloBtn: string;
    pasteGuide: string;
    slaNotice: string;
    confirmedTitle: string;
    confirmedAction: string;
    confirmedSla: string;
    branchLabel: string;
    serviceSummaryLabel: string;
    timeSummaryLabel: string;
    fixedPriceLabel: string;
    doneBtn: string;
    copyAgainBtn: string;
    copiedAgainBtn: string;
  };

  services: Record<
    string,
    {
      name: string;
      short: string;
      dur: string;
      badge?: string;
    }
  >;
  intro: {
    heroTag: string;
    heroTitle: string;
    heroDesc: string;
    howItWorks: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    prop1Title: string;
    prop2Title: string;
    prop3Title: string;
    slaNotice: string;
    viewServicesCta: string;
    branchesCountNotice: string;
  };
}

export const MVP_TRANSLATIONS: Record<'vi' | 'en' | 'ko', LocalizedMVP> = {
  vi: {
    appName: 'Hệ thống làm đẹp Glow Beauty',
    brandTagline: 'Hệ thống làm đẹp Glow Beauty',
    introButton: 'Giới thiệu',
    valuePills: ['100+ trung tâm toàn quốc', 'Một mức giá', 'Chất lượng đồng nhất'],
    servicesTitle: 'Dịch vụ đồng giá',
    selectSpaTitle: 'Chọn chi nhánh',
    chooseBranch: 'Chọn chi nhánh',
    mapView: 'Bản đồ',
    listView: 'Danh sách',
    allCities: 'Tất cả thành phố',
    ratingFilter: 'Đánh giá 4.8+',
    openNowFilter: 'Đang mở cửa',
    viewMap: 'Xem bản đồ',
    bookNow: 'Đặt lịch',
    bookZalo: 'Đặt lịch',
    viewDetails: 'Chi tiết',
    back: 'Quay lại',
    close: 'Đóng',
    serviceDetails: 'Chi tiết dịch vụ',
    fixedPriceNotice: 'Đồng giá tại mọi chi nhánh',
    searchingAt: 'Đang tìm kiếm tại:',
    clearFilter: 'Xoá lọc',
    noSpasFound: 'Không tìm thấy spa nào phù hợp.',
    viewServices: 'Xem dịch vụ',
    certifiedBadge: 'Chuẩn hoá SOP',
    verifiedBadge: 'Đã xác thực',
    standardBadge: 'Tiêu chuẩn',
    cities: {
      hn: 'Hà Nội',
      hcm: 'TP.HCM',
      dn: 'Đà Nẵng',
    },
    locationsCount: 'điểm',
    photosCount: 'ảnh',
    reviewsCount: 'đánh giá',
    mapLocationTitle: 'Vị trí trên bản đồ',
    openingHoursTitle: 'Giờ hoạt động',
    openNowStatus: 'Đang mở cửa',
    closedStatus: 'Đã đóng cửa',
    todayLabel: 'Hôm nay',
    customerReviewsTitle: 'Đánh giá từ khách hàng',
    verifiedCustomerBadge: '✓ Đã xác minh',
    menuTitle: 'Menu giá niêm yết',
    menuNotice: 'Chi nhánh Glow Beauty - áp dụng đồng giá toàn hệ thống.',
    getDirections: 'Chỉ đường',
    bookPriorityZalo: 'Đặt lịch ưu tiên qua Zalo',
    reviews: [
      {
        initial: 'N',
        name: 'Ngọc Ánh',
        stars: '★★★★★',
        when: '2 ngày trước',
        text: 'Đúng giá niêm yết, không bị mời mua gói hay chèo kéo. Bạn kỹ thuật viên làm chắc tay, 45 phút gội massage đủ thư giãn sau giờ làm việc.',
        photos: 2,
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: 'Thu Hà',
        stars: '★★★★☆',
        when: '1 tuần trước',
        text: 'Tổng đài xác nhận lịch nhanh trong 10 phút, đến nơi là nhân viên tiếp đón đúng giờ. Không gian sạch sẽ, mùi tinh dầu sả chanh dễ chịu.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: 'Minh Tú',
        stars: '★★★★★',
        when: '2 tuần trước',
        text: 'Nhắn Zalo một nơi là xong, không cần gọi từng spa dò hỏi giá với lịch trống. Cực kỳ tiện cho dân văn phòng.',
        photos: 2,
        verifiedPhone: true,
      },
    ],
    booking: {
      title: 'Đặt lịch ưu tiên qua Zalo',
      subtitle: 'Hệ thống Glow Beauty',
      serviceLabel: 'Dịch vụ',
      dateLabel: 'Ngày',
      today: 'Hôm nay',
      tomorrow: 'Mai',
      thu: 'T5',
      timeLabel: 'Khung giờ',
      fullyBooked: 'hết chỗ',
      messagePreviewTitle: 'Tin nhắn sẽ gửi tới tổng đài',
      autoCopyNotice: 'Hệ thống tự động copy tin nhắn khi bạn bấm mở Zalo.',
      copyBtn: 'Sao chép',
      copiedBtn: 'Đã copy',
      openZaloBtn: 'Mở Zalo GlowBeautyPass',
      pasteGuide: 'Zalo không tự điền được nội dung — dán tin nhắn đã copy vào khung chat là xong.',
      slaNotice: 'Chưa trừ tiền. Tổng đài hỏi chỗ trống rồi xác nhận lại với bạn trong 20 phút.',
      confirmedTitle: 'Đã copy tin nhắn',
      confirmedAction: 'Dán vào khung chat Zalo Glow Beauty và gửi.',
      confirmedSla: 'Tổng đài xác nhận lịch trong 20 phút.',
      branchLabel: 'Chi nhánh',
      serviceSummaryLabel: 'Dịch vụ',
      timeSummaryLabel: 'Thời gian',
      fixedPriceLabel: 'Giá niêm yết',
      doneBtn: 'Xong',
      copyAgainBtn: 'Sao chép lại tin nhắn',
      copiedAgainBtn: 'Đã sao chép lại tin nhắn!',
    },
    services: {
      'goi-sach': {
        name: 'Gội đầu sạch',
        short: 'Gội sạch',
        dur: '35 phút',
      },
      'goi-dau-cap': {
        name: 'Gội đầu dầu cặp',
        short: 'Gội dầu cặp',
        dur: '45 phút',
      },
      'duong-sinh': {
        name: 'Gội dưỡng sinh',
        short: 'Dưỡng sinh',
        dur: '60 phút',
        badge: 'ĐƯỢC CHỌN NHIỀU NHẤT',
      },
      'massage-body': {
        name: 'Massage body',
        short: 'Massage body',
        dur: '60 phút',
      },
      'cham-soc-da': {
        name: 'Chăm sóc da cơ bản',
        short: 'Chăm sóc da',
        dur: '45 phút',
      },
      'combo-goi-da': {
        name: 'Combo gội + chăm sóc da',
        short: 'Combo gội & da',
        dur: '75 phút',
      },
      'triet-long': {
        name: 'Triệt lông (1 buổi / 1 vùng)',
        short: 'Triệt lông',
        dur: '1 buổi',
      },
    },
    intro: {
      heroTag: 'HỆ THỐNG SPA TIỆN ÍCH',
      heroTitle: 'Nhắn một chỗ.\nBiết giá trước.',
      heroDesc:
        'Glow Beauty là hệ thống spa tiện ích: 100+ trung tâm cùng một bảng giá, cùng một bộ quy trình, và một Zalo duy nhất để đặt lịch.',
      howItWorks: 'CÁCH HOẠT ĐỘNG',
      step1Title: 'Chọn dịch vụ, thấy giá ngay',
      step1Desc: 'Gội dưỡng sinh ở chi nhánh nào cũng 149.000đ.',
      step2Title: 'Nhắn một Zalo duy nhất',
      step2Desc: 'Một Zalo cho toàn hệ thống Glow Beauty.',
      step3Title: 'Tổng đài xác nhận lịch',
      step3Desc: 'Dưới 20 phút, đúng chi nhánh và giờ bạn chọn.',
      prop1Title: 'Đồng giá',
      prop2Title: '1 đầu mối',
      prop3Title: 'Đánh giá thật',
      slaNotice: 'Phản hồi trong 5 phút trong giờ hành chính. Xác nhận lịch dưới 20 phút.',
      viewServicesCta: 'Xem dịch vụ & giá',
      branchesCountNotice: '100+ trung tâm · 12 tỉnh thành · Đồng giá toàn hệ thống',
    },
  },
  en: {
    appName: 'Glow Beauty Spa Network',
    brandTagline: 'Glow Beauty Spa Network',
    introButton: 'About',
    valuePills: ['100+ centers nationwide', 'Fixed price', 'Standardized quality'],
    servicesTitle: 'Standardized Services',
    selectSpaTitle: 'Select Spa Branch',
    chooseBranch: 'Choose branch',
    mapView: 'Map',
    listView: 'List',
    allCities: 'All cities',
    ratingFilter: 'Rating 4.8+',
    openNowFilter: 'Open now',
    viewMap: 'View Map',
    bookNow: 'Book Now',
    bookZalo: 'Book Now',
    viewDetails: 'Details',
    back: 'Back',
    close: 'Close',
    serviceDetails: 'Service details',
    fixedPriceNotice: 'Fixed price at all verified branches',
    searchingAt: 'Searching in:',
    clearFilter: 'Clear filter',
    noSpasFound: 'No spas found matching your criteria.',
    viewServices: 'View services',
    certifiedBadge: 'SOP Certified',
    verifiedBadge: 'Verified',
    standardBadge: 'Standard',
    cities: {
      hn: 'Hanoi',
      hcm: 'Ho Chi Minh City',
      dn: 'Da Nang',
    },
    locationsCount: 'locations',
    photosCount: 'photos',
    reviewsCount: 'reviews',
    mapLocationTitle: 'Location on map',
    openingHoursTitle: 'Opening hours',
    openNowStatus: 'Open now',
    closedStatus: 'Closed',
    todayLabel: 'Today',
    customerReviewsTitle: 'Customer reviews',
    verifiedCustomerBadge: '✓ Verified',
    menuTitle: 'Standardized Price Menu',
    menuNotice: 'Glow Beauty branches - uniform pricing system-wide.',
    getDirections: 'Directions',
    bookPriorityZalo: 'Priority Booking via Zalo',
    reviews: [
      {
        initial: 'N',
        name: 'Ngoc Anh',
        stars: '★★★★★',
        when: '2 days ago',
        text: 'Exact transparent price, zero pressure to buy packages or upselling. The therapist had skilled technique, 45 minutes of herbal wash was deeply relaxing after work.',
        photos: 2,
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: 'Thu Ha',
        stars: '★★★★☆',
        when: '1 week ago',
        text: 'Central hotline confirmed my booking within 10 minutes. Upon arrival, staff welcomed me on time. Clean ambiance and pleasant lemongrass aroma.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: 'Minh Tu',
        stars: '★★★★★',
        when: '2 weeks ago',
        text: 'Messaging one single Zalo handled everything, no need to call each individual spa to check rates and openings. Extremely convenient for busy people.',
        photos: 2,
        verifiedPhone: true,
      },
    ],
    booking: {
      title: 'Priority Booking via Zalo',
      subtitle: 'Glow Beauty Network',
      serviceLabel: 'Service',
      dateLabel: 'Date',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thu: 'Thu',
      timeLabel: 'Time slot',
      fullyBooked: 'Full',
      messagePreviewTitle: 'Message to be sent to hotline',
      autoCopyNotice: 'System will auto-copy this message when you tap Open Zalo.',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      openZaloBtn: 'Open Zalo GlowBeautyPass',
      pasteGuide: 'Zalo cannot auto-fill message — simply paste copied text into chat.',
      slaNotice: 'No upfront charge. Hotline verifies slot and confirms within 20 mins.',
      confirmedTitle: 'Message Copied',
      confirmedAction: 'Paste into Glow Beauty Zalo chat and send.',
      confirmedSla: 'Hotline will confirm your booking within 20 minutes.',
      branchLabel: 'Branch',
      serviceSummaryLabel: 'Service',
      timeSummaryLabel: 'Time',
      fixedPriceLabel: 'Fixed Price',
      doneBtn: 'Done',
      copyAgainBtn: 'Copy message again',
      copiedAgainBtn: 'Message copied to clipboard!',
    },
    services: {
      'goi-sach': {
        name: 'Clean Hair Wash',
        short: 'Clean Wash',
        dur: '35 mins',
      },
      'goi-dau-cap': {
        name: 'Dual Shampoo Wash',
        short: 'Dual Shampoo',
        dur: '45 mins',
      },
      'duong-sinh': {
        name: 'Herbal Head Spa',
        short: 'Head Spa',
        dur: '60 mins',
        badge: 'MOST POPULAR',
      },
      'massage-body': {
        name: 'Full Body Massage',
        short: 'Body Massage',
        dur: '60 mins',
      },
      'cham-soc-da': {
        name: 'Basic Facial Care',
        short: 'Facial Care',
        dur: '45 mins',
      },
      'combo-goi-da': {
        name: 'Combo Hair Wash & Facial',
        short: 'Wash & Facial',
        dur: '75 mins',
      },
      'triet-long': {
        name: 'Hair Removal (1 session / zone)',
        short: 'Hair Removal',
        dur: '1 session',
      },
    },
    intro: {
      heroTag: 'STANDARDIZED SPA NETWORK',
      heroTitle: 'One message.\nClear price upfront.',
      heroDesc:
        'Glow Beauty is a standardized spa network: 100+ centers with uniform transparent pricing, strict SOP quality, and single Zalo hotline.',
      howItWorks: 'HOW IT WORKS',
      step1Title: 'Pick service, see fixed price',
      step1Desc: 'Herbal head spa is 149,000đ at every single branch.',
      step2Title: 'Message one centralized Zalo',
      step2Desc: 'One customer hotline for the entire network.',
      step3Title: 'Fast confirmation',
      step3Desc: 'Within 20 minutes, confirmed for your chosen time and spa.',
      prop1Title: 'Fixed Price',
      prop2Title: '1 Contact',
      prop3Title: 'Real Reviews',
      slaNotice: 'Response within 5 mins during business hours. Booking confirmed in under 20 mins.',
      viewServicesCta: 'View Services & Pricing',
      branchesCountNotice: '100+ branches · 12 cities · Standardized nationwide',
    },
  },
  ko: {
    appName: 'Glow Beauty 스파 네트워크',
    brandTagline: 'Glow Beauty 스파 네트워크',
    introButton: '소개',
    valuePills: ['전국 100+ 지점', '단일 정찰제', '표준화된 품질'],
    servicesTitle: '정찰제 뷰티 케어',
    selectSpaTitle: '지점 선택하기',
    chooseBranch: '지점 선택',
    mapView: '지도',
    listView: '목록',
    allCities: '전체 도시',
    ratingFilter: '평점 4.8+',
    openNowFilter: '영업 중',
    viewMap: '지도 보기',
    bookNow: '예약하기',
    bookZalo: '예약하기',
    viewDetails: '상세보기',
    back: '뒤로가기',
    close: '닫기',
    serviceDetails: '서비스 상세',
    fixedPriceNotice: '전 지점 동일 정찰 가격',
    searchingAt: '검색 지역:',
    clearFilter: '필터 해제',
    noSpasFound: '조건에 맞는 스파를 찾을 수 없습니다.',
    viewServices: '서비스 보기',
    certifiedBadge: 'SOP 인증',
    verifiedBadge: '검증 완료',
    standardBadge: '표준 지점',
    cities: {
      hn: '하노이',
      hcm: '호치민',
      dn: '다낭',
    },
    locationsCount: '개 지점',
    photosCount: '장의 사진',
    reviewsCount: '개 리뷰',
    mapLocationTitle: '지도 상 위치',
    openingHoursTitle: '영업 시간',
    openNowStatus: '영업 중',
    closedStatus: '영업 종료',
    todayLabel: '오늘',
    customerReviewsTitle: '고객 이용 후기',
    verifiedCustomerBadge: '✓ 인증 완료',
    menuTitle: '정찰제 가격 메뉴',
    menuNotice: 'Glow Beauty 전 지점 동일한 정찰 가격이 적용됩니다.',
    getDirections: '길찾기',
    bookPriorityZalo: 'Zalo 우선 간편 예약',
    reviews: [
      {
        initial: 'N',
        name: '응옥 안 (Ngoc Anh)',
        stars: '★★★★★',
        when: '2일 전',
        text: '정찰 가격 그대로였고 회원권 강요나 추가 요금이 전혀 없었습니다. 테라피스트 실력이 훌륭해서 퇴근 후 45분간 힐링 샴푸 마사지를 편안하게 받았습니다.',
        photos: 2,
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: '투 하 (Thu Ha)',
        stars: '★★★★☆',
        when: '1주일 전',
        text: '고객센터에서 10분 만에 예약 확정을 해줬고, 도착하자마자 지체 없이 안내받았습니다. 매장이 청결하고 레몬그라스 아로마 향이 마음을 편안하게 해줍니다.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: '민 투 (Minh Tu)',
        stars: '★★★★★',
        when: '2주일 전',
        text: '개별 스파마다 일일이 전화해서 가격이나 빈자리 물어볼 필요 없이 Zalo 하나로 해결되니 너무 편리합니다. 여행자나 직장인에게 강력 추천합니다!',
        photos: 2,
        verifiedPhone: true,
      },
    ],
    booking: {
      title: 'Zalo 우선 간편 예약',
      subtitle: 'Glow Beauty 네트워크',
      serviceLabel: '서비스',
      dateLabel: '예약 날짜',
      today: '오늘',
      tomorrow: '내일',
      thu: '목',
      timeLabel: '희망 시간대',
      fullyBooked: '마감',
      messagePreviewTitle: '고객센터 전송 메시지',
      autoCopyNotice: 'Zalo 열기를 누르면 메시지가 클립보드에 자동 복사됩니다.',
      copyBtn: '복사',
      copiedBtn: '복사됨',
      openZaloBtn: 'Zalo GlowBeautyPass 열기',
      pasteGuide: 'Zalo는 내용이 자동 입력되지 않으므로, 복사된 메시지를 채팅창에 붙여넣기(Paste)만 하시면 됩니다.',
      slaNotice: '사전 결제 없음. 고객센터에서 잔여 좌석 확인 후 20분 내로 확정 안내드립니다.',
      confirmedTitle: '메시지 복사 완료',
      confirmedAction: 'Glow Beauty Zalo 채팅창에 붙여넣고 전송해 주세요.',
      confirmedSla: '고객센터에서 20분 이내로 예약을 확정해 드립니다.',
      branchLabel: '스파 지점',
      serviceSummaryLabel: '서비스',
      timeSummaryLabel: '예약 시간',
      fixedPriceLabel: '정찰 가격',
      doneBtn: '완료',
      copyAgainBtn: '메시지 다시 복사',
      copiedAgainBtn: '클립보드에 다시 복사되었습니다!',
    },
    services: {
      'goi-sach': {
        name: '클린 샴푸 케어',
        short: '클린 샴푸',
        dur: '35분',
      },
      'goi-dau-cap': {
        name: '프리미엄 샴푸 케어',
        short: '프리미엄 샴푸',
        dur: '45분',
      },
      'duong-sinh': {
        name: '두피 영양 힐링 스파',
        short: '두피 힐링',
        dur: '60분',
        badge: '가장 인기 있는 코스',
      },
      'massage-body': {
        name: '전신 릴랙스 마사지',
        short: '바디 마사지',
        dur: '60분',
      },
      'cham-soc-da': {
        name: '기본 페이셜 피부 케어',
        short: '피부 케어',
        dur: '45분',
      },
      'combo-goi-da': {
        name: '샴푸 + 페이셜 콤보',
        short: '샴푸 & 피부',
        dur: '75분',
      },
      'triet-long': {
        name: '다이오드 레이저 제모 (1회)',
        short: '레이저 제모',
        dur: '1회',
      },
    },
    intro: {
      heroTag: '표준화 스파 네트워크',
      heroTitle: '간편한 예약.\n투명한 정찰제.',
      heroDesc:
        'Glow Beauty는 전국 100여 개 엄선 스파를 동일한 정찰 가격, 엄격한 SOP 절차, 단일 Zalo 고객센터로 연결합니다.',
      howItWorks: '이용 방법',
      step1Title: '서비스 선택, 바로 가격 확인',
      step1Desc: '두피 영양 스파는 어떤 지점을 방문해도 149,000동입니다.',
      step2Title: '단 하나의 Zalo로 메시지 전송',
      step2Desc: '전국 Glow Beauty 통합 단일 Zalo 번호로 예약 접수.',
      step3Title: '빠른 예약 확정',
      step3Desc: '20분 이내에 원하는 지점과 시간대로 예약 확정 안내.',
      prop1Title: '정찰제',
      prop2Title: '단일 채널',
      prop3Title: '실제 후기',
      slaNotice: '근무 시간 내 5분 이내 응답. 20분 이내 예약 확정.',
      viewServicesCta: '서비스 & 가격 보기',
      branchesCountNotice: '100+ 개 지점 · 12개 도시 · 전국 단일 정찰제',
    },
  },
};

export function getMvpTranslation(locale: string): LocalizedMVP {
  const code = (locale === 'en' || locale === 'ko' ? locale : 'vi') as 'vi' | 'en' | 'ko';
  return MVP_TRANSLATIONS[code];
}

export function getLocalizedBookingMessage(
  locale: string,
  serviceName: string,
  priceStr: string,
  spaDisplayName: string,
  slotStr: string
): string {
  if (locale === 'en') {
    return `Hello GlowBeautyPass, I would like to book ${serviceName} (${priceStr}) at ${spaDisplayName}, ${slotStr}. Please check and confirm the slot availability for me. (Xin chào, mình muốn đặt ${serviceName} tại ${spaDisplayName}, ${slotStr})`;
  }
  if (locale === 'ko') {
    return `안녕하세요 GlowBeautyPass, ${spaDisplayName} 지점에서 ${slotStr}에 ${serviceName} (${priceStr}) 예약을 원합니다. 잔여 좌석 확인 부탁드립니다. (Xin chào, mình muốn đặt ${serviceName} tại ${spaDisplayName}, ${slotStr})`;
  }
  return `Xin chào GlowBeautyPass, mình muốn đặt ${serviceName} (${priceStr}) tại ${spaDisplayName}, ${slotStr}. Nhờ tổng đài kiểm tra chỗ trống giúp mình.`;
}

export function formatDayRange(d: string, locale: string): string {
  if (locale === 'en') {
    if (d === 'T2 - T6') return 'Mon - Fri';
    if (d === 'T7 - CN') return 'Sat - Sun';
  } else if (locale === 'ko') {
    if (d === 'T2 - T6') return '월 - 금';
    if (d === 'T7 - CN') return '토 - 일';
  }
  return d;
}

export function formatTodayHours(todayStr: string, locale: string): string {
  const timeOnly = todayStr.replace(/^Hôm nay\s*/i, '');
  const t = getMvpTranslation(locale);
  return `${t.todayLabel} ${timeOnly}`;
}
