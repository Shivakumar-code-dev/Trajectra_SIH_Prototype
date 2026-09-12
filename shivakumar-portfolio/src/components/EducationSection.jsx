import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Calendar } from 'lucide-react';
import { playCyberHover } from '../utils/audio';

export default function EducationSection() {
  const { educationData } = usePortfolio();

  return (
    <section id="education" className="py-24 relative bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC BACKGROUND</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            EDUCATION <span className="text-cyan-400">TIMELINE</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(educationData || []).map((edu, idx) => (
            <div
              key={idx}
              onMouseEnter={playCyberHover}
              className="cyber-box rounded-2xl p-6 sm:p-8 flex flex-col justify-between group relative border border-cyan-500/20 hover:border-cyan-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.year}
                  </span>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-emerald-300">
                    {edu.status}
                  </span>
                </div>

                <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {edu.degree}
                </h3>

                <p className="text-sm font-mono-code text-fuchsia-400 mb-4">
                  {edu.institution}
                </p>

                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  {edu.highlight}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono-code text-slate-400 uppercase">
                  {edu.scoreLabel}:
                </span>
                <span className="text-lg font-orbitron font-bold text-cyan-400">
                  {edu.score}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
