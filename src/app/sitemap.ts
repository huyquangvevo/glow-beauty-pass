import { MetadataRoute } from 'next';
import { MVP_SPAS } from '@/lib/mvp-data';
import { SUPPORTED_LOCALES } from '@/i18n/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://glowbeautypass.com';
  const currentDate = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Helper for generating multilingual alternate links
  const createAlternates = (path: string = '') => ({
    languages: {
      vi: `${baseUrl}/vi${path}`,
      en: `${baseUrl}/en${path}`,
      ko: `${baseUrl}/ko${path}`,
      'x-default': `${baseUrl}/vi${path}`,
    },
  });

  // 1. Home Page (/)
  for (const locale of SUPPORTED_LOCALES) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: createAlternates(''),
    });
  }

  // 2. Spas Directory (/spas)
  for (const locale of SUPPORTED_LOCALES) {
    entries.push({
      url: `${baseUrl}/${locale}/spas`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: createAlternates('/spas'),
    });
  }

  // 3. About Page (/about)
  for (const locale of SUPPORTED_LOCALES) {
    entries.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: createAlternates('/about'),
    });
  }

  // 4. Individual Spa Detail Pages (/spa/[slug])
  for (const spa of MVP_SPAS) {
    if (!spa.id) continue;

    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: `${baseUrl}/${locale}/spa/${spa.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: createAlternates(`/spa/${spa.id}`),
      });
    }
  }

  return entries;
}
