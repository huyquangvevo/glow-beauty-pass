import { Metadata } from 'next';
import { MVP_SERVICES } from '@/lib/mvp-data';
import { getCachedSpasAndSkus } from '@/lib/spas-service';
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
  const { services, spas } = await getCachedSpasAndSkus();

  const serviceList = services && services.length > 0 ? services : MVP_SERVICES;

  // Schema.org Service Catalog JSON-LD
  const servicesCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh Mục Dịch Vụ Spa Chuẩn Hóa Glow Beauty Pass',
    description: 'Bảng giá niêm yết cố định các dịch vụ gội đầu dưỡng sinh và chăm sóc da',
    itemListElement: serviceList.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: `${s.name} với thời lượng ${s.dur || 'chuẩn hóa'}, đồng giá tại 500+ cơ sở`,
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
      <HomeClientView
        locale={locale}
        initialServices={services}
        initialSpas={spas}
      />
    </>
  );
}
