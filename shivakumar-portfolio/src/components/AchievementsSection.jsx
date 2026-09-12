import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, MapPin } from 'lucide-react';
import { playCyberHover } from '../utils/audio';

export default function AchievementsSection() {
  const { achievementsData } = usePortfolio();

  return (
    <section className="py-24 relative bg-black/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>COMPETITIVE HIGHLIGHTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            HACKATHONS & <span className="text-cyan-400">ACHIEVEMENTS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(achievementsData || []).map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={playCyberHover}
              className="cyber-box rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden border border-amber-500/20 hover:border-amber-400/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono-code text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    {item.badge || 'Hackathon'}
                  </span>
                  <span className="text-xs font-mono-code text-cyan-400 font-bold">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {item.title}
                </h3>

                <div className="text-xs font-mono-code text-cyan-400 font-semibold mb-3">
                  {item.role}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono-code text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span>{item.venue}</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-6 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>EVENT STATUS:</span>
                <span className="text-emerald-400">OFFICIALLY COMPLETED</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
