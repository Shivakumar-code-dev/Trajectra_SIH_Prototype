import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingDown, Cpu, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';

export const AIInsightsSection: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [showNewInsight, setShowNewInsight] = useState<boolean>(false);

  const steps = [
    'Initializing Neural Processing Engine...',
    'Analyzing 24 RTSP camera video streams...',
    'Matching cross-camera vehicle trajectories...',
    'Comparing 30-day historical traffic baselines...',
    'Generating predictive urban recommendations...'
  ];

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setShowNewInsight(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setAnalysisStep(step);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setShowNewInsight(true);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Run Analysis Call to Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              TRAJECTRA AI INTELLIGENCE & RECOMMENDATIONS
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Automated computer vision, spatial clustering, and predictive traffic optimization engine.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isAnalyzing}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
            isAnalyzing
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:scale-105 shadow-cyan-500/25'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'ANALYZING FEEDS...' : 'RUN AI ANALYSIS'}</span>
        </button>
      </div>

      {/* AI Processing Scanning Overlay Modal */}
      {isAnalyzing && (
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-cyan-500/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-spin" /> {steps[analysisStep]}
            </span>
            <span>STEP {analysisStep + 1} / 5</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-950 border border-cyan-500/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
              style={{ width: `${((analysisStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* AI Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Traffic Hotspot Warning */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-rose-500/30 hover:border-rose-500/60 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> ⚠ TRAFFIC HOTSPOT DETECTED
            </span>
            <span className="text-[10px] font-mono text-slate-400">HIGH SEVERITY</span>
          </div>

          <h4 className="text-base font-bold font-mono text-white">
            Junction Traffic Density Increased by +34%
          </h4>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Real-time optical flow counters detected abnormal vehicle accumulation at Central Junction (CAM-002).
            Average corridor travel speed has dropped from 28 km/h to 11.2 km/h.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs font-mono text-rose-300">
            <strong>RECOMMENDED ACTION:</strong> Extend green signal timing on North-South axis by 20s for the next 45 minutes.
          </div>
        </div>

        {/* Card 2: Congestion Pattern Alert */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-amber-500/30 hover:border-amber-500/60 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> ⚠ CONGESTION PATTERN
            </span>
            <span className="text-[10px] font-mono text-slate-400">PATTERN MATCH</span>
          </div>

          <h4 className="text-base font-bold font-mono text-white">
            College Road Recurrent Peak Congestion Window
          </h4>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Historical cross-camera analysis indicates College Road (CAM-001) consistently experiences heavy commuter traffic between <strong>08:30 AM – 10:15 AM</strong> daily.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs font-mono text-amber-300">
            <strong>RECOMMENDED ACTION:</strong> Deploy automated variable message signboards advising commuters to take Ring Road bypass.
          </div>
        </div>

        {/* Card 3: Route Optimization Suggestion */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> ✓ ROUTE OPTIMIZATION
            </span>
            <span className="text-[10px] font-mono text-slate-400">HIGH EFFICIENCY</span>
          </div>

          <h4 className="text-base font-bold font-mono text-white">
            Alternative Route via Ring Road Expressway
          </h4>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Spatial trajectory modeling confirms rerouting transit vehicles around Central Junction via Ring Road (CAM-006) reduces average travel time by approximately <strong>12% (6.5 minutes saved)</strong>.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs font-mono text-emerald-300">
            <strong>RECOMMENDED ACTION:</strong> Dynamically update public navigation feed APIs to prioritize Ring Road bypass.
          </div>
        </div>

        {/* Card 4: Abnormal Traffic Flow Alert */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> ⚠ ABNORMAL TRAFFIC FLOW
            </span>
            <span className="text-[10px] font-mono text-slate-400">SPEED DROP</span>
          </div>

          <h4 className="text-base font-bold font-mono text-white">
            Market Road Speed Dropped Below Baseline
          </h4>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Vehicle velocity on Market Road (CAM-005) dropped to 8.5 km/h compared to normal average speed of 24 km/h due to double-parked delivery vehicles.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <strong>RECOMMENDED ACTION:</strong> Alert local traffic wardens to clear illegal commercial loading blockages.
          </div>
        </div>

        {/* Newly Generated Insight Card (Appears after RUN AI ANALYSIS) */}
        {showNewInsight && (
          <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border-2 border-purple-500 shadow-2xl space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-purple-500 text-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> NEW REAL-TIME AI INSIGHT GENERATED
              </span>
              <span className="text-[10px] font-mono text-purple-300">JUST NOW</span>
            </div>

            <h4 className="text-lg font-bold font-mono text-white">
              Dynamic Signal Synchrony Recommendation (Green Wave)
            </h4>

            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              Neural trajectory engine correlated vehicle journeys from <strong>Camera A (College Road) → Camera B (Junction) → Camera C (Bus Stand)</strong>.
              Synchronizing traffic signals along this corridor will create a 28 km/h green-wave corridor, decreasing overall city trip time by <strong>18.4%</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
