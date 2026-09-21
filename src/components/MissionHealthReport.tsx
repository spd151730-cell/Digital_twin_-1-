import { DEMO_STATE } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import './MissionHealthReport.css';

export function MissionHealthReport() {
  const { showToast } = useToast();
  const { mission, health, events } = DEMO_STATE;

  const numAdvisories = events.filter(e => e.severity === 'warning').length;
  const numCritical = events.filter(e => e.severity === 'critical').length;
  const keyEvent = events[0]?.fault || 'None';

  return (
    <div className="panel mission-report-panel">
      <div className="report-header">
        <h3 className="report-title">Mission Health Report</h3>
      </div>
      
      <div className="report-grid">
        <div className="report-item">
          <span className="report-label">Mission ID</span>
          <span className="report-value">{mission.missionId}</span>
        </div>
        <div className="report-item">
          <span className="report-label">Type</span>
          <span className="report-value">{mission.missionType}</span>
        </div>
        <div className="report-item">
          <span className="report-label">Sector</span>
          <span className="report-value">{mission.sector}</span>
        </div>
        <div className="report-item">
          <span className="report-label">Date & Duration</span>
          <span className="report-value">{mission.date} ({mission.duration})</span>
        </div>
      </div>
      
      <div className="report-health-row">
        <div className="health-stat">
          <span className="stat-label">Health Start</span>
          <span className="stat-val">{health.healthStart}%</span>
        </div>
        <div className="health-stat">
          <span className="stat-label">Health End</span>
          <span className="stat-val">{health.healthEnd}%</span>
        </div>
        <div className="health-stat">
          <span className="stat-label">Advisories</span>
          <span className="stat-val warning">{numAdvisories}</span>
        </div>
        <div className="health-stat">
          <span className="stat-label">Critical</span>
          <span className="stat-val critical">{numCritical}</span>
        </div>
      </div>
      
      <div className="report-summary">
        <span className="report-label">Key Anomaly</span>
        <span className="report-value">{keyEvent}</span>
      </div>
      
      <div className="report-actions">
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => showToast('Demo: Mission report export will be integrated in future release.')}
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
