const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function simulateChromeTab() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 400, deviceScaleFactor: 2 });

  // Load the new test images as base64
  const imgG = fs.readFileSync('test_new_512.png').toString('base64');
  const imgBoldG = fs.readFileSync('var1_bold_G_512.png').toString('base64');
  const imgGlow = fs.readFileSync('var3_bold_glow_512.png').toString('base64');
  const imgOld = fs.readFileSync('test_32.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 30px;
            background: #1e1e24;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #fff;
          }
          .title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .chrome-header {
            background: #292a2d;
            border-radius: 12px 12px 0 0;
            padding: 10px 16px 0;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          }
          .tab {
            height: 38px;
            padding: 0 16px;
            background: #35363a;
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12.5px;
            color: #e8eaed;
            max-width: 220px;
          }
          .tab.active {
            background: #202124;
            color: #fff;
            font-weight: 500;
          }
          .tab-icon {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            flex-shrink: 0;
          }
          .comparison-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 30px;
          }
          .card {
            background: #292a2d;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .card-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 12px;
          }
          .card-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .card-desc {
            font-size: 12px;
            color: #9aa0a6;
          }
        </style>
      </head>
      <body>
        <div class="title">🔍 So sánh hiển thị Favicon trên Chrome Tab (Dark theme)</div>

        <!-- Chrome Tab Bar Simulation -->
        <div class="chrome-header">
          <div class="tab">
            <img src="data:image/png;base64,${imgOld}" class="tab-icon" />
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Cũ (Bị góc trắng)</span>
          </div>
          <div class="tab active">
            <img src="data:image/png;base64,${imgG}" class="tab-icon" />
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Phương án 1 (Chữ g Logo)</span>
          </div>
          <div class="tab">
            <img src="data:image/png;base64,${imgBoldG}" class="tab-icon" />
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Phương án 2 (Chữ G Đậm)</span>
          </div>
          <div class="tab">
            <img src="data:image/png;base64,${imgGlow}" class="tab-icon" />
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Phương án 3 (Chữ glow)</span>
          </div>
        </div>

        <div class="comparison-grid">
          <div class="card" style="opacity: 0.6; border: 1px dashed #e11d48;">
            <img src="data:image/png;base64,${imgOld}" class="card-icon" />
            <div class="card-title" style="color: #f43f5e;">Bản cũ bị lỗi</div>
            <div class="card-desc">Lộ 4 góc trắng trên nền tab tối, chữ mờ</div>
          </div>
          <div class="card" style="border: 2px solid #22c55e;">
            <img src="data:image/png;base64,${imgG}" class="card-icon" />
            <div class="card-title" style="color: #4ade80;">PA 1: g Logo + Sao vàng</div>
            <div class="card-desc">Đúng chất nét uốn Logo Glow, trong suốt 4 góc</div>
          </div>
          <div class="card" style="border: 2px solid #3b82f6;">
            <img src="data:image/png;base64,${imgBoldG}" class="card-icon" />
            <div class="card-title" style="color: #60a5fa;">PA 2: Chữ G Đậm Net</div>
            <div class="card-desc">Cực kỳ rõ nét ở 16px, phong cách hiện đại</div>
          </div>
          <div class="card" style="border: 1px solid #6b7280;">
            <img src="data:image/png;base64,${imgGlow}" class="card-icon" />
            <div class="card-title">PA 3: glow Đậm</div>
            <div class="card-desc">Viết trọn chữ glow, sắc nét không lem viền</div>
          </div>
        </div>
      </body>
    </html>
  `);

  await page.screenshot({ path: 'favicon_comparison.png' });
  await browser.close();
  console.log('Saved favicon_comparison.png');
}

simulateChromeTab().catch(console.error);
