const https = require('https');
const fs = require('fs');
const path = require('path');

const PHOTO_IDS = [
  'photo-1540555700478-4be289fbecef',
  'photo-1600334089648-b0d9d3028eb2',
  'photo-1519823551278-64ac92734fb1',
  'photo-1570172619644-dfd03ed5d881',
  'photo-1515377905703-c4788e51af15',
  'photo-1544161515-4ab6ce6db874',
  'photo-1596178065887-1198b6148b2b',
  'photo-1560750588-73207b1ef5b8',
  'photo-1522337360788-8b13dee7a37e',
  'photo-1507652313519-d4e9174996dd',
  'photo-1519415510236-718bdfcd89c8',
  'photo-1527799820374-dcf8d9d4a388',
  'photo-1583417319070-4a69db38a482',
  'photo-1598256989800-fe5f95da9787',
  'photo-1516975080664-ed2fc6a32937',
  'photo-1544717305-2782549b5136',
  'photo-1532980400857-e8d9d275d858',
  'photo-1544717302-de2939b7ef71',
  'photo-1591343395082-e120087004b4',
  'photo-1506126613408-eca07ce68773',
  'photo-1576091160399-112ba8d25d1d',
  'photo-1576091160550-2173dba999ef',
  'photo-1588776814546-1ffcf47267a5',
  'photo-1563245372-f21724e3856d',
  'photo-1535585209827-a15fcdbc4c2d',
  'photo-1544367567-0f2fcb009e0b',
  'photo-1519699047748-de8e457a634e',
  'photo-1526947425960-945c6e72858f',
  'photo-1552693673-1bf958298935',
  'photo-1616394584738-fc6e612e71b9',
  'photo-1571019613454-1cb2f99b2d8b',
  'photo-1521590832167-7bcbfaa6381f',
  'photo-1562322140-8baeececf3df',
  'photo-1522337660859-02fbefca4702',
  'photo-1600334129128-685c5582fd35',
  'photo-1517457373958-b7bdd4587205'
];

const REVIEW_PHOTO_IDS = [
  'photo-1588776814546-1ffcf47267a5', // welcome herbal tea
  'photo-1540555700478-4be289fbecef', // stone and towel
  'photo-1519823551278-64ac92734fb1', // candlelight relaxing
  'photo-1570172619644-dfd03ed5d881', // facial mask
  'photo-1596178065887-1198b6148b2b', // head wash bowl
];

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redRes) => {
          const file = fs.createWriteStream(destPath);
          redRes.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading realistic spa images...');
  const spaDir = path.join(__dirname, '../public/spas');
  const reviewDir = path.join(__dirname, '../public/reviews');

  for (let i = 0; i < PHOTO_IDS.length; i++) {
    const id = PHOTO_IDS[i];
    const numStr = String(i + 1).padStart(2, '0');
    const dest = path.join(spaDir, `spa_real_${numStr}.jpg`);
    const url = `https://images.unsplash.com/${id}?w=900&auto=format&fit=crop&q=80`;
    try {
      await downloadImage(url, dest);
      console.log(`[${i + 1}/${PHOTO_IDS.length}] Downloaded ${dest}`);
    } catch (err) {
      console.error(`Error downloading ${id}:`, err.message);
    }
  }

  for (let i = 0; i < REVIEW_PHOTO_IDS.length; i++) {
    const id = REVIEW_PHOTO_IDS[i];
    const dest = path.join(reviewDir, `review_${i + 4}.jpg`);
    const url = `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop&q=80`;
    try {
      await downloadImage(url, dest);
      console.log(`Downloaded review photo: ${dest}`);
    } catch (err) {
      console.error(`Error downloading review ${id}:`, err.message);
    }
  }

  console.log('All image downloads completed!');
}

main().catch(console.error);
