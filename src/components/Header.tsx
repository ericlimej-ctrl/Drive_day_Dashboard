import React from 'react';

interface Props {
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<Props> = ({ onRefresh, isSyncing = false }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#f8f9ff]/90 backdrop-blur-md px-4 py-3 border-b border-[#e2e8f0]/80">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Traffic light badge + Brand Title */}
        <div className="flex items-center gap-2.5">
          {/* Traffic light icon inside dark rounded box matching screenshot */}
          <div className="w-9 h-9 rounded-xl bg-[#0d1c2e] flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Traffic light casing */}
              <rect x="6" y="2" width="12" height="20" rx="3" fill="#0d1c2e" stroke="#334155" strokeWidth="1.5" />
              {/* Three light lenses: red, amber, green */}
              <circle cx="12" cy="6" r="2.2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.5" />
              <circle cx="12" cy="12" r="2.2" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
              <circle cx="12" cy="18" r="2.2" fill="#10b981" stroke="#065f46" strokeWidth="0.5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0d1c2e]">
            Day_drive
          </span>
        </div>

        {/* Right: "LIVE · LTA" capsule pill matching screenshot */}
        <div 
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/90 text-emerald-800 text-xs font-bold tracking-wide shadow-xs cursor-pointer hover:bg-emerald-100/80 transition-colors"
          title="Click to re-sync LTA telemetry"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] ${isSyncing ? 'duration-500' : 'duration-1000'} opacity-75`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>
          <span className="uppercase text-[11px] font-extrabold tracking-wider">
            {isSyncing ? 'SYNCING...' : 'LIVE · LTA'}
          </span>
        </div>
      </div>
    </header>
  );
};
