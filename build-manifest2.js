const fs = require('fs');
const p = require('path');
const base = 'C:/tmp/lobby-tv-deploy';
const out = [];
const skip = new Set(['src/main.jsx','src/App.jsx']);

function slashify(s) { return s.split('\\').join('/'); }

function walk(d) {
  fs.readdirSync(d).forEach(function(e) {
    const f = slashify(p.join(d, e));
    if (fs.statSync(f).isDirectory()) { walk(f); return; }
    if (e.endsWith('.gif')) return;
    const rel = f.replace(base + '/', '');
    if (skip.has(rel)) return;
    out.push({filename: rel, content: fs.readFileSync(f,'utf8')});
  });
}
walk(base);

out.push({filename:'src/main.tsx', content: fs.readFileSync(base+'/src/main.jsx','utf8')});
out.push({filename:'src/App.tsx',  content: fs.readFileSync(base+'/src/App.jsx','utf8')});
out.push({filename:'tsconfig.json', content: JSON.stringify({
  compilerOptions:{
    target:"ES2020",
    lib:["ES2020","DOM","DOM.Iterable"],
    module:"ESNext",
    skipLibCheck:true,
    moduleResolution:"bundler",
    allowImportingTsExtensions:true,
    isolatedModules:true,
    moduleDetection:"force",
    noEmit:true,
    jsx:"react-jsx",
    strict:false,
    allowJs:true,
    checkJs:false
  },
  include:["src"]
},null,2)});

fs.writeFileSync('C:/tmp/manifest2.json', JSON.stringify({files:out}));
console.log('Done:', out.length, 'files');
out.forEach(function(f) { console.log(' -', f.filename); });
