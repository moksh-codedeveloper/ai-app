import mongoose, { Schema, Document, Model } from "mongoose";
import { connectToDatabase } from "@/lib/db";

interface IMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface IChat extends Document {
  userId: string;
  messages: IMessage[];
  createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true },
  messages: [
    {
      sender: { type: String, enum: ["user", "ai"], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

await connectToDatabase("chat"); // Ensure DB connection before exporting

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
