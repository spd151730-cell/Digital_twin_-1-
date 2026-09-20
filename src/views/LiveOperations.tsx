import { HealthSummaryStrip } from '../components/HealthSummaryStrip';
import { AlertPanel } from '../components/AlertPanel';
import { SystemStatusPanel } from '../components/SystemStatusPanel';
import { TwinVisualization } from '../components/TwinVisualization';
import { TelemetryGroups } from '../components/TelemetryGroups';
import { TimeSeriesCharts } from '../components/TimeSeriesCharts';
import { useTelemetry } from '../contexts/TelemetryContext';
import './LiveOperations.css';

interface LiveOperationsProps {
  onViewChange?: (view: string) => void;
}

export function LiveOperations({ onViewChange }: LiveOperationsProps) {
  const { isManualOverride, lastAppliedTime } = useTelemetry();
  return (
    <div className="live-operations">
      <HealthSummaryStrip />
      
      {isManualOverride && (
        <div className="manual-override-banner">
          <span className="manual-override-label">MANUAL DEMO INPUTS</span>
          {lastAppliedTime && (
            <span className="manual-override-time">
              Last applied {new Date(lastAppliedTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' })} UTC
            </span>
          )}
        </div>
      )}
      
      <div className="main-grid">
        <div className="left-column">
          <TwinVisualization />
        </div>
        
        <div className="middle-column">
          <TelemetryGroups />
          <div className="charts-container">
            <TimeSeriesCharts />
          </div>
        </div>

        <div className="right-column">
          <AlertPanel onViewChange={onViewChange} />
          <SystemStatusPanel />
        </div>
      </div>
    </div>
  );
}
