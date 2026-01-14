
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Target, UserPlus, ArrowUpRight, Lock, Sparkles, Video, Play, Loader2, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';

const PhaseThree: React.FC = () => {
  const navigate = useNavigate();
  const { brand, user, addActivity } = useApp();
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(false);
  
  const isLocked = (user?.progress || 0) < 50;

  if (isLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="glass p-12 rounded-[3rem] max-w-md w-full text-center space-y-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-purple-500/20">
            <Lock size={32} className="text-purple-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black tracking-tighter text-white">Phase 3 Locked</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Complete Phase 1 (DNA) and Phase 2 (Content Growth) to unlock Hero Sales Intelligence.
            </p>
          </div>
          <button 
            onClick={() => navigate('/phase/growth')}
            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            Go to Phase 2 <Sparkles size={16} />
          </button>
        </div>
      </div>
    );
  }

  const handleGenerateVideo = async () => {
    if (!videoPrompt || !brand) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
      // Assume success as per race condition rules
    }

    setLoadingVideo(true);
    try {
      const url = await aiService.generatePromoVideo(videoPrompt);
      setVideoUrl(url);
      addActivity({
        type: 'content',
        title: 'Neural Promo Generated',
        description: 'Successfully deployed an AI-rendered brand advertisement video.',
        meta: 'VEO 3.1'
      });
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
      }
    } finally {
      setLoadingVideo(false);
    }
  };

  const tools = [
    {
      title: "AI Sales SDR",
      icon: <Target className="text-red-400" />,
      desc: "Autonomously qualify and reach out to high-intent LinkedIn leads.",
      stats: "Active 24/7"
    },
    {
      title: "Lead Magnet Builder",
      icon: <UserPlus className="text-blue-400" />,
      desc: "Instantly create high-value PDF checklists based on your niche.",
      stats: "Ready to deploy"
    },
    {
      title: "Chatbot Concierge",
      icon: <MessageSquare className="text-purple-400" />,
      desc: "AI agent trained on your catalog to provide tailored recommendations.",
      stats: "Live Sync"
    },
    {
      title: "Dynamic Personalizer",
      icon: <ShoppingCart className="text-emerald-400" />,
      desc: "Change hero sections based on visitor geography and source.",
      stats: "Active on 4 pages"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          Hero Intelligence
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white">Sales & Intelligence</h2>
        <p className="text-slate-400 text-lg max-w-2xl font-medium">Automate sales outreach and maximize conversion intelligence for {brand?.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] hover:bg-white/5 transition border border-white/5 group cursor-pointer shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                {tool.icon}
              </div>
              <span className="text-[10px] font-bold px-3 py-1 bg-slate-800 rounded-full text-slate-400 uppercase tracking-widest">{tool.stats}</span>
            </div>
            <h3 className="text-xl font-black mb-2 flex items-center gap-2 text-white">
              {tool.title}
              <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              {tool.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Video Generator Section */}
      <div className="glass p-12 rounded-[3rem] space-y-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                <Video className="text-red-500" size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">Neural Promo Generator</h3>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Generate cinematic high-quality brand promos using <span className="text-white font-bold">Veo 3.1</span>. (Requires Billing)
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 rounded-xl w-fit">
              <Key size={12} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self-Provided Key Protocol</span>
            </div>
          </div>
          <div className="flex-1 max-w-sm space-y-4">
            <textarea 
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-xs h-24 outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Script: A minimalist futuristic office where a designer uses shivam.ai to create magic..."
            />
            <button 
              onClick={handleGenerateVideo}
              disabled={loadingVideo}
              className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-xl"
            >
              {loadingVideo ? <Loader2 className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              Render Promo
            </button>
          </div>
        </div>

        {videoUrl && (
          <div className="animate-in zoom-in-95 duration-700">
             <video src={videoUrl} controls className="w-full rounded-[2rem] border border-white/10 shadow-2xl" />
          </div>
        )}
      </div>

      <div className="glass p-12 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 border border-white/5 shadow-2xl">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center">
          <Target className="text-white" size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tighter text-white">Simulated Sales Pipeline</h3>
          <p className="text-slate-400 max-w-md mx-auto font-medium">Our SDR is currently simulating outbound sequences to test conversion rates for your niche.</p>
        </div>
        <div className="w-full max-w-md bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full w-[65%] animate-[progress_3s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initial Analysis: 4.2% Estimated Conversion</p>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; opacity: 0.5; }
          50% { width: 80%; opacity: 1; }
          100% { width: 100%; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default PhaseThree;
