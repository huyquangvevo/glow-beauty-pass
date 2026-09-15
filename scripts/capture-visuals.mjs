import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\6d2e85f1-0a8c-40b8-b054-8c9dcd9cfe0f'

async function run() {
  console.log('Launching Chrome with DevTools Protocol...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  // 1. MOBILE VIEW (iPhone 14: 390 x 844, dpr: 2)
  console.log('Testing Mobile View (390 x 844)...')
  const mobilePage = await browser.newPage()
  await mobilePage.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })

  await mobilePage.goto('http://localhost:3000/vi', { waitUntil: 'networkidle2', timeout: 30000 })
  await mobilePage.evaluate(() => window.scrollBy(0, 50))
  await new Promise(r => setTimeout(r, 1000))

  const mobileScreenshotPath = path.join(OUTPUT_DIR, 'reassurance_mobile.png')
  await mobilePage.screenshot({
    path: mobileScreenshotPath,
    fullPage: false,
  })
  console.log('Saved mobile screenshot:', mobileScreenshotPath)

  // 2. DESKTOP VIEW (1200 x 900)
  console.log('Testing Desktop View (1200 x 900)...')
  const desktopPage = await browser.newPage()
  await desktopPage.setViewport({
    width: 1200,
    height: 900,
    deviceScaleFactor: 2,
  })

  await desktopPage.goto('http://localhost:3000/vi', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1000))

  const desktopScreenshotPath = path.join(OUTPUT_DIR, 'reassurance_desktop.png')
  await desktopPage.screenshot({
    path: desktopScreenshotPath,
    fullPage: false,
  })
  console.log('Saved desktop screenshot:', desktopScreenshotPath)

  // 3. DESKTOP SPA LIST SECTION (Scrolled down)
  console.log('Testing Desktop Spa List Section (Scrolled)...')
  await desktopPage.evaluate(() => {
    const el = document.getElementById('danh-sach-spa')
    if (el) el.scrollIntoView()
  })
  await new Promise(r => setTimeout(r, 1000))
  const spaListScreenshotPath = path.join(OUTPUT_DIR, 'spa_list_desktop.png')
  await desktopPage.screenshot({
    path: spaListScreenshotPath,
    fullPage: false,
  })
  console.log('Saved spa list screenshot:', spaListScreenshotPath)

  await browser.close()
  console.log('Chrome DevTools visual test completed successfully!')
}

run().catch(err => {
  console.error('Test error:', err)
  process.exit(1)
})
