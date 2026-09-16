import puppeteer from 'puppeteer-core'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c9f1ec5-395a-44a0-b682-4ff42c682689'

async function run() {
  console.log('Launching browser to test Zalo booking bottom sheet...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 420,
      height: 850,
      deviceScaleFactor: 2,
    })

    // Override window.open to prevent popup error and allow flow to proceed
    await page.evaluateOnNewDocument(() => {
      window.open = (url) => {
        console.log('Intercepted window.open:', url)
        return null
      }
    })

    console.log('Navigating to http://localhost:3000/vi...')
    await page.goto('http://localhost:3000/vi', { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise(r => setTimeout(r, 1000))

    // Click on the first service card to open booking or spa list
    console.log('Clicking on first service card...')
    await page.evaluate(() => {
      const cards = document.querySelectorAll('div.grid.grid-cols-2 > div')
      if (cards.length > 0) {
        cards[0].click()
      }
    })
    await new Promise(r => setTimeout(r, 1200))

    // Now in spas view, click "Đặt Zalo" button
    console.log('Clicking "Đặt Zalo" button on first spa...')
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const zaloBtn = buttons.find(b => b.textContent.includes('Đặt Zalo'))
      if (zaloBtn) {
        zaloBtn.click()
        return true
      }
      return false
    })
    console.log('Clicked zaloBtn:', clicked)
    await new Promise(r => setTimeout(r, 1200))

    // Dismiss location banner if open to clean view
    await page.evaluate(() => {
      const dismissBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bỏ qua'))
      if (dismissBtn) dismissBtn.click()
    })
    await new Promise(r => setTimeout(r, 400))

    // Scroll inside bottom sheet to view CTA and guidance
    await page.evaluate(() => {
      const sheet = document.querySelector('div.max-h-\\[90vh\\]')
      if (sheet) sheet.scrollTop = sheet.scrollHeight
    })
    await new Promise(r => setTimeout(r, 400))

    // 1. Capture Bottom Sheet State 1 (Form & message preview with guidance)
    const sheetFormPath = path.join(OUTPUT_DIR, 'zalo_sheet_form_guidance.png')
    await page.screenshot({ path: sheetFormPath, fullPage: false })
    console.log('Saved zalo_sheet_form_guidance.png')

    // 2. Click "Mở Zalo GlowBeautyPass" to trigger confirmation state
    console.log('Clicking "Mở Zalo GlowBeautyPass"...')
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const submitBtn = buttons.find(b => b.textContent.includes('Mở Zalo GlowBeautyPass'))
      if (submitBtn) {
        submitBtn.click()
      }
    })
    await new Promise(r => setTimeout(r, 1000))

    // Scroll inside confirmation sheet if needed
    await page.evaluate(() => {
      const sheet = document.querySelector('div.max-h-\\[90vh\\]')
      if (sheet) sheet.scrollTop = sheet.scrollHeight
    })
    await new Promise(r => setTimeout(r, 400))

    // 3. Capture Confirmation State
    const sheetConfirmPath = path.join(OUTPUT_DIR, 'zalo_sheet_confirmed_guidance.png')
    await page.screenshot({ path: sheetConfirmPath, fullPage: false })
    console.log('Saved zalo_sheet_confirmed_guidance.png')

  } catch (err) {
    console.error('Error during Zalo booking test:', err)
  } finally {
    await browser.close()
  }
}

run()
