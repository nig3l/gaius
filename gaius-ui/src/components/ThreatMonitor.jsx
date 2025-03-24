const ThreatMonitor = ({ data }) => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">⚠️</span> Active Threats
        </h2>
        <div className="flex items-center mb-4">
          <div className={`px-4 py-2 rounded-full ${
            data.threat_assessment?.threat_level === 'HIGH' 
              ? 'bg-red-500/20 text-red-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            Threat Level: {data.threat_assessment?.threat_level || "N/A"}
          </div>
        </div>
        <ul className="mt-2">
          {data.recommendations?.map((rec, idx) => (
            <li key={idx} className="text-gray-300">{rec}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ThreatMonitor;