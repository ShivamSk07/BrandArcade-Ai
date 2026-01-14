
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Mail, User, Shield, Lock, AlertCircle, Fingerprint } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
      setError('Neural Error: Missing required protocol nodes.');
      return;
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(email, name, password);
      }

      if (!result.success) {
        setError(result.message || 'Access Denied: Protocol Violation.');
        setLoading(false);
      }
    } catch (err) {
      setError("Critical Grid Error. Node unreachable.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#020617] relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-[400px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="glass rounded-[2rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Brand Badge */}
          <div className="bg-slate-900/40 border-b border-white/5 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">shivam.ai ARCADE</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-50">
              <Shield size={10} className="text-blue-400" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">v2.0 SecureDB</span>
            </div>
          </div>

          <div className="p-7 sm:p-9 space-y-7">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter text-white">
                {isLogin ? 'Founder Access' : 'Initial Sync'}
              </h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                {isLogin ? 'Welcome back to the ecosystem' : 'Register your brand node'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[10px] font-bold animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {!isLogin && (
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-700 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-xs"
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-700 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-xs"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    type="password" 
                    placeholder="Security Key" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-700 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-xs"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="group relative w-full py-4 bg-white text-slate-950 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98] mt-2 disabled:opacity-50 overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
                    <span className="uppercase tracking-widest text-[9px] font-black">Connecting...</span>
                  </div>
                ) : (
                  <>
                    <span>{isLogin ? 'Unlock Portal' : 'Start Evolution'}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 flex flex-col items-center gap-5">
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[9px] font-black text-slate-500 hover:text-blue-400 transition-all tracking-[0.2em] uppercase"
              >
                {isLogin ? "Generate New Node Access" : "Existing Node Login"}
              </button>

              <div className="w-full flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <Fingerprint size={12} className="text-blue-500/30" />
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              <div className="flex flex-col items-center gap-0.5 opacity-60">
                 <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.3em]">Architect</p>
                 <p className="text-[9px] text-white font-black uppercase tracking-[0.5em]">Shivam Kothekar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
