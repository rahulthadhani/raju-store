import { prisma } from "@/lib/db"

export default async function CustomersPage() {
    const customers = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        include: { orders: true },
    })

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Customers</h1>

            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee" }}>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Name</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Email</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Phone</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Orders</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: "1rem", color: "#666", fontSize: 14 }}>No customers yet</td></tr>
                        ) : (
                            customers.map(customer => (
                                <tr key={customer.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{customer.name || "—"}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{customer.email}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{customer.phone || "—"}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{customer.orders.length}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{new Date(customer.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}