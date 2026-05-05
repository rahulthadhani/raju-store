import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Navbar() {
    const session = await auth()
    const user = session?.user as any

    return (
        <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 2rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
            <Link href="/" style={{ fontSize: 18, fontWeight: 700, textDecoration: "none", color: "#000" }}>
                Raju Store
            </Link>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Link href="/products" style={{ fontSize: 14, textDecoration: "none", color: "#555", padding: "6px 12px" }}>Products</Link>
                <Link href="/cart" style={{ fontSize: 14, textDecoration: "none", color: "#555", padding: "6px 12px" }}>Cart</Link>
                {session?.user ? (
                    <>
                        <Link href="/account" style={{ fontSize: 14, textDecoration: "none", color: "#555", padding: "6px 12px" }}>Account</Link>
                        {user?.role === "ADMIN" && (
                            <Link href="/admin" style={{ fontSize: 14, textDecoration: "none", color: "#fff", background: "#000", padding: "6px 14px", borderRadius: 6 }}>Admin</Link>
                        )}
                        <Link href="/api/auth/signout" style={{ fontSize: 14, textDecoration: "none", color: "#555", padding: "6px 12px" }}>Sign out</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ fontSize: 14, textDecoration: "none", color: "#555", padding: "6px 12px" }}>Sign in</Link>
                        <Link href="/register" style={{ fontSize: 14, textDecoration: "none", color: "#fff", background: "#000", padding: "6px 14px", borderRadius: 6 }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}