import { NextRequest, NextResponse } from "next/server";
import { connectChatDB } from "@/lib/dbChatHistory";  // Ensure correct import
import { getChatHistoryModel } from "@/models/Chats"; // Ensure correct import

export async function GET(request: NextRequest, { params }: { params: { userID: string } }) {
  await params; // ✅ Ensure params is awaited before usage
  const userID = params.userID;

  if (!userID || typeof userID !== "string") {
      return NextResponse.json({ message: "UserID is required and must be a string" }, { status: 400 });
  }

  try {
      const ChatHistory = await getChatHistoryModel();
      const history = await ChatHistory.find({ userID }).sort({ createdAt: -1 });

      return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: NextRequest, { params }: { params: { userID: string } }) {
  try {
    console.log("🔹 API received User ID:", params?.userID);

    if (!params?.userID || typeof params.userID !== "string") {
      return NextResponse.json({ error: "UserID is required and must be a string" }, { status: 400 });
    }

    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectChatDB();
    const ChatHistory = await getChatHistoryModel();

    // Save chat message
    await ChatHistory.create({ userID: params.userID, messages: [{ sender: "User", text: message }] });

    return NextResponse.json({ chat: { messages: [{ sender: "AI", text: "Processing..." }] } });
  } catch (error) {
    console.error("🚨 Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}