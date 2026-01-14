
import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { UserProfile } from '../types';
import { useApp } from '../context/AppContext';
import { Loader2, Palette, Radar, Sparkles, MapPin, Search, ExternalLink, UserCircle, CheckCircle2, Zap, Type as TypeIcon } from 'lucide-react';

const PhaseOne: React.FC = () => {
  const { brand, profile, updateBrand, updateProfile, updatePersonas, addActivity } = useApp();
  const [description, setDescription] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dna' | 'audience' | 'market' | 'profile'>(profile ? 'dna' : 'profile');
  const [liveTrends, setLiveTrends] = useState<{data: string, links: any[]} | null>(null);

  // Profiler State
  const [profArchetype, setProfArchetype] = useState<UserProfile['archetype']>('visionary');
  const [profExpertise, setProfExpertise] = useState('');

  const handleGenerateDNA = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const result = await aiService.generateDNA(description, profile, preferredName);
      updateBrand(result);
      const pResult = await aiService.profileAudience(result.name);
      updatePersonas(pResult);
      
      const trends = await aiService.searchLiveTrends(description);
      setLiveTrends(trends);
      
      addActivity({
        type: 'milestone',
        title: 'Brand DNA Initialized',
        description: `Successfully mapped the neural identity for ${result.name}.`,
        meta: 'Phase 1 Complete'
      });
      
      setActiveTab('dna');
    } finally {
      setLoading(false);
    }
  };

  const saveNeuralProfile = () => {
    const newProfile: UserProfile = {
      archetype: profArchetype,
      tone: profArchetype === 'visionary' ? ['Inspiring', 'Bold'] : profArchetype === 'analyst' ? ['Data-driven', 'Precise'] : ['Provocative', 'Direct'],
      values: ['Innovation', 'Quality'],
      expertise: profExpertise || 'General Business'
    };
    updateProfile(newProfile);
    addActivity({
      type: 'action',
      title: 'Neural Core Customized',
      description: `Founder archetype set to ${profArchetype}. System voice adjusted.`
    });
    setActiveTab('dna');
  };

  const handleCompetitorSearch = async () => {
    if (!brand) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await aiService.findLocalCompetitors(pos.coords.latitude, pos.coords.longitude, brand.name);
      setLiveTrends(res);
      addActivity({
        type: 'action',
        title: 'Local Radar Scan',
        description: 'Analyzed regional competitors to identify geographic market gaps.'
      });
      setLoading(false);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          {activeTab === 'profile' ? 'Step 0: Neural Profiling' : 'Phase One Architect'}
        </div>
        <h2 className="text-4xl font-black tracking-tight">
          {activeTab === 'profile' ? 'Customize Your Neural Core' : 'Brand DNA & Insight'}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl font-medium">
          {activeTab === 'profile' 
            ? 'Define your founder archetype to tailor all shivam.ai outputs to your voice.' 
            : 'Using shivam.ai neural core to map your brand\'s future.'}
        </p>
      </div>

      <div className="flex gap-3 p-1.5 glass rounded-2xl w-fit mx-auto border border-white/10">
        <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>1. Profile</button>
        <button disabled={!profile} onClick={() => setActiveTab('dna')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dna' ? 'bg-blue-600 text-white' : 'text-slate-400 disabled:opacity-30'}`}>2. DNA</button>
        <button disabled={!brand} onClick={() => setActiveTab('audience')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'audience' ? 'bg-blue-600 text-white' : 'text-slate-400 disabled:opacity-30'}`}>3. Audience</button>
        <button disabled={!brand} onClick={() => setActiveTab('market')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'text-slate-400 disabled:opacity-30'}`}>4. Live Trends</button>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass p-10 rounded-[2.5rem] space-y-8 border border-white/5">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Select Archetype</h3>
            <div className="grid grid-cols-2 gap-4">
              {(['visionary', 'analyst', 'rebel', 'narrator'] as const).map((arch) => (
                <button
                  key={arch}
                  onClick={() => setProfArchetype(arch)}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${
                    profArchetype === arch ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-900/40 border-white/5 grayscale'
                  }`}
                >
                  <UserCircle size={24} className={profArchetype === arch ? 'text-blue-400' : 'text-slate-600'} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{arch}</span>
                </button>
              ))}
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Expertise</label>
               <input 
                type="text" 
                placeholder="e.g. Fintech, Sustainable Design, AI"
                value={profExpertise}
                onChange={(e) => setProfExpertise(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
               />
            </div>
            <button 
              onClick={saveNeuralProfile}
              className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              Sync Neural Core <Zap size={14} />
            </button>
          </div>
          <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6 border border-white/5">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center relative ${profile ? 'bg-blue-600/10' : 'bg-slate-900'}`}>
               <div className={`absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20 animate-spin duration-[10s] ${!profile && 'hidden'}`}></div>
               <Sparkles className={profile ? 'text-blue-500 scale-150' : 'text-slate-800 scale-150'} size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-white">{profile ? 'Profile Synced' : 'Ready for Customization'}</h4>
              <p className="text-xs text-slate-500 font-medium">
                {profile 
                  ? `Your ${profile.archetype} persona is now driving the shivam.ai core.` 
                  : 'Complete the form to personalize your brand growth experience.'}
              </p>
            </div>
            {profile && <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest"><CheckCircle2 size={14} /> Active Node</div>}
          </div>
        </div>
      )}

      {activeTab === 'dna' && (
        <div className="space-y-10 animate-in fade-in duration-700">
          {!brand && (
            <div className="glass p-10 rounded-[2.5rem] space-y-8 shadow-2xl border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                   Using {profile?.archetype || 'default'} profile
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <TypeIcon size={12} />
                    Brand Name (Optional)
                 </label>
                 <input 
                  type="text" 
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="Leave blank to let AI architect a name..."
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Search size={12} />
                    Vision Description
                 </label>
                 <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your vision (e.g., Luxury eco-resort in Bali for digital nomads)..."
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-40 text-lg text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                 />
              </div>
              
              <button 
                onClick={handleGenerateDNA}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                Initialize Neural Mapping
              </button>
            </div>
          )}

          {brand && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-10 rounded-[2.5rem] space-y-8 border border-white/5">
                <div className="flex items-center gap-4 text-blue-400">
                  <Palette size={28} />
                  <h3 className="text-2xl font-black">Style Core</h3>
                </div>
                <div className="flex gap-4">
                  <div className="h-20 w-full rounded-2xl border border-white/10 shadow-inner" style={{ backgroundColor: brand.colors.primary }}></div>
                  <div className="h-20 w-full rounded-2xl border border-white/10 shadow-inner" style={{ backgroundColor: brand.colors.secondary }}></div>
                </div>
                <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 italic text-slate-300 text-sm">
                  "{brand.colors.rationale}"
                </div>
              </div>
              <div className="glass p-10 rounded-[2.5rem] space-y-8 border border-white/5">
                <h3 className="text-4xl font-black text-white tracking-tighter">{brand.name}</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">{brand.mission}</p>
                <div className="flex flex-wrap gap-2 pt-4">
                   <span className="px-4 py-2 bg-slate-900 rounded-xl text-[10px] font-black text-slate-400 border border-white/5 uppercase tracking-widest">Typography: {brand.typography.heading}</span>
                   <span className="px-4 py-2 bg-slate-900 rounded-xl text-[10px] font-black text-slate-400 border border-white/5 uppercase tracking-widest">Style: {brand.typography.style}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'audience' && brand && (
        <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-500">
           <div className="glass p-12 rounded-[3rem] text-center space-y-4 border border-white/5">
             <Radar size={48} className="mx-auto text-blue-500 opacity-50" />
             <h3 className="text-2xl font-black">Deep Audience Matrix Generated</h3>
             <p className="text-slate-500 max-w-md mx-auto text-sm">Psychographic profiling for {brand.name} is complete and stored in the neural cloud.</p>
           </div>
        </div>
      )}

      {activeTab === 'market' && brand && (
        <div className="glass p-10 rounded-[2.5rem] space-y-8 border border-emerald-500/10 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-emerald-400">
              <Radar size={28} />
              <h3 className="text-2xl font-black">Neural Market Radar</h3>
            </div>
            <button 
              onClick={handleCompetitorSearch}
              className="flex items-center gap-2 px-6 py-3 glass rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/5 transition-all"
            >
              <MapPin size={14} />
              Scan Local Rivals
            </button>
          </div>
          
          {liveTrends && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-slate-300 leading-relaxed whitespace-pre-wrap">
                {liveTrends.data}
              </div>
              <div className="flex flex-wrap gap-4">
                {liveTrends.links.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.web?.uri || link.maps?.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    <Search size={12} />
                    {link.web?.title || link.maps?.title || 'Source'}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhaseOne;
