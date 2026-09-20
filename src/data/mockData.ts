export interface TelemetryData {
  time: string;
  cht: number;
  egt: number;
  coolantTemp: number;
  ambientTemp: number;
  oilPressure: number;
  oilTemp: number;
  fuelPressure: number;
  fuelFlow: number;
  manifoldPressure: number;
  rpm: number;
  engineLoad: number;
  vibration: number;
  alternatorVoltage: number;
  injectionTiming: number;
  cycleCount: number;
  runtimeHours: number;
  anomalyScore?: number; // Kept for backwards compatibility but we will compute it
}

export interface FaultAlert {
  id: string;
  severity: 'warning' | 'critical';
  hypothesis: string;
  confidence: number;
  evidence: string[];
  detectionTime: string;
  recommendedAction: string;
}

export interface SystemStatus {
  telemetry: 'connected' | 'disconnected' | 'stale';
  dataProcessing: 'active' | 'inactive';
  twinSync: 'synchronized' | 'deviating' | 'offline';
  mlModel: 'online' | 'offline';
  anomalyEngine: 'active' | 'inactive';
  diagnosisEngine: 'active' | 'inactive';
  webSocket: 'connected' | 'disconnected';
}

export interface FaultEvent {
  id: string;
  time: string;
  fault: string;
  severity: 'warning' | 'critical';
  confidence: number;
  actionTaken: string;
}

export const CURRENT_STATE = {
  uavId: 'MALE-07',
  engineId: 'APX-04',
  mission: 'Maritime ISR / Sector 04',
  flightPhase: 'Cruise',
  utcTimestamp: '2026-09-20T17:22:00Z',
  runtimeHours: 142.5,
  cycleCount: 84,
  engineHealth: 88,
  anomalyScore: 42,
  anomalyThreshold: 50,
  twinDeviation: 11, // %
  rulEstimate: '340 hours',
  rulConfidence: '+/- 15 hrs'
};

export const ACTIVE_ALERT: FaultAlert | null = {
  id: 'AL-9021',
  severity: 'warning',
  hypothesis: 'Possible overheating trend',
  confidence: 86,
  evidence: [
    'EGT +11% over twin baseline',
    'CHT rising for 6 min'
  ],
  detectionTime: '2026-09-20T17:15:00Z',
  recommendedAction: 'Reduce load to 72% and inspect cooling airflow at the next safe opportunity'
};

export const SYSTEM_STATUS: SystemStatus = {
  telemetry: 'connected',
  dataProcessing: 'active',
  twinSync: 'synchronized',
  mlModel: 'online',
  anomalyEngine: 'active',
  diagnosisEngine: 'active',
  webSocket: 'connected'
};

// Generate realistic mock telemetry data over time
export const generateTelemetryHistory = (points: number): TelemetryData[] => {
  const data: TelemetryData[] = [];
  const now = new Date('2026-09-20T17:22:00Z').getTime();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now - i * 60000).toISOString(); // 1 min intervals
    
    // Base values with slight random fluctuations
    const baseRpm = 4500;
    const baseLoad = 85;
    
    // Simulate overheating trend in last 10 points
    const isOverheating = i < 10;
    const egtTrend = isOverheating ? (10 - i) * 8 : 0;
    const chtTrend = isOverheating ? (10 - i) * 3 : 0;
    const anomalyTrend = isOverheating ? (10 - i) * 3.5 : 0;
    
    data.push({
      time,
      cht: 180 + chtTrend + (Math.random() * 2 - 1),
      egt: 750 + egtTrend + (Math.random() * 5 - 2.5),
      coolantTemp: 90 + (Math.random() * 2 - 1),
      ambientTemp: 15,
      oilPressure: 65 + (Math.random() * 2 - 1),
      oilTemp: 95 + (Math.random() * 1 - 0.5),
      fuelPressure: 4.5 + (Math.random() * 0.1),
      fuelFlow: 12.5 + (Math.random() * 0.2 - 0.1),
      manifoldPressure: 28 + (Math.random() * 0.5 - 0.25),
      rpm: baseRpm + (Math.random() * 50 - 25),
      engineLoad: baseLoad + (Math.random() * 2 - 1),
      vibration: 1.2 + (Math.random() * 0.1),
      alternatorVoltage: 28.2 + (Math.random() * 0.1 - 0.05),
      injectionTiming: 14 + (Math.random() * 0.2 - 0.1),
      cycleCount: 84,
      runtimeHours: 142.5,
      anomalyScore: 12 + anomalyTrend + (Math.random() * 2)
    });
  }
  
  return data;
};

export const TELEMETRY_HISTORY = generateTelemetryHistory(60);

export const EVENT_HISTORY: FaultEvent[] = [
  { id: 'EV-101', time: '2026-09-18T14:30:00Z', fault: 'Sensor drift detected', severity: 'warning', confidence: 75, actionTaken: 'Auto-recalibrated' },
  { id: 'EV-100', time: '2026-09-15T09:15:00Z', fault: 'Abnormal vibration', severity: 'critical', confidence: 92, actionTaken: 'Mission aborted, inspected mount' }
];
