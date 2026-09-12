import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User, Terminal as TermIcon, Target, Cpu, CheckCircle2 } from 'lucide-react';
import { playCyberClick } from '../utils/audio';

export default function AboutSection() {
  const { personalInfo } = usePortfolio();
  const [activeTab, setActiveTab] = useState('objective');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'sys', text: 'Shivakumar Gama Cyber Terminal Initialized v2.4' },
    { type: 'sys', text: 'Type "help", "whoami", "skills", "projects", or "clear"' }
  ]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    playCyberClick();
    const newLogs = [...terminalLogs, { type: 'cmd', text: `> ${terminalInput}` }];

    if (cmd === 'help') {
      newLogs.push({ type: 'res', text: 'Available commands: whoami, objective, skills, education, contact, clear' });
    } else if (cmd === 'whoami') {
      newLogs.push({ type: 'res', text: `${personalInfo.name} - CS Engineering Student @ Yenepoya Institute of Technology` });
    } else if (cmd === 'objective') {
      newLogs.push({ type: 'res', text: personalInfo.objective });
    } else if (cmd === 'skills') {
      newLogs.push({ type: 'res', text: 'Core Stack: Java, Python, Kotlin, React, Node.js, Express, MongoDB, Firebase, OpenCV' });
    } else if (cmd === 'education') {
      newLogs.push({ type: 'res', text: 'B.E. Computer Science (2027) - CGPA: 7.26 | Pre-University (2023): 76.33%' });
    } else if (cmd === 'contact') {
      newLogs.push({ type: 'res', text: `Phone: ${personalInfo.phone} | Email: ${personalInfo.email}` });
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      newLogs.push({ type: 'err', text: `Command not recognized: "${cmd}". Type "help" for options.` });
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  return (
    <section id="about" className="py-24 relative bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <User className="w-3.5 h-3.5" />
            <span>EXECUTIVE OVERVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            ABOUT <span className="text-cyan-400">ME</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-7 cyber-box p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveTab('objective');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono-code text-xs transition-all ${
                    activeTab === 'objective'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>CAREER OBJECTIVE</span>
                </button>

                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveTab('highlights');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono-code text-xs transition-all ${
                    activeTab === 'highlights'
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400 shadow-[0_0_12px_rgba(255,0,127,0.3)]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>CORE COMPETENCIES</span>
                </button>
              </div>

              {activeTab === 'objective' ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-orbitron font-bold text-cyan-300 flex items-center gap-2">
                    <span>ASPIRING SOFTWARE / BACKEND DEVELOPER</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed font-sans text-base">
                    {personalInfo.objective}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono-code text-slate-300">
                      <strong className="text-cyan-400 block mb-1">Key Focus Areas:</strong>
                      Full-Stack Web Apps, Android Apps, RESTful APIs
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono-code text-slate-300">
                      <strong className="text-fuchsia-400 block mb-1">Core Tech Stack:</strong>
                      Java, Python, React, Node.js, Express, MongoDB
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-orbitron font-bold text-fuchsia-300">
                    TECHNICAL ARCHITECTURE STRENGTHS
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Full-stack MERN stack application design with state management & JWT security',
                      'Real-time socket communication & event-driven architecture (Socket.io)',
                      'Android mobile application development utilizing Kotlin & XML layouts',
                      'Computer vision integration using OpenCV & Python data pipelines',
                      'Agile teamwork, Git workflow, and hackathon prototype building'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code text-slate-400">
              <div>LOCATION: <span className="text-cyan-300">{personalInfo.location}</span></div>
              <div>COLLEGE: <span className="text-cyan-300">Yenepoya Institute of Technology</span></div>
            </div>
          </div>

          <div className="lg:col-span-5 cyber-box p-6 rounded-2xl bg-[#060814] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <TermIcon className="w-4 h-4 text-cyan-400" />
                <span className="font-mono-code text-xs font-bold text-slate-200">INTERACTIVE_CLI.SH</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    playCyberClick();
                    setTerminalLogs([]);
                  }}
                  className="text-[10px] font-mono-code text-slate-400 hover:text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
                >
                  CLEAR
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black/80 rounded-lg p-4 font-mono-code text-xs space-y-2 overflow-y-auto max-h-64 min-h-[200px] border border-slate-800/80">
              {terminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.type === 'cmd'
                      ? 'text-cyan-400 font-bold'
                      : log.type === 'err'
                      ? 'text-rose-400'
                      : log.type === 'sys'
                      ? 'text-amber-400/90'
                      : 'text-slate-300'
                  }
                >
                  {log.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 my-3">
              {['whoami', 'objective', 'skills', 'education', 'contact'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setTerminalInput(cmd);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono-code text-[11px] hover:bg-cyan-500/20 transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex gap-2">
              <span className="font-mono-code text-cyan-400 font-bold self-center text-xs">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command (e.g. whoami)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono-code text-xs font-bold rounded transition-colors"
              >
                RUN
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
