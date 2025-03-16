import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_CHAT_URI: string = process.env.MONGODB_URI_CHAT ?? "";

if (!MONGO_CHAT_URI) {
  throw new Error("❌ MONGO_CHAT_URI is missing! Check your environment variables.");
}

// Use a global cache to prevent multiple connections
let cached = (global as any).mongooseChatGlobal || { conn: null, promise: null };

export async function connectChatDB() {
  if (cached.conn) {
    console.log("🔄 Using existing MongoDB connection (Chat History)");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Creating new MongoDB connection (Chat History)");
    cached.promise = mongoose.connect(MONGO_CHAT_URI).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  cached.conn = await cached.promise;
  (global as any).mongooseChatGlobal = cached; // Store globally

  console.log("✅ Connected to MongoDB (Chat History)!");
  return cached.conn;
}
