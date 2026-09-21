import { useTelemetry } from '../contexts/TelemetryContext';
import './TelemetryGroups.css';

export function TelemetryGroups() {
  const { telemetry: latestData } = useTelemetry();

  const groups = [
    {
      title: 'Performance',
      metrics: [
        { label: 'RPM', value: latestData.rpm.toFixed(0), unit: 'rpm', status: 'normal' },
        { label: 'Engine Load', value: latestData.engineLoad.toFixed(1), unit: '%', status: 'normal' },
        { label: 'Manifold Press', value: latestData.manifoldPressure.toFixed(1), unit: 'inHg', status: 'normal' }
      ]
    },
    {
      title: 'Thermal',
      metrics: [
        { label: 'CHT', value: latestData.cht.toFixed(1), unit: '°C', status: latestData.cht > 200 ? 'critical' : latestData.cht > 185 ? 'warning' : 'normal' },
        { label: 'EGT', value: latestData.egt.toFixed(1), unit: '°C', status: latestData.egt > 850 ? 'critical' : latestData.egt > 780 ? 'warning' : 'normal' },
        { label: 'Coolant', value: latestData.coolantTemp.toFixed(1), unit: '°C', status: 'normal' },
      ]
    },
    {
      title: 'Lubrication',
      metrics: [
        { label: 'Oil Press', value: latestData.oilPressure.toFixed(1), unit: 'psi', status: latestData.oilPressure < 30 ? 'critical' : latestData.oilPressure < 45 ? 'warning' : 'normal' },
        { label: 'Oil Temp', value: latestData.oilTemp.toFixed(1), unit: '°C', status: 'normal' }
      ]
    },
    {
      title: 'Systems',
      metrics: [
        { label: 'Fuel Press', value: latestData.fuelPressure.toFixed(1), unit: 'bar', status: latestData.fuelPressure < 2.5 ? 'warning' : 'normal' },
        { label: 'Fuel Flow', value: latestData.fuelFlow.toFixed(2), unit: 'gal/hr', status: 'normal' },
        { label: 'Vibration', value: latestData.vibration.toFixed(2), unit: 'ips', status: latestData.vibration > 5.0 ? 'critical' : latestData.vibration > 3.0 ? 'warning' : 'normal' },
        { label: 'Alt Voltage', value: latestData.alternatorVoltage.toFixed(1), unit: 'V', status: 'normal' }
      ]
    }
  ];

  const groupModifiers: Record<string, string> = {
    'Performance': 'telemetry-card--performance',
    'Thermal':     'telemetry-card--thermal',
    'Lubrication': 'telemetry-card--lubrication',
    'Systems':     'telemetry-card--systems',
  };

  return (
    <div className="telemetry-groups">
      {groups.map((group, idx) => (
        <div key={idx} className={`panel telemetry-card ${groupModifiers[group.title] ?? ''}`}>
          <div className="telemetry-header">
            <span>{group.title}</span>
            <span className="badge" style={{ fontSize: '9px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>DEMO DATA</span>
          </div>
          <div className="metrics-grid">
            {group.metrics.map((metric, midx) => (
              <div key={midx} className="metric-item">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value-row">
                  <span className={`metric-value tabular-nums status-${metric.status}`}>
                    {metric.value}
                  </span>
                  <span className="metric-unit">{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
