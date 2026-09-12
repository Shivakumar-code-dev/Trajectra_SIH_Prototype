import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  mockHourlyFlowData,
  mockCameraCountData,
  mockVehicleTypeData,
  mockCongestedRoutes,
  mockHotspots
} from '../../data/mockData';
import { Filter, Calendar, BarChart2, TrendingUp, Zap, Clock, ShieldAlert } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'Today' | 'Yesterday' | '7Days' | '30Days'>('Today');
  const [selectedCameraFilter, setSelectedCameraFilter] = useState<string>('ALL');

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold font-mono text-white">ANALYTICAL FILTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#070b14] border border-[#1b2a4a]">
            {(['Today', 'Yesterday', '7Days', '30Days'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500 text-black font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range === '7Days' ? 'Last 7 Days' : range === '30Days' ? 'Last 30 Days' : range}
              </button>
            ))}
          </div>

          {/* Camera Filter Select */}
          <select
            value={selectedCameraFilter}
            onChange={(e) => setSelectedCameraFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#070b14] border border-[#1b2a4a] text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All City Cameras (24)</option>
            <option value="CAM-001">Camera A — College Road</option>
            <option value="CAM-002">Camera B — Junction</option>
            <option value="CAM-003">Camera C — Bus Stand</option>
            <option value="CAM-005">Camera E — Market Road</option>
          </select>
        </div>
      </div>

      {/* Row 1: Vehicle Flow by Hour Line Chart + Traffic Density Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Flow by Hour Line Chart */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                VEHICLE FLOW BY HOUR (LINE CHART)
              </h3>
              <p className="text-xs text-slate-400 font-sans">24-Hour hourly traffic volume influx</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              Peak: 09:00 AM & 06:00 PM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHourlyFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2a4a" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1527', borderColor: '#1b2a4a', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="vehicles" name="Vehicles / Hour" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: '#00f0ff' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Density Area Chart */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                CITY CONGESTION DENSITY (%)
              </h3>
              <p className="text-xs text-slate-400 font-sans">Percentage corridor capacity utilization</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
              Avg: 67%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHourlyFlowData}>
                <defs>
                  <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2a4a" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1527', borderColor: '#1b2a4a', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="congestion" name="Congestion %" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorCongestion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Vehicle Count by Camera Bar Chart + Vehicle Type Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Count by Camera Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              VEHICLE COUNT BY CAMERA LOCATION
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Influx</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCameraCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2a4a" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1527', borderColor: '#1b2a4a', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" name="Vehicles Detected" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Type Distribution Pie Chart */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              VEHICLE CLASSIFICATION
            </h3>
            <p className="text-xs text-slate-400 font-sans">YOLO model category distribution</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockVehicleTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockVehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1527', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1b2a4a] text-xs font-mono">
            {mockVehicleTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 text-[11px] truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Traffic Hotspots & Congested Routes Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspots Card List */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              IDENTIFIED TRAFFIC HOTSPOTS ({mockHotspots.length})
            </h3>
            <span className="text-xs text-rose-400 font-mono font-bold">12 Active City-Wide</span>
          </div>

          <div className="space-y-3">
            {mockHotspots.map((spot) => (
              <div
                key={spot.id}
                className="p-3 rounded-xl bg-[#070b14] border border-[#1b2a4a] flex items-center justify-between text-xs font-sans"
              >
                <div>
                  <div className="font-bold text-white font-mono">{spot.location}</div>
                  <div className="text-[11px] text-slate-400">
                    Peak: {spot.peakHours} | Avg Speed: <strong className="text-white">{spot.avgSpeedKmH} km/h</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      spot.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {spot.severity} ({spot.congestionPercentage}%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {spot.vehiclesPerMin} veh/min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Congested Routes Card List */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-[#1b2a4a] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              CONGESTED ROUTE CORRIDORS ({mockCongestedRoutes.length})
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold">Delay Analytics</span>
          </div>

          <div className="space-y-3">
            {mockCongestedRoutes.map((route) => (
              <div
                key={route.id}
                className="p-3 rounded-xl bg-[#070b14] border border-[#1b2a4a] flex items-center justify-between text-xs font-sans"
              >
                <div>
                  <div className="font-bold text-white font-mono">{route.routeName}</div>
                  <div className="text-[11px] text-slate-400">
                    Distance: <strong>{route.distanceKm} km</strong> | Typical Time:{' '}
                    <strong>{route.typicalTravelTimeMin} min</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-rose-400 font-mono">
                    +{route.delayMin} min DELAY
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Current: {route.currentTravelTimeMin} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
