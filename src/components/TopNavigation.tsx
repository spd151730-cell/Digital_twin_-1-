import { CURRENT_STATE } from '../data/mockData';
import { Settings, User, Activity, Search, LineChart, PlayCircle, Cpu, History } from 'lucide-react';
import './TopNavigation.css';

interface TopNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const NAV_ITEMS = [
  { id: 'live', label: 'Live', icon: Activity, tooltip: 'Live operations' },
  { id: 'diagnosis', label: 'Diagnosis', icon: Search, tooltip: 'Fault diagnosis' },
  { id: 'trends', label: 'Trends', icon: LineChart, tooltip: 'Trends & RUL' },
  { id: 'replay', label: 'Replay', icon: PlayCircle, tooltip: 'Mission replay' },
  { id: 'simulation', label: 'Simulation', icon: Cpu, tooltip: 'Simulation' },
  { id: 'history', label: 'History', icon: History, tooltip: 'Event history' },
];

export function TopNavigation({ currentView, onViewChange }: TopNavigationProps) {
  const mode = ['replay', 'simulation'].includes(currentView) ? currentView : 'live';

  return (
    <header className="top-navigation">
      <div className="nav-brand">
        <div className="brand-logo">DT</div>
        <div className="brand-text">AeroTwin</div>
      </div>

      <nav className="nav-links">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
              title={item.tooltip}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="nav-controls">
        <div className="badge demo-badge" title="SIMULATED INPUTS">SIMULATED</div>
        
        <div className="mode-switch">
          <button className={`mode-btn ${mode === 'live' ? 'active' : ''}`} onClick={() => onViewChange('live')}>Live</button>
          <button className={`mode-btn ${mode === 'replay' ? 'active' : ''}`} onClick={() => onViewChange('replay')}>Replay</button>
          <button className={`mode-btn ${mode === 'simulation' ? 'active' : ''}`} onClick={() => onViewChange('simulation')}>Sim</button>
        </div>

        <div className="timestamp tabular-nums">{CURRENT_STATE.utcTimestamp}</div>

        <div className="nav-actions">
          <button className="icon-button" aria-label="Settings"><Settings size={18} /></button>
          <button className="icon-button" aria-label="User Profile"><User size={18} /></button>
        </div>
      </div>
    </header>
  );
}
