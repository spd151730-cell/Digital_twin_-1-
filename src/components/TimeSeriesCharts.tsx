import { useState } from 'react';
import { useTelemetry } from '../contexts/TelemetryContext';
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
import './TimeSeriesCharts.css';

export function TimeSeriesCharts() {
  const [timeRange, setTimeRange] = useState('1h');
  const { telemetryHistory } = useTelemetry();
  const allData = [...telemetryHistory].reverse(); // oldest to newest for charts
  const data = timeRange === '1h' ? allData.slice(-60) : allData;

  // Format time for X axis (just HH:MM)
  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-time">{formatTime(label)} UTC</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="time-series-charts">
      <div className="charts-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 className="panel-title" style={{ border: 'none', margin: 0, padding: 0 }}>Telemetry Trends (Last 60m)</h3>
          <span className="badge" style={{ border: '1px dashed var(--text-secondary)', color: 'var(--text-secondary)' }}>LIVE SERIES TODO</span>
          <span className="badge demo-badge">DEMO DATA</span>
        </div>
        <div className="chart-controls">
          <button className={`control-btn ${timeRange === '1h' ? 'active' : ''}`} onClick={() => setTimeRange('1h')}>1H</button>
          <button className={`control-btn ${timeRange === '6h' ? 'active' : ''}`} onClick={() => setTimeRange('6h')}>6H</button>
          <button className={`control-btn ${timeRange === 'mission' ? 'active' : ''}`} onClick={() => setTimeRange('mission')}>MISSION</button>
        </div>
      </div>

      <div className="charts-grid">
        {/* Thermal Chart (CHT/EGT) */}
        <div className="chart-box relative-container">
          <h4 className="chart-title">Exhaust Gas Temp (°C) - Live Series TODO</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3b52" vertical={false} />
                <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={11} minTickGap={20} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="plainline" iconSize={12} wrapperStyle={{ fontSize: '11px' }} />
                
                {/* Highlight abnormal area at the end */}
                <ReferenceArea x1={data[50]?.time} x2={data[59]?.time} fill="rgba(245, 158, 11, 0.1)" />
                
                <Line type="monotone" dataKey="egt" name="Demo EGT" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="cht" name="Demo CHT" stroke="#818cf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Chart (RPM & Load) */}
        <div className="chart-box">
          <div className="chart-title">Performance (RPM & Load %)</div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3b52" vertical={false} />
                <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={11} minTickGap={20} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} domain={[4000, 5000]} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="plainline" iconSize={12} wrapperStyle={{ fontSize: '11px' }} />
                
                <Line yAxisId="left" type="monotone" dataKey="rpm" name="RPM" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="engineLoad" name="Load %" stroke="#c084fc" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Score Chart */}
        <div className="chart-box relative-container">
          <h4 className="chart-title">Health Index Trend (Demo Baseline)</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3b52" vertical={false} />
                <XAxis dataKey="time" tickFormatter={formatTime} stroke="#94a3b8" fontSize={11} minTickGap={20} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="plainline" iconSize={12} wrapperStyle={{ fontSize: '11px' }} />
                
                <ReferenceArea x1={data[50]?.time} x2={data[59]?.time} fill="rgba(245, 158, 11, 0.1)" />
                <Line type="monotone" dataKey="anomalyScore" name="Score" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
