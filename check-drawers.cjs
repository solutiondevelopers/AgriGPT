const fs = require('fs');

let copilot = fs.readFileSync('src/components/CopilotDrawer.tsx', 'utf8');
if (copilot.includes('bg-[#09090b]') || copilot.includes('zinc')) {
    copilot = copilot.replace(/bg-\[\#09090b\]/g, 'bg-white');
    copilot = copilot.replace(/border-zinc-800\/50/g, 'border-slate-200');
    copilot = copilot.replace(/border-zinc-800/g, 'border-slate-200');
    copilot = copilot.replace(/border-zinc-700/g, 'border-slate-300');
    copilot = copilot.replace(/text-zinc-100/g, 'text-slate-900');
    copilot = copilot.replace(/text-zinc-400/g, 'text-slate-500');
    copilot = copilot.replace(/text-zinc-500/g, 'text-slate-400');
    copilot = copilot.replace(/bg-zinc-800\/50/g, 'bg-slate-100');
    copilot = copilot.replace(/bg-zinc-900/g, 'bg-slate-50');
    fs.writeFileSync('src/components/CopilotDrawer.tsx', copilot);
    console.log('Copilot updated');
}

let cart = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
if (cart.includes('bg-[#18181b]') || cart.includes('zinc')) {
    cart = cart.replace(/bg-\[\#18181b\]/g, 'bg-white');
    cart = cart.replace(/bg-\[\#09090b\]/g, 'bg-slate-50');
    cart = cart.replace(/border-zinc-800\/50/g, 'border-slate-200');
    cart = cart.replace(/border-zinc-800/g, 'border-slate-200');
    cart = cart.replace(/text-zinc-100/g, 'text-slate-900');
    cart = cart.replace(/text-zinc-400/g, 'text-slate-500');
    cart = cart.replace(/text-zinc-500/g, 'text-slate-400');
    cart = cart.replace(/bg-zinc-800\/50/g, 'bg-slate-100');
    cart = cart.replace(/bg-zinc-900/g, 'bg-slate-50');
    fs.writeFileSync('src/components/CartDrawer.tsx', cart);
    console.log('Cart updated');
}
