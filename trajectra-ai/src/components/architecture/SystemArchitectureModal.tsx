import React, { useState } from 'react';
import {
  X,
  Cpu,
  Database,
  Server,
  ShieldCheck,
  Code,
  Radio,
  Eye,
  Camera,
  Layers,
  ArrowDown,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { databaseSchemas, mockApiEndpoints } from '../../data/mockData';
import { useSimulation } from '../../context/SimulationContext';

export const SystemArchitectureModal: React.FC = () => {
  const { isArchModalOpen, setIsArchModalOpen } = useSimulation();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'database' | 'api' | 'privacy'>('pipeline');

  if (!isArchModalOpen) return null;

  const pipelineSteps = [
    { title: 'MULTIPLE CCTV CAMERAS', desc: '24 City-wide RTSP/H.264 IP Video Streams', icon: Camera, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { title: 'RTSP STREAM INGEST', desc: 'OpenCV VideoCapture & Frame Buffer Queue', icon: Radio, color: 'text-blue-400', border: 'border-blue-500/40' },
    { title: 'YOLOv8 VEHICLE DETECTION', desc: 'Object Classification (Car, Bus, Truck, Bike)', icon: Eye, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { title: 'ANPR / OCR RECOGNITION', desc: 'EasyOCR / PaddleOCR License Plate Extraction', icon: Code, color: 'text-amber-400', border: 'border-amber-500/40' },
    { title: 'VEHICLE IDENTITY ENGINE', desc: 'Normalized Registration Vector & Confidence Index', icon: Cpu, color: 'text-purple-400', border: 'border-purple-500/40' },
    { title: 'CROSS-CAMERA MATCHING', desc: 'Spatial & Temporal Correlation across Camera Nodes', icon: Layers, color: 'text-rose-400', border: 'border-rose-500/40' },
    { title: 'TRAJECTORY GENERATION', desc: 'PostGIS Linestring Trajectory Reconstruction', icon: Server, color: 'text-indigo-400', border: 'border-indigo-500/40' },
    { title: 'POSTGRESQL + POSTGIS DATASTORE', desc: 'Relational Spatial Indices & Audit Logs', icon: Database, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { title: 'PANDAS + NUMPY ANALYTICS', desc: 'Congestion Density, Speed Drop & Peak Algorithms', icon: Cpu, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { title: 'TRAJECTRA AI COMMAND CENTER', desc: 'Production-Grade React + Tailwind + Leaflet UI', icon: ShieldCheck, color: 'text-cyan-400', border: 'border-cyan-400' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0d1527] border border-[#1b2a4a] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#070b14] border-b border-[#1b2a4a] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide">
                SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATIONS
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Full-stack AI Engine pipeline for SIH 2026 Problem Statement SIH26127
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArchModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#1b2a4a] bg-[#090f1d] px-6">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 px-4 text-xs font-mono font-bold transition-all border-b-2 ${
              activeTab === 'pipeline'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. AI PIPELINE FLOWCHART
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-4 text-xs font-mono font-bold transition-all border-b-2 ${
              activeTab === 'database'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. POSTGRESQL SCHEMA
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 text-xs font-mono font-bold transition-all border-b-2 ${
              activeTab === 'api'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. FLASK REST APIs
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-mono font-bold transition-all border-b-2 ${
              activeTab === 'privacy'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. PRIVACY & SECURITY
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: AI PIPELINE FLOWCHART */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                <strong>SYSTEM FLOW:</strong> CCTV Feeds $\rightarrow$ Frame Processing $\rightarrow$ Object Detection $\rightarrow$ ANPR OCR $\rightarrow$ Vehicle Identity $\rightarrow$ Spatial Trajectory Reconstruction $\rightarrow$ Urban Intelligence.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pipelineSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="relative">
                      <div className={`p-4 rounded-xl bg-[#070b14] border ${step.border} shadow-lg flex items-center space-x-3`}>
                        <div className={`p-2.5 rounded-lg bg-slate-900 ${step.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-500">STAGE {idx + 1}</div>
                          <h4 className="text-xs font-bold font-mono text-white">{step.title}</h4>
                          <p className="text-[11px] text-slate-400 font-sans mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: POSTGRESQL SCHEMA */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              {databaseSchemas.map((schema) => (
                <div key={schema.tableName} className="rounded-2xl bg-[#070b14] border border-[#1b2a4a] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1b2a4a] pb-2">
                    <h4 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
                      <Database className="w-4 h-4" /> TABLE: {schema.tableName}
                    </h4>
                    <span className="text-xs text-slate-400 font-sans">{schema.description}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#1b2a4a] text-slate-400">
                          <th className="py-2 px-3">FIELD</th>
                          <th className="py-2 px-3">TYPE</th>
                          <th className="py-2 px-3">CONSTRAINTS</th>
                          <th className="py-2 px-3">DESCRIPTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.fields.map((field) => (
                          <tr key={field.name} className="border-b border-[#1b2a4a]/40 hover:bg-slate-900/50">
                            <td className="py-2 px-3 text-cyan-300 font-bold">{field.name}</td>
                            <td className="py-2 px-3 text-amber-300">{field.type}</td>
                            <td className="py-2 px-3 text-emerald-400">{field.constraints}</td>
                            <td className="py-2 px-3 text-slate-300 font-sans text-[11px]">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FLASK REST APIs */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              {mockApiEndpoints.map((endpoint, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#070b14] border border-[#1b2a4a] space-y-2 font-mono text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-white font-bold">{endpoint.path}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{endpoint.description}</p>
                  
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 whitespace-pre-wrap">
                    {endpoint.responseSample}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PRIVACY & SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 space-y-2">
                <h4 className="font-bold font-mono text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" /> PRIVACY-BY-DESIGN MANDATE
                </h4>
                <p>
                  "This prototype uses clearly marked simulated ANPR data and synthetic video feeds for demonstration. Production deployment should strictly adhere to Indian Digital Personal Data Protection (DPDP) Act 2023, law-enforcement compliance, encrypted video streaming (TLS 1.3), role-based access control (RBAC), and automated data retention purging protocols."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#070b14] border border-[#1b2a4a] space-y-2">
                  <h5 className="font-mono font-bold text-white text-xs text-cyan-400">ROLE-BASED ACCESS CONTROL (RBAC)</h5>
                  <p className="text-slate-400 text-[11px]">
                    Strict segregation of user privileges for Traffic Officers, Urban Planners, Control Room Operators, and Public Commuters.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#070b14] border border-[#1b2a4a] space-y-2">
                  <h5 className="font-mono font-bold text-white text-xs text-cyan-400">AUDIT LOGGING & ENCRYPTION</h5>
                  <p className="text-slate-400 text-[11px]">
                    Immutable PostgreSQL audit logs recording every license plate query, officer search, and trajectory lookup timestamp.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070b14] border-t border-[#1b2a4a] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>TRAJECTRA AI — SIH 2026 ARCHITECTURE</span>
          <button
            onClick={() => setIsArchModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
