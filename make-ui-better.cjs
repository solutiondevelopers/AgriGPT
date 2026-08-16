const fs = require('fs');

// 1. Layout.tsx
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(/bg-gradient-to-br from-emerald-50 via-green-50\/30 to-teal-50/g, 'bg-slate-50');
fs.writeFileSync('src/components/Layout.tsx', layout);

// 2. BottomNav.tsx
let bottomNav = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
bottomNav = bottomNav.replace('bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40', 'bg-white/80 backdrop-blur-xl border-t border-slate-200 z-40 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.05)]');
bottomNav = bottomNav.replace(
  "isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl'",
  "isActive ? 'text-emerald-600 bg-emerald-50/50 rounded-xl' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl'"
);
fs.writeFileSync('src/components/BottomNav.tsx', bottomNav);

console.log('Done script 1');
