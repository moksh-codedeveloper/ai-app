import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export async function getDataFromToken(requestOrToken: NextRequest | string): Promise<any | null> {
    let token = ''

    if (typeof requestOrToken !== 'string') {
        // Check if cookies are available
        const tokenCookie = requestOrToken.cookies?.get('token')
        if (!tokenCookie) {
            console.error("❌ Token not found in cookies")
            return null
        }
        token = tokenCookie.value
    } else {
        token = requestOrToken
    }

    if (!token) {
        console.error("❌ Token is empty")
        return null
    }

    // Ensure JWT Secret is available
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
        console.error("❌ JWT_SECRET is missing in environment variables")
        return null
    }

    try {
        const secret = new TextEncoder().encode(secretKey)
        const { payload } = await jwtVerify(token, secret)
        return payload // ✅ Returns the decoded user data (e.g., { userID, email })
    } catch (error: any) {
        console.error("🚨 Invalid Token:", error.message)
        return null
    }
}
