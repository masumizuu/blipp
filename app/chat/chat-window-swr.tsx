"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

// Fetcher function for SWR
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function ChatWindow({ conversation, onBack, isMobile }) {
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  // Use SWR for data fetching with automatic revalidation
  const {
    data: messages,
    isLoading,
    mutate,
  } = useSWR(conversation ? `/api/conversations/${conversation.id}/messages` : null, fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds
    revalidateOnFocus: true,
    dedupingInterval: 1000, // Deduplicate requests within 1 second
  })

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      // Optimistic update
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: newMessage,
        senderId: session?.user?.id,
        conversationId: conversation.id,
        createdAt: new Date().toISOString(),
        sender: {
          id: session?.user?.id,
          name: session?.user?.name,
          image: session?.user?.image,
        },
      }

      // Update local data immediately
      mutate([...(messages || []), optimisticMessage], false)
      setNewMessage("")

      // Send to server
      await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      })

      // Revalidate data
      mutate()
    } catch (error) {
      console.error("Error sending message:", error)
      // Revalidate to remove optimistic update if it failed
      mutate()
    }
  }

  if (!conversation) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.otherUser.image || undefined} />
          <AvatarFallback>{conversation.otherUser.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h2 className="font-medium">{conversation.otherUser.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-secondary">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${i % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}`}>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No messages yet. Start the conversation!</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === session?.user?.id
              const isOptimistic = message.id.startsWith("temp-")

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end space-x-2">
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender?.image || undefined} />
                        <AvatarFallback>{message.sender?.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-gray-100"
                      } ${isOptimistic ? "opacity-70" : ""}`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-gray-500"}`}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

