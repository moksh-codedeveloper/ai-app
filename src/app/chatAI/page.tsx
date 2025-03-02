'use client';

import { useState } from 'react';
import axios from 'axios';

const responses: { [key: string]: string } = {
  hello: 'Hey there! How can I assist you?',
  hi: 'Hello! What do you need help with?',
  'your name': "I'm your AI chatbot!",
  'how are you': "I'm just a bot, but I'm doing great!",
  joke: 'Why did the computer catch a cold? Because it left its Windows open!',
  trouble: 'Just use your brain and make some smart moves.',
  "whats your ambition?": "I want to help my master Sir Jaimin become the god of A.I!",
  default: "I'm not sure how to respond to that. Try asking something else!",
};

const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hey buddy!.' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');

    const predefinedResponse = responses[input.toLowerCase()];

    if (predefinedResponse) {
      // If predefined response exists, use it
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: predefinedResponse }]);
      }, 500);
    } else {
      // Otherwise, send to backend using Axios
      try {
        const res = await axios.post('/api/chat', { message: input });

        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response || 'No response' }]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Error getting response.' }]);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
      <div className="w-96 bg-gray-800 p-5 rounded-lg">
        <h2 className="text-center text-xl mb-3">🤖 LEARNIX</h2>
        <div className="h-80 overflow-y-auto p-3 bg-gray-700 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-green-600 ml-auto' : 'bg-gray-500 mr-auto'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex mt-3">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg text-black"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="ml-2 px-4 py-2 bg-green-700 text-white rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
