import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCachedSpasAndSkus } from '@/lib/spas-service'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const todayStr = new Date().toISOString().split('T')[0]

    // Fast path: Get snapshot / warm memory data
    const { spas: cachedSpas, skus: cachedSkus } = await getCachedSpasAndSkus()
    const baseSpa = cachedSpas.find((s) => s.slug === slug)

    let spa = baseSpa
    try {
      // Query fresh slots and full reviews with 1.8s timeout
      const dbPromise = prisma.spa.findUnique({
        where: { slug },
        include: {
          slots: {
            where: { date: todayStr },
          },
          reviews: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1800)
      )
      const dbSpa = await Promise.race([dbPromise, timeoutPromise])
      if (dbSpa) {
        spa = dbSpa
      }
    } catch (e) {
      console.warn('DB slow/unavailable for spa detail, using cached fallback:', e)
    }

    if (!spa) {
      return NextResponse.json({ error: 'Spa not found' }, { status: 404 })
    }

    return NextResponse.json(
      { spa, skus: cachedSkus },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'max-age=300, stale-while-revalidate=86400',
          'Vercel-CDN-Cache-Control': 'max-age=300, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching spa details:', error)
    return NextResponse.json({ error: 'Failed to fetch spa details' }, { status: 500 })
  }
}

