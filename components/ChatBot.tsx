
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Minimize2 } from 'lucide-react';

export const ChatBot: React.FC = () => {
  const { profile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'model' | 'user', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatInstance) {
      aiService.createChat(profile).then(setChatInstance);
    }
  }, [isOpen, profile, chatInstance]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatInstance || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatInstance.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Neural link disrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen ? (
        <div className="w-[400px] h-[600px] glass rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="p-6 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Bot size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Shivam Core</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-slate-500 font-bold">Neural Link: Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <Minimize2 size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Sparkles size={32} className="text-blue-500" />
                <p className="text-xs font-bold text-slate-400 max-w-[200px] leading-relaxed">
                  I am the Shivam.ai neural core. Ask me anything about your brand evolution.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                  : 'bg-white/5 border border-white/5 text-slate-300'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-6 bg-slate-900/40 border-t border-white/5">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query neural brain..."
                className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 pl-5 pr-12 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all relative"
        >
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
          <MessageSquare className="text-white group-hover:rotate-12 transition-transform" size={28} />
        </button>
      )}
    </div>
  );
};
