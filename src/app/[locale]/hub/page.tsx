'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle,
  Clock,
  AlertTriangle,
  CheckCircle,
  Send,
  User,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  PlusCircle,
  ShieldAlert,
  CalendarCheck,
  ChevronLeft,
  Phone,
} from 'lucide-react'

interface ConversationItem {
  id: string
  zaloChatId: string
  customerName?: string
  customerPhone?: string
  status: string
  firstMessageAt: string
  firstResponseAt?: string
  lastMessageContent?: string
  lastMessageAt: string
  sla: {
    elapsedSeconds: number
    targetSeconds: number
    isBreached: boolean
    warningLevel: 'NORMAL' | 'WARNING' | 'CRITICAL'
    formattedElapsed: string
  }
}

interface MessageItem {
  id: string
  senderType: 'CUSTOMER' | 'HUB_STAFF' | 'BOT' | 'SYSTEM'
  content: string
  createdAt: string
  isQuickReply?: boolean
}

interface SpaItem {
  id: string
  name: string
  ward: string
  rating: number
}

interface SkuItem {
  id: string
  name: string
  code: string
  pricePhase1: number
}

export default function HubOpsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [replyText, setReplyText] = useState('')
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [spas, setSpas] = useState<SpaItem[]>([])
  const [skus, setSkus] = useState<SkuItem[]>([])

  // Mobile View state: 'QUEUE' or 'CHAT_OPS'
  const [mobileView, setMobileView] = useState<'QUEUE' | 'CHAT_OPS'>('QUEUE')

  // Dispatch form state
  const [selectedSpaId, setSelectedSpaId] = useState('')
  const [selectedSkuId, setSelectedSkuId] = useState('')
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0])
  const [bookingTime, setBookingTime] = useState('14:30')
  const [customerPhoneInput, setCustomerPhoneInput] = useState('')
  const [customerNameInput, setCustomerNameInput] = useState('')
  const [isDispatching, setIsDispatching] = useState(false)
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Tải danh sách hội thoại
  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?status=${activeTab}`)
      const data = await res.json()
      if (data.conversations) {
        setConversations(data.conversations)
        if (!selectedConvId && data.conversations.length > 0) {
          setSelectedConvId(data.conversations[0].id)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 2. Tải chi tiết tin nhắn của hội thoại được chọn
  const loadMessages = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`)
      const data = await res.json()
      if (data.conversation) {
        setMessages(data.conversation.messages || [])
        if (data.conversation.customerPhone) {
          setCustomerPhoneInput(data.conversation.customerPhone)
        }
        if (data.conversation.customerName) {
          setCustomerNameInput(data.conversation.customerName)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 3. Tải danh sách Spas & SKUs cho Dispatching
  useEffect(() => {
    async function loadMeta() {
      const res = await fetch('/api/spas')
      const data = await res.json()
      if (data.spas) setSpas(data.spas)
      if (data.skus) {
        setSkus(data.skus)
        if (data.skus.length > 2) setSelectedSkuId(data.skus[2].id) // Mặc định gói dưỡng sinh
      }
      if (data.spas && data.spas.length > 0) setSelectedSpaId(data.spas[0].id)
    }
    loadMeta()
  }, [])

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId)
    }
  }, [selectedConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Gửi tin nhắn trả lời
  const handleSendReply = async (textToSend?: string) => {
    const content = textToSend || replyText
    if (!content.trim() || !selectedConvId) return

    try {
      const res = await fetch(`/api/conversations/${selectedConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          isQuickReply: !!textToSend,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setReplyText('')
        loadMessages(selectedConvId)
        loadConversations()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Chốt lịch đặt hẹn
  const handleDispatchBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSpaId || !selectedSkuId || !customerPhoneInput) {
      alert('Vui lòng điền đủ Spa, Dịch vụ và Số điện thoại khách')
      return
    }

    try {
      setIsDispatching(true)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvId,
          spaId: selectedSpaId,
          skuId: selectedSkuId,
          customerPhone: customerPhoneInput,
          customerName: customerNameInput,
          bookingDate,
          bookingTime,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDispatchSuccess(`Chốt lịch thành công: Mã ${data.booking.code}`)
        setTimeout(() => setDispatchSuccess(null), 6000)

        // Tự động gửi tin nhắn xác nhận cho khách trên Zalo
        const spa = spas.find((s) => s.id === selectedSpaId)
        const sku = skus.find((s) => s.id === selectedSkuId)
        const confirmMsg = ` Dạ GlowBeautyPass đã xác nhận lịch thành công cho chị!\n• Điểm hẹn: ${spa?.name}\n• Dịch vụ: ${sku?.name}\n• Giờ hẹn: ${bookingTime} ngày ${bookingDate}\n• Giá niêm yết: ${sku?.pricePhase1.toLocaleString('vi-VN')}đ (cam kết không phụ thu)\n• Mã đặt chỗ: ${data.booking.code}\nChúc chị có buổi trải nghiệm thư giãn ạ!`
        await handleSendReply(confirmMsg)
      } else {
        alert(data.error || 'Có lỗi khi chốt lịch')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsDispatching(false)
    }
  }

  // Giả lập khách nhắn Zalo đến
  const handleSimulateInbound = async () => {
    try {
      await fetch('/api/simulate-inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Chị Mai (Trần Thái Tông)',
          senderPhone: '0988' + Math.floor(100000 + Math.random() * 900000),
          content: 'Em ơi kiểm tra giúp chị chiều nay 15h còn chỗ làm gội đầu dưỡng sinh ở mạn Dịch Vọng không em?',
        }),
      })
      await loadConversations()
    } catch (err) {
      console.error(err)
    }
  }

  const selectedConv = conversations.find((c) => c.id === selectedConvId)

  // Danh mục tin nhắn mẫu (Quick Replies SOP Hub)
  const quickReplies = [
    {
      label: '1. Chào & Gửi Menu 3 SKU',
      text: 'Dạ em chào chị ạ! GlowBeautyPass là mạng lưới spa chuẩn hóa tại Cầu Giấy. Bên em có 3 gói niêm yết: Gội sạch (49k/45p), Gội Premium (69k/55p) và Gội dưỡng sinh chuyên sâu (149k/65p). Chị muốn trải nghiệm dịch vụ nào ạ?',
    },
    {
      label: '2. Xin giờ hẹn & Vị trí',
      text: 'Dạ chị muốn đặt lịch vào khung mấy giờ chiều nay và quanh khu vực nào (Duy Tân, Trung Hòa hay Dịch Vọng) để em điều phối ghế trống gần chị nhất ạ?',
    },
    {
      label: '3. Cam kết giá chuẩn',
      text: 'Dạ bên em cam kết làm đúng quy trình thời lượng và đúng giá niêm yết, tuyệt đối không chèo kéo mua thẻ hay phụ thu thêm chị yên tâm nhé ạ!',
    },
  ]

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-stone-100">
      {/* HUB SUB-HEADER */}
      <div className="bg-white border-b border-stone-200 px-3.5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          {mobileView === 'CHAT_OPS' && (
            <button
              onClick={() => setMobileView('QUEUE')}
              className="p-1 -ml-1 rounded-full text-stone-600 hover:bg-stone-100 sm:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-2.5 h-2.5 rounded-full bg-[#236B38] animate-pulse" />
          <span className="font-extrabold text-sm text-stone-900">Hub Điều Phối Zalo • Cầu Giấy</span>
          <span className="text-[11px] text-stone-500 hidden md:inline">
            (SLA: Giờ hành chính &lt; 5 phút | Ngoài giờ &lt; 15 phút)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateInbound}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#236B38] text-xs font-bold border border-emerald-200 transition-all shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Mô phỏng Khách Nhắn</span>
          </button>

          <button
            onClick={loadConversations}
            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all"
            title="Làm mới"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-COLUMN WORKSPACE (Responsive Mobile Switch) */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: CONVERSATION QUEUE */}
        <div
          className={`${
            mobileView === 'QUEUE' ? 'flex' : 'hidden sm:flex'
          } w-full sm:w-80 lg:w-96 bg-white border-r border-stone-200 flex-col shrink-0`}
        >
          {/* Tabs */}
          <div className="flex border-b border-stone-200 p-1.5 bg-stone-50 gap-1 text-xs font-medium">
            {['ALL', 'PENDING', 'CHATTING', 'CONFIRMED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-[#236B38] text-white shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab === 'ALL'
                  ? 'Tất cả'
                  : tab === 'PENDING'
                  ? 'Chờ trả lời'
                  : tab === 'CHATTING'
                  ? 'Đang chat'
                  : 'Đã chốt'}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                <MessageCircle className="w-8 h-8 mx-auto text-stone-300" />
                <p>Chưa có hội thoại nào trong hàng đợi.</p>
                <button
                  onClick={handleSimulateInbound}
                  className="text-[#236B38] font-bold underline hover:text-[#1D5A2E]"
                >
                  Bấm để tạo tin nhắn giả lập
                </button>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === selectedConvId
                const isCritical = conv.sla.warningLevel === 'CRITICAL'
                const isWarning = conv.sla.warningLevel === 'WARNING'

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id)
                      setMobileView('CHAT_OPS')
                    }}
                    className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'bg-emerald-50/60 border-l-[#236B38]'
                        : 'hover:bg-stone-50 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-bold text-xs text-stone-900 truncate">
                          {conv.customerName || conv.customerPhone || 'Khách Zalo'}
                        </span>
                      </div>

                      {/* SLA Timer Badge */}
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse-fast'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-[#236B38] border border-emerald-200'
                        }`}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {conv.sla.formattedElapsed}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-1 mt-1.5">
                      {conv.lastMessageContent || 'Không có nội dung'}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-stone-400">
                      <span>{conv.customerPhone || 'Chưa có SĐT'}</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded-full uppercase text-[9px] ${
                          conv.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : conv.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {conv.status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: LIVE CHAT WINDOW */}
        <div
          className={`${
            mobileView === 'CHAT_OPS' ? 'flex' : 'hidden sm:flex'
          } flex-1 bg-stone-50 flex-col min-w-0 border-r border-stone-200`}
        >
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {selectedConv.customerName || 'Khách Zalo'} - {selectedConv.customerPhone || 'Chưa cập nhật SĐT'}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                    <span>Chat ID: {selectedConv.zaloChatId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#236B38]" />
                      Thời gian chờ: <strong>{selectedConv.sla.formattedElapsed}</strong>
                    </span>
                  </div>
                </div>

                {selectedConv.sla.isBreached && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Vi Phạm SLA &lt; 5p!</span>
                  </div>
                )}
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m) => {
                  const isStaff = m.senderType === 'HUB_STAFF'
                  return (
                    <div key={m.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm space-y-1 shadow-xs ${
                          isStaff
                            ? 'bg-[#236B38] text-white rounded-tr-none'
                            : 'bg-white text-stone-900 border border-stone-200/80 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{m.content}</p>
                        <div
                          className={`text-[10px] flex items-center justify-end gap-1 ${
                            isStaff ? 'text-emerald-100' : 'text-stone-400'
                          }`}
                        >
                          {m.isQuickReply && <span>(Tin mẫu SOP) •</span>}
                          <span>
                            {new Date(m.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="bg-white border-t border-stone-200 p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="Nhập nội dung trả lời khách trên Zalo (bấm Enter để gửi)..."
                  className="flex-1 border border-stone-300 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#236B38]"
                />
                <button
                  onClick={() => handleSendReply()}
                  className="px-4 py-2 bg-[#236B38] hover:bg-[#1D5A2E] text-white rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-xs">
              Chọn một hội thoại bên trái để bắt đầu điều phối
            </div>
          )}
        </div>

        {/* COLUMN 3: OPS TOOL (QUICK REPLIES & DISPATCH FORM) */}
        <div
          className={`${
            mobileView === 'CHAT_OPS' ? 'flex' : 'hidden lg:flex'
          } w-full sm:w-80 lg:w-96 bg-white flex-col shrink-0 overflow-y-auto divide-y divide-stone-200`}
        >
          {/* Quick Replies Section */}
          <div className="p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#236B38]" />
              <span>Kịch Bản Mẫu 1-Click (SOP Hub)</span>
            </h4>

            <div className="space-y-2">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendReply(qr.text)}
                  className="w-full text-left p-2.5 rounded-2xl border border-stone-200 hover:border-[#236B38] hover:bg-emerald-50/40 transition-all text-xs space-y-1 group"
                >
                  <p className="font-bold text-stone-800 group-hover:text-[#236B38]">{qr.label}</p>
                  <p className="text-[11px] text-stone-500 line-clamp-2">{qr.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Chốt Lịch 1-Click */}
          <div className="p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-[#236B38]" />
              <span>Chốt Lịch & Điều Phối Spa</span>
            </h4>

            {dispatchSuccess && (
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#236B38] shrink-0" />
                <span>{dispatchSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDispatchBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Số điện thoại khách:</label>
                <input
                  type="text"
                  required
                  value={customerPhoneInput}
                  onChange={(e) => setCustomerPhoneInput(e.target.value)}
                  placeholder="0988..."
                  className="w-full border border-stone-300 rounded-xl p-2 focus:ring-1 focus:ring-[#236B38]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Tên khách hàng:</label>
                <input
                  type="text"
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  placeholder="Chị Mai..."
                  className="w-full border border-stone-300 rounded-xl p-2 focus:ring-1 focus:ring-[#236B38]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Chọn Spa còn chỗ:</label>
                <select
                  value={selectedSpaId}
                  onChange={(e) => setSelectedSpaId(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2 focus:ring-1 focus:ring-[#236B38] bg-white"
                >
                  {spas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.ward})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Gói dịch vụ:</label>
                <select
                  value={selectedSkuId}
                  onChange={(e) => setSelectedSkuId(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2 focus:ring-1 focus:ring-[#236B38] bg-white"
                >
                  {skus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.name} ({sku.pricePhase1.toLocaleString('vi-VN')}đ)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Ngày hẹn:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl p-2 focus:ring-1 focus:ring-[#236B38] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Giờ hẹn:</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl p-2 focus:ring-1 focus:ring-[#236B38] bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isDispatching}
                className="w-full py-2.5 px-4 bg-[#236B38] hover:bg-[#1D5A2E] text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isDispatching ? 'Đang lưu...' : 'Xác Nhận Chốt Lịch (Mã GBP)'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
