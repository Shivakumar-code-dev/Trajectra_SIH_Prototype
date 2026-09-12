import React from 'react';
import { Layers, Sparkles, ArrowRight, ShieldCheck, Radio, Eye, Route } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const LandingPage: React.FC = () => {
  const { setActivePage, runFullSihDemo } = useSimulation();

  return (
    <div className="relative min-h-screen w-full bg-[#070b14] flex flex-col justify-between overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Animated Smart City Mesh & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* Top Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-[#1b2a4a]/40 bg-[#070b14]/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white tracking-wider">
              TRAJECTRA <span className="text-cyan-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
              SIH 2026 Problem Statement SIH26127
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            DEMO MODE
          </span>
          <button
            onClick={() => setActivePage('command-center')}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-semibold transition-all"
          >
            Command Center →
          </button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-center flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>SMART INDIA HACKATHON 2026 — TEAM VECTORHAUL</span>
        </div>

        <div className="space-y-4 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white font-mono tracking-tight leading-tight">
            City-Wide AI Engine for Multi-Camera ANPR & Trajectory Tracking
          </h2>
          <p className="text-lg md:text-xl text-cyan-300/90 font-mono italic max-w-2xl mx-auto">
            "From multiple cameras to complete vehicle journeys and smarter cities."
          </p>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl mx-auto leading-relaxed">
            Connecting city-wide CCTV feeds to identify identical vehicles across camera locations using high-precision ANPR OCR, spatial trajectory linestrings, and real-time traffic congestion analytics.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('command-center')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActivePage('command-center');
              setTimeout(() => runFullSihDemo(), 500);
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0d1527] hover:bg-[#121c33] text-cyan-400 border border-cyan-500/40 font-mono font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>▶ RUN LIVE DEMO WALKTHROUGH</span>
          </button>
        </div>

        {/* Core Architectural Pipeline Strip */}
        <div className="w-full pt-12">
          <div className="p-4 rounded-2xl bg-[#0d1527]/80 border border-[#1b2a4a] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10px] font-mono text-slate-300">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">1. CCTV FEEDS</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">2. YOLO DETECT</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">3. ANPR OCR</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">4. IDENTITY</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">5. MATCHING</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">6. TRAJECTORY</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">7. ANALYTICS</div>
            <div className="p-2 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-500/40">8. AI INSIGHTS</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-[#1b2a4a]/40 text-center text-xs font-mono text-slate-500">
        TRAJECTRA AI — Smart India Hackathon 2026 Prototype | Team VectorHaul
      </footer>
    </div>
  );
};
