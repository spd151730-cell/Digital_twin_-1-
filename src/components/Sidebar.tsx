import { Activity, Search, LineChart, PlayCircle, Cpu, History, SlidersHorizontal } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const VIEWS = [
  { id: 'live', label: 'Live Operations', icon: Activity },
  { id: 'diagnosis', label: 'Diagnosis', icon: Search },
  { id: 'trends', label: 'Trends & RUL', icon: LineChart },
  { id: 'replay', label: 'Mission Replay', icon: PlayCircle },
  { id: 'simulation', label: 'Simulation', icon: Cpu },
  { id: 'manual', label: 'Manual controls', icon: SlidersHorizontal },
  { id: 'history', label: 'Event History', icon: History },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="brand">
        <div className="brand-logo">DT</div>
        <div className="brand-text">AeroTwin</div>
      </div>
      <ul className="nav-list">
        {VIEWS.map(view => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          return (
            <li key={view.id}>
              <button 
                className={`nav-button ${isActive ? 'active' : ''}`}
                onClick={() => onViewChange(view.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{view.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="sidebar-footer">
        <div className="version">v2.4.0</div>
      </div>
    </nav>
  );
}
