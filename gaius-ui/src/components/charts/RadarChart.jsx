import { Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  const chartData = {
    labels: data?.labels || ['Firewall', 'IDS/IPS', 'Encryption', 'Authentication', 'Monitoring', 'Backup'],
    datasets: [
      {
        label: 'Current Defense',
        data: data?.values || [65, 59, 90, 81, 56, 55],
        backgroundColor: 'rgba(8, 145, 178, 0.2)',
        borderColor: 'rgba(8, 145, 178, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(8, 145, 178, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(8, 145, 178, 1)'
      },
      {
        label: 'Recommended',
        data: data?.recommended || [85, 75, 95, 90, 80, 85],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(8, 145, 178, 0.5)',
        borderWidth: 1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <h2 className="text-xl font-rem text-cyan-400 mb-6">Defense Capabilities</h2>
      <div className="h-[300px]">
        <Radar data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default RadarChart;
