import React, { useState } from 'react';
import { Building2, Home, Plane, Dumbbell, MapPin, Plus, Trash2, X, Check } from 'lucide-react';
import { SavedCommute } from '../types/telemetry';

interface Props {
  commutes: SavedCommute[];
  onSelectCommute: (commute: SavedCommute) => void;
  onUpdateCommutes: (commutes: SavedCommute[]) => void;
}

export const SavedCommutesSection: React.FC<Props> = ({
  commutes,
  onSelectCommute,
  onUpdateCommutes,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New commute form state
  const [newTitle, setNewTitle] = useState('');
  const [newOrigin, setNewOrigin] = useState('Tampines Ave 4 (Blk 842)');
  const [newDest, setNewDest] = useState('');
  const [newType, setNewType] = useState<'work' | 'home' | 'airport' | 'gym' | 'custom'>('custom');

  const getCommuteIcon = (type: string) => {
    switch (type) {
      case 'work':
        return <Building2 className="w-5 h-5 text-[#0d1c2e]" strokeWidth={2.2} />;
      case 'home':
        return <Home className="w-5 h-5 text-[#0d1c2e]" strokeWidth={2.2} />;
      case 'airport':
        return <Plane className="w-5 h-5 text-[#0d1c2e]" strokeWidth={2.2} />;
      case 'gym':
        return <Dumbbell className="w-5 h-5 text-[#0d1c2e]" strokeWidth={2.2} />;
      default:
        return <MapPin className="w-5 h-5 text-[#0d1c2e]" strokeWidth={2.2} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'smooth':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Smooth</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/90 text-amber-900 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Moderate</span>
          </span>
        );
      case 'congested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>Heavy</span>
          </span>
        );
      case 'clear':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Clear</span>
          </span>
        );
    }
  };

  const handleDeleteCommute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateCommutes(commutes.filter((c) => c.id !== id));
  };

  const handleAddNewCommute = () => {
    if (!newTitle.trim() || !newDest.trim()) return;
    const newItem: SavedCommute = {
      id: `commute-${Date.now()}`,
      type: newType,
      title: newTitle,
      origin: newOrigin,
      destination: newDest,
      durationMins: 22,
      normalDurationMins: 20,
      delayMins: 2,
      delayNote: 'via CTE / PIE',
      trafficStatus: 'smooth',
      routeSummary: 'CTE / PIE',
      erpCost: 2.00,
      distanceKm: 14.5,
    };
    onUpdateCommutes([...commutes, newItem]);
    setNewTitle('');
    setNewDest('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-3">
      {/* Header matching screenshot: "Saved Commutes" + "Edit" */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-[17px] font-bold text-[#0d1c2e] tracking-tight">
          Saved Commutes
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm font-semibold text-[#006398] hover:text-[#004e79] transition-colors cursor-pointer"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* List of Commute Cards matching screenshot */}
      <div className="space-y-2.5">
        {commutes.map((commute) => (
          <div
            key={commute.id}
            onClick={() => !isEditing && onSelectCommute(commute)}
            className={`w-full bg-white rounded-2xl border border-slate-200/90 p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all ${
              isEditing ? 'border-dashed border-slate-300' : 'hover:border-slate-300 hover:shadow-sm cursor-pointer active:scale-[0.99]'
            }`}
          >
            {/* Left Column: Icon + Commute Name & Time Readouts */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Category Icon inside rounded light blue box matching screenshot */}
              <div className="w-11 h-11 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0">
                {getCommuteIcon(commute.type)}
              </div>

              {/* Middle Information Stack */}
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0d1c2e] truncate">
                  {commute.title}
                </h4>

                <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                  {/* Bold Duration Readout matching screenshot (e.g. "24 mins") */}
                  <span className="text-[18px] font-bold text-[#0d1c2e] tracking-tight tnum leading-tight">
                    {commute.durationMins} <span className="text-sm font-bold">mins</span>
                  </span>

                  {/* Delay / Normal Note */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    {commute.delayMins > 0 && commute.delayNote?.includes('+') ? (
                      <span className="text-amber-700 font-bold">
                        · {commute.delayNote}
                      </span>
                    ) : (
                      <>
                        {commute.delayNote && <span>· {commute.delayNote}</span>}
                        {commute.routeSummary && <span>· {commute.routeSummary}</span>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Status Capsule & Tabular ERP Charge */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {isEditing ? (
                <button
                  onClick={(e) => handleDeleteCommute(commute.id, e)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete commute"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <>
                  {getStatusBadge(commute.trafficStatus)}
                  <span className="text-xs font-bold text-[#0d1c2e] tnum">
                    ERP ${commute.erpCost.toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add Commute Button when in edit mode */}
        {isEditing && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#006398]/40 hover:border-[#006398] bg-[#eff4ff]/50 text-[#006398] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Commute</span>
          </button>
        )}
      </div>

      {/* Add New Commute Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Saved Commute</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Label (e.g. Gym, Parents)</label>
                <input
                  type="text"
                  placeholder="e.g. Gym: One-North"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:border-[#006398] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Fusionopolis Way, One-North"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:border-[#006398] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Category</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(['work', 'home', 'airport', 'gym'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                        newType === t
                          ? 'border-[#006398] bg-[#eff4ff] text-[#006398]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNewCommute}
                  className="flex-1 py-2.5 rounded-xl bg-[#0a2540] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
