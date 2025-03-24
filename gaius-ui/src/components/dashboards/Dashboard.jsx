import { useState, useEffect } from "react";
import ThreatMonitor from "../monitoring/ThreatMonitor";
import DefenseStatus from "./DefenseStatus";
import ActionCenter from "../ActionCenter";
import WebSocketManager from "../communication/WebSocketManager";
import { fetchStatus } from "../../api/api";
import GaiusChat from "../communication/GaiusChat";
import { motion } from "framer-motion";
import { RadarChart, ThreatTimeline, RiskHeatmap } from "./charts";
import { HexagonBackground } from "./effects";

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
    <div className="min-h-screen bg-black text-cyan-400">
      <HexagonBackground />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 p-8"
      >
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-rem bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              GAIUS DEFENSE MATRIX
            </h1>
            <p className="text-cyan-600">Advanced Cybersecurity Command Interface</p>
          </div>
          <div className="flex items-center gap-4">
            <SystemStatus />
            <TimeDisplay />
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <motion.div 
            className="col-span-8"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <ThreatTimeline data={dashboardData.charts.threat_timeline} />
          </motion.div>
          
          <motion.div 
            className="col-span-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <RadarChart data={dashboardData.charts.defense_radar} />
          </motion.div>

          <motion.div 
            className="col-span-6"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <RiskHeatmap data={dashboardData.charts.risk_heatmap} />
          </motion.div>

          <motion.div 
            className="col-span-6"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <GaiusChat />
          </motion.div>
        </div>

        <motion.div 
          className="fixed bottom-8 right-8"
          whileHover={{ scale: 1.05 }}
        >
          <ActionCenter data={dashboardData.gaius_insights} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;