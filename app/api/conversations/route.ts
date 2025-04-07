import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// Get all conversations for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
      include: {
        userOne: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        userTwo: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Get unread message count for each conversation
    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            receiverId: userId,
            read: false,
          },
        })

        // Determine the other user in the conversation
        const otherUser = conversation.userOneId === userId ? conversation.userTwo : conversation.userOne

        return {
          id: conversation.id,
          otherUser,
          lastMessage: conversation.messages[0] || null,
          unreadCount,
          updatedAt: conversation.updatedAt,
        }
      }),
    )

    return NextResponse.json(conversationsWithUnreadCount)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new conversation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId } = body
    const senderId = session.user.id

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 })
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            userOneId: senderId,
            userTwoId: receiverId,
          },
          {
            userOneId: receiverId,
            userTwoId: senderId,
          },
        ],
      },
    })

    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        userOneId: senderId,
        userTwoId: receiverId,
      },
    })

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

