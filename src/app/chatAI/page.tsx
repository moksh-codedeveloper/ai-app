"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  const [userID, setUserID] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch userID once & chat history in a single call
  useEffect(() => {
    if(!userID) return;
    const fetchChatHistory = async () => {
      if (!userID || typeof userID !== "string") {
        console.error("Invalid User ID for fetching history:", userID);
        return;
      }
    
      try {
        console.log("🔹 Fetching chat history for User ID:", userID);
    
        const response = await axios.get(`/api/aichatbot/aihistory/${encodeURIComponent(userID)}`);
        setChatHistory(response.data.chat.messages || []);
      } catch (error:any) {
        console.error("🚨 Error fetching chat history:", error.response?.data || error.message);
      }
    }
    // fetchUserAndHistory();
    if(userID) fetchChatHistory();
  }, []);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ✅ Send message & update chat history
  const sendMessage = async () => {
    if (!userID || typeof userID !== "string") {
      console.error("Invalid User ID:", userID);
      return;
    }
  
    if (!message.trim()) return;
  
    setLoadingAI(true);
    try {
      console.log("🔹 Sending request with User ID:", userID);
  
      const response = await axios.post(`/api/aichatbot/aihistory/${encodeURIComponent(userID)}`, { message });
      // const aiResonse = await axios.post("")
      const newUserMessage = { sender: "User", text: message };
      const newAIMessage = { sender: "AI", text: response.data.chat?.messages?.slice(-1)[0]?.text || "No response" };
  
      setChatHistory((prev) => [...prev, newUserMessage, newAIMessage]); // Update UI instantly
      setAiResponse(newAIMessage.text);
      setMessage(""); // Clear input after sending
    } catch (error:any) {
      console.error("🚨 Error sending message:", error.response?.data || error.message);
    } finally {
      setLoadingAI(false);
    }
  };
  
  
  

  // ✅ Summarize AI response
  const summarizeResponse = async () => {
    if (!aiResponse) return;

    try {
      setSummaryLoading(true);
      const res = await axios.post("/api/aichatbot/summarize", { text: aiResponse });
      setSummary(res.data.summary || "Failed to generate summary.");
    } catch (error) {
      console.log(error);
      setSummary("Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-xl font-bold">Chat with AI</h1>

      {/* ✅ Message Input */}
      <textarea
        className="w-full p-2 border rounded bg-gray-800 text-white"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={sendMessage}
        disabled={loadingAI}
      >
        {loadingAI ? "Loading..." : "Send"}
      </button>

      {/* ✅ Chat History */}
      <div className="mt-4 p-2 border rounded bg-black">
        <h2 className="font-semibold">Chat History</h2>
        <div className="mt-2 space-y-2">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`p-2 border-b ${msg.sender === "User" ? "text-blue-400" : "text-green-400"}`}>
              <strong>{msg.sender}: </strong>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ✅ AI Response & Summarization */}
      {aiResponse && (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-black">
          <h2 className="font-semibold">Response:</h2>
          <p>{aiResponse}</p>
          <button
            onClick={summarizeResponse}
            disabled={summaryLoading}
            className="mt-2 bg-white text-black px-4 py-2 rounded"
          >
            {summaryLoading ? "Loading..." : "Summarize"}
          </button>
        </div>
      )}

      {/* ✅ Summary */}
      {summary && (
        <div className="mt-4 p-4 border rounded bg-yellow-100">
          <h2 className="font-semibold text-black">Summarized Response:</h2>
          <p className="text-black">{summary}</p>
        </div>
      )}
    </div>
  );
}
