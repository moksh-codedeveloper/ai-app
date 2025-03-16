// import { create } from "zustand";
// import axios from "axios";

// interface Message {
//   _id: string;
//   userId: string;
//   message: string;
//   createdAt: string;
// }

// interface ChatState {
//   messages: Message[];
//   fetchChatHistory: (userId: string) => Promise<void>;
//   sendMessage: (userId: string, message: string) => Promise<void>;
// }

// export const useChatStore = create<ChatState>((set) => ({
//   messages: [],

//   // Fetch chat history from API
//   fetchChatHistory: async (userId: string) => {
//     try {
//       const res = await axios.get(`/api/chat/history/${userId}`);
//       set({ messages: res.data.chatHistory });
//     } catch (error) {
//       console.error("Error fetching chat history", error);
//     }
//   },

//   // Send new message
//   sendMessage: async (userId: string, message: string) => {
//     if (!message.trim()) return;

//     try {
//       const res = await axios.post("/api/chat/send", { userId, message });
//       set((state) => ({ messages: [...state.messages, res.data.message] })); // Append new message
//     } catch (error) {
//       console.error("Error sending message", error);
//     }
//   },
// }));

import { create } from "zustand";

interface ChatState {
  userID: string | null;
  chatHistory: { sender: string; text: string }[];
  setUserID: (id: string) => void;
  setChatHistory: (history: { sender: string; text: string }[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  userID: null,
  chatHistory: [],
  setUserID: (id) => set({ userID: id }),
  setChatHistory: (history) => set({ chatHistory: history }),
}));
