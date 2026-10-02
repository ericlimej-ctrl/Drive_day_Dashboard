import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Plus, 
  Check, 
  X, 
  Camera,
  Car,
  CloudRain,
  Wrench,
  Construction
} from 'lucide-react';
import { IncidentAlert, TrafficCamera } from '../../types/telemetry';
import { TRAFFIC_CAMERAS } from '../../data/mockTelemetry';

interface Props {
  incidents: IncidentAlert[];
  onAddIncident: (inc: IncidentAlert) => void;
  onOpenCam: (cam: TrafficCamera) => void;
}

export const AlertsScreen: React.FC<Props> = ({
  incidents,
  onAddIncident,
  onOpenCam,
}) => {
  const [filterExp, setFilterExp] = useState<string>('ALL');
  const [showReportModal, setShowReportModal] = useState(false);

  // New incident report form
  const [repExp, setRepExp] = useState('PIE');
  const [repType, setRepType] = useState<'accident' | 'lane_blocked' | 'breakdown' | 'roadwork' | 'weather'>('lane_blocked');
  const [repLocation, setRepLocation] = useState('');
  const [repDetails, setRepDetails] = useState('');
  const [repDelay, setRepDelay] = useState(10);

  const expresswaysList = ['ALL', 'PIE', 'CTE', 'AYE', 'KPE', 'ECP', 'BKE', 'SLE', 'TPE'];

  const filteredIncidents = filterExp === 'ALL'
    ? incidents
    : incidents.filter((inc) => inc.expressway === filterExp);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'roadwork':
        return <Construction className="w-5 h-5 text-amber-600" />;
      case 'breakdown':
        return <Wrench className="w-5 h-5 text-orange-600" />;
      case 'lane_blocked':
      case 'accident':
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repLocation.trim()) return;

    const newInc: IncidentAlert = {
      id: `user-alert-${Date.now()}`,
      expressway: repExp,
      title: `${repExp} near ${repLocation} reported: ${repType.replace('_', ' ')}`,
      location: repLocation,
      laneInfo: repDetails || 'Lane traffic slowed',
      delayMinutes: repDelay,
      type: repType,
      timestamp: 'Just now (Community Verified)',
      severity: repDelay > 10 ? 'high' : 'medium',
    };

    onAddIncident(newInc);
    setShowReportModal(false);
    setRepLocation('');
    setRepDetails('');
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      
      {/* Screen Title & Report Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0d1c2e] tracking-tight">
            Expressway Telemetry Alerts
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Official LTA Feeds & Traffic Incidents
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="py-2 px-3 rounded-xl bg-[#006398] hover:bg-[#004e79] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Expressway Filter Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {expresswaysList.map((exp) => (
          <button
            key={exp}
            onClick={() => setFilterExp(exp)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterExp === exp
                ? 'bg-[#0a2540] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {exp}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Clear Expressway Flow</p>
            <p className="text-xs text-slate-500 mt-1">No verified incidents on {filterExp} at this time.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 ${
                inc.severity === 'high' ? 'border-red-200 bg-red-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    inc.severity === 'high' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    {getIncidentIcon(inc.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#0a2540] text-white text-[10px] font-bold tracking-wider">
                        {inc.expressway}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        inc.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.type.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                      {inc.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-red-600 tnum">
                    +{inc.delayMinutes}m
                  </span>
                  <span className="block text-[10px] text-slate-400">Delay</span>
                </div>
              </div>

              {inc.laneInfo && (
                <div className="text-xs text-slate-700 bg-slate-100/80 rounded-xl px-3 py-2 font-medium">
                  {inc.laneInfo}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{inc.timestamp}</span>
                </span>

                <button
                  onClick={() => {
                    const cam = TRAFFIC_CAMERAS.find(c => c.expressway === inc.expressway) || TRAFFIC_CAMERAS[0];
                    onOpenCam(cam);
                  }}
                  className="text-[#006398] font-bold flex items-center gap-1 hover:underline"
                >
                  <Camera className="w-3 h-3" />
                  <span>View Nearby CCTV</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleReportSubmit} className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Report Traffic Incident</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Expressway</label>
              <select
                value={repExp}
                onChange={(e) => setRepExp(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                {['PIE', 'CTE', 'AYE', 'KPE', 'ECP', 'BKE', 'SLE', 'TPE', 'MCE'].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Incident Type</label>
              <select
                value={repType}
                onChange={(e) => setRepType(e.target.value as any)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                <option value="lane_blocked">Lane Blocked / Stalled Vehicle</option>
                <option value="accident">Traffic Accident</option>
                <option value="breakdown">Vehicle Breakdown</option>
                <option value="roadwork">Road Works / Maintenance</option>
                <option value="weather">Heavy Rain / Low Visibility</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Location Landmark / Flyover</label>
              <input
                type="text"
                placeholder="e.g. Near Woodsville Flyover towards Changi"
                value={repLocation}
                onChange={(e) => setRepLocation(e.target.value)}
                required
                className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-[#006398]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Lane & Delay Details</label>
              <input
                type="text"
                placeholder="e.g. Lane 1 blocked, slow moving traffic"
                value={repDetails}
                onChange={(e) => setRepDetails(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-[#006398]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0a2540] text-white text-xs font-bold"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
