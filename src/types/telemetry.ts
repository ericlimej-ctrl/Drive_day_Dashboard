export interface ExpresswayInfo {
  id: string;
  name: string;
  fullName: string;
  status: 'smooth' | 'moderate' | 'slow' | 'congested';
  avgSpeedKmh: number;
  incidentsCount: number;
}

export interface TrafficCamera {
  id: string;
  name: string;
  expressway: string;
  locationName: string;
  imageUrl: string;
  currentSpeed: number;
  speedLimit: number;
  status: 'smooth' | 'moderate' | 'heavy';
  timestamp: string;
}

export interface ErpGantry {
  id: string;
  name: string;
  expressway: string;
  currentRate: number;
  nextRate: number;
  nextTime: string;
  operatingHours: string;
  direction: string;
}

export interface IncidentAlert {
  id: string;
  expressway: string;
  title: string;
  location: string;
  laneInfo?: string;
  delayMinutes: number;
  type: 'accident' | 'lane_blocked' | 'breakdown' | 'roadwork' | 'weather';
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SavedCommute {
  id: string;
  type: 'work' | 'home' | 'airport' | 'gym' | 'custom';
  title: string;
  origin: string;
  destination: string;
  durationMins: number;
  normalDurationMins: number;
  delayMins: number;
  delayNote?: string;
  trafficStatus: 'smooth' | 'moderate' | 'congested' | 'clear';
  routeSummary: string;
  erpCost: number;
  distanceKm: number;
}

export interface RouteOption {
  id: string;
  name: string;
  expresswayPath: string[];
  durationMins: number;
  normalMins: number;
  distanceKm: number;
  delayMins: number;
  erpCost: number;
  status: 'smooth' | 'moderate' | 'congested';
  tag: 'Recommended' | 'Fastest' | 'Lowest Toll' | 'Scenic';
  gantries: string[];
  steps: {
    instruction: string;
    expressway?: string;
    distance: string;
    isErp?: boolean;
    erpCost?: number;
  }[];
}
