import { motion } from 'framer-motion';
import { useState } from 'react';

const RiskHeatmap = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Default data if none provided
  const heatmapData = data?.values || [
    { x: 'Network', y: 'External', value: 0.8 },
    { x: 'Network', y: 'Internal', value: 0.4 },
    { x: 'Application', y: 'External', value: 0.7 },
    { x: 'Application', y: 'Internal', value: 0.5 },
    { x: 'Data', y: 'External', value: 0.9 },
    { x: 'Data', y: 'Internal', value: 0.6 },
    { x: 'Physical', y: 'External', value: 0.3 },
    { x: 'Physical', y: 'Internal', value: 0.2 },
  ];
  
  const xLabels = [...new Set(heatmapData.map(d => d.x))];
  const yLabels = [...new Set(heatmapData.map(d => d.y))];
  
  const getColor = (value) => {
    if (value >= 0.8) return 'bg-red-500/80';
    if (value >= 0.6) return 'bg-orange-500/80';
    if (value >= 0.4) return 'bg-yellow-500/80';
    if (value >= 0.2) return 'bg-green-500/80';
    return 'bg-blue-500/80';
  };
  
  const getValue = (x, y) => {
    const cell = heatmapData.find(d => d.x === x && d.y === y);
    return cell ? cell.value : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <h2 className="text-xl font-rem text-cyan-400 mb-6">Risk Assessment Matrix</h2>
      
      <div className="relative">
        <div className="flex mb-2">
          <div className="w-24"></div>
          {xLabels.map(label => (
            <div key={label} className="flex-1 text-center text-gray-400 text-sm">
              {label}
            </div>
          ))}
        </div>
        
        {yLabels.map(yLabel => (
          <div key={yLabel} className="flex mb-2">
            <div className="w-24 flex items-center text-gray-400 text-sm">
              {yLabel}
            </div>
            {xLabels.map(xLabel => {
              const value = getValue(xLabel, yLabel);
              const isHovered = hoveredCell && hoveredCell.x === xLabel && hoveredCell.y === yLabel;
              
              return (
                <motion.div
                  key={`${xLabel}-${yLabel}`}
                  className={`flex-1 aspect-square ${getColor(value)} rounded-md m-1 cursor-pointer
                    ${isHovered ? 'ring-2 ring-white' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  onMouseEnter={() => setHoveredCell({ x: xLabel, y: yLabel, value })}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              );
            })}
          </div>
        ))}
        
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 
              bg-gray-800 p-3 rounded-lg border border-gray-700 z-10"
          >
            <p className="text-white font-medium">{hoveredCell.x} / {hoveredCell.y}</p>
            <p className="text-gray-300">Risk Score: {(hoveredCell.value * 10).toFixed(1)}/10</p>
            <p className={`text-sm ${
              hoveredCell.value >= 0.8 ? 'text-red-400' :
              hoveredCell.value >= 0.6 ? 'text-orange-400' :
              hoveredCell.value >= 0.4 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {hoveredCell.value >= 0.8 ? 'Critical Risk' :
               hoveredCell.value >= 0.6 ? 'High Risk' :
               hoveredCell.value >= 0.4 ? 'Medium Risk' :
               'Low Risk'}
            </p>
          </motion.div>
        )}
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500/80 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-400">Critical</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500/80 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-400">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500/80 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-400">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500/80 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-400">Low</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskHeatmap;


