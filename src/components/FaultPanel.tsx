import { useState } from 'react';
import { ACTIVE_ALERT, DEMO_STATE } from '../data/mockData';
import { AlertTriangle, Info, Check } from 'lucide-react';
import { useTelemetry } from '../contexts/TelemetryContext';
import { useToast } from '../contexts/ToastContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea
} from 'recharts';
import './FaultPanel.css';

interface FaultPanelProps {
  onViewChange?: (view: string) => void;
}

export function FaultPanel({ onViewChange }: FaultPanelProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const { showToast } = useToast();
  const { telemetryHistory, derivedOutputs } = useTelemetry();
  
  // Data for the trend chart
  const data = [...telemetryHistory].reverse().slice(-60);
  
  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="fault-chart-tooltip">
          <p className="tooltip-time">{formatTime(label)} UTC</p>
          <p style={{ color: payload[0].color }}>Score: {payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  const alert = DEMO_STATE.diagnosis.alerts[0]; // Maintenance advisory

  // If no active faults and no maintenance, we show a clean state
  if ((!ACTIVE_ALERT || acknowledged) && !alert && !derivedOutputs.activeFault) {
    return (
      <div className="panel fault-panel empty-fault">
        <Check className="icon-empty" size={24} />
        <div className="empty-title">All Systems Nominal</div>
        <div className="empty-sub">No faults or maintenance advisories active.</div>
      </div>
    );
  }

  const isCritical = ACTIVE_ALERT && ACTIVE_ALERT.severity === 'critical';

  return (
    <div className={`panel fault-panel ${isCritical ? 'critical' : 'warning'}`}>
      
      {/* 1. Alert Section */}
      {ACTIVE_ALERT && !acknowledged ? (
        <div className="fault-section alert-section">
          <div className="alert-header">
            <div className="alert-title-row">
              <AlertTriangle size={20} className="alert-icon" />
              <h3 className="alert-title">{ACTIVE_ALERT.hypothesis}</h3>
            </div>
            <div className="alert-time tabular-nums">{new Date(ACTIVE_ALERT.detectionTime).toLocaleTimeString('en-GB', {timeZone: 'UTC'})} UTC</div>
          </div>

          <div className="alert-body">
            <div className="alert-info-row">
              <span className="label">Confidence:</span>
              <span className="value tabular-nums">{ACTIVE_ALERT.confidence}%</span>
            </div>
            
            <div className="alert-info-row action-row">
              <span className="label">Action:</span>
              <span className="value">{ACTIVE_ALERT.recommendedAction}</span>
            </div>
          </div>

          <div className="alert-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setAcknowledged(true)}>Acknowledge</button>
            <button className="btn btn-primary btn-sm" onClick={() => onViewChange && onViewChange('diagnosis')}>Diagnosis</button>
          </div>
        </div>
      ) : (
        <div className="fault-section alert-section empty-alert">
           <Check size={20} className="icon-empty" />
           <span>No Active Alerts</span>
        </div>
      )}

      {/* 2. Maintenance Advisory Section */}
      {alert ? (
        <div className="fault-section maintenance-section">
          <div className="maint-header">
            <h3 className="maint-title">Maintenance Advisory</h3>
            <span className="maint-priority badge-priority">{alert.priority}</span>
          </div>
          
          <div className="maint-body">
             <div className="maint-row">
              <span className="maint-label">Action</span>
              <span className="maint-value action-value">{alert.recommendedAction}</span>
            </div>
            <div className="maint-row">
              <span className="maint-label">Timing</span>
              <span className="maint-value timing-value">{alert.timing}</span>
            </div>
          </div>

          <div className="maint-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => showToast('Demo: Added to maintenance worklist.')}
            >
              Add to Worklist
            </button>
          </div>
        </div>
      ) : (
         <div className="fault-section maintenance-section empty-alert">
           <Info size={20} className="icon-empty" />
           <span>No Advisories</span>
         </div>
      )}

      {/* 3. Fault Trend Chart Section */}
      <div className="fault-section trend-section">
        <h4 className="trend-title">Health Index Trend</h4>
        <div className="trend-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3b52" vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={10} minTickGap={20} />
              <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceArea x1={data[50]?.time} x2={data[59]?.time} fill="rgba(245, 158, 11, 0.1)" />
              <Line type="monotone" dataKey="anomalyScore" name="Score" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
