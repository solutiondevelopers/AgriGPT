const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-\[\#09090b\]/g, to: 'bg-slate-50' },
  { from: /bg-zinc-950/g, to: 'bg-slate-50' },
  { from: /bg-\[\#18181b\]/g, to: 'bg-white' },
  { from: /bg-zinc-900/g, to: 'bg-white' },
  { from: /border-zinc-800\/50/g, to: 'border-slate-200' },
  { from: /border-zinc-800/g, to: 'border-slate-200' },
  { from: /border-zinc-700\/50/g, to: 'border-slate-300' },
  { from: /border-zinc-700/g, to: 'border-slate-300' },
  { from: /text-zinc-100/g, to: 'text-slate-900' },
  { from: /text-zinc-200/g, to: 'text-slate-800' },
  { from: /text-zinc-300/g, to: 'text-slate-700' },
  { from: /text-zinc-400/g, to: 'text-slate-600' },
  { from: /text-zinc-500/g, to: 'text-slate-500' },
  { from: /text-zinc-600/g, to: 'text-slate-400' },
  { from: /text-zinc-700/g, to: 'text-slate-300' },
  { from: /bg-zinc-800\/80/g, to: 'bg-slate-100' },
  { from: /bg-zinc-800\/50/g, to: 'bg-slate-100' },
  { from: /bg-zinc-800\/40/g, to: 'bg-slate-50' },
  { from: /bg-zinc-800\/30/g, to: 'bg-slate-50' },
  { from: /bg-zinc-800/g, to: 'bg-slate-100' },
  { from: /bg-zinc-700\/50/g, to: 'bg-slate-200' },
  { from: /bg-zinc-700/g, to: 'bg-slate-200' },
  { from: /hover:bg-zinc-800\/50/g, to: 'hover:bg-slate-100' },
  { from: /hover:bg-zinc-800\/40/g, to: 'hover:bg-slate-100' },
  { from: /hover:bg-zinc-800\/30/g, to: 'hover:bg-slate-100' },
  { from: /hover:bg-zinc-800/g, to: 'hover:bg-slate-100' },
  { from: /hover:bg-zinc-700\/50/g, to: 'hover:bg-slate-200' },
  { from: /hover:bg-zinc-700/g, to: 'hover:bg-slate-200' },
  { from: /hover:text-zinc-100/g, to: 'hover:text-slate-900' },
  { from: /hover:text-zinc-200/g, to: 'hover:text-slate-800' },
  { from: /hover:text-zinc-300/g, to: 'hover:text-slate-700' },
  { from: /placeholder-zinc-500/g, to: 'placeholder-slate-400' },
  { from: /placeholder-zinc-600/g, to: 'placeholder-slate-300' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./src');
console.log('Done mapping theme.');
