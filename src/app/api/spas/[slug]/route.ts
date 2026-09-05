import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const todayStr = new Date().toISOString().split('T')[0]

    const spa = await prisma.spa.findUnique({
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

    if (!spa) {
      return NextResponse.json({ error: 'Spa not found' }, { status: 404 })
    }

    const skus = await prisma.serviceSku.findMany()

    return NextResponse.json({ spa, skus })
  } catch (error) {
    console.error('Error fetching spa details:', error)
    return NextResponse.json({ error: 'Failed to fetch spa details' }, { status: 500 })
  }
}
