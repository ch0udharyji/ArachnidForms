"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, SwitchCamera, LayoutDashboard, Settings, User } from "lucide-react"

export function UserMenu({ user }: { user: any }) {
  const initials = user?.name?.substring(0, 2)?.toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-primary/20">
          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 bg-surface/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl">
        <div className="px-1 py-1.5">
          <div className="flex items-center gap-3 px-1 text-left text-sm">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/20 text-primary rounded-lg font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name || "User"}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          {user?.isTestAccount && (
            <div className="mt-2 px-1 pb-1">
              <div className="bg-primary/10 border border-primary/20 rounded-md px-2 py-1 text-center">
                <span className="text-[10px] text-primary font-mono uppercase tracking-widest font-bold">Test Mode Active</span>
              </div>
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-white/5 my-2" />
        
        <DropdownMenuGroup className="space-y-1">
          <Link href="/dashboard" passHref>
            <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-white/5 focus:bg-white/5 transition-colors">
              <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/api-keys" passHref>
            <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-white/5 focus:bg-white/5 transition-colors">
              <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
              <span>Integrations</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-white/5 my-2" />
        
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-white/5 focus:bg-white/5 transition-colors" onClick={() => signOut({ callbackUrl: "/login" })}>
            <SwitchCamera className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>Switch Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg transition-colors" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="mr-3 h-4 w-4 text-destructive/70" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// [dev-log-sync]: 43d81918705efad7