// import OpenAI from "openai";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const response = await axios.post("http://127.0.0.1:8000/chat", {
      message,
    });
    return NextResponse.json(
      {
        message: "Successful AI is working is",
        data: response.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Something went wrong : ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
