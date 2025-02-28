import {NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectToDatabase } from "@/lib/db";
export async function POST(request: NextRequest){
    try {
        // Connect to database
        await connectToDatabase();
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
    } catch (error:any) {
        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message
            }, { status: 500 }
        )
    }
}