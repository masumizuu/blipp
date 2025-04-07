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

'use client'
import { useState } from 'react'

export default function UpdateProfileForm() {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async () => {
    let base64Image = null

    if (file) {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        base64Image = reader.result

        const res = await fetch('/api/user/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            image: base64Image,
          }),
        })

        const data = await res.json()
        console.log('Updated user:', data)
      }

      reader.readAsDataURL(file)
    } else {
      // No image? Just update the name
      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })

      const data = await res.json()
      console.log('Updated user (no image):', data)
    }
  }
}
