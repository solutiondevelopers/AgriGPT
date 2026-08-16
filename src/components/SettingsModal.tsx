import React, { useState } from 'react';
import { X, Moon, Sun, Volume2, Globe, Shield, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceAssistant, setVoiceAssistant] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{t('nav.settings') || 'Settings'}</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 space-y-1">
          {/* Settings Options */}
          <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Globe className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Language</p>
                <p className="text-xs text-slate-500">Choose your preferred language</p>
              </div>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-100 border-none text-sm font-semibold text-slate-700 rounded-lg p-2 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
          
          <div 
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle dark theme</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${darkMode ? 'left-6' : 'left-0.5'}`}></div>
            </div>
          </div>
          
          <div 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bell className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                <p className="text-xs text-slate-500">Manage alerts and updates</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${notificationsEnabled ? 'left-6' : 'left-0.5'}`}></div>
            </div>
          </div>

          <div 
            onClick={() => setVoiceAssistant(!voiceAssistant)}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Volume2 className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Voice Assistant</p>
                <p className="text-xs text-slate-500">Auto-speak AI responses</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${voiceAssistant ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${voiceAssistant ? 'left-6' : 'left-0.5'}`}></div>
            </div>
          </div>

          <div 
            onClick={() => alert('Privacy dashboard opening soon!')}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-50 text-zinc-600 rounded-lg"><Shield className="w-5 h-5" /></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Privacy</p>
                <p className="text-xs text-slate-500">Manage data permissions</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Manage</div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center flex justify-between items-center">
          <p className="text-xs text-slate-500">AgriGPT OS v1.0.0</p>
          <button className="text-xs text-slate-500 underline hover:text-slate-800">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
