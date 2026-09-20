import './SecondaryViews.css';
import { useToast } from '../contexts/ToastContext';

interface PlaceholderProps {
  title: string;
  description: string;
}

export function ViewPlaceholder({ title, description }: PlaceholderProps) {
  return (
    <div className="view-placeholder">
      <div className="placeholder-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="placeholder-alert">
          This is a secondary view. For the prototype, the Live Operations view contains the complete implementation.
        </div>
      </div>
    </div>
  );
}

export function DiagnosisView() {
  return <ViewPlaceholder title="Diagnosis" description="Fault hypotheses, confidence, contributing parameters, and recommended actions." />;
}

export function TrendsView() {
  return <ViewPlaceholder title="Trends & RUL" description="Health history, degradation, anomaly trend, and remaining useful life." />;
}

export function ReplayView() {
  const { showToast } = useToast();
  return (
    <div className="view-placeholder">
      <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '8px' }}>Mission Replay</h2>
        <p style={{ marginBottom: '24px' }}>Historical mission playback with synchronized telemetry and event markers.</p>
        <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--bg-base)', border: '1px dashed var(--border-light)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <span className="badge" style={{ border: '1px dashed var(--text-secondary)', color: 'var(--text-secondary)', marginBottom: '8px' }}>MAP PLACEHOLDER</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mission coordinates and animated UAV marker will be connected later.</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => showToast('Replay placeholder: connect historical playback engine here.')}>Play / Pause</button>
          <button className="btn btn-secondary" onClick={() => showToast('Replay placeholder: connect historical playback engine here.')}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export function SimulationView() {
  const { showToast } = useToast();
  return (
    <div className="view-placeholder">
      <div className="placeholder-content">
        <h2>Simulation</h2>
        <p>Comparison of high-altitude, endurance, hot-weather, and throttle-transition scenarios.</p>
        <button className="btn btn-primary mt-4" onClick={() => showToast('Simulation scenario placeholder: connect scenario runner here.')}>Run Hot-Weather Scenario</button>
      </div>
    </div>
  );
}

export function HistoryView() {
  return <ViewPlaceholder title="Event History" description="Searchable fault and maintenance records." />;
}
