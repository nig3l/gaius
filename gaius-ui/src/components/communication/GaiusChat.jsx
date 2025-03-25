import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const GaiusChat = ({ data }) => {
  const [messages, setMessages] = useState([{
    sender: 'Gaius',
    content: "Ave! I am Gaius, your strategic defense commander.",
    timestamp: new Date()
  }]);
  
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws/chat");
    
    websocket.onopen = () => {
      console.log("Chat WebSocket Connected");
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        sender: 'Gaius',
        content: response.content,
        timestamp: new Date(response.timestamp)
      }]);
    };

    websocket.onclose = () => {
      console.log("Chat WebSocket Disconnected");
      setIsConnected(false);
    };

    setWs(websocket);

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !ws || !isConnected) return;

    const userMessage = {
      sender: 'User',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    ws.send(input);
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex flex-col h-[500px]" // Add flex and fixed height
    >
      <div className="p-4 border-b border-cyan-500/20">
        <h2 className="text-xl font-rem text-cyan-400">Strategic Command Interface</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4"> {/* Change to flex-1 */}
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ x: msg.sender === 'Gaius' ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            key={idx}
            className={`flex ${msg.sender === 'Gaius' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-xl ${
              msg.sender === 'Gaius' 
                ? 'bg-cyan-900/40 border border-cyan-500/30' 
                : 'bg-blue-900/40 border border-blue-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-cyan-400">{msg.sender}</span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-white">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Move input section up by adding border-t */}
      <div className="p-4 border-t border-cyan-500/20 mt-auto"> {/* Add mt-auto */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!isConnected}
            className="flex-1 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            placeholder={isConnected ? "Enter command..." : "Connecting..."}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-cyan-500/20 border border-cyan-500/30 px-6 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
            onClick={sendMessage}
            disabled={!isConnected}
          >
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GaiusChat;
