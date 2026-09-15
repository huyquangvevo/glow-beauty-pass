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
    introButton: 'Giới thiệu →',
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
    bookZalo: 'Đặt lịch qua Zalo',
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
      viewServicesCta: 'Xem dịch vụ & giá →',
      branchesCountNotice: '100+ trung tâm · 12 tỉnh thành · Đồng giá toàn hệ thống',
    },
  },
  en: {
    appName: 'Glow Beauty Spa Network',
    brandTagline: 'Glow Beauty Spa Network',
    introButton: 'About →',
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
    bookZalo: 'Book via Zalo',
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
      viewServicesCta: 'View Services & Pricing →',
      branchesCountNotice: '100+ branches · 12 cities · Standardized nationwide',
    },
  },
  ko: {
    appName: 'Glow Beauty 스파 네트워크',
    brandTagline: 'Glow Beauty 스파 네트워크',
    introButton: '소개 →',
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
    bookZalo: 'Zalo 간편 예약',
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
      viewServicesCta: '서비스 & 가격 보기 →',
      branchesCountNotice: '100+ 개 지점 · 12개 도시 · 전국 단일 정찰제',
    },
  },
};

export function getMvpTranslation(locale: string): LocalizedMVP {
  const code = (locale === 'en' || locale === 'ko' ? locale : 'vi') as 'vi' | 'en' | 'ko';
  return MVP_TRANSLATIONS[code];
}
