import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AccountPage() {
    const session = await auth()

    if (!session?.user) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
                include: { items: true },
            },
        },
    })

    if (!user) redirect("/login")

    return (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>My Account</h1>

            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Profile</h2>
                <p style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>Name: {user.name || "—"}</p>
                <p style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>Email: {user.email}</p>
                <p style={{ fontSize: 14, color: "#555" }}>Phone: {user.phone || "—"}</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Order History</h2>
                {user.orders.length === 0 ? (
                    <p style={{ fontSize: 14, color: "#666" }}>No orders yet. <Link href="/products">Start shopping</Link></p>
                ) : (
                    user.orders.map(order => (
                        <div key={order.id} style={{ borderBottom: "1px solid #f5f5f5", padding: "1rem 0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 13, color: "#666" }}>Order {order.id.slice(0, 8)}...</span>
                                <span style={{ fontSize: 13, padding: "2px 10px", borderRadius: 99, background: order.status === "DELIVERED" ? "#e6f4ea" : "#fef3cd", color: order.status === "DELIVERED" ? "#1e7e34" : "#856404" }}>
                                    {order.status}
                                </span>
                            </div>
                            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
                                {order.items.map(item => `${item.title} x${item.quantity}`).join(", ")}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "#999" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                <span style={{ fontSize: 14, fontWeight: 600 }}>${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}