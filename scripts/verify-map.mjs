import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c9f1ec5-395a-44a0-b682-4ff42c682689';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 412, height: 915, isMobile: true },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  console.log('Navigating to http://localhost:3000/vi ...');
  await page.goto('http://localhost:3000/vi', { waitUntil: 'networkidle2' });

  console.log('Page loaded. Dismissing prompt if present...');
  try {
    const dismissBtn = await page.$('button[aria-label="Đóng"]');
    if (dismissBtn) await dismissBtn.click();
  } catch (e) {}

  console.log('Clicking on service to open map view...');
  await page.evaluate(() => {
    // Find service card by text "Gội đầu dưỡng sinh" or "Gội sạch"
    const cards = Array.from(document.querySelectorAll('div')).filter(el =>
      el.textContent && el.textContent.includes('Gội đầu dưỡng sinh') && el.className.includes('cursor-pointer')
    );
    if (cards.length > 0) {
      cards[0].click();
    } else {
      // Fallback: click any cursor-pointer card
      const anyCard = document.querySelector('.grid.grid-cols-2 .cursor-pointer');
      if (anyCard) anyCard.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));

  console.log('Dismissing LocationPrompt if visible...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const boQuaBtn = buttons.find(b => b.textContent && b.textContent.includes('Bỏ qua'));
    if (boQuaBtn) boQuaBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  console.log('Checking map view...');
  const verification = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    const footerStyle = footer ? window.getComputedStyle(footer) : null;
    const isFooterHidden = !footer || footerStyle.display === 'none' || footerStyle.visibility === 'hidden' || footer.offsetHeight === 0;

    const bodyHasClass = document.body.classList.contains('hide-footer-for-map');

    const mapPins = document.querySelectorAll('.gbp-map-marker');
    const pinLabels = Array.from(mapPins).map(p => p.textContent.trim());

    const zaloButtons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Đặt Zalo'));

    const floatingCard = document.querySelector('.animate-in.slide-in-from-bottom-3');

    return {
      isFooterHidden,
      footerDisplay: footerStyle ? footerStyle.display : 'no-footer',
      bodyHasClass,
      pinCount: mapPins.length,
      pinLabels,
      zaloButtonCount: zaloButtons.length,
      hasFloatingCard: Boolean(floatingCard),
    };
  });

  console.log('Verification data:', JSON.stringify(verification, null, 2));

  const screenshotPath = path.join(artifactDir, 'map_view_verification.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);

  console.log('Clicking Đặt Zalo button...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const zaloBtn = buttons.find(b => b.textContent && b.textContent.includes('Đặt Zalo'));
    if (zaloBtn) zaloBtn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const modalScreenshotPath = path.join(artifactDir, 'zalo_booking_modal_verification.png');
  await page.screenshot({ path: modalScreenshotPath, fullPage: false });
  console.log('Modal screenshot saved to:', modalScreenshotPath);

  await browser.close();
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
