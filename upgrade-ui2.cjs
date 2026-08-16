const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Upgrade main brand colors (Emerald to a vibrant Emerald-Teal gradient)
    content = content.replace(/bg-emerald-600 hover:bg-emerald-500/g, 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30');
    content = content.replace(/bg-emerald-600/g, 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20');
    
    // 2. Increase button paddings and add min-height for touch targets
    // Small buttons
    content = content.replace(/px-2\.5 py-1\.5/g, 'px-4 py-2 min-h-[44px]');
    content = content.replace(/px-2 py-1/g, 'px-4 py-2 min-h-[44px]');
    // Medium buttons
    content = content.replace(/px-3\.5 py-2/g, 'px-6 py-3 min-h-[48px] text-base');
    content = content.replace(/px-3 py-2/g, 'px-5 py-3 min-h-[48px]');
    content = content.replace(/px-4 py-2/g, 'px-6 py-3 min-h-[48px]');
    // Large buttons
    content = content.replace(/px-5 py-2\.5/g, 'px-8 py-4 min-h-[56px] text-lg');
    content = content.replace(/py-2\.5/g, 'py-3 min-h-[48px]');
    content = content.replace(/py-3/g, 'py-4 min-h-[56px] text-lg');
    
    // 3. Make text bigger in buttons (specifically targeting text-xs which is too small for farmers)
    // This regex is a bit simplistic but works for tailwind class strings
    content = content.replace(/text-xs(?=[^"']*rounded)/g, 'text-sm font-semibold');
    content = content.replace(/text-xs(?=[^"']*min-h)/g, 'text-sm font-semibold');
    content = content.replace(/text-sm(?=[^"']*min-h-\[56px\])/g, 'text-base font-bold');

    // 4. Increase specific icons inside buttons
    content = content.replace(/w-3\.5 h-3\.5/g, 'w-5 h-5');
    content = content.replace(/w-4 h-4(?=[^"']*min-h)/g, 'w-6 h-6');

    // 5. Layout backgrounds (Layout.tsx)
    if (file.includes('Layout.tsx')) {
        content = content.replace(/bg-slate-50/g, 'bg-gradient-to-br from-emerald-50 via-green-50/30 to-teal-50');
    }

    // 6. Sidebar (Sidebar.tsx)
    if (file.includes('Sidebar.tsx')) {
        content = content.replace(/bg-emerald-50 text-emerald-600/g, 'bg-gradient-to-r from-emerald-100 to-teal-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-sm');
        content = content.replace(/text-slate-600 hover:bg-slate-50 hover:text-slate-900/g, 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700');
        content = content.replace(/p-2 rounded-xl/g, 'p-3 rounded-xl min-h-[52px]'); // Bigger nav items
    }

    // 7. Input fields for better typing
    content = content.replace(/px-3 py-2 text-sm/g, 'px-4 py-3 text-base min-h-[48px]');
    content = content.replace(/p-3 text-sm/g, 'p-4 text-base min-h-[56px]');

    if (content !== original) {
        fs.writeFileSync(file, content);
    }
});

console.log('UI Upgraded: Colors, Sizes, and Touch Targets');
