"use client";

import { useState } from "react";
import axios from "axios";

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  // const [response, setResponse] = useState("");
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
  const summarizeResponse = async () => {
    if (!aiResponse) return;

    try {
      setSummaryLoading(true);
      const res = await axios.post("/api/aichatbot/summarize", {
        text: aiResponse,
      });
      // setSummary(res.data);
      setSummary(res.data.summary)
    } catch (error) {
      setSummary("Failed to generate summary.");
    }

    setSummaryLoading(false);
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
        {aiResponse && (
          <button
            onClick={summarizeResponse}
            disabled={summaryLoading}
            className="bg-white text-black px-4 py-2 rounded"
          >
            {summaryLoading ? "Loading..." : "Summarize"}
          </button>
        )}
        {aiResponse && (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-black">
          <h2 className="font-semibold">Response:</h2>
          <p>{aiResponse}</p>
        </div>
      )}

      {summary && (
        <div className="mt-4 p-4 border rounded bg-yellow-100">
          <h2 className="font-semibold text-black">Summarized Response:</h2>
          <p className="text-black">{typeof summary === "string" ? summary : JSON.stringify(summary)}</p>
        </div>
      )}
      </div>
    </div>
  );
}
// This is ai chat code present in the src/app/chatAI 