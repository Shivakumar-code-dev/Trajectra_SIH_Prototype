import {
  Camera,
  Vehicle,
  VehicleTrajectory,
  TrafficAlert,
  TrafficHotspot,
  CongestedRoute,
  AnalyticsSummary,
  DatabaseTableSchema,
  ApiEndpoint,
  SihDemoStep,
  CameraFeedDetection
} from '../types/trajectra';

// Coordinates centered around a realistic Indian Smart City corridor (e.g. Mangalore/Bangalore Smart Corridor)
export const mockCameras: Camera[] = [
  {
    id: 'CAM-001',
    name: 'Camera A — College Road',
    location: 'College Road Entrance North',
    lat: 12.9716,
    lng: 77.5946,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 124,
    anprAccuracy: 98.7,
    density: 'MODERATE',
    lastActiveTime: 'Just now',
    ipAddress: '192.168.1.101',
    zone: 'North Zone'
  },
  {
    id: 'CAM-002',
    name: 'Camera B — Junction',
    location: 'Central Traffic Circle Junction',
    lat: 12.9765,
    lng: 77.6012,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 182,
    anprAccuracy: 98.2,
    density: 'HIGH',
    lastActiveTime: 'Just now',
    ipAddress: '192.168.1.102',
    zone: 'Central Zone'
  },
  {
    id: 'CAM-003',
    name: 'Camera C — Bus Stand',
    location: 'KSRTC Intercity Bus Station',
    lat: 12.9821,
    lng: 77.6089,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 145,
    anprAccuracy: 97.9,
    density: 'HIGH',
    lastActiveTime: 'Just now',
    ipAddress: '192.168.1.103',
    zone: 'Central Zone'
  },
  {
    id: 'CAM-004',
    name: 'Camera D — Railway Road',
    location: 'Central Station Approach Road',
    lat: 12.9874,
    lng: 77.6154,
    status: 'ONLINE',
    fps: 29,
    vehicleCount: 98,
    anprAccuracy: 96.4,
    density: 'MODERATE',
    lastActiveTime: '2 sec ago',
    ipAddress: '192.168.1.104',
    zone: 'East Zone'
  },
  {
    id: 'CAM-005',
    name: 'Camera E — Market Road',
    location: 'Old Commercial Market Square',
    lat: 12.9682,
    lng: 77.6045,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 210,
    anprAccuracy: 95.8,
    density: 'CRITICAL',
    lastActiveTime: '1 sec ago',
    ipAddress: '192.168.1.105',
    zone: 'South Zone'
  },
  {
    id: 'CAM-006',
    name: 'Camera F — Ring Road',
    location: 'Outer Bypass Flyover Interchange',
    lat: 12.9912,
    lng: 77.5891,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 168,
    anprAccuracy: 99.1,
    density: 'HIGH',
    lastActiveTime: 'Just now',
    ipAddress: '192.168.1.106',
    zone: 'North-West Zone'
  },
  {
    id: 'CAM-007',
    name: 'Camera G — IT Park Gate',
    location: 'Tech Corridor Gateway 1',
    lat: 12.9554,
    lng: 77.6210,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 240,
    anprAccuracy: 98.9,
    density: 'HIGH',
    lastActiveTime: 'Just now',
    ipAddress: '192.168.1.107',
    zone: 'SEZ Corridor'
  },
  {
    id: 'CAM-008',
    name: 'Camera H — Airport Highway',
    location: 'Expressway Toll Gate 4',
    lat: 13.0112,
    lng: 77.6321,
    status: 'WARNING',
    fps: 22,
    vehicleCount: 88,
    anprAccuracy: 92.1,
    density: 'MODERATE',
    lastActiveTime: '12 sec ago',
    ipAddress: '192.168.1.108',
    zone: 'North Expressway'
  },
  {
    id: 'CAM-009',
    name: 'Camera I — Industrial Estate',
    location: 'Ph-2 Cargo Checkpost',
    lat: 12.9412,
    lng: 77.5710,
    status: 'ONLINE',
    fps: 30,
    vehicleCount: 76,
    anprAccuracy: 97.4,
    density: 'LOW',
    lastActiveTime: 'Just now',
    ipAddress: '192.168.1.109',
    zone: 'Industrial West'
  },
  {
    id: 'CAM-010',
    name: 'Camera J — Metro Terminal',
    location: 'Green Line Elevated Station',
    lat: 12.9645,
    lng: 77.5832,
    status: 'OFFLINE',
    fps: 0,
    vehicleCount: 0,
    anprAccuracy: 0,
    density: 'LOW',
    lastActiveTime: '18 min ago',
    ipAddress: '192.168.1.110',
    zone: 'Central Transit'
  },
  // Additional cameras to reach 24 cameras
  ...Array.from({ length: 14 }).map((_, index) => {
    const idNum = index + 11;
    const formattedId = `CAM-${idNum.toString().padStart(3, '0')}`;
    return {
      id: formattedId,
      name: `Camera ${String.fromCharCode(65 + (idNum % 26))} — Sector ${idNum}`,
      location: `Suburban Sector ${idNum} Junction`,
      lat: 12.9600 + (index * 0.004) - (index % 2 * 0.008),
      lng: 77.5900 + (index * 0.005) - (index % 3 * 0.006),
      status: index === 3 ? ('WARNING' as const) : ('ONLINE' as const),
      fps: index === 3 ? 24 : 30,
      vehicleCount: 60 + (index * 9) % 110,
      anprAccuracy: 96.5 + (index % 4) * 0.8,
      density: (index % 3 === 0 ? 'HIGH' : index % 3 === 1 ? 'MODERATE' : 'LOW') as any,
      lastActiveTime: 'Just now',
      ipAddress: `192.168.1.${110 + idNum}`,
      zone: `Sector ${idNum} Sub-Zone`
    };
  })
];

export const mockPrimaryVehicle: Vehicle = {
  id: 'VEH-1001',
  plateNumber: 'KA 19 AB 1234',
  vehicleType: 'Car',
  color: 'White',
  makeModel: 'Hyundai Verna (White Sedan)',
  firstSeen: '09:00 AM',
  lastSeen: '09:30 AM',
  camerasMatched: 3,
  status: 'TRACKING COMPLETE',
  anprConfidence: 98.7,
  ownerCategory: 'Private Passenger',
  imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
};

export const mockSecondaryVehicles: Vehicle[] = [
  mockPrimaryVehicle,
  {
    id: 'VEH-1002',
    plateNumber: 'KA 05 MN 4821',
    vehicleType: 'Car',
    color: 'Black',
    makeModel: 'Honda City',
    firstSeen: '08:45 AM',
    lastSeen: '09:22 AM',
    camerasMatched: 4,
    status: 'TRACKING COMPLETE',
    anprConfidence: 97.4,
    ownerCategory: 'Private Passenger'
  },
  {
    id: 'VEH-1003',
    plateNumber: 'KA 03 XY 9217',
    vehicleType: 'Bus',
    color: 'Blue',
    makeModel: 'Volvo B11R AC Transit',
    firstSeen: '07:30 AM',
    lastSeen: '09:35 AM',
    camerasMatched: 6,
    status: 'IN TRANSIT',
    anprConfidence: 99.2,
    ownerCategory: 'Public Transport'
  },
  {
    id: 'VEH-1004',
    plateNumber: 'MH 12 GT 9081',
    vehicleType: 'Truck',
    color: 'Red',
    makeModel: 'Tata Signa 2823',
    firstSeen: '09:05 AM',
    lastSeen: '09:38 AM',
    camerasMatched: 2,
    status: 'ALERT',
    anprConfidence: 94.8,
    ownerCategory: 'Commercial Cargo'
  },
  {
    id: 'VEH-1005',
    plateNumber: 'DL 01 AB 4432',
    vehicleType: 'Car',
    color: 'Silver',
    makeModel: 'Toyota Fortuner',
    firstSeen: '09:10 AM',
    lastSeen: '09:32 AM',
    camerasMatched: 3,
    status: 'TRACKING COMPLETE',
    anprConfidence: 98.1,
    ownerCategory: 'Private Passenger'
  },
  {
    id: 'VEH-1006',
    plateNumber: 'KA 19 CB 9988',
    vehicleType: 'Bike',
    color: 'Black',
    makeModel: 'Royal Enfield Classic 350',
    firstSeen: '09:12 AM',
    lastSeen: '09:28 AM',
    camerasMatched: 2,
    status: 'TRACKING COMPLETE',
    anprConfidence: 96.0,
    ownerCategory: 'Two Wheeler'
  },
  {
    id: 'VEH-1007',
    plateNumber: 'KA 20 EV 3311',
    vehicleType: 'Car',
    color: 'Grey',
    makeModel: 'Tata Nexon EV',
    firstSeen: '09:18 AM',
    lastSeen: '09:40 AM',
    camerasMatched: 3,
    status: 'IN TRANSIT',
    anprConfidence: 98.9,
    ownerCategory: 'Electric Vehicle'
  }
];

export const mockPrimaryTrajectory: VehicleTrajectory = {
  id: 'TRAJ-8821',
  vehicleId: mockPrimaryVehicle.id,
  plateNumber: mockPrimaryVehicle.plateNumber,
  startTime: '09:00 AM',
  endTime: '09:30 AM',
  durationMinutes: 30,
  distanceKm: 8.4,
  avgSpeedKmH: 16.8,
  camerasVisited: 3,
  routePath: [
    [12.9716, 77.5946], // Camera A
    [12.9740, 77.5980], // Waypoint 1
    [12.9765, 77.6012], // Camera B
    [12.9790, 77.6050], // Waypoint 2
    [12.9821, 77.6089], // Camera C
  ],
  points: [
    {
      cameraId: 'CAM-001',
      cameraName: 'Camera A',
      location: 'College Road',
      timestamp: '09:00 AM',
      lat: 12.9716,
      lng: 77.5946,
      anprConfidence: 98.7,
      speed: 28.5,
      status: 'DETECTED',
      imageSnapshot: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop'
    },
    {
      cameraId: 'CAM-002',
      cameraName: 'Camera B',
      location: 'Junction',
      timestamp: '09:15 AM',
      lat: 12.9765,
      lng: 77.6012,
      anprConfidence: 98.2,
      speed: 12.4,
      status: 'MATCH CONFIRMED',
      imageSnapshot: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&auto=format&fit=crop'
    },
    {
      cameraId: 'CAM-003',
      cameraName: 'Camera C',
      location: 'Bus Stand',
      timestamp: '09:30 AM',
      lat: 12.9821,
      lng: 77.6089,
      anprConfidence: 97.9,
      speed: 18.2,
      status: 'MATCH CONFIRMED',
      imageSnapshot: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400&auto=format&fit=crop'
    }
  ]
};

export const mockHotspots: TrafficHotspot[] = [
  {
    id: 'HOT-01',
    location: 'Junction (Central Circle)',
    zone: 'Central Zone',
    lat: 12.9765,
    lng: 77.6012,
    severity: 'CRITICAL',
    vehiclesPerMin: 84,
    avgSpeedKmH: 11.2,
    congestionPercentage: 88,
    peakHours: '08:30 AM – 10:30 AM',
    contributingCameras: ['CAM-002', 'CAM-005']
  },
  {
    id: 'HOT-02',
    location: 'Market Road Commercial Area',
    zone: 'South Zone',
    lat: 12.9682,
    lng: 77.6045,
    severity: 'HIGH',
    vehiclesPerMin: 72,
    avgSpeedKmH: 14.5,
    congestionPercentage: 79,
    peakHours: '09:00 AM – 11:30 AM',
    contributingCameras: ['CAM-005']
  },
  {
    id: 'HOT-03',
    location: 'Bus Stand Terminal Approach',
    zone: 'Central Zone',
    lat: 12.9821,
    lng: 77.6089,
    severity: 'HIGH',
    vehiclesPerMin: 68,
    avgSpeedKmH: 16.8,
    congestionPercentage: 74,
    peakHours: '08:00 AM – 10:00 AM',
    contributingCameras: ['CAM-003']
  },
  {
    id: 'HOT-04',
    location: 'Ring Road Bypass Flyover',
    zone: 'North-West Zone',
    lat: 12.9912,
    lng: 77.5891,
    severity: 'MEDIUM',
    vehiclesPerMin: 55,
    avgSpeedKmH: 22.4,
    congestionPercentage: 62,
    peakHours: '05:30 PM – 08:00 PM',
    contributingCameras: ['CAM-006']
  }
];

export const mockCongestedRoutes: CongestedRoute[] = [
  {
    id: 'RTE-01',
    originCamera: 'Camera A (College Road)',
    destinationCamera: 'Camera B (Junction)',
    routeName: 'College Road → Junction',
    status: 'Heavy',
    currentTravelTimeMin: 15,
    typicalTravelTimeMin: 7,
    delayMin: 8,
    distanceKm: 2.8
  },
  {
    id: 'RTE-02',
    originCamera: 'Camera B (Junction)',
    destinationCamera: 'Camera C (Bus Stand)',
    routeName: 'Junction → Bus Stand',
    status: 'Moderate',
    currentTravelTimeMin: 15,
    typicalTravelTimeMin: 10,
    delayMin: 5,
    distanceKm: 3.2
  },
  {
    id: 'RTE-03',
    originCamera: 'Camera E (Market Road)',
    destinationCamera: 'Camera B (Junction)',
    routeName: 'Market Road → Junction Corridor',
    status: 'Critical',
    currentTravelTimeMin: 22,
    typicalTravelTimeMin: 9,
    delayMin: 13,
    distanceKm: 2.4
  },
  {
    id: 'RTE-04',
    originCamera: 'Camera F (Ring Road)',
    destinationCamera: 'Camera D (Railway Road)',
    routeName: 'Ring Road Expressway Bypass',
    status: 'Heavy',
    currentTravelTimeMin: 18,
    typicalTravelTimeMin: 11,
    delayMin: 7,
    distanceKm: 5.6
  }
];

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalVehiclesDetectedToday: 12842,
  activeCameras: 24,
  totalCameras: 24,
  vehiclesCurrentlyTracked: 8426,
  cityCongestionLevel: 67,
  anprMatchRate: 94.7,
  trafficHotspotsCount: 12,
  avgSpeedCityWideKmH: 28,
  avgTravelTimeMin: 31,
  vehiclesPerHour: 4820
};

export const mockAlerts: TrafficAlert[] = [
  {
    id: 'ALT-901',
    title: 'Major congestion detected',
    location: 'Junction (CAM-002)',
    cameraId: 'CAM-002',
    timestamp: '2 min ago',
    severity: 'CRITICAL',
    category: 'CONGESTION',
    description: 'Vehicle queue length exceeded 450 meters. Average speed dropped to 11 km/h.',
    actionRecommended: 'Recommend extending green signal duration on North-South corridor by 20s.'
  },
  {
    id: 'ALT-902',
    title: 'Cross-Camera ANPR Trajectory Confirmed',
    location: 'College Rd → Junction → Bus Stand',
    cameraId: 'CAM-003',
    timestamp: '5 min ago',
    severity: 'INFO',
    category: 'ANPR_MATCH',
    description: 'Vehicle KA 19 AB 1234 matched across 3 consecutive cameras with 98.7% confidence.',
    actionRecommended: 'Trajectory logged to PostgreSQL spatial index.'
  },
  {
    id: 'ALT-903',
    title: 'Traffic density increasing rapidly',
    location: 'College Road (CAM-001)',
    cameraId: 'CAM-001',
    timestamp: '8 min ago',
    severity: 'WARNING',
    category: 'CONGESTION',
    description: 'Vehicle influx increased by 34% in the last 15 minutes.',
    actionRecommended: 'Issue advisory message to digital variable signboards on Ring Road.'
  },
  {
    id: 'ALT-904',
    title: 'Abnormal slow speed detected',
    location: 'Market Road (CAM-005)',
    cameraId: 'CAM-005',
    timestamp: '14 min ago',
    severity: 'WARNING',
    category: 'SPEED_ABNORMALITY',
    description: 'Average traffic speed 8.5 km/h compared to historical baseline of 24 km/h.',
    actionRecommended: 'Dispatch traffic warden to clear double-parked commercial delivery trucks.'
  },
  {
    id: 'ALT-905',
    title: 'Camera Lens Glare Advisory',
    location: 'Airport Highway (CAM-008)',
    cameraId: 'CAM-008',
    timestamp: '22 min ago',
    severity: 'INFO',
    category: 'SYSTEM',
    description: 'Direct sunlight exposure slightly reduced ANPR confidence to 92.1%.',
    actionRecommended: 'Auto-gain HDR adjustment applied.'
  }
];

export const mockHourlyFlowData = [
  { hour: '00:00', vehicles: 420, avgSpeed: 48, congestion: 12 },
  { hour: '02:00', vehicles: 210, avgSpeed: 52, congestion: 8 },
  { hour: '04:00', vehicles: 310, avgSpeed: 50, congestion: 10 },
  { hour: '06:00', vehicles: 1250, avgSpeed: 42, congestion: 28 },
  { hour: '08:00', vehicles: 4820, avgSpeed: 22, congestion: 78 },
  { hour: '09:00', vehicles: 5410, avgSpeed: 18, congestion: 85 },
  { hour: '10:00', vehicles: 4900, avgSpeed: 24, congestion: 72 },
  { hour: '12:00', vehicles: 3800, avgSpeed: 32, congestion: 54 },
  { hour: '14:00', vehicles: 3600, avgSpeed: 34, congestion: 48 },
  { hour: '16:00', vehicles: 4200, avgSpeed: 28, congestion: 64 },
  { hour: '18:00', vehicles: 5890, avgSpeed: 16, congestion: 92 },
  { hour: '20:00', vehicles: 4100, avgSpeed: 26, congestion: 68 },
  { hour: '22:00', vehicles: 1890, avgSpeed: 40, congestion: 34 },
];

export const mockCameraCountData = [
  { name: 'Cam A (College)', count: 124, speed: 28.5 },
  { name: 'Cam B (Junction)', count: 182, speed: 12.4 },
  { name: 'Cam C (Bus Stand)', count: 145, speed: 18.2 },
  { name: 'Cam D (Railway)', count: 98, speed: 31.0 },
  { name: 'Cam E (Market)', count: 210, speed: 10.5 },
  { name: 'Cam F (Ring Rd)', count: 168, speed: 38.0 },
  { name: 'Cam G (IT Park)', count: 240, speed: 14.2 },
];

export const mockVehicleTypeData = [
  { name: 'Cars / Sedans', value: 58, color: '#00f0ff' },
  { name: 'Two Wheelers', value: 24, color: '#3b82f6' },
  { name: 'Buses / Transit', value: 10, color: '#10b981' },
  { name: 'Commercial Trucks', value: 8, color: '#f59e0b' },
];

export const mockCameraDetections: Record<string, CameraFeedDetection> = {
  'CAM-001': {
    cameraId: 'CAM-001',
    timestamp: '09:00:15 AM',
    frameId: 10482,
    vehiclesCount: 42,
    fps: 30,
    density: 'MODERATE',
    boxes: [
      { x: 15, y: 35, width: 28, height: 32, label: 'Car', confidence: 0.96, plateNumber: 'KA 19 AB 1234', plateConfidence: 98.7 },
      { x: 52, y: 40, width: 22, height: 26, label: 'Car', confidence: 0.94, plateNumber: 'KA 05 MN 4821', plateConfidence: 97.4 },
      { x: 80, y: 28, width: 16, height: 20, label: 'Bike', confidence: 0.91, plateNumber: 'KA 19 CB 9988', plateConfidence: 96.0 }
    ]
  },
  'CAM-002': {
    cameraId: 'CAM-002',
    timestamp: '09:15:22 AM',
    frameId: 18290,
    vehiclesCount: 68,
    fps: 30,
    density: 'HIGH',
    boxes: [
      { x: 22, y: 30, width: 32, height: 38, label: 'Car', confidence: 0.98, plateNumber: 'KA 19 AB 1234', plateConfidence: 98.2 },
      { x: 60, y: 15, width: 34, height: 50, label: 'Bus', confidence: 0.99, plateNumber: 'KA 03 XY 9217', plateConfidence: 99.2 },
      { x: 5, y: 45, width: 24, height: 30, label: 'Car', confidence: 0.92, plateNumber: 'DL 01 AB 4432', plateConfidence: 98.1 }
    ]
  },
  'CAM-003': {
    cameraId: 'CAM-003',
    timestamp: '09:30:04 AM',
    frameId: 24912,
    vehiclesCount: 54,
    fps: 30,
    density: 'HIGH',
    boxes: [
      { x: 38, y: 32, width: 30, height: 34, label: 'Car', confidence: 0.97, plateNumber: 'KA 19 AB 1234', plateConfidence: 97.9 },
      { x: 10, y: 20, width: 35, height: 48, label: 'Bus', confidence: 0.96, plateNumber: 'KA 03 XY 9217', plateConfidence: 98.8 },
      { x: 75, y: 50, width: 20, height: 24, label: 'Car', confidence: 0.95, plateNumber: 'KA 20 EV 3311', plateConfidence: 98.9 }
    ]
  },
  'CAM-004': {
    cameraId: 'CAM-004',
    timestamp: '09:32:10 AM',
    frameId: 25100,
    vehiclesCount: 31,
    fps: 29,
    density: 'MODERATE',
    boxes: [
      { x: 25, y: 35, width: 26, height: 30, label: 'Car', confidence: 0.93, plateNumber: 'DL 01 AB 4432', plateConfidence: 97.5 }
    ]
  },
  'CAM-005': {
    cameraId: 'CAM-005',
    timestamp: '09:35:45 AM',
    frameId: 26210,
    vehiclesCount: 89,
    fps: 30,
    density: 'CRITICAL',
    boxes: [
      { x: 12, y: 25, width: 42, height: 55, label: 'Truck', confidence: 0.95, plateNumber: 'MH 12 GT 9081', plateConfidence: 94.8 },
      { x: 58, y: 42, width: 28, height: 32, label: 'Car', confidence: 0.96, plateNumber: 'KA 05 MN 4821', plateConfidence: 96.8 }
    ]
  },
  'CAM-006': {
    cameraId: 'CAM-006',
    timestamp: '09:38:12 AM',
    frameId: 27800,
    vehiclesCount: 62,
    fps: 30,
    density: 'HIGH',
    boxes: [
      { x: 40, y: 30, width: 30, height: 34, label: 'Car', confidence: 0.97, plateNumber: 'KA 20 EV 3311', plateConfidence: 99.1 }
    ]
  }
};

export const databaseSchemas: DatabaseTableSchema[] = [
  {
    tableName: 'vehicles',
    description: 'Master registry of detected vehicle identities across the city camera network.',
    fields: [
      { name: 'id', type: 'UUID / BIGINT', constraints: 'PRIMARY KEY', description: 'Unique vehicle entity surrogate key' },
      { name: 'plate_number', type: 'VARCHAR(20)', constraints: 'UNIQUE, INDEX', description: 'Normalized ANPR vehicle registration plate number' },
      { name: 'vehicle_type', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'YOLO classification category (Car, Bus, Truck, Bike)' },
      { name: 'color', type: 'VARCHAR(30)', constraints: 'NULLABLE', description: 'OpenCV visual feature vector dominant color' },
      { name: 'first_seen', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Earliest cross-camera detection timestamp' },
      { name: 'last_seen', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Most recent cross-camera detection timestamp' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Record insertion time' }
    ]
  },
  {
    tableName: 'cameras',
    description: 'City CCTV camera metadata, RTSP stream configs, and geo-spatial coordinates.',
    fields: [
      { name: 'id', type: 'VARCHAR(50)', constraints: 'PRIMARY KEY', description: 'Camera hardware code e.g. CAM-001' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Human-readable location label' },
      { name: 'latitude', type: 'DOUBLE PRECISION', constraints: 'NOT NULL', description: 'WGS84 latitude coordinate' },
      { name: 'longitude', type: 'DOUBLE PRECISION', constraints: 'NOT NULL', description: 'WGS84 longitude coordinate' },
      { name: 'status', type: 'VARCHAR(20)', constraints: 'CHECK(ONLINE, WARNING, OFFLINE)', description: 'Operational health status' },
      { name: 'ip_address', type: 'INET', constraints: 'NOT NULL', description: 'Network IP for RTSP video stream ingest' }
    ]
  },
  {
    tableName: 'anpr_records',
    description: 'Raw OCR recognition results linked to video frames and bounding boxes.',
    fields: [
      { name: 'id', type: 'BIGSERIAL', constraints: 'PRIMARY KEY', description: 'Auto-incrementing record ID' },
      { name: 'vehicle_id', type: 'UUID', constraints: 'FOREIGN KEY(vehicles.id)', description: 'Matched vehicle reference' },
      { name: 'camera_id', type: 'VARCHAR(50)', constraints: 'FOREIGN KEY(cameras.id)', description: 'Ingest camera reference' },
      { name: 'plate_number', type: 'VARCHAR(20)', constraints: 'INDEX', description: 'Raw OCR output string' },
      { name: 'confidence', type: 'NUMERIC(5,2)', constraints: 'NOT NULL', description: 'ANPR model confidence percentage (0-100%)' },
      { name: 'timestamp', type: 'TIMESTAMPTZ', constraints: 'NOT NULL, INDEX', description: 'Frame detection timestamp' },
      { name: 'bounding_box', type: 'JSONB', constraints: 'NOT NULL', description: 'Normalized bounding box {x, y, w, h}' }
    ]
  },
  {
    tableName: 'vehicle_trajectories',
    description: 'PostGIS spatial geometry linestrings connecting sequential camera sightings.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'Unique trajectory session ID' },
      { name: 'vehicle_id', type: 'UUID', constraints: 'FOREIGN KEY(vehicles.id)', description: 'Associated vehicle ID' },
      { name: 'start_camera_id', type: 'VARCHAR(50)', constraints: 'FOREIGN KEY(cameras.id)', description: 'Origin camera node' },
      { name: 'end_camera_id', type: 'VARCHAR(50)', constraints: 'FOREIGN KEY(cameras.id)', description: 'Destination camera node' },
      { name: 'distance_km', type: 'NUMERIC(6,2)', constraints: 'NOT NULL', description: 'Calculated spatial route length in kilometers' },
      { name: 'duration_minutes', type: 'INTEGER', constraints: 'NOT NULL', description: 'Travel duration in minutes' },
      { name: 'geom', type: 'GEOMETRY(LineString, 4326)', constraints: 'SPATIAL INDEX GIST', description: 'PostGIS spatial linestring representing vehicle path' }
    ]
  }
];

export const mockApiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/cameras',
    description: 'Fetch list of active city cameras with real-time health, FPS, and vehicle counts.',
    responseSample: `[
  { "id": "CAM-001", "name": "Camera A — College Road", "status": "ONLINE", "fps": 30, "vehicleCount": 124 }
]`
  },
  {
    method: 'GET',
    path: '/api/v1/vehicles/:plateNumber/trajectory',
    description: 'Retrieve multi-camera trajectory path, points, spatial coordinates, and travel times for a vehicle.',
    responseSample: `{
  "plateNumber": "KA 19 AB 1234",
  "distanceKm": 8.4,
  "durationMinutes": 30,
  "avgSpeedKmH": 16.8,
  "points": [
    { "camera": "CAM-001", "time": "09:00 AM", "confidence": 98.7 },
    { "camera": "CAM-002", "time": "09:15 AM", "confidence": 98.2 },
    { "camera": "CAM-003", "time": "09:30 AM", "confidence": 97.9 }
  ]
}`
  },
  {
    method: 'POST',
    path: '/api/v1/anpr/process-frame',
    description: 'Process raw video frame buffer with YOLOv8 object detection and EasyOCR license plate recognition.',
    requestBody: `{ "cameraId": "CAM-001", "frameBase64": "...[raw bytes]..." }`,
    responseSample: `{
  "vehiclesDetected": 3,
  "anprMatches": [
    { "plate": "KA 19 AB 1234", "confidence": 98.7, "bbox": [15, 35, 28, 32] }
  ]
}`
  },
  {
    method: 'GET',
    path: '/api/v1/traffic/hotspots',
    description: 'Query real-time city traffic congestion hotspots calculated by spatial density algorithms.',
    responseSample: `[
  { "id": "HOT-01", "location": "Junction", "severity": "CRITICAL", "congestionPercentage": 88 }
]`
  }
];

export const sihDemoSteps: SihDemoStep[] = [
  {
    stepIndex: 1,
    title: 'Connecting City Camera Network',
    subtitle: 'Initializing 24 RTSP video streams across urban corridors...',
    activePage: 'command-center',
    toastMessage: 'STEP 1/10: Connected to 24 Live CCTV Feeds across Bangalore/Mangalore Smart Network',
    delayMs: 2500
  },
  {
    stepIndex: 2,
    title: 'Live Vehicle Detection',
    subtitle: 'Camera A (College Road) detects oncoming traffic with YOLOv8 bounding boxes...',
    activePage: 'live-monitoring',
    toastMessage: 'STEP 2/10: Camera A (College Road) detects White Sedan entering perimeter',
    delayMs: 3000
  },
  {
    stepIndex: 3,
    title: 'Executing ANPR Engine',
    subtitle: 'Running optical character recognition on license plate region...',
    activePage: 'vehicle-tracking',
    activeVehiclePlate: 'KA 19 AB 1234',
    toastMessage: 'STEP 3/10: Running High-Precision ANPR Scanner on target vehicle...',
    delayMs: 3000
  },
  {
    stepIndex: 4,
    title: 'Plate KA 19 AB 1234 Recognized',
    subtitle: 'Confidence: 98.7% — Vehicle identity registered in postgres memory index',
    activePage: 'vehicle-tracking',
    activeVehiclePlate: 'KA 19 AB 1234',
    toastMessage: 'STEP 4/10: PLATE CONFIRMED: KA 19 AB 1234 (White Hyundai Verna)',
    delayMs: 3000
  },
  {
    stepIndex: 5,
    title: 'Cross-Camera Scanning (Camera B)',
    subtitle: 'Scanning downstream camera nodes... Match detected at Central Junction (09:15 AM)',
    activePage: 'journey-map',
    activeVehiclePlate: 'KA 19 AB 1234',
    toastMessage: 'STEP 5/10: Camera B (Junction) MATCH CONFIRMED (ANPR Confidence: 98.2%)',
    delayMs: 3500
  },
  {
    stepIndex: 6,
    title: 'Cross-Camera Scanning (Camera C)',
    subtitle: 'Matching sighting at Bus Stand Station (09:30 AM)...',
    activePage: 'journey-map',
    activeVehiclePlate: 'KA 19 AB 1234',
    toastMessage: 'STEP 6/10: Camera C (Bus Stand) MATCH CONFIRMED (ANPR Confidence: 97.9%)',
    delayMs: 3500
  },
  {
    stepIndex: 7,
    title: 'Generating Spatial Trajectory Path',
    subtitle: 'Connecting Camera A → B → C sightings into 3D route linestring...',
    activePage: 'journey-map',
    activeVehiclePlate: 'KA 19 AB 1234',
    toastMessage: 'STEP 7/10: Trajectory Calculated: 8.4 km total distance in 30 minutes (16.8 km/h avg)',
    delayMs: 4000
  },
  {
    stepIndex: 8,
    title: 'Aggregating City-Wide Traffic Analytics',
    subtitle: 'Synthesizing vehicle flow by hour, speed drops, and route bottlenecks...',
    activePage: 'analytics',
    toastMessage: 'STEP 8/10: Processing real-time traffic flow matrix and speed distributions',
    delayMs: 3500
  },
  {
    stepIndex: 9,
    title: 'AI Insight & Optimization Engine',
    subtitle: 'AI algorithm identifies 34% congestion spike at Junction corridor...',
    activePage: 'ai-insights',
    toastMessage: 'STEP 9/10: AI Intelligence detected critical bottleneck on College Road → Junction',
    delayMs: 3500
  },
  {
    stepIndex: 10,
    title: 'SIH 2026 DEMO COMPLETE',
    subtitle: 'Full pipeline verified: Cameras → Detection → ANPR → Matching → Trajectory → AI Insights!',
    activePage: 'command-center',
    toastMessage: '✓ JOURNEY & TRAJECTORY COMPLETE! Demonstration ready for SIH Judges.',
    delayMs: 4000
  }
];
