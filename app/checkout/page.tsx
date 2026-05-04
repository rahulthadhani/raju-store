"use client"
import { useEffect, useState } from "react"
import { getCart, CartItem } from "@/lib/cartStore"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setCart(getCart())
    }, [])

    async function handleCheckout() {
        setLoading(true)
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }),
        })
        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        }
        setLoading(false)
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
            <h1 style={{ marginBottom: "1.5rem" }}>Checkout</h1>
            {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "0.75rem 0" }}>
                    <span>{item.title} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Total: ${total.toFixed(2)}</p>
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    style={{ padding: "12px 24px", background: "#000", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}
                >
                    {loading ? "Redirecting..." : "Pay with Stripe"}
                </button>
            </div>
        </main>
    )
}