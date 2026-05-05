import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import UpdateOrderStatus from "@/components/UpdateOrderStatus"

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: { user: true, items: true },
    })

    if (!order) return notFound()

    return (
        <div style={{ maxWidth: 700 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Order {order.id.slice(0, 8)}...</h1>

            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Customer</h2>
                <p style={{ fontSize: 14, color: "#555" }}>{order.user.email}</p>
                <p style={{ fontSize: 14, color: "#555" }}>{order.user.name}</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Items</h2>
                {order.items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f5f5f5", padding: "8px 0" }}>
                        <span style={{ fontSize: 14 }}>{item.title} x{item.quantity}</span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                    <p style={{ fontSize: 16, fontWeight: 600 }}>Total: ${Number(order.total).toFixed(2)}</p>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Update Status</h2>
                <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
            </div>
        </div>
    )
}