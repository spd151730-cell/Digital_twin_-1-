import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopMissionBar } from './TopMissionBar';
import './AppShell.css';

interface AppShellProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function AppShell({ children, currentView, onViewChange }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <div className="main-content">
        <TopMissionBar currentView={currentView} onViewChange={onViewChange} />
        <main className="view-container">
          {children}
        </main>
      </div>
    </div>
  );
}
