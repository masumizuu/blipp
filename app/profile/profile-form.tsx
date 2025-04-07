"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Camera, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfileForm({ user }) {
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [image, setImage] = useState(user?.image || "")
  const [previewImage, setPreviewImage] = useState(user?.image || "")
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef(null)

  // For password reset
  const [email, setEmail] = useState(user?.email || "")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload the image
    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      setImage(data.imageUrl)
      setSuccess("Image uploaded successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error.message || "Error uploading image")
      setPreviewImage(user?.image || "")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess("Profile updated successfully")
      setTimeout(() => {
        setSuccess("")
        router.refresh()
      }, 2000)
    } catch (error) {
      setError(error.message || "Error updating profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setIsSendingOtp(true)
    setError("")

    try {
      const response = await fetch("/api/user/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      setOtpSent(true)
      setSuccess("OTP sent to your email")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error.message || "Error sending OTP")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setIsVerifyingOtp(true)
    setError("")

    try {
      const response = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP")
      }

      setOtpVerified(true)
      setSuccess("OTP verified successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error.message || "Error verifying OTP")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsResettingPassword(true)
    setError("")

    try {
      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password: newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setSuccess("Password reset successfully")
      setTimeout(() => {
        setSuccess("")
        router.push("/login")
      }, 2000)
    } catch (error) {
      setError(error.message || "Error resetting password")
    } finally {
      setIsResettingPassword(false)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <Image src={previewImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-500" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

              <p className="text-sm text-gray-500 mt-2">Click to {user?.image ? "change" : "upload"} profile picture</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>

            <Button type="submit" className="w-full" disabled={isUpdating || isUploading}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>

            <div className="text-center">
              <Button type="button" variant="outline" onClick={() => router.push("/chat")}>
                Back to Chat
              </Button>
            </div>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="password" className="mt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      disabled={true}
                    />
                    <p className="text-xs text-gray-500">We'll send a verification code to this email</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSendingOtp}>
                    {isSendingOtp ? "Sending..." : "Send Verification Code"}
                  </Button>
                </div>
              </form>
            ) : !otpVerified ? (
              <form onSubmit={handleVerifyOtp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter code" />
                    <p className="text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                  </Button>

                  <div className="text-center">
                    <Button type="button" variant="link" onClick={() => setOtpSent(false)}>
                      Back
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isResettingPassword}>
                    {isResettingPassword ? "Resetting..." : "Reset Password"}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setOtpVerified(false)
                        setOtpSent(false)
                      }}
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

