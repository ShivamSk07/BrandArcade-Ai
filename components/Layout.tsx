
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChatBot } from './ChatBot';
import { 
  RocketIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  GlobeIcon, 
  LayoutDashboardIcon,
  Sparkles,
  LogOut,
  User as UserIcon,
  Settings,
  Edit,
  Camera,
  X,
  Check
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, brand, logout, updateUserInfo, updateBrandLogo } = useApp();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [newName, setNewName] = useState(user?.name || '');
  const [newAvatar, setNewAvatar] = useState(user?.avatarUrl || '');
  const [newLogo, setNewLogo] = useState(brand?.logoUrl || '');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { to: '/', icon: <LayoutDashboardIcon size={20} />, label: 'Dashboard' },
    { to: '/phase/foundation', icon: <RocketIcon size={20} />, label: 'Phase 1: Zero' },
    { to: '/phase/growth', icon: <TrendingUpIcon size={20} />, label: 'Phase 2: Growth' },
    { to: '/phase/hero', icon: <ShieldCheckIcon size={20} />, label: 'Phase 3: Hero' },
    { to: '/phase/scaling', icon: <GlobeIcon size={20} />, label: 'Phase 4: Scaling' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveChanges = () => {
    updateUserInfo(newName, newAvatar);
    if (brand) updateBrandLogo(newLogo);
    setIsEditing(false);
    setShowSettings(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col sticky top-0 h-screen z-20">
        <div className="p-8 flex items-center gap-3">
          {brand?.logoUrl ? (
             <img src={brand.logoUrl} className="w-10 h-10 rounded-xl object-cover shadow-lg border border-white/10" />
          ) : (
             <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                {brand?.name?.charAt(0) || 'B'}
             </div>
          )}
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-400 bg-clip-text text-transparent truncate max-w-[140px]">
              {brand?.name || 'shivam.ai ARCADE'}
            </h1>
            <p className="text-[10px] text-blue-400/80 font-bold uppercase tracking-widest underline decoration-2 underline-offset-2">founder portal</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="glass p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-3 mb-1">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${user?.progress || 0}%` }}></div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-bold"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div className="flex flex-col items-center gap-1 opacity-60">
            <p className="text-[10px] text-slate-500 font-medium">Developed by</p>
            <p className="text-xs text-white font-bold tracking-tight">Shivam Kothekar</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex flex-col">
            <span className="text-xs text-blue-500 font-black uppercase tracking-tighter">Founder Interface</span>
            <div className="text-sm text-slate-400 font-medium">Welcome back, {user?.name.split(' ')[0]}</div>
          </div>
          
          <div className="flex items-center gap-6 relative" ref={dropdownRef}>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass rounded-full border-blue-500/10 cursor-default">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">shivam.ai CORE</span>
            </div>
            
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full ring-2 ring-white/10 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 transition-all overflow-hidden"
            >
              {user?.avatarUrl ? (
                 <img src={user.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                 <UserIcon size={20} className="text-white" />
              )}
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 top-14 w-80 glass rounded-[2rem] border border-white/10 shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Settings</h3>
                  <button onClick={() => setIsEditing(!isEditing)} className="text-blue-400 hover:text-white transition-colors">
                    {isEditing ? <X size={16} /> : <Edit size={16} />}
                  </button>
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden border border-white/5">
                        {user?.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <UserIcon className="text-slate-600" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{user?.name}</p>
                        <p className="text-[10px] text-slate-500">Master Access Profile</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-white/5">
                         <Settings size={14} /> Global Prefs
                       </button>
                       <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/10">
                         <LogOut size={14} /> Suspend Node
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Profile Name</label>
                      <input 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Avatar URL</label>
                      <input 
                        value={newAvatar}
                        onChange={(e) => setNewAvatar(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {brand && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Brand Logo URL</label>
                        <input 
                          value={newLogo}
                          onChange={(e) => setNewLogo(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    <button 
                      onClick={handleSaveChanges}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg"
                    >
                      <Check size={14} /> Commit Changes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
        <ChatBot />
      </main>
    </div>
  );
};

export default Layout;
