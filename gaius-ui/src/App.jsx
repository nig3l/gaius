import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import DefenseMatrix from "./components/DefenseMatrix";
import ThreatAnalysis from "./components/ThreatAnalysis";
import CommandCenter from "./components/CommandCenter";

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
