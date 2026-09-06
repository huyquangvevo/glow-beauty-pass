import { NextResponse } from 'next/server'
import { persistInboundMessage } from '@/lib/zalo/persistence'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.ZALO_WEBHOOK_SECRET || 'glow_secret_key_2026'

    // Bảo mật: Kiểm tra secret key giữa Koyeb Worker và Vercel
    if (authHeader !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 })
    }

    const body = await request.json()
    const {
      zaloChatId,
      senderZaloId,
      senderName = 'Khách Zalo',
      senderPhone,
      content,
      messageId = `zalo_${Date.now()}`,
    } = body

    if (!zaloChatId || !content) {
      return NextResponse.json({ error: 'Missing required fields: zaloChatId, content' }, { status: 400 })
    }

    const result = await persistInboundMessage({
      zaloChatId,
      senderZaloId: senderZaloId || zaloChatId,
      senderName,
      senderPhone,
      content,
      messageId,
      timestamp: new Date(),
    })

    return NextResponse.json({
      success: true,
      conversationId: result.conversation.id,
      messageId: result.message.id,
    })
  } catch (error) {
    console.error('Error in Zalo webhook handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
