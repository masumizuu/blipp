import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Default avatars
const defaultAvatars = [
  "/default-avatars/Cowren.png",
  "/default-avatars/Catrina.png",
  "/default-avatars/Koalby.png",
  "/default-avatars/E.T.png",
  "/default-avatars/Pandra.png",
  "/default-avatars/Sofigya.png",
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Select a random default avatar
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: randomAvatar,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

