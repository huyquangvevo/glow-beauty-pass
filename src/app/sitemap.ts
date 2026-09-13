import { MetadataRoute } from 'next'
import snapshotData from '@/lib/spas-snapshot.json'
import { SUPPORTED_LOCALES } from '@/i18n/locales'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://glowbeautypass.com'
  const currentDate = new Date()

  const entries: MetadataRoute.Sitemap = []

  // 1. Home page entries for all locales with hreflang alternates
  for (const locale of SUPPORTED_LOCALES) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          vi: `${baseUrl}/vi`,
          en: `${baseUrl}/en`,
          ko: `${baseUrl}/ko`,
        },
      },
    })
  }

  // 2. Spa Detail pages entries with hreflang alternates
  const spas = (snapshotData.spas as any[]) || []
  for (const spa of spas) {
    if (!spa.slug) continue

    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: `${baseUrl}/${locale}/spa/${spa.slug}`,
        lastModified: spa.updatedAt ? new Date(spa.updatedAt) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi/spa/${spa.slug}`,
            en: `${baseUrl}/en/spa/${spa.slug}`,
            ko: `${baseUrl}/ko/spa/${spa.slug}`,
          },
        },
      })
    }
  }

  return entries
}
