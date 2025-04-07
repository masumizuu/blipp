import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Find the password reset record
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { email },
    })

    if (!passwordReset) {
      return NextResponse.json({ error: "No verification code found for this email" }, { status: 400 })
    }

    // Check if OTP is expired
    if (new Date() > passwordReset.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Verify OTP
    if (passwordReset.token !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    return NextResponse.json({ message: "OTP verified successfully" })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

