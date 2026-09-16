import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c9f1ec5-395a-44a0-b682-4ff42c682689';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:3000/en/spa/moc-tra-beauty-trung-hoa...');
  await page.goto('http://localhost:3000/en/spa/moc-tra-beauty-trung-hoa', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  const screenshotPath = path.join(ARTIFACT_DIR, 'spa_detail_moc_tra_clean_font.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot:', screenshotPath);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
