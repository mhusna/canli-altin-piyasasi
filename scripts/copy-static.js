const fs = require('fs').promises;
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const IGNORES = ['node_modules', 'dist', '.git'];
const EXT = ['.html', '.css'];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full);
    if (IGNORES.some(i => rel.split(path.sep)[0] === i)) continue;
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile()) {
      if (EXT.includes(path.extname(entry.name))) {
        const dest = path.join(out, rel);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.copyFile(full, dest);
        console.log('copied', rel);
      }
    }
  }
}

walk(root).catch(err => {
  console.error(err);
  process.exit(1);
});
