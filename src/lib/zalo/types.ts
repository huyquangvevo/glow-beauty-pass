export interface InboundMessage {
  zaloChatId: string
  senderZaloId: string
  senderName?: string
  senderPhone?: string
  content: string
  messageId: string
  timestamp: Date
}

export interface OutboundMessage {
  zaloChatId: string
  content: string
  replyToMessageId?: string
}

export interface IMessagingGateway {
  name: string
  init(): Promise<void>
  sendMessage(message: OutboundMessage): Promise<{ success: boolean; messageId?: string; error?: string }>
  onMessage(handler: (msg: InboundMessage) => Promise<void>): void
  getStatus(): { isConnected: boolean; activeSessions: number; provider: string }
}
