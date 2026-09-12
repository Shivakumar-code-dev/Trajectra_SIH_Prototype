export type CameraStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export interface Camera {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: CameraStatus;
  fps: number;
  vehicleCount: number;
  anprAccuracy: number;
  density: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  lastActiveTime: string;
  ipAddress: string;
  streamUrl?: string;
  zone: string;
}

export type VehicleType = 'Car' | 'Bus' | 'Truck' | 'Bike' | 'Van';
export type VehicleColor = 'White' | 'Black' | 'Silver' | 'Red' | 'Blue' | 'Grey';

export interface BoundingBox {
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  label: VehicleType;
  confidence: number;
  plateNumber?: string;
  plateConfidence?: number;
}

export interface CameraFeedDetection {
  cameraId: string;
  timestamp: string;
  frameId: number;
  vehiclesCount: number;
  fps: number;
  density: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  boxes: BoundingBox[];
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  color: VehicleColor;
  makeModel: string;
  firstSeen: string;
  lastSeen: string;
  camerasMatched: number;
  status: 'TRACKING COMPLETE' | 'IN TRANSIT' | 'ALERT';
  anprConfidence: number;
  ownerCategory?: string;
  imageUrl?: string;
}

export interface TrajectoryPoint {
  cameraId: string;
  cameraName: string;
  location: string;
  timestamp: string;
  lat: number;
  lng: number;
  anprConfidence: number;
  speed: number; // km/h
  status: 'MATCH CONFIRMED' | 'DETECTED' | 'EXITED';
  imageSnapshot?: string;
}

export interface VehicleTrajectory {
  id: string;
  vehicleId: string;
  plateNumber: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  distanceKm: number;
  avgSpeedKmH: number;
  camerasVisited: number;
  routePath: [number, number][]; // lat, lng pairs
  points: TrajectoryPoint[];
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface TrafficAlert {
  id: string;
  title: string;
  location: string;
  cameraId?: string;
  timestamp: string;
  severity: AlertSeverity;
  category: 'CONGESTION' | 'ANPR_MATCH' | 'SPEED_ABNORMALITY' | 'INCIDENT' | 'SYSTEM';
  description: string;
  actionRecommended?: string;
}

export interface TrafficHotspot {
  id: string;
  location: string;
  zone: string;
  lat: number;
  lng: number;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  vehiclesPerMin: number;
  avgSpeedKmH: number;
  congestionPercentage: number;
  peakHours: string;
  contributingCameras: string[];
}

export interface CongestedRoute {
  id: string;
  originCamera: string;
  destinationCamera: string;
  routeName: string;
  status: 'Heavy' | 'Moderate' | 'Critical' | 'Normal';
  currentTravelTimeMin: number;
  typicalTravelTimeMin: number;
  delayMin: number;
  distanceKm: number;
}

export interface AnalyticsSummary {
  totalVehiclesDetectedToday: number;
  activeCameras: number;
  totalCameras: number;
  vehiclesCurrentlyTracked: number;
  cityCongestionLevel: number; // percentage
  anprMatchRate: number; // percentage
  trafficHotspotsCount: number;
  avgSpeedCityWideKmH: number;
  avgTravelTimeMin: number;
  vehiclesPerHour: number;
}

export interface DatabaseField {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface DatabaseTableSchema {
  tableName: string;
  description: string;
  fields: DatabaseField[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  responseSample: string;
}

export interface SihDemoStep {
  stepIndex: number;
  title: string;
  subtitle: string;
  activePage: string;
  activeVehiclePlate?: string;
  toastMessage: string;
  highlightComponent?: string;
  delayMs: number;
}
