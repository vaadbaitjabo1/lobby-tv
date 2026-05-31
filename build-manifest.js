const fs = require('fs');
const path = require('path');

// Windows paths for the deploy directory
const baseDir = 'C:\\Alon\\Claude\\lobby-tv\\deploy-tmp';
const files = [];

function walk(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (!entry.endsWith('.gif')) {
      const rel = path.relative(baseDir, full).split(path.sep).join('/');
      const content = fs.readFileSync(full, 'utf8');
      files.push({ filename: rel, content });
    }
  }
}

walk(baseDir);

const manifest = {
  files,
  deletePaths: ['src/main.tsx', 'src/App.tsx']
};

fs.writeFileSync('C:\\Alon\\Claude\\lobby-tv\\manifest.json', JSON.stringify(manifest));
console.log('Manifest with', files.length, 'files:');
files.forEach(f => console.log(' -', f.filename));
