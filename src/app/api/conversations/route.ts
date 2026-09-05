import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateSLA } from '@/lib/zalo/sla'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereCondition: any = {}
    if (status && status !== 'ALL') {
      whereCondition.status = status
    }

    const conversations = await prisma.conversation.findMany({
      where: whereCondition,
      orderBy: { lastMessageAt: 'desc' },
      include: {
        customer: true,
        _count: {
          select: { messages: true, bookings: true },
        },
      },
    })

    // Tính toán SLA cho từng hội thoại thời gian thực
    const items = conversations.map((conv) => {
      const sla = calculateSLA(conv.firstMessageAt, conv.firstResponseAt)
      return {
        ...conv,
        sla: {
          elapsedSeconds: sla.elapsedSeconds,
          targetSeconds: sla.targetSeconds,
          isBreached: conv.slaBreached || sla.isBreached,
          warningLevel: conv.firstResponseAt ? 'NORMAL' : sla.warningLevel,
          formattedElapsed: sla.formattedElapsed,
        },
      }
    })

    return NextResponse.json({ conversations: items })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
