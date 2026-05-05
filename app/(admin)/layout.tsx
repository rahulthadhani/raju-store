import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const user = session.user as any

    if (user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <aside style={{ width: 240, background: "#111", color: "#fff", padding: "2rem 1rem", display: "flex", flexDirection: "column", gap: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.5rem", color: "#fff" }}>Raju Store Admin</h2>
                <a href="/admin" style={{ color: "#ccc", textDecoration: "none", padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>Dashboard</a>
                <a href="/admin/products" style={{ color: "#ccc", textDecoration: "none", padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>Products</a>
                <a href="/admin/inventory" style={{ color: "#ccc", textDecoration: "none", padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>Inventory</a>
                <a href="/admin/orders" style={{ color: "#ccc", textDecoration: "none", padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>Orders</a>
                <a href="/admin/customers" style={{ color: "#ccc", textDecoration: "none", padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>Customers</a>
            </aside>
            <main style={{ flex: 1, padding: "2rem", background: "#f9f9f9" }}>
                {children}
            </main>
        </div>
    )
}