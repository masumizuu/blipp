"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import useSound from 'use-sound'

interface Conversation {
  id: string
  otherUser: {
    name: string
    image?: string
  }
  lastMessage?: {
    content: string
  }
  updatedAt: string
  unreadCount: number
}

export default function ConversationList({
  activeConversationId,
  onSelectConversation,
  unreadCounts,
  updateUnreadCount,
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const lastUpdateRef = useRef<string | null>(null)

  // Notification sound
  const [play] = useSound('/blipp.mp3')

  // Fetch conversations function that can be reused
  const fetchConversations = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true)
        }

        const response = await fetch("/api/conversations")
        const data: Conversation[] = await response.json()

        // Check if there are any changes before updating state
        const currentJson = JSON.stringify(data)
        if (!lastUpdateRef.current || lastUpdateRef.current !== currentJson) {
          setConversations(data)

          let shouldPlaySound = false

          // Initialize unread counts
          data.forEach((conversation: Conversation) => {
            const previous = conversations.find((c: Conversation) => c.id === conversation.id)
            if (
              previous &&
              conversation.unreadCount > previous.unreadCount
            ) {
              shouldPlaySound = true
            }

            // Update unread count regardless
            updateUnreadCount(conversation.id, conversation.unreadCount)
          })

          if (shouldPlaySound) {
            play()
          }

          setConversations(data)
          lastUpdateRef.current = currentJson
        }

        if (isInitialLoad) {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
        if (isInitialLoad) {
          setLoading(false)
        }
      }
    },
    [updateUnreadCount, play],
  )

  // Initial load
  useEffect(() => {
    fetchConversations(true)
  }, [fetchConversations])

  // Background polling with minimal UI impact
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchConversations(false)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [fetchConversations])

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-muted"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No conversations yet. Start a new one!</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const unreadCount = unreadCounts[conversation.id] || conversation.unreadCount

            return (
              <li
                key={conversation.id}
                className={`hover:bg-gray-50 dark:hover:bg-secondary cursor-pointer p-4 ${
                  conversation.id === activeConversationId ? "bg-gray-100 dark:bg-secondary" : ""
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={conversation.otherUser.image || undefined} />
                    <AvatarFallback>{conversation.otherUser.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conversation.otherUser.name}</p>
                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage ? conversation.lastMessage.content : "Start a conversation"}
                      </p>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

