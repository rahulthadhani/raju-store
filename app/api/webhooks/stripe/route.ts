import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")!

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any

        const existing = await prisma.order.findFirst({
            where: { stripeId: session.id },
        })

        if (!existing) {
            const user = await prisma.user.findUnique({
                where: { email: session.customer_details?.email },
            })

            if (user) {
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

                await prisma.order.create({
                    data: {
                        userId: user.id,
                        stripeId: session.id,
                        status: "PAID",
                        total: session.amount_total / 100,
                        address: session.customer_details || {},
                        channel: "ONLINE",
                        items: {
                            create: lineItems.data.map((item: any) => ({
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

    return NextResponse.json({ received: true })
}