import React, { useState } from 'react';
import { Search, Car, ShieldCheck, CheckCircle2, Route, Camera, Clock } from 'lucide-react';
import { Vehicle360Viewer } from '../components/vehicle/Vehicle360Viewer';
import { useSimulation } from '../context/SimulationContext';
import { mockSecondaryVehicles } from '../data/mockData';

export const VehicleTrackingPage: React.FC = () => {
  const { selectedPlate, setSelectedPlate, vehicles, setActivePage } = useSimulation();
  const [searchInput, setSearchInput] = useState<string>(selectedPlate);

  const matchedVehicle = vehicles.find(v => v.plateNumber === selectedPlate) || mockSecondaryVehicles[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedPlate(searchInput.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-400" />
            VEHICLE INTELLIGENCE & ANPR INSPECTOR
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Query individual vehicle profile, 3D spatial rotation HUD, ANPR confidence, and camera sighting log
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search vehicle number (e.g. KA 19 AB 1234)..."
              className="w-72 pl-9 pr-4 py-2 rounded-xl bg-[#0d1527] border border-[#1b2a4a] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            SEARCH
          </button>
        </form>
      </div>

      {/* Main Grid: Left Vehicle Profile + Right 360 Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vehicle Profile & ANPR Card */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-3">
              <h3 className="text-sm font-bold font-mono text-white">VEHICLE PROFILE</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                {matchedVehicle.status}
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#1b2a4a]/40">
                <span className="text-slate-400">Vehicle Number:</span>
                <span className="text-cyan-400 font-bold text-sm">{matchedVehicle.plateNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b2a4a]/40">
                <span className="text-slate-400">Vehicle Type:</span>
                <span className="text-white font-semibold">{matchedVehicle.vehicleType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b2a4a]/40">
                <span className="text-slate-400">Color:</span>
                <span className="text-white font-semibold">{matchedVehicle.color}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b2a4a]/40">
                <span className="text-slate-400">ANPR Confidence:</span>
                <span className="text-emerald-400 font-bold">{matchedVehicle.anprConfidence}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b2a4a]/40">
                <span className="text-slate-400">First Seen:</span>
                <span className="text-amber-300">{matchedVehicle.firstSeen}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b2a4a]/40">
                <span className="text-slate-400">Last Seen:</span>
                <span className="text-amber-300">{matchedVehicle.lastSeen}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Cameras Matched:</span>
                <span className="text-cyan-400 font-bold">{matchedVehicle.camerasMatched} Nodes</span>
              </div>
            </div>

            <button
              onClick={() => setActivePage('journey-map')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold font-mono text-xs hover:scale-105 transition-all text-center block shadow-lg shadow-cyan-500/20"
            >
              GENERATE COMPLETE TRAJECTORY MAP →
            </button>
          </div>

          {/* ANPR OCR Result Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0d1527] to-[#070b14] border border-cyan-500/40 shadow-xl space-y-3 text-center">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              ANPR OCR SCAN RESULT
            </span>
            
            <div className="my-2 py-3 px-4 rounded-xl bg-slate-950 border-2 border-amber-400 text-amber-300 font-mono text-2xl font-bold tracking-widest shadow-inner inline-block">
              IND {matchedVehicle.plateNumber}
            </div>

            <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              CONFIDENCE SCORE: {matchedVehicle.anprConfidence}%
            </div>
          </div>
        </div>

        {/* Right 2 Columns: 3D Vehicle Rotation Canvas */}
        <div className="lg:col-span-2">
          <Vehicle360Viewer vehicle={matchedVehicle} anprConfidence={matchedVehicle.anprConfidence} />
        </div>
      </div>
    </div>
  );
};
