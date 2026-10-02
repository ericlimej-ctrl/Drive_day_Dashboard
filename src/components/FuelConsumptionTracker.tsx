import React, { useState } from 'react';
import { 
  Fuel, 
  Car, 
  Zap, 
  Calculator, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  ExternalLink, 
  Compass, 
  TrendingDown,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { SavedCommute } from '../types/telemetry';

interface Props {
  savedCommutes: SavedCommute[];
}

interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: Array<{
        snippet?: string;
        reviewUri?: string;
      }>;
    };
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export const FuelConsumptionTracker: React.FC<Props> = ({ savedCommutes }) => {
  // Commute distance selection
  const [selectedCommuteId, setSelectedCommuteId] = useState<string>(
    savedCommutes[0]?.id || 'custom'
  );
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);
  const [customDistance, setCustomDistance] = useState<number>(18.4);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState<number>(22);

  // Vehicle fuel profile
  const [fuelType, setFuelType] = useState<'ron95' | 'ron98' | 'diesel' | 'ev'>('ron95');
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(14.5); // km/L or km/kWh
  const [fuelPrice, setFuelPrice] = useState<number>(2.95); // S$ per Litre or per kWh

  // ERP addition
  const [includeErp, setIncludeErp] = useState<boolean>(true);

  // Google Maps Grounding state
  const [isQueryingMaps, setIsQueryingMaps] = useState<boolean>(false);
  const [mapsAdvice, setMapsAdvice] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [mapsError, setMapsError] = useState<string | null>(null);

  // Determine active distance
  const activeCommute = savedCommutes.find((c) => c.id === selectedCommuteId);
  const oneWayDistance = activeCommute ? activeCommute.distanceKm : customDistance;
  const totalDailyDistance = isRoundTrip ? oneWayDistance * 2 : oneWayDistance;
  const activeErpCost = (includeErp && activeCommute) ? (isRoundTrip ? activeCommute.erpCost * 2 : activeCommute.erpCost) : 0;

  // Fuel Calculations
  const dailyFuelLiters = totalDailyDistance / (fuelEfficiency || 1);
  const dailyFuelCost = dailyFuelLiters * fuelPrice;
  const dailyTotalCost = dailyFuelCost + activeErpCost;
  const monthlyFuelCost = dailyFuelCost * workDaysPerMonth;
  const monthlyErpCost = activeErpCost * workDaysPerMonth;
  const monthlyTotalCost = dailyTotalCost * workDaysPerMonth;
  const annualTotalCost = monthlyTotalCost * 12;

  // L/100km conversion
  const litersPer100km = (100 / (fuelEfficiency || 1)).toFixed(1);

  // Quick preset handlers for fuel types
  const handleFuelTypeChange = (type: 'ron95' | 'ron98' | 'diesel' | 'ev') => {
    setFuelType(type);
    if (type === 'ron95') {
      setFuelPrice(2.95);
      setFuelEfficiency(14.5);
    } else if (type === 'ron98') {
      setFuelPrice(3.45);
      setFuelEfficiency(14.0);
    } else if (type === 'diesel') {
      setFuelPrice(2.70);
      setFuelEfficiency(16.5);
    } else if (type === 'ev') {
      setFuelPrice(0.55); // S$/kWh
      setFuelEfficiency(6.2); // km/kWh
    }
  };

  // Google Maps Grounding fetch via Gemini 3.5 Flash
  const handleFetchMapsAdvice = async (specificQuery?: string) => {
    setIsQueryingMaps(true);
    setMapsError(null);

    const query = specificQuery || 
      `Find the top petrol kiosks (SPC, Shell, Esso, Caltex) and EV charging hubs along or near Singapore expressways around ${
        activeCommute ? activeCommute.origin + ' to ' + activeCommute.destination : 'Tampines and Central Singapore'
      }. Provide realistic fuel saving advice for expressway commuters.`;

    try {
      const res = await fetch('/api/fuel-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          lat: 1.3521,
          lng: 103.8198,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setMapsAdvice(data.text || 'No advice returned from model.');
      setGroundingChunks(data.groundingChunks || []);
    } catch (err: any) {
      console.error('Maps Grounding Error:', err);
      setMapsError(err?.message || 'Could not connect to Google Maps grounding service.');
    } finally {
      setIsQueryingMaps(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Fuel Consumption & Commute Cost
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Calculate daily & monthly fuel budget based on distance
            </p>
          </div>
        </div>
      </div>

      {/* 1. Commute Distance Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
          <span>1. Commute Route & Distance</span>
          <span className="text-[11px] text-[#006398] font-bold">
            {totalDailyDistance.toFixed(1)} km / day
          </span>
        </label>

        {/* Saved Commute Presets */}
        <div className="grid grid-cols-2 gap-2">
          {savedCommutes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCommuteId(c.id)}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedCommuteId === c.id
                  ? 'border-[#006398] bg-[#eff4ff] ring-1 ring-[#006398]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-900 truncate">
                {c.title}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                {c.distanceKm} km · ERP ${c.erpCost.toFixed(2)}
              </div>
            </button>
          ))}
          <button
            onClick={() => setSelectedCommuteId('custom')}
            className={`p-2 rounded-xl border text-left transition-all ${
              selectedCommuteId === 'custom'
                ? 'border-[#006398] bg-[#eff4ff] ring-1 ring-[#006398]'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-900">Custom Distance</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Slider / Manual km
            </div>
          </button>
        </div>

        {/* Custom distance slider if custom selected */}
        {selectedCommuteId === 'custom' && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>One-Way Distance:</span>
              <span className="text-[#006398]">{customDistance} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              step="0.5"
              value={customDistance}
              onChange={(e) => setCustomDistance(parseFloat(e.target.value))}
              className="w-full accent-[#006398]"
            />
          </div>
        )}

        {/* Round Trip & Working Days toggles */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRoundTrip(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isRoundTrip
                  ? 'bg-[#0a2540] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Round Trip (2x)
            </button>
            <button
              onClick={() => setIsRoundTrip(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                !isRoundTrip
                  ? 'bg-[#0a2540] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              One-Way (1x)
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>Work Days:</span>
            <input
              type="number"
              min="1"
              max="31"
              value={workDaysPerMonth}
              onChange={(e) => setWorkDaysPerMonth(parseInt(e.target.value) || 22)}
              className="w-12 text-center py-0.5 rounded border border-slate-300 font-bold text-slate-900 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Fuel Type & Vehicle Efficiency */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          2. Vehicle Fuel & Efficiency
        </label>

        {/* Fuel Type Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'ron95', label: '95 Petrol', unit: 'L' },
            { id: 'ron98', label: '98 Petrol', unit: 'L' },
            { id: 'diesel', label: 'Diesel', unit: 'L' },
            { id: 'ev', label: 'Electric EV', unit: 'kWh' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleFuelTypeChange(f.id as any)}
              className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center transition-all ${
                fuelType === f.id
                  ? 'bg-[#006398] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Efficiency and Price Inputs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Vehicle Efficiency ({fuelType === 'ev' ? 'km/kWh' : 'km/L'})
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                step="0.5"
                min="3"
                max="60"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(parseFloat(e.target.value) || 1)}
                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 tnum"
              />
              <span className="text-[11px] text-slate-400 font-medium">
                ≈ {litersPer100km} {fuelType === 'ev' ? 'kWh' : 'L'}/100km
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Pump Price (S$ / {fuelType === 'ev' ? 'kWh' : 'L'})
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="10"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 1)}
                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 tnum"
              />
              <span className="text-[11px] text-slate-400 font-medium">
                Live Tariff
              </span>
            </div>
          </div>
        </div>

        {/* Include ERP toggle */}
        <div className="flex items-center justify-between text-xs py-1">
          <span className="font-semibold text-slate-700">
            Include ERP 2.0 Tolls in Commute Total
          </span>
          <button
            onClick={() => setIncludeErp(!includeErp)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              includeErp ? 'bg-[#0a2540]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                includeErp ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Live Commute Cost Telemetry Results */}
      <div className="bg-[#091728] rounded-2xl p-4 text-white border border-[#162c44] shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-[#1b3654] pb-2.5">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#5bb8fe]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Commute Cost Summary
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            {dailyFuelLiters.toFixed(2)} {fuelType === 'ev' ? 'kWh' : 'L'} / day
          </span>
        </div>

        {/* Big Telemetry Numbers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#061220] p-3 rounded-xl border border-[#18314e]">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
              Daily Total
            </span>
            <div className="text-2xl font-black font-mono text-white mt-0.5 tnum">
              S${dailyTotalCost.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Fuel: S${dailyFuelCost.toFixed(2)}
              {includeErp && activeErpCost > 0 && ` + ERP: S$${activeErpCost.toFixed(2)}`}
            </div>
          </div>

          <div className="bg-[#061220] p-3 rounded-xl border border-[#18314e]">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
              Monthly ({workDaysPerMonth} Days)
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5 tnum">
              S${monthlyTotalCost.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Annual: S${annualTotalCost.toFixed(0)} / yr
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 font-medium flex items-center justify-between pt-1">
          <span>Based on {totalDailyDistance.toFixed(1)} km daily commuting</span>
          <span className="text-amber-300 font-mono">
            S${(dailyTotalCost / (totalDailyDistance || 1)).toFixed(2)} / km
          </span>
        </div>
      </div>

      {/* 4. Google Maps Grounding Feature */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-[#006398]" />
            <span>Google Maps Petrol Stations & Fuel Advice</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Use Google Maps live intelligence to find fuel kiosks along your expressway route and fuel-efficient driving advice.
        </p>

        <button
          onClick={() => handleFetchMapsAdvice()}
          disabled={isQueryingMaps}
          className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006398] font-bold text-xs flex items-center justify-center gap-2 border border-[#ccdbf3] transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isQueryingMaps ? (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-[#006398] border-t-transparent rounded-full animate-spin" />
              <span>Querying Google Maps Grounding (gemini-3.5-flash)...</span>
            </div>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5" />
              <span>Find Nearby Stations & Route Tips via Google Maps</span>
            </>
          )}
        </button>

        {/* Error notification */}
        {mapsError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {mapsError}
          </div>
        )}

        {/* Grounding Response Card */}
        {mapsAdvice && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Google Maps Grounded Intelligence</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold uppercase">
                Grounded
              </span>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
              {mapsAdvice}
            </div>

            {/* MANDATORY: Extracted Google Maps URLs and review sources */}
            {groundingChunks && groundingChunks.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#006398]" />
                  <span>Verified Google Maps Locations & Sources:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groundingChunks.map((chunk, idx) => {
                    const uri = chunk.maps?.uri || chunk.web?.uri;
                    const title = chunk.maps?.title || chunk.web?.title || `Google Maps Location ${idx + 1}`;
                    if (!uri) return null;

                    return (
                      <a
                        key={idx}
                        href={uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#006398] hover:bg-blue-50 transition-colors shadow-2xs"
                      >
                        <span className="truncate max-w-[200px]">{title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
