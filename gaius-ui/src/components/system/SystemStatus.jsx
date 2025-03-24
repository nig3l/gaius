import { motion } from 'framer-motion';

const SystemStatus = () => {
  const systems = [
    { name: 'Firewall', status: 'online' },
    { name: 'IDS', status: 'online' },
    { name: 'Encryption', status: 'online' },
    { name: 'Backup', status: 'warning' }
  ];

  return (
    <div className="flex items-center space-x-3">
      {systems.map((system, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center"
        >
          <div className={`h-2 w-2 rounded-full mr-1 ${
            system.status === 'online' ? 'bg-green-500' :
            system.status === 'warning' ? 'bg-yellow-500' :
            'bg-red-500'
          } ${system.status !== 'offline' ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs text-gray-400">{system.name}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemStatus;
