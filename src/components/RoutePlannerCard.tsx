import React, { useState } from 'react';
import { 
  Route as RouteIcon, 
  Crosshair, 
  MapPin, 
  ArrowUpDown, 
  History, 
  ArrowUpRight, 
  Navigation,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/mockTelemetry';

interface Props {
  origin: string;
  destination: string;
  onOriginChange: (val: string) => void;
  onDestinationChange: (val: string) => void;
  onSwap: () => void;
  onCheckJourney: () => void;
  onUseCurrentLocation: () => void;
  isGpsLocked: boolean;
}

export const RoutePlannerCard: React.FC<Props> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSwap,
  onCheckJourney,
  onUseCurrentLocation,
  isGpsLocked,
}) => {
  const [timeMode, setTimeMode] = useState<'now' | 'target' | 'custom'>('now');
  const [showOriginPresets, setShowOriginPresets] = useState(false);
  const [showDestPresets, setShowDestPresets] = useState(false);
  const [customTime, setCustomTime] = useState('08:30');

  const handleSelectOrigin = (loc: string) => {
    onOriginChange(loc);
    setShowOriginPresets(false);
  };

  const handleSelectDest = (loc: string) => {
    onDestinationChange(loc);
    setShowDestPresets(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 relative">
      {/* Header Row: "Plan Expressway Route" & "ERP 2.0 Synced" */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-[#006398]">
          {/* Custom SVG Route icon matching screenshot */}
          <div className="w-5 h-5 flex items-center justify-center">
            <RouteIcon className="w-4 h-4 text-[#006398]" strokeWidth={2.4} />
          </div>
          <h2 className="text-base font-bold text-[#0d1c2e] tracking-tight">
            Plan Expressway Route
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>ERP 2.0 Synced</span>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="relative pt-3.5 space-y-3">
        {/* Connector Line between Origin and Destination icons */}
        <div className="absolute left-[26px] top-[48px] bottom-[48px] w-0.5 bg-slate-300 pointer-events-none z-0" />

        {/* Origin (Your Location) */}
        <div className="relative z-10">
          <label className="block text-[12px] font-semibold text-slate-600 mb-1">
            Your Location
          </label>
          <div className="relative">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-[#006398] transition-colors">
              <Crosshair className="w-4 h-4 text-[#006398] shrink-0" strokeWidth={2.4} />
              <input
                type="text"
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                onFocus={() => setShowOriginPresets(true)}
                className="w-full text-sm font-medium text-slate-900 bg-transparent outline-none truncate"
                placeholder="Enter starting location..."
              />
            </div>

            {/* Origin Quick Presets Dropdown */}
            {showOriginPresets && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto p-1.5">
                <div className="text-[11px] font-bold text-slate-600 uppercase px-2 py-1">
                  Select Singapore Location
                </div>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSelectOrigin(loc)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>{loc}</span>
                    {origin === loc && <CheckCircle2 className="w-3.5 h-3.5 text-[#006398]" />}
                  </button>
                ))}
                <button
                  onClick={() => setShowOriginPresets(false)}
                  className="w-full mt-1 text-center py-1 text-[11px] text-slate-600 font-semibold border-t border-slate-100 hover:text-slate-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Destination & Swap Button */}
        <div className="relative z-10">
          <label className="block text-[12px] font-semibold text-slate-600 mb-1">
            Destination
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 border-[#006398] bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#006398]/20 transition-all">
                <MapPin className="w-4 h-4 text-[#ba1a1a] fill-[#ba1a1a] shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => onDestinationChange(e.target.value)}
                  onFocus={() => setShowDestPresets(true)}
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none truncate"
                  placeholder="Where to?"
                />
              </div>

              {/* Destination Quick Presets Dropdown */}
              {showDestPresets && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto p-1.5">
                  <div className="text-[11px] font-bold text-slate-600 uppercase px-2 py-1">
                    Select Singapore Destination
                  </div>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleSelectDest(loc)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>{loc}</span>
                      {destination === loc && <CheckCircle2 className="w-3.5 h-3.5 text-[#006398]" />}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowDestPresets(false)}
                    className="w-full mt-1 text-center py-1 text-[11px] text-slate-600 font-semibold border-t border-slate-100 hover:text-slate-800"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Swap Button on right matching screenshot */}
            <button
              onClick={onSwap}
              aria-label="Swap origin and destination"
              className="w-11 h-11 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] active:scale-95 border border-[#ccdbf3] text-[#006398] flex items-center justify-center transition-transform shrink-0"
              title="Swap origin and destination"
            >
              <ArrowUpDown className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Suggestion Dropdown Item matching screenshot */}
        <div 
          onClick={() => onDestinationChange('Marina Bay Financial Centre Tower 2')}
          className="bg-[#f4f7fb] hover:bg-[#ecf1f8] border border-[#e2eaf4] rounded-xl p-3 flex items-start gap-2.5 cursor-pointer transition-colors"
        >
          <div className="mt-0.5 w-6 h-6 rounded-lg bg-slate-200/80 flex items-center justify-center shrink-0">
            <History className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-slate-900 truncate">
              Marina Bay Financial Centre Tower 2
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              10 Marina Blvd · 18.4 km via PIE & KPE
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#006398] shrink-0 self-center" strokeWidth={2.2} />
        </div>

        {/* "Use current location (GPS Locked)" Button matching screenshot */}
        <button
          onClick={onUseCurrentLocation}
          className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] active:scale-[0.99] border border-[#ccdbf3] text-[#006398] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" strokeWidth={2.5} />
          <span>
            {isGpsLocked ? 'Use current location (GPS Locked)' : 'Acquiring GPS Signal...'}
          </span>
        </button>

        {/* Time Segmented Control matching screenshot */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 text-xs font-semibold">
          <button
            onClick={() => setTimeMode('now')}
            className={`py-2 px-1 text-center rounded-lg transition-all ${
              timeMode === 'now'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Depart Now
          </button>
          <button
            onClick={() => setTimeMode('target')}
            className={`py-2 px-1 text-center rounded-lg transition-all ${
              timeMode === 'target'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arrive 08:30 AM
          </button>
          <button
            onClick={() => setTimeMode('custom')}
            className={`py-2 px-1 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
              timeMode === 'custom'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Set Time</span>
          </button>
        </div>

        {/* Custom Time Selector if 'custom' is active */}
        {timeMode === 'custom' && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
            <span className="font-semibold text-slate-700">Planned Departure Time:</span>
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs"
            />
          </div>
        )}

        {/* Big Navy CTA Button matching screenshot */}
        <button
          onClick={onCheckJourney}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#0a2540] hover:bg-[#071a2e] active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
        >
          <span>Check My Journey</span>
          <Navigation className="w-4 h-4 fill-white rotate-45" />
        </button>
      </div>
    </div>
  );
};
