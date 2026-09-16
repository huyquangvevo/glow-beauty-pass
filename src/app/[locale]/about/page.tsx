import { Metadata } from 'next';
import {
  getAboutMetadata,
  getAboutPageSchema,
  getBreadcrumbSchema,
} from '@/lib/seo-helpers';
import AboutClientView from './AboutClientView';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getAboutMetadata(locale);
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  const aboutSchema = getAboutPageSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: 'Trang chủ', path: '' },
      { name: 'Giới thiệu', path: '/about' },
    ],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClientView locale={locale} />
    </>
  );
}
