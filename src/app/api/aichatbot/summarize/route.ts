import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await axios.post("http://localhost:8000/summarizeNote", { text });

    return NextResponse.json({response  : response.data.summary}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.detail || "Summarization failed" },
      { status: 500 }
    );
  }
}
