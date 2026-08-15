import React from 'react';
import { Sprout, MessageSquare, Plus, Compass, Settings, BarChart, CloudRain, Bug, Box, Store, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const recentChats = [
  "Should I grow cotton this season?",
  "Rainfall trend last 5 years",
  "Buy certified wheat seeds",
  "Compare soybean and wheat",
  "Disease detection for tomato",
];

const menuItems = [
  { icon: BarChart, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "AI Copilot", path: "/chat" },
  { icon: Box, label: "3D Farm View", path: "/3d-view" },
  { icon: Store, label: "AgroStore", path: "/store" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
      />

      <aside className="fixed md:relative inset-y-0 left-0 z-50 w-[260px] flex-shrink-0 bg-[#09090b] border-r border-zinc-800/50 flex flex-col h-full transition-all duration-300 shadow-2xl md:shadow-none">
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/30">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center border border-emerald-500/30 mr-2.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">AgriGPT OS</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-zinc-400 hover:text-zinc-200 rounded-md"
          >
            ✕
          </button>
        </div>
        
        <div className="p-3">
          <button 
            onClick={() => {
              navigate('/chat');
              window.dispatchEvent(new CustomEvent('new-chat'));
              handleNavClick();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-xs font-semibold hover:bg-white transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>

        <div className="px-3 py-2 space-y-0.5">
          {menuItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-zinc-800/50 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200"
                )
              }
            >
              <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-2">Recent</div>
          <div className="space-y-0.5">
            {recentChats.map((chat, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate('/chat');
                  window.dispatchEvent(new CustomEvent('open-copilot', { detail: { prompt: chat } }));
                  handleNavClick();
                }}
                className="w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all duration-200 text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200 group"
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="truncate">{chat}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-3 border-t border-zinc-800/50 space-y-0.5">
          <NavLink 
            to="/settings"
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                "w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-all duration-200 group",
                isActive
                  ? "bg-zinc-800/50 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200"
              )
            }
          >
            <Settings className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-medium">Settings</span>
          </NavLink>
          <button onClick={() => { logout(); handleNavClick(); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-all duration-200 text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200 hover:text-red-400 group">
            <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

