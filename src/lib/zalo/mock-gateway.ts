import { IMessagingGateway, InboundMessage, OutboundMessage } from './types'
import { persistInboundMessage } from './persistence'

export class MockZaloGateway implements IMessagingGateway {
  name = 'Mock Zalo Gateway (Dev/Simulation)'
  private messageHandlers: ((msg: InboundMessage) => Promise<void>)[] = []
  private isRunning = false

  async init(): Promise<void> {
    this.isRunning = true
    console.log('[MockZaloGateway] Initialized successfully.')
  }

  onMessage(handler: (msg: InboundMessage) => Promise<void>): void {
    this.messageHandlers.push(handler)
  }

  async sendMessage(message: OutboundMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`[MockZaloGateway -> Zalo ${message.zaloChatId}] Gửi tin thành công: "${message.content}"`)
    return {
      success: true,
      messageId: `mock_out_${Date.now()}`,
    }
  }

  getStatus() {
    return {
      isConnected: this.isRunning,
      activeSessions: 2,
      provider: 'MOCK_SANDBOX',
    }
  }

  // Phương thức giả lập khách nhắn tin đến (dùng cho test/demo)
  async simulateInboundMessage(params: {
    zaloChatId: string
    senderName: string
    senderPhone: string
    content: string
  }) {
    const msg: InboundMessage = {
      zaloChatId: params.zaloChatId,
      senderZaloId: `zalo_${params.senderPhone}`,
      senderName: params.senderName,
      senderPhone: params.senderPhone,
      content: params.content,
      messageId: `mock_in_${Date.now()}`,
      timestamp: new Date(),
    }

    // Persist to database
    await persistInboundMessage(msg)

    // Notify registered handlers
    for (const h of this.messageHandlers) {
      await h(msg)
    }

    return msg
  }
}

// Global Singleton instance for application
export const mockGateway = new MockZaloGateway()
mockGateway.init()
