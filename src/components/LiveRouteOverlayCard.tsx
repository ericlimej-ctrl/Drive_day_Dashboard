import React, { useState } from 'react';
import { Compass, ZoomIn } from 'lucide-react';

interface Props {
  onOpenMap?: () => void;
  selectedExpressway?: string;
  onSelectExpressway?: (exp: string) => void;
}

export const LiveRouteOverlayCard: React.FC<Props> = ({ onOpenMap, onSelectExpressway }) => {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  return (
    <div className="relative w-full rounded-2xl bg-[#091522] border border-[#162a42] overflow-hidden shadow-md text-white select-none">
      {/* Background subtle radar/grid pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #006398 1px, transparent 1px), linear-gradient(to right, #132438 1px, transparent 1px), linear-gradient(to bottom, #132438 1px, transparent 1px)`,
          backgroundSize: '24px 24px, 48px 48px, 48px 48px'
        }}
      />

      {/* Top Badge: "LIVE ROUTE OVERLAY" with compass & pulsing dot */}
      <div className="absolute top-3 left-3 z-10">
        <div className="inline-flex items-center gap-2 bg-[#0c1f33]/90 backdrop-blur-md border border-[#1e3957] rounded-lg px-2.5 py-1.5 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-[#5bb8fe]" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200">
            LIVE ROUTE OVERLAY
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>
        </div>
      </div>

      {/* Quick Map Expand Button in top-right */}
      {onOpenMap && (
        <button
          onClick={onOpenMap}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#0c1f33]/80 hover:bg-[#142d4a] transition-colors border border-[#1e3957] rounded-lg px-2 py-1 text-[11px] text-slate-300 font-medium"
          title="Open Full Map"
        >
          <ZoomIn className="w-3.5 h-3.5 text-[#5bb8fe]" />
          <span>Full Map</span>
        </button>
      )}

      {/* SVG Canvas depicting Singapore Expressway Junction Curves matching screenshot */}
      <div className="w-full h-36 sm:h-44 pt-2">
        <svg
          viewBox="0 0 420 170"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Glow filters for expressway telemetry lines */}
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint expressway grid connectors */}
          <path
            d="M 10 30 Q 180 40 410 70"
            stroke="#16293f"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 50 160 Q 250 140 400 30"
            stroke="#16293f"
            strokeWidth="3"
            fill="none"
          />

          {/* PIE Congested Segment (Red Dashed Line with glow and live moving dash) */}
          <path
            d="M 90 170 C 130 140, 240 85, 410 20"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow-red)"
            className="cursor-pointer transition-opacity"
            opacity={hoveredLine === 'PIE' ? 1 : 0.95}
            onMouseEnter={() => setHoveredLine('PIE')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectExpressway?.('PIE')}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-20"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </path>

          {/* CTE / KPE Smooth Corridor (Green Solid Glowing Curve) */}
          <path
            d="M 15 125 C 140 120, 240 80, 415 88"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow-green)"
            className="cursor-pointer"
            opacity={hoveredLine === 'CTE' ? 1 : 0.9}
            onMouseEnter={() => setHoveredLine('CTE')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectExpressway?.('CTE')}
          />

          {/* MCE / ECP Marine Coastal Link (Teal / Blue Line) */}
          <path
            d="M 270 85 C 290 125, 340 155, 410 165"
            stroke="#0284c7"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow-cyan)"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredLine('ECP')}
            onMouseLeave={() => setHoveredLine(null)}
            onClick={() => onSelectExpressway?.('ECP')}
          />

          {/* Intersecting Junction Ring (Woodsville / Kallang Way interchange) */}
          <g transform="translate(270, 85)" className="cursor-pointer">
            {/* Outer animated radar pulse ring */}
            <circle r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4">
              <animate attributeName="r" values="6;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Central node ring matching the screenshot */}
            <circle r="5.5" fill="#091522" stroke="#f59e0b" strokeWidth="2.5" />
            <circle r="2.5" fill="#f59e0b" />
          </g>

          {/* Label annotations */}
          <text x="320" y="36" fill="#fca5a5" fontSize="10" fontWeight="bold" letterSpacing="0.04em">
            PIE (Jam)
          </text>
          <text x="60" y="115" fill="#6ee7b7" fontSize="10" fontWeight="bold" letterSpacing="0.04em">
            KPE (Smooth)
          </text>
        </svg>
      </div>

      {/* Bottom Right Legend matching the screenshot: ● Smooth  ● Mod  ● PIE Jam */}
      <div className="absolute bottom-2.5 right-3 z-10">
        <div className="flex items-center gap-3 bg-[#0a1828]/95 backdrop-blur-md border border-[#1a334e] rounded-lg px-2.5 py-1 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Smooth</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>Mod</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#fca5a5]">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="font-bold">PIE Jam</span>
          </div>
        </div>
      </div>
    </div>
  );
};
