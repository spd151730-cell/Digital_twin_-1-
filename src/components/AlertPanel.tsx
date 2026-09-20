import { useState } from 'react';
import { ACTIVE_ALERT } from '../data/mockData';
import { AlertTriangle, Info } from 'lucide-react';
import './AlertPanel.css';

interface AlertPanelProps {
  onViewChange?: (view: string) => void;
}

export function AlertPanel({ onViewChange }: AlertPanelProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!ACTIVE_ALERT || acknowledged) {
    return (
      <div className="panel alert-panel empty-alert">
        <Info className="icon-empty" size={24} />
        <div className="empty-title">No Active Alerts</div>
        <div className="empty-sub">System operating nominally</div>
      </div>
    );
  }

  const isCritical = ACTIVE_ALERT.severity === 'critical';

  return (
    <div className={`panel alert-panel ${isCritical ? 'critical' : 'warning'}`}>
      <div className="alert-header">
        <div className="alert-title-row">
          <AlertTriangle size={20} className="alert-icon" />
          <h3 className="alert-title">{ACTIVE_ALERT.hypothesis}</h3>
        </div>
        <div className="alert-time tabular-nums">{new Date(ACTIVE_ALERT.detectionTime).toLocaleTimeString('en-GB', {timeZone: 'UTC'})} UTC</div>
      </div>

      <div className="alert-confidence">
        <span className="label">Confidence:</span>
        <span className="value tabular-nums">{ACTIVE_ALERT.confidence}%</span>
      </div>

      <div className="alert-section">
        <div className="section-title">Primary Evidence</div>
        <ul className="evidence-list">
          {ACTIVE_ALERT.evidence.map((ev, i) => (
            <li key={i}>{ev}</li>
          ))}
        </ul>
      </div>

      <div className="alert-section action-section">
        <div className="section-title">Recommended Action</div>
        <p className="action-text">{ACTIVE_ALERT.recommendedAction}</p>
        <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
          Note: This is an advisory prediction from simulated telemetry, not a confirmed mechanical diagnosis.
        </p>
      </div>
      
      <div className="alert-actions">
        <button className="btn btn-secondary" onClick={() => setAcknowledged(true)}>Acknowledge</button>
        <button className="btn btn-primary" onClick={() => onViewChange && onViewChange('diagnosis')}>View Diagnosis</button>
      </div>
    </div>
  );
}
