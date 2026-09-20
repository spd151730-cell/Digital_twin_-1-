import { useState } from 'react';
import { AppShell } from './components/AppShell';
import { LiveOperations } from './views/LiveOperations';
import { DiagnosisView, TrendsView, ReplayView, SimulationView, HistoryView } from './views/SecondaryViews';
import { ManualControls } from './views/ManualControls';
import { ToastProvider } from './contexts/ToastContext';
import { TelemetryProvider } from './contexts/TelemetryContext';

function App() {
  const [currentView, setCurrentView] = useState('live');

  return (
    <ToastProvider>
      <TelemetryProvider>
        <AppShell currentView={currentView} onViewChange={setCurrentView}>
          {currentView === 'live' && <LiveOperations onViewChange={setCurrentView} />}
          {currentView === 'diagnosis' && <DiagnosisView />}
          {currentView === 'trends' && <TrendsView />}
          {currentView === 'replay' && <ReplayView />}
          {currentView === 'simulation' && <SimulationView />}
          {currentView === 'manual' && <ManualControls />}
          {currentView === 'history' && <HistoryView />}
        </AppShell>
      </TelemetryProvider>
    </ToastProvider>
  );
}

export default App;
