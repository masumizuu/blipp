import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import ChatLayout from "./chat-layout"

export default async function ChatPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <ChatLayout />
}

