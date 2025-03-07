import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const response = await axios.post("http://localhost:8000/chat", {
      message,
    });

    console.log("AI Response:", response.data); // Debugging

    return NextResponse.json(
      {
        message: "AI response received successfully",
        data: response.data.response, // Updated to match new response format
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in Next.js Backend:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
