const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
// Fix Header background
header = header.replace(/bg-slate-50\/80 backdrop-blur-md/g, 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60');
// Add a subtle shadow
header = header.replace(/header className="h-14/g, 'header className="h-16 shadow-sm');
// Make the logo look like AgriGPT
header = header.replace(/AgriGPT OS/g, '<span className="text-emerald-600">Agri</span>GPT');
// Fix buttons
header = header.replace(/bg-emerald-500\/10 hover:bg-emerald-500\/20/g, 'bg-emerald-50 hover:bg-emerald-100');
header = header.replace(/border-emerald-500\/30/g, 'border-emerald-200');
fs.writeFileSync('src/components/Header.tsx', header);

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
// Fix Sidebar background
sidebar = sidebar.replace(/bg-slate-50/g, 'bg-white');
sidebar = sidebar.replace(/border-slate-200/g, 'border-slate-200 shadow-sm');
// NavLinks active state
sidebar = sidebar.replace(/bg-slate-100 text-slate-900 font-medium/g, 'bg-emerald-50 text-emerald-700 font-semibold border-r-2 border-emerald-500');
// Remove some hover text colors if they are weird
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

console.log('UI updated');
