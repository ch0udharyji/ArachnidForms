import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user || user.isTestAccount) {
      // Don't reveal if user exists for security reasons, just return success
      return NextResponse.json({ success: true })
    }

    // Delete any existing tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: email }
    })

    // Generate token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    // Save token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    // Construct reset link
    const url = new URL(req.url)
    const resetLink = `${url.origin}/reset-password/${token}`

    // Since we don't have an email provider like Resend setup yet,
    // we will output the reset link to the console for the developer.
    console.log("\n=========================================")
    console.log(`🔒 PASSWORD RESET LINK FOR ${email}:`)
    console.log(resetLink)
    console.log("=========================================\n")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 500 })
  }
}

// [dev-log-sync]: 40f9d7b073911c1c