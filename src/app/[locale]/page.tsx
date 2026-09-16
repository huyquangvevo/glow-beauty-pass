import { Metadata } from 'next';
import { MVP_SERVICES } from '@/lib/mvp-data';
import {
  BASE_URL,
  getHomeMetadata,
  getCanonicalUrl,
} from '@/lib/seo-helpers';
import HomeClientView from './HomeClientView';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getHomeMetadata(locale);
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Schema.org Service Catalog JSON-LD
  const servicesCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh Mục Dịch Vụ Spa Chuẩn Hóa Glow Beauty Pass',
    description: 'Bảng giá niêm yết cố định các dịch vụ gội đầu dưỡng sinh và chăm sóc da',
    itemListElement: MVP_SERVICES.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: `${s.name} với thời lượng ${s.dur || 'chuẩn quy trình SOP'}, đồng giá tại 15+ cơ sở`,
        offers: {
          '@type': 'Offer',
          price: s.price,
          priceCurrency: 'VND',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: getCanonicalUrl(locale, `/spas?service=${s.id}`),
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesCatalogSchema) }}
      />
      <HomeClientView locale={locale} />
    </>
  );
}
