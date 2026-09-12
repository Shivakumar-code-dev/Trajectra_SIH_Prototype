import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Vehicle,
  VehicleTrajectory,
  TrafficAlert,
  TrafficHotspot,
  CongestedRoute,
  AnalyticsSummary,
  SihDemoStep
} from '../types/trajectra';
import {
  mockCameras,
  mockPrimaryVehicle,
  mockSecondaryVehicles,
  mockPrimaryTrajectory,
  mockHotspots,
  mockCongestedRoutes,
  mockAnalyticsSummary,
  mockAlerts,
  sihDemoSteps
} from '../data/mockData';

interface SimulationContextType {
  activePage: string;
  setActivePage: (page: string) => void;
  selectedPlate: string;
  setSelectedPlate: (plate: string) => void;
  selectedCameraId: string;
  setSelectedCameraId: (id: string) => void;
  
  // Live Simulation state
  isSimulating: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  
  // Data state
  cameras: Camera[];
  vehicles: Vehicle[];
  currentTrajectory: VehicleTrajectory;
  alerts: TrafficAlert[];
  hotspots: TrafficHotspot[];
  congestedRoutes: CongestedRoute[];
  analyticsSummary: AnalyticsSummary;
  
  // SIH 10-Step Demo Controller
  isDemoRunning: boolean;
  currentDemoStep: SihDemoStep | null;
  demoProgress: number; // 0 to 100%
  runFullSihDemo: () => void;
  stopSihDemo: () => void;
  
  // System Arch Modal
  isArchModalOpen: boolean;
  setIsArchModalOpen: (open: boolean) => void;
  
  // Toast notifications
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('command-center');
  const [selectedPlate, setSelectedPlate] = useState<string>('KA 19 AB 1234');
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-001');
  
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  
  // Data state initialized from mock data
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockSecondaryVehicles);
  const [currentTrajectory, setCurrentTrajectory] = useState<VehicleTrajectory>(mockPrimaryTrajectory);
  const [alerts, setAlerts] = useState<TrafficAlert[]>(mockAlerts);
  const [hotspots, setHotspots] = useState<TrafficHotspot[]>(mockHotspots);
  const [congestedRoutes] = useState<CongestedRoute[]>(mockCongestedRoutes);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>(mockAnalyticsSummary);
  
  // SIH Demo controller
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [currentDemoStepIndex, setCurrentDemoStepIndex] = useState<number>(-1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Architecture Modal
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);

  // Live simulation tick timer
  useEffect(() => {
    if (!isSimulating || isDemoRunning) return;

    const interval = setInterval(() => {
      // Fluctuate camera counts & accuracy slightly for visual liveliness
      setCameras(prev =>
        prev.map(cam => {
          if (cam.status === 'OFFLINE') return cam;
          const delta = Math.floor(Math.random() * 5) - 2;
          const newCount = Math.max(20, cam.vehicleCount + delta);
          return {
            ...cam,
            vehicleCount: newCount,
            lastActiveTime: 'Just now'
          };
        })
      );

      // Increment vehicle counts in summary
      setAnalyticsSummary(prev => ({
        ...prev,
        totalVehiclesDetectedToday: prev.totalVehiclesDetectedToday + Math.floor(Math.random() * 3),
        cityCongestionLevel: Math.min(95, Math.max(45, prev.cityCongestionLevel + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, isDemoRunning]);

  // SIH Demo Execution logic
  const runFullSihDemo = useCallback(() => {
    setIsDemoRunning(true);
    setCurrentDemoStepIndex(0);
  }, []);

  const stopSihDemo = useCallback(() => {
    setIsDemoRunning(false);
    setCurrentDemoStepIndex(-1);
    setToastMessage('SIH Demo stopped.');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  useEffect(() => {
    if (!isDemoRunning || currentDemoStepIndex < 0) return;

    if (currentDemoStepIndex >= sihDemoSteps.length) {
      // Reached end of demo
      setIsDemoRunning(false);
      // Trigger confetti celebrating complete pipeline
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      return;
    }

    const step = sihDemoSteps[currentDemoStepIndex];
    setActivePage(step.activePage);
    if (step.activeVehiclePlate) {
      setSelectedPlate(step.activeVehiclePlate);
    }
    setToastMessage(step.toastMessage);

    const timer = setTimeout(() => {
      setCurrentDemoStepIndex(prev => prev + 1);
    }, step.delayMs);

    return () => clearTimeout(timer);
  }, [isDemoRunning, currentDemoStepIndex]);

  const toggleSimulation = () => setIsSimulating(prev => !prev);

  const resetSimulation = () => {
    setCameras(mockCameras);
    setVehicles(mockSecondaryVehicles);
    setCurrentTrajectory(mockPrimaryTrajectory);
    setAlerts(mockAlerts);
    setHotspots(mockHotspots);
    setAnalyticsSummary(mockAnalyticsSummary);
    setSelectedPlate('KA 19 AB 1234');
    setSelectedCameraId('CAM-001');
    setToastMessage('Simulation dataset reset to initial state.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentDemoStep = currentDemoStepIndex >= 0 && currentDemoStepIndex < sihDemoSteps.length
    ? sihDemoSteps[currentDemoStepIndex]
    : null;

  const demoProgress = currentDemoStepIndex >= 0
    ? Math.round(((currentDemoStepIndex + 1) / sihDemoSteps.length) * 100)
    : 0;

  return (
    <SimulationContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedPlate,
        setSelectedPlate,
        selectedCameraId,
        setSelectedCameraId,
        isSimulating,
        toggleSimulation,
        resetSimulation,
        cameras,
        vehicles,
        currentTrajectory,
        alerts,
        hotspots,
        congestedRoutes,
        analyticsSummary,
        isDemoRunning,
        currentDemoStep,
        demoProgress,
        runFullSihDemo,
        stopSihDemo,
        isArchModalOpen,
        setIsArchModalOpen,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
