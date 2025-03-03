import { useEffect, useState } from "react";

const WebSocketManager = ({ onUpdate }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws/dashboard");
    setWs(websocket);

    websocket.onopen = () => console.log("WebSocket connected");
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data); // Pass real-time data to parent
    };
    websocket.onclose = () => console.log("WebSocket disconnected");

    return () => websocket.close();
  }, [onUpdate]);

  return null; // No UI, just manages connection
};

export default WebSocketManager;