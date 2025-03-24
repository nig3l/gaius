import { motion } from 'framer-motion';
import { useState } from 'react';
import { executeAction } from "../../api/api";

const ActionCenter = ({ data }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);

  const handleActionClick = async (actionId) => {
    setActiveAction(actionId);
    setActionStatus('executing');
    
    try {
      const result = await executeAction(actionId);
      console.log("Action result:", result);
      setActionStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setActiveAction(null);
        setActionStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Action failed:", error);
      setActionStatus('failed');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setActiveAction(null);
        setActionStatus(null);
      }, 3000);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-900/50 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-900/50 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-900/50 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-green-900/50 text-green-400 border-green-500/30';
      default: return 'bg-blue-900/50 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 max-w-md"
    >
      <h2 className="text-xl font-rem text-cyan-400 mb-6">Strategic Action Matrix</h2>
      
      <div className="space-y-4">
        {data.immediate_actions?.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={activeAction !== null}
            onClick={() => handleActionClick(action.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
              activeAction === action.id
                ? actionStatus === 'executing' ? 'bg-blue-900/50 border-blue-500/50 animate-pulse' :
                  actionStatus === 'success' ? 'bg-green-900/50 border-green-500/50' :
                  'bg-red-900/50 border-red-500/50'
                : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-cyan-500/30'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{action.title}</span>
              <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(action.priority)}`}>
                {action.priority}
              </span>
            </div>
            
            {activeAction === action.id && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm"
              >
                {actionStatus === 'executing' && <p className="text-blue-400">Executing command...</p>}
                {actionStatus === 'success' && <p className="text-green-400">Action completed successfully</p>}
                {actionStatus === 'failed' && <p className="text-red-400">Action failed to execute</p>}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ActionCenter;
