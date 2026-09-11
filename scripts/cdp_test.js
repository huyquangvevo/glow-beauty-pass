const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ff93af7d-62ac-463a-bfb5-a9c398654fb9';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function createCDPClient(ws) {
  const callbacks = new Map();

  ws.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    } catch (e) {
      // ignore
    }
  });

  return {
    send: (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = Math.floor(Math.random() * 1000000);
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function waitForPort(port, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`http://localhost:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error(`Chrome DevTools on port ${port} did not become ready in time`);
}

async function run() {
  console.log('Launching headless Chrome with DevTools on port 9222...');
  const userDataDir = path.join(process.env.TEMP || 'C:\\temp', 'chrome_cdp_profile_' + Date.now());
  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
    ],
    { stdio: 'ignore' }
  );

  try {
    const versionInfo = await waitForPort(9222);
    console.log('Connected to Chrome DevTools Protocol:', versionInfo.Browser);

    const listRes = await fetch('http://localhost:9222/json/list');
    const tabs = await listRes.json();
    let target = tabs.find((t) => t.type === 'page');
    if (!target) {
      const newRes = await fetch('http://localhost:9222/json/new', { method: 'PUT' });
      target = await newRes.json();
    }
    console.log('Using target page:', target.id);

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
    console.log('Connected to target WebSocket!');

    const cdp = createCDPClient(ws);

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    // Emulate iPhone 14/15/16 Pro Mobile Viewport: 393 x 852
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 393,
      height: 852,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });

    const pages = [
      { url: 'http://localhost:3000', name: 'mobile_home.png', label: '1. Home Page' },
      {
        url: 'http://localhost:3000/spa/an-nhien-duong-sinh-cau-giay',
        name: 'mobile_spa_detail.png',
        label: '2. Spa Detail Page',
      },
      { url: 'http://localhost:3000/hub', name: 'mobile_hub.png', label: '3. Hub Ops Page' },
      { url: 'http://localhost:3000/admin/kpi', name: 'mobile_kpi.png', label: '4. Admin KPI Page' },
    ];

    for (const p of pages) {
      console.log(`[Testing] Navigating to ${p.label}: ${p.url}`);
      await cdp.send('Page.navigate', { url: p.url });
      await new Promise((r) => setTimeout(r, 3500));

      const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');
      const outPath = path.join(ARTIFACT_DIR, p.name);
      fs.writeFileSync(outPath, buffer);
      console.log(`✓ Screenshot saved: ${p.name} (${buffer.length} bytes)`);
    }

    ws.close();
    console.log('🎉 All automated Chrome DevTools mobile tests completed successfully!');
  } finally {
    try {
      chromeProc.kill();
    } catch (e) {
      // ignore
    }
  }
}

run().catch((err) => {
  console.error('CDP Test error:', err);
  process.exit(1);
});
