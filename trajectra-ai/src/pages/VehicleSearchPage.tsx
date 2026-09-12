import React, { useState } from 'react';
import { Search, Car, Route, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { mockSecondaryVehicles } from '../data/mockData';

export const VehicleSearchPage: React.FC = () => {
  const { setSelectedPlate, setActivePage } = useSimulation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const samplePlates = ['KA 19 AB 1234', 'KA 05 MN 4821', 'KA 03 XY 9217', 'MH 12 GT 9081', 'DL 01 AB 4432'];

  const searchResults = mockSecondaryVehicles.filter(v =>
    v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectVehicle = (plate: string) => {
    setSelectedPlate(plate);
    setActivePage('journey-map');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
            <Search className="w-6 h-6 text-cyan-400" />
            VEHICLE SEARCH & TRAJECTORY DIRECTORY
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Query city-wide vehicle registration database and jump straight to complete spatial trajectories
          </p>
        </div>
      </div>

      {/* Main Search Controls */}
      <div className="p-6 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter vehicle number e.g. KA 19 AB 1234 or type (Car, Bus, White)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#070b14] border border-[#1b2a4a] text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
          />
        </div>

        {/* Quick Sample Search Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Sample Searches:</span>
          {samplePlates.map((plate) => (
            <button
              key={plate}
              onClick={() => {
                setSearchQuery(plate);
                setSelectedPlate(plate);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#070b14] hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
            >
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-mono text-white">
          SEARCH RESULTS ({searchResults.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.map((veh) => (
            <div
              key={veh.id}
              className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] hover:border-cyan-500/40 shadow-xl space-y-3 transition-all group"
            >
              <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-2">
                <span className="px-3 py-1 rounded bg-slate-950 border border-amber-400 text-amber-300 font-mono text-sm font-bold">
                  {veh.plateNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {veh.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <div>Type: <strong className="text-white">{veh.vehicleType}</strong></div>
                <div>Color: <strong className="text-white">{veh.color}</strong></div>
                <div>First Seen: <strong className="text-amber-300">{veh.firstSeen}</strong></div>
                <div>Last Seen: <strong className="text-amber-300">{veh.lastSeen}</strong></div>
                <div>Cameras Matched: <strong className="text-cyan-400">{veh.camerasMatched}</strong></div>
                <div>ANPR Conf: <strong className="text-emerald-400">{veh.anprConfidence}%</strong></div>
              </div>

              <button
                onClick={() => handleSelectVehicle(veh.plateNumber)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold font-mono text-xs hover:scale-[1.02] transition-all flex items-center justify-center space-x-1.5 shadow-md"
              >
                <span>OPEN COMPLETE TRAJECTORY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
