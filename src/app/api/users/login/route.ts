import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const user = await User.findOne({ email });
    const isVerify = await bcrypt.compare(password, user.password);
    if (!user || !isVerify) {
      return NextResponse.json(
        {
          message: "Invalid value of credentails",
        },
        { status: 404 }
      );
    }
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
        {
            message: "Login successfully",
            data: token
        }, { status: 200}
    )
    response.cookies.set("token", token, {
        httpOnly: true
    })
  } catch (error:any) {
    return NextResponse.json(
      {
        message: "There is something wrong" + error.message,
      },
      { status: 500 }
    );
  }
}
