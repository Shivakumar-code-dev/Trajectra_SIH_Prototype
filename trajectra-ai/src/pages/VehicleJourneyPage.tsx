import React from 'react';
import { Route, CheckCircle2, Clock, MapPin, Gauge, ShieldCheck, Sparkles, Navigation, Camera } from 'lucide-react';
import { CityTrafficMap } from '../components/map/CityTrafficMap';
import { useSimulation } from '../context/SimulationContext';

export const VehicleJourneyPage: React.FC = () => {
  const { currentTrajectory, selectedPlate } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white uppercase animate-pulse">
              PRIMARY WOW FEATURE
            </span>
            <span className="text-xs font-mono text-cyan-400">CROSS-CAMERA TRAJECTORY MATCHING</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide mt-1 flex items-center gap-2">
            <Route className="w-6 h-6 text-cyan-400" />
            COMPLETE VEHICLE JOURNEY RECONSTRUCTION
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Spatial Linestring Linestring & ANPR Plate Correlation across City Camera Nodes
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-400 text-amber-300 font-mono text-sm font-bold tracking-wider">
            PLATE: {selectedPlate}
          </div>
        </div>
      </div>

      {/* Visual Camera Match Chain Bar (A -> B -> C) */}
      <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl flex flex-col md:flex-row items-center justify-around gap-4 text-center">
        {currentTrajectory.points.map((pt, idx) => (
          <React.Fragment key={pt.cameraId}>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm shadow-md">
                {String.fromCharCode(65 + idx)}
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-white">{pt.cameraName} — {pt.location}</div>
                <div className="text-[11px] font-mono text-cyan-400">{pt.timestamp}</div>
                <div className="text-[10px] text-emerald-400 font-mono font-semibold">ANPR: {pt.anprConfidence}%</div>
              </div>
            </div>

            {idx < currentTrajectory.points.length - 1 && (
              <div className="hidden md:flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold animate-pulse">
                <span>↓ MATCH</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Large Interactive Trajectory Map */}
      <div className="p-5 rounded-2xl bg-[#0d1527] border border-cyan-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold font-mono text-white">INTERACTIVE TRAJECTORY LINELINE MAP</h3>
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> MATCH CONFIRMED (KA 19 AB 1234)
          </div>
        </div>

        <CityTrafficMap height="h-[520px]" />
      </div>

      {/* Bottom Timeline + Journey Metrics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Timeline Events */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white border-b border-[#1b2a4a] pb-2">
            TIMELINE OF CROSS-CAMERA ANPR MATCHES
          </h3>

          <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/40">
            {currentTrajectory.points.map((pt, idx) => (
              <div key={pt.cameraId} className="relative pl-9 p-3 rounded-xl bg-[#070b14] border border-[#1b2a4a] space-y-1">
                <div className="absolute left-2.5 top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_10px_#00f0ff]" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white text-sm">{pt.timestamp} — {pt.cameraName} ({pt.location})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    {pt.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-sans flex items-center justify-between pt-1">
                  <span>ANPR Confidence: <strong className="text-emerald-400 font-mono">{pt.anprConfidence}%</strong></span>
                  <span>Vehicle Speed: <strong className="text-cyan-400 font-mono">{pt.speed} km/h</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Journey Metrics */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0d1527] to-[#070b14] border border-cyan-500/40 shadow-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white border-b border-[#1b2a4a] pb-2">
            JOURNEY METRICS SUMMARY
          </h3>

          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#1b2a4a]">
              <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">TOTAL JOURNEY TIME</div>
              <div className="text-xl font-bold text-purple-300">{currentTrajectory.durationMinutes} MIN</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#1b2a4a]">
              <Camera className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">CAMERAS VISITED</div>
              <div className="text-xl font-bold text-cyan-400">{currentTrajectory.camerasVisited}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#1b2a4a]">
              <Navigation className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">DISTANCE</div>
              <div className="text-xl font-bold text-emerald-400">{currentTrajectory.distanceKm} KM</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#1b2a4a]">
              <Gauge className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">AVERAGE SPEED</div>
              <div className="text-xl font-bold text-amber-300">{currentTrajectory.avgSpeedKmH} KM/H</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
