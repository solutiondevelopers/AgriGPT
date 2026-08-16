const fs = require('fs');
let analytics = fs.readFileSync('src/pages/AnalyticsDashboard.tsx', 'utf8');

analytics = analytics.replace(/bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-\[90vh\] overflow-y-auto shadow-2xl relative/g,
                              'bg-white border border-slate-100 rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-200/50 relative');

analytics = analytics.replace(/bg-white border border-emerald-200 rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-\[90vh\] overflow-y-auto shadow-\[0_0_20px_rgba\(16,185,129,0\.15\)\] relative/g,
                              'bg-white border border-emerald-100 rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(16,185,129,0.1)] relative');

fs.writeFileSync('src/pages/AnalyticsDashboard.tsx', analytics);
console.log('Analytics improved');
