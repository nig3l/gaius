import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchStatus } from "../../api/api";
import ThreatMonitor from './ThreatMonitor';
import WebSocketManager from '../communication/WebSocketManager';

const ThreatAnalysis = () => {
  const [threatData, setThreatData] = useState({
    threat_landscape: {},
    recent_incidents: [],
    threat_intelligence: {}
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStatus();
      setThreatData({
        threat_landscape: data.active_threats,
        recent_incidents: data.recent_incidents || [],
        threat_intelligence: data.threat_intelligence || {}
      });
    };
    loadData();
  }, []);

  const handleWebSocketUpdate = (data) => {
    if (data.threat_landscape) {
      setThreatData(prev => ({
        ...prev,
        threat_landscape: data.threat_landscape,
        recent_incidents: data.recent_incidents || prev.recent_incidents,
        threat_intelligence: data.threat_intelligence || prev.threat_intelligence
      }));
    }
  };

  return (
    <div className="pt-20 pl-24 pr-6 pb-6 min-h-screen bg-black text-cyan-400">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-rem bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Threat Analysis
        </h1>
        <p className="text-cyan-600">Active threats and intelligence reports</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        <motion.div 
          className="col-span-7"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <ThreatMonitor data={threatData.threat_landscape} />
        </motion.div>

        <motion.div 
          className="col-span-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 h-full">
            <h2 className="text-xl font-rem text-cyan-400 mb-6">Recent Security Incidents</h2>
            <div className="space-y-4 max-h-[500px] overflow-auto pr-2">
              {threatData.recent_incidents.map((incident, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white">{incident.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      incident.severity === 'high' ? 'bg-red-900/30 text-red-400' :
                      incident.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-green-900/30 text-green-400'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{incident.description}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(incident.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <WebSocketManager onUpdate={handleWebSocketUpdate} />
    </div>
  );
};

export default ThreatAnalysis;
