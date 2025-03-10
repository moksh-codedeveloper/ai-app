import { NextRequest, NextResponse} from "next/server";
import axios from "axios";
export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json();
        const { fileURL } = reqBody;
        const response = await axios.post("http://localhost:8000/summarizeNote", {
            file_url : fileURL,
        })
        return NextResponse.json(
            {
                message: "Successfully Completed!!",
                data: response
            }, {
                status: 200
            }
        )
    } catch (error:any) {
        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message
            }, 
            {
                status: 500
            }
        )
    }
}