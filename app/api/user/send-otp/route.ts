import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import nodemailer from "nodemailer"
import crypto from "crypto"

const prisma = new PrismaClient()

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: Boolean(process.env.EMAIL_SERVER_SECURE),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    // Verify email matches the logged-in user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.email !== email) {
      return NextResponse.json({ error: "Email does not match current user" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()

    // Store OTP in database with expiration (15 minutes)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    await prisma.passwordReset.upsert({
      where: { email },
      update: {
        token: otp,
        expiresAt,
      },
      create: {
        email,
        token: otp,
        expiresAt,
      },
    })

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${otp}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password. Use the verification code below:</p>
          <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "OTP sent successfully" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}

