import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Camera, VehicleTrajectory, TrafficHotspot } from '../../types/trajectra';
import { useSimulation } from '../../context/SimulationContext';
import { Radio, Car, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface CityTrafficMapProps {
  cameras?: Camera[];
  trajectory?: VehicleTrajectory;
  hotspots?: TrafficHotspot[];
  selectedCameraId?: string;
  onSelectCamera?: (id: string) => void;
  height?: string;
  showHotspots?: boolean;
}

// Custom Leaflet Icons
const createCameraIcon = (status: string, isSelected: boolean) => {
  const color = status === 'ONLINE' ? '#00f0ff' : status === 'WARNING' ? '#f59e0b' : '#f43f5e';
  const stroke = isSelected ? '#ffffff' : color;
  const shadow = isSelected ? '0 0 15px #00f0ff' : '0 0 8px rgba(0,240,255,0.5)';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">
      <circle cx="18" cy="18" r="16" fill="#0d1527" stroke="${stroke}" stroke-width="2.5" style="filter: drop-shadow(${shadow});"/>
      <circle cx="18" cy="18" r="12" fill="${color}" fill-opacity="0.2"/>
      <path d="M12 14h12v10H12z" fill="${color}"/>
      <circle cx="18" cy="19" r="3" fill="#070b14"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-camera-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const createVehicleIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="#00f0ff" fill-opacity="0.3" stroke="#00f0ff" stroke-width="2"/>
      <circle cx="20" cy="20" r="12" fill="#0d1527" stroke="#ffffff" stroke-width="1.5"/>
      <path d="M13 18l7-6 7 6v8h-14z" fill="#00f0ff"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-vehicle-marker animate-bounce',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export const CityTrafficMap: React.FC<CityTrafficMapProps> = ({
  cameras: propCameras,
  trajectory: propTrajectory,
  hotspots: propHotspots,
  selectedCameraId,
  onSelectCamera,
  height = 'h-[500px]',
  showHotspots = true
}) => {
  const { cameras: ctxCameras, currentTrajectory, hotspots: ctxHotspots, setSelectedCameraId } = useSimulation();

  const cameras = propCameras || ctxCameras;
  const trajectory = propTrajectory || currentTrajectory;
  const hotspots = propHotspots || ctxHotspots;

  // Animated moving vehicle coordinate state along trajectory polyline (Camera A -> B -> C)
  const [vehiclePosIndex, setVehiclePosIndex] = useState<number>(0);

  useEffect(() => {
    if (!trajectory || trajectory.routePath.length === 0) return;
    const interval = setInterval(() => {
      setVehiclePosIndex(prev => (prev + 1) % trajectory.routePath.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [trajectory]);

  const currentVehicleLatLng = trajectory?.routePath[vehiclePosIndex] || [12.9716, 77.5946];
  const centerLatLng: [number, number] = [12.9765, 77.6012];

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-[#1b2a4a] shadow-2xl`}>
      <MapContainer
        center={centerLatLng}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Dark Smart City CartoDB Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Route Polyline (Camera A -> B -> C) Glowing Cyan Path */}
        {trajectory && trajectory.routePath.length > 0 && (
          <>
            {/* Outer Glow Line */}
            <Polyline
              positions={trajectory.routePath}
              pathOptions={{
                color: '#00f0ff',
                weight: 8,
                opacity: 0.4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Inner Core Line */}
            <Polyline
              positions={trajectory.routePath}
              pathOptions={{
                color: '#ffffff',
                weight: 3,
                opacity: 0.9,
                dashArray: '8, 8'
              }}
            />
          </>
        )}

        {/* Hotspot Circles */}
        {showHotspots &&
          hotspots.map(hotspot => (
            <CircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng]}
              radius={hotspot.severity === 'CRITICAL' ? 32 : 24}
              pathOptions={{
                color: hotspot.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
                fillColor: hotspot.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
                fillOpacity: 0.25,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2 font-sans space-y-1 text-xs text-slate-100">
                  <div className="flex items-center space-x-1.5 font-bold font-mono text-rose-400">
                    <Flame className="w-4 h-4" />
                    <span>TRAFFIC HOTSPOT: {hotspot.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <div>Vehicles/min: <strong className="text-white">{hotspot.vehiclesPerMin}</strong></div>
                    <div>Avg Speed: <strong className="text-white">{hotspot.avgSpeedKmH} km/h</strong></div>
                    <div>Congestion: <strong className="text-rose-400">{hotspot.congestionPercentage}%</strong></div>
                    <div>Peak Hours: <strong className="text-amber-300">{hotspot.peakHours}</strong></div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Camera Markers */}
        {cameras.map(cam => {
          const isSelected = selectedCameraId === cam.id;
          return (
            <Marker
              key={cam.id}
              position={[cam.lat, cam.lng]}
              icon={createCameraIcon(cam.status, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectCamera) onSelectCamera(cam.id);
                  else setSelectedCameraId(cam.id);
                }
              }}
            >
              <Popup>
                <div className="p-2 space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <span className="font-bold font-mono text-cyan-400">{cam.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        cam.status === 'ONLINE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {cam.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Location: <strong>{cam.location}</strong></div>
                    <div>Active Vehicles: <strong className="text-cyan-400">{cam.vehicleCount}</strong></div>
                    <div>Density: <strong className="text-amber-400">{cam.density}</strong></div>
                    <div>ANPR Accuracy: <strong className="text-emerald-400">{cam.anprAccuracy}%</strong></div>
                    <div>RTSP Stream: <strong className="font-mono text-slate-400">{cam.ipAddress}</strong></div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCameraId(cam.id);
                    }}
                    className="w-full mt-2 py-1 px-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-mono text-[10px] font-semibold border border-cyan-500/40"
                  >
                    Inspect Feed →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Animated Moving Vehicle Marker */}
        {trajectory && (
          <Marker position={currentVehicleLatLng} icon={createVehicleIcon()}>
            <Popup>
              <div className="p-2 text-xs font-sans space-y-1">
                <div className="font-bold font-mono text-cyan-400 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" /> {trajectory.plateNumber}
                </div>
                <div className="text-[11px] text-slate-300">
                  <div>Status: <span className="text-emerald-400 font-semibold">IN TRANSIT</span></div>
                  <div>Point: {vehiclePosIndex + 1} / {trajectory.routePath.length}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay Legend Tag */}
      <div className="absolute bottom-4 left-4 z-[400] bg-[#070b14]/90 backdrop-blur-md p-3 rounded-xl border border-[#1b2a4a] text-xs font-mono space-y-1.5 shadow-xl pointer-events-auto">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
          Map Legend
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span className="text-slate-200 text-[11px]">CCTV Camera Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-1 bg-cyan-400 rounded-full" />
          <span className="text-slate-200 text-[11px]">Vehicle Trajectory Path</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/60 border border-rose-500" />
          <span className="text-slate-200 text-[11px]">Traffic Hotspot Zone</span>
        </div>
      </div>
    </div>
  );
};
