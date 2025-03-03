const DefenseStatus = ({ data }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Defense Readiness</h2>
        <p>Strength: {data.strength || "N/A"}</p>
        <p>Mobility: {data.mobility || "N/A"}</p>
        <p>Supplies: {data.supplies || "N/A"}</p>
      </div>
    );
  };
  
  export default DefenseStatus;