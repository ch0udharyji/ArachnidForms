"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateProfile, updatePassword, deleteAccount } from "@/app/actions/user"
import { Badge } from "@/components/ui/badge"
import { signOut } from "next-auth/react"

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string | null;
    isTestAccount: boolean;
    role: string;
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || ""
  })
  const [password, setPassword] = useState("")

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user.isTestAccount) {
      toast.error("Profile updates are disabled in Test Mode")
      return
    }
    
    setIsSaving(true)
    const res = await updateProfile(profileData)
    setIsSaving(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Profile updated successfully")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user.isTestAccount) {
      toast.error("Password updates are disabled in Test Mode")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    const res = await updatePassword(password)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Password updated successfully")
      setPassword("")
    }
  }

  const handleDeleteAccount = async () => {
    if (user.isTestAccount) {
      toast.error("Test accounts are automatically deleted. You can simply log out.")
      return
    }

    if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      const res = await deleteAccount()
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Account deleted. Logging out...")
        signOut({ callbackUrl: "/" })
      }
    }
  }

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold">Profile Information</h2>
          {user.isTestAccount && <Badge variant="secondary" className="bg-primary/20 text-primary">Test Mode</Badge>}
        </div>
        
        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              disabled={user.isTestAccount}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={user.isTestAccount}
            />
          </div>
          <Button type="submit" disabled={isSaving || user.isTestAccount}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </section>

      {/* Security Section */}
      <section className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Account Security</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={user.isTestAccount}
            />
          </div>
          <Button type="submit" variant="secondary" disabled={user.isTestAccount || !password}>
            Update Password
          </Button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="border border-destructive/20 bg-destructive/5 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount} disabled={user.isTestAccount}>
          Delete Account
        </Button>
      </section>
    </div>
  )
}

// [dev-log-sync]: 176b631f36838d7f