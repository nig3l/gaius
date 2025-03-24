import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Command Center', icon: '🏛️' },
    { path: '/defense', label: 'Defense Matrix', icon: '🛡️' },
    { path: '/threats', label: 'Threat Analysis', icon: '⚠️' },
    { path: '/command', label: 'Strategic Command', icon: '⚔️' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      } bg-gray-900/80 backdrop-blur-xl border-r border-cyan-500/20`}
    >
      <div className="p-4 border-b border-cyan-500/20 flex justify-center items-center h-20">
        {isExpanded ? (
          <h1 className="text-xl font-rem text-cyan-400">GAIUS</h1>
        ) : (
          <span className="text-2xl">🏛️</span>
        )}
      </div>
      
      <div className="py-6">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <motion.div
              whileHover={{ x: 5, backgroundColor: 'rgba(8, 145, 178, 0.2)' }}
              className={`flex items-center px-4 py-3 mb-2 ${
                location.pathname === item.path 
                  ? 'bg-cyan-900/30 border-r-2 border-cyan-400' 
                  : ''
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
      
      <div className="absolute bottom-8 w-full flex justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
        >
          {isExpanded ? '◀' : '▶'}
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navigation;
