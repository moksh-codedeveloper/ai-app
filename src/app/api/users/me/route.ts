import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const userId = getDataFromToken(req); // Extract userId from token

    return NextResponse.json({ userId }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid or missing token" }, { status: 401 });
  }
}
