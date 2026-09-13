import { MetadataRoute } from 'next'
import snapshotData from '@/lib/spas-snapshot.json'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://glowbeautypass.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
