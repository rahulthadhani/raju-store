import { prisma } from "@/lib/db"

export default async function AdminDashboard() {
    const [totalOrders, totalCustomers, totalProducts, recentOrders] = await Promise.all([
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: true, items: true },
        }),
    ])

    const revenue = await prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "PAID" },
    })

    const stats = [
        { label: "Total Orders", value: totalOrders },
        { label: "Total Customers", value: totalCustomers },
        { label: "Total Products", value: totalProducts },
        { label: "Total Revenue", value: `$${Number(revenue._sum.total || 0).toFixed(2)}` },
    ]

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Dashboard</h1>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                {stats.map(stat => (
                    <div key={stat.label} style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee" }}>
                        <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{stat.label}</p>
                        <p style={{ fontSize: 28, fontWeight: 600 }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Recent Orders</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee" }}>
                            <th style={{ textAlign: "left", padding: "8px", fontSize: 13, color: "#666" }}>Order ID</th>
                            <th style={{ textAlign: "left", padding: "8px", fontSize: 13, color: "#666" }}>Customer</th>
                            <th style={{ textAlign: "left", padding: "8px", fontSize: 13, color: "#666" }}>Items</th>
                            <th style={{ textAlign: "left", padding: "8px", fontSize: 13, color: "#666" }}>Total</th>
                            <th style={{ textAlign: "left", padding: "8px", fontSize: 13, color: "#666" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: "1rem", color: "#666", fontSize: 14 }}>No orders yet</td></tr>
                        ) : (
                            recentOrders.map(order => (
                                <tr key={order.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                    <td style={{ padding: "8px", fontSize: 13 }}>{order.id.slice(0, 8)}...</td>
                                    <td style={{ padding: "8px", fontSize: 13 }}>{order.user.email}</td>
                                    <td style={{ padding: "8px", fontSize: 13 }}>{order.items.length}</td>
                                    <td style={{ padding: "8px", fontSize: 13 }}>${Number(order.total).toFixed(2)}</td>
                                    <td style={{ padding: "8px", fontSize: 13 }}>{order.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}