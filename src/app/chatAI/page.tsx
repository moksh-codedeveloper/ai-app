"use client";

import { useState } from "react";
import axios from "axios";

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const sendMessage = async () => {
    setLoadingAI(true);
    try {
      const response = await axios.post("/api/aichatbot/aichat", { message });
      console.log("Frontend AI Response:", response.data); // Debugging
      setAiResponse(response.data.data || "No response from AI");
    } catch (error: any) {
      console.error("AI Test Error:", error);
      setAiResponse("Error testing AI.");
    } finally {
      setLoadingAI(false);
    }
  };
  return (
    <div className="p-4 bg-black">
      <h1 className="text-xl font-bold">Chat with AI</h1>
      <textarea
        className="w-full p-2 border rounded bg-black"
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
      <div className="mt-4 p-2 border rounded bg-black">
        <strong>AI Response:</strong> {aiResponse}
      </div>
    </div>
  );
}
