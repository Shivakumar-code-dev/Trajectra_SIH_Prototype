import React from 'react';
import { Sparkles, CheckCircle2, Play, Square, FastForward } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const DemoBar: React.FC = () => {
  const { isDemoRunning, currentDemoStep, demoProgress, stopSihDemo } = useSimulation();

  if (!isDemoRunning || !currentDemoStep) return null;

  return (
    <div className="sticky top-16 z-20 w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border-b border-cyan-500/50 px-4 py-2 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Step Title */}
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500 text-black">
                STEP {currentDemoStep.stepIndex} / 10
              </span>
              <h3 className="text-sm font-bold text-white font-mono">{currentDemoStep.title}</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-tight mt-0.5">
              {currentDemoStep.subtitle}
            </p>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="w-full md:w-72 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 font-semibold">
            <span>SIH JUDGE PRESENTATION</span>
            <span>{demoProgress}% COMPLETE</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 border border-cyan-500/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${demoProgress}%` }}
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={stopSihDemo}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
