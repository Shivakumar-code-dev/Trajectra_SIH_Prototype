import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Car,
  Route,
  BarChart3,
  Flame,
  Search,
  Bell,
  Cpu,
  Sparkles,
  Database,
  Radio,
  Server,
  Layers
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activePage, setActivePage, setIsArchModalOpen, isDemoRunning } = useSimulation();

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: 'LIVE' },
    { id: 'live-monitoring', label: 'Live Cameras', icon: Camera, badge: '24' },
    { id: 'vehicle-tracking', label: 'Vehicle Tracking / ANPR', icon: Car },
    { id: 'journey-map', label: 'Vehicle Journey', icon: Route, badge: 'WOW', highlight: true },
    { id: 'analytics', label: 'Traffic Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Traffic Insights', icon: Sparkles },
    { id: 'camera-network', label: 'Camera Network', icon: Radio },
    { id: 'vehicle-search', label: 'Vehicle Search', icon: Search },
    { id: 'alerts', label: 'Alerts & Hotspots', icon: Bell, badge: '12' },
    { id: 'system-status', label: 'System & Architecture', icon: Cpu },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#070b14]/95 border-r border-[#1b2a4a] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-[#1b2a4a] bg-[#0d1527]/50">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/20">
              <Layers className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-white font-mono flex items-center gap-1.5">
                TRAJECTRA <span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-[10px] text-cyan-400/80 font-medium tracking-wide uppercase">
                City Intelligence Platform
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-md bg-[#0a101f] border border-[#1b2a4a]">
            <span className="text-[11px] text-slate-400 font-mono">SIH 2026</span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">SIH26127</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Control Center
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-transparent text-cyan-400 border-l-2 border-cyan-400 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                } ${item.highlight ? 'ring-1 ring-cyan-500/30' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${
                      item.badge === 'WOW'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse'
                        : item.badge === 'LIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Architecture & Demo Trigger */}
        <div className="p-3 border-t border-[#1b2a4a]/80 bg-[#0a101f]/60 space-y-2">
          <button
            onClick={() => setIsArchModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Architecture Flowchart</span>
          </button>
        </div>

        {/* Bottom System Status Indicators */}
        <div className="p-3 bg-[#070b14] border-t border-[#1b2a4a] text-[11px] font-mono text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI Engine</span>
            </span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              <span>Cameras</span>
            </span>
            <span className="text-cyan-400 font-semibold">24 / 24</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>ANPR OCR</span>
            </span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              <span>Database</span>
            </span>
            <span className="text-blue-400 font-semibold">CONNECTED</span>
          </div>
        </div>
      </aside>
    </>
  );
};
