import React, { useState } from 'react';
import { X, RefreshCw, Radio, Gauge, MapPin } from 'lucide-react';
import { TrafficCamera } from '../../types/telemetry';

interface Props {
  camera: TrafficCamera | null;
  onClose: () => void;
}

export const CameraModal: React.FC<Props> = ({ camera, onClose }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshotTime, setSnapshotTime] = useState<string>(camera?.timestamp || '18:42:00 SGT');

  if (!camera) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setSnapshotTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
          now.getSeconds()
        ).padStart(2, '0')} SGT`
      );
      setIsRefreshing(false);
    }, 600);
  };

  const getStatusBadge = () => {
    switch (camera.status) {
      case 'heavy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            Slow / Congested
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Moderate Flow
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Smooth Flow
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {camera.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Station ID: {camera.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Video / Snapshot Canvas */}
        <div className="relative aspect-video bg-slate-950 overflow-hidden">
          <img
            src={camera.imageUrl}
            alt={camera.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* OSD (On-Screen Display) Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-white">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="font-bold">LTA FEED · {camera.id}</span>
          </div>

          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400">
            {snapshotTime}
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded">
            <span className="truncate">{camera.locationName}</span>
            <span className="shrink-0 text-amber-300 ml-2">
              RADAR: {camera.currentSpeed} KM/H
            </span>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#006398]" />
                <span>Detected Velocity</span>
              </div>
              <div className="text-xl font-bold text-slate-900 tnum mt-0.5">
                {camera.currentSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Limit: {camera.speedLimit} km/h
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500">
                Segment Condition
              </div>
              <div className="mt-1">
                {getStatusBadge()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Expressway: {camera.expressway}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
            <MapPin className="w-4 h-4 text-[#006398] shrink-0" />
            <span className="truncate">{camera.locationName}</span>
          </div>

          {/* Action Row */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Fetching Fresh CCTV...' : 'Refresh Snapshot'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-[#0a2540] hover:bg-[#06182a] text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
