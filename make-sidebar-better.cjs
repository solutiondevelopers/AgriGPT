const fs = require('fs');

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

sidebar = sidebar.replace('bg-white/80 backdrop-blur-xl border-r border-slate-200/60',
                          'bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]');

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
console.log('Sidebar improved');
