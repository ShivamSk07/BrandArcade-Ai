
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { DailyTask, ActivityItem } from '../types';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Zap, 
  Award, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Circle,
  BrainCircuit,
  Terminal,
  Clock,
  RefreshCw,
  History,
  FileText,
  Target,
  Trophy,
  Activity,
  ThumbsUp,
  Search
} from 'lucide-react';

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
  switch (type) {
    case 'milestone': return <Trophy size={14} className="text-yellow-400" />;
    case 'content': return <FileText size={14} className="text-blue-400" />;
    case 'action': return <Target size={14} className="text-purple-400" />;
    default: return <Zap size={14} className="text-slate-400" />;
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, brand, profile, activities } = useApp();
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [sentiment, setSentiment] = useState<{ data: string, score: number } | null>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);

  useEffect(() => {
    fetchTasks();
    if (brand) fetchSentiment();
  }, [brand, profile]);

  const fetchTasks = async () => {
    if (!brand || !profile) return;
    setLoadingTasks(true);
    try {
      const tasks = await aiService.generateDailyTasks(brand, profile);
      setDailyTasks(tasks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchSentiment = async () => {
    if (!brand) return;
    setLoadingSentiment(true);
    try {
      const res = await aiService.analyzeSentiment(brand.name);
      setSentiment(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSentiment(false);
    }
  };

  const toggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const phases = [
    {
      id: 'foundation',
      title: 'Phase 1: Zero',
      desc: 'Architect your Brand DNA and neural identity.',
      icon: <Zap className="text-yellow-400" />,
      color: 'from-yellow-500/10 to-orange-500/5',
      progress: (user?.progress || 0) >= 25 ? 100 : 0,
      locked: false
    },
    {
      id: 'growth',
      title: 'Phase 2: Growth',
      desc: 'Deploy content clusters and AI-generated assets.',
      icon: <BarChart3 className="text-blue-400" />,
      color: 'from-blue-500/10 to-indigo-500/5',
      progress: (user?.progress || 0) >= 50 ? 100 : 0,
      locked: (user?.progress || 0) < 25
    },
    {
      id: 'hero',
      title: 'Phase 3: Hero',
      desc: 'Automated sales intelligence and lead capture.',
      icon: <Award className="text-purple-400" />,
      color: 'from-purple-500/10 to-pink-500/5',
      progress: (user?.progress || 0) >= 75 ? 100 : 0,
      locked: (user?.progress || 0) < 50
    },
    {
      id: 'scaling',
      title: 'Phase 4: Scaling',
      desc: 'Predictive analytics and global localization.',
      icon: <Users className="text-emerald-400" />,
      color: 'from-emerald-500/10 to-teal-500/5',
      progress: (user?.progress || 0) >= 100 ? 100 : 0,
      locked: (user?.progress || 0) < 75
    }
  ];

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <section className="relative p-12 rounded-[3rem] overflow-hidden hero-gradient shadow-2xl border border-white/5">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl">
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Founder Portal Active</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter leading-[1] text-white">
            From Zero <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">to Hero</span>.
          </h2>
          <p className="text-slate-300/80 text-lg font-medium leading-relaxed max-w-lg">
            {brand 
              ? `Your brand, ${brand.name}, is evolving. Follow the roadmap to dominate your niche.`
              : `Welcome, ${user?.name.split(' ')[0]}. You haven't started your evolution yet. Initialize your Brand DNA to unlock the ecosystem.`
            }
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => navigate('/phase/foundation')}
              className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
            >
              {brand ? 'Continue Building' : 'Begin Evolution'}
            </button>
            {brand && (
              <button className="px-8 py-4 glass text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all border border-white/10">
                Performance Metrics
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[50%] h-full opacity-30 pointer-events-none bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay animate-pulse duration-[10s]"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Trajectory & Activities */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Sentiment Pulse (Grounding) */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                  <Activity className="text-blue-500" size={24} />
                  Neural Sentiment Pulse
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real-time Grounded Analysis</p>
              </div>
              <button onClick={fetchSentiment} className="p-2 glass rounded-lg hover:text-blue-400 transition-colors">
                 <RefreshCw size={14} className={loadingSentiment ? 'animate-spin' : ''} />
              </button>
            </div>
            
            {loadingSentiment ? (
               <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Search size={32} className="text-blue-500/20 animate-bounce" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Web Signals...</p>
               </div>
            ) : sentiment ? (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * sentiment.score) / 100}
                        className="text-blue-500 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-white">{sentiment.score}</span>
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
                    </div>
                 </div>
                 <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/5 italic text-sm text-slate-300 leading-relaxed font-serif">
                    "{sentiment.data}"
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className={`p-4 rounded-full ${sentiment.score > 70 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                       <ThumbsUp size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{sentiment.score > 70 ? 'Bullish' : 'Neutral'}</span>
                 </div>
              </div>
            ) : (
              <div className="py-8 text-center opacity-30 italic text-sm">Initialize brand to track sentiment...</div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end px-2">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter">Your Trajectory</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by shivam.ai</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-500 tracking-tighter">{user?.progress || 0}%</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Total Progress</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phases.map((phase) => (
                <div 
                  key={phase.id}
                  onClick={() => !phase.locked && navigate(`/phase/${phase.id}`)}
                  className={`group relative p-8 rounded-[2rem] bg-gradient-to-br ${phase.color} border border-white/5 transition-all duration-500 overflow-hidden shadow-lg ${phase.locked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:border-blue-500/30 hover:scale-[1.02]'}`}
                >
                  {phase.locked && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                      <Lock size={20} className="text-white/40" />
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Phase Locked</span>
                    </div>
                  )}
                  
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    {phase.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-white tracking-tighter">{phase.title}</h3>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed font-medium">
                    {phase.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${phase.progress === 100 ? 'text-blue-400' : 'text-slate-500'}`}>
                      {phase.progress === 100 ? 'Complete' : 'Incomplete'}
                    </span>
                    {!phase.locked && <ArrowRight size={16} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-8">
             <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                    <History className="text-blue-500" size={24} />
                    Activity Feed
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Brand Milestones & Neural History</p>
                </div>
             </div>

             <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                {activities.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {activities.map((item) => (
                      <div key={item.id} className="p-6 flex items-start gap-5 hover:bg-white/5 transition-colors group">
                        <div className="mt-1 w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ActivityIcon type={item.type} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-white">{item.title}</h4>
                            <span className="text-[10px] text-slate-500 font-bold">{formatTime(item.timestamp)}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.description}</p>
                          {item.meta && (
                            <span className="inline-block px-2 py-0.5 bg-blue-500/10 rounded-md text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">
                              {item.meta}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <History size={48} className="mx-auto text-slate-800 opacity-20" />
                    <p className="text-slate-500 font-medium italic">No neural activities recorded yet.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Day to Day AI Tasks */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex justify-between items-center px-2">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tighter flex items-center gap-2">
                   <Terminal size={18} className="text-blue-500" />
                   Neural Briefing
                </h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Day-to-Day Operations</p>
              </div>
              <button onClick={fetchTasks} className="p-2 glass rounded-lg hover:text-blue-400 transition-colors">
                 <RefreshCw size={14} className={loadingTasks ? 'animate-spin' : ''} />
              </button>
           </div>

           <div className="glass rounded-[2rem] border border-white/10 p-6 space-y-6 relative overflow-hidden h-fit">
             {loadingTasks ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                   <BrainCircuit size={40} className="text-blue-500/20 animate-pulse" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synthesizing Tasks...</p>
                </div>
             ) : dailyTasks.length > 0 ? (
                <div className="space-y-4">
                   {dailyTasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={`group p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-white/5 border-white/5 hover:border-blue-500/30'}`}
                      >
                         <div className="mt-1">
                            {task.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-600 group-hover:text-blue-500" />}
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                  {task.priority}
                               </span>
                               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{task.type}</span>
                            </div>
                            <h4 className={`text-xs font-black ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{task.description}</p>
                         </div>
                      </div>
                   ))}
                   <div className="pt-2 flex items-center justify-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      <Clock size={12} />
                      Next update in 14 hours
                   </div>
                </div>
             ) : (
                <div className="py-12 text-center space-y-4">
                   <Zap size={32} className="mx-auto text-slate-800" />
                   <p className="text-xs text-slate-500 font-medium">Initialize Phase 1 to unlock your daily Neural Briefing.</p>
                   <button 
                    onClick={() => navigate('/phase/foundation')}
                    className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                   >
                    Setup Identity Now
                   </button>
                </div>
             )}
             
             {/* Scanline Effect */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
