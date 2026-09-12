import React, { useState } from 'react';
import { Camera, CameraFeedDetection, BoundingBox } from '../../types/trajectra';
import { mockCameraDetections } from '../../data/mockData';
import { Radio, Eye, ShieldCheck, Activity, Maximize2, AlertCircle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface CCTVGridProps {
  cameras: Camera[];
}

export const CCTVGrid: React.FC<CCTVGridProps> = ({ cameras }) => {
  const { setSelectedPlate, setActivePage } = useSimulation();

  // Take top 6 cameras for the 6-camera CCTV wall grid
  const gridCameras = cameras.slice(0, 6);
  const [selectedBox, setSelectedBox] = useState<{ cameraId: string; box: BoundingBox } | null>(null);

  const handleBoxClick = (cameraId: string, box: BoundingBox) => {
    setSelectedBox({ cameraId, box });
    if (box.plateNumber) {
      setSelectedPlate(box.plateNumber);
    }
  };

  return (
    <div className="space-y-6">
      {/* 6 Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {gridCameras.map((cam) => {
          const detection = mockCameraDetections[cam.id] || {
            cameraId: cam.id,
            timestamp: '09:00:00 AM',
            frameId: 12000,
            vehiclesCount: cam.vehicleCount,
            fps: cam.fps,
            density: cam.density,
            boxes: [
              { x: 20, y: 30, width: 30, height: 35, label: 'Car' as const, confidence: 0.96, plateNumber: 'KA 19 AB 1234', plateConfidence: 98.7 }
            ]
          };

          return (
            <div
              key={cam.id}
              className="relative rounded-2xl bg-[#0d1527] border border-[#1b2a4a] hover:border-cyan-500/50 shadow-xl overflow-hidden group transition-all"
            >
              {/* Simulated Camera Video Feed Screen */}
              <div className="relative h-56 md:h-60 bg-slate-950 overflow-hidden flex items-center justify-center">
                {/* Background Video Simulator Mesh / Texture */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity filter contrast-125"
                  style={{
                    backgroundImage:
                      cam.id === 'CAM-001'
                        ? 'url(https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop)'
                        : cam.id === 'CAM-002'
                        ? 'url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop)'
                        : cam.id === 'CAM-003'
                        ? 'url(https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop)'
                        : 'url(https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=800&auto=format&fit=crop)'
                  }}
                />

                {/* Scanline CRT overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />

                {/* Top Video Feed Overlay Bar */}
                <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-xs font-mono z-10">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-bold border border-rose-500/40 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>LIVE</span>
                    </span>
                    <span className="text-white font-bold tracking-wide">{cam.name}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-semibold">{cam.fps} FPS</div>
                </div>

                {/* Simulated YOLO Computer Vision Bounding Boxes */}
                {detection.boxes.map((box, idx) => {
                  const isBoxSelected =
                    selectedBox?.cameraId === cam.id && selectedBox?.box.plateNumber === box.plateNumber;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleBoxClick(cam.id, box)}
                      className={`absolute border-2 transition-all duration-300 cursor-pointer ${
                        isBoxSelected
                          ? 'border-cyan-400 bg-cyan-500/30 shadow-[0_0_15px_#00f0ff] z-20 scale-105'
                          : 'border-emerald-400/80 bg-emerald-500/10 hover:border-cyan-400 hover:bg-cyan-500/20'
                      }`}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`
                      }}
                    >
                      {/* Bounding Box Label Tag */}
                      <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-black/90 text-[9px] font-mono font-bold text-cyan-300 border border-cyan-400/60 whitespace-nowrap flex items-center gap-1 shadow-md">
                        <span>{box.label}</span>
                        {box.plateNumber && <span className="text-amber-300 font-mono">[{box.plateNumber}]</span>}
                        <span>{(box.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Video Feed Specs Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-[11px] font-mono text-slate-300 z-10">
                  <div>
                    Vehicles: <strong className="text-cyan-400">{cam.vehicleCount}</strong>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Density:</span>
                    <span
                      className={`font-bold ${
                        cam.density === 'CRITICAL'
                          ? 'text-rose-400'
                          : cam.density === 'HIGH'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {cam.density}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feed Card Footer Actions */}
              <div className="p-3 bg-[#0d1527] flex items-center justify-between border-t border-[#1b2a4a] text-xs">
                <div className="text-slate-400 font-mono text-[11px]">
                  ANPR Rate: <strong className="text-emerald-400">{cam.anprAccuracy}%</strong>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlate('KA 19 AB 1234');
                    setActivePage('vehicle-tracking');
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-semibold"
                >
                  Track ANPR →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Detection Inspector Panel */}
      {selectedBox && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#091020] to-[#0d1527] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                SELECTED DETECTION SNAPSHOT
              </div>
              <h4 className="text-xl font-bold font-mono text-white mt-0.5">
                PLATE: {selectedBox.box.plateNumber || 'KA 19 AB 1234'}
              </h4>
              <p className="text-xs text-slate-300 font-sans">
                Camera Feed: <strong>{selectedBox.cameraId}</strong> | Classification:{' '}
                <strong>{selectedBox.box.label}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-400">ANPR Confidence:</span>
              <div className="text-lg font-bold text-emerald-400">
                {selectedBox.box.plateConfidence || 98.7}%
              </div>
            </div>
            <div>
              <span className="text-slate-400">YOLO Confidence:</span>
              <div className="text-lg font-bold text-cyan-400">
                {(selectedBox.box.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPlate(selectedBox.box.plateNumber || 'KA 19 AB 1234');
                setActivePage('journey-map');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              VIEW COMPLETE JOURNEY →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
