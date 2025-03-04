import { useState } from 'react';

const GaiusChat = ({ data }) => {
  const [messages, setMessages] = useState([{
    sender: 'Gaius',
    content: "Ave! I am Gaius Julius Caesar, your strategic defense commander. I apply time-tested military principles to protect your digital empire. How may I assist you today?"
  }]);
  
  const [input, setInput] = useState('');

  const sendMessage = async (message) => {
    // Add user message
    setMessages(prev => [...prev, { sender: 'User', content: message }]);
    
    // Get Gaius's response through WebSocket
    // Response will come through Dashboard's WebSocketManager
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-96 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Strategic Command Chat</h2>
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'Gaius' ? 'text-blue-400' : 'text-green-400'}`}>
            <span className="font-bold">{msg.sender}:</span> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded px-2 py-1"
          placeholder="Enter your command..."
        />
        <button 
          onClick={() => {
            sendMessage(input);
            setInput('');
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GaiusChat;
