import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectToDatabase } from "@/lib/db";

import bcrypt from "bcryptjs";
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { username, email, password} = reqBody;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json(
        {
          message: "User already exist",
        },
        {
          status: 400,
        }
      );
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })
    await user.save();
    return NextResponse.json(
      {
        message: "User created",
        data: user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
