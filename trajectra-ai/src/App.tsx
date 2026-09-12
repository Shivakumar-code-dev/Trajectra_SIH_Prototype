import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DemoBar } from './components/layout/DemoBar';
import { SystemArchitectureModal } from './components/architecture/SystemArchitectureModal';

import { LandingPage } from './pages/LandingPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { VehicleTrackingPage } from './pages/VehicleTrackingPage';
import { VehicleJourneyPage } from './pages/VehicleJourneyPage';
import { TrafficAnalyticsPage } from './pages/TrafficAnalyticsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { CameraNetworkPage } from './pages/CameraNetworkPage';
import { VehicleSearchPage } from './pages/VehicleSearchPage';
import { AlertsPage } from './pages/AlertsPage';
import { SystemStatusPage } from './pages/SystemStatusPage';

const AppContent: React.FC = () => {
  const { activePage, toastMessage } = useSimulation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Render Landing page standalone if activePage === 'landing'
  if (activePage === 'landing') {
    return <LandingPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'command-center':
        return <CommandCenterPage />;
      case 'live-monitoring':
        return <LiveMonitoringPage />;
      case 'vehicle-tracking':
        return <VehicleTrackingPage />;
      case 'journey-map':
        return <VehicleJourneyPage />;
      case 'analytics':
        return <TrafficAnalyticsPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'camera-network':
        return <CameraNetworkPage />;
      case 'vehicle-search':
        return <VehicleSearchPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'system-status':
        return <SystemStatusPage />;
      default:
        return <CommandCenterPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0d1527] border-2 border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-2xl animate-bounce flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Header Topbar */}
        <Topbar setMobileOpen={setMobileOpen} />

        {/* SIH Judge Demo Bar */}
        <DemoBar />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <footer className="py-4 border-t border-[#1b2a4a] text-center text-xs font-mono text-slate-500">
          TRAJECTRA AI — City-Wide Vehicle Intelligence Platform | Smart India Hackathon 2026 (SIH26127) | Team VectorHaul
        </footer>
      </div>

      {/* System Architecture Flowchart Modal */}
      <SystemArchitectureModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
};

export default App;
