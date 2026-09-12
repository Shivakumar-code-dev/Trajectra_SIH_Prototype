import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';

export const TrafficAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            URBAN TRAFFIC ANALYTICS
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Interactive Recharts visualizations: Vehicle flow by hour, speed drops, camera influx, and peak hour distributions
          </p>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
};
