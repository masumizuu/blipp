import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 },
      )
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/uploads")

    // Generate unique filename
    const uniqueId = uuidv4()
    const extension = file.name.split(".").pop()
    const filename = `${uniqueId}.${extension}`
    const filepath = path.join(uploadDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Generate URL for the uploaded image
    const imageUrl = `/uploads/${filename}`

    // Update user's image in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

