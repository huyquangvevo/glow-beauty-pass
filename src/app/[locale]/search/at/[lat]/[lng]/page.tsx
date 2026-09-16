import { redirect } from 'next/navigation';

interface SearchAtPageProps {
  params: Promise<{
    locale: string;
    lat: string;
    lng: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchAtPage({ params, searchParams }: SearchAtPageProps) {
  const { locale, lat, lng } = await params;
  const sParams = await searchParams;
  const q = typeof sParams.q === 'string' ? encodeURIComponent(sParams.q) : '';
  const queryPart = q ? `&q=${q}` : '';
  redirect(`/${locale}/spas?lat=${lat}&lng=${lng}${queryPart}`);
}
