const fs = require('fs');

// 1. GovSchemes.tsx
let schemes = fs.readFileSync('src/pages/GovSchemes.tsx', 'utf8');
schemes = schemes.replace(/bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200\/60 hover:shadow-lg/g, 'bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1');
fs.writeFileSync('src/pages/GovSchemes.tsx', schemes);

// 2. AgroStore.tsx
let store = fs.readFileSync('src/pages/AgroStore.tsx', 'utf8');
store = store.replace(/bg-white rounded-2xl overflow-hidden border border-slate-200\/80 shadow-sm hover:shadow-xl/g, 'bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1');
store = store.replace(/w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl/g, 'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-[0.98]');
fs.writeFileSync('src/pages/AgroStore.tsx', store);

console.log('Cards improved');
