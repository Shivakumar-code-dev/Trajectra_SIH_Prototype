import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  badge?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon: Icon,
  badge,
  highlight = false
}) => {
  return (
    <div
      className={`relative p-5 rounded-2xl transition-all duration-300 group overflow-hidden ${
        highlight
          ? 'bg-gradient-to-br from-[#0d1527] via-[#091124] to-[#0d1d3a] border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
          : 'bg-[#0d1527]/80 hover:bg-[#0d1527] border border-[#1b2a4a] hover:border-cyan-500/30'
      }`}
    >
      {/* Background Subtle Gradient Glow on Hover */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs font-medium text-slate-400 font-mono tracking-wide uppercase">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-[#070b14] border border-[#1b2a4a] text-cyan-400 group-hover:border-cyan-500/40 group-hover:scale-110 transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 flex items-baseline justify-between">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-2 pt-2 border-t border-[#1b2a4a]/60 flex items-center justify-between text-xs relative z-10">
          {subtitle && <span className="text-slate-400 font-sans text-[11px]">{subtitle}</span>}
          {change && (
            <span
              className={`font-mono text-[11px] font-semibold ${
                changeType === 'positive'
                  ? 'text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
