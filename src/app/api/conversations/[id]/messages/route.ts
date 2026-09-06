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

    // Nếu cấu hình ZALO_WORKER_URL (Koyeb Worker), chuyển tiếp tin nhắn để gửi thực tế đến Zalo của khách
    const workerUrl = process.env.ZALO_WORKER_URL
    if (workerUrl && result.conversation.zaloChatId) {
      try {
        const secret = process.env.ZALO_WEBHOOK_SECRET || 'glow_secret_key_2026'
        await fetch(`${workerUrl}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-secret': secret,
          },
          body: JSON.stringify({
            threadId: result.conversation.zaloChatId,
            content: content.trim(),
          }),
        })
      } catch (workerErr) {
        console.warn('Could not forward message to Zalo Worker:', workerErr)
      }
    }

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
