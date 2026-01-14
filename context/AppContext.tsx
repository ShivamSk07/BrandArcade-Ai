
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandIdentity, Persona, UserProfile, ActivityItem } from '../types';
import { db, UserRecord } from '../services/db';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  progress: number;
}

interface AppContextType {
  user: User | null;
  brand: BrandIdentity | null;
  profile: UserProfile | null;
  personas: Persona[];
  activities: ActivityItem[];
  initialized: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean, message?: string }>;
  signup: (email: string, name: string, pass: string) => Promise<{ success: boolean, message?: string }>;
  logout: () => void;
  updateBrand: (dna: BrandIdentity) => Promise<void>;
  updateBrandLogo: (url: string) => Promise<void>;
  updateProfile: (p: UserProfile) => Promise<void>;
  updatePersonas: (p: Persona[]) => Promise<void>;
  updateUserInfo: (name: string, avatarUrl: string) => Promise<void>;
  updateProgress: (newProgress: number) => Promise<void>;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionEmail = localStorage.getItem('ba_active_session');
        if (sessionEmail) {
          const record = await db.findUserByEmail(sessionEmail);
          if (record) {
            setUser({ 
              id: record.id, 
              email: record.email, 
              name: record.name, 
              avatarUrl: record.avatarUrl,
              progress: record.progress 
            });
            setBrand(record.brand || null);
            setProfile(record.profile || null);
            setPersonas(record.personas || []);
            setActivities(record.activities || []);
          }
        }
      } catch (e) {
        console.error("DB Initialization error:", e);
      } finally {
        setInitialized(true);
      }
    };
    initSession();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const record = await db.validateUser(email, pass);
      if (record) {
        setUser({ 
          id: record.id, 
          email: record.email, 
          name: record.name, 
          avatarUrl: record.avatarUrl,
          progress: record.progress 
        });
        setBrand(record.brand || null);
        setProfile(record.profile || null);
        setPersonas(record.personas || []);
        setActivities(record.activities || []);
        localStorage.setItem('ba_active_session', email.toLowerCase());
        return { success: true };
      }
      
      const exists = await db.findUserByEmail(email);
      if (exists) {
        return { success: false, message: 'Security Key mismatch. Access denied.' };
      }
      return { success: false, message: 'Identity not recognized on the shivam.ai grid.' };
    } catch (e) {
      return { success: false, message: 'Neural link failed. Try again later.' };
    }
  };

  const signup = async (email: string, name: string, pass: string) => {
    try {
      const record = await db.registerUser(email, name, pass);
      setUser({ id: record.id, email: record.email, name: record.name, progress: record.progress });
      setActivities([]);
      localStorage.setItem('ba_active_session', email.toLowerCase());
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message || 'Identity initialization failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    setBrand(null);
    setProfile(null);
    setPersonas([]);
    setActivities([]);
    localStorage.removeItem('ba_active_session');
  };

  const updateBrand = async (dna: BrandIdentity) => {
    if (!user) return;
    setBrand(dna);
    const newProgress = Math.max(user.progress, 25);
    setUser(prev => prev ? { ...prev, progress: newProgress } : null);
    await db.updateUser(user.id, { brand: dna, progress: newProgress });
  };

  const updateBrandLogo = async (url: string) => {
    if (!user || !brand) return;
    const updatedBrand = { ...brand, logoUrl: url };
    setBrand(updatedBrand);
    await db.updateUser(user.id, { brand: updatedBrand });
  };

  const updateProfile = async (p: UserProfile) => {
    if (!user) return;
    setProfile(p);
    const newProgress = Math.max(user.progress, 10);
    setUser(prev => prev ? { ...prev, progress: newProgress } : null);
    await db.updateUser(user.id, { profile: p, progress: newProgress });
  };

  const updatePersonas = async (p: Persona[]) => {
    if (!user) return;
    setPersonas(p);
    await db.updateUser(user.id, { personas: p });
  };

  const updateUserInfo = async (name: string, avatarUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, avatarUrl };
    setUser(updatedUser);
    await db.updateUser(user.id, { name, avatarUrl });
  };

  const updateProgress = async (newProgress: number) => {
    if (!user) return;
    const finalProgress = Math.max(user.progress, newProgress);
    setUser(prev => prev ? { ...prev, progress: finalProgress } : null);
    await db.updateUser(user.id, { progress: finalProgress });
  };

  const addActivity = async (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    if (!user) return;
    const newItem: ActivityItem = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    const updated = [newItem, ...activities].slice(0, 20);
    setActivities(updated);
    await db.updateUser(user.id, { activities: updated });
  };

  return (
    <AppContext.Provider value={{ 
      user, brand, profile, personas, activities, initialized,
      login, signup, logout, updateBrand, updateBrandLogo, 
      updateProfile, updatePersonas, updateUserInfo, updateProgress, addActivity 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
