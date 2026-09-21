import type { ReactNode } from 'react';
import { TopNavigation } from './TopNavigation';
import { ManualControls } from '../views/ManualControls';
import './AppShell.css';

interface AppShellProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function AppShell({ children, currentView, onViewChange }: AppShellProps) {
  const showSidebar = currentView === 'live';

  return (
    <div className="app-shell">
      <TopNavigation currentView={currentView} onViewChange={onViewChange} />
      <div className={`app-body ${showSidebar ? 'with-sidebar' : ''}`}>
        {showSidebar && (
          <aside className="app-sidebar">
            <ManualControls />
          </aside>
        )}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
