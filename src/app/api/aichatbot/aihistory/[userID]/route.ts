import { NextRequest, NextResponse } from "next/server";
import {getChatHistoryModel}  from "@/models/Chats";

export async function GET(
  request: NextRequest, 
  { params }: { params?: { userID?: string } }
): Promise<NextResponse> {
  try {
    // await connectToDatabase("chat");

    // Return early if params is undefined
    if (!params) {
      return NextResponse.json({ message: "Invalid request parameters" }, { status: 400 });
    }

    // Extract userID from URL with explicit type checking
    const userID: string | undefined = params.userID;

    if (!userID || typeof userID !== 'string') {
      return NextResponse.json({ message: "UserID is required and must be a string" }, { status: 400 });
    }

    // ✅ Retrieve the Chat model correctly before using it
    const Chat = await getChatHistoryModel();
    const chatHistory = await Chat.findOne({ userId: userID });

    if (!chatHistory) {
      return NextResponse.json({ message: "No chat history found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat history retrieved", data: chatHistory }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}




export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Ensure Chat model is available
    const Chat = await getChatHistoryModel();

    // ✅ Fetch existing chat or create a new one
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // ✅ Append new message
    chat.messages.push({
      sender: "user",
      text: message,
      timestamp: new Date(),
    });

    await chat.save();

    return NextResponse.json({ success: true, chat }, { status: 200 });
  } catch (error: any) {
    console.error("Error in chat history:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
