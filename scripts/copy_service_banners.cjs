const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../docs/Banner web GlowBP');
const destServicesDir = path.join(__dirname, '../public/services');
const destBannersDir = path.join(__dirname, '../public/banners');

if (!fs.existsSync(destServicesDir)) {
  fs.mkdirSync(destServicesDir, { recursive: true });
}
if (!fs.existsSync(destBannersDir)) {
  fs.mkdirSync(destBannersDir, { recursive: true });
}

const fileMap = {
  'gội thường': 'goi-sach',
  'gội cặp': 'goi-dau-cap',
  'gội dưỡng sinh': 'duong-sinh',
  'massage body': 'massage-body',
  'chăm sóc da cơ bản': 'cham-soc-da',
  'combo gội csoc da': 'combo-goi-da',
  'triệt lông': 'triet-long',
};

const srcFiles = fs.readdirSync(srcDir);

for (const srcFile of srcFiles) {
  if (!srcFile.endsWith('.png')) continue;
  const norm = srcFile.normalize('NFC').replace('.png', '').trim();
  const serviceCode = fileMap[norm];
  if (!serviceCode) {
    console.warn(`Unmapped file: ${srcFile} (${norm})`);
    continue;
  }

  const srcPath = path.join(srcDir, srcFile);
  const destServicePath = path.join(destServicesDir, `${serviceCode}.png`);
  const destBannerPath = path.join(destBannersDir, `banner_${serviceCode.replace(/-/g, '_')}.png`);

  fs.copyFileSync(srcPath, destServicePath);
  fs.copyFileSync(srcPath, destBannerPath);

  const stat = fs.statSync(destServicePath);
  console.log(`Copied [${norm}] -> /services/${serviceCode}.png (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

console.log('All service banner files copied successfully!');
