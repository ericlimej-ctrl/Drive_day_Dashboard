import React, { useState } from 'react';
import { 
  Camera, 
  AlertTriangle, 
  CreditCard, 
  Layers, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Crosshair,
  Gauge,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  TRAFFIC_CAMERAS, 
  ERP_GANTRIES, 
  ALL_INCIDENTS, 
  EXPRESSWAYS 
} from '../../data/mockTelemetry';
import { TrafficCamera, ErpGantry, IncidentAlert } from '../../types/telemetry';

interface Props {
  onOpenCam: (cam: TrafficCamera) => void;
  onOpenAlerts: () => void;
}

export const MapScreen: React.FC<Props> = ({ onOpenCam, onOpenAlerts }) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'traffic' | 'cameras' | 'erp' | 'incidents'>('all');
  const [selectedExp, setSelectedExp] = useState<string>('PIE');
  const [selectedCamera, setSelectedCamera] = useState<TrafficCamera | null>(null);
  const [selectedGantry, setSelectedGantry] = useState<ErpGantry | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedExpInfo = EXPRESSWAYS.find((e) => e.id === selectedExp) || EXPRESSWAYS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#091522] text-white relative overflow-hidden select-none">
      
      {/* Top Filter Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 bg-[#0c1f33]/90 backdrop-blur-md border border-[#1e3957] p-1 rounded-xl pointer-events-auto shadow-md overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeLayer === 'all'
                ? 'bg-[#006398] text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Telemetry
          </button>
          <button
            onClick={() => setActiveLayer('traffic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeLayer === 'traffic'
                ? 'bg-[#006398] text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Flow Speed
          </button>
          <button
            onClick={() => setActiveLayer('cameras')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeLayer === 'cameras'
                ? 'bg-[#006398] text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            CCTV ({TRAFFIC_CAMERAS.length})
          </button>
          <button
            onClick={() => setActiveLayer('erp')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeLayer === 'erp'
                ? 'bg-[#006398] text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ERP 2.0
          </button>
        </div>

        {/* Legend pill */}
        <div className="hidden sm:flex items-center gap-2 bg-[#0c1f33]/90 backdrop-blur-md border border-[#1e3957] px-2.5 py-1.5 rounded-xl pointer-events-auto text-[11px] font-semibold text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" /> &gt;65 km/h
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> 45-65
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> &lt;25
          </span>
        </div>
      </div>

      {/* Floating Map Controls on right */}
      <div className="absolute right-3 top-16 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
          className="w-9 h-9 rounded-xl bg-[#0c1f33]/90 border border-[#1e3957] text-white flex items-center justify-center hover:bg-[#142d4a] transition-colors shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-slate-200" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
          className="w-9 h-9 rounded-xl bg-[#0c1f33]/90 border border-[#1e3957] text-white flex items-center justify-center hover:bg-[#142d4a] transition-colors shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-slate-200" />
        </button>
        <button
          onClick={() => {
            setSelectedExp('PIE');
            setZoomLevel(1);
          }}
          className="w-9 h-9 rounded-xl bg-[#0c1f33]/90 border border-[#1e3957] text-white flex items-center justify-center hover:bg-[#142d4a] transition-colors shadow-md"
          title="Center Singapore Map"
        >
          <Crosshair className="w-4 h-4 text-[#5bb8fe]" />
        </button>
      </div>

      {/* SVG Interactive Map of Singapore Arterial Expressways */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #5bb8fe 1px, transparent 1px), linear-gradient(to right, #132438 1px, transparent 1px), linear-gradient(to bottom, #132438 1px, transparent 1px)`,
            backgroundSize: '20px 20px, 40px 40px, 40px 40px'
          }}
        />

        <div 
          className="w-full h-full max-w-2xl max-h-[520px] transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 600 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="map-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="map-glow-green" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Singapore Outline Silhouette (Stylized) */}
            <path
              d="M 60 210 Q 110 120 220 90 Q 340 70 420 80 Q 520 100 560 170 Q 540 250 440 290 Q 320 310 240 315 Q 120 300 60 210 Z"
              fill="#06101d"
              stroke="#14263b"
              strokeWidth="2"
            />

            {/* Minor Roads grid lines */}
            <g stroke="#13273e" strokeWidth="1.5" fill="none" opacity="0.6">
              <path d="M 120 180 Q 240 200 480 180" />
              <path d="M 280 100 Q 290 220 270 300" />
              <path d="M 380 90 Q 400 200 420 280" />
              <path d="M 160 150 Q 180 260 200 280" />
            </g>

            {/* EXPRESSWAY LINES */}

            {/* 1. PIE (Pan Island Expressway) - Red near Woodsville, smooth green elsewhere */}
            <g onClick={() => setSelectedExp('PIE')} className="cursor-pointer group">
              {/* West to Central Smooth Segment */}
              <path
                d="M 90 230 C 180 220, 260 205, 330 195"
                stroke="#10b981"
                strokeWidth={selectedExp === 'PIE' ? 6 : 4}
                strokeLinecap="round"
                fill="none"
                filter="url(#map-glow-green)"
              />
              {/* Congested Woodsville Flyover Segment (Red) */}
              <path
                d="M 330 195 C 380 185, 410 175, 440 170"
                stroke="#ef4444"
                strokeWidth={selectedExp === 'PIE' ? 6.5 : 4.5}
                strokeDasharray="6 3"
                strokeLinecap="round"
                fill="none"
                filter="url(#map-glow-red)"
              >
                <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.2s" repeatCount="indefinite" />
              </path>
              {/* East segment into Changi */}
              <path
                d="M 440 170 C 480 165, 520 160, 550 165"
                stroke="#10b981"
                strokeWidth={selectedExp === 'PIE' ? 6 : 4}
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* 2. CTE (Central Expressway) */}
            <path
              d="M 330 110 C 330 160, 320 220, 310 275"
              stroke="#f59e0b"
              strokeWidth={selectedExp === 'CTE' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('CTE')}
            />

            {/* 3. AYE (Ayer Rajah Expressway) */}
            <path
              d="M 70 240 C 140 260, 220 280, 300 285"
              stroke="#f59e0b"
              strokeWidth={selectedExp === 'AYE' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('AYE')}
            />

            {/* 4. KPE (Kallang-Paya Lebar Expressway) */}
            <path
              d="M 420 115 C 390 160, 370 220, 345 280"
              stroke="#10b981"
              strokeWidth={selectedExp === 'KPE' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('KPE')}
            />

            {/* 5. ECP (East Coast Parkway) */}
            <path
              d="M 320 285 C 370 290, 470 260, 545 175"
              stroke="#10b981"
              strokeWidth={selectedExp === 'ECP' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('ECP')}
            />

            {/* 6. TPE (Tampines Expressway) */}
            <path
              d="M 360 110 C 430 115, 500 130, 540 160"
              stroke="#10b981"
              strokeWidth={selectedExp === 'TPE' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('TPE')}
            />

            {/* 7. SLE & BKE (North links) */}
            <path
              d="M 230 100 C 280 95, 330 105, 360 110"
              stroke="#10b981"
              strokeWidth={selectedExp === 'SLE' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('SLE')}
            />
            <path
              d="M 230 100 C 230 140, 240 180, 250 215"
              stroke="#f59e0b"
              strokeWidth={selectedExp === 'BKE' ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              className="cursor-pointer"
              onClick={() => setSelectedExp('BKE')}
            />

            {/* EXPRESSWAY BADGES / LABELS */}
            <g fontSize="10" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.05em">
              <text x="210" y="210" fill="#93c5fd" className="pointer-events-none">PIE</text>
              <text x="460" y="155" fill="#93c5fd" className="pointer-events-none">PIE (East)</text>
              <text x="338" y="150" fill="#fde68a" className="pointer-events-none">CTE</text>
              <text x="160" y="275" fill="#fde68a" className="pointer-events-none">AYE</text>
              <text x="390" y="220" fill="#86efac" className="pointer-events-none">KPE</text>
              <text x="420" y="280" fill="#86efac" className="pointer-events-none">ECP</text>
              <text x="450" y="110" fill="#86efac" className="pointer-events-none">TPE</text>
            </g>

            {/* CCTV CAMERA PINS */}
            {(activeLayer === 'all' || activeLayer === 'cameras') && (
              <g>
                {/* CAM 1: PIE Woodsville */}
                <g 
                  transform="translate(365, 185)" 
                  className="cursor-pointer"
                  onClick={() => onOpenCam(TRAFFIC_CAMERAS[0])}
                >
                  <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  <circle r="4" fill="#ffffff" />
                  <title>CAM-PIE-48.2 (Woodsville Flyover)</title>
                </g>

                {/* CAM 2: CTE Cairnhill */}
                <g 
                  transform="translate(325, 230)" 
                  className="cursor-pointer"
                  onClick={() => onOpenCam(TRAFFIC_CAMERAS[1])}
                >
                  <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  <circle r="4" fill="#ffffff" />
                  <title>CAM-CTE-12.4 (Cairnhill)</title>
                </g>

                {/* CAM 3: KPE Tunnel */}
                <g 
                  transform="translate(380, 210)" 
                  className="cursor-pointer"
                  onClick={() => onOpenCam(TRAFFIC_CAMERAS[2])}
                >
                  <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  <circle r="4" fill="#ffffff" />
                  <title>CAM-KPE-06.8 (Kallang Bahru)</title>
                </g>

                {/* CAM 4: ECP Benjamin Sheares */}
                <g 
                  transform="translate(345, 285)" 
                  className="cursor-pointer"
                  onClick={() => onOpenCam(TRAFFIC_CAMERAS[3])}
                >
                  <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  <circle r="4" fill="#ffffff" />
                  <title>CAM-ECP-02.1 (Benjamin Sheares Bridge)</title>
                </g>
              </g>
            )}

            {/* ERP 2.0 GANTRY PINS */}
            {(activeLayer === 'all' || activeLayer === 'erp') && (
              <g>
                {ERP_GANTRIES.map((gantry, i) => {
                  const coords = [
                    { x: 375, y: 175 },
                    { x: 370, y: 250 },
                    { x: 335, y: 295 },
                    { x: 325, y: 180 },
                    { x: 190, y: 275 },
                  ][i] || { x: 300, y: 200 };

                  return (
                    <g 
                      key={gantry.id} 
                      transform={`translate(${coords.x}, ${coords.y})`}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedGantry(gantry);
                        setSelectedCamera(null);
                      }}
                    >
                      <rect x="-12" y="-8" width="24" height="16" rx="4" fill="#4338ca" stroke="#c7d2fe" strokeWidth="1.2" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        ${gantry.currentRate.toFixed(0)}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* INCIDENT ALERT PINS */}
            {(activeLayer === 'all' || activeLayer === 'incidents') && (
              <g 
                transform="translate(385, 180)" 
                className="cursor-pointer"
                onClick={onOpenAlerts}
              >
                <circle r="14" fill="#ef4444" opacity="0.3">
                  <animate attributeName="r" values="8;18" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Selected Item Telemetry Tray */}
      <div className="bg-[#0b1c2e] border-t border-[#1c3550] p-3.5 z-20">
        <div className="max-w-md mx-auto">
          {selectedGantry ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#818cf8]" />
                  <span className="text-xs font-bold text-white">{selectedGantry.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Operating: {selectedGantry.operatingHours} · Next {selectedGantry.nextTime}: ${selectedGantry.nextRate.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-400 tnum">
                  ${selectedGantry.currentRate.toFixed(2)}
                </span>
                <span className="block text-[10px] text-slate-400">Current Tariff</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#006398] text-white text-xs font-bold">
                    {selectedExpInfo.name}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {selectedExpInfo.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avg {selectedExpInfo.avgSpeedKmh} km/h</span>
                  </span>
                  {selectedExpInfo.incidentsCount > 0 ? (
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{selectedExpInfo.incidentsCount} Incident Active</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">No Incidents</span>
                  )}
                </div>
              </div>

              {/* Quick Camera Peek for this expressway */}
              <button
                onClick={() => {
                  const cam = TRAFFIC_CAMERAS.find(c => c.expressway === selectedExpInfo.id) || TRAFFIC_CAMERAS[0];
                  onOpenCam(cam);
                }}
                className="px-3 py-2 rounded-xl bg-[#142e4c] hover:bg-[#1a3d66] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#5bb8fe]" />
                <span>View CCTV</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
