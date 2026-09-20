import { CURRENT_STATE } from '../data/mockData';
import './HealthSummaryStrip.css';

export function HealthSummaryStrip() {
  return (
    <div className="health-strip">
      <div className="health-item">
        <span className="health-label">Engine Health</span>
        <div className="health-value-row">
          <span className="health-value tabular-nums">{CURRENT_STATE.engineHealth}%</span>
          <span className="status-indicator status-normal">Normal</span>
        </div>
      </div>
      
      <div className="health-item">
        <span className="health-label">Anomaly Score</span>
        <div className="health-value-row">
          <span className="health-value tabular-nums">{CURRENT_STATE.anomalyScore}</span>
          <span className="status-indicator status-warning">Elevated</span>
        </div>
        <div className="health-sub">Threshold: {CURRENT_STATE.anomalyThreshold}</div>
      </div>

      <div className="health-item">
        <span className="health-label">Digital-Twin Sync</span>
        <div className="health-value-row">
          <span className="health-value tabular-nums">{CURRENT_STATE.twinDeviation}% Dev</span>
          <span className="status-indicator status-warning">Warning</span>
        </div>
      </div>

      <div className="health-item">
        <span className="health-label">RUL Estimate</span>
        <div className="health-value-row">
          <span className="health-value tabular-nums">{CURRENT_STATE.rulEstimate}</span>
        </div>
        <div className="health-sub">Conf: {CURRENT_STATE.rulConfidence}</div>
      </div>

      <div className="health-item">
        <span className="health-label">Flight Phase</span>
        <div className="health-value-row">
          <span className="health-value">{CURRENT_STATE.flightPhase}</span>
        </div>
        <div className="health-sub">Runtime: {CURRENT_STATE.runtimeHours}h</div>
      </div>
    </div>
  );
}
