import React from 'react';
import { Route as RouteIcon, Map as MapIcon, AlertTriangle, Settings } from 'lucide-react';

export type TabType = 'plan' | 'map' | 'alerts' | 'settings';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unresolvedAlertsCount?: number;
}

export const BottomNav: React.FC<Props> = ({
  activeTab,
  onTabChange,
  unresolvedAlertsCount = 1,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 px-2">
        {/* Tab 1: Plan (Selected pill background in screenshot) */}
        <button
          onClick={() => onTabChange('plan')}
          className={`flex flex-col items-center justify-center h-full transition-colors relative ${
            activeTab === 'plan' ? 'text-[#006398]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-xl transition-all flex flex-col items-center ${
              activeTab === 'plan' ? 'bg-[#eff4ff]' : ''
            }`}
          >
            <RouteIcon className="w-5 h-5" strokeWidth={2.4} />
            <span className="text-[11px] font-bold mt-0.5 tracking-tight">Plan</span>
          </div>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center h-full transition-colors relative ${
            activeTab === 'map' ? 'text-[#006398]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-xl transition-all flex flex-col items-center ${
              activeTab === 'map' ? 'bg-[#eff4ff]' : ''
            }`}
          >
            <MapIcon className="w-5 h-5" strokeWidth={2.2} />
            <span className="text-[11px] font-bold mt-0.5 tracking-tight">Map</span>
          </div>
        </button>

        {/* Tab 3: Alerts with Red Notification Dot matching screenshot */}
        <button
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center justify-center h-full transition-colors relative ${
            activeTab === 'alerts' ? 'text-[#006398]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-xl transition-all flex flex-col items-center relative ${
              activeTab === 'alerts' ? 'bg-[#eff4ff]' : ''
            }`}
          >
            <div className="relative">
              <AlertTriangle className="w-5 h-5" strokeWidth={2.2} />
              {unresolvedAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#dc2626] ring-2 ring-white" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-0.5 tracking-tight">Alerts</span>
          </div>
        </button>

        {/* Tab 4: Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center h-full transition-colors relative ${
            activeTab === 'settings' ? 'text-[#006398]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-xl transition-all flex flex-col items-center ${
              activeTab === 'settings' ? 'bg-[#eff4ff]' : ''
            }`}
          >
            <Settings className="w-5 h-5" strokeWidth={2.2} />
            <span className="text-[11px] font-bold mt-0.5 tracking-tight">Settings</span>
          </div>
        </button>
      </div>
    </nav>
  );
};
