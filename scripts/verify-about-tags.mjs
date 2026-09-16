import puppeteer from 'puppeteer-core'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c9f1ec5-395a-44a0-b682-4ff42c682689'

async function run() {
  console.log('Launching browser to capture redesigned sub-hero...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 420,
      height: 750,
      deviceScaleFactor: 2,
    })

    // Capture EN view
    console.log('Navigating to EN view...')
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise(r => setTimeout(r, 1200))

    const enPath = path.join(OUTPUT_DIR, 'redesigned_about_tags_en.png')
    await page.screenshot({
      path: enPath,
      fullPage: false,
    })
    console.log('Saved EN screenshot to:', enPath)

    // Capture VI view
    console.log('Navigating to VI view...')
    await page.goto('http://localhost:3000/vi', { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise(r => setTimeout(r, 1200))

    const viPath = path.join(OUTPUT_DIR, 'redesigned_about_tags_vi.png')
    await page.screenshot({
      path: viPath,
      fullPage: false,
    })
    console.log('Saved VI screenshot to:', viPath)
  } catch (err) {
    console.error('Error during screenshot capture:', err)
  } finally {
    await browser.close()
  }
}

run()
