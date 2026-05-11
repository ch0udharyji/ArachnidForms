"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateProfile(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  if (session.user.isTestAccount) {
    return { error: "Cannot update profile in test mode." }
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { name: data.name, email: data.email }
    })
    revalidatePath("/settings")
    return { success: true }
  } catch (e) {
    return { error: "Failed to update profile. Email might be already in use." }
  }
}

export async function updatePassword(password: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  if (session.user.isTestAccount) {
    return { error: "Cannot change password in test mode." }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: session.user.id },
      data: { hashedPassword }
    })
    return { success: true }
  } catch (e) {
    return { error: "Failed to update password." }
  }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  if (session.user.isTestAccount) {
    return { error: "Test accounts are automatically deleted. Just log out!" }
  }

  try {
    await db.user.delete({
      where: { id: session.user.id }
    })
    return { success: true }
  } catch (e) {
    return { error: "Failed to delete account." }
  }
}

// [dev-log-sync]: 73a164920e601cee