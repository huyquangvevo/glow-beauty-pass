require('dotenv').config()
const express = require('express')
const { Zalo } = require('zca-js')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8000
const VERCEL_WEBHOOK_URL = process.env.VERCEL_WEBHOOK_URL || 'https://glow-beauty-pass.vercel.app/api/webhooks/zalo'
const WEBHOOK_SECRET = process.env.ZALO_WEBHOOK_SECRET || 'glow_secret_key_2026'

let zaloInstance = null
let isZaloConnected = false
let botAccountInfo = null

// 1. Khởi tạo kết nối Zalo qua zca-js
async function initZalo() {
  try {
    const cookieStr = process.env.ZALO_COOKIES
    const imei = process.env.ZALO_IMEI
    const userAgent = process.env.ZALO_USER_AGENT

    if (!cookieStr || !imei) {
      console.log('⚠️ [ZaloWorker] Chưa phát hiện ZALO_COOKIES hoặc ZALO_IMEI trong biến môi trường.')
      console.log('💡 [ZaloWorker] Vui lòng cấu hình ZALO_COOKIES và ZALO_IMEI trên Koyeb Settings.')
      return
    }

    let cookies
    try {
      cookies = JSON.parse(cookieStr)
    } catch {
      cookies = cookieStr
    }

    console.log('🔄 [ZaloWorker] Đang đăng nhập Zalo bằng Cookie...')
    const zalo = new Zalo({
      cookie: cookies,
      imei: imei,
      userAgent: userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    const api = await zalo.login()
    zaloInstance = api
    isZaloConnected = true

    console.log('✅ [ZaloWorker] Đăng nhập Zalo thành công! Bắt đầu lắng nghe tin nhắn...')

    // Lắng nghe sự kiện tin nhắn đến từ khách hàng
    if (api.listener) {
      api.listener.on('message', async (event) => {
        try {
          const senderId = event.data?.uidFrom || event.data?.id
          const content = event.data?.content || event.data?.msg
          const senderName = event.data?.dName || 'Khách Zalo'

          if (!content || senderId === '0') return

          console.log(`📩 [Zalo Inbound] Nhận tin từ "${senderName}" (${senderId}): "${content}"`)

          // Chuyển tiếp Webhook tức thời sang Vercel
          const response = await fetch(VERCEL_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-secret': WEBHOOK_SECRET,
            },
            body: JSON.stringify({
              zaloChatId: String(senderId),
              senderZaloId: String(senderId),
              senderName: senderName,
              content: String(content),
              messageId: `zalo_${Date.now()}`,
            }),
          })

          if (response.ok) {
            console.log(`⚡ [Zalo Inbound] Đã chuyển tiếp thành công sang Vercel!`)
          } else {
            console.error(`❌ [Zalo Inbound] Vercel trả về lỗi HTTP ${response.status}`)
          }
        } catch (err) {
          console.error('❌ [Zalo Inbound] Lỗi xử lý tin nhắn đến:', err)
        }
      })

      api.listener.start()
    }
  } catch (error) {
    console.error('❌ [ZaloWorker] Không thể kết nối Zalo:', error.message)
    isZaloConnected = false
  }
}

// 2. Healthcheck Endpoint (Koyeb dùng endpoint này để kiểm tra service sống 24/7)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>GlowBeautyPass Zalo Worker</title></head>
      <body style="font-family: sans-serif; padding: 40px; line-height: 1.6; background: #fafaf9;">
        <h2>🌸 GlowBeautyPass — Zalo Connector Worker</h2>
        <p><strong>Nền tảng:</strong> Koyeb Free Tier (Chạy liên tục 24/7)</p>
        <p><strong>Trạng thái kết nối Zalo:</strong> ${isZaloConnected ? '<span style="color: green; font-weight: bold;">Đang Kết Nối</span>' : '<span style="color: red; font-weight: bold;">Chưa Kết Nối (Cần nhập Cookies)</span>'}</p>
        <p><strong>Vercel Webhook Đích:</strong> <code>${VERCEL_WEBHOOK_URL}</code></p>
        <hr/>
        <p>Xem tài liệu hướng dẫn lấy Cookie Zalo tại hướng dẫn trên GitHub.</p>
      </body>
    </html>
  `)
})

app.get('/status', (req, res) => {
  res.json({
    connected: isZaloConnected,
    account: botAccountInfo,
    uptime: process.uptime(),
    webhookUrl: VERCEL_WEBHOOK_URL,
  })
})

// 3. API nhận lệnh gửi tin nhắn từ Hub CRM (Vercel) đến Zalo của khách
app.post('/send', async (req, res) => {
  try {
    const authHeader = req.headers['x-webhook-secret']
    if (authHeader !== WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { threadId, content } = req.body
    if (!threadId || !content) {
      return res.status(400).json({ error: 'Missing threadId or content' })
    }

    if (!isZaloConnected || !zaloInstance) {
      console.warn(`[Zalo Outbound SIMULATED] Zalo chưa kết nối, mô phỏng gửi tin tới ${threadId}: "${content}"`)
      return res.json({ success: true, simulated: true })
    }

    // Jitter Delay: Giãn cách 2s - 3.5s để chống Zalo checkpoint
    const jitter = Math.floor(Math.random() * 1500) + 2000
    await new Promise((r) => setTimeout(r, jitter))

    console.log(`📤 [Zalo Outbound] Đang gửi tin đến ${threadId} (sau ${jitter}ms delay): "${content}"`)
    await zaloInstance.sendMessage({ msg: content, quote: null }, threadId)

    return res.json({ success: true, threadId, content })
  } catch (error) {
    console.error('❌ [Zalo Outbound] Gửi tin thất bại:', error)
    return res.status(500).json({ error: error.message })
  }
})

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 [ZaloWorker] Server đang chạy trên cổng ${PORT}`)
  initZalo()
})
