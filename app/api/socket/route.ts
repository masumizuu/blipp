import { Server as SocketIOServer } from "socket.io"
import type { Server as NetServer } from "http"
import type { NextRequest } from "next/server"

export function GET(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/socket")) {
    return new Response("Not found", { status: 404 })
  }

  // This is a workaround for Socket.IO with Next.js App Router
  // It's not ideal, but it works for development purposes
  if ((global as any).io) {
    return new Response("Socket is already running", { status: 200 })
  }

  try {
    const httpServer: NetServer = (global as any).httpServer
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    })
    ;(global as any).io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join a room for each conversation
      socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId)
      })

      // Leave a conversation room
      socket.on("leave-conversation", (conversationId) => {
        socket.leave(conversationId)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })

    return new Response("Socket is running", { status: 200 })
  } catch (error) {
    console.error("Socket error:", error)
    return new Response("Error initializing socket", { status: 500 })
  }
}

