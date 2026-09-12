import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Radio,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Search
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface TopbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ setMobileOpen }) => {
  const {
    isSimulating,
    toggleSimulation,
    resetSimulation,
    runFullSihDemo,
    isDemoRunning,
    alerts,
    setActivePage,
    setSelectedPlate
  } = useSimulation();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [quickSearch, setQuickSearch] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setSelectedPlate(quickSearch.trim().toUpperCase());
      setActivePage('journey-map');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070b14]/90 backdrop-blur-md border-b border-[#1b2a4a] px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm lg:text-base font-bold text-white font-mono tracking-wide flex items-center gap-2">
            TRAJECTRA <span className="text-cyan-400">AI</span>
            <span className="hidden md:inline-block text-xs font-normal text-slate-400 border-l border-slate-700 pl-2">
              CITY-WIDE VEHICLE INTELLIGENCE
            </span>
          </h2>
        </div>
      </div>

      {/* Center: Search & SIH Judge Demo Call-to-Action Button */}
      <div className="hidden lg:flex items-center space-x-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Quick search vehicle plate (e.g. KA 19 AB 1234)..."
            className="w-64 pl-8 pr-3 py-1.5 rounded-lg bg-[#0d1527] border border-[#1b2a4a] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </form>

        <button
          onClick={runFullSihDemo}
          disabled={isDemoRunning}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all duration-300 shadow-lg ${
            isDemoRunning
              ? 'bg-purple-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25 hover:scale-105'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{isDemoRunning ? 'RUNNING SIH DEMO...' : '▶ RUN LIVE DEMO'}</span>
        </button>
      </div>

      {/* Right Controls & Indicators */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Simulation Controls Toggle */}
        <div className="hidden md:flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-[#0d1527] border border-[#1b2a4a] text-xs font-mono">
          <button
            onClick={toggleSimulation}
            className={`p-1 rounded transition-colors ${
              isSimulating ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-amber-400 hover:bg-amber-500/20'
            }`}
            title={isSimulating ? 'Pause Live Simulation' : 'Resume Live Simulation'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetSimulation}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset Simulation Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide px-1">
            {isSimulating ? 'LIVE SIM' : 'PAUSED'}
          </span>
        </div>

        {/* DEMO MODE Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DEMO MODE</span>
        </div>

        {/* System Online Pill */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM ONLINE</span>
        </div>

        {/* Clock */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-cyan-400 bg-[#0d1527] px-2.5 py-1 rounded-md border border-[#1b2a4a]">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || '09:00:00 AM'}</span>
        </div>

        {/* Notifications Icon & Drawer */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0d1527] border border-transparent hover:border-[#1b2a4a] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 lg:w-96 rounded-xl bg-[#0d1527] border border-[#1b2a4a] shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-2">
                <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  REAL-TIME TRAFFIC ALERTS ({alerts.length})
                </h4>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                        : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{alert.title}</span>
                      <span className="text-[10px] font-mono opacity-80">{alert.timestamp}</span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-tight">{alert.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActivePage('alerts');
                  setNotificationsOpen(false);
                }}
                className="w-full text-center text-xs text-cyan-400 hover:underline pt-1 block"
              >
                View all alerts & hotspots →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1b2a4a]">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono shadow-inner">
            VH
          </div>
          <div className="hidden xl:block text-left text-[11px] leading-tight">
            <div className="font-semibold text-slate-200">VectorHaul</div>
            <div className="text-[9px] text-cyan-400 font-mono">SIH 2026 Finalist</div>
          </div>
        </div>
      </div>
    </header>
  );
};
