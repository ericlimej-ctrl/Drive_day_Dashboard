import React, { useState } from 'react';
import { 
  CreditCard, 
  Car, 
  Bell, 
  Volume2, 
  ShieldCheck, 
  RefreshCw, 
  Smartphone, 
  Check, 
  Zap,
  Sliders,
  Sun
} from 'lucide-react';
import { SavedCommute } from '../../types/telemetry';
import { FuelConsumptionTracker } from '../FuelConsumptionTracker';

interface Props {
  onRefreshData: () => void;
  isSyncing: boolean;
  savedCommutes: SavedCommute[];
}

export const SettingsScreen: React.FC<Props> = ({ 
  onRefreshData, 
  isSyncing,
  savedCommutes,
}) => {
  const [vehicleType, setVehicleType] = useState('car');
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [autoReroute, setAutoReroute] = useState(true);
  const [speedChime, setSpeedChime] = useState(true);
  const [erpAudioChime, setErpAudioChime] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [balance, setBalance] = useState(48.50);

  const handleTopUp = () => {
    setBalance((b) => b + 20);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#0d1c2e] tracking-tight">
          System & Telemetry Settings
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          ERP 2.0 On-Board Unit, Fuel Tracker & Navigation
        </p>
      </div>

      {/* Fuel Consumption & Commute Cost Tracker Feature */}
      <FuelConsumptionTracker savedCommutes={savedCommutes} />

      {/* ERP 2.0 On-Board Unit (OBU) Virtual Card */}
      <div className="bg-[#0a1f36] rounded-2xl p-4 text-white border border-[#1b3b5f] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006398] flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                ERP 2.0 OBU CONNECTED
              </span>
              <p className="text-[11px] font-mono text-slate-300">
                OBU ID: SG-OBU-94812-B
              </p>
            </div>
          </div>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </div>

        {/* Card Balance Display */}
        <div className="bg-[#061424] rounded-xl p-3 border border-[#1b3b5f] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>EZ-Link Motoring Card</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tnum">
              S${balance.toFixed(2)}
            </div>
          </div>
          <button
            onClick={handleTopUp}
            className="px-3 py-1.5 bg-[#006398] hover:bg-[#004e79] text-white rounded-lg text-xs font-bold transition-colors"
          >
            + S$20 Top-up
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
          <span>Backend GNSS: 3D Fix (Locked)</span>
          <span className="text-emerald-400 font-bold">Auto-Deduction Ready</span>
        </div>
      </div>

      {/* Vehicle Classification Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Vehicle Classification (Tariff Multiplier)
        </label>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { id: 'car', label: 'Passenger Car', sub: '1.0x standard ERP' },
            { id: 'taxi', label: 'Taxi / Private Hire', sub: '1.0x standard' },
            { id: 'moto', label: 'Motorcycle', sub: '0.5x concession' },
            { id: 'heavy', label: 'Heavy Goods / Bus', sub: '1.5x - 2.0x' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicleType(v.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                vehicleType === v.id
                  ? 'border-[#006398] bg-[#eff4ff] ring-1 ring-[#006398]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{v.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{v.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Navigation & Smart Routing
        </h3>

        {/* Toggle 1: Auto Reroute */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800">
              Auto-Reroute on Congestion
            </div>
            <div className="text-[11px] text-slate-500">
              Suggest alternate expressway if delay exceeds 8 minutes
            </div>
          </div>
          <button
            onClick={() => setAutoReroute(!autoReroute)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              autoReroute ? 'bg-[#0a2540]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                autoReroute ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Avoid High Tolls */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800">
              Avoid Peak Hour ERP Tolls
            </div>
            <div className="text-[11px] text-slate-500">
              Prioritize routes with lower or zero gantry fees
            </div>
          </div>
          <button
            onClick={() => setAvoidTolls(!avoidTolls)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              avoidTolls ? 'bg-[#0a2540]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                avoidTolls ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Speed Camera Audible Chime */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-xs font-bold text-slate-800">
              Speed Camera Proximity Chime
            </div>
            <div className="text-[11px] text-slate-500">
              Sound alert 400m before static and mobile cameras
            </div>
          </div>
          <button
            onClick={() => setSpeedChime(!speedChime)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              speedChime ? 'bg-[#0a2540]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                speedChime ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* LTA Datamall Telemetry Sync Engine */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Telemetry Polling
        </h3>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">LTA Datamall Frequency</span>
          <div className="flex gap-1">
            {['15s', '30s', '60s'].map((freq) => (
              <button
                key={freq}
                onClick={() => setRefreshInterval(freq)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  refreshInterval === freq
                    ? 'bg-[#0a2540] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onRefreshData}
          disabled={isSyncing}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Polling LTA API...' : 'Force Synchronize Telemetry Now'}</span>
        </button>
      </div>

    </div>
  );
};
