"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useChatStore } from "@/store/chatStore"; // ✅ Zustand Store

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // ✅ Zustand state
  const { userID, setUserID, chatHistory, setChatHistory } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch userID & chat history only once
  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        const { data } = await axios.get("/api/auth/me"); // ✅ Get logged-in user
        if (!data?.userID) throw new Error("No user ID found");
        setUserID(data.userID);

        console.log("🔹 Fetching chat history for User ID:", data.userID);

        const response = await axios.get(`/api/aichatbot/aihistory/${encodeURIComponent(data.userID)}`);
        setChatHistory(response.data.chat.messages || []);
      } catch (error: any) {
        console.error("🚨 Error fetching user or history:", error.response?.data || error.message);
      }
    };

    if (!userID) fetchUserAndHistory();
  }, [userID]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ✅ Send message, get AI response, then save to backend
  const sendMessage = async () => {
    if (!userID) {
      console.error("Invalid User ID:", userID);
      return;
    }
    if (!message.trim()) return;

    setLoadingAI(true);

    try {
      console.log("🔹 Sending message to AI with User ID:", userID);

      // ✅ Step 1: Send message to AI
      const aiResponseData = await axios.post("/api/aichatbot/askAI", { message });
      const aiText = aiResponseData.data?.response || "No AI response.";

      // ✅ Step 2: Update UI instantly
      const newUserMessage = { sender: "User", text: message };
      const newAIMessage = { sender: "AI", text: aiText };

      setChatHistory([...chatHistory, newUserMessage, newAIMessage]);
      setAiResponse(aiText);
      setMessage("");

      // ✅ Step 3: Store the conversation in the backend
      console.log("🔹 Storing chat in history for User ID:", userID);

      await axios.post(`/api/aichatbot/aihistory/${encodeURIComponent(userID)}`, {
        message,
        aiResponse: aiText,
      });
    } catch (error: any) {
      console.error("🚨 Error processing chat:", error.response?.data || error.message);
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
      console.error("🚨 Error summarizing:", error);
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
