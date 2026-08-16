import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Menu, ChevronDown, User, LogOut, ShoppingCart, Sparkles, X, CheckCircle2, AlertTriangle, TrendingUp, ArrowLeft } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const { items, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Weather Alert', message: 'Heavy rain expected tomorrow in your area.', type: 'alert', read: false, time: '10m ago' },
    { id: 2, title: 'Market Update', message: 'Wheat prices increased by ₹500/t today.', type: 'market', read: false, time: '2h ago' },
    { id: 3, title: 'Task Reminder', message: 'Irrigation scheduled for Sector 4 at 16:00.', type: 'task', read: true, time: '5h ago' }
  ]);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const openCopilot = () => {
    window.dispatchEvent(new CustomEvent('open-copilot'));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 flex items-center justify-between px-3 sm:px-6 z-10 sticky top-0 shrink-0">
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {location.pathname !== '/' && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors shrink-0"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors shrink-0"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
          <span className="text-slate-900 font-bold tracking-tight"><span className="text-emerald-600">Agri</span>GPT</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <button className="hidden sm:flex items-center gap-1.5 text-slate-700 font-medium hover:bg-slate-100 px-3 py-1.5 min-h-[32px] text-xs rounded-md transition-colors text-xs">
            AgriGPT Pro <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <LanguageSwitcher />
        <button
          onClick={openCopilot}
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-h-[32px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-600/20 text-xs font-bold transition-all"
          title="Open embedded AgriGPT Assistant"
        >
          <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="Shopping Cart"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItemCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 origin-top-right">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 \${!notification.read ? 'bg-emerald-50/30' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notification.type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                        {notification.type === 'market' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                        {notification.type === 'task' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-semibold truncate pr-2 \${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] font-medium text-slate-500 shrink-0">{notification.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-100 mx-0.5 sm:mx-1"></div>
        <div className="flex items-center gap-2 ml-0.5">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-medium text-slate-800 leading-none">{user?.name || 'Guest'}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 capitalize">{user?.role || 'user'}</div>
          </div>
          <button className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-emerald-600 font-bold hover:border-emerald-500 transition-colors uppercase text-xs">
            {user?.name?.[0] || <User className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
