"use client"
import { useEffect, useState } from "react"
import { getCart, CartItem } from "@/lib/cartStore"

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => { setCart(getCart()) }, [])

    async function handleCheckout() {
        setLoading(true)
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }),
        })
        const data = await res.json()
        if (data.url) window.location.href = data.url
        setLoading(false)
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <main style={{ background: "var(--light)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem" }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 500, color: "var(--black)", marginBottom: "2rem" }}>Checkout</h1>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

                    {/* Order items */}
                    <div>
                        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: "1.5rem" }}>
                            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "var(--black)" }}>Order Items</h2>
                            </div>
                            {cart.map((item, i) => (
                                <div key={item.id} style={{ padding: "1rem 1.5rem", borderBottom: i < cart.length - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--black)" }}>{item.title}</div>
                                        <div style={{ fontSize: 13, color: "var(--gray)" }}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--black)" }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                            {[["🔒", "Secure Payment", "SSL encrypted"], ["📦", "Fast Shipping", "2-5 business days"], ["↩", "Easy Returns", "30 day policy"]].map(([icon, title, sub]) => (
                                <div key={title} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
                                    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--black)" }}>{title}</div>
                                    <div style={{ fontSize: 11, color: "var(--gray)" }}>{sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment summary */}
                    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", position: "sticky", top: 88 }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: "var(--black)", marginBottom: "1.25rem" }}>Payment</h2>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 14, color: "var(--gray)" }}>Subtotal</span>
                            <span style={{ fontSize: 14 }}>${total.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 14, color: "var(--gray)" }}>Shipping</span>
                            <span style={{ fontSize: 14, color: total >= 50 ? "#1e7e34" : "var(--black)" }}>{total >= 50 ? "Free" : "TBD"}</span>
                        </div>
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                            <span style={{ fontSize: 16, fontWeight: 500 }}>Total</span>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, color: "var(--black)" }}>${total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                            style={{ width: "100%", padding: "13px", background: loading ? "var(--gray)" : "var(--red)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {loading ? "Redirecting to Stripe..." : "Pay with Stripe →"}
                        </button>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
                            <span style={{ fontSize: 11, color: "var(--gray)" }}>Powered by</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--charcoal)" }}>Stripe</span>
                            <span style={{ fontSize: 11, color: "var(--gray)" }}>— 100% secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}