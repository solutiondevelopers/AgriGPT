import React, { useState, useEffect } from 'react';
import { 
  User, 
  Map, 
  Bot, 
  Globe, 
  Mic, 
  Bell, 
  Shield, 
  Lock, 
  Palette, 
  Accessibility, 
  UserCog,
  Save,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

type SettingsTab = 
  | 'Profile' | 'Farm Profile' | 'AI Preferences' | 'Language' 
  | 'Voice' | 'Notifications' | 'Privacy' | 'Security' 
  | 'Appearance' | 'Accessibility' | 'Account';

const SETTINGS_CATEGORIES: { id: SettingsTab; icon: React.ElementType; label: string }[] = [
  { id: 'Profile', icon: User, label: 'Profile' },
  { id: 'Farm Profile', icon: Map, label: 'Farm Profile' },
  { id: 'AI Preferences', icon: Bot, label: 'AI Preferences' },
  { id: 'Language', icon: Globe, label: 'Language' },
  { id: 'Voice', icon: Mic, label: 'Voice Settings' },
  { id: 'Notifications', icon: Bell, label: 'Notifications' },
  { id: 'Privacy', icon: Shield, label: 'Privacy' },
  { id: 'Security', icon: Lock, label: 'Security' },
  { id: 'Appearance', icon: Palette, label: 'Appearance' },
  { id: 'Accessibility', icon: Accessibility, label: 'Accessibility' },
  { id: 'Account', icon: UserCog, label: 'Account' },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your enterprise farm configuration and AI preferences.</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Settings Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-zinc-800 overflow-y-auto scrollbar-thin py-4 px-3">
          <nav className="space-y-1">
            {SETTINGS_CATEGORIES.map((category) => {
              const isActive = activeTab === category.id;
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-zinc-800 text-emerald-400" 
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#0c0c0e] p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-zinc-100">{activeTab}</h2>
              </div>
              
              <div className="space-y-6">
                {activeTab === 'Profile' && <ProfileSettings />}
                {activeTab === 'Farm Profile' && <FarmSettings />}
                {activeTab === 'AI Preferences' && <AIPrefSettings />}
                {activeTab === 'Language' && <LanguageSettings />}
                {activeTab === 'Voice' && <VoiceSettings />}
                {activeTab === 'Notifications' && <NotificationsSettings />}
                {activeTab === 'Privacy' && <PrivacySettings />}
                {activeTab === 'Security' && <SecuritySettings />}
                {activeTab === 'Appearance' && <AppearanceSettings />}
                {activeTab === 'Accessibility' && <AccessibilitySettings />}
                {activeTab === 'Account' && <AccountSettings />}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for specific settings panels

function ProfileSettings() {
  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Full Name</label>
            <input type="text" defaultValue="Ramesh Patil" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Email Address</label>
            <input type="email" defaultValue="ramesh.patil@example.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Phone Number</label>
            <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from '../contexts/AuthContext';

function FarmSettings() {
  const [farmName, setFarmName] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const token = localStorage.getItem('agrigpt_token');
        if (!token) return;
        
        const res = await fetch('/api/farms', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.farm) {
            setFarmName(data.farm.name || '');
            setState(data.farm.location?.state || 'Maharashtra');
            setDistrict(data.farm.location?.district || '');
            setTotalArea(data.farm.totalAreaInAcres?.toString() || '');
          }
        }
      } catch (error) {
        console.error("Failed to fetch farm data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFarm();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('agrigpt_token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: farmName,
          location: { state, district },
          totalAreaInAcres: Number(totalArea)
        })
      });

      if (!res.ok) throw new Error('Failed to save farm profile');
      
      setMessage({ text: 'Farm profile saved successfully.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Error saving profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-zinc-200">Primary Farm Location</h3>
          {message.text && (
            <span className={`text-xs px-2 py-1 rounded-md ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {message.text}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-zinc-400">Farm Name</label>
            <input 
              type="text" 
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Patil Agro Farms" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">State</label>
            <select 
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option>Maharashtra</option>
              <option>Gujarat</option>
              <option>Madhya Pradesh</option>
              <option>Karnataka</option>
              <option>Punjab</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">District</label>
            <input 
              type="text" 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Pune" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-zinc-400">Total Area (Acres)</label>
            <input 
              type="number" 
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="12.5" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" 
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

function AIPrefSettings() {
  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Copilot Behavior</h3>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Proactive Recommendations</span>
              <span className="text-xs text-zinc-500">Allow AgriGPT to suggest actions based on your farm data and weather forecasts automatically.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Use Local APMC Prices</span>
              <span className="text-xs text-zinc-500">Prioritize market data from your nearest APMC mandi when discussing crop prices.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function LanguageSettings() {
  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Regional Language Configuration</h3>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Primary Interface Language</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors">
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Copilot Spoken Language Response</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors">
              <option value="mr">मराठी (Marathi) - Preferred for farming context</option>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
            <p className="text-[10px] text-zinc-500 mt-1">
              Note: Even if the interface is in English, you can configure the AI to reply to voice queries in Marathi.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Language Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function VoiceSettings() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputLanguage, setInputLanguage] = useState('auto');
  const [outputLanguage, setOutputLanguage] = useState('mr');
  const [voiceQuality, setVoiceQuality] = useState('standard');
  const [speakingRate, setSpeakingRate] = useState(1);

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Voice Input & Output Settings</h3>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Enable Voice Input</span>
              <span className="text-xs text-zinc-500">Allow microphone access for voice commands and queries.</span>
            </div>
          </label>

          {voiceEnabled && (
            <>
              <div className="space-y-1.5 pt-3 border-t border-zinc-800">
                <label className="text-xs font-medium text-zinc-400">Input Language Detection</label>
                <select 
                  value={inputLanguage}
                  onChange={(e) => setInputLanguage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="auto">Auto-detect (Recommended)</option>
                  <option value="en">English</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Voice Response Language</label>
                <select 
                  value={outputLanguage}
                  onChange={(e) => setOutputLanguage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Voice Quality</label>
                <div className="flex gap-2">
                  {['standard', 'high', 'premium'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setVoiceQuality(quality)}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                        voiceQuality === quality
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Higher quality requires more bandwidth during voice interactions.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Speaking Rate: {(speakingRate * 100).toFixed(0)}%</label>
                <input 
                  type="range" 
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speakingRate}
                  onChange={(e) => setSpeakingRate(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-[10px] text-zinc-500">Adjust voice output speed for responses.</p>
              </div>
            </>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Voice Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const [alertTypes, setAlertTypes] = useState({
    weatherAlerts: true,
    priceAlerts: true,
    diseaseAlerts: true,
    irrigationReminders: true,
    systemUpdates: true,
    chatSummaries: false
  });
  
  const [channels, setChannels] = useState({
    inApp: true,
    push: true,
    email: false,
    sms: false
  });

  const [quietHours, setQuietHours] = useState({ enabled: false, start: '22:00', end: '08:00' });

  const toggleAlertType = (key: keyof typeof alertTypes) => {
    setAlertTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Alert Types</h3>
        <div className="space-y-3">
          {[
            { key: 'weatherAlerts' as const, label: 'Weather Alerts', desc: 'Heavy rain, frost, extreme temperatures' },
            { key: 'priceAlerts' as const, label: 'Price Alerts', desc: 'Market prices for your crops reach target levels' },
            { key: 'diseaseAlerts' as const, label: 'Disease & Pest Alerts', desc: 'Disease detection and pest warnings' },
            { key: 'irrigationReminders' as const, label: 'Irrigation Reminders', desc: 'Optimal irrigation timing based on soil conditions' },
            { key: 'systemUpdates' as const, label: 'System Updates', desc: 'New features and platform updates' },
            { key: 'chatSummaries' as const, label: 'Daily Chat Summaries', desc: 'Summary of AI insights and recommendations' }
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  checked={alertTypes[key]}
                  onChange={() => toggleAlertType(key)}
                  className="sr-only peer" 
                />
                <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 peer-checked:border-emerald-600 border border-zinc-700 flex items-center justify-center">
                  {alertTypes[key] && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-zinc-200">{label}</span>
                <span className="text-xs text-zinc-500">{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Notification Channels</h3>
        <div className="space-y-3">
          {[
            { key: 'inApp' as const, label: 'In-App Notifications', desc: 'Alerts within AgriGPT platform' },
            { key: 'push' as const, label: 'Push Notifications', desc: 'Browser or mobile push notifications' },
            { key: 'email' as const, label: 'Email Notifications', desc: 'Send alerts to your registered email' },
            { key: 'sms' as const, label: 'SMS Notifications', desc: 'Critical alerts via SMS' }
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  checked={channels[key]}
                  onChange={() => toggleChannel(key)}
                  className="sr-only peer" 
                />
                <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 border border-zinc-700 flex items-center justify-center">
                  {channels[key] && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-zinc-200">{label}</span>
                <span className="text-xs text-zinc-500">{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Quiet Hours</h3>
        <label className="flex items-start gap-3 cursor-pointer mb-4">
          <div className="relative flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={quietHours.enabled}
              onChange={(e) => setQuietHours(prev => ({ ...prev, enabled: e.target.checked }))}
              className="sr-only peer" 
            />
            <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 border border-zinc-700 flex items-center justify-center">
              {quietHours.enabled && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
          <span className="text-sm font-medium text-zinc-200">Enable quiet hours (only critical alerts)</span>
        </label>
        {quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Start Time</label>
              <input 
                type="time"
                value={quietHours.start}
                onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">End Time</label>
              <input 
                type="time"
                value={quietHours.end}
                onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> Save Notification Preferences
        </button>
      </div>
    </div>
  );
}

function PrivacySettings() {
  const [shareData, setShareData] = useState(true);
  const [thirdPartyIntegrations, setThirdPartyIntegrations] = useState({
    weatherAPI: true,
    marketData: true,
    analytics: false,
    geoLocation: true
  });

  const toggleIntegration = (key: keyof typeof thirdPartyIntegrations) => {
    setThirdPartyIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Data Sharing Preferences</h3>
        
        <label className="flex items-start gap-3 cursor-pointer mb-4">
          <div className="relative flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={shareData}
              onChange={(e) => setShareData(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">Allow Anonymized Data Usage</span>
            <span className="text-xs text-zinc-500">Help improve AgriGPT by sharing anonymized farm and usage data. No personal information is shared.</span>
          </div>
        </label>

        <div className="p-3 bg-zinc-950/50 rounded-md mt-4">
          <p className="text-xs text-zinc-400">
            <strong>Data we collect:</strong> Crop yields, soil conditions, weather observations, market interactions.
            <br />
            <strong>Data we don't collect:</strong> Location coordinates, personal financial information, passwords.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Third-Party Integrations</h3>
        <div className="space-y-3">
          {[
            { key: 'weatherAPI' as const, label: 'Weather Data APIs', desc: 'Real-time weather and forecasts' },
            { key: 'marketData' as const, label: 'Market Price Data', desc: 'APMC mandi rates and market trends' },
            { key: 'geoLocation' as const, label: 'Geolocation Services', desc: 'Location-based crop recommendations' },
            { key: 'analytics' as const, label: 'Analytics & Telemetry', desc: 'Performance monitoring and crash reporting' }
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  checked={thirdPartyIntegrations[key]}
                  onChange={() => toggleIntegration(key)}
                  className="sr-only peer" 
                />
                <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 border border-zinc-700 flex items-center justify-center">
                  {thirdPartyIntegrations[key] && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-zinc-200">{label}</span>
                <span className="text-xs text-zinc-500">{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Data Management</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-md hover:border-zinc-700 transition-colors">
            <span className="text-sm text-zinc-300">Download Your Data (GDPR)</span>
            <span className="text-xs text-zinc-500">→</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-md hover:border-zinc-700 transition-colors">
            <span className="text-sm text-zinc-300">Delete Personal Information</span>
            <span className="text-xs text-zinc-500">→</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> Save Privacy Settings
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Password Management</h3>
        
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-md hover:border-emerald-500 transition-colors"
          >
            <span className="text-sm text-zinc-300">Change Password</span>
            <span className="text-xs text-zinc-500">→</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Current Password</label>
              <input type="password" placeholder="Enter current password" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">New Password</label>
              <input type="password" placeholder="Enter new password" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowPasswordForm(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition-colors">Cancel</button>
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Two-Factor Authentication (2FA)</h3>
        
        <label className="flex items-start gap-3 cursor-pointer mb-4">
          <div className="relative flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={mfaEnabled}
              onChange={(e) => {
                setMfaEnabled(e.target.checked);
                if (e.target.checked) setShowMFASetup(true);
              }}
              className="sr-only peer" 
            />
            <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">Enable Two-Factor Authentication</span>
            <span className="text-xs text-zinc-500">Use an authenticator app to add an extra layer of security.</span>
          </div>
        </label>

        {mfaEnabled && showMFASetup && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-md space-y-3">
            <p className="text-xs text-emerald-300">Scan this QR code with Google Authenticator or Authy:</p>
            <div className="w-40 h-40 bg-white rounded-md p-2 mx-auto flex items-center justify-center">
              <div className="text-xs text-zinc-900">QR Code Placeholder</div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Verify Code</label>
              <input type="text" placeholder="Enter 6-digit code" maxLength={6} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <Save className="w-4 h-4" /> Verify & Enable 2FA
            </button>
          </div>
        )}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Login History</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { device: 'Chrome on Windows', location: 'Pune, India', time: '2 hours ago' },
            { device: 'Safari on iPhone', location: 'Pune, India', time: 'Yesterday' },
            { device: 'Chrome on Windows', location: 'Pune, India', time: '3 days ago' }
          ].map((session, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-950 rounded-md border border-zinc-800">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200">{session.device}</p>
                <p className="text-xs text-zinc-500">{session.location} • {session.time}</p>
              </div>
              <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Sign out</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [autoTheme, setAutoTheme] = useState(false);

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Color Theme</h3>
        
        <label className="flex items-start gap-3 cursor-pointer mb-4">
          <div className="relative flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={autoTheme}
              onChange={(e) => setAutoTheme(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 border border-zinc-700 flex items-center justify-center">
              {autoTheme && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
          <span className="text-sm font-medium text-zinc-200">Follow system theme</span>
        </label>

        {!autoTheme && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'dark', label: 'Dark Mode', desc: 'Easy on the eyes at night' },
              { id: 'light', label: 'Light Mode', desc: 'Bright and clear in daylight' }
            ].map(({ id, label, desc }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  theme === id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                }`}
              >
                <div className="text-sm font-medium text-zinc-200">{label}</div>
                <div className="text-xs text-zinc-500 mt-1">{desc}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Text Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'small', label: 'Small', size: 'text-xs' },
            { id: 'medium', label: 'Medium', size: 'text-sm' },
            { id: 'large', label: 'Large', size: 'text-base' }
          ].map(({ id, label, size }) => (
            <button
              key={id}
              onClick={() => setFontSize(id)}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                fontSize === id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <span className={size}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Layout Density</h3>
        <div className="space-y-2">
          {[
            { id: 'compact', label: 'Compact', desc: 'More content per screen' },
            { id: 'comfortable', label: 'Comfortable', desc: 'Default spacing' },
            { id: 'spacious', label: 'Spacious', desc: 'Plenty of white space' }
          ].map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setLayoutDensity(id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md border-2 transition-all ${
                layoutDensity === id
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className="text-left">
                <div className="text-sm font-medium text-zinc-200">{label}</div>
                <div className="text-xs text-zinc-500">{desc}</div>
              </div>
              {layoutDensity === id && <span className="text-emerald-400">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> Save Appearance Settings
        </button>
      </div>
    </div>
  );
}

function AccessibilitySettings() {
  const [screenReader, setScreenReader] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Vision Accessibility</h3>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 border border-zinc-700 flex items-center justify-center">
                {highContrast && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">High Contrast Mode</span>
              <span className="text-xs text-zinc-500">Enhanced text contrast for better readability.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-5 h-5 bg-zinc-800 peer-focus:outline-none rounded peer-checked:bg-emerald-600 border border-zinc-700 flex items-center justify-center">
                {reducedMotion && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Reduce Motion</span>
              <span className="text-xs text-zinc-500">Minimize animations and transitions.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Assistive Technology</h3>
        
        <label className="flex items-start gap-3 cursor-pointer mb-4">
          <div className="relative flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={screenReader}
              onChange={(e) => setScreenReader(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">Screen Reader Support</span>
            <span className="text-xs text-zinc-500">Optimize interface for screen readers like NVDA or JAWS.</span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={keyboardNav}
              onChange={(e) => setKeyboardNav(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">Keyboard Navigation</span>
            <span className="text-xs text-zinc-500">Use Tab, Enter, and arrow keys to navigate the interface.</span>
          </div>
        </label>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {[
            { keys: 'Ctrl + /', label: 'Show/hide sidebar' },
            { keys: 'Ctrl + K', label: 'Quick search' },
            { keys: 'Ctrl + N', label: 'New conversation' },
            { keys: 'Ctrl + S', label: 'Save settings' },
            { keys: 'Alt + V', label: 'Voice input' },
            { keys: 'Esc', label: 'Close modals' }
          ].map(({ keys, label }, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-zinc-950 rounded-md text-sm">
              <span className="text-zinc-400">{label}</span>
              <kbd className="px-2 py-1 bg-zinc-800 text-zinc-200 rounded text-xs font-mono border border-zinc-700">{keys}</kbd>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> Save Accessibility Settings
        </button>
      </div>
    </div>
  );
}

function AccountSettings() {
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  return (
    <div className="space-y-5">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Account Overview</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-md border border-zinc-800">
            <div>
              <p className="text-xs font-medium text-zinc-400">Account Status</p>
              <p className="text-sm font-semibold text-emerald-400 mt-1">Active</p>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-md border border-zinc-800">
            <div>
              <p className="text-xs font-medium text-zinc-400">Account Created</p>
              <p className="text-sm text-zinc-200 mt-1">March 15, 2024</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-md border border-zinc-800">
            <div>
              <p className="text-xs font-medium text-zinc-400">Last Login</p>
              <p className="text-sm text-zinc-200 mt-1">Today at 2:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Subscription & Storage</h3>
        
        <div className="space-y-3">
          <div className="p-3 bg-zinc-950 rounded-md border border-zinc-800">
            <p className="text-xs font-medium text-zinc-400">Current Plan</p>
            <p className="text-sm font-semibold text-zinc-200 mt-1">AgriGPT Pro</p>
            <p className="text-xs text-zinc-500 mt-1">Renews on April 15, 2025</p>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full w-2/3"></div>
          </div>
          <p className="text-xs text-zinc-400">Storage: 15.8 GB of 25 GB used</p>
          <button className="w-full flex items-center justify-between px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md hover:border-emerald-500 transition-colors text-sm text-zinc-300 mt-2">
            <span>Manage Subscription</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-200 mb-4">Linked Accounts</h3>
        
        <div className="space-y-2">
          {[
            { provider: 'Google Account', email: 'ramesh@gmail.com', connected: true },
            { provider: 'Mobile Number', email: '+91 98765 43210', connected: true },
            { provider: 'WhatsApp', email: '+91 98765 43210', connected: false }
          ].map((account, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-950 rounded-md border border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-200">{account.provider}</p>
                <p className="text-xs text-zinc-500">{account.email}</p>
              </div>
              <button className="text-xs font-medium px-3 py-1 rounded-md transition-colors">
                {account.connected ? (
                  <span className="text-red-400 hover:text-red-300">Disconnect</span>
                ) : (
                  <span className="text-emerald-400 hover:text-emerald-300">Connect</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5">
        <h3 className="text-sm font-medium text-red-400 mb-4">Danger Zone</h3>
        
        {!showDeleteForm ? (
          <button
            onClick={() => setShowDeleteForm(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-red-950/40 border border-red-800 rounded-md hover:bg-red-950/60 transition-colors"
          >
            <span className="text-sm text-red-400">Delete Account Permanently</span>
            <span className="text-xs text-red-600">→</span>
          </button>
        ) : (
          <div className="space-y-4 p-4 bg-red-950/20 rounded-md">
            <p className="text-sm text-red-300">This action cannot be undone. All your data, conversations, and settings will be permanently deleted.</p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Type your email to confirm deletion:</label>
              <input 
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="ramesh.patil@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteForm(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition-colors">Cancel</button>
              <button 
                disabled={!deleteConfirmation.includes('@')}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
