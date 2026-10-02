import React, { useState } from 'react';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { LiveRouteOverlayCard } from './components/LiveRouteOverlayCard';
import { RoutePlannerCard } from './components/RoutePlannerCard';
import { SavedCommutesSection } from './components/SavedCommutesSection';
import { BottomNav, TabType } from './components/BottomNav';
import { MapScreen } from './components/screens/MapScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { JourneyModal } from './components/screens/JourneyModal';
import { CameraModal } from './components/modals/CameraModal';
import { 
  INITIAL_SAVED_COMMUTES, 
  TOP_ACTIVE_ALERT, 
  ALL_INCIDENTS, 
  TRAFFIC_CAMERAS 
} from './data/mockTelemetry';
import { SavedCommute, IncidentAlert, TrafficCamera } from './types/telemetry';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [origin, setOrigin] = useState('Tampines Ave 4 (Blk 842)');
  const [destination, setDestination] = useState('Marina Bay Financial Centre');
  const [savedCommutes, setSavedCommutes] = useState<SavedCommute[]>(INITIAL_SAVED_COMMUTES);
  const [incidents, setIncidents] = useState<IncidentAlert[]>(ALL_INCIDENTS);
  const [activeAlert, setActiveAlert] = useState<IncidentAlert>(TOP_ACTIVE_ALERT);

  // Modals
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [activeCamera, setActiveCamera] = useState<TrafficCamera | null>(null);

  // Telemetry sync status
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGpsLocked, setIsGpsLocked] = useState(true);

  // Swap origin and destination
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Use current GPS location
  const handleUseCurrentLocation = () => {
    setIsGpsLocked(false);
    setTimeout(() => {
      setOrigin('Tampines Ave 4 (Blk 842)');
      setIsGpsLocked(true);
    }, 400);
  };

  // Re-sync LTA telemetry
  const handleRefreshTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  // When a saved commute is tapped
  const handleSelectCommute = (commute: SavedCommute) => {
    setOrigin(commute.origin);
    setDestination(commute.destination);
    setShowJourneyModal(true);
  };

  // Add a newly reported incident
  const handleAddIncident = (newInc: IncidentAlert) => {
    setIncidents([newInc, ...incidents]);
    setActiveAlert(newInc);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] font-sans antialiased flex flex-col justify-between selection:bg-[#006398] selection:text-white">
      {/* Top Header matching screenshot */}
      <Header onRefresh={handleRefreshTelemetry} isSyncing={isSyncing} />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 w-full pb-20">
        {activeTab === 'plan' && (
          <div className="w-full">
            {/* Red Alert Banner matching screenshot */}
            <AlertBanner
              alert={activeAlert}
              onOpenAlerts={() => setActiveTab('alerts')}
            />

            {/* Screen Content Frame */}
            <div className="max-w-md mx-auto px-4 py-3 space-y-4">
              {/* Live Route Overlay Vector Map matching screenshot */}
              <LiveRouteOverlayCard
                onOpenMap={() => setActiveTab('map')}
                onSelectExpressway={() => setActiveTab('map')}
              />

              {/* Plan Expressway Route Input Card matching screenshot */}
              <RoutePlannerCard
                origin={origin}
                destination={destination}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
                onSwap={handleSwap}
                onCheckJourney={() => setShowJourneyModal(true)}
                onUseCurrentLocation={handleUseCurrentLocation}
                isGpsLocked={isGpsLocked}
              />

              {/* Saved Commutes Section matching screenshot */}
              <SavedCommutesSection
                commutes={savedCommutes}
                onSelectCommute={handleSelectCommute}
                onUpdateCommutes={setSavedCommutes}
              />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <MapScreen
            onOpenCam={(cam) => setActiveCamera(cam)}
            onOpenAlerts={() => setActiveTab('alerts')}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsScreen
            incidents={incidents}
            onAddIncident={handleAddIncident}
            onOpenCam={(cam) => setActiveCamera(cam)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            onRefreshData={handleRefreshTelemetry}
            isSyncing={isSyncing}
            savedCommutes={savedCommutes}
          />
        )}
      </main>

      {/* Bottom Navigation Bar matching screenshot */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unresolvedAlertsCount={incidents.filter((i) => i.severity === 'high').length}
      />

      {/* Journey Detail Modal with Turn-by-Turn Telemetry & In-Car HUD */}
      {showJourneyModal && (
        <JourneyModal
          origin={origin}
          destination={destination}
          onClose={() => setShowJourneyModal(false)}
          onOpenCam={(cam) => setActiveCamera(cam)}
        />
      )}

      {/* Camera Live CCTV Preview Modal */}
      {activeCamera && (
        <CameraModal
          camera={activeCamera}
          onClose={() => setActiveCamera(null)}
        />
      )}
    </div>
  );
}
