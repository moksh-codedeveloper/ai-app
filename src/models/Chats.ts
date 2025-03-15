import { Schema, Document, Model, model, models } from "mongoose";
import { connectToDatabase } from "@/lib/db";

interface IMessage {
  sender: "user" | "assistant"; // Consistent sender roles
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
      sender: { type: String, enum: ["user", "assistant"], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// ✅ Ensure DB connection and return model
export const getChatModel = async (): Promise<Model<IChat>> => {
  await connectToDatabase("chat"); // Ensure the DB is connected
  return models.Chat || model<IChat>("Chat", ChatSchema);
};
