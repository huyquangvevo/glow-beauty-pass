import { NextResponse } from 'next/server'
import { mockGateway } from '@/lib/zalo/mock-gateway'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      senderPhone = '0988' + Math.floor(100000 + Math.random() * 900000),
      senderName = 'Khách Thử Nghiệm',
      content = 'Chào shop, em muốn đặt gội đầu dưỡng sinh chiều nay khoảng 14h30 ở mạn Duy Tân hoặc Dịch Vọng còn chỗ không ạ?',
    } = body

    const zaloChatId = `chat_${senderPhone}`

    const msg = await mockGateway.simulateInboundMessage({
      zaloChatId,
      senderName,
      senderPhone,
      content,
    })

    return NextResponse.json({ success: true, message: msg })
  } catch (error) {
    console.error('Error simulating inbound message:', error)
    return NextResponse.json({ error: 'Failed to simulate inbound message' }, { status: 500 })
  }
}
