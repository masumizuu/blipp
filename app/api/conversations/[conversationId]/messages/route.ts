import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// Get messages for a specific conversation
export async function GET(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { conversationId } = params

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send a new message
export async function POST(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const senderId = session.user.id
    const { conversationId } = params
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        OR: [{ userOneId: senderId }, { userTwoId: senderId }],
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Determine receiver ID
    const receiverId = conversation.userOneId === senderId ? conversation.userTwoId : conversation.userOneId

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

