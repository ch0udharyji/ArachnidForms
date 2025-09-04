import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    
    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid password (must be at least 8 characters)" }, { status: 400 })
    }

    // Find the token
    const tokenRecord = await db.verificationToken.findUnique({
      where: { token }
    })

    // Validate token exists and is not expired
    if (!tokenRecord || tokenRecord.expires < new Date()) {
      return NextResponse.json({ error: "Token is invalid or expired" }, { status: 400 })
    }

    // Find associated user
    const user = await db.user.findUnique({
      where: { email: tokenRecord.identifier }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password
    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword }
    })

    // Delete the token so it can't be reused
    await db.verificationToken.delete({
      where: { token }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("New password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}

// [dev-log-sync]: 03a786bf13ec6f33