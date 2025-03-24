import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchStatus } from "../../api/api";
import GaiusChat from './GaiusChat';
import ActionCenter from './ActionCenter';
import WebSocketManager from './WebSocketManager';

const CommandCenter = () => {
  const [commandData, setCommandData] = useState({
    gaius_insights: {},
    command_history: [],
    strategic_options: []
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStatus();
      setCommandData({
        gaius_insights: data.gaius_recommendations,
        command_history: data.command_history || [],
        strategic_options: data.strategic_options || []
      });
    };
    loadData();
  }, []);

  const handleWebSocketUpdate = (data) => {
    if (data.gaius_insights) {
      setCommandData(prev => ({
        ...prev,
        gaius_insights: data.gaius_insights,
        command_history: data.command_history || prev.command_history,
        strategic_options: data.strategic_options || prev.strategic_options
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
          Strategic Command
        </h1>
        <p className="text-cyan-600">Direct communication and action center</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        <motion.div 
          className="col-span-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <GaiusChat data={commandData} />
        </motion.div>

        <motion.div 
          className="col-span-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ActionCenter data={commandData.gaius_insights} />
        </motion.div>
        
        <motion.div 
          className="col-span-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-xl font-rem text-cyan-400 mb-6">Command History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-2 px-4 text-gray-400">Timestamp</th>
                    <th className="text-left py-2 px-4 text-gray-400">Command</th>
                    <th className="text-left py-2 px-4 text-gray-400">Status</th>
                    <th className="text-left py-2 px-4 text-gray-400">Result</th>
                    </tr>
                </thead>
                <tbody>
                  {commandData.command_history.map((cmd, idx) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-700/20"
                    >
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(cmd.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {cmd.command}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          cmd.status === 'success' ? 'bg-green-900/30 text-green-400' :
                          cmd.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {cmd.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {cmd.result || '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      <WebSocketManager onUpdate={handleWebSocketUpdate} />
    </div>
  );
};

export default CommandCenter;

