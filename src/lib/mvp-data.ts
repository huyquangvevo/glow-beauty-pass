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
  serviceIds: string[];
}

export interface MVPReview {
  initial: string;
  name: string;
  phoneMask?: string;
  serviceUsed?: string;
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

const SNAPSHOT_SERVICES_MAP: Record<string, string[]> = {
  'an-nhien-duong-sinh-cau-giay': ['goi-sach', 'duong-sinh', 'massage-body', 'combo-goi-da'],
  'moc-tra-beauty-trung-hoa': ['goi-sach', 'goi-dau-cap', 'cham-soc-da', 'combo-goi-da', 'triet-long'],
  'bach-cuc-hair-spa-duy-tan': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body'],
  'la-que-duong-sinh-quan-hoa-bang': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'combo-goi-da'],
  'sen-vang-beauty-care-tran-thai-tong': ['goi-sach', 'cham-soc-da', 'combo-goi-da', 'triet-long'],
  'huong-thao-duoc-to-hieu': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'combo-goi-da'],
  'ngoc-lan-thao-moc-hoang-quoc-viet': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'cham-soc-da'],
  'tam-an-duong-tam-xuan-thuy': ['goi-sach', 'duong-sinh', 'massage-body', 'combo-goi-da'],
  'thu-gian-pho-nguyen-khang': ['goi-sach', 'massage-body', 'combo-goi-da', 'duong-sinh'],
  'yen-nhien-thao-vien-chua-ha': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body'],
  'glow-care-tran-dang-ninh': ['goi-sach', 'cham-soc-da', 'combo-goi-da', 'triet-long'],
  'moc-mien-spa-vu-pham-ham': ['goi-sach', 'duong-sinh', 'massage-body', 'cham-soc-da'],
  'nha-truc-hair-relax-trung-kinh': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'combo-goi-da'],
  'thien-duong-spa-pham-van-dong': ['goi-sach', 'massage-body', 'combo-goi-da', 'triet-long'],
  'an-khang-duong-sinh-le-van-luong': ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'combo-goi-da'],
};

const REALISTIC_REVIEWS = [284, 412, 195, 326, 458, 167, 312, 520, 189, 476, 385, 215, 340, 268, 395];
const REALISTIC_RATINGS = [4.9, 4.8, 4.9, 4.8, 4.9, 4.9, 4.8, 5.0, 4.7, 4.9, 4.9, 4.8, 4.8, 4.9, 4.9];

const PHOTO_ROTATIONS = [
  ['/spas/spa_thumb_1.jpg', '/banners/banner_spa_ambiance.jpg', '/banners/banner_herbal_wash.jpg'],
  ['/spas/spa_thumb_2.jpg', '/banners/banner_neck_massage.jpg', '/banners/banner_spa_ambiance.jpg'],
  ['/spas/spa_thumb_3.jpg', '/banners/banner_herbal_wash.jpg', '/banners/banner_spa_ambiance.jpg'],
  ['/spas/spa_thumb_4.jpg', '/banners/banner_spa_ambiance.jpg', '/banners/banner_neck_massage.jpg'],
  ['/spas/spa_thumb_5.jpg', '/banners/banner_neck_massage.jpg', '/banners/banner_herbal_wash.jpg'],
  ['/banners/banner_herbal_wash.jpg', '/spas/spa_thumb_1.jpg', '/banners/banner_spa_ambiance.jpg'],
  ['/banners/banner_neck_massage.jpg', '/spas/spa_thumb_2.jpg', '/banners/banner_herbal_wash.jpg'],
  ['/banners/banner_spa_ambiance.jpg', '/spas/spa_thumb_4.jpg', '/banners/banner_neck_massage.jpg'],
];

const SNAPSHOT_SPAS: MVPSpa[] = (snapshotData.spas || []).map((s: any, idx: number) => {
  const slug = s.slug || s.id;
  const serviceIds = SNAPSHOT_SERVICES_MAP[slug] || [
    'goi-sach',
    'duong-sinh',
    idx % 2 === 0 ? 'massage-body' : 'goi-dau-cap',
    idx % 3 === 0 ? 'cham-soc-da' : 'combo-goi-da',
  ];

  return {
    id: slug,
    name: s.name,
    ward: s.ward || 'Cầu Giấy',
    district: s.district || 'Cầu Giấy',
    city: 'hn' as const,
    cityName: 'Hà Nội',
    lat: s.latitude,
    lng: s.longitude,
    rating: REALISTIC_RATINGS[idx % REALISTIC_RATINGS.length],
    reviews: REALISTIC_REVIEWS[idx % REALISTIC_REVIEWS.length],
    dist: `${(0.4 + (idx * 0.2)).toFixed(1).replace('.', ',')} km`,
    open: true,
    tier: (s.tier === 'CERTIFIED' ? 'Certified' : 'Verified') as 'Certified' | 'Verified',
    today: s.openHours ? `Hôm nay ${s.openHours}` : 'Hôm nay 09:00 - 21:30',
    hours: [
      { d: 'T2 - T6', t: s.openHours || '09:00 - 21:30' },
      { d: 'T7 - CN', t: s.openHours || '09:00 - 21:30' },
    ],
    address: s.address,
    photos: PHOTO_ROTATIONS[idx % PHOTO_ROTATIONS.length],
    serviceIds,
  };
});

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
    reviews: 428,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh'],
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
    reviews: 586,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'cham-soc-da', 'combo-goi-da'],
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
    rating: 4.8,
    reviews: 312,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'cham-soc-da', 'combo-goi-da', 'triet-long'],
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
    reviews: 245,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'combo-goi-da'],
  },
  {
    id: 'co-ba-saigon-q1',
    name: 'Cô Ba Sài Gòn Dưỡng Sinh',
    ward: 'Bến Thành',
    district: 'Quận 1',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.7712,
    lng: 106.6934,
    rating: 4.9,
    reviews: 672,
    dist: '0,6 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:30',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:30' },
      { d: 'T7 - CN', t: '08:30 - 22:00' },
    ],
    address: '88 Lê Thị Hồng Gấm, P. Bến Thành, Quận 1, TP.HCM',
    photos: [
      '/spas/spa_thumb_1.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'cham-soc-da'],
  },
  {
    id: 'hoa-su-phu-nhuan',
    name: 'Hoa Sứ Hair & Head Spa',
    ward: 'Phú Nhuận',
    district: 'Phú Nhuận',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.7967,
    lng: 106.689,
    rating: 4.8,
    reviews: 388,
    dist: '1,8 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 08:30 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '08:30 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:30' },
    ],
    address: '64 Phan Xích Long, P. 2, Phú Nhuận, TP.HCM',
    photos: [
      '/spas/spa_thumb_2.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'combo-goi-da', 'triet-long'],
  },
  {
    id: 'la-tra-quan-10',
    name: 'Lá Trà Dưỡng Sinh Spa',
    ward: 'Quận 10',
    district: 'Quận 10',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.7725,
    lng: 106.6685,
    rating: 4.9,
    reviews: 450,
    dist: '2,2 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:30' },
    ],
    address: '492 Sư Vạn Hạnh, P. 12, Quận 10, TP.HCM',
    photos: [
      '/spas/spa_thumb_3.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'triet-long', 'combo-goi-da'],
  },
  {
    id: 'ngoc-thao-tan-binh',
    name: 'Ngọc Thảo Beauty & Relax',
    ward: 'Tân Bình',
    district: 'Tân Bình',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.8015,
    lng: 106.654,
    rating: 4.7,
    reviews: 295,
    dist: '3,5 km',
    open: true,
    tier: 'Verified',
    today: 'Hôm nay 09:00 - 20:30',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 20:30' },
      { d: 'T7 - CN', t: '09:00 - 21:00' },
    ],
    address: '120 Cộng Hòa, P. 12, Tân Bình, TP.HCM',
    photos: [
      '/spas/spa_thumb_4.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'cham-soc-da', 'triet-long'],
  },
  {
    id: 'saigon-relax-q7',
    name: 'Sài Gòn Relax Head Spa',
    ward: 'Tân Phú',
    district: 'Quận 7',
    city: 'hcm',
    cityName: 'TP.HCM',
    lat: 10.738,
    lng: 106.7112,
    rating: 4.8,
    reviews: 364,
    dist: '4,1 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 08:30 - 21:30',
    hours: [
      { d: 'T2 - T6', t: '08:30 - 21:30' },
      { d: 'T7 - CN', t: '08:30 - 22:00' },
    ],
    address: '175 Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP.HCM',
    photos: [
      '/spas/spa_thumb_5.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'cham-soc-da', 'combo-goi-da'],
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
    reviews: 415,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'combo-goi-da'],
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
    reviews: 520,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body'],
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
    rating: 4.7,
    reviews: 198,
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh'],
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
    rating: 4.8,
    reviews: 376,
    dist: '0,9 km',
    open: true,
    tier: 'Certified',
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
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'cham-soc-da', 'triet-long', 'combo-goi-da'],
  },
  {
    id: 'may-trang-son-tra',
    name: 'Mây Trắng Head Spa',
    ward: 'Sơn Trà',
    district: 'Sơn Trà',
    city: 'dn',
    cityName: 'Đà Nẵng',
    lat: 16.0745,
    lng: 108.244,
    rating: 4.8,
    reviews: 284,
    dist: '1,8 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:00' },
      { d: 'T7 - CN', t: '09:00 - 21:00' },
    ],
    address: '55 Phạm Văn Đồng, P. An Hải Bắc, Sơn Trà, Đà Nẵng',
    photos: [
      '/spas/spa_thumb_4.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'combo-goi-da'],
  },
  {
    id: 'song-han-duong-sinh-hai-chau',
    name: 'Sông Hàn Dưỡng Sinh Spa',
    ward: 'Hải Châu',
    district: 'Hải Châu',
    city: 'dn',
    cityName: 'Đà Nẵng',
    lat: 16.0695,
    lng: 108.2255,
    rating: 4.9,
    reviews: 492,
    dist: '0,5 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:30',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:30' },
      { d: 'T7 - CN', t: '08:30 - 22:00' },
    ],
    address: '28 Bạch Đằng, P. Thạch Thang, Hải Châu, Đà Nẵng',
    photos: [
      '/spas/spa_thumb_1.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'cham-soc-da', 'combo-goi-da'],
  },
  {
    id: 'an-tra-thanh-khe',
    name: 'An Trà Thảo Mộc Head Spa',
    ward: 'Thanh Khê',
    district: 'Thanh Khê',
    city: 'dn',
    cityName: 'Đà Nẵng',
    lat: 16.064,
    lng: 108.1965,
    rating: 4.8,
    reviews: 328,
    dist: '1,5 km',
    open: true,
    tier: 'Verified',
    today: 'Hôm nay 08:30 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '08:30 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:00' },
    ],
    address: '240 Điện Biên Phủ, P. Chính Gián, Thanh Khê, Đà Nẵng',
    photos: [
      '/spas/spa_thumb_2.jpg',
      '/banners/banner_herbal_wash.jpg',
      '/banners/banner_spa_ambiance.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'cham-soc-da', 'triet-long'],
  },
  {
    id: 'bien-ngoc-ngu-hanh-son',
    name: 'Biển Ngọc Relax Spa',
    ward: 'Ngũ Hành Sơn',
    district: 'Ngũ Hành Sơn',
    city: 'dn',
    cityName: 'Đà Nẵng',
    lat: 16.0545,
    lng: 108.2435,
    rating: 4.8,
    reviews: 265,
    dist: '2,6 km',
    open: true,
    tier: 'Certified',
    today: 'Hôm nay 09:00 - 21:00',
    hours: [
      { d: 'T2 - T6', t: '09:00 - 21:00' },
      { d: 'T7 - CN', t: '08:30 - 21:30' },
    ],
    address: '96 Nguyễn Văn Thoại, P. Mỹ An, Ngũ Hành Sơn, Đà Nẵng',
    photos: [
      '/spas/spa_thumb_5.jpg',
      '/banners/banner_spa_ambiance.jpg',
      '/banners/banner_neck_massage.jpg',
    ],
    serviceIds: ['goi-sach', 'goi-dau-cap', 'duong-sinh', 'massage-body', 'combo-goi-da', 'triet-long'],
  },
];

export const MVP_REVIEWS: MVPReview[] = [
  {
    initial: 'T',
    name: 'Thu Trang (Cầu Giấy, HN)',
    phoneMask: '0989***123',
    serviceUsed: 'Gội đầu sạch 39K',
    stars: '★★★★★',
    when: 'Hôm qua',
    text: 'Đúng 39.000đ không phát sinh thêm một xu nào! Lúc đầu mình cũng sợ bị phụ thu tiền sấy tạo kiểu hay tinh dầu dưỡng tóc, nhưng thanh toán đúng y giá niêm yết. KTV gội 2 nước sạch gàu, massage huyệt thái dương rất êm tay.',
    photos: 2,
    verifiedPhone: true,
  },
  {
    initial: 'N',
    name: 'Ngọc Ánh (Quận 1, TP.HCM)',
    phoneMask: '0912***886',
    serviceUsed: 'Gội dưỡng sinh 149K',
    stars: '★★★★★',
    when: '3 ngày trước',
    text: 'Cực kỳ thích ở điểm không bị chèo kéo mua thẻ liệu trình 10-20 buổi như mấy spa khác. Bạn kỹ thuật viên làm chuẩn 65 phút, chu đáo từ khâu đắp mắt thảo dược đến ngâm chân nước ấm. Phòng sạch sẽ thơm nức mùi sả chanh.',
    photos: 2,
    verifiedPhone: true,
  },
  {
    initial: 'H',
    name: 'Hoàng Nam (Thanh Xuân, HN)',
    phoneMask: '0978***456',
    serviceUsed: 'Gội dưỡng sinh 149K',
    stars: '★★★★★',
    when: '5 ngày trước',
    text: 'Dân IT ngồi máy tính cả ngày cổ vai gáy cứng đơ, ghé làm gói 149K xong nhẹ cả người. Đặt qua Zalo tầm 3 phút là có bạn tổng đài nhắn xác nhận giữ chỗ liền, đến đọc tên là vào giường làm luôn không phải đợi.',
    photos: 1,
    verifiedPhone: true,
  },
  {
    initial: 'G',
    name: 'Hương Giang (Hải Châu, ĐN)',
    phoneMask: '0905***779',
    serviceUsed: 'Combo gội + da 199K',
    stars: '★★★★★',
    when: '1 tuần trước',
    text: 'Combo 199K tính ra quá hời: vừa gội dưỡng sinh vừa được chăm sóc da mặt, hút dầu thừa đắp mặt nạ cấp ẩm. Nước gội bồ kết cô đặc nấu thật chứ không dùng hoá chất hương liệu xốp bọt. Chắc chắn sẽ ủng hộ lâu dài.',
    photos: 2,
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
];

export const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';
export const formatShortPrice = (n: number) => Math.round(n / 1000) + 'K';
