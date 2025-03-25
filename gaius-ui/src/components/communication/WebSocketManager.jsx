import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const WebSocketManager = ({ onUpdate }) => {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [showStatus, setShowStatus] = useState(false);

  const connect = useCallback(() => {
    setStatus('connecting');
    const websocket = new WebSocket("ws://localhost:8000/ws/dashboard");
    
    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus('error');
      setShowStatus(true);
      setTimeout(() => connect(), 5000);
    };

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      setStatus('connected');
      setShowStatus(true);
      // Auto-hide after 5 seconds if connected successfully
      setTimeout(() => setShowStatus(false), 5000);
    };

    setWs(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };
    
    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setStatus('disconnected');
      setShowStatus(true);
      setTimeout(() => connect(), 5000);
    };
  }, [onUpdate]);

  useEffect(() => {
    connect();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const getStatusColor = () => {
    switch(status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-red-500 animate-pulse';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <AnimatePresence>
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-6 right-6 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-3 z-50"
          >
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${getStatusColor()}`}></div>
              <span className={`font-medium ${
                status === 'connected' ? 'text-green-400' :
                status === 'connecting' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {status === 'connected' ? 'Connected to Gaius Command Network' :
                 status === 'connecting' ? 'Establishing connection...' :
                 status === 'disconnected' ? '⚠️ Connection lost. Reconnecting...' :
                 '⚠️ Connection error. Retrying...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always visible minimal status indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
      </div>
    </>
  );
};

export default WebSocketManager;
