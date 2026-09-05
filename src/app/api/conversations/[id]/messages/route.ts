import { NextResponse } from 'next/server'
import { persistOutboundMessage } from '@/lib/zalo/persistence'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, staffName = 'CSKH Hub Cầu Giấy', isQuickReply = false } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Nội dung tin nhắn không được để trống' }, { status: 400 })
    }

    const result = await persistOutboundMessage(id, content.trim(), staffName, isQuickReply)

    return NextResponse.json({
      success: true,
      message: result.message,
      conversation: result.conversation,
    })
  } catch (error) {
    console.error('Error sending staff message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
