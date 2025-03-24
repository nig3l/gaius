import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-cyan-500/20 px-4 py-2"
    >
      <div className="text-cyan-400 text-sm font-mono">
        {time.toLocaleTimeString()}
      </div>
      <div className="text-gray-500 text-xs">
        {time.toLocaleDateString()}
      </div>
    </motion.div>
  );
};

export default TimeDisplay;
