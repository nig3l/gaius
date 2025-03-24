import { motion } from 'framer-motion';
import { useState } from 'react';

const DefenseStatus = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  const metrics = [
    { name: 'strength', icon: '🛡️', color: 'from-blue-500 to-cyan-300' },
    { name: 'mobility', icon: '⚡', color: 'from-purple-500 to-pink-300' },
    { name: 'supplies', icon: '📦', color: 'from-green-500 to-emerald-300' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <h2 className="text-xl font-rem text-cyan-400 mb-6">Defense Matrix Status</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {metrics.map(metric => (
          <motion.div
            key={metric.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMetric(metric.name)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedMetric === metric.name 
                ? 'bg-gray-800/80 border border-cyan-500/50' 
                : 'bg-gray-800/40 border border-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{metric.icon}</span>
              <span className="text-lg font-bold text-white">{data[metric.name] || 0}%</span>
            </div>
            <h3 className="text-sm text-gray-400 capitalize">{metric.name}</h3>
            
            <div className="mt-3 h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data[metric.name] || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedMetric && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50"
        >
          <h3 className="text-white capitalize mb-2">{selectedMetric} Details</h3>
          <p className="text-gray-400 text-sm">
            {selectedMetric === 'strength' && 'Current defensive capabilities and system hardening status.'}
            {selectedMetric === 'mobility' && 'Response time and adaptability to emerging threats.'}
            {selectedMetric === 'supplies' && 'Available resources for sustained defense operations.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DefenseStatus;
