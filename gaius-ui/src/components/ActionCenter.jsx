import { executeAction } from "../api/api";

const ActionCenter = ({ data }) => {
  const handleActionClick = async (actionId) => {
    const result = await executeAction(actionId);
    console.log("Action result:", result);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
      <ul className="space-y-2">
        {data.immediate_actions?.map((action, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleActionClick(action.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              {action.title} (Priority: {action.priority})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionCenter;