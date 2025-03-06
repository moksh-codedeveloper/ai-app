import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { text: input, isUser: true };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post("/api/aichatbot/chatbot", { message: input });
            setMessages([...messages, userMessage, { text: response.data.choices[0].text, isUser: false }]);
        } catch (error) {
            setMessages([...messages, userMessage, { text: "Error: Failed to fetch AI response", isUser: false }]);
        }
        setInput("");
    };

    return (
        <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">AI Chatbot</h2>
            <div className="h-64 overflow-y-auto border p-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.isUser ? "text-right" : "text-left"}`}>
                        <span className={`px-3 py-1 rounded ${msg.isUser ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI..."
                className="w-full border p-2 mt-2"
            />
            <button onClick={sendMessage} className="w-full bg-blue-500 text-white p-2 mt-2">
                Send
            </button>
        </div>
    );
};

export default Chatbot;
