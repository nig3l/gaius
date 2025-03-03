import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust to FastAPI URL

export const fetchStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/status`);
  return response.data;
};

export const executeAction = async (actionId) => {
  const response = await axios.post(`${API_BASE_URL}/action/${actionId}`);
  return response.data;
};