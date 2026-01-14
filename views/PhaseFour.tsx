
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { Globe, BookOpen, Mail, PieChart, Sparkles, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PhaseFour: React.FC = () => {
  const navigate = useNavigate();
  const { brand, user } = useApp();

  const isLocked = (user?.progress || 0) < 75;

  if (isLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="glass p-12 rounded-[3rem] max-w-md w-full text-center space-y-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
            <Lock size={32} className="text-emerald-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black tracking-tighter text-white">Phase 4 Locked</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Global Scaling is reserved for established brands. Complete the previous phases to unlock.
            </p>
          </div>
          <button 
            onClick={() => navigate('/phase/hero')}
            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
          >
            Go to Phase 3 <Sparkles size={16} />
          </button>
        </div>
      </div>
    );
  }

  const data = [
    { name: 'Week 1', sales: 4000, reach: 2400 },
    { name: 'Week 2', sales: 3000, reach: 1398 },
    { name: 'Week 3', sales: 2000, reach: 9800 },
    { name: 'Week 4', sales: 2780, reach: 3908 },
    { name: 'Week 5', sales: 1890, reach: 4800 },
    { name: 'Week 6', sales: 2390, reach: 3800 },
    { name: 'Week 7', sales: 3490, reach: 4300 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          Phase Four
        </div>
        <h2 className="text-4xl font-black tracking-tight">Scaling & Operations</h2>
        <p className="text-slate-400 text-lg max-w-2xl font-medium">Global expansion and predictive market forecasting for {brand?.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass p-10 rounded-[2.5rem] space-y-10 shadow-2xl border border-white/5">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                    <PieChart className="text-blue-500" />
                    Predictive Sales Forecast
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Projection Matrix</p>
            </div>
            <select className="bg-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl px-5 py-3 outline-none border border-white/5 focus:ring-2 focus:ring-blue-600">
              <option>Next 30 Days</option>
              <option>Next 90 Days</option>
            </select>
          </div>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2rem] space-y-6 border border-white/5 shadow-xl hover:bg-emerald-500/5 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe />
            </div>
            <h4 className="font-black text-xl tracking-tight">Global Localization</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Translate entire ecosystem nodes while keeping cultural nuance intact.</p>
            <button className="w-full py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all border border-emerald-500/10">Deploy Global Nodes</button>
          </div>
          <div className="glass p-8 rounded-[2rem] space-y-6 border border-white/5 shadow-xl hover:bg-purple-500/5 transition-all group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <BookOpen />
            </div>
            <h4 className="font-black text-xl tracking-tight">Knowledge Brain</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Query the neural index for past brand successes and historical data.</p>
            <button className="w-full py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all border border-purple-500/10">Query Database</button>
          </div>
        </div>
      </div>

      <div className="glass p-10 rounded-[2.5rem] flex flex-wrap items-center gap-10 shadow-2xl border border-yellow-500/10 hover:bg-yellow-500/5 transition-all duration-700">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-[2rem] flex items-center justify-center flex-shrink-0 border border-yellow-500/20 shadow-xl">
          <Mail size={44} className="text-yellow-500" />
        </div>
        <div className="flex-1 min-w-[300px] space-y-2">
            <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full w-fit">
                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Autonomous Agent</p>
            </div>
          <h4 className="text-3xl font-black tracking-tighter">Newsletter Curator</h4>
          <p className="text-slate-400 font-medium text-lg">Scanning for industry trends... Predictive engine indicates high relevance for 3 upcoming topics.</p>
        </div>
        <button className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-yellow-50 transition-all shadow-2xl shadow-yellow-500/10 active:scale-95">Review Digest</button>
      </div>
    </div>
  );
};

export default PhaseFour;
