import { useState, useEffect } from "react";
import { ThreatMonitor, ThreatTimeline, ThreatAnalysis } from '../monitoring';
import { DefenseStatus } from "./";
import { ActionCenter, WebSocketManager, GaiusChat } from "../communication";
import { fetchStatus } from "../../api/api";
import { motion } from "framer-motion";
import { RadarChart, RiskHeatmap, TimeDisplay } from "../charts";
import { HexagonBackground } from "../layouts";
import { SystemStatus } from "../system";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    threat_landscape: {},
    defense_status: {},
    gaius_insights: {},
    charts: {
      threat_timeline: {},
      defense_radar: {},
      risk_heatmap: {}
    }
  });

  // Initial fetch from /status
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchStatus();
      setDashboardData({
        threat_landscape: data.active_threats,
        defense_status: data.current_posture.defense_capabilities,
        gaius_insights: data.gaius_recommendations,
        charts: {
          threat_timeline: data.threat_timeline || {},
          defense_radar: data.defense_radar || {},
          risk_heatmap: data.risk_heatmap || {}
        }
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
        
        className="relative z-10 p-8 pl-28"  
      >
        <header className="flex justify-between items-center mb-8 mt-16"> 
          <div>
            <h1 className="text-6xl font-rem bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
              GAIUS DEFENSE MATRIX
            </h1>
            <p className="text-cyan-600 text-lg mt-2">Advanced Cybersecurity Command Interface</p>
          </div>
          <div className="flex items-center gap-6">
            <SystemStatus />
            <TimeDisplay />
          </div>
        </header>

        
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-12 gap-8"> 
            <motion.div 
              className="col-span-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ThreatTimeline data={dashboardData.charts.threat_timeline} />
            </motion.div>
            
            <motion.div 
              className="col-span-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RadarChart data={dashboardData.charts.defense_radar} />
            </motion.div>

            <motion.div 
              className="col-span-5" // Changed from 6
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RiskHeatmap data={dashboardData.charts.risk_heatmap} />
            </motion.div>

            <motion.div 
              className="col-span-7" // Changed from 6
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GaiusChat />
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="fixed bottom-8 right-8 z-50" 
          whileHover={{ scale: 1.05 }}
        >
          <ActionCenter data={dashboardData.gaius_insights} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;