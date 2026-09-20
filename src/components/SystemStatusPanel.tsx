import { SYSTEM_STATUS } from '../data/mockData';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import './SystemStatusPanel.css';

export function SystemStatusPanel() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'synchronized':
      case 'online':
        return <CheckCircle2 size={14} className="status-icon good" />;
      case 'deviating':
      case 'stale':
        return <AlertCircle size={14} className="status-icon warn" />;
      default:
        return <XCircle size={14} className="status-icon bad" />;
    }
  };

  return (
    <div className="panel status-panel">
      <h3 className="panel-title">System Status</h3>
      <div className="status-list">
        
        <div className="status-row">
          <span className="status-label">Telemetry Stream</span>
          <div className="status-value-group">
            {getStatusIcon(SYSTEM_STATUS.telemetry)}
            <span className="status-value">{SYSTEM_STATUS.telemetry}</span>
          </div>
        </div>
        
        <div className="status-row">
          <span className="status-label">Twin Synchronization</span>
          <div className="status-value-group">
            {getStatusIcon(SYSTEM_STATUS.twinSync)}
            <span className="status-value">{SYSTEM_STATUS.twinSync}</span>
          </div>
        </div>

        <div className="status-row">
          <span className="status-label">Anomaly Engine</span>
          <div className="status-value-group">
            {getStatusIcon(SYSTEM_STATUS.anomalyEngine)}
            <span className="status-value">{SYSTEM_STATUS.anomalyEngine}</span>
          </div>
        </div>

        <div className="status-row">
          <span className="status-label">Diagnosis Model</span>
          <div className="status-value-group">
            {getStatusIcon(SYSTEM_STATUS.mlModel)}
            <span className="status-value">{SYSTEM_STATUS.mlModel}</span>
          </div>
        </div>

        <div className="status-row">
          <span className="status-label">WebSocket Connection</span>
          <div className="status-value-group">
            {getStatusIcon(SYSTEM_STATUS.webSocket)}
            <span className="status-value">{SYSTEM_STATUS.webSocket}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
