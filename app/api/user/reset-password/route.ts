import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json()

    if (!email || !otp || !password) {
      return NextResponse.json({ error: "Email, OTP, and password are required" }, { status: 400 })
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the password reset record
    await prisma.passwordReset.delete({
      where: { email },
    })

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

