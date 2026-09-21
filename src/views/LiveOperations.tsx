import { HealthSummaryStrip } from '../components/HealthSummaryStrip';
import { TwinVisualization } from '../components/TwinVisualization';
import { TelemetryGroups } from '../components/TelemetryGroups';
import { useTelemetry } from '../contexts/TelemetryContext';
import { DEMO_STATE } from '../data/mockData';
import './LiveOperations.css';

interface LiveOperationsProps {
  onViewChange?: (view: string) => void;
}

export function LiveOperations({ onViewChange: _onViewChange }: LiveOperationsProps) {
  const { isManualOverride, lastAppliedTime } = useTelemetry();
  const { mission } = DEMO_STATE;

  return (
    <div className="live-operations">

      {/* 1. Page heading + mission context */}
      <div className="live-ops-heading">
        <div className="live-ops-title-row">
          <div>
            <div className="eyebrow">LIVE ENGINE TELEMETRY</div>
            <h1 className="live-ops-title">Live Operations</h1>
          </div>
          <div className="live-ops-meta">
            <span className="meta-chip">{mission.missionId}</span>
            <span className="meta-chip">{mission.flightPhase}</span>
            <span className="meta-chip tabular-nums">{mission.utcTimestamp} UTC</span>
          </div>
        </div>

        {isManualOverride && (
          <div className="manual-override-banner">
            <span className="manual-override-label">MANUAL DEMO INPUTS ACTIVE</span>
            {lastAppliedTime && (
              <span className="manual-override-time">
                Last applied {new Date(lastAppliedTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' })} UTC
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Health summary cards */}
      <HealthSummaryStrip />

      {/* 3. Main operations content */}
      <div className="live-operations-main">
        {/* Digital Twin / Engine Synchronisation */}
        <TwinVisualization />

        {/* Sensor Telemetry */}
        <TelemetryGroups />
      </div>

    </div>
  );
}
