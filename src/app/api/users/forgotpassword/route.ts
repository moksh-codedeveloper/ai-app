import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import {connect} from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";
connect();
export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const {email, password} = reqBody;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPassword = await User.findOneAndUpdate(email, {
        $set: {
            password: hashedPassword
        }
    })
    return NextResponse.json({
        message: "Password changed successfully",
        data: newPassword
    }, { status: 201 })
}