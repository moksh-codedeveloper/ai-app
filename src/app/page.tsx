"use client";
import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
import ChatHistory from "@/components/ChatHistory"; 
import Chat from "@/components/Chat";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const userId = "user-123"; // Replace this with actual user ID from auth

  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex flex-col flex-1">
        {/* <Navbar /> */}
        <div className="flex flex-1">
          {/* Left Side: Chat History */}
          <div className="w-1/4 border-r border-gray-300 p-4">
            <ChatHistory userId={userId} onSelectChat={setSelectedChatId} />
          </div>

          {/* Right Side: Chat Interface */}
          <div className="flex-1 p-4">
            <Chat chatId={selectedChatId} />
          </div>
        </div>
      </div>
    </div>
  );
}
