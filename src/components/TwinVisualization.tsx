import './TwinVisualization.css';
import { RefreshCw } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export function TwinVisualization() {
  const { showToast } = useToast();

  return (
    <div className="panel twin-panel">
      <div className="twin-header">
        <h3 className="panel-title" style={{ border: 'none', margin: 0, padding: 0 }}>Digital Twin Sync</h3>
        <div className="sync-status">
          <RefreshCw size={14} className="sync-icon active" />
          <span>DEMO MODEL SYNC</span>
        </div>
      </div>
      
      <div className="schematic-container">
        {/* Placeholder for actual 3D/SVG schematic */}
        <div className="placeholder-overlay">
          <div className="placeholder-badge">3D VIEWPORT PLACEHOLDER</div>
          <div className="placeholder-desc">Replace with engine renderer / SVG twin when model feed is available</div>
          <button className="btn btn-secondary btn-sm mt-4" onClick={() => showToast('3D renderer placeholder: connect the digital-twin model here.')}>Open 3D View</button>
        </div>
        <div className="engine-schematic blurred">
          <div className="engine-core">
            <div className="engine-zone zone-propeller">Propeller Mount</div>
            <div className="engine-zone zone-crankcase">Crankcase</div>
            <div className="engine-zone zone-cylinders active-alert">
              Cylinders
              <div className="alert-ping"></div>
            </div>
            <div className="engine-zone zone-exhaust active-alert">
              Exhaust
            </div>
          </div>
        </div>
      </div>

      <div className="twin-legend">
        <div className="legend-item">
          <span className="legend-color color-normal"></span>
          <span>Normal</span>
        </div>
        <div className="legend-item">
          <span className="legend-color color-warning"></span>
          <span>Warning</span>
        </div>
      </div>
    </div>
  );
}
