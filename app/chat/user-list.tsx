"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
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
    <div className="flex-1 flex flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <li key={user.id} className="hover:bg-gray-50 dark:hover:bg-secondary cursor-pointer p-4" onClick={() => onSelectUser(user)}>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{user.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

