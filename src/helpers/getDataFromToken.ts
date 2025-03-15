import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function getDataFromToken(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get("token")?.value; // ✅ Extract token from cookies
    if (!token) return null;

    console.log("Token extracted:", token); // Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userID: string };
    console.log("Decoded Token:", decoded); // Debugging

    return decoded.userID; // ✅ Return userID
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
