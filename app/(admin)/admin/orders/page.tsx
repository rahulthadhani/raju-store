import { PrismaClient } from "@prisma/client"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, items: true },
    })

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Orders</h1>

            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee" }}>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Order ID</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Customer</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Items</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Total</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Status</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Date</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: "1rem", color: "#666", fontSize: 14 }}>No orders yet</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{order.id.slice(0, 8)}...</td>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{order.user.email}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{order.items.length}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>${Number(order.total).toFixed(2)}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: 99, fontSize: 12,
                                            background: order.status === "DELIVERED" ? "#e6f4ea" : order.status === "CANCELLED" ? "#fde8e8" : "#fef3cd",
                                            color: order.status === "DELIVERED" ? "#1e7e34" : order.status === "CANCELLED" ? "#c0392b" : "#856404"
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                                        <Link href={`/admin/orders/${order.id}`} style={{ color: "#000", textDecoration: "none", fontSize: 13 }}>View</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}