import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, ExternalLink, CheckCircle } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { playCyberClick, playCyberHover } from '../utils/audio';

export default function ExperienceSection() {
  const { internshipProjects } = usePortfolio();

  return (
    <section id="experience" className="py-24 relative bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            <span>PRACTICAL EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            INTERNSHIP <span className="text-cyan-400">PROJECTS</span>
          </h2>
          <p className="text-slate-400 font-mono-code text-sm">
            CodeAlpha Full-Stack Engineering Internship Deliverables
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {(internshipProjects || []).map((item, idx) => (
            <div
              key={item.id || idx}
              onMouseEnter={playCyberHover}
              className="cyber-box p-6 sm:p-8 rounded-2xl relative overflow-hidden group border border-cyan-500/20 hover:border-cyan-400/60 transition-all"
            >
              <div className="absolute top-6 right-6 font-mono-code text-xs px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                PROJECT #{idx + 1}
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs font-mono-code text-fuchsia-400">
                    <span>{item.company}</span>
                    <span>•</span>
                    <span className="text-slate-400">{item.period}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(item.tech || []).map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono-code text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  VERIFIED CODEBASE
                </span>

                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-cyan-500 text-slate-200 hover:text-black font-orbitron font-bold text-xs border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW GITHUB REPO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
