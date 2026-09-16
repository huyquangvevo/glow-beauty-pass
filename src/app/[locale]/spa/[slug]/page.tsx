import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MVP_SPAS, MVPSpa } from '@/lib/mvp-data';
import { SUPPORTED_LOCALES } from '@/i18n/locales';
import {
  getSpaDetailMetadata,
  getSpaDetailSchema,
  getBreadcrumbSchema,
} from '@/lib/seo-helpers';
import SpaDetailClientView from './SpaDetailClientView';

interface SpaPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function findSpa(slug: string): MVPSpa | undefined {
  return (
    MVP_SPAS.find((s) => s.id === slug) ||
    MVP_SPAS.find((s) => s.name.toLowerCase().includes(slug?.replace(/-/g, ' ')))
  );
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const spa of MVP_SPAS) {
      if (spa.id) {
        params.push({ locale, slug: spa.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: SpaPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const spa = findSpa(slug);
  if (!spa) {
    return { title: 'Spa Không Tồn Tại | Glow Beauty Pass' };
  }
  return getSpaDetailMetadata(locale, spa);
}

export default async function SpaPage({ params }: SpaPageProps) {
  const { locale, slug } = await params;
  const spa = findSpa(slug);

  if (!spa) {
    notFound();
  }

  const detailSchema = getSpaDetailSchema(locale, spa);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: 'Trang chủ', path: '' },
      { name: 'Chi nhánh', path: '/spas' },
      { name: spa.name, path: `/spa/${spa.id}` },
    ],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(detailSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SpaDetailClientView spa={spa} locale={locale} />
    </>
  );
}
