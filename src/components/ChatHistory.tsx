import { useState, useEffect } from "react";

interface ChatHistoryProps {
  userId: string;
  onSelectChat: (chatId: string) => void; // Accept onSelectChat prop
}

export default function ChatHistory({ userId, onSelectChat }: ChatHistoryProps) {
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    // Fetch chat history from the backend (dummy data for now)
    setChats([
      { id: "1", title: "Chat 1" },
      { id: "2", title: "Chat 2" },
      { id: "3", title: "Chat 3" },
    ]);
  }, [userId]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Chat History</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)} // Call onSelectChat when clicked
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
