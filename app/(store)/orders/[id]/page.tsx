import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"

const statusSteps = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"]

export default async function OrderTrackingPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await auth()

    if (!session?.user) redirect("/login")

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true, user: true },
    })

    if (!order) return notFound()

    const currentStep = statusSteps.indexOf(order.status)

    return (
        <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Track Order</h1>

            {/* Status tracker */}
            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    {statusSteps.map((step, i) => (
                        <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                background: i <= currentStep ? "#000" : "#eee",
                                color: i <= currentStep ? "#fff" : "#999",
                                fontSize: 13, fontWeight: 600, marginBottom: 6
                            }}>
                                {i + 1}
                            </div>
                            <span style={{ fontSize: 11, color: i <= currentStep ? "#000" : "#999", textAlign: "center" }}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order items */}
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

            {/* Shipping address */}
            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", border: "1px solid #eee" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Shipping Address</h2>
                {order.address ? (
                    <div style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
                        {typeof order.address === "object" && (
                            <>
                                <p>{(order.address as any).line1}</p>
                                <p>{(order.address as any).city}, {(order.address as any).state} {(order.address as any).zip}</p>
                                <p>{(order.address as any).country}</p>
                            </>
                        )}
                    </div>
                ) : (
                    <p style={{ fontSize: 14, color: "#666" }}>No address on file</p>
                )}
            </div>
        </main>
    )
}