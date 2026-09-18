const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Signature 'g' compound path from BrandLogo
const gPath = 'M591.859 993.469L591.859 979.04C611.615 981.547 626.751 982.8 637.259 982.8C669.758 982.8 695.119 972.413 713.341 951.639C721.183 942.574 726.856 932.4 730.362 921.11C733.858 909.819 735.616 896.158 735.616 880.125L735.616 816.132C735.616 786.856 727.628 763.925 711.661 747.338C694.425 729.353 673.127 720.365 647.776 720.365C622.425 720.365 602.377 728.867 585.151 745.881C567.631 763.312 558.882 784.776 558.882 810.292C558.882 838.033 569.106 859.575 589.564 874.907C603.998 885.644 621.224 891.008 641.262 891.008C645.882 891.008 651.985 890.726 659.543 890.172L659.543 905.437C651.272 905.991 644.69 906.272 639.788 906.272C611.341 906.272 588.295 897.984 570.649 881.388C552.143 863.957 542.896 840.608 542.896 811.332C542.896 776.342 555.503 748.456 580.727 727.682C599.496 712.203 621.566 704.469 646.926 704.469C667.102 704.469 685.529 709.56 702.199 719.734C722.237 731.724 735.889 747.542 743.184 767.199C748.789 782.396 751.592 799.963 751.592 819.892L751.592 875.306C751.592 900.268 748.574 919.915 742.559 934.276C732.891 957.693 715.939 974.91 691.701 985.929C674.748 993.731 656.038 997.638 635.589 997.638C623.538 997.638 608.968 996.238 591.879 993.459L591.859 993.469ZM591.859 965.66L591.859 952.067C609.095 954.574 622.894 955.827 633.265 955.827C661.282 955.827 681.32 947.179 693.371 929.894C697.999 923.481 701.144 916.407 702.824 908.672C704.503 900.938 705.343 889.822 705.343 875.315L705.343 819.066C705.343 798.156 700.997 782.26 692.316 771.387C680.969 757.308 666.321 750.263 648.391 750.263C632.415 750.263 618.48 756.122 606.566 767.831C594.799 779.539 588.91 793.628 588.91 810.069C588.91 826.509 593.988 838.052 604.144 847.186C614.3 856.32 628.069 860.886 645.442 860.886C649.368 860.886 654.055 860.605 659.524 860.051L659.524 875.315C653.079 876.151 647.473 876.569 642.708 876.569C631.36 876.569 620.638 874.344 610.55 869.874C585.326 858.865 572.719 838.859 572.719 809.855C572.719 785.32 582.24 765.45 601.302 750.253C614.749 739.662 629.954 734.357 646.907 734.357C670.022 734.357 689.22 743.209 704.493 760.912C715.704 773.738 721.309 793.395 721.309 819.882L721.309 877.599C721.309 906.039 715.489 927.435 703.868 941.796C688.595 960.617 664.778 970.023 632.415 970.023C621.068 970.023 607.543 968.556 591.85 965.631L591.859 965.66Z';

// Generates the clean SVG string
function getFaviconSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3A8242" />
          <stop offset="100%" stop-color="#1E5C25" />
        </linearGradient>
        <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25" />
        </filter>
      </defs>

      <!-- Outer Squircle with 100% transparent corners -->
      <rect width="512" height="512" rx="124" fill="url(#bgGrad)" />
      
      <!-- Subtle inner luxury border ring -->
      <rect x="12" y="12" width="488" height="488" rx="114" stroke="white" stroke-opacity="0.18" stroke-width="6" />

      <!-- Centered Signature 'g' with crisp clarity and proportional weight -->
      <g transform="translate(244, 258) scale(1.12) translate(-647, -851)" fill="white" filter="url(#subtleGlow)">
        <path d="${gPath}" />
      </g>

      <!-- Signature Golden Sparkle Star on top-right -->
      <g filter="url(#subtleGlow)">
        <path d="M382 102 L390 128 L416 136 L390 144 L382 170 L374 144 L348 136 L374 128 Z" fill="#FBBF24" />
        <circle cx="382" cy="136" r="4" fill="#FFFBEB" />
      </g>
    </svg>
  `.trim();
}

/**
 * Creates a valid multi-resolution ICO file from PNG buffers.
 * PNG in ICO is officially supported in all modern browsers since IE9/Chrome/Firefox/Safari.
 */
function createIcoFromPngs(pngBuffers) {
  // ICO header: 6 bytes
  // Directory entries: 16 bytes each
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const entries = [];
  for (const { buffer, width, height } of pngBuffers) {
    entries.push({
      width: width >= 256 ? 0 : width,
      height: height >= 256 ? 0 : height,
      colors: 0,
      reserved: 0,
      planes: 1,
      bpp: 32,
      size: buffer.length,
      offset: currentOffset,
      buffer
    });
    currentOffset += buffer.length;
  }

  const icoBuffer = Buffer.alloc(currentOffset);

  // Write ICO Header
  icoBuffer.writeUInt16LE(0, 0); // Reserved
  icoBuffer.writeUInt16LE(1, 2); // Type: 1 = ICO
  icoBuffer.writeUInt16LE(count, 4); // Number of images

  // Write Directory Entries
  let entryOffset = 6;
  for (const entry of entries) {
    icoBuffer.writeUInt8(entry.width, entryOffset);
    icoBuffer.writeUInt8(entry.height, entryOffset + 1);
    icoBuffer.writeUInt8(entry.colors, entryOffset + 2);
    icoBuffer.writeUInt8(entry.reserved, entryOffset + 3);
    icoBuffer.writeUInt16LE(entry.planes, entryOffset + 4);
    icoBuffer.writeUInt16LE(entry.bpp, entryOffset + 6);
    icoBuffer.writeUInt32LE(entry.size, entryOffset + 8);
    icoBuffer.writeUInt32LE(entry.offset, entryOffset + 12);
    entryOffset += 16;

    // Write PNG data
    entry.buffer.copy(icoBuffer, entry.offset);
  }

  return icoBuffer;
}

async function main() {
  const svgContent = getFaviconSVG();

  // Save SVG
  fs.writeFileSync(path.resolve(__dirname, '../public/favicon.svg'), svgContent);
  fs.writeFileSync(path.resolve(__dirname, '../src/app/icon.svg'), svgContent);
  console.log('Saved SVG icons');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const renderPng = async (size) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; }
            svg { width: 100%; height: 100%; display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `, { waitUntil: 'domcontentloaded' });

    return await page.screenshot({ omitBackground: true, type: 'png' });
  };

  console.log('Rendering resolutions...');
  const png16 = await renderPng(16);
  const png32 = await renderPng(32);
  const png48 = await renderPng(48);
  const png180 = await renderPng(180);
  const png192 = await renderPng(192);
  const png512 = await renderPng(512);

  // Write high-res PNGs
  fs.writeFileSync(path.resolve(__dirname, '../public/apple-touch-icon.png'), png180);
  fs.writeFileSync(path.resolve(__dirname, '../public/apple-icon.png'), png180);
  fs.writeFileSync(path.resolve(__dirname, '../public/icon-192x192.png'), png192);
  fs.writeFileSync(path.resolve(__dirname, '../public/icon-512x512.png'), png512);
  fs.writeFileSync(path.resolve(__dirname, '../test_new_32.png'), png32);
  fs.writeFileSync(path.resolve(__dirname, '../test_new_512.png'), png512);

  // Pack 16, 32, 48 into favicon.ico
  const icoBuffer = createIcoFromPngs([
    { buffer: png16, width: 16, height: 16 },
    { buffer: png32, width: 32, height: 32 },
    { buffer: png48, width: 48, height: 48 },
  ]);

  fs.writeFileSync(path.resolve(__dirname, '../public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.resolve(__dirname, '../src/app/favicon.ico'), icoBuffer);

  await browser.close();
  console.log('Successfully generated all favicons with true transparency!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
