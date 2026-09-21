export interface TelemetryState {
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
  anomalyScore?: number; // for charts historical mapping
}

// Backward-compatible alias so existing imports don't need changing
export type TelemetryData = TelemetryState;

export interface MissionState {
  uavId: string;
  engineId: string;
  missionId: string;
  missionType: string;
  sector: string;
  flightPhase: string;
  utcTimestamp: string;
  runtimeHours: number;
  cycleCount: number;
  duration: string;
  date: string;
}

export interface HealthState {
  engineHealth: number;
  healthStart: number;
  healthEnd: number;
}

export interface AnomalyState {
  anomalyScore: number;
  anomalyThreshold: number;
  twinDeviation: number; // %
}

export interface FaultEvent {
  id: string;
  missionId: string;
  time: string;
  fault: string;
  severity: 'warning' | 'critical' | 'normal';
  confidence: number;
  actionTaken: string;
}

export interface FaultAlert {
  id: string;
  severity: 'warning' | 'critical';
  hypothesis: string;
  confidence: number;
  evidence: string[];
  affectedTelemetry: string[];
  detectionTime: string;
  recommendedAction: string;
  priority: 'Immediate' | 'P1' | 'P2' | 'Normal';
  timing: string;
  reason: string;
}

export interface DiagnosisState {
  activeAlertId: string | null;
  alerts: FaultAlert[];
}

export interface RulState {
  rulEstimate: number; // hours
  confidenceInterval: string;
  maintenanceHorizon: string;
  explainabilityNotes: string[];
}

export interface PipelineStatus {
  component: string;
  status: 'Ready' | 'Demo' | 'Future' | 'Connected';
}

export interface EngineDemoState {
  mission: MissionState;
  telemetry: TelemetryState;
  health: HealthState;
  anomaly: AnomalyState;
  diagnosis: DiagnosisState;
  rul: RulState;
  events: FaultEvent[];
  pipeline: PipelineStatus[];
  telemetryHistory: TelemetryState[];
  systemStatus: {
    telemetry: 'connected' | 'disconnected' | 'stale';
    dataProcessing: 'active' | 'inactive';
    twinSync: 'synchronized' | 'deviating' | 'offline';
    mlModel: 'online' | 'offline';
    anomalyEngine: 'active' | 'inactive';
    diagnosisEngine: 'active' | 'inactive';
    webSocket: 'connected' | 'disconnected';
  };
}

const generateTelemetryHistory = (points: number): TelemetryState[] => {
  const data: TelemetryState[] = [];
  const now = new Date('2026-09-20T17:22:00Z').getTime();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now - i * 60000).toISOString();
    const baseRpm = 4500;
    const baseLoad = 85;
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
      anomalyScore: 12 + anomalyTrend + (Math.random() * 2)
    });
  }
  return data;
};

export const DEMO_STATE: EngineDemoState = {
  mission: {
    uavId: 'UAV-07',
    engineId: 'APX-04',
    missionId: 'MALE-07',
    missionType: 'Maritime ISR',
    sector: 'Sector 04',
    flightPhase: 'Cruise',
    utcTimestamp: '2026-09-20T17:22:00Z',
    runtimeHours: 142.5,
    cycleCount: 84,
    duration: '4h 15m',
    date: '2026-09-20'
  },
  telemetry: {
    time: '2026-09-20T17:22:00Z',
    cht: 188.4,
    egt: 820.5,
    coolantTemp: 91.2,
    ambientTemp: 15.0,
    oilPressure: 64.8,
    oilTemp: 95.2,
    fuelPressure: 4.52,
    fuelFlow: 12.6,
    manifoldPressure: 28.1,
    rpm: 4510,
    engineLoad: 85.5,
    vibration: 1.25,
    alternatorVoltage: 28.15,
    injectionTiming: 14.1
  },
  health: {
    engineHealth: 88,
    healthStart: 98,
    healthEnd: 88
  },
  anomaly: {
    anomalyScore: 42.1,
    anomalyThreshold: 50.0,
    twinDeviation: 11
  },
  diagnosis: {
    activeAlertId: 'AL-9021',
    alerts: [
      {
        id: 'AL-9021',
        severity: 'warning',
        hypothesis: 'Possible overheating trend',
        confidence: 86,
        evidence: [
          'EGT +11% over twin baseline',
          'CHT rising for 6 min'
        ],
        affectedTelemetry: ['EGT', 'CHT', 'Coolant Temp'],
        detectionTime: '2026-09-20T17:15:00Z',
        recommendedAction: 'Inspect cooling airflow',
        priority: 'P2',
        timing: 'within 12 flight hours',
        reason: 'EGT is running 11% above the twin baseline during cruise. Prolonged operation may accelerate thermal degradation.'
      }
    ]
  },
  rul: {
    rulEstimate: 340,
    confidenceInterval: '+/- 15 hrs',
    maintenanceHorizon: 'Next scheduled overhaul at 500 hrs',
    explainabilityNotes: [
      'Thermal drift in EGT/CHT accounts for 60% of current health index degradation.',
      'Oil pressure and vibration remain within normal baseline confidence intervals.',
      'Cycle count (84) aligns with expected mid-life wear patterns.'
    ]
  },
  events: [
    { id: 'EV-102', missionId: 'MALE-07', time: '2026-09-20T17:15:00Z', fault: 'Thermal deviation threshold crossed', severity: 'warning', confidence: 88, actionTaken: 'Alert operator' },
    { id: 'EV-101', missionId: 'MALE-06', time: '2026-09-18T14:30:00Z', fault: 'Sensor drift detected', severity: 'warning', confidence: 75, actionTaken: 'Auto-recalibrated' },
    { id: 'EV-100', missionId: 'MALE-04', time: '2026-09-15T09:15:00Z', fault: 'Abnormal vibration', severity: 'critical', confidence: 92, actionTaken: 'Mission aborted, inspected mount' }
  ],
  pipeline: [
    { component: 'Visualization shell', status: 'Ready' },
    { component: 'Simulation model', status: 'Demo' },
    { component: 'Anomaly detection', status: 'Demo' },
    { component: 'Fault diagnosis', status: 'Demo' },
    { component: 'RUL prediction', status: 'Demo' },
    { component: 'Real engine dataset', status: 'Future' }
  ],
  telemetryHistory: generateTelemetryHistory(60),
  systemStatus: {
    telemetry: 'connected',
    dataProcessing: 'active',
    twinSync: 'synchronized',
    mlModel: 'online',
    anomalyEngine: 'active',
    diagnosisEngine: 'active',
    webSocket: 'connected'
  }
};

// Aliases for compatibility during refactoring
export const CURRENT_STATE = DEMO_STATE.mission;
export const ACTIVE_ALERT = DEMO_STATE.diagnosis.alerts[0];
export const SYSTEM_STATUS = DEMO_STATE.systemStatus;
export const TELEMETRY_HISTORY = DEMO_STATE.telemetryHistory;
export const EVENT_HISTORY = DEMO_STATE.events;
