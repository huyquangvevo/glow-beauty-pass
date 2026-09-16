import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c9f1ec5-395a-44a0-b682-4ff42c682689';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });

    // 1. Check Spa Detail screen in EN
    const spaUrl = 'http://localhost:3000/en/spa/an-nhien-duong-sinh-cau-giay';
    console.log('Testing', spaUrl);
    await page.goto(spaUrl, { waitUntil: 'networkidle0' });

    let dismissBtn = await page.$('button[aria-label="Bỏ qua"], button[aria-label="Dismiss"]');
    if (dismissBtn) {
      await dismissBtn.click();
      await new Promise(r => setTimeout(r, 200));
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'spa_detail_header_logo.png') });
    console.log('Saved spa_detail_header_logo.png');

    console.log('Verification completed successfully!');
  } finally {
    await browser.close();
  }
}

verify().catch(console.error);
