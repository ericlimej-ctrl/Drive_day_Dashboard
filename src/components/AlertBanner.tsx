import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { IncidentAlert } from '../types/telemetry';

interface Props {
  alert: IncidentAlert;
  onOpenAlerts?: () => void;
}

export const AlertBanner: React.FC<Props> = ({ alert, onOpenAlerts }) => {
  return (
    <div
      onClick={onOpenAlerts}
      role="button"
      tabIndex={0}
      className="w-full bg-[#fde8e8] hover:bg-[#fbdada] border-b border-red-200/80 px-4 py-2.5 transition-colors cursor-pointer text-[#842029]"
    >
      <div className="max-w-md mx-auto flex items-center gap-2.5">
        {/* Red Warning Triangle Icon */}
        <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0" strokeWidth={2.2} />

        {/* Solid Red "ALERT" Badge */}
        <span className="shrink-0 bg-[#ba1a1a] text-white text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
          ALERT
        </span>

        {/* Marquee/Single-line Alert Text matching screenshot */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] leading-tight font-medium text-[#7a1b1b] truncate">
            {alert.title} <span className="font-semibold text-[#5a1010]">· Delays of {alert.delayMinutes} mins</span>
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-red-500/70 shrink-0" />
      </div>
    </div>
  );
};
