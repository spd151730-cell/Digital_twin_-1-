import { useState, useCallback } from 'react';
import type { TelemetryData } from '../data/mockData';
import { useTelemetry } from '../contexts/TelemetryContext';
import type { ManualChangeRecord } from '../contexts/TelemetryContext';
import { useToast } from '../contexts/ToastContext';
import { AlertTriangle, RefreshCw, Check, SlidersHorizontal } from 'lucide-react';
import './ManualControls.css';

// ─── Scenario Presets ───────────────────────────────────────────────────────

interface Preset {
  id: string;
  label: string;
  description: string;
  values: Partial<TelemetryData>;
}

const PRESETS: Preset[] = [
  {
    id: 'baseline',
    label: 'Baseline cruise',
    description: 'Healthy values matching the nominal demo mission state.',
    values: {
      cht: 180, egt: 750, coolantTemp: 90, ambientTemp: 15,
      oilPressure: 65, oilTemp: 95,
      fuelPressure: 4.5, fuelFlow: 12.5,
      manifoldPressure: 28, rpm: 4500, engineLoad: 85, vibration: 1.2,
      alternatorVoltage: 28.2, injectionTiming: 14,
    }
  },
  {
    id: 'high-thermal',
    label: 'High thermal load',
    description: 'EGT and CHT elevated; coolant rising; engine load high.',
    values: { cht: 210, egt: 880, coolantTemp: 125, engineLoad: 98 }
  },
  {
    id: 'low-oil',
    label: 'Low oil pressure',
    description: 'Oil pressure below advisory threshold; oil temperature slightly elevated.',
    values: { oilPressure: 25, oilTemp: 115 }
  },
  {
    id: 'fuel-drop',
    label: 'Fuel pressure drop',
    description: 'Fuel pressure and flow reduced; engine load unchanged.',
    values: { fuelPressure: 1.8, fuelFlow: 6.0 }
  },
  {
    id: 'high-vib',
    label: 'High vibration',
    description: 'Vibration elevated; RPM stable; minor health reduction expected.',
    values: { vibration: 8.5, rpm: 4450 }
  }
];

// ─── Control Field Spec ──────────────────────────────────────────────────────

interface FieldSpec {
  key: keyof TelemetryData;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  helper?: string;
}

interface ControlGroup {
  title: string;
  groupKey: string;
  fields: FieldSpec[];
}

const CONTROL_GROUPS: ControlGroup[] = [
  {
    title: 'Thermal', groupKey: 'thermal',
    fields: [
      { key: 'cht', label: 'CHT (Cylinder Head Temp)', unit: '°C', min: 20, max: 220, step: 1, helper: 'Advisory limit: 200°C' },
      { key: 'egt', label: 'EGT (Exhaust Gas Temp)', unit: '°C', min: 200, max: 950, step: 1, helper: 'Advisory limit: 850°C' },
      { key: 'coolantTemp', label: 'Coolant Temperature', unit: '°C', min: 20, max: 140, step: 1 },
      { key: 'ambientTemp', label: 'Ambient Temperature', unit: '°C', min: -40, max: 55, step: 1 },
    ]
  },
  {
    title: 'Lubrication', groupKey: 'lubrication',
    fields: [
      { key: 'oilPressure', label: 'Oil Pressure', unit: 'psi', min: 0, max: 120, step: 1, helper: 'Advisory limit: 30 psi (low)' },
      { key: 'oilTemp', label: 'Oil Temperature', unit: '°C', min: 20, max: 150, step: 1, helper: 'Advisory limit: 120°C' },
    ]
  },
  {
    title: 'Fuel System', groupKey: 'fuel',
    fields: [
      { key: 'fuelPressure', label: 'Fuel Pressure', unit: 'bar', min: 0, max: 8, step: 0.1, helper: 'Advisory limit: 2.5 bar (low)' },
      { key: 'fuelFlow', label: 'Fuel Flow', unit: 'gal/hr', min: 0, max: 60, step: 0.1 },
    ]
  },
  {
    title: 'Air and Performance', groupKey: 'performance',
    fields: [
      { key: 'manifoldPressure', label: 'Manifold Pressure', unit: 'inHg', min: 10, max: 40, step: 0.1 },
      { key: 'rpm', label: 'RPM', unit: 'rpm', min: 0, max: 4000, step: 10 },
      { key: 'engineLoad', label: 'Engine Load', unit: '%', min: 0, max: 110, step: 1 },
      { key: 'vibration', label: 'Vibration', unit: 'ips', min: 0, max: 20, step: 0.1, helper: 'Advisory limit: 5.0 ips' },
    ]
  },
  {
    title: 'Electrical and Injection', groupKey: 'electrical',
    fields: [
      { key: 'alternatorVoltage', label: 'Alternator Voltage', unit: 'V', min: 0, max: 32, step: 0.1 },
      { key: 'injectionTiming', label: 'Injection Timing', unit: '° BTDC', min: -10, max: 40, step: 0.5 },
    ]
  },
  {
    title: 'Mission Counters', groupKey: 'counters',
    fields: [
      { key: 'cycleCount', label: 'Engine Cycle Count', unit: 'cycles', min: 0, max: 999999, step: 1 },
      { key: 'runtimeHours', label: 'Runtime', unit: 'h', min: 0, max: 10000, step: 0.1 },
    ]
  }
];

// ─── Field Row Component ─────────────────────────────────────────────────────

function FieldRow({ spec, value, onChange }: { spec: FieldSpec; value: number; onChange: (v: number) => void }) {
  const [inputVal, setInputVal] = useState(String(value));

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    onChange(v);
    setInputVal(String(v));
  };

  const handleNumeric = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v >= spec.min && v <= spec.max) onChange(v);
  };

  const handleNumericBlur = () => {
    const v = parseFloat(inputVal);
    if (isNaN(v)) { setInputVal(String(value)); return; }
    const clamped = Math.min(spec.max, Math.max(spec.min, v));
    onChange(clamped);
    setInputVal(String(clamped));
  };

  const isOutOfBound = parseFloat(inputVal) < spec.min || parseFloat(inputVal) > spec.max;

  return (
    <div className="field-row">
      <div className="field-label-row">
        <label className="field-label">{spec.label}</label>
        <span className="field-unit">{spec.unit}</span>
      </div>
      <div className="field-controls">
        <input
          type="range"
          className="field-slider"
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={value}
          onChange={handleSlider}
          aria-label={`${spec.label} slider`}
        />
        <input
          type="number"
          className={`field-number ${isOutOfBound ? 'invalid' : ''}`}
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={inputVal}
          onChange={handleNumeric}
          onBlur={handleNumericBlur}
          aria-label={`${spec.label} value`}
        />
      </div>
      {spec.helper && <div className="field-helper">{spec.helper}</div>}
      {isOutOfBound && (
        <div className="field-error" role="alert">
          Valid range: {spec.min} – {spec.max} {spec.unit}
        </div>
      )}
    </div>
  );
}

// ─── Derived Response Panel ──────────────────────────────────────────────────

function DerivedResponsePanel() {
  const { derivedOutputs, isManualOverride, lastAppliedTime, telemetry } = useTelemetry();
  const { engineHealth, anomalyScore, twinDeviation, rulEstimate, activeFault } = derivedOutputs;

  const healthColor = engineHealth >= 80 ? 'status-normal' : engineHealth >= 50 ? 'status-warning' : 'status-critical';
  const anomalyColor = anomalyScore < 25 ? 'status-normal' : anomalyScore < 60 ? 'status-warning' : 'status-critical';

  return (
    <div className="panel derived-panel">
      <div className="panel-title">Derived demo response</div>
      <p className="derived-note">
        Derived outputs are deterministic demo logic. Replace with the anomaly, diagnosis, RUL, and XAI services later.
      </p>

      {isManualOverride && lastAppliedTime && (
        <div className="manual-active-badge">
          MANUAL DEMO INPUTS · Last applied {new Date(lastAppliedTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' })} UTC
        </div>
      )}

      <div className="derived-grid">
        <div className="derived-item">
          <div className="derived-label">Engine Health (demo estimate)</div>
          <div className={`derived-value tabular-nums ${healthColor}`}>{engineHealth}%</div>
        </div>
        <div className="derived-item">
          <div className="derived-label">Anomaly Score</div>
          <div className={`derived-value tabular-nums ${anomalyColor}`}>{anomalyScore}</div>
        </div>
        <div className="derived-item">
          <div className="derived-label">Twin Deviation</div>
          <div className="derived-value tabular-nums">{twinDeviation}%</div>
        </div>
        <div className="derived-item">
          <div className="derived-label">Estimated RUL</div>
          <div className="derived-value tabular-nums">{rulEstimate}</div>
        </div>
      </div>

      {activeFault ? (
        <div className={`derived-fault fault-${activeFault.severity}`}>
          <div className="fault-header">
            <AlertTriangle size={14} />
            <span>Demo fault hypothesis: {activeFault.hypothesis}</span>
          </div>
          <div className="fault-confidence">Estimated confidence: {activeFault.confidence}%</div>
          <ul className="fault-evidence">
            {activeFault.evidence.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          <div className="fault-action">Simulated advisory: {activeFault.recommendedAction}</div>
        </div>
      ) : (
        <div className="derived-fault fault-normal">
          <Check size={14} /> <span>No fault hypothesis generated at current demo values.</span>
        </div>
      )}

      <div className="derived-current">
        <div className="derived-label" style={{ marginBottom: '8px' }}>Current applied values (excerpt)</div>
        <div className="mini-telem">
          <span>EGT {telemetry.egt.toFixed(0)}°C</span>
          <span>CHT {telemetry.cht.toFixed(0)}°C</span>
          <span>Oil {telemetry.oilPressure.toFixed(0)} psi</span>
          <span>Vib {telemetry.vibration.toFixed(1)} ips</span>
          <span>RPM {telemetry.rpm.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Change History Panel ────────────────────────────────────────────────────

function ChangeHistoryPanel() {
  const { manualChanges } = useTelemetry();

  if (manualChanges.length === 0) {
    return (
      <div className="panel history-panel">
        <div className="panel-title">Recent manual changes</div>
        <p className="history-empty">No manual changes applied yet.</p>
      </div>
    );
  }

  return (
    <div className="panel history-panel">
      <div className="panel-title">Recent manual changes</div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Time (UTC)</th>
            <th>Group</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {manualChanges.map((c, i) => (
            <tr key={i}>
              <td className="tabular-nums">{new Date(c.time).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</td>
              <td>{c.group}</td>
              <td className="tabular-nums">{c.oldValue}</td>
              <td className="tabular-nums">{c.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main ManualControls View ────────────────────────────────────────────────

export function ManualControls() {
  const { telemetry, applyManualTelemetry, resetToBaseline } = useTelemetry();
  const { showToast } = useToast();

  const [draft, setDraft] = useState<TelemetryData>({ ...telemetry });
  const [isDirty, setIsDirty] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [presetDescription, setPresetDescription] = useState<string>('');

  const handleFieldChange = useCallback((key: keyof TelemetryData, value: number) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setActivePreset(null);
  }, []);

  const handlePreset = (preset: Preset) => {
    setDraft(prev => ({ ...prev, ...preset.values }));
    setActivePreset(preset.id);
    setPresetDescription(preset.description);
    setIsDirty(true);
  };

  const handleApply = () => {
    // Build change records grouped by group
    const changes: ManualChangeRecord[] = CONTROL_GROUPS.map(group => {
      const changedFields = group.fields.filter(f => {
        const oldVal = telemetry[f.key] as number;
        const newVal = draft[f.key] as number;
        return Math.abs(oldVal - newVal) > 0.001;
      });
      if (changedFields.length === 0) return null;
      const first = changedFields[0];
      return {
        time: new Date().toISOString(),
        group: group.title,
        oldValue: `${(telemetry[first.key] as number).toFixed(1)} ${first.unit}`,
        newValue: `${(draft[first.key] as number).toFixed(1)} ${first.unit}`,
      } as ManualChangeRecord;
    }).filter((c): c is ManualChangeRecord => c !== null);

    applyManualTelemetry(draft, changes.length > 0 ? changes : [{
      time: new Date().toISOString(),
      group: 'All',
      oldValue: 'Previous',
      newValue: activePreset ?? 'Custom'
    }]);

    setIsDirty(false);
    showToast('Manual demo inputs applied');
  };

  const handleReset = () => {
    resetToBaseline();
    setDraft({ ...telemetry });
    setIsDirty(false);
    setActivePreset(null);
    setPresetDescription('');
    showToast('Demo inputs restored to baseline');
  };

  return (
    <div className="manual-controls-view">
      {/* Header */}
      <div className="mc-header">
        <div className="mc-eyebrow">DEMO INPUTS / OPERATOR TESTING</div>
        <div className="mc-title-row">
          <SlidersHorizontal size={20} />
          <h1 className="mc-title">Manual telemetry controls</h1>
          <span className="mc-badge">MANUAL DEMO MODE</span>
        </div>
        <p className="mc-description">Adjust simulated sensor inputs and observe how the dashboard responds.</p>
        <p className="mc-warning">
          <AlertTriangle size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
          These values are local demo inputs. They do not control a real engine or aircraft.
        </p>
      </div>

      {/* Presets */}
      <div className="panel mc-presets">
        <div className="presets-label">Scenario presets — select to stage values, then click Apply</div>
        <div className="presets-row">
          {PRESETS.map(p => (
            <button
              key={p.id}
              className={`preset-btn ${activePreset === p.id ? 'active' : ''}`}
              onClick={() => handlePreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {activePreset && (
          <p className="preset-desc">{presetDescription}</p>
        )}
      </div>

      {/* Main two-column layout */}
      <div className="mc-columns">
        <div className="mc-left">
          {CONTROL_GROUPS.map(group => (
            <div key={group.groupKey} className="panel mc-group">
              <div className="panel-title">{group.title}</div>
              {group.fields.map(spec => (
                <FieldRow
                  key={String(spec.key)}
                  spec={spec}
                  value={draft[spec.key] as number}
                  onChange={v => handleFieldChange(spec.key, v)}
                />
              ))}
            </div>
          ))}

          {/* Action buttons */}
          <div className="mc-actions">
            {isDirty && <span className="unsaved-indicator">Unsaved changes</span>}
            <button className="btn btn-secondary" onClick={handleReset}>
              <RefreshCw size={14} /> Reset defaults
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              <Check size={14} /> Apply changes
            </button>
          </div>
        </div>

        <div className="mc-right">
          <DerivedResponsePanel />
          <ChangeHistoryPanel />
        </div>
      </div>
    </div>
  );
}
