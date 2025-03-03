const ThreatMonitor = ({ data }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Active Threats</h2>
        <p>Threat Level: {data.threat_assessment?.threat_level || "N/A"}</p>
        <ul className="mt-2">
          {data.recommendations?.map((rec, idx) => (
            <li key={idx} className="text-gray-300">{rec}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ThreatMonitor;