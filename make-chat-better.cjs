const fs = require('fs');

let chat = fs.readFileSync('src/pages/AdvisorChat.tsx', 'utf8');

// Update form styling
chat = chat.replace('flex flex-col bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden focus-within:border-zinc-600 transition-colors',
                    'flex flex-col bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all');

// Submit button rounding
chat = chat.replace('w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r',
                    'w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r');

// Textarea tweaks
chat = chat.replace('className="bg-transparent border-none text-base font-bold flex-1 outline-none text-slate-800 placeholder:text-slate-500 min-h-[56px] max-h-40 resize-none py-4 px-4 scrollbar-thin"',
                    'className="bg-transparent border-none text-[15px] font-medium flex-1 outline-none text-slate-800 placeholder:text-slate-400 min-h-[52px] max-h-40 resize-none py-3.5 px-5 scrollbar-thin"');

// Fix message styling
// Currently:
// "p-4 sm:p-6 rounded-2xl mb-4 border transition-all",
// message.role === 'user' 
//  ? "bg-white border-slate-200 shadow-sm ml-auto max-w-[85%]" 
//  : "bg-emerald-50/50 border-emerald-500/10 mr-auto w-full"

chat = chat.replace(
  '"p-4 sm:p-6 rounded-2xl mb-4 border transition-all",',
  '"p-4 sm:p-5 rounded-3xl mb-4 border transition-all",\n                    message.role === \'user\' ? "rounded-br-sm" : "rounded-bl-sm",'
);

chat = chat.replace(
  '? "bg-white border-slate-200 shadow-sm ml-auto max-w-[85%]" \n                    : "bg-emerald-50/50 border-emerald-500/10 mr-auto w-full"',
  '? "bg-emerald-600 text-white border-transparent shadow-md ml-auto max-w-[85%]" \n                    : "bg-white border-slate-200 shadow-sm mr-auto w-[95%] sm:max-w-[85%]"'
);

// If I changed the user background, I must also make sure text inside is readable
// In AdvisorChat.tsx, the user text is:
chat = chat.replace('<div className="whitespace-pre-wrap font-medium text-slate-900">', '<div className="whitespace-pre-wrap text-[15px] leading-relaxed">');

// For bot text color
chat = chat.replace('<div className="text-sm text-slate-700 leading-relaxed space-y-2">', '<div className="text-[15px] text-slate-800 leading-relaxed space-y-2">');

// Fix the role icons
// AI icon
chat = chat.replace('<div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">',
                    '<div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">');

// User icon (hide it since it's an imessage style bubble now, or make it circular)
chat = chat.replace('<div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">',
                    '<div className="hidden">');

// Name tags
// For user
chat = chat.replace('<div className="text-sm font-semibold mb-1 text-slate-900">{t(\'chat.you\') || \'You\'}</div>',
                    '<div className="hidden">');
// For AI
chat = chat.replace('<div className="text-sm font-semibold mb-1 text-slate-900">AgriGPT</div>',
                    '<div className="text-xs font-bold mb-1 text-emerald-600 tracking-wide uppercase">AgriGPT</div>');

fs.writeFileSync('src/pages/AdvisorChat.tsx', chat);
console.log('Done chat layout');
