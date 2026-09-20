import { CURRENT_STATE } from '../data/mockData';
import { Settings, User } from 'lucide-react';
import './TopMissionBar.css';

interface TopMissionBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function TopMissionBar({ currentView, onViewChange }: TopMissionBarProps) {
  // Map our view ID to a high level "mode" for the top bar switch
  const mode = ['replay', 'simulation'].includes(currentView) ? currentView : 'live';

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="badge demo-badge">SIMULATED INPUTS</div>
        
        <div className="mode-switch">
          <button className={`mode-btn ${mode === 'live' ? 'active' : ''}`} onClick={() => onViewChange('live')}>Live</button>
          <button className={`mode-btn ${mode === 'replay' ? 'active' : ''}`} onClick={() => onViewChange('replay')}>Replay</button>
          <button className={`mode-btn ${mode === 'simulation' ? 'active' : ''}`} onClick={() => onViewChange('simulation')}>Simulation</button>
        </div>

        <div className="mission-context">
          <span className="label">Mission:</span>
          <span className="value">{CURRENT_STATE.mission}</span>
          <span className="separator">/</span>
          <span className="label">UAV:</span>
          <span className="value tabular-nums">{CURRENT_STATE.uavId}</span>
          <span className="separator">/</span>
          <span className="label">Engine:</span>
          <span className="value tabular-nums">{CURRENT_STATE.engineId}</span>
        </div>
      </div>
      
      <div className="top-bar-right">
        <div className="timestamp tabular-nums">{CURRENT_STATE.utcTimestamp}</div>
        <div className="actions">
          <button className="icon-button" aria-label="Settings"><Settings size={18} /></button>
          <button className="icon-button" aria-label="User Profile"><User size={18} /></button>
        </div>
      </div>
    </header>
  );
}
