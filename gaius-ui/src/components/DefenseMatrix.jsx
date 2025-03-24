import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchStatus } from "../api/api";
import DefenseStatus from './DefenseStatus';
import WebSocketManager from './WebSocketManager';

const DefenseMatrix = () => {
  const [defenseData, setDefenseData] = useState({
    defense_status: {},
    defense_systems: [],
    vulnerability_assessment: {}
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStatus();
      setDefenseData({
        defense_status: data.current_posture.defense_capabilities,
        defense_systems: data.current_posture.active_systems || [],
        vulnerability_assessment: data.vulnerability_assessment || {}
      });
    };
    loadData();
  }, []);

  const handleWebSocketUpdate = (data) => {
    if (data.defense_status) {
      setDefenseData(prev => ({
        ...prev,
        defense_status: data.defense_status,
        defense_systems: data.defense_systems || prev.defense_systems,
        vulnerability_assessment: data.vulnerability_assessment || prev.vulnerability_assessment
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
          Defense Matrix
        </h1>
        <p className="text-cyan-600">System protection and vulnerability management</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        <motion.div 
          className="col-span-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <DefenseStatus data={defenseData.defense_status} />
        </motion.div>

        <motion.div 
          className="col-span-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 h-full">
            <h2 className="text-xl font-rem text-cyan-400 mb-6">Active Defense Systems</h2>
            <div className="space-y-4">
              {defenseData.defense_systems.map((system, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-white">{system.name}</h3>
                    <p className="text-gray-400 text-sm">{system.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    system.status === 'active' 
                      ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                      : 'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}>
                    {system.status}
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

export default DefenseMatrix;
