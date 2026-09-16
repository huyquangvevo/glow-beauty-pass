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

    // 1. Check VI Home
    console.log('Testing http://localhost:3000/vi...');
    await page.goto('http://localhost:3000/vi', { waitUntil: 'networkidle0' });
    
    // Dismiss location prompt if visible
    let dismissBtn = await page.$('button[aria-label="Bỏ qua"], button[aria-label="Dismiss"]');
    if (dismissBtn) {
      await dismissBtn.click();
      await new Promise(r => setTimeout(r, 200));
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'home_vi_10000_spas.png') });
    console.log('Saved home_vi_10000_spas.png');

    // Scroll to see Triệt lông card
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'home_vi_triet_long.png') });
    console.log('Saved home_vi_triet_long.png');

    // 2. Check EN Home
    console.log('Testing http://localhost:3000/en...');
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle0' });
    dismissBtn = await page.$('button[aria-label="Bỏ qua"], button[aria-label="Dismiss"]');
    if (dismissBtn) {
      await dismissBtn.click();
      await new Promise(r => setTimeout(r, 200));
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'home_en_10000_spas.png') });
    console.log('Saved home_en_10000_spas.png');

    console.log('Verification completed successfully!');
  } finally {
    await browser.close();
  }
}

verify().catch(console.error);
