import { DEMO_STATE } from '../data/mockData';
import './ArchitecturePanel.css';

export function ArchitecturePanel() {
  const { pipeline } = DEMO_STATE;

  return (
    <div className="panel architecture-panel">
      <div className="arch-header">
        <h3 className="arch-title">Digital-Twin Architecture Readiness</h3>
        <span className="arch-subtitle">Demonstrator Pipeline Status</span>
      </div>
      
      <div className="arch-pipeline">
        <div className="arch-flow">
          <span className="arch-node">Telemetry Source</span>
          <span className="arch-arrow">→</span>
          <span className="arch-node">Preprocessing</span>
          <span className="arch-arrow">→</span>
          <span className="arch-node">Digital Twin Model</span>
          <span className="arch-arrow">→</span>
          <span className="arch-node">Anomaly Detection</span>
          <span className="arch-arrow">→</span>
          <span className="arch-node">Fault Diagnosis</span>
          <span className="arch-arrow">→</span>
          <span className="arch-node">RUL / XAI</span>
          <span className="arch-arrow">→</span>
          <span className="arch-node">Operator Visualization</span>
        </div>
      </div>
      
      <div className="arch-status-list">
        {pipeline.map((item, i) => (
          <div className="arch-status-row" key={i}>
            <span className="arch-component">{item.component}</span>
            <span className={`arch-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
