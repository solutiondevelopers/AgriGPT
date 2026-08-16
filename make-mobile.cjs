const fs = require('fs');

// 1. Create BottomNav
const bottomNavCode = `import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Store, Bug, Landmark } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function BottomNav() {
  const { t } = useLanguage();
  
  const navItems = [
    { icon: MessageSquare, label: t('nav.chat'), path: "/" },
    { icon: Store, label: t('nav.store'), path: "/store" },
    { icon: Bug, label: t('nav.diseaseScan'), path: "/scan" },
    { icon: Landmark, label: t('nav.schemes'), path: "/schemes" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                \`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors \${
                  isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl'
                }\`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={\`w-6 h-6 \${isActive ? 'fill-emerald-100' : ''}\`} />
                  <span className="text-[10px] font-bold leading-none tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
`;
fs.writeFileSync('src/components/BottomNav.tsx', bottomNavCode);

// 2. Update Layout.tsx
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
if (!layout.includes('BottomNav')) {
  layout = layout.replace("import { CopilotDrawer } from './CopilotDrawer';", "import { CopilotDrawer } from './CopilotDrawer';\nimport { BottomNav } from './BottomNav';");
  layout = layout.replace('<main className="flex-1 overflow-hidden relative">', '<main className="flex-1 overflow-hidden relative pb-16 md:pb-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}>');
  // Need to also set style so md overrides it if necessary, but actually we can just use tailwind classes if we had safe area plugin.
  // Wait, let's just use CSS.
  layout = layout.replace('style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}', 'className="flex-1 overflow-hidden relative max-md:pb-[calc(4rem+env(safe-area-inset-bottom))]"');
  // So:
  layout = layout.replace('<main className="flex-1 overflow-hidden relative max-md:pb-[calc(4rem+env(safe-area-inset-bottom))]">', ''); // in case I messed up
  
  // Actually, I'll just do a clean replace:
  layout = layout.replace('<main className="flex-1 overflow-hidden relative">', '<main className="flex-1 overflow-hidden relative max-md:pb-[calc(4rem+env(safe-area-inset-bottom))]">');
  
  layout = layout.replace('<CartDrawer />', '<BottomNav />\n      <CartDrawer />');
  fs.writeFileSync('src/components/Layout.tsx', layout);
}

// 3. Update index.html
let index = fs.readFileSync('index.html', 'utf8');
if (!index.includes('apple-mobile-web-app-capable')) {
  index = index.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0" />', 
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />\n    <meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="apple-mobile-web-app-status-bar-style" content="default">\n    <meta name="theme-color" content="#10b981">\n    <link rel="manifest" href="/manifest.json">');
  fs.writeFileSync('index.html', index);
}

// 4. Create manifest.json
const manifest = {
  "name": "AgriGPT OS",
  "short_name": "AgriGPT",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ecfdf5",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.51c-.32-.74-.84-1.38-1.46-1.87-.14-.11-.3-.21-.46-.3l-1.99-1.22c-.22-.13-.48-.2-.74-.2h-.85v-1.5c0-.83-.67-1.5-1.5-1.5h-1v-2h1c1.1 0 2-.9 2-2v-1.1c1.39.49 2.58 1.4 3.4 2.53.59 1.1.93 2.36.93 3.67 0 1.25-.32 2.44-.88 3.51l-.45-.02z'/%3E%3C/svg%3E",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
};
fs.writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2));

console.log('Mobile app conversion setup completed.');
