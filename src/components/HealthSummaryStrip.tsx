import { DEMO_STATE } from '../data/mockData';
import './HealthSummaryStrip.css';

export function HealthSummaryStrip() {
  return (
    <div className="health-strip">
      {/* Card 1: Engine Health → Mint */}
      <div className="health-item health-item--health">
        <span className="health-label">Engine Health</span>
        <div className="health-value-row">
          <span className="health-value">
            {DEMO_STATE.health.engineHealth}%
          </span>
          <span className={`status-indicator ${DEMO_STATE.health.engineHealth < 90 ? 'status-warning' : 'status-normal'}`}>
            {DEMO_STATE.health.engineHealth < 90 ? 'DEGRADED' : 'NOMINAL'}
          </span>
        </div>
      </div>

      {/* Card 2: Anomaly Score → Soft Yellow */}
      <div className="health-item health-item--anomaly">
        <span className="health-label">Anomaly Score</span>
        <div className="health-value-row">
          <span className="health-value">
            {DEMO_STATE.anomaly.anomalyScore.toFixed(1)}
          </span>
          <span className={`status-indicator ${DEMO_STATE.anomaly.anomalyScore > DEMO_STATE.anomaly.anomalyThreshold ? 'status-critical' : 'status-normal'}`}>
            {DEMO_STATE.anomaly.anomalyScore > DEMO_STATE.anomaly.anomalyThreshold ? 'ALERT' : 'NORMAL'}
          </span>
        </div>
        <div className="health-sub">Threshold: {DEMO_STATE.anomaly.anomalyThreshold}</div>
      </div>

      {/* Card 3: Digital-Twin Sync → Sky Blue */}
      <div className="health-item health-item--twin">
        <span className="health-label">Digital-Twin Sync</span>
        <div className="health-value-row">
          <span className="health-value">
            {DEMO_STATE.anomaly.twinDeviation}%
          </span>
          <span className={`status-indicator ${DEMO_STATE.anomaly.twinDeviation > 10 ? 'status-warning' : 'status-normal'}`}>
            {DEMO_STATE.anomaly.twinDeviation > 10 ? 'WARNING' : 'SYNCED'}
          </span>
        </div>
      </div>

      {/* Card 4: RUL Estimate → Lavender */}
      <div className="health-item health-item--rul">
        <span className="health-label">RUL Estimate</span>
        <div className="health-value-row">
          <span className="health-value">{DEMO_STATE.rul.rulEstimate}h</span>
          <span className="status-indicator status-normal">
            CONF {DEMO_STATE.rul.confidenceInterval}
          </span>
        </div>
      </div>

      {/* Card 5: Flight Phase / Mission → Blush Pink */}
      <div className="health-item health-item--mission">
        <span className="health-label">Flight Phase</span>
        <div className="health-value-row">
          <span className="health-value">{DEMO_STATE.mission.flightPhase}</span>
        </div>
        <div className="health-sub">Runtime: {DEMO_STATE.mission.runtimeHours}h</div>
      </div>
    </div>
  );
}
