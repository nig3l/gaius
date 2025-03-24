import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const GaiusChat = ({ data }) => {
  const [messages, setMessages] = useState([{
    sender: 'Gaius',
    content: "Ave! I am Gaius, your strategic defense commander.",
    timestamp: new Date()
  }]);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

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
            className="flex-1 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            placeholder="Enter command..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-cyan-500/20 border border-cyan-500/30 px-6 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/30"
            onClick={() => {
              if (input.trim()) {
                setMessages(prev => [...prev, {
                  sender: 'User',
                  content: input,
                  timestamp: new Date()
                }]);
                setInput('');
              }
            }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GaiusChat;
