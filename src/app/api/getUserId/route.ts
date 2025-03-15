import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const userID = await getDataFromToken(req); // ✅ Pass NextRequest directly

    if (!userID) {
      return NextResponse.json({ error: "Unauthorized: Invalid or missing token" }, { status: 401 });
    }

    return NextResponse.json({ userID }, { status: 200 });
  } catch (error: any) {
    console.error("getUserId API Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
