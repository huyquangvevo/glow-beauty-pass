import { NextResponse } from 'next/server'
import { getRealSpaDetailFromDb } from '@/lib/spas-service'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const detail = await getRealSpaDetailFromDb(slug)

    if (!detail?.spa) {
      return NextResponse.json({ error: 'Spa not found' }, { status: 404 })
    }

    return NextResponse.json(
      { spa: detail.spa, services: detail.services },
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

