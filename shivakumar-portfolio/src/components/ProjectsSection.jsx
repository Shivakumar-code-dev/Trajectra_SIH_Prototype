import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Rocket, ExternalLink, Globe } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { playCyberClick, playCyberHover } from '../utils/audio';

export default function ProjectsSection() {
  const { featuredProjects } = usePortfolio();

  return (
    <section id="projects" className="py-24 relative bg-black/95">
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <Rocket className="w-3.5 h-3.5" />
            <span>FEATURED DEPLOYMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            LIVE <span className="text-cyan-400">PROJECTS</span>
          </h2>
          <p className="text-slate-400 font-mono-code text-sm">
            Click on any live project button to open the deployed web application!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(featuredProjects || []).map((project) => (
            <div
              key={project.id}
              onMouseEnter={playCyberHover}
              className="cyber-box rounded-2xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono-code text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {project.badge || 'Live Web App'}
                </span>
                <span className="text-xs font-mono-code text-slate-400">FULL-STACK SYSTEM</span>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-2xl font-orbitron font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm font-mono-code text-cyan-400/90 font-medium">
                  {project.subtitle}
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="mb-8">
                <div className="text-[11px] font-mono-code text-slate-400 mb-2 uppercase">TECHNOLOGY STACK:</div>
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono-code text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-800">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.8)] transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>LAUNCH LIVE APP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400 transition-all"
                >
                  <GithubIcon className="w-4 h-4 text-cyan-400" />
                  <span>GITHUB CODE</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
