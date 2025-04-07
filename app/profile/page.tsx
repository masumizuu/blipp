import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import ProfileForm from "./profile-form"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-muted to-background dark:from-background dark:to-muted">
      <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center mb-6">Your Profile</h1>
          <ProfileForm user={session.user} />
        </div>
      </div>
    </div>
  )
}

