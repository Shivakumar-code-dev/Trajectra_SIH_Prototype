import React, { useState } from 'react';
import { Radio, Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Camera } from '../types/trajectra';

export const CameraNetworkPage: React.FC = () => {
  const { cameras, setSelectedCameraId, setActivePage } = useSimulation();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCameras = cameras.filter(cam => {
    const matchesStatus = filterStatus === 'ALL' || cam.status === filterStatus;
    const matchesQuery = cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cam.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const activeCount = cameras.filter(c => c.status === 'ONLINE').length;
  const warningCount = cameras.filter(c => c.status === 'WARNING').length;
  const offlineCount = cameras.filter(c => c.status === 'OFFLINE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            CITY CAMERA NETWORK MANAGEMENT ({cameras.length})
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            RTSP Video Stream Health, FPS Monitoring, ANPR Accuracy & Hardware Inventory
          </p>
        </div>

        {/* Status Summary Pills */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
            {activeCount} ACTIVE
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
            {warningCount} WARNING
          </span>
          <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
            {offlineCount} OFFLINE
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by camera name, ID, or zone..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#070b14] border border-[#1b2a4a] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          {(['ALL', 'ONLINE', 'WARNING', 'OFFLINE'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === st ? 'bg-cyan-500 text-black font-bold' : 'bg-[#070b14] text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Inventory Table */}
      <div className="rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1b2a4a] bg-[#070b14] text-slate-400">
                <th className="py-3 px-4">CAMERA ID</th>
                <th className="py-3 px-4">LOCATION & ZONE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">STREAM FPS</th>
                <th className="py-3 px-4">VEHICLES DETECTED</th>
                <th className="py-3 px-4">ANPR ACCURACY</th>
                <th className="py-3 px-4">LAST UPDATE</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCameras.map((cam) => (
                <tr key={cam.id} className="border-b border-[#1b2a4a]/40 hover:bg-[#091124] transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-400">{cam.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white font-sans">{cam.name}</div>
                    <div className="text-[10px] text-slate-400">{cam.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cam.status === 'ONLINE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : cam.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {cam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{cam.fps} FPS</td>
                  <td className="py-3 px-4 text-cyan-300 font-bold">{cam.vehicleCount}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{cam.anprAccuracy}%</td>
                  <td className="py-3 px-4 text-slate-400">{cam.lastActiveTime}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCameraId(cam.id);
                        setActivePage('live-monitoring');
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold"
                    >
                      Inspect Feed →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
