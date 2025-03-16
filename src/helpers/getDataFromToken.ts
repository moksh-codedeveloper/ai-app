import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export async function getDataFromToken(requestOrToken: NextRequest | string): Promise<any | null> {
    let token = ''

    // If it's a NextRequest (Middleware Case)
    if (typeof requestOrToken !== 'string') {
        token = requestOrToken.cookies.get('token')?.value || ''
    } else {
        // If it's a direct token string (API routes, chatHistory, etc.)
        token = requestOrToken
    }

    if (!token) return null

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const { payload } = await jwtVerify(token, secret)
        return payload // ✅ Returns the decoded user data (e.g., { userID, email })
    } catch (error) {
        console.error("Invalid Token:", error)
        return null
    }
}
