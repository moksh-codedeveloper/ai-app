import OpenAI from "openai";
import { NextRequest,NextResponse} from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
})

export async function POST(request: NextRequest) {
    try {
        const {prompt} = await request.json();
        const response = await  openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: prompt}]
        });
        return NextResponse.json({
            result: response.choices[0]?.message?.content || 'No response'
        }, { status: 200 })
    } catch (error:any) {
        return NextResponse.json({
            message: "Something went wrong : ",
            error: error.message,
        },{ status: 500 })
    }
}