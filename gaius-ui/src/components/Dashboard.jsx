import { useState, useEffect } from "react";
import ThreatMonitor from "./ThreatMonitor";
import DefenseStatus from "./DefenseStatus";
import ActionCenter from "./ActionCenter";
import WebSocketManager from "./WebSocketManager";
import { fetchStatus } from "../api/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    threat_landscape: {},
    defense_status: {},
    gaius_insights: {},
  });

  // Initial fetch from /status
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchStatus();
      setDashboardData({
        threat_landscape: data.active_threats,
        defense_status: data.current_posture.defense_capabilities,
        gaius_insights: data.gaius_recommendations,
      });
    };
    loadInitialData();
  }, []);

  // Handle WebSocket updates
  const handleWebSocketUpdate = (data) => {
    setDashboardData(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Gaius Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ThreatMonitor data={dashboardData.threat_landscape} />
        <DefenseStatus data={dashboardData.defense_status} />
        <ActionCenter data={dashboardData.gaius_insights} />
      </div>
      <WebSocketManager onUpdate={handleWebSocketUpdate} />
    </div>
  );
};

export default Dashboard;