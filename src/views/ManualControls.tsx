import React, { useState, useCallback } from 'react';
import type { TelemetryData } from '../data/mockData';
import { useTelemetry, type ManualChangeRecord } from '../contexts/TelemetryContext';
import { useToast } from '../contexts/ToastContext';
import { RefreshCw, Check, SlidersHorizontal, ChevronRight, ChevronDown } from 'lucide-react';
import './ManualControls.css';
import './ManualControlsSidePanel.css';


// ─── Scenario Presets ───────────────────────────────────────────────────────
interface Preset {
  id: string;
  label: string;
  description: string;
  values: Partial<TelemetryData>;
}

const PRESETS: Preset[] = [
  { id: 'baseline', label: 'Baseline', description: 'Nominal cruise', values: { cht: 180, egt: 750, coolantTemp: 90, ambientTemp: 15, oilPressure: 65, oilTemp: 95, fuelPressure: 4.5, fuelFlow: 12.5, manifoldPressure: 28, rpm: 4500, engineLoad: 85, vibration: 1.2 } },
  { id: 'high-thermal', label: 'Overheating', description: 'High thermal load', values: { cht: 210, egt: 880, coolantTemp: 125, engineLoad: 98 } },
  { id: 'low-oil', label: 'Low Oil', description: 'Low oil pressure', values: { oilPressure: 25, oilTemp: 115 } },
  { id: 'fuel-drop', label: 'Fuel Drop', description: 'Fuel pressure drop', values: { fuelPressure: 1.8, fuelFlow: 6.0 } },
  { id: 'high-vib', label: 'High Vib', description: 'High vibration', values: { vibration: 8.5, rpm: 4450 } }
];

// ─── Control Field Spec ──────────────────────────────────────────────────────
interface FieldSpec {
  key: keyof TelemetryData;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
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
      { key: 'cht', label: 'CHT', unit: '°C', min: 20, max: 220, step: 1 },
      { key: 'egt', label: 'EGT', unit: '°C', min: 200, max: 950, step: 1 },
      { key: 'coolantTemp', label: 'Coolant', unit: '°C', min: 20, max: 140, step: 1 },
      { key: 'ambientTemp', label: 'Ambient', unit: '°C', min: -40, max: 55, step: 1 },
    ]
  },
  {
    title: 'Lubrication', groupKey: 'lubrication',
    fields: [
      { key: 'oilPressure', label: 'Oil Press', unit: 'psi', min: 0, max: 120, step: 1 },
      { key: 'oilTemp', label: 'Oil Temp', unit: '°C', min: 20, max: 150, step: 1 },
    ]
  },
  {
    title: 'Fuel', groupKey: 'fuel',
    fields: [
      { key: 'fuelPressure', label: 'Fuel Press', unit: 'bar', min: 0, max: 8, step: 0.1 },
      { key: 'fuelFlow', label: 'Fuel Flow', unit: 'gal/hr', min: 0, max: 60, step: 0.1 },
    ]
  },
  {
    title: 'Performance', groupKey: 'performance',
    fields: [
      { key: 'manifoldPressure', label: 'Manifold', unit: 'inHg', min: 10, max: 40, step: 0.1 },
      { key: 'rpm', label: 'RPM', unit: 'rpm', min: 0, max: 4000, step: 10 },
      { key: 'engineLoad', label: 'Load', unit: '%', min: 0, max: 110, step: 1 },
      { key: 'vibration', label: 'Vibration', unit: 'ips', min: 0, max: 20, step: 0.1 },
    ]
  },
];

// ─── Fader Field Component (Horizontal Layout for Side Panel) ─────────────
function CompactFaderField({ spec, value, onChange }: { spec: FieldSpec; value: number; onChange: (v: number) => void }) {
  const [inputVal, setInputVal] = useState(String(value));

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    onChange(v);
    setInputVal(String(v));
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
    <div className="compact-fader-row">
      <div className="compact-fader-labels">
        <span className="compact-fader-name">{spec.label}</span>
        <span className="compact-fader-unit">{spec.unit}</span>
      </div>
      
      <div className="compact-fader-slider-container">
        <input
          type="range"
          className="compact-fader-slider"
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={value}
          onChange={handleSlider}
          aria-label={`${spec.label} slider`}
        />
      </div>

      <input
        type="number"
        className={`compact-fader-input ${isOutOfBound ? 'invalid' : ''}`}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={handleNumericBlur}
        aria-label={`${spec.label} value`}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export function ManualControls() {
  const { telemetry, applyManualTelemetry, resetToBaseline, isManualOverride } = useTelemetry();
  const { showToast } = useToast();

  const [draft, setDraft] = useState<TelemetryData>({ ...telemetry });
  const [isDirty, setIsDirty] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    thermal: true,
    lubrication: true,
    fuel: false,
    performance: true
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFieldChange = useCallback((key: keyof TelemetryData, value: number) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setActivePreset(null);
  }, []);

  const handlePreset = (preset: Preset) => {
    setDraft((prev) => ({ ...prev, ...preset.values }));
    setActivePreset(preset.id);
    setIsDirty(true);
  };

  const handleApply = () => {
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
    showToast('Demo inputs restored to baseline');
  };

  return (
    <div className="manual-controls-sidepanel">
      <header className="sidepanel-header">
        <div className="eyebrow">OPERATOR INPUTS</div>
        <div className="sidepanel-title-row">
          <h2 className="sidepanel-title">
            <SlidersHorizontal size={18} />
            Manual controls
          </h2>
          <span className={`status-badge ${isManualOverride ? 'active' : ''}`}>DEMO MODE</span>
        </div>
        <p className="sidepanel-desc">Adjust simulated engine inputs and observe the response.</p>
        
        <div className="sidepanel-actions">
          {isDirty && <span className="unsaved-indicator">Unsaved</span>}
          <button className="btn btn-secondary btn-sm flex-1" onClick={handleReset}>
            <RefreshCw size={14} /> Reset
          </button>
          <button className="btn btn-primary btn-sm flex-1" onClick={handleApply}>
            <Check size={14} /> Apply
          </button>
        </div>
        
        <div className="presets-compact">
          {PRESETS.map(p => (
            <button
              key={p.id}
              className={`preset-btn-compact ${activePreset === p.id ? 'active' : ''}`}
              onClick={() => handlePreset(p)}
              title={p.description}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>

      <div className="sidepanel-body">
        <div className="fader-groups-vertical">
          {CONTROL_GROUPS.map(group => {
            const isExpanded = expandedGroups[group.groupKey];
            return (
              <div key={group.groupKey} className="fader-group-v">
                <button 
                  className="fader-group-v-title"
                  onClick={() => toggleGroup(group.groupKey)}
                >
                  {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                  {group.title}
                </button>
                {isExpanded && (
                  <div className="fader-group-v-tracks">
                    {group.fields.map(spec => (
                      <CompactFaderField
                        key={String(spec.key)}
                        spec={spec}
                        value={draft[spec.key] as number}
                        onChange={v => handleFieldChange(spec.key, v)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
