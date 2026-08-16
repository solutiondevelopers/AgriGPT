import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CartDrawer } from './CartDrawer';
import { CopilotDrawer } from './CopilotDrawer';
import { BottomNav } from './BottomNav';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 relative bg-slate-50 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-hidden relative max-md:pb-[calc(4rem+env(safe-area-inset-bottom))] flex flex-col">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <CartDrawer />
      <CopilotDrawer />
    </div>
  );
}
