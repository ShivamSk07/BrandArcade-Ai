
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import PhaseOne from './views/PhaseOne';
import PhaseTwo from './views/PhaseTwo';
import PhaseThree from './views/PhaseThree';
import PhaseFour from './views/PhaseFour';
import Auth from './views/Auth';
import { AppProvider, useApp } from './context/AppContext';
import { BrainCircuit } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useApp();
  
  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <BrainCircuit className="text-blue-500 animate-pulse" size={48} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waking neural brain...</p>
      </div>
    );
  }

  if (!user) return <Auth />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/phase/foundation" element={
            <ProtectedRoute>
              <Layout><PhaseOne /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/phase/growth" element={
            <ProtectedRoute>
              <Layout><PhaseTwo /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/phase/hero" element={
            <ProtectedRoute>
              <Layout><PhaseThree /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/phase/scaling" element={
            <ProtectedRoute>
              <Layout><PhaseFour /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
