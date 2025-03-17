import { connect } from "@/lib/db";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie"; // Import for proper cookie formatting

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isVerify = await bcrypt.compare(password, user.password);
    if (!isVerify) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const tokenData = {
      userID: user._id,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET! as string, {
      expiresIn: "1d",
    });

    // Set the cookie correctly
    const cookie = serialize("token", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict", // Prevent CSRF attacks
      path: "/", // Accessible on all routes
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Send response with cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookie); // Attach cookie to response
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong: " + error.message },
      { status: 500 }
    );
  }
}
