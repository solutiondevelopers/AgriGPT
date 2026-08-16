const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// The header class currently uses:
// "h-16 shadow-sm bg-white/80 backdrop-blur-xl border-b border-slate-200/60 border-b border-slate-200 flex items-center justify-between px-2.5 sm:px-4 z-10 sticky top-0 transition-all shrink-0"

header = header.replace(
  'h-16 shadow-sm bg-white/80 backdrop-blur-xl border-b border-slate-200/60 border-b border-slate-200 flex items-center justify-between px-2.5 sm:px-4 z-10 sticky top-0 transition-all shrink-0',
  'h-16 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 flex items-center justify-between px-3 sm:px-6 z-10 sticky top-0 shrink-0'
);

// Copilot button currently uses:
// "flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-h-[32px] bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
header = header.replace(
  'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg',
  'bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-600/20'
);
// Fix the icon color inside the button from emerald-600 to white
header = header.replace('<Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />', '<Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />');

fs.writeFileSync('src/components/Header.tsx', header);
console.log('Header improved');
