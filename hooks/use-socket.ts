"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io({
      path: "/api/socket",
      addTrailingSlash: false,
    })

    // Set up event listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    // Save socket instance
    setSocket(socketInstance)

    // Clean up on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}

