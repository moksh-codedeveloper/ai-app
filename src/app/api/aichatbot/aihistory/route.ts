import { NextRequest, NextResponse } from "next/server";
import getChatModel from "@/models/Chats";

export async function POST(req: NextRequest) {
  try {
    const Chat = await getChatModel();
    const { userId, messages } = await req.json();

    if (!userId || !messages) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const newChat = new Chat({ userId, messages });
    await newChat.save();

    return NextResponse.json({ message: "Chat saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
