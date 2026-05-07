import { readFileSync, existsSync } from 'node:fs';

const files = ['index.html', 'src/main.js', 'src/styles.css', 'public/games/index.html'];
for (const file of files) {
  if (!existsSync(file)) throw new Error(`${file} missing`);
  if (!readFileSync(file, 'utf8').trim()) throw new Error(`${file} empty`);
}

const main = readFileSync('src/main.js', 'utf8');
const gameCount = [...main.matchAll(/Title: '/g)].length;
const cosmeticCount = [...main.matchAll(/slot: '/g)].length;

if (gameCount < 20) throw new Error(`expected at least 20 games, found ${gameCount}`);
if (cosmeticCount < 12) throw new Error(`expected at least 12 cosmetics, found ${cosmeticCount}`);

for (const needle of ['Thumbnail_URL', 'Game_URL', 'Category', 'showRewardedVideo', 'saveAvatarToFirestore', 'globalChat', 'game-grid', 'Avatar Shop', 'PixelVibe', 'PIXELVIBE_FIREBASE_CONFIG']) {
  if (!main.includes(needle) && !readFileSync('src/styles.css', 'utf8').includes(needle)) {
    throw new Error(`missing ${needle}`);
  }
}

console.log(`Smoke test passed: ${gameCount} games, ${cosmeticCount} cosmetics, shop/chat/rewards/grid present.`);
