import React from 'react';
import {
  Car,
  Camera,
  Route,
  Zap,
  CheckCircle,
  Flame,
  Clock,
  TrendingUp,
  Radio,
  Sparkles,
  MapPin
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { CityTrafficMap } from '../components/map/CityTrafficMap';
import { useSimulation } from '../context/SimulationContext';

export const CommandCenterPage: React.FC = () => {
  const {
    analyticsSummary,
    cameras,
    currentTrajectory,
    hotspots,
    congestedRoutes,
    setSelectedPlate,
    setActivePage
  } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide">
            COMMAND CENTER DASHBOARD
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-Time Multi-Camera ANPR Recognition, Trajectory Tracking & Urban Congestion Matrix
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedPlate('KA 19 AB 1234');
              setActivePage('journey-map');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center space-x-1.5"
          >
            <Route className="w-4 h-4" />
            <span>Track Vehicle KA 19 AB 1234 →</span>
          </button>
        </div>
      </div>

      {/* 6 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Vehicles"
          value={analyticsSummary.totalVehiclesDetectedToday}
          subtitle="Detected Today"
          change="+12.4%"
          changeType="positive"
          icon={Car}
          highlight
        />
        <MetricCard
          title="Active Cameras"
          value={`${analyticsSummary.activeCameras} / ${analyticsSummary.totalCameras}`}
          subtitle="100% Operational"
          icon={Camera}
          badge="ONLINE"
        />
        <MetricCard
          title="Vehicles Tracked"
          value={analyticsSummary.vehiclesCurrentlyTracked}
          subtitle="Active Trajectories"
          change="+8.2%"
          changeType="positive"
          icon={Route}
        />
        <MetricCard
          title="Congestion Level"
          value={`${analyticsSummary.cityCongestionLevel}%`}
          subtitle="City Corridor Avg"
          change={analyticsSummary.cityCongestionLevel > 70 ? 'CRITICAL' : 'MODERATE'}
          changeType={analyticsSummary.cityCongestionLevel > 70 ? 'negative' : 'neutral'}
          icon={Zap}
        />
        <MetricCard
          title="ANPR Match Rate"
          value={`${analyticsSummary.anprMatchRate}%`}
          subtitle="Cross-Camera Accuracy"
          change="HIGH"
          changeType="positive"
          icon={CheckCircle}
        />
        <MetricCard
          title="Traffic Hotspots"
          value={analyticsSummary.trafficHotspotsCount}
          subtitle="Critical Bottlenecks"
          change="12 ACTIVE"
          changeType="negative"
          icon={Flame}
        />
      </div>

      {/* Main Grid: Left Map + Right Real-Time Trajectory Event Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live City Traffic Map */}
        <div className="xl:col-span-2 p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold font-mono text-white">LIVE CITY TRAFFIC MAP</h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Corridor: <span className="text-cyan-400 font-bold">College Rd → Junction → Bus Stand</span>
            </div>
          </div>

          {/* Map Component */}
          <CityTrafficMap height="h-[480px]" />
        </div>

        {/* Right 1 Column: Real-Time Event Sequence & Traffic Intelligence */}
        <div className="space-y-6">
          {/* Active ANPR Trajectory Event Timeline Card */}
          <div className="p-5 rounded-2xl bg-[#0d1527] border border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                REAL-TIME TRAJECTORY MATCH
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold">
                KA 19 AB 1234
              </span>
            </div>

            {/* Event Timeline */}
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/30">
              {currentTrajectory.points.map((pt, idx) => (
                <div key={idx} className="relative pl-7 space-y-1 text-xs">
                  <div className="absolute left-1.5 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_8px_#00f0ff]" />
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white">{pt.cameraName} — {pt.location}</span>
                    <span className="text-[10px] text-cyan-400">{pt.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span>{pt.status}</span>
                    <span className="text-emerald-400 font-mono">ANPR: {pt.anprConfidence}%</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActivePage('journey-map')}
              className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30 transition-all text-center block"
            >
              View Animated 3D Journey Map →
            </button>
          </div>

          {/* Traffic Intelligence Cards Summary */}
          <div className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-mono text-white border-b border-[#1b2a4a] pb-2">
              TRAFFIC INTELLIGENCE SUMMARY
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
                <div className="text-slate-400 text-[10px]">TRAFFIC HOTSPOTS</div>
                <div className="text-base font-bold text-rose-400">12 Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
                <div className="text-slate-400 text-[10px]">CONGESTED ROUTES</div>
                <div className="text-base font-bold text-amber-400">7 Corridors</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
                <div className="text-slate-400 text-[10px]">PEAK HOURS</div>
                <div className="text-xs font-bold text-cyan-400">08:30 – 10:30</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
                <div className="text-slate-400 text-[10px]">AVERAGE SPEED</div>
                <div className="text-base font-bold text-emerald-400">28 km/h</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
                <div className="text-slate-400 text-[10px]">AVG TRAVEL TIME</div>
                <div className="text-base font-bold text-purple-400">31 min</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
                <div className="text-slate-400 text-[10px]">VEHICLES / HOUR</div>
                <div className="text-base font-bold text-cyan-400">4,820</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
