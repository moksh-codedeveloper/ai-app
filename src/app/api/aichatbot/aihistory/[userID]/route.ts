import { NextRequest, NextResponse } from "next/server";
import Chat from "@/models/Chats";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const chatHistory = await Chat.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ chatHistory }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error fetching chat history: " + error.message }, { status: 500 });
  }
}
