import { redirect } from 'next/navigation';

interface SpasAtPageProps {
  params: Promise<{
    locale: string;
    lat: string;
    lng: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpasAtPage({ params, searchParams }: SpasAtPageProps) {
  const { locale, lat, lng } = await params;
  const sParams = await searchParams;
  const q = typeof sParams.q === 'string' ? encodeURIComponent(sParams.q) : '';
  const queryPart = q ? `&q=${q}` : '';
  redirect(`/${locale}/spas?lat=${lat}&lng=${lng}${queryPart}`);
}
