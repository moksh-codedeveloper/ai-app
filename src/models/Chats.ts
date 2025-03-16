import mongoose, { Schema, Document } from "mongoose";
import { connectChatDB } from "@/lib/dbChatHistory"; // Import connection function

// Message structure
interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Chat history structure
interface IChatHistory extends Document {
  userID: string;
  messages: IMessage[];
}

// Define message schema
const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Define chat history schema
const ChatHistorySchema = new Schema<IChatHistory>({
  userID: { type: String, required: true },
  messages: { type: [MessageSchema], default: [] },
});

// Function to get the ChatHistory model after ensuring DB connection
export async function getChatHistoryModel() {
  await connectChatDB(); // Ensure DB is connected before using the model
  return mongoose.models.ChatHistory || mongoose.model<IChatHistory>("ChatHistory", ChatHistorySchema);
}
