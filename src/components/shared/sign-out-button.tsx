"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton({ isTestAccount }: { isTestAccount?: boolean }) {
  return (
    <Button
      variant="outline"
      className="text-xs font-semibold h-8 border-border"
      onClick={async () => {
        if (isTestAccount) {
          await fetch("/api/auth/delete-test-account", { method: "POST" }).catch(() => {});
        }
        await signOut({ redirect: false });
        window.location.assign("/login");
      }}
    >
      <LogOut className="w-3.5 h-3.5 mr-2" />
      Sign Out
    </Button>
  );
}
