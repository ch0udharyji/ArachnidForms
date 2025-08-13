"use client"

import { useEffect, useState } from "react"
import { Timer } from "lucide-react"
import { signOut } from "next-auth/react"

export function SessionTimer({ expiry }: { expiry: number }) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const calculateTimeLeft = () => Math.max(0, expiry - Date.now())
    
    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        clearInterval(interval)
        signOut({ callbackUrl: "/login" })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiry])

  if (timeLeft <= 0) return null

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)
  
  const isWarning = minutes < 5

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-colors ${
      isWarning 
        ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" 
        : "bg-primary/10 text-primary border-primary/20"
    }`}>
      <Timer className="w-3.5 h-3.5" />
      <span>
        TEST SESSION: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

// [dev-log-sync]: 00c824244b2e70ac