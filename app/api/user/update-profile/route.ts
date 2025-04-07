// import { NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "../../auth/[...nextauth]/route"

// const prisma = new PrismaClient()

// export async function PUT(request: Request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { name, image } = await request.json()

//     // Update user profile
//     const updatedUser = await prisma.user.update({
//       where: { id: session.user.id },
//       data: {
//         name: name || undefined,
//         image: image || undefined,
//       },
//     })

//     return NextResponse.json({
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         image: updatedUser.image,
//       },
//     })
//   } catch (error) {
//     console.error("Error updating profile:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { v2 as cloudinary } from "cloudinary"

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, image } = await req.json()

    let imageUrl = image

    // Upload to Cloudinary only if the image is base64
    if (typeof image === "string" && image.startsWith("data:image")) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blipp_uploads" }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          .end(Buffer.from(image.split(",")[1], "base64"))
      })

      imageUrl = (result as any).secure_url
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        image: imageUrl || undefined,
      },
    })

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

