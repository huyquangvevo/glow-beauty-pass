import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import '../globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LocationPrompt } from '@/components/LocationPrompt'
import { SearchProvider } from '@/context/SearchContext'
import { LocationProvider } from '@/context/LocationContext'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = 'https://glowbeautypass.com'

  const titles: Record<string, string> = {
    vi: 'Hệ Thống 10.000 Spa Đồng Giá - Glow Beauty Pass | Từ 39K',
    en: '10,000 Fixed-Price Spa Network - Glow Beauty Pass | From 39K',
    ko: '10,000개 동일 정찰제 스파 - Glow Beauty Pass | 39,000동부터',
  }

  const descriptions: Record<string, string> = {
    vi: 'Hệ thống 10.000 spa đồng giá chuẩn hóa toàn quốc. Bảng giá niêm yết từ 39K - 199K, không chèo kéo, không phụ thu, đặt lịch nhanh qua Zalo.',
    en: 'Network of 10,000 fixed-price spas nationwide. Transparent prices from 39K - 199K VND, strict quality audit, instant booking via Zalo.',
    ko: '전국 10,000개 동일 정찰제 스파 네트워크. 39,000동부터 199,000동까지 투명한 정찰제, 바가지 없는 Zalo 간편 예약.',
  }

  const title = titles[locale] || titles.vi
  const description = descriptions[locale] || descriptions.vi
  const canonicalUrl = `${baseUrl}/${locale}`

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: '%s | Glow Beauty Pass',
    },
    description,
    keywords: [
      'gội đầu dưỡng sinh cầu giấy',
      'spa dưỡng sinh hà nội',
      'massage cổ vai gáy cầu giấy',
      'glow beauty pass',
      'spa giá rẻ hà nội',
      'head spa hanoi cau giay',
      'vietnam herbal hair wash',
      '하노이 헤드스파',
      '하노이 마사지 추천',
    ],
    authors: [{ name: 'Glow Beauty Pass', url: baseUrl }],
    creator: 'Glow Beauty Pass',
    publisher: 'Glow Beauty Pass',
    formatDetection: {
      telephone: true,
      address: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        vi: `${baseUrl}/vi`,
        en: `${baseUrl}/en`,
        ko: `${baseUrl}/ko`,
        'x-default': `${baseUrl}/vi`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : locale === 'ko' ? 'ko_KR' : 'en_US',
      url: canonicalUrl,
      title,
      description,
      siteName: 'Glow Beauty Pass',
      images: [
        {
          url: '/brand/banner-meta.webp',
          width: 1200,
          height: 630,
          alt: 'Glow Beauty Pass - Mạng Lưới Spa Chuẩn Hóa Cầu Giấy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/banner-meta.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#40813D',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Glow Beauty Pass',
    url: 'https://glowbeautypass.com',
    logo: 'https://glowbeautypass.com/brand/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-359-178-342',
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['vi', 'en', 'ko'],
    },
    sameAs: [
      'https://www.facebook.com/glowbeautypass',
      'https://zalo.me/0359178342',
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Glow Beauty Pass',
    url: `https://glowbeautypass.com/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://glowbeautypass.com/${locale}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={locale} className={`scroll-smooth ${plusJakartaSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-[#17231A] selection:bg-[#40813D] selection:text-white">
        <NextIntlClientProvider messages={messages}>
          <LocationProvider>
            <SearchProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <LocationPrompt />
            </SearchProvider>
          </LocationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
