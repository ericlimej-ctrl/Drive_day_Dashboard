import React, { useState, useEffect } from 'react';
import { 
  X, 
  Navigation, 
  Clock, 
  CreditCard, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Eye, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RouteOption, TrafficCamera } from '../../types/telemetry';
import { getRouteOptions, TRAFFIC_CAMERAS } from '../../data/mockTelemetry';

interface Props {
  origin: string;
  destination: string;
  onClose: () => void;
  onOpenCam: (cam: TrafficCamera) => void;
}

export const JourneyModal: React.FC<Props> = ({
  origin,
  destination,
  onClose,
  onOpenCam,
}) => {
  const routes = getRouteOptions(origin, destination);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const currentRoute: RouteOption = routes[selectedRouteIndex] || routes[0];

  // Simulation mode
  const [isDriveSimulating, setIsDriveSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState(68);
  const [simProgress, setSimProgress] = useState(15);
  const [simStepIndex, setSimStepIndex] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Pick a route camera to show
  const routeCam = TRAFFIC_CAMERAS.find(c => c.expressway === currentRoute.expresswayPath[0]) || TRAFFIC_CAMERAS[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDriveSimulating) {
      interval = setInterval(() => {
        setSimSpeed(prev => {
          const delta = (Math.random() - 0.48) * 4;
          return Math.min(88, Math.max(45, Math.round(prev + delta)));
        });
        setSimProgress(prev => {
          if (prev >= 98) {
            setIsDriveSimulating(false);
            return 100;
          }
          return prev + 1.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDriveSimulating]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-[#f8f9ff] w-full max-w-md h-[92vh] sm:h-[88vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-white px-4 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006398] text-white flex items-center justify-center">
              <Navigation className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                Expressway Journey Telemetry
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Live LTA Speeds & ERP 2.0 Pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Origin & Destination summary card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-[#006398]" />
              <span className="truncate">{origin}</span>
            </div>
            <div className="w-0.5 h-3.5 bg-slate-300 ml-1 my-0.5" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
              <span className="truncate">{destination}</span>
            </div>
          </div>

          {/* If Drive Simulator is Active -> Show Cockpit In-Car HUD */}
          {isDriveSimulating ? (
            <div className="bg-[#0a1b2d] rounded-2xl p-4 text-white border border-[#1b3452] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    IN-VEHICLE OBU HUD ACTIVE
                  </span>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg bg-[#14283f] text-slate-300"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Digital Speedometer & Next Exit Card */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="bg-[#05101c] p-3 rounded-xl border border-[#1b3452] text-center">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    GPS Velocity
                  </div>
                  <div className="text-4xl font-extrabold text-white tnum mt-1">
                    {simSpeed}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    KM/H · LIMIT 80
                  </div>
                </div>

                <div className="bg-[#05101c] p-3 rounded-xl border border-[#1b3452]">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    Upcoming Maneuver
                  </div>
                  <div className="text-sm font-bold text-white leading-tight mt-1 line-clamp-2">
                    Exit 8B (KPE Tunnel)
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono mt-1">
                    In 1.4 km · Lane 2 & 3
                  </div>
                </div>
              </div>

              {/* Drive progress bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                  <span>Trip Progress</span>
                  <span className="text-emerald-400 font-bold">{Math.round(simProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${simProgress}%` }}
                  />
                </div>
              </div>

              {/* OBU ERP Notification simulation */}
              <div className="p-2.5 rounded-xl bg-[#11243a] border border-[#1f3d5f] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>ERP 2.0 OBU: S$42.50</span>
                </div>
                <span className="text-slate-400">Toll: S${currentRoute.erpCost.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setIsDriveSimulating(false)}
                className="w-full py-2.5 rounded-xl bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                End Simulation
              </button>
            </div>
          ) : (
            <>
              {/* Route Options Selection (Fastest / Lowest Toll / Avoid Tolls) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Available Expressway Routes
                </div>
                <div className="space-y-2">
                  {routes.map((rt, idx) => (
                    <div
                      key={rt.id}
                      onClick={() => setSelectedRouteIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedRouteIndex === idx
                          ? 'border-[#006398] bg-white ring-2 ring-[#006398]/15 shadow-sm'
                          : 'border-slate-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            rt.tag === 'Recommended'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rt.tag === 'Lowest Toll'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {rt.tag}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {rt.name}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-[#006398] tnum">
                          {rt.durationMins} mins
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                        <span className="font-medium">{rt.distanceKm} km · via {rt.expresswayPath.join(' > ')}</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 tnum">
                            ERP ${rt.erpCost.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold ml-2 tnum">
                            Fuel ~${((rt.distanceKm / 14.5) * 2.95).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Route Traffic Camera Banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Eye className="w-3.5 h-3.5 text-[#006398]" />
                    <span>Live Camera on Route</span>
                  </div>
                  <button
                    onClick={() => onOpenCam(routeCam)}
                    className="text-[11px] font-bold text-[#006398] hover:underline"
                  >
                    View Full Feed
                  </button>
                </div>
                <div 
                  onClick={() => onOpenCam(routeCam)}
                  className="relative h-28 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={routeCam.imageUrl}
                    alt={routeCam.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[11px] font-mono text-white">
                    <span className="font-bold">{routeCam.name}</span>
                    <span className="block text-[10px] text-emerald-400">Flow: {routeCam.currentSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Expressway Directions */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Expressway Maneuvers & Gantries
                </h4>
                <div className="space-y-2">
                  {currentRoute.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${step.isErp ? 'text-[#006398]' : 'text-slate-800'}`}>
                          {step.instruction}
                        </p>
                        {step.expressway && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-[#0a2540] text-white text-[9px] font-bold rounded tracking-wider uppercase">
                            {step.expressway}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 tnum shrink-0">
                        {step.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Driving CTA */}
              <button
                onClick={() => setIsDriveSimulating(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0a2540] hover:bg-[#07192b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99]"
              >
                <Navigation className="w-4 h-4 rotate-45" />
                <span>Start In-Car HUD Simulation</span>
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
