import { Metadata } from 'next';
import { Suspense } from 'react';
import { MVP_SPAS } from '@/lib/mvp-data';
import { getCachedSpasAndSkus } from '@/lib/spas-service';
import {
  getSpasMetadata,
  getSpasCollectionSchema,
  getBreadcrumbSchema,
} from '@/lib/seo-helpers';
import SpasClientView from './SpasClientView';

interface SpasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SpasPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSpasMetadata(locale);
}

export default async function SpasPage({ params }: SpasPageProps) {
  const { locale } = await params;
  const { spas, services } = await getCachedSpasAndSkus();

  const spaList = spas && spas.length > 0 ? spas : MVP_SPAS;
  const collectionSchema = getSpasCollectionSchema(locale, spaList);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: 'Trang chủ', path: '' },
      { name: 'Chi nhánh', path: '/spas' },
    ],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense
        fallback={
          <div className="w-full min-h-[600px] flex items-center justify-center bg-[#FAF8F5]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40813D]" />
          </div>
        }
      >
        <SpasClientView
          locale={locale}
          initialSpas={spas}
          initialServices={services}
        />
      </Suspense>
    </>
  );
}
