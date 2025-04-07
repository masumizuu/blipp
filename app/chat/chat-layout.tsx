"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ConversationList from "./conversation-list"
import ChatWindow from "./chat-window"
import UserList from "./user-list"
import { Button } from "@/components/ui/button"
import { LogOut, Users, User } from "lucide-react"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ChatLayout() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeConversation, setActiveConversation] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState({})
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation)
    setShowUserList(false)

    // Update unread counts
    if (conversation) {
      setUnreadCounts((prev) => ({
        ...prev,
        [conversation.id]: 0,
      }))
    }
  }

  const handleNewConversation = (user) => {
    // Create a new conversation with the selected user
    fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Create a conversation object with the necessary structure
        const newConversation = {
          id: data.id,
          otherUser: user,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: new Date(),
        }
        setActiveConversation(newConversation)
        setShowUserList(false)
      })
  }

  const updateUnreadCount = (conversationId, count) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [conversationId]: count,
    }))
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {(!isMobile || (isMobile && !activeConversation)) && (
        <div className="w-full md:w-80 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setShowUserList(!showUserList)}>
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
                <User className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {showUserList ? (
            <UserList onSelectUser={handleNewConversation} />
          ) : (
            <ConversationList
              activeConversationId={activeConversation?.id}
              onSelectConversation={handleConversationSelect}
              unreadCounts={unreadCounts}
              updateUnreadCount={updateUnreadCount}
            />
          )}
        </div>
      )}

      {/* Chat Window */}
      {(!isMobile || (isMobile && activeConversation)) && (
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onBack={() => setActiveConversation(null)}
              isMobile={isMobile}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground">Select a conversation or start a new one</h3>
                <p className="text-foreground/80 mt-1">
                  Choose from your existing conversations or click the users icon to start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

