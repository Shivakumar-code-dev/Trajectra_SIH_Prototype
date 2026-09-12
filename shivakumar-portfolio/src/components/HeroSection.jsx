import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Sparkles, Code2, Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { playCyberClick } from '../utils/audio';

export default function HeroSection() {
  const { personalInfo } = usePortfolio();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Hard-lock clean name strings to prevent any PDF binary header rendering
  const safeShortName = "SHIVAKUMAR GAMA";
  const safeName = "Shivakumar Channamallappa Gama";

  useEffect(() => {
    const roles = personalInfo.roles || ["Software Developer", "Backend Developer", "Full Stack Developer", "Android Developer"];
    const currentRole = roles[roleIndex % roles.length];
    let timer;

    if (!isDeleting && displayText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentRole.substring(0, displayText.length - 1)
            : currentRole.substring(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, personalInfo.roles]);

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-cyber-grid">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-cyber-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[120px] pointer-events-none animate-cyber-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>SYSTEM ONLINE // PORTFOLIO V2.0</span>
            </div>

            {/* Clean Glitch Name Display */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-orbitron font-black text-white tracking-tight leading-none uppercase">
                <span className="glitch-text block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-slate-100 to-fuchsia-400" data-text={safeShortName}>
                  {safeShortName}
                </span>
              </h1>
              <p className="text-sm font-mono-code text-cyan-400/80 mt-2 tracking-widest uppercase">
                {safeName}
              </p>
            </div>

            <div className="h-12 flex items-center">
              <span className="text-xl sm:text-2xl font-mono-code text-slate-300 font-medium">
                I build <span className="text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5">{displayText}</span>
                <span className="animate-ping ml-1 text-cyan-400">|</span>
              </span>
            </div>

            <p className="text-slate-300 font-normal text-base sm:text-lg leading-relaxed max-w-2xl">
              {personalInfo.objective}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                onClick={playCyberClick}
                className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-orbitron font-bold text-sm tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all transform hover:-translate-y-0.5"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#certificates"
                onClick={playCyberClick}
                className="px-6 py-3.5 rounded-lg bg-slate-900/90 border border-fuchsia-500/50 hover:border-fuchsia-400 text-fuchsia-300 hover:text-white font-orbitron font-bold text-sm tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <Award className="w-4 h-4 text-fuchsia-400" />
                <span>VIEW CERTIFICATES</span>
              </a>

              <div className="flex items-center gap-3 ml-auto sm:ml-0">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/80 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/80 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              {(personalInfo.stats || []).map((stat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-left hover:border-cyan-500/40 transition-all">
                  <div className="text-2xl font-orbitron font-extrabold text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono-code text-slate-400 uppercase mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Hologram Cyber Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative p-1 rounded-2xl bg-gradient-to-b from-cyan-500 via-fuchsia-500 to-purple-600 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
                <div className="rounded-xl bg-[#080b18] p-6 text-left space-y-6 relative overflow-hidden">
                  
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono-code text-cyan-400/70">DEV_PROFILE.JSON</span>
                  </div>

                  {/* Circle Avatar Card */}
                  <div className="relative group flex justify-center py-2">
                    <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-1 shadow-[0_0_35px_rgba(0,240,255,0.5)]">
                      <div className="w-full h-full rounded-full bg-[#0b0e20] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                        <Code2 className="w-10 h-10 text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs font-orbitron font-extrabold text-white tracking-wider uppercase">
                          SHIVAKUMAR GAMA
                        </span>
                        <span className="text-[11px] font-mono-code text-cyan-400 font-semibold mt-0.5">
                          CS ENGINEER
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* JSON metadata snippet */}
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono-code text-xs space-y-1.5 text-slate-300">
                    <p><span className="text-fuchsia-400">const</span> <span className="text-cyan-300">engineer</span> = &#123;</p>
                    <p className="pl-4"><span className="text-slate-400">name:</span> <span className="text-emerald-300">"Shivakumar Gama"</span>,</p>
                    <p className="pl-4"><span className="text-slate-400">phone:</span> <span className="text-amber-300">"9845981632"</span>,</p>
                    <p className="pl-4"><span className="text-slate-400">location:</span> <span className="text-emerald-300">"Bagalakot, KA"</span>,</p>
                    <p className="pl-4"><span className="text-slate-400">status:</span> <span className="text-cyan-300">"Building Scalable Systems"</span></p>
                    <p>&#125;;</p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono-code pt-2 border-t border-slate-800/80 text-slate-400">
                    <span>SECURITY: VERIFIED</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE NOW
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
