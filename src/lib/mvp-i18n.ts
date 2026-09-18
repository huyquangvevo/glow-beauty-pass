export interface LocalizedMVP {
  appName: string;
  brandTagline: string;
  introButton: string;
  valuePills: string[];
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
  bookZaloShort: string;
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

  // Additional UI action and state tokens
  selecting: string;
  currentLocation: string;
  nearYou: string;
  locating: string;
  currentGpsTitle: string;
  clickToLocate: string;
  located: string;
  spasOffering: string;
  selectCity: string;
  viewPhotoZoom: string;
  closePhoto: string;
  mapLoadError: string;
  searchLocation: string;
  defaultCityAreas: Record<'hn' | 'hcm' | 'dn', string>;

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
    phoneMask?: string;
    serviceUsed?: string;
    stars: string;
    when: string;
    text: string;
    photos: number;
    photoUrls?: string[];
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
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneErrorNotice: string;
    contactLabel: string;
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
    appName: 'Hệ thống 500 spa đồng giá',
    brandTagline: 'Hệ thống 500 spa đồng giá',
    introButton: 'Giới thiệu',
    valuePills: ['Một mức giá', 'Chất lượng đồng nhất'],
    servicesTitle: 'Dịch vụ đồng giá',
    selectSpaTitle: 'Chọn chi nhánh',
    chooseBranch: 'Chọn chi nhánh',
    mapView: 'Bản đồ',
    listView: 'Danh sách',
    allCities: 'Tất cả thành phố',
    ratingFilter: 'Đánh giá 4.8+',
    openNowFilter: 'Đang mở cửa',
    viewMap: 'Xem bản đồ',
    bookNow: 'Đặt lịch ưu tiên',
    bookZalo: 'Đặt Zalo',
    bookZaloShort: 'Đặt',
    viewDetails: 'Chi tiết',
    back: 'Quay lại',
    close: 'Đóng',
    serviceDetails: 'Chi tiết dịch vụ',
    fixedPriceNotice: 'Đồng giá tại mọi chi nhánh',
    searchingAt: 'Đang tìm kiếm tại:',
    clearFilter: 'Xoá lọc',
    noSpasFound: 'Không tìm thấy spa nào phù hợp.',
    viewServices: 'Xem dịch vụ',
    certifiedBadge: 'Chứng nhận',
    verifiedBadge: 'Xác minh',
    standardBadge: 'Tiêu chuẩn',
    selecting: 'Đang chọn',
    currentLocation: 'Vị trí của bạn',
    nearYou: 'Gần bạn',
    locating: 'Đang tìm...',
    currentGpsTitle: 'Vị trí hiện tại: {loc}',
    clickToLocate: 'Nhấn để lấy vị trí GPS hiện tại',
    located: 'Đã định vị',
    spasOffering: 'chi nhánh có',
    selectCity: 'Chọn khu vực',
    viewPhotoZoom: 'Xem ảnh phóng to',
    closePhoto: 'Đóng xem ảnh',
    mapLoadError: 'Không thể tải bản đồ Google Maps.',
    searchLocation: 'Vị trí tìm kiếm',
    defaultCityAreas: {
      hn: 'Cầu Giấy, Hà Nội',
      hcm: 'Quận 1, TP.HCM',
      dn: 'Hải Châu, Đà Nẵng',
    },
    cities: {
      hn: 'Hà Nội',
      hcm: 'TP.HCM',
      dn: 'Đà Nẵng',
    },
    locationsCount: 'chi nhánh',
    photosCount: 'ảnh',
    reviewsCount: 'đánh giá',
    mapLocationTitle: 'Vị trí trên bản đồ',
    openingHoursTitle: 'Giờ hoạt động',
    openNowStatus: 'Đang mở cửa',
    closedStatus: 'Đã đóng cửa',
    todayLabel: 'Hôm nay',
    customerReviewsTitle: 'Đánh giá',
    verifiedCustomerBadge: 'Xác thực số điện thoại',
    menuTitle: 'Menu giá niêm yết',
    menuNotice: 'Chi nhánh Glow Beauty Pass - áp dụng đồng giá toàn hệ thống.',
    getDirections: 'Chỉ đường',
    bookPriorityZalo: 'Đặt lịch ưu tiên qua Zalo',
    reviews: [
      {
        initial: 'N',
        name: 'Ngọc Ánh',
        phoneMask: '0912***886',
        serviceUsed: 'Gội đầu cặp 59K',
        stars: '★★★★★',
        when: '2 ngày trước',
        text: 'Đúng giá niêm yết, không bị mời mua gói. Bạn kỹ thuật viên làm chắc tay, 45 phút đủ thư giãn.',
        photos: 2,
        photoUrls: ['/reviews/review_1.jpg', '/reviews/review_2.jpg'],
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: 'Thu Hà',
        phoneMask: '0989***123',
        serviceUsed: 'Gội dưỡng sinh 149K',
        stars: '★★★★☆',
        when: '1 tuần trước',
        text: 'Tổng đài xác nhận lịch nhanh, đến là có người đợi sẵn. Phòng hơi nhỏ nhưng sạch.',
        photos: 1,
        photoUrls: ['/reviews/review_3.jpg'],
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: 'Minh Tú',
        phoneMask: '0936***214',
        serviceUsed: 'Gội đầu cặp 59K',
        stars: '★★★★★',
        when: '2 tuần trước',
        text: 'Nhắn Zalo một lần là xong, không phải gọi từng nơi hỏi giá. Giá chuẩn, phục vụ chu đáo.',
        photos: 0,
        photoUrls: [],
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: 'Minh Tú (Quận 3, TP.HCM)',
        phoneMask: '0936***214',
        serviceUsed: 'Massage body 199K',
        stars: '★★★★★',
        when: '1 tuần trước',
        text: 'Nhắn Zalo một nơi là đặt được cho cả hệ thống, đi công tác Sài Gòn hay Đà Nẵng mở app lên chọn chi nhánh gần nhất là xong. Giá niêm yết minh bạch, spa nào cũng tuân thủ đúng chuẩn dịch vụ của hệ thống.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: 'Thanh Thảo (Bình Thạnh, TP.HCM)',
        phoneMask: '0943***562',
        serviceUsed: 'Gội đầu dầu cặp 59K',
        stars: '★★★★★',
        when: '2 tuần trước',
        text: 'Khăn và bồn gội cực kỳ thơm sạch, gối đỡ cổ êm ái nước không bao giờ bị chảy tràn vào áo. Dầu gội cặp mùi thơm lưu hương đến tận ngày hôm sau. 59K ở ngay trung tâm mà chất lượng thế này là quá tuyệt vời.',
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
      nameLabel: 'Tên của bạn',
      namePlaceholder: 'VD: Ngọc Ánh',
      phoneLabel: 'Số điện thoại',
      phonePlaceholder: '09xx xxx xxx',
      phoneErrorNotice: 'Nhập số điện thoại để tổng đài gọi xác nhận lịch.',
      contactLabel: 'Liên hệ',
      messagePreviewTitle: 'TIN NHẮN GỬI TỚI TỔNG ĐÀI',
      autoCopyNotice: '',
      copyBtn: 'Copy',
      copiedBtn: 'Đã copy ✓',
      openZaloBtn: 'Copy & mở Zalo Glow Beauty',
      pasteGuide: 'Zalo không tự điền được nội dung — dán tin nhắn đã copy vào khung chat là xong.',
      slaNotice: 'Chưa trừ tiền · Tổng đài xác nhận chỗ trong 15-20 phút',
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
        dur: '',
      },
      'goi-dau-cap': {
        name: 'Gội đầu dầu cặp',
        short: 'Gội dầu cặp',
        dur: '',
      },
      'duong-sinh': {
        name: 'Gội dưỡng sinh',
        short: 'Dưỡng sinh',
        dur: '',
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
        dur: '',
      },
      'combo-goi-da': {
        name: 'Combo gội + chăm sóc da',
        short: 'Combo gội & da',
        dur: '',
      },
      'triet-long': {
        name: 'Triệt lông',
        short: 'Triệt lông',
        dur: '1 buổi / 1 vùng',
      },
    },
    intro: {
      heroTag: 'HỆ THỐNG 500 SPA ĐỒNG GIÁ',
      heroTitle: 'Nhắn một chỗ.\nBiết giá trước.',
      heroDesc:
        'Glow Beauty là hệ thống 500 spa đồng giá: cùng một bảng giá niêm yết minh bạch, cùng một bộ quy trình chuẩn hóa, và một Zalo duy nhất để đặt lịch.',
      howItWorks: 'CÁCH HOẠT ĐỘNG',
      step1Title: 'Chọn dịch vụ, thấy giá ngay',
      step1Desc: 'Gội đầu sạch ở chi nhánh nào cũng 39.000đ.',
      step2Title: 'Nhắn một Zalo duy nhất',
      step2Desc: 'Một Zalo cho toàn hệ thống Glow Beauty.',
      step3Title: 'Tổng đài xác nhận lịch',
      step3Desc: 'Dưới 20 phút, đúng chi nhánh và giờ bạn chọn.',
      prop1Title: 'Đồng giá',
      prop2Title: '1 đầu mối',
      prop3Title: 'Đánh giá thật',
      slaNotice: 'Phản hồi trong 5 phút trong giờ hành chính. Xác nhận lịch dưới 20 phút.',
      viewServicesCta: 'Xem dịch vụ & giá',
      branchesCountNotice: '500+ spa toàn quốc · Đồng giá toàn hệ thống',
    },
  },
  en: {
    appName: 'Network of 500 Fixed-Price Spas',
    brandTagline: 'Network of 500 Fixed-Price Spas',
    introButton: 'About',
    valuePills: ['Fixed price', 'Standardized quality'],
    servicesTitle: 'Standardized Services',
    selectSpaTitle: 'Select Spa Branch',
    chooseBranch: 'Choose branch',
    mapView: 'Map',
    listView: 'List',
    allCities: 'All cities',
    ratingFilter: 'Rating 4.8+',
    openNowFilter: 'Open now',
    viewMap: 'View Map',
    bookNow: 'Priority Booking',
    bookZalo: 'Book Zalo',
    bookZaloShort: 'Book',
    viewDetails: 'Details',
    back: 'Back',
    close: 'Close',
    serviceDetails: 'Service details',
    fixedPriceNotice: 'Fixed price at all verified branches',
    searchingAt: 'Searching in:',
    clearFilter: 'Clear filter',
    noSpasFound: 'No spas found matching your criteria.',
    viewServices: 'View services',
    certifiedBadge: 'Certified',
    verifiedBadge: 'Verified',
    standardBadge: 'Standard',
    selecting: 'Selected',
    currentLocation: 'Your location',
    nearYou: 'Near you',
    locating: 'Locating...',
    currentGpsTitle: 'Current location: {loc}',
    clickToLocate: 'Click to get current GPS location',
    located: 'Located',
    spasOffering: 'spas offering',
    selectCity: 'Select City',
    viewPhotoZoom: 'Enlarge photo',
    closePhoto: 'Close preview',
    mapLoadError: 'Unable to load Google Maps.',
    searchLocation: 'Search location',
    defaultCityAreas: {
      hn: 'Cau Giay, Hanoi',
      hcm: 'District 1, HCMC',
      dn: 'Hai Chau, Da Nang',
    },
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
    customerReviewsTitle: 'Reviews',
    verifiedCustomerBadge: 'Phone verified',
    menuTitle: 'Fixed Price Menu',
    menuNotice: 'Glow Beauty Pass branch - uniform pricing nationwide.',
    getDirections: 'Directions',
    bookPriorityZalo: 'Priority Booking via Zalo',
    reviews: [
      {
        initial: 'N',
        name: 'Ngoc Anh',
        phoneMask: '+84 912***886',
        serviceUsed: '59K Premium Wash',
        stars: '★★★★★',
        when: '2 days ago',
        text: 'Exact listed price, no pushy upsell. The therapist had a firm technique, 45 minutes of pure relaxation.',
        photos: 2,
        photoUrls: ['/reviews/review_1.jpg', '/reviews/review_2.jpg'],
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: 'Thu Ha',
        phoneMask: '+84 989***123',
        serviceUsed: '149K Head Spa',
        stars: '★★★★☆',
        when: '1 week ago',
        text: 'Hotline confirmed the appointment quickly, staff was ready upon arrival. Room is a bit compact but very clean.',
        photos: 1,
        photoUrls: ['/reviews/review_3.jpg'],
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: 'Minh Tu',
        phoneMask: '+84 936***214',
        serviceUsed: '59K Premium Wash',
        stars: '★★★★★',
        when: '2 weeks ago',
        text: 'One Zalo message and it was all set, no need to call multiple places for prices. Standard price, attentive service.',
        photos: 0,
        photoUrls: [],
        verifiedPhone: true,
      },
      {
        initial: 'K',
        name: 'Kenji Sato (Cau Giay, Hanoi)',
        phoneMask: '+84 936***214',
        serviceUsed: '59K Premium Shampoo',
        stars: '★★★★★',
        when: '1 week ago',
        text: 'Usually tourists get charged double, but Glow Beauty Pass guarantees the exact published rate. Fresh herbal ingredients and ergonomic wash basins where water never drips on collars.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: 'A',
        name: 'Anna Schmidt (Da Nang)',
        phoneMask: '+84 943***562',
        serviceUsed: '149K Nourishing Combo',
        stars: '★★★★★',
        when: '2 weeks ago',
        text: 'Clean ambiance, pleasant herbal scents, and very attentive staff. The hot herbal eye pillow was so comfortable I fell asleep during the session. Best self-care value in Vietnam.',
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
      nameLabel: 'Your name',
      namePlaceholder: 'e.g. Jessica',
      phoneLabel: 'Phone number',
      phonePlaceholder: '09xx xxx xxx',
      phoneErrorNotice: 'Please enter your phone number to confirm appointment.',
      contactLabel: 'Contact',
      messagePreviewTitle: 'MESSAGE TO HOTLINE',
      autoCopyNotice: '',
      copyBtn: 'Copy',
      copiedBtn: 'Copied ✓',
      openZaloBtn: 'Copy & open Zalo Glow Beauty',
      pasteGuide: 'Zalo does not auto-fill — just paste the copied message into the chat.',
      slaNotice: 'No upfront payment · Confirmation within 15-20 mins',
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
        dur: '',
      },
      'goi-dau-cap': {
        name: 'Dual Shampoo Wash',
        short: 'Dual Shampoo',
        dur: '',
      },
      'duong-sinh': {
        name: 'Herbal Head Spa',
        short: 'Head Spa',
        dur: '',
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
        dur: '',
      },
      'combo-goi-da': {
        name: 'Combo Hair Wash & Facial',
        short: 'Wash & Facial',
        dur: '',
      },
      'triet-long': {
        name: 'Hair Removal',
        short: 'Hair Removal',
        dur: '1 session / 1 area',
      },
    },
    intro: {
      heroTag: '500 FIXED-PRICE SPAS',
      heroTitle: 'One message.\nClear price upfront.',
      heroDesc:
        'Glow Beauty is a network of 500 fixed-price spas with uniform transparent pricing, strict quality standards, and single Zalo hotline.',
      howItWorks: 'HOW IT WORKS',
      step1Title: 'Pick service, see fixed price',
      step1Desc: 'Clean hair wash is 39,000đ at every single branch.',
      step2Title: 'Message one centralized Zalo',
      step2Desc: 'One customer hotline for the entire network.',
      step3Title: 'Fast confirmation',
      step3Desc: 'Within 20 minutes, confirmed for your chosen time and spa.',
      prop1Title: 'Fixed Price',
      prop2Title: '1 Contact',
      prop3Title: 'Real Reviews',
      slaNotice: 'Response within 5 mins during business hours. Booking confirmed in under 20 mins.',
      viewServicesCta: 'View Services & Pricing',
      branchesCountNotice: '500+ spas nationwide · Fixed price network',
    },
  },
  ko: {
    appName: '500개 동일 정찰제 스파',
    brandTagline: '500개 동일 정찰제 스파',
    introButton: '소개',
    valuePills: ['단일 정찰제', '표준화된 품질'],
    servicesTitle: '정찰제 뷰티 케어',
    selectSpaTitle: '지점 선택하기',
    chooseBranch: '지점 선택',
    mapView: '지도',
    listView: '목록',
    allCities: '전체 도시',
    ratingFilter: '평점 4.8+',
    openNowFilter: '영업 중',
    viewMap: '지도 보기',
    bookNow: '우선 예약',
    bookZalo: 'Zalo 예약',
    bookZaloShort: '예약',
    viewDetails: '상세보기',
    back: '뒤로',
    close: '닫기',
    serviceDetails: '서비스 상세',
    fixedPriceNotice: '전국 모든 인증 지점 동일 가격',
    searchingAt: '검색 지역:',
    clearFilter: '필터 초기화',
    noSpasFound: '조건에 맞는 스파를 찾을 수 없습니다.',
    viewServices: '서비스 보기',
    certifiedBadge: '인증 스파',
    verifiedBadge: '검증 완료',
    standardBadge: '표준 제휴',
    selecting: '선택됨',
    currentLocation: '현재 위치',
    nearYou: '내 주변',
    locating: '위치 확인 중...',
    currentGpsTitle: '현재 위치: {loc}',
    clickToLocate: '현재 GPS 위치 확인',
    located: '위치 확인됨',
    spasOffering: '개 스파',
    selectCity: '지역 선택',
    viewPhotoZoom: '사진 확대',
    closePhoto: '사진 닫기',
    mapLoadError: 'Google 지도를 불러올 수 없습니다.',
    searchLocation: '검색 위치',
    defaultCityAreas: {
      hn: '하노이 꼬우저이',
      hcm: '호치민 1군',
      dn: '다낭 하이쩌우',
    },
    cities: {
      hn: '하노이',
      hcm: '호치민',
      dn: '다낭',
    },
    locationsCount: '개 지점',
    photosCount: '장',
    reviewsCount: '개 리뷰',
    mapLocationTitle: '지도 위치',
    openingHoursTitle: '영업 시간',
    openNowStatus: '영업 중',
    closedStatus: '영업 종료',
    todayLabel: '오늘',
    customerReviewsTitle: '리뷰',
    verifiedCustomerBadge: '전화번호 인증',
    menuTitle: '정찰제 가격표',
    menuNotice: 'Glow Beauty Pass 제휴점 - 전국 동일 정찰제 적용.',
    getDirections: '길찾기',
    bookPriorityZalo: 'Zalo 우선 예약',
    reviews: [
      {
        initial: 'N',
        name: '응옥 아인',
        phoneMask: '+84 912***886',
        serviceUsed: '59,000동 헤어워시',
        stars: '★★★★★',
        when: '2일 전',
        text: '정가 그대로이고 코스 권유가 전혀 없어요. 테라피스트 손압이 좋아서 45분 동안 편안하게 힐링했습니다.',
        photos: 2,
        photoUrls: ['/reviews/review_1.jpg', '/reviews/review_2.jpg'],
        verifiedPhone: true,
      },
      {
        initial: 'T',
        name: '투 하',
        phoneMask: '+84 989***123',
        serviceUsed: '149,000동 두피 스파',
        stars: '★★★★☆',
        when: '1주일 전',
        text: '고객센터에서 빠르게 예약을 확정해 주었고, 도착하니 바로 안내받았습니다. 룸은 아담하지만 매우 청결해요.',
        photos: 1,
        photoUrls: ['/reviews/review_3.jpg'],
        verifiedPhone: true,
      },
      {
        initial: 'M',
        name: '민 투',
        phoneMask: '+84 936***214',
        serviceUsed: '59,000동 헤어워시',
        stars: '★★★★★',
        when: '2주일 전',
        text: 'Zalo 메시지 한 번으로 예약 완료, 가격 물어보러 일일이 전화할 필요 없어서 편해요. 정가 준수하고 친절합니다.',
        photos: 0,
        photoUrls: [],
        verifiedPhone: true,
      },
      {
        initial: '박',
        name: '박서연 (하노이 출장자)',
        phoneMask: '+84 978***456',
        serviceUsed: '199,000동 전신 마사지',
        stars: '★★★★★',
        when: '5일 전',
        text: '베트남 출장 올 때마다 들러요. 시설 위생적이고 허브 레몬그라스 향이 은은해서 힐링 그 자체입니다. 팁 강요도 일절 없어서 한국인에게 강추합니다.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: '최',
        name: '최현우 (호치민 7군)',
        phoneMask: '+84 905***779',
        serviceUsed: '199,000동 샴푸 + 페이셜',
        stars: '★★★★★',
        when: '1주일 전',
        text: '다른 로컬 샵 가면 이것저것 옵션 붙여서 가격 뻥튀기하는데 여긴 Glow Pass 정찰제 그대로입니다. 관리사님 손압도 적당하고 아주 시원해요.',
        photos: 2,
        verifiedPhone: true,
      },
      {
        initial: '정',
        name: '정다은 (하노이 거주)',
        phoneMask: '+84 936***214',
        serviceUsed: '59,000동 프리미엄 샴푸',
        stars: '★★★★★',
        when: '1주일 전',
        text: '퇴근길에 앱으로 주변 지점 찾아서 바로 예약하고 다녀왔어요. 천연 허브 샴푸 향도 좋고 목 뒤로 물 한 방울 안 튀게 꼼꼼히 감겨줍니다.',
        photos: 1,
        verifiedPhone: true,
      },
      {
        initial: '송',
        name: '송지훈 (다낭 여행객)',
        phoneMask: '+84 943***562',
        serviceUsed: '149,000동 두피 스파 콤보',
        stars: '★★★★★',
        when: '2주일 전',
        text: '예약 응대 빠르고 가격 투명해서 부모님 모시고 가기에도 전혀 부담 없었습니다. 65분 동안 허브 안대와 발 마사지까지 완벽했어요.',
        photos: 2,
        verifiedPhone: true,
      },
    ],
    booking: {
      title: 'Zalo 간편 예약',
      subtitle: 'Glow Beauty 제휴 네트워크',
      serviceLabel: '서비스 선택',
      dateLabel: '예약 날짜',
      today: '오늘',
      tomorrow: '내일',
      thu: '목',
      timeLabel: '예약 시간',
      fullyBooked: '마감',
      nameLabel: '고객명',
      namePlaceholder: '예: 김민지',
      phoneLabel: '연락처',
      phonePlaceholder: '09xx xxx xxx',
      phoneErrorNotice: '예약 확정을 위해 전화번호를 입력해 주세요.',
      contactLabel: '연락처',
      messagePreviewTitle: '상담원 전달 메시지',
      autoCopyNotice: '',
      copyBtn: '복사',
      copiedBtn: '복사됨 ✓',
      openZaloBtn: '복사 & Zalo Glow Beauty 열기',
      pasteGuide: 'Zalo는 자동 입력되지 않으므로 채팅창에 복사된 내용을 붙여넣어 주세요.',
      slaNotice: '사전 결제 없음 · 15~20분 내 예약 확정',
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
        dur: '',
      },
      'goi-dau-cap': {
        name: '프리미엄 샴푸 케어',
        short: '프리미엄 샴푸',
        dur: '',
      },
      'duong-sinh': {
        name: '두피 영양 힐링 스파',
        short: '두피 힐링',
        dur: '',
        badge: '인기 1위',
      },
      'massage-body': {
        name: '바디 마사지',
        short: '바디 마사지',
        dur: '60분',
      },
      'cham-soc-da': {
        name: '기본 페이셜 피부 케어',
        short: '피부 케어',
        dur: '',
      },
      'combo-goi-da': {
        name: '샴푸 + 페이셜 콤보',
        short: '샴푸 & 피부',
        dur: '',
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
        'Glow Beauty는 전국 100여 개 엄선 스파를 동일한 정찰 가격, 엄격한 품질 관리, 단일 Zalo 고객센터로 연결합니다.',
      howItWorks: '이용 방법',
      step1Title: '서비스 선택, 바로 가격 확인',
      step1Desc: '클린 샴푸는 어떤 지점을 방문해도 39,000동입니다.',
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
  slotStr: string,
  guestPhone?: string,
  guestName?: string
): string {
  const phone = guestPhone?.trim() || '....';
  const name = guestName?.trim();

  if (locale === 'en') {
    return `Hi Glow Beauty, ${name ? `I'm ${name}, ` : ''}I'd like to book ${serviceName} (${priceStr}) at ${spaDisplayName}, ${slotStr}. My phone: ${phone}. Please check availability and confirm.`;
  }
  if (locale === 'ko') {
    return `안녕하세요 Glow Beauty, ${name ? `저는 ${name}입니다. ` : ''}${spaDisplayName}에서 ${serviceName} (${priceStr}), ${slotStr} 예약 문의합니다. 연락처: ${phone}. 예약 가능한지 확인 부탁드립니다.`;
  }
  return `Xin chào Glow Beauty, mình${name ? ` là ${name},` : ''} muốn đặt ${serviceName} (${priceStr}) tại ${spaDisplayName}, ${slotStr}. SĐT của mình: ${phone}. Nhờ tổng đài kiểm tra chỗ trống và gọi xác nhận giúp mình.`;
}

export function formatDayRange(d: string, locale: string): string {
  if (locale === 'en') {
    if (d === 'T2 - T6') return 'Mon - Fri';
    if (d === 'T7 - CN') return 'Sat - Sun';
    if (d === 'T2 - CN') return 'Mon - Sun';
    if (d === 'Hàng ngày') return 'Everyday';
  } else if (locale === 'ko') {
    if (d === 'T2 - T6') return '월 - 금';
    if (d === 'T7 - CN') return '토 - 일';
    if (d === 'T2 - CN') return '월 - 일';
    if (d === 'Hàng ngày') return '매일';
  }
  return d;
}

export function formatTodayHours(todayStr: string, locale: string): string {
  const timeOnly = todayStr.replace(/^(Hôm nay|Today|오늘)\s*/i, '');
  const t = getMvpTranslation(locale);
  return `${t.todayLabel} ${timeOnly}`;
}
