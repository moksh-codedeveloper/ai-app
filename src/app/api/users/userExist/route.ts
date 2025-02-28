import {NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";

export async function GET(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {email} = reqBody;
        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json(
                {
                    message: "No User found!!"
                }, { status : 400 }
            )
        } else {
            return NextResponse.json(
                {
                    message: "Successfully found User"
                }, { status : 200 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            {
                message: "Something went wrong"
            }, { status: 500 }
        )
    }
}