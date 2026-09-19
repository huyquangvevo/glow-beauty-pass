import { Metadata } from 'next';
import { MVPSpa, MVP_SERVICES } from './mvp-data';

export const BASE_URL = 'https://glowbeautypass.com';

export function getCanonicalUrl(locale: string, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const finalPath = path ? cleanPath : '';
  return `${BASE_URL}/${locale}${finalPath}`;
}

export function getHreflangAlternates(path: string = '') {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return {
    canonical: `${BASE_URL}/vi${cleanPath}`,
    languages: {
      vi: `${BASE_URL}/vi${cleanPath}`,
      en: `${BASE_URL}/en${cleanPath}`,
      ko: `${BASE_URL}/ko${cleanPath}`,
      'x-default': `${BASE_URL}/vi${cleanPath}`,
    },
  };
}

// -------------------------------------------------------------
// METADATA BUILDERS
// -------------------------------------------------------------

export function getHomeMetadata(locale: string): Metadata {
  const titles: Record<string, string> = {
    vi: 'Glow Beauty Pass - Mạng Lưới Spa Chuẩn Hóa Toàn Quốc | Đồng Giá Từ 39K',
    en: 'Glow Beauty Pass - Standardized Head Spa Network Across Vietnam | Fixed From 39K',
    ko: 'Glow Beauty Pass - 베트남 전역 엄선 스파 네트워크 | 39,000동 정찰제',
  };

  const descriptions: Record<string, string> = {
    vi: 'Mạng lưới spa dưỡng sinh chuẩn hóa hàng đầu Việt Nam. Các gói gội dưỡng sinh, massage cổ vai gáy đồng giá từ 39K - 199K, kiểm định chất lượng nghiêm ngặt, đặt lịch Zalo nhanh.',
    en: 'Standardized beauty & head spa network across Vietnam. Verified partner spas with fixed packages from 39K VND, strict quality audits, instant Zalo booking.',
    ko: '베트남 전역 엄선 스파 네트워크. 39,000동부터 시작하는 투명한 정찰제, 철저한 품질 검증, 바가지 없는 Zalo 간편 예약.',
  };

  const title = titles[locale] || titles.vi;
  const description = descriptions[locale] || descriptions.vi;
  const canonical = getCanonicalUrl(locale, '');
  const alternates = getHreflangAlternates('');

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: alternates.languages,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'Glow Beauty Pass',
      images: [
        {
          url: '/brand/banner-meta.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/banner-meta.webp'],
    },
  };
}

export function getAboutMetadata(locale: string): Metadata {
  const titles: Record<string, string> = {
    vi: 'Giới Thiệu Glow Beauty Pass - Hệ Thống Spa Chuẩn Hóa Toàn Quốc',
    en: 'About Glow Beauty Pass - Standardized Head Spa Network Across Vietnam',
    ko: 'Glow Beauty Pass 소개 - 베트남 엄선 스파 네트워크 & 안심 정찰제',
  };

  const descriptions: Record<string, string> = {
    vi: 'Tìm hiểu về Glow Beauty Pass: Quy trình chuẩn hóa 3 bước, tiêu chuẩn thẩm định hệ thống đối tác spa, cam kết đồng giá minh bạch và không phụ thu.',
    en: 'Learn about Glow Beauty Pass: 3-step standardized booking workflow, rigorous audit criteria across partner spas, transparent fixed pricing.',
    ko: 'Glow Beauty Pass 안내: 3단계 표준 예약 절차, 베트남 전역 파트너 스파의 엄격한 심사 기준, 추가 요금 없는 투명한 정찰제 보장.',
  };

  const title = titles[locale] || titles.vi;
  const description = descriptions[locale] || descriptions.vi;
  const canonical = getCanonicalUrl(locale, '/about');
  const alternates = getHreflangAlternates('/about');

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: alternates.languages,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'Glow Beauty Pass',
      images: [
        {
          url: '/brand/banner-meta.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/banner-meta.webp'],
    },
  };
}

export function getSpasMetadata(locale: string): Metadata {
  const titles: Record<string, string> = {
    vi: 'Danh Sách Spa Dưỡng Sinh Chuẩn Hóa Toàn Quốc | Bản Đồ & Đặt Lịch',
    en: 'Verified Head Spas Across Vietnam | Interactive Map & Direct Booking',
    ko: '베트남 엄선 스파 지점 찾기 | 인터랙티브 지도 & 즉시 예약',
  };

  const descriptions: Record<string, string> = {
    vi: 'Bản đồ và danh bạ các chi nhánh spa dưỡng sinh đối tác đạt chuẩn kiểm định của Glow Beauty Pass. Xem đánh giá thực tế, khoảng cách gần nhất và đặt lịch qua Zalo.',
    en: 'Interactive map and directory of certified head spas across Vietnam. Verified reviews, nearest distance calculations, transparent pricing and fast Zalo booking.',
    ko: '베트남 전역 인증 스파 위치 및 지도. 실제 고객 리뷰, 가장 가까운 거리 확인, 투명한 정찰제 및 Zalo 실시간 예약.',
  };

  const title = titles[locale] || titles.vi;
  const description = descriptions[locale] || descriptions.vi;
  const canonical = getCanonicalUrl(locale, '/spas');
  const alternates = getHreflangAlternates('/spas');

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: alternates.languages,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'Glow Beauty Pass',
      images: [
        {
          url: '/brand/banner-meta.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/banner-meta.webp'],
    },
  };
}

export function getSpaDetailMetadata(locale: string, spa: MVPSpa): Metadata {
  const locationLabel = spa.district || spa.ward || spa.cityName;
  const titles: Record<string, string> = {
    vi: `${spa.name} (${locationLabel}) - Dịch Vụ Chuẩn Hóa Đồng Giá | Glow Beauty Pass`,
    en: `${spa.name} (${spa.cityName || 'Vietnam'}) - Certified Head Spa | Glow Beauty Pass`,
    ko: `${spa.name} (${spa.cityName || '베트남'}) - 엄선 인증 스파 | Glow Beauty Pass`,
  };

  const descriptions: Record<string, string> = {
    vi: `Đặt lịch tại ${spa.name} (${spa.address}). Cơ sở đối tác chuẩn ${spa.tier === 'Certified' ? 'kiểm định' : 'thẩm định'} của Glow Beauty Pass. Đánh giá ${spa.rating}/5 sao (${spa.reviews} review). Đồng giá từ 39K, đặt qua Zalo.`,
    en: `Book your session at ${spa.name} (${spa.address}). ${spa.tier} partner of Glow Beauty Pass. Rating: ${spa.rating}/5 (${spa.reviews} reviews). Fixed rates from 39K VND via Zalo.`,
    ko: `${spa.name} (${spa.address}) 예약 안내. Glow Beauty Pass 엄선 인증 스파, 평점 ${spa.rating}/5 (${spa.reviews}개 리뷰). 39,000동 투명 정찰제 및 Zalo 간편 예약.`,
  };

  const title = titles[locale] || titles.vi;
  const description = descriptions[locale] || descriptions.vi;
  const canonical = getCanonicalUrl(locale, `/spa/${spa.id}`);
  const alternates = getHreflangAlternates(`/spa/${spa.id}`);

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages: alternates.languages,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'Glow Beauty Pass',
      images: [
        {
          url: spa.photos[0] || '/brand/banner-meta.webp',
          width: 1200,
          height: 630,
          alt: spa.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [spa.photos[0] || '/brand/banner-meta.webp'],
    },
  };
}

// -------------------------------------------------------------
// SCHEMA.ORG JSON-LD BUILDERS (Google Rich Results Compliant)
// -------------------------------------------------------------

export function getBreadcrumbSchema(items: { name: string; path?: string }[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path !== undefined ? getCanonicalUrl(locale, item.path) : undefined,
    })),
  };
}

export function getAboutPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Giới Thiệu Glow Beauty Pass',
    url: getCanonicalUrl(locale, '/about'),
    description:
      'Mạng lưới spa dưỡng sinh chuẩn hóa đầu tiên tại Cầu Giấy, Hà Nội với quy trình thẩm định chất lượng nghiêm ngặt và đồng giá từ 39K.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Glow Beauty Pass',
      url: `${BASE_URL}/${locale}`,
    },
  };
}

export function getSpasCollectionSchema(locale: string, spas: MVPSpa[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Danh Sách Spa Đối Tác Glow Beauty Pass',
    url: getCanonicalUrl(locale, '/spas'),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: spas.length,
      itemListElement: spas.map((spa, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'BeautySalon',
          '@id': getCanonicalUrl(locale, `/spa/${spa.id}`),
          name: spa.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: spa.address,
            addressLocality: spa.cityName,
            addressRegion: spa.district || spa.ward || spa.cityName,
            addressCountry: 'VN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: spa.lat,
            longitude: spa.lng,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: spa.rating,
            reviewCount: spa.reviews,
            bestRating: '5',
            worstRating: '1',
          },
          priceRange: '₫₫',
        },
      })),
    },
  };
}

export function getSpaDetailSchema(locale: string, spa: MVPSpa) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': getCanonicalUrl(locale, `/spa/${spa.id}`),
    name: spa.name,
    image: spa.photos.map((p) => (p.startsWith('http') ? p : `${BASE_URL}${p}`)),
    address: {
      '@type': 'PostalAddress',
      streetAddress: spa.address,
      addressLocality: spa.cityName,
      addressRegion: spa.district || spa.ward || spa.cityName,
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: spa.lat,
      longitude: spa.lng,
    },
    telephone: '+84-359-178-342',
    priceRange: '49.000₫ - 149.000₫',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '08:30',
        closes: '21:30',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: spa.rating,
      reviewCount: spa.reviews,
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dịch Vụ Đồng Giá Glow Beauty Pass',
      itemListElement: MVP_SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.desc || `${s.name} theo quy trình chuẩn hóa`,
        },
        price: s.price,
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
      })),
    },
  };
}
