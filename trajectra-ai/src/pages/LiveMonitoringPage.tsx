import React from 'react';
import { Camera, Radio, ShieldCheck, Cpu } from 'lucide-react';
import { CCTVGrid } from '../components/camera/CCTVGrid';
import { useSimulation } from '../context/SimulationContext';

export const LiveMonitoringPage: React.FC = () => {
  const { cameras } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
            <Camera className="w-6 h-6 text-cyan-400" />
            LIVE MULTI-CAMERA MONITORING WALL
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Simulated 24/7 CCTV IP Video Feeds with Real-Time YOLOv8 Object Bounding Boxes & ANPR Scanners
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            6 / 6 FEEDS STREAMING
          </span>
        </div>
      </div>

      {/* 6 CCTV Feeds Grid */}
      <CCTVGrid cameras={cameras} />
    </div>
  );
};
