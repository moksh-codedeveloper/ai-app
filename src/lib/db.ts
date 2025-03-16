import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const MONGO_URI: string = process.env.MONGODB_URI_MAIN ?? "";

if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is missing! Check your environment variables.");
}

// Properly declare the global object to avoid TypeScript errors
interface MongooseGlobal {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

declare global {
    var mongooseGlobal: MongooseGlobal;
}

// Initialize global object if not already defined
global.mongooseGlobal = global.mongooseGlobal || { conn: null, promise: null };

export async function connect() {
    try {
        if (global.mongooseGlobal.conn) {
            console.log("🔄 Using existing MongoDB connection");
            return global.mongooseGlobal.conn;
        }

        if (!global.mongooseGlobal.promise) {
            console.log("🔌 Creating new MongoDB connection");
            global.mongooseGlobal.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
                global.mongooseGlobal.conn = mongooseInstance.connection;
                return mongooseInstance.connection;
            });
        }

        global.mongooseGlobal.conn = await global.mongooseGlobal.promise;
        console.log("✅ Connected to MongoDB!");
        return global.mongooseGlobal.conn;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
}
