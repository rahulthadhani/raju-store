"use client"
import { signOut } from "next-auth/react"

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ fontSize: 14, textDecoration: "none", color: "#555", padding: "6px 12px", background: "none", border: "none", cursor: "pointer" }}
        >
            Sign out
        </button>
    )
}