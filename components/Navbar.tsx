"use client"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import SignOutButton from "@/components/SignOutButton"

export default function Navbar() {
    const { data: session, status } = useSession()
    const user = session?.user as any

    return (
        <nav style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "0 2rem", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
            <Link href="/">
                <Image src="/logo.jpeg" alt="Raju's Store" width={130} height={44} style={{ objectFit: "contain" }} />
            </Link>

            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <Link href="/products" style={{ fontSize: 14, color: "var(--gray)", padding: "6px 14px" }}>Products</Link>
                <Link href="/cart" style={{ fontSize: 14, color: "var(--gray)", padding: "6px 14px" }}>Cart</Link>
                {status !== "loading" && (
                    <>
                        {session?.user ? (
                            <>
                                <Link href="/account" style={{ fontSize: 14, color: "var(--gray)", padding: "6px 14px" }}>Account</Link>
                                {user?.role === "ADMIN" && (
                                    <Link href="/admin" style={{ fontSize: 13, color: "var(--white)", background: "var(--charcoal)", padding: "8px 16px", borderRadius: 6 }}>Admin</Link>
                                )}
                                <SignOutButton />
                            </>
                        ) : (
                            <>
                                <Link href="/login" style={{ fontSize: 14, color: "var(--gray)", padding: "6px 14px" }}>Sign in</Link>
                                <Link href="/register" style={{ fontSize: 13, color: "var(--white)", background: "var(--red)", padding: "8px 18px", borderRadius: 6, fontWeight: 500 }}>Register</Link>
                            </>
                        )}
                    </>
                )}
            </div>
        </nav>
    )
}