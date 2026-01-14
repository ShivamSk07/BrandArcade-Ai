
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { useApp } from '../context/AppContext';
import { Loader2, PenTool, Hash, ImageIcon, FileText, Send, Sparkles, Lock, CheckCircle2, ArrowRight, Zap, Layers } from 'lucide-react';

const PhaseTwo: React.FC = () => {
  const navigate = useNavigate();
  const { brand, user, profile, addActivity, updateProgress } = useApp();
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState<'blog' | 'linkedin' | 'thread'>('blog');
  const [showCompletion, setShowCompletion] = useState(false);

  // New features state
  const [hooks, setHooks] = useState<{hook: string, score: number}[]>([]);
  const [carousel, setCarousel] = useState<{title: string, body: string}[]>([]);
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [generatingCarousel, setGeneratingCarousel] = useState(false);

  const isLocked = (user?.progress || 0) < 25 || !brand;
  const isCompleted = (user?.progress || 0) >= 50;

  if (isLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="glass p-12 rounded-[3rem] max-w-md w-full text-center space-y-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-blue-500/20">
            <Lock size={32} className="text-blue-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black tracking-tighter text-white">Phase 2 Locked</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              To unlock Content Growth, you must first initialize your Brand DNA in Phase 1.
            </p>
          </div>
          <button 
            onClick={() => navigate('/phase/foundation')}
            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            Start Phase 1 <Sparkles size={16} />
          </button>
        </div>
      </div>
    );
  }

  const generateGrowthContent = async () => {
    if (!prompt || !brand) return;
    setLoading(true);
    setHooks([]);
    setCarousel([]);
    try {
      const text = await aiService.generateContent(prompt, contentType, profile);
      setContent(text);
      const img = await aiService.generateBrandedImage(prompt, brand.colors);
      setImageUrl(img);
      
      addActivity({
        type: 'content',
        title: `AI ${contentType.toUpperCase()} Generated`,
        description: `Deployed a neural-optimized piece about "${prompt.substring(0, 30)}..."`,
        meta: contentType
      });
      setShowCompletion(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHooks = async () => {
    if (!prompt) return;
    setGeneratingHooks(true);
    try {
      const res = await aiService.generateViralHooks(prompt);
      setHooks(res);
      addActivity({
        type: 'action',
        title: 'Viral Hooks Simulated',
        description: `Generated 5 algorithm-optimized hooks for ${prompt.substring(0, 20)}...`
      });
    } finally {
      setGeneratingHooks(false);
    }
  };

  const handleGenerateCarousel = async () => {
    if (!content) return;
    setGeneratingCarousel(true);
    try {
      const res = await aiService.generateCarouselSlides(content);
      setCarousel(res);
      addActivity({
        type: 'content',
        title: 'Carousel Logic Built',
        description: 'Converted blog architecture into a 5-slide visual sequence.'
      });
    } finally {
      setGeneratingCarousel(false);
    }
  };

  const handleCompletePhase = async () => {
    await updateProgress(50);
    addActivity({
      type: 'milestone',
      title: 'Phase 2 Evolution Complete',
      description: 'Growth content engine initialized. Branded assets deployed successfully.',
      meta: 'Growth Status'
    });
    navigate('/phase/hero');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            Phase Two Engine
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">Neural Growth Content</h2>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">Deploying branded assets with style consistency via shivam.ai.</p>
          {profile && (
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Personalized voice: {profile.archetype} Mode Active</span>
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Phase Complete</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] space-y-8 h-fit sticky top-28 border border-white/5 shadow-2xl">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Target</p>
              <div className="flex flex-col gap-3">
                {['blog', 'linkedin', 'thread'].map((id) => (
                  <button 
                    key={id}
                    onClick={() => setContentType(id as any)}
                    className={`p-5 rounded-2xl border transition-all flex items-center gap-4 text-sm font-bold ${
                      contentType === id ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900/50 border-white/5 text-slate-400'
                    }`}
                  >
                    {id === 'blog' ? <FileText size={18}/> : id === 'linkedin' ? <ImageIcon size={18}/> : <Hash size={18}/>}
                    {id.charAt(0).toUpperCase() + id.slice(1)} Asset
                  </button>
                ))}
              </div>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-sm h-32 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="What topic are we dominating?"
            />

            <button 
              onClick={generateGrowthContent}
              disabled={loading || !brand}
              className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              Deploy Generation
            </button>
            
            {content && (
              <div className="pt-4 grid grid-cols-2 gap-3">
                 <button 
                  onClick={handleGenerateHooks}
                  disabled={generatingHooks}
                  className="p-4 glass rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20 hover:bg-blue-500/5 transition-all flex flex-col items-center gap-2"
                 >
                    {generatingHooks ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                    Hooks
                 </button>
                 <button 
                  onClick={handleGenerateCarousel}
                  disabled={generatingCarousel}
                  className="p-4 glass rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/5 transition-all flex flex-col items-center gap-2"
                 >
                    {generatingCarousel ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
                    Carousel
                 </button>
              </div>
            )}
          </div>

          {(showCompletion || isCompleted) && !isCompleted && (
            <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 shadow-xl bg-blue-500/5 animate-in slide-in-from-bottom-4 duration-500 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Finalize Evolution</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                You've generated growth assets. Commit these to your brand history to unlock Phase 3: Hero Intelligence.
              </p>
              <button 
                onClick={handleCompletePhase}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                Complete Phase 2 <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-10">
          {!content && !loading && (
            <div className="h-[600px] flex flex-col items-center justify-center glass rounded-[2.5rem] text-slate-700 border-dashed border-2 border-white/10">
              <PenTool size={48} className="mb-4 opacity-20" />
              <p className="font-black italic opacity-30">Neural Engine Standby...</p>
            </div>
          )}

          {loading && (
            <div className="h-[600px] flex flex-col items-center justify-center glass rounded-[2.5rem] border border-blue-500/10">
              <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-blue-400 font-black animate-pulse">shivam.ai Style Matching...</p>
            </div>
          )}

          {content && !loading && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-10">
              {imageUrl && (
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
                  <img src={imageUrl} alt="Branded Asset" className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">shivam.ai Visual Core</div>
                </div>
              )}

              {/* Hooks Section */}
              {hooks.length > 0 && (
                <div className="glass p-8 rounded-[2.5rem] border border-blue-500/10 space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Viral Hook Variations</h4>
                   <div className="space-y-3">
                      {hooks.map((h, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-all">
                           <div className="w-10 h-10 rounded-lg glass flex items-center justify-center text-xs font-black text-blue-500">{h.score}%</div>
                           <p className="flex-1 text-xs text-slate-300 font-medium">"{h.hook}"</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Carousel Section */}
              {carousel.length > 0 && (
                <div className="glass p-8 rounded-[2.5rem] border border-indigo-500/10 space-y-6 overflow-x-auto">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Carousel Architecture</h4>
                   <div className="flex gap-4 pb-2">
                      {carousel.map((slide, i) => (
                        <div key={i} className="flex-shrink-0 w-64 p-6 glass rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent space-y-3">
                           <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Slide {i+1}</span>
                           <h5 className="text-xs font-black text-white">{slide.title}</h5>
                           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{slide.body}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              <div className="glass p-12 rounded-[2.5rem] space-y-8 border border-white/5">
                <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-serif">
                  {content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhaseTwo;
