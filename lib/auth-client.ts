"use client"

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Logout failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
