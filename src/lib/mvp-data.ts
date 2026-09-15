export interface MVPService {
  id: string;
  name: string;
  short: string;
  price: number;
  dur: string;
  desc?: string;
  count: number;
  badge?: string;
  wide?: boolean;
}

export interface MVPSpa {
  id: string;
  name: string;
  ward: string;
  district?: string;
  city: 'hcm' | 'hn' | 'dn';
  cityName: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  dist: string;
  open: boolean;
  tier: 'Certified' | 'Verified' | 'Standard';
  today: string;
  hours: { d: string; t: string }[];
  address: string;
  photos: string[];
}

export interface MVPReview {
  initial: string;
  name: string;
  stars: string;
  when: string;
  text: string;
  photos: number;
  verifiedPhone?: boolean;
}

export const CITIES = [
  { id: 'hn', name: 'Hà Nội' },
  { id: 'hcm', name: 'TP.HCM' },
  { id: 'dn', name: 'Đà Nẵng' },
] as const;

export const MVP_SERVICES: MVPService[] = [
  {
    id: 'goi-sach',
    name: 'Gội đầu sạch',
    short: 'Gội sạch',
    price: 39000,
    dur: '',
    count: 148,
  },
  {
    id: 'goi-dau-cap',
    name: 'Gội đầu dầu cặp',
    short: 'Gội dầu cặp',
    price: 59000,
    dur: '',
    count: 132,
  },
  {
    id: 'duong-sinh',
    name: 'Gội dưỡng sinh',
    short: 'Dưỡng sinh',
    price: 149000,
    dur: '',
    badge: 'ĐƯỢC CHỌN NHIỀU NHẤT',
    count: 141,
  },
  {
    id: 'massage-body',
    name: 'Massage body',
    short: 'Massage body',
    price: 199000,
    dur: '60 phút',
    count: 88,
  },
  {
    id: 'cham-soc-da',
    name: 'Chăm sóc da cơ bản',
    short: 'Chăm sóc da',
    price: 169000,
    dur: '',
    count: 96,
  },
  {
    id: 'combo-goi-da',
    name: 'Combo gội + chăm sóc da',
    short: 'Combo gội + da',
    price: 199000,
    dur: '',
    count: 74,
  },
  {
    id: 'triet-long',
    name: 'Triệt lông',
    short: 'Triệt lông',
    price: 99000,
    dur: '1 buổi / 1 vùng',
    count: 52,
    wide: true,
  },
];

import snapshotData from './spas-snapshot.json';

const SNAPSHOT_SPAS: MVPSpa[] = (snapshotData.spas || []).map((s: any, idx: number) => ({
  id: s.slug || s.id,
  name: s.name,
  ward: s.ward || 'Cầu Giấy',
  district: s.district || 'Cầu Giấy',
  city: 'hn' as const,
  cityName: 'Hà Nội',
  lat: s.latitude,
  lng: s.longitude,
  rating: s.rating || 4.9,
  reviews: s.reviewCount || 42,
  dist: `${(0.4 + (idx * 0.2)).toFixed(1).replace('.', ',')} km`,
  open: true,
  tier: (s.tier === 'CERTIFIED' ? 'Certified' : 'Verified') as 'Certified' | 'Verified',
  today: s.openHours ? `Hôm nay ${s.openHours}` : 'Hôm nay 09:00 - 21:30',
  hours: [
    { d: 'T2 - T6', t: s.openHours || '09:00 - 21:30' },
    { d: 'T7 - CN', t: s.openHours || '09:00 - 21:30' },
  ],
  address: s.address,
  photos: [
    `/spas/spa_thumb_${(idx % 5) + 1}.jpg`,
    '/banners/banner_spa_ambiance.jpg',
    '/banners/banner_herbal_wash.jpg',
  ],
}));

export const MVP_SPAS: MVPSpa[] = [
  ...SNAPSHOT_SPAS,
  {
    id: 'la-xanh-cau-giay',
    name: 'Lá Xanh Spa',
    ward: 'Cầu Giấy',
    district: 'Cầu Giấy',
    city: 'hn',
    cityName: 'Hà Nội',
    lat: 21.0313,
    lng: 105.7996,
    rating: 4.9,
    reviews: 73,
    dist: '0,8 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:30' },
    ],
    address: '88 Trần Duy Hưng, P. Trung Hoà, Cầu Giấy, Hà Nội',
    photos: [
      '/spas/spa_thumb_1.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_herbal_wash.jpg',
    ],
  },
  {
    id: 'sen-thanh-q1',
    name: 'Sen Thanh Spa',
    ward: 'Quận 1',
    district: 'Quận 1',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.7735,
    lng: 106.6965,
    rating: 4.9,
    reviews: 64,
    dist: '0,8 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:00' },
      { d: 'T7 - CN', t: '08:00 - 22:00' },
    ],
    address: '42 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP.HCM',
    photos: [
      '/spas/spa_thumb_2.jpg',
      '/banners/banner_neck_massage.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
  },
  {
    id: 'huong-sen-thanh-xuan',
    name: 'Hương Sen Dưỡng Sinh',
    ward: 'Thanh Xuân',
    district: 'Thanh Xuân',
    city: 'hn',
    cityName: 'Hà Nội',
    lat: 20.9955,
    lng: 105.806,
    rating: 4.8,
    reviews: 58,
    dist: '1,5 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:00' },
      { d: 'T7 - CN', t: '09:00 - 21:00' },
    ],
    address: '12 Nguyễn Huy Tưởng, P. Thanh Xuân Trung, Thanh Xuân, Hà Nội',
    photos: [
      '/spas/spa_thumb_3.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
  },
  {
    id: 'an-nhien-q3',
    name: 'An Nhiên Beauty',
    ward: 'Quận 3',
    district: 'Quận 3',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.7841,
    lng: 106.6855,
    rating: 4.7,
    reviews: 41,
    dist: '1,6 km',
    open: true,
    tier: 'Verified',
    today: 'Hôm nay 09:00 - 20:30',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 20:30' },
      { d: 'T7 - CN', t: '09:00 - 21:00' },
    ],
    address: '118 Võ Văn Tần, P. Võ Thị Sáu, Quận 3, TP.HCM',
    photos: [
      '/spas/spa_thumb_4.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
  },
  {
    id: 'moc-lan-binh-thanh',
    name: 'Mộc Lan Dưỡng Sinh',
    ward: 'Bình Thạnh',
    district: 'Bình Thạnh',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.8039,
    lng: 106.7101,
    rating: 4.8,
    reviews: 37,
    dist: '3,2 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 08:30 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '08:30 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:00' },
    ],
    address: '25 Phan Đăng Lưu, P. 3, Bình Thạnh, TP.HCM',
    photos: [
      '/spas/spa_thumb_5.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
  },
  {
    id: 'tinh-tam-hai-ba-trung',
    name: 'Tĩnh Tâm Spa',
    ward: 'Hai Bà Trưng',
    district: 'Hai Bà Trưng',
    city: 'hn',
    cityName: 'Hà Nội',
    lat: 21.0089,
    lng: 105.8543,
    rating: 4.9,
    reviews: 58,
    dist: '2,8 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:30 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:30 - 21:00' },
      { d: 'T7 - CN', t: '09:30 - 21:00' },
    ],
    address: '31 Bà Triệu, P. Hàng Bài, Hoàn Kiếm, Hà Nội',
    photos: [
      '/spas/spa_thumb_1.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
  },
  {
    id: 'nha-goi-dau-26-dong-da',
    name: 'Nhà Gội Đầu 26',
    ward: 'Đống Đa',
    district: 'Đống Đa',
    city: 'hn',
    cityName: 'Hà Nội',
    lat: 21.0122,
    lng: 105.8272,
    rating: 4.6,
    reviews: 29,
    dist: '3,4 km',
    open: true,
    tier: 'Standard',
    today: 'Hôm nay 10:00 - 20:30',
    hours: [
      { d: 'T2 - T6', t: '10:00 - 20:30' },
      { d: 'T7 - CN', t: '10:00 - 20:30' },
    ],
    address: '26 Vũ Ngọc Phan, P. Láng Hạ, Đống Đa, Hà Nội',
    photos: [
      '/spas/spa_thumb_2.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
  },
  {
    id: 'bao-ngoc-hai-chau',
    name: 'Bảo Ngọc Beauty',
    ward: 'Hải Châu',
    district: 'Hải Châu',
    city: 'dn',
    cityName: 'Đà Nẵng',
    lat: 16.0678,
    lng: 108.2208,
    rating: 4.7,
    reviews: 33,
    dist: '0,9 km',
    open: true,
    tier: 'Verified',
    today: 'Hôm nay 08:30 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '08:30 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:00' },
    ],
    address: '104 Lê Duẩn, P. Thạch Thang, Hải Châu, Đà Nẵng',
    photos: [
      '/spas/spa_thumb_3.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
  },
  {
    id: 'may-trang-son-tra',
    name: 'Mây Trắng Spa',
    ward: 'Sơn Trà',
    district: 'Sơn Trà',
    city: 'dn',
    cityName: 'Đà Nẵng',
    lat: 16.0745,
    lng: 108.244,
    rating: 4.5,
    reviews: 24,
    dist: '2,8 km',
    open: false,
    tier: 'Standard',
    today: 'Mở lại 09:00 mai',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 20:00' },
      { d: 'T7 - CN', t: '09:00 - 21:00' },
    ],
    address: '55 Phạm Văn Đồng, P. An Hải Bắc, Sơn Trà, Đà Nẵng',
    photos: [
      '/spas/spa_thumb_4.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
  },
];

export const MVP_REVIEWS: MVPReview[] = [
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
];

export const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';
export const formatShortPrice = (n: number) => Math.round(n / 1000) + 'K';
