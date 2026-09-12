import React from 'react';
import { personalInfo } from '../data/portfolioData';
import { ChevronUp, ShieldCheck, Heart } from 'lucide-react';
import { playCyberClick } from '../utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    playCyberClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#04060f] border-t border-slate-800/80 py-10 relative z-10 font-mono-code text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Branding */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-slate-400">
          <span className="font-orbitron font-bold text-white tracking-wider">
            {personalInfo.shortName.toUpperCase()}
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        </div>

        {/* Center System Status */}
        <div className="flex items-center gap-2 text-cyan-400/80 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>CYBERSPACE PORTFOLIO ENGINE V2.0</span>
        </div>

        {/* Right Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all flex items-center gap-2"
          title="Scroll to Top"
        >
          <span>TOP</span>
          <ChevronUp className="w-4 h-4" />
        </button>

      </div>
    </footer>
  );
}
