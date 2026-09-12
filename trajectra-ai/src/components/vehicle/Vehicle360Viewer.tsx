import React, { useState, useEffect } from 'react';
import { RotateCw, Eye, ShieldCheck, Cpu, Camera, CheckCircle } from 'lucide-react';
import { Vehicle } from '../../types/trajectra';

interface Vehicle360ViewerProps {
  vehicle: Vehicle;
  anprConfidence?: number;
}

export const Vehicle360Viewer: React.FC<Vehicle360ViewerProps> = ({ vehicle, anprConfidence = 98.7 }) => {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'360' | 'front' | 'side' | 'rear'>('360');

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating || viewMode !== '360') return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating, viewMode]);

  const handleAnglePreset = (mode: '360' | 'front' | 'side' | 'rear') => {
    setViewMode(mode);
    if (mode === '360') {
      setIsAutoRotating(true);
    } else {
      setIsAutoRotating(false);
      if (mode === 'front') setRotationAngle(0);
      if (mode === 'side') setRotationAngle(90);
      if (mode === 'rear') setRotationAngle(180);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0d1527] via-[#090f1d] to-[#070b14] border border-[#1b2a4a] p-6 shadow-2xl overflow-hidden group">
      {/* Background HUD Grid & Radar Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      {/* Header Info Tag */}
      <div className="flex items-center justify-between z-10 relative mb-4 border-b border-[#1b2a4a] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              3D ANPR SCANNER
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> CONFIRMED
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono tracking-wider mt-1">
            {vehicle.plateNumber}
          </h3>
          <p className="text-xs text-slate-400 font-sans">{vehicle.makeModel}</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-mono">ANPR CONFIDENCE</div>
          <div className="text-xl font-bold font-mono text-cyan-400">{anprConfidence}%</div>
        </div>
      </div>

      {/* 3D Visualizer Stage */}
      <div className="relative h-64 md:h-72 w-full flex items-center justify-center py-4 my-2">
        {/* Animated Scanning Grid Ring */}
        <div
          className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full border border-cyan-500/30 border-dashed animate-spin"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full border border-blue-500/20 border-dotted animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '12s' }}
        />
        
        {/* Ground Reflection Ring */}
        <div className="absolute bottom-6 w-48 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />

        {/* 3D Car Vector Visualization */}
        <div
          className="relative z-10 transition-transform duration-75 ease-out flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            transform: `perspective(600px) rotateY(${rotationAngle}deg) rotateX(10deg)`
          }}
        >
          {/* Stylized Futuristic Sedan Graphic */}
          <div className="relative w-56 h-28 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-3xl shadow-2xl border-2 border-cyan-400/50 flex flex-col justify-between p-3 transform transition-all">
            {/* Windows / Roof */}
            <div className="w-36 h-12 mx-auto bg-gradient-to-b from-cyan-950 to-slate-900 rounded-2xl border border-cyan-400/40 flex items-center justify-between px-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30" />
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30" />
            </div>

            {/* License Plate Display on Chassis */}
            <div className="mx-auto bg-slate-950 px-3 py-1 rounded border border-amber-400 text-amber-300 font-mono text-xs font-bold shadow-md tracking-wider flex items-center space-x-1">
              <span className="text-[9px] text-blue-400 font-extrabold">IND</span>
              <span>{vehicle.plateNumber}</span>
            </div>

            {/* Headlights & Wheels */}
            <div className="flex justify-between items-center px-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
            </div>
          </div>
        </div>

        {/* Target Bounding Reticle Overlay */}
        <div className="absolute inset-x-8 inset-y-4 border border-cyan-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
          <div className="flex justify-between text-[9px] font-mono text-cyan-400">
            <span>[ TARGET LOCATED ]</span>
            <span>VECTOR ROT: {rotationAngle}°</span>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-cyan-400">
            <span>YOLOv8 BBOX DETECTED</span>
            <span>MODEL CONF: 99.1%</span>
          </div>
        </div>
      </div>

      {/* Control Buttons (Front, Side, Rear, 360°) */}
      <div className="flex items-center justify-between z-10 relative pt-3 border-t border-[#1b2a4a]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAnglePreset('360')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              viewMode === '360'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#0d1527] text-slate-300 hover:bg-slate-800 border border-[#1b2a4a]'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 inline mr-1" />
            360° ROTATION
          </button>

          <button
            onClick={() => handleAnglePreset('front')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'front'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-[#0d1527] text-slate-400 hover:text-white border border-[#1b2a4a]'
            }`}
          >
            FRONT
          </button>

          <button
            onClick={() => handleAnglePreset('side')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'side'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-[#0d1527] text-slate-400 hover:text-white border border-[#1b2a4a]'
            }`}
          >
            SIDE
          </button>

          <button
            onClick={() => handleAnglePreset('rear')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'rear'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-[#0d1527] text-slate-400 hover:text-white border border-[#1b2a4a]'
            }`}
          >
            REAR
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> OpenCV Features
          </span>
          <span className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-emerald-400" /> EasyOCR V2
          </span>
        </div>
      </div>
    </div>
  );
};
