"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

interface User {
  id: string
  name: string
  image?: string
}

interface Conversation {
  id: string
  otherUser: User
  lastMessage?: {
    content: string
  }
  updatedAt: string
  unreadCount: number
}

interface ConversationListProps {
  activeConversationId: string
  onSelectConversation: (conversation: Conversation) => void
  unreadCounts: Record<string, number>
  updateUnreadCount: (conversationId: string, count: number) => void
}

// Fetcher function for SWR
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())

export default function ConversationList({
  activeConversationId,
  onSelectConversation,
  unreadCounts,
  updateUnreadCount,
}: ConversationListProps) {
  // Use SWR for data fetching with automatic revalidation
  const { data: conversations, isLoading } = useSWR<Conversation[]>("/api/conversations", fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
    revalidateOnFocus: true,
    onSuccess: (data) => {
      // Update unread counts when data is fetched
      data.forEach((conversation) => {
        updateUnreadCount(conversation.id, conversation.unreadCount)
      })
    },
  })

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-muted"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded dark:bg-inherit"></div>
                <div className="h-3 w-32 bg-gray-200 rounded mt-2 dark:bg-inherit"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {!conversations || conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No conversations yet. Start a new one!</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const unreadCount = unreadCounts[conversation.id] || conversation.unreadCount

            return (
              <li
                key={conversation.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-100 cursor-pointer p-4 ${
                  conversation.id === activeConversationId ? "bg-gray-100" : ""
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

