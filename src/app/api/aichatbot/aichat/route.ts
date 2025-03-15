import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message input" }, { status: 400 });
    }

    const response = await axios.post(
      "http://localhost:8000/chat", // Ensure this matches your FastAPI endpoint
      { message },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("AI Response:", response.data); // Debugging

    return NextResponse.json(
      {
        message: "AI response received successfully",
        data: response.data.response || response.data, // Adjust if FastAPI returns a different structure
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in Next.js Backend:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
