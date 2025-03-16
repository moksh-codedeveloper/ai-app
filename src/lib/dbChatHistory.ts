import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_CHAT_URI: string = process.env.MONGODB_URI_CHAT ?? "";

if (!MONGO_CHAT_URI) {
  throw new Error("❌ MONGO_CHAT_URI is missing! Check your environment variables.");
}

// Properly declare the global object to avoid TypeScript errors
interface MongooseGlobal {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongooseChatGlobal: MongooseGlobal;
}

// Initialize global object if not already defined
global.mongooseChatGlobal = global.mongooseChatGlobal || { conn: null, promise: null };

export async function connectChatDB() {
  try {
    if (global.mongooseChatGlobal.conn) {
      console.log("🔄 Using existing MongoDB connection (Chat History)");
      return global.mongooseChatGlobal.conn;
    }

    if (!global.mongooseChatGlobal.promise) {
      console.log("🔌 Creating new MongoDB connection (Chat History)");
      global.mongooseChatGlobal.promise = mongoose.connect(MONGO_CHAT_URI).then((mongooseInstance) => {
        global.mongooseChatGlobal.conn = mongooseInstance.connection;
        return mongooseInstance.connection;
      });
    }

    const connection = await global.mongooseChatGlobal.promise;
    console.log("✅ Connected to MongoDB (Chat History)!");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB (Chat History) connection error:", error);
    throw error;
  }
}
