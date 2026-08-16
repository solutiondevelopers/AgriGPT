import React from 'react';
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-40 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-emerald-600 bg-emerald-50/50 rounded-xl' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-emerald-100' : ''}`} />
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
