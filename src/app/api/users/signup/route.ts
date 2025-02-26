import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
connect();


export default async function POST(request: NextRequest){
  try {
    const {email, password} = await request.json();
    if (!email || !password) {
      return NextResponse.json({
        message: "Please enter all fields"
      },
      {
        status: 400
      })
    }
    const user = await User.findOne({email});
    if (!user) {
      return NextResponse.json({
        message: "User doesn't exists"
      },
      {
        status: 400
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && !user) {
      return NextResponse.json({
        message: "Invalid credentials"
      },
      {
        status: 400
      })
    }
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username
    }

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!,{expiresIn: "1d"});
    const response = NextResponse.json({
      message: "Login Successful",
      token
    }, {
      status: 200
    })

    response.cookies.set("token", token, {
      httpOnly: true,
    })

    return response;
  } catch (error:any) {
    return NextResponse.json({
      message: "Error",
      error: error.message
    },
  {
    status: 500
  })
  }
}