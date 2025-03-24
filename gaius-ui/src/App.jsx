import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/layouts';
import { Dashboard } from './components/dashboards';
import { DefenseMatrix } from './components/dashboards';
import { ThreatAnalysis } from './components/monitoring';
import { CommandCenter } from './components/communication';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/defense" element={<DefenseMatrix />} />
          <Route path="/threats" element={<ThreatAnalysis />} />
          <Route path="/command" element={<CommandCenter />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
