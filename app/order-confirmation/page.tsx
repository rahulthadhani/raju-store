import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import Link from "next/link"

export default async function OrderConfirmationPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const { session_id } = await searchParams

    if (session_id) {
        try {
            const stripeSession = await stripe.checkout.sessions.retrieve(session_id, {
                expand: ["line_items"],
            })

            const session = await auth()

            if (session?.user && stripeSession.payment_status === "paid") {
                const user = await prisma.user.findUnique({
                    where: { email: session.user.email! },
                })

                if (user) {
                    const existingOrder = await prisma.order.findFirst({
                        where: { stripeId: session_id },
                    })

                    if (!existingOrder) {
                        const items = stripeSession.line_items?.data || []

                        await prisma.order.create({
                            data: {
                                userId: user.id,
                                stripeId: session_id,
                                status: "PAID",
                                total: (stripeSession.amount_total || 0) / 100,
                                address: stripeSession.customer_details || {},
                                channel: "ONLINE",
                                items: {
                                    create: items.map((item: any) => ({
                                        title: item.description,
                                        price: (item.amount_total / 100) / item.quantity,
                                        quantity: item.quantity,
                                        productId: "unknown",
                                    })),
                                },
                            },
                        })
                    }
                }
            }
        } catch (e) {
            console.error("Error saving order:", e)
        }
    }

    return (
        <main style={{ maxWidth: 600, margin: "100px auto", padding: "2rem 1rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 28, marginBottom: 16 }}>Order Confirmed!</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>Thank you for your purchase. You will receive a confirmation email shortly.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Link href="/account" style={{ padding: "12px 24px", background: "#000", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
                    View Orders
                </Link>
                <Link href="/" style={{ padding: "12px 24px", background: "#f5f5f5", color: "#000", borderRadius: 8, textDecoration: "none" }}>
                    Continue Shopping
                </Link>
            </div>
        </main>
    )
}