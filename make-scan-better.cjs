const fs = require('fs');

let scan = fs.readFileSync('src/pages/DiseaseScan.tsx', 'utf8');

// Container
scan = scan.replace('bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col',
                    'bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col');

// Analysis details box
scan = scan.replace('bg-white border border-slate-200 rounded-2xl p-4 space-y-4 relative overflow-hidden',
                    'bg-slate-50/50 border border-slate-100 rounded-3xl p-5 sm:p-6 space-y-4 relative overflow-hidden');

fs.writeFileSync('src/pages/DiseaseScan.tsx', scan);
console.log('Scan improved');
