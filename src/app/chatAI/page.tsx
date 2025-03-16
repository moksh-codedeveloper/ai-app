"use client";

import { useEffect, useRef, useState } from "react";
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

  // ✅ Fetch userID from `/api/getUserId` when component mounts
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const response = await axios.get("/api/getUserId", { withCredentials: true });
        setUserID(response.data.userID);
        if (response.data.userID) fetchChatHistory(response.data.userID);
      } catch (error) {
        console.error("Failed to get userID:", error);
      }
    };
    fetchUserID();
  }, []);

  // ✅ Fetch chat history
  const fetchChatHistory = async (userID: string) => {
    try {
      const res = await axios.get(`/api/aichatbot/aihistory/${userID}`);
      setChatHistory(res.data.data?.messages || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ✅ Send message and save to chat history
  const sendMessage = async () => {
    if (!userID) {
      console.error("User ID not available");
      return;
    }
    if (!message.trim()) return;

    setLoadingAI(true);
    try {
      const response = await axios.post(`/api/aichatbot/aihistory`, { userID, message });

      const newMessage = { sender: "AI", text: response.data.chat?.messages.slice(-1)[0]?.text || "No response" };
      setChatHistory((prev) => [...prev, { sender: "User", text: message }, newMessage]); // Update UI instantly
      setAiResponse(newMessage.text);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
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
