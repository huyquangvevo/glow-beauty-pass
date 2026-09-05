import { prisma } from '@/lib/prisma'
import { InboundMessage, OutboundMessage } from './types'
import { calculateSLA } from './sla'

export async function persistInboundMessage(msg: InboundMessage) {
  // 1. Find or create Customer if phone is provided
  let customerId: string | undefined

  if (msg.senderPhone) {
    const customer = await prisma.customer.upsert({
      where: { phone: msg.senderPhone },
      update: {
        lastContactAt: new Date(),
        name: msg.senderName || undefined,
        zaloId: msg.senderZaloId || undefined,
      },
      create: {
        phone: msg.senderPhone,
        name: msg.senderName || 'Khách Zalo',
        zaloId: msg.senderZaloId,
        firstContactAt: msg.timestamp,
        lastContactAt: msg.timestamp,
      },
    })
    customerId = customer.id
  }

  // 2. Find or create Conversation
  let conversation = await prisma.conversation.findUnique({
    where: { zaloChatId: msg.zaloChatId },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        zaloChatId: msg.zaloChatId,
        customerId,
        customerName: msg.senderName || 'Khách Zalo',
        customerPhone: msg.senderPhone,
        status: 'PENDING',
        firstMessageAt: msg.timestamp,
        lastMessageContent: msg.content,
        lastMessageAt: msg.timestamp,
      },
    })
  } else {
    // If conversation was closed or confirmed, reopen if needed
    const updateData: any = {
      lastMessageContent: msg.content,
      lastMessageAt: msg.timestamp,
    }
    if (customerId && !conversation.customerId) {
      updateData.customerId = customerId
      updateData.customerPhone = msg.senderPhone
    }
    if (conversation.status === 'CLOSED') {
      updateData.status = 'PENDING'
    }
    conversation = await prisma.conversation.update({
      where: { id: conversation.id },
      data: updateData,
    })
  }

  // 3. Save Message
  const savedMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: 'CUSTOMER',
      content: msg.content,
      zaloMessageId: msg.messageId,
      createdAt: msg.timestamp,
    },
  })

  return { conversation, message: savedMessage }
}

export async function persistOutboundMessage(
  conversationId: string,
  content: string,
  staffName: string = 'CSKH Hub',
  isQuickReply: boolean = false
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    throw new Error('Conversation not found')
  }

  const now = new Date()

  // If this is the FIRST response from staff, record SLA
  const updateData: any = {
    status: 'CHATTING',
    assignedStaff: staffName,
    lastMessageContent: content,
    lastMessageAt: now,
  }

  if (!conversation.firstResponseAt) {
    const sla = calculateSLA(conversation.firstMessageAt, now)
    updateData.firstResponseAt = now
    updateData.slaFirstResponseSec = sla.elapsedSeconds
    updateData.slaBreached = sla.isBreached
  }

  const updatedConversation = await prisma.conversation.update({
    where: { id: conversationId },
    data: updateData,
  })

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderType: 'HUB_STAFF',
      content,
      isQuickReply,
      createdAt: now,
    },
  })

  return { conversation: updatedConversation, message }
}
