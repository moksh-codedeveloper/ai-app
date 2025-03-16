import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function getDataFromToken(requestOrToken: NextRequest | string): any | null {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        return decoded // ✅ Returns the decoded user data (e.g., { userID, email })
    } catch (error) {
        console.error("Invalid Token:", error)
        return null
    }
}
