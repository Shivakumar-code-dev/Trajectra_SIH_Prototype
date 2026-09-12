import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Code } from 'lucide-react';
import { playCyberClick, playCyberHover } from '../utils/audio';

export default function SkillsSection() {
  const { skillsData } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...Object.keys(skillsData || {})];

  const displaySkills = selectedCategory === 'ALL'
    ? Object.entries(skillsData || {}).flatMap(([cat, items]) => items.map(i => ({ ...i, cat })))
    : skillsData[selectedCategory] || [];

  return (
    <section id="skills" className="py-24 relative bg-black/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <Code className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            SKILLS & <span className="text-cyan-400">STACK</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playCyberClick();
                setSelectedCategory(cat);
              }}
              onMouseEnter={playCyberHover}
              className={`px-4 py-2 rounded-lg font-mono-code text-xs tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)] scale-105'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySkills.map((skill, idx) => (
            <div
              key={idx}
              onMouseEnter={playCyberHover}
              className="cyber-box p-5 rounded-xl flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-orbitron font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-xs font-mono-code text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    {skill.level}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden relative mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/60">
                <span>CATEGORY:</span>
                <span className="text-fuchsia-400">{skill.category || skill.cat}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
