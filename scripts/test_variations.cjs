const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testVariations() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Variation 1: Bold Solid 'G' in Plus Jakarta Sans with Golden Sparkle
  const svgVar1 = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#357D3D" />
          <stop offset="100%" stop-color="#195422" />
        </linearGradient>
        <filter id="sh1" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.3" />
        </filter>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#grad1)" />
      <rect x="12" y="12" width="488" height="488" rx="116" stroke="white" stroke-opacity="0.16" stroke-width="6" />
      
      <text x="240" y="372" font-family="system-ui, -apple-system, sans-serif" font-size="345" font-weight="900" fill="white" text-anchor="middle" filter="url(#sh1)">G</text>
      
      <g filter="url(#sh1)">
        <path d="M395 95 L404 122 L431 131 L404 140 L395 167 L386 140 L359 131 L386 122 Z" fill="#FBBF24" />
        <circle cx="395" cy="131" r="4.5" fill="#FFFBEB" />
      </g>
    </svg>
  `;

  // Variation 2: Pure Luxury Botanical / Spa Glow Leaf with sparkle
  const svgVar2 = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2F7C38" />
          <stop offset="100%" stop-color="#144D1C" />
        </linearGradient>
        <filter id="sh2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.3" />
        </filter>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#grad2)" />
      <rect x="12" y="12" width="488" height="488" rx="116" stroke="white" stroke-opacity="0.16" stroke-width="6" />

      <!-- Stylized luxury spa leaf / lotus curve with golden sparkle -->
      <path d="M256 100 C270 180 370 230 370 320 C370 380 320 425 256 425 C192 425 142 380 142 320 C142 230 242 180 256 100 Z" fill="white" filter="url(#sh2)" />
      <path d="M256 220 C270 270 310 300 310 340 C310 370 285 390 256 390 C227 390 202 370 202 340 C202 300 242 270 256 220 Z" fill="url(#grad2)" />

      <!-- Sparkle Star -->
      <g filter="url(#sh2)">
        <path d="M400 90 L408 114 L432 122 L408 130 L400 154 L392 130 L368 122 L392 114 Z" fill="#FBBF24" />
        <circle cx="400" cy="122" r="3.5" fill="#FFFBEB" />
      </g>
    </svg>
  `;

  // Variation 3: Full 'glow' wordmark with thicker solid bold white letterforms
  const svgVar3 = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#357D3D" />
          <stop offset="100%" stop-color="#195422" />
        </linearGradient>
        <filter id="sh3" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000" flood-opacity="0.3" />
        </filter>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#grad3)" />
      <rect x="12" y="12" width="488" height="488" rx="116" stroke="white" stroke-opacity="0.16" stroke-width="6" />

      <text x="256" y="325" font-family="system-ui, -apple-system, sans-serif" font-size="160" font-weight="900" letter-spacing="-3" fill="white" text-anchor="middle" filter="url(#sh3)">glow</text>
      
      <!-- Sparkle -->
      <path d="M405 160 L411 176 L427 182 L411 188 L405 204 L399 188 L383 182 L399 176 Z" fill="#FBBF24" filter="url(#sh3)" />
    </svg>
  `;

  const render = async (svg, name) => {
    await page.setViewport({ width: 512, height: 512 });
    await page.setContent(`<body style="margin:0; background:transparent;">${svg}</body>`);
    await page.screenshot({ path: `${name}_512.png`, omitBackground: true });

    await page.setViewport({ width: 32, height: 32 });
    await page.setContent(`<body style="margin:0; background:transparent;"><div style="width:32px;height:32px;">${svg}</div></body>`);
    await page.screenshot({ path: `${name}_32.png`, omitBackground: true });
  };

  await render(svgVar1, 'var1_bold_G');
  await render(svgVar2, 'var2_leaf');
  await render(svgVar3, 'var3_bold_glow');

  await browser.close();
  console.log('Generated all variations');
}

testVariations().catch(console.error);
