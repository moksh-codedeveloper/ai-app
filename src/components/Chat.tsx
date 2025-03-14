"use client";
import { useEffect, useState } from "react";

interface ChatProps {
  chatId: string | null;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function Chat({ chatId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!chatId) return;

    // Fetch chat messages from the backend (Replace this with actual API call)
    setMessages([
      { sender: "user", text: "Hello!", timestamp: "10:30 AM" },
      { sender: "ai", text: "Hi! How can I help you?", timestamp: "10:31 AM" },
    ]);
  }, [chatId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]); // Add user message

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        sender: "ai",
        text: "This is an AI-generated response!",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setNewMessage(""); // Clear input
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto border rounded-lg p-2 bg-gray-100">
        {chatId ? (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                {msg.text}
              </span>
              <div className="text-xs text-gray-500">{msg.timestamp}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Select a chat to start messaging</p>
        )}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
