import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, Leaf, CloudRain, Calendar, Activity,
  Sprout, Droplets, Wind, ArrowRight, CheckCircle2, AlertTriangle, MessageSquare, Zap, Target
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

// --- MOCK DATA ---
const performanceData = [
  { month: 'Jan', revenue: 4000, expenses: 2400, yield: 240 },
  { month: 'Feb', revenue: 3000, expenses: 1398, yield: 221 },
  { month: 'Mar', revenue: 9800, expenses: 2000, yield: 229 },
  { month: 'Apr', revenue: 3908, expenses: 2780, yield: 200 },
  { month: 'May', revenue: 4800, expenses: 1890, yield: 218 },
  { month: 'Jun', revenue: 3800, expenses: 2390, yield: 250 },
  { month: 'Jul', revenue: 4300, expenses: 3490, yield: 210 },
];

const yieldData = [
  { name: 'Wheat', current: 400, expected: 450 },
  { name: 'Soy', 300: 300, expected: 320 },
  { name: 'Cotton', current: 200, expected: 190 },
  { name: 'Corn', current: 278, expected: 290 },
];

const barRadius: [number, number, number, number] = [4, 4, 0, 0];

// --- COMPONENTS ---
interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  glowing?: boolean;
}

function DashboardCard({ title, icon, children, className, action, glowing }: DashboardCardProps) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className={cn(
        "bg-white/80 backdrop-blur-md border rounded-2xl p-5 shadow-xl transition-colors relative overflow-hidden",
        glowing ? "border-emerald-200 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-slate-200 hover:border-slate-300",
        className
      )}
    >
      {glowing && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 blur-[50px] -z-10 rounded-full" />}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          {icon} {title}
        </h3>
        {action && <div>{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}

export function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [liveMoisture, setLiveMoisture] = useState(42);

  const [tasks, setTasks] = useState([
    { id: 1, task: 'Inspect Field 2 for aphids', time: '08:00 AM', done: true },
    { id: 2, task: 'Fertilizer application (N-P-K)', time: '11:30 AM', done: false },
    { id: 3, task: 'Meeting with buyer (AgroCorp)', time: '02:00 PM', done: false },
    { id: 4, task: 'Irrigation cycle (Field 3)', time: '06:00 PM', done: false },
  ]);
  const [showReport, setShowReport] = useState(false);
  const [showActionPlan, setShowActionPlan] = useState(false);

  // Simulate real-time sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMoisture(prev => Math.max(30, Math.min(60, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin relative">
      {/* MODALS */}
      {showReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-200/50 relative"
          >
            <button onClick={() => setShowReport(false)} className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Executive Farm Report
            </h2>
            <div className="space-y-4 text-sm text-slate-700">
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <div className="bg-white/50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-emerald-600">Key Metrics</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Monthly Revenue is up 12.5%</li>
                  <li>Overall Crop Health stands at 92/100</li>
                  <li>Live moisture levels are optimal around {liveMoisture}%</li>
                </ul>
              </div>
              <div className="bg-white/50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-emerald-600">Task Completion</h3>
                <p>You have completed {tasks.filter(t => t.done).length} out of {tasks.length} tasks scheduled for today.</p>
              </div>
            </div>
            <button onClick={() => setShowReport(false)} className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-colors">
              Close Report
            </button>
          </motion.div>
        </div>
      )}

      {showActionPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(16,185,129,0.1)] relative"
          >
            <button onClick={() => setShowActionPlan(false)} className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" /> AI Action Plan
            </h2>
            <div className="space-y-4 text-sm text-slate-700">
              <p className="text-slate-600">Based on real-time telemetry and market conditions, here are the AI-recommended actions:</p>
              
              <div className="space-y-3">
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-3 flex gap-3">
                  <div className="mt-0.5"><Droplets className="w-4 h-4 text-emerald-600" /></div>
                  <div>
                    <h4 className="font-semibold text-emerald-600">Urgent: Irrigation Cycle</h4>
                    <p className="text-slate-600 mt-1">Field 3 moisture is dropping. Initiate 45-minute drip cycle tonight at 20:00 to prevent yield loss.</p>
                  </div>
                </div>
                
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-3 flex gap-3">
                  <div className="mt-0.5"><TrendingUp className="w-4 h-4 text-amber-500" /></div>
                  <div>
                    <h4 className="font-semibold text-amber-400">Opportunity: Sell Wheat</h4>
                    <p className="text-slate-600 mt-1">Wheat prices surged 2.4% today. Recommend selling 20% of stored inventory within 48 hours.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { alert("Action Plan Applied Successfully!"); setShowActionPlan(false); }} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 text-white font-bold py-2.5 rounded-xl transition-colors">
                Apply Plan
              </button>
              <button onClick={() => setShowActionPlan(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-colors">
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Farm Command Center</h1>
            <p className="text-sm text-slate-600 mt-1">Real-time telemetry, AI insights, and operational analytics.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-2.5">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-copilot', {
                  detail: { prompt: "Analyze my farm's current yield, revenue trends, and water usage efficiency for this season." }
                }));
              }}
              className="px-6 py-4 min-h-[56px] text-lg min-h-[48px] bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-sm font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-emerald-600 animate-pulse" /> Ask AgriGPT
            </button>

            <button 
              onClick={() => setShowReport(true)}
              className="px-6 py-4 min-h-[56px] text-lg min-h-[48px] bg-slate-100 text-slate-800 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Generate Report
            </button>
            <button 
              onClick={() => setShowActionPlan(true)}
              className="px-6 py-4 min-h-[56px] text-lg min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20 text-white text-sm font-medium rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> AI Action Plan
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          {/* ROW 1: KPIs */}
          <DashboardCard title="Financial Overview" icon={<DollarSign className="w-4 h-4 text-emerald-600" />}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹38,20,000</p>
                <p className="text-xs text-emerald-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> +12.5%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">32.4%</p>
                <p className="text-xs text-emerald-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> +2.1%</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-600">Total Expenses</span>
              <span className="text-sm font-semibold text-slate-800">₹25,80,000</span>
            </div>
          </DashboardCard>

          <DashboardCard title="Farm Health & Sustain" icon={<Activity className="w-4 h-4 text-blue-400" />}>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-3xl font-bold text-slate-900">92<span className="text-lg text-slate-500">/100</span></p>
                <p className="text-xs text-slate-600 mt-1">Overall Crop Health</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-600">Sustainability Score</span>
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><Leaf className="w-3 h-3"/> A+ Rating</span>
            </div>
          </DashboardCard>

          <DashboardCard title="Live Environment" icon={<CloudRain className="w-4 h-4 text-cyan-400" />}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-slate-900">28°C</p>
                <p className="text-xs text-slate-600 mt-1">Partly Cloudy</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 flex items-center justify-end gap-1"><Droplets className="w-3 h-3 text-blue-400"/> 65%</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center justify-end gap-1 mt-1"><Wind className="w-3 h-3 text-teal-400"/> 12km/h</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center group">
              <span className="text-xs text-slate-600">Soil Moisture (Sensor A1)</span>
              <span className="text-sm font-bold text-blue-400 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {liveMoisture}%
              </span>
            </div>
          </DashboardCard>

          <DashboardCard title="AI Copilot Suggestion" icon={<Zap className="w-4 h-4 text-amber-400" />} glowing={true}>
            <p className="text-sm text-slate-800 leading-relaxed">
              <span className="font-semibold text-emerald-600">Action Required:</span> Soil moisture in Field 3 is dropping faster than expected. Recommend initiating irrigation cycle tonight to optimize water usage.
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => alert("Irrigation scheduled successfully!")} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 text-sm font-semibold py-2 rounded-lg transition-colors shadow-md shadow-emerald-600/20">
                Start Irrigation
              </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-copilot', { detail: { prompt: 'Why is irrigation needed right now?' } }))} className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold py-2 rounded-lg transition-colors">
                Ask AI Why
              </button>
            </div>
          </DashboardCard>

          {/* ROW 2: Charts & Wide Data */}
          <DashboardCard title={t('analytics.revenue')} icon={<BarChart className="w-4 h-4 text-purple-400" />} className="xl:col-span-3">
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title="Quick Actions" icon={<Target className="w-4 h-4 text-rose-400" />} className="xl:col-span-1">
            <div className="grid grid-cols-2 gap-3 h-full pb-4">
              <button onClick={() => navigate("/")} className="bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
                <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                <span className="text-xs font-medium text-slate-700">New Chat</span>
              </button>
              <button onClick={() => navigate("/scan")} className="bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
                <Sprout className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                <span className="text-xs font-medium text-slate-700">Scan Crop</span>
              </button>
              <button onClick={() => navigate("/store")} className="bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
                <DollarSign className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                <span className="text-xs font-medium text-slate-700">Buy/Sell</span>
              </button>
              <button onClick={() => alert("Calendar scheduler opening soon!")} className="bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
                <Calendar className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                <span className="text-xs font-medium text-slate-700">Schedule</span>
              </button>
            </div>
          </DashboardCard>

          {/* ROW 3 */}
          <DashboardCard title={t('analytics.yield')} icon={<Sprout className="w-4 h-4 text-emerald-600" />} className="xl:col-span-2">
             <div className="h-[200px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a' }} />
                  <Bar dataKey="current" fill="#94a3b8" radius={barRadius} name="Current Yield" />
                  <Bar dataKey="expected" fill="#10b981" radius={barRadius} name="Predicted Yield" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title={t('analytics.market')} icon={<TrendingUp className="w-4 h-4 text-blue-400" />}>
            <div className="space-y-4 mt-2">
              {[
                { name: 'Wheat (Grade A)', price: '₹33,500/t', trend: '+2.4%', up: true },
                { name: 'Soybean', price: '₹54,500/t', trend: '+1.2%', up: true },
                { name: 'Cotton', price: '₹1,00,500/t', trend: '-0.8%', up: false },
                { name: 'Corn', price: '₹24,300/t', trend: '+0.5%', up: true },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{item.price}</div>
                    <div className={cn("text-xs flex items-center justify-end gap-1", item.up ? "text-emerald-600" : "text-red-400")}>
                      {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {item.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title={t('analytics.tasks')} icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}>
            <div className="space-y-3 mt-2">
              {tasks.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => toggleTask(item.id)}
                >
                  <div className={cn("mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-emerald-500/50", item.done ? "bg-emerald-100 border-emerald-500/50 text-emerald-600" : "border-zinc-600")}>
                    {item.done && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium transition-colors group-hover:text-slate-700", item.done ? "text-slate-500 line-through" : "text-slate-800")}>{item.task}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

        </motion.div>
      </div>
    </div>
  );
}
