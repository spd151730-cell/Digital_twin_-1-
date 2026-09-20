import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { TELEMETRY_HISTORY } from '../data/mockData';
import type { TelemetryData } from '../data/mockData';
import { computeDerivedOutputs } from '../utils/demoLogic';
import type { DerivedDemoOutputs } from '../utils/demoLogic';

export interface ManualChangeRecord {
  time: string;
  group: string;
  oldValue: string;
  newValue: string;
}

interface TelemetryContextType {
  telemetry: TelemetryData;
  telemetryHistory: TelemetryData[];
  derivedOutputs: DerivedDemoOutputs;
  isManualOverride: boolean;
  lastAppliedTime: string | null;
  manualChanges: ManualChangeRecord[];
  applyManualTelemetry: (newData: TelemetryData, changes: ManualChangeRecord[]) => void;
  resetToBaseline: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

const BASELINE_TELEMETRY = TELEMETRY_HISTORY[TELEMETRY_HISTORY.length - 1];
const BASELINE_HISTORY = TELEMETRY_HISTORY;

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<TelemetryData[]>(BASELINE_HISTORY);
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryData>(BASELINE_TELEMETRY);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [lastAppliedTime, setLastAppliedTime] = useState<string | null>(null);
  const [manualChanges, setManualChanges] = useState<ManualChangeRecord[]>([]);

  const derivedOutputs = useMemo(() => computeDerivedOutputs(latestTelemetry), [latestTelemetry]);

  const applyManualTelemetry = (newData: TelemetryData, changes: ManualChangeRecord[]) => {
    const now = new Date().toISOString();
    const newHistory = [...history.slice(1), { ...newData, time: now }];
    setHistory(newHistory);
    setLatestTelemetry({ ...newData, time: now });
    setIsManualOverride(true);
    setLastAppliedTime(now);
    setManualChanges(prev => [...changes, ...prev].slice(0, 5));
  };

  const resetToBaseline = () => {
    setHistory(BASELINE_HISTORY);
    setLatestTelemetry(BASELINE_TELEMETRY);
    setIsManualOverride(false);
    setLastAppliedTime(null);
    setManualChanges([]);
  };

  return (
    <TelemetryContext.Provider value={{
      telemetry: latestTelemetry,
      telemetryHistory: history,
      derivedOutputs,
      isManualOverride,
      lastAppliedTime,
      manualChanges,
      applyManualTelemetry,
      resetToBaseline
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
}
