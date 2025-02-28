import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
export async function POST(request: NextRequest) {
    try {
        // Connect to database
        await connectToDatabase();
        
        const reqBody = await request.json();
        const {email, password} = reqBody;
        
        // Validate inputs
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" }, 
                { status: 400 }
            );
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Find user and update password with proper filter object
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, 
            {
                $set: {
                    password: hashedPassword
                }
            },
            { new: true } // Return the updated document
        );
        
        // Check if user was found
        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "Password changed successfully",
            success: true
        }, { status: 200 });
    } catch (error: any) {
        console.error("Password reset error:", error);
        return NextResponse.json(
            { 
                message: "Failed to reset password", 
                error: error.message 
            }, 
            { status: 500 }
        );
    }
}
