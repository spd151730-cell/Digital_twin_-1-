import { DEMO_STATE } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import './MaintenanceAdvisory.css';

export function MaintenanceAdvisory() {
  const { showToast } = useToast();
  const alert = DEMO_STATE.diagnosis.alerts[0]; // For demo, use the first alert

  if (!alert) return null;

  return (
    <div className="panel advisory-panel">
      <div className="advisory-header">
        <h3 className="advisory-title">Maintenance Advisory</h3>
        <span className="advisory-priority badge-priority">{alert.priority}</span>
      </div>
      
      <div className="advisory-content">
        <div className="advisory-row">
          <span className="advisory-label">Action</span>
          <span className="advisory-value action-value">{alert.recommendedAction}</span>
        </div>
        <div className="advisory-row">
          <span className="advisory-label">Reason</span>
          <span className="advisory-value">{alert.reason}</span>
        </div>
        <div className="advisory-row">
          <span className="advisory-label">Evidence</span>
          <span className="advisory-value">
            <ul className="advisory-list">
              {alert.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
            </ul>
          </span>
        </div>
        <div className="advisory-row">
          <span className="advisory-label">Timing</span>
          <span className="advisory-value timing-value">{alert.timing}</span>
        </div>
      </div>
      
      <div className="advisory-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => showToast('Demo: Added to maintenance worklist.')}
        >
          Add to Worklist
        </button>
      </div>
    </div>
  );
}
