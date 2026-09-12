import React from 'react';
import { Sparkles } from 'lucide-react';
import { AIInsightsSection } from '../components/insights/AIInsightsSection';

export const AIInsightsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a4a] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            AI TRAFFIC INTELLIGENCE & ADVISORIES
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Automated neural network recommendations for signal timing optimization and bottleneck mitigation
          </p>
        </div>
      </div>

      <AIInsightsSection />
    </div>
  );
};
