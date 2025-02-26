import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
connect();


export default async function POST(request: NextRequest) {
  try {
    const { email, password, username, isVerified } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      isVerified,
    });
    const response = await user.save();
    return NextResponse.json(
      {
        message: "User created successfully",
        data: response,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}