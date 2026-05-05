"use client"
import { useEffect, useState } from "react"
import { getCart, removeFromCart, updateQuantity, CartItem } from "@/lib/cartStore"
import Link from "next/link"

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => { setCart(getCart()) }, [])

    function handleRemove(id: string) {
        removeFromCart(id)
        setCart(getCart())
    }

    function handleQuantity(id: string, quantity: number) {
        if (quantity < 1) return
        updateQuantity(id, quantity)
        setCart(getCart())
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <main style={{ background: "var(--light)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem" }}>

                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 500, color: "var(--black)", marginBottom: "2rem" }}>
                    Your Cart {count > 0 && <span style={{ fontSize: 18, color: "var(--gray)", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>({count} item{count !== 1 ? "s" : ""})</span>}
                </h1>

                {cart.length === 0 ? (
                    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, padding: "4rem", textAlign: "center" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                        <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 20 }}>Your cart is empty</p>
                        <Link href="/products" style={{ background: "var(--red)", color: "white", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

                        {/* Items */}
                        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                            {cart.map((item, i) => (
                                <div key={item.id} style={{ padding: "1.25rem 1.5rem", borderBottom: i < cart.length - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--black)", marginBottom: 4 }}>{item.title}</div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--red)" }}>${item.price.toFixed(2)}</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                                            <button onClick={() => handleQuantity(item.id, item.quantity - 1)} style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--charcoal)" }}>−</button>
                                            <span style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 500 }}>{item.quantity}</span>
                                            <button onClick={() => handleQuantity(item.id, item.quantity + 1)} style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--charcoal)" }}>+</button>
                                        </div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "var(--black)", minWidth: 70, textAlign: "right" }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button onClick={() => handleRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray)", fontSize: 13, padding: "4px" }}>✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", position: "sticky", top: 88 }}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: "var(--black)", marginBottom: "1.25rem" }}>Order Summary</h2>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <span style={{ fontSize: 14, color: "var(--gray)" }}>Subtotal</span>
                                <span style={{ fontSize: 14, color: "var(--black)" }}>${total.toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <span style={{ fontSize: 14, color: "var(--gray)" }}>Shipping</span>
                                <span style={{ fontSize: 14, color: total >= 50 ? "#1e7e34" : "var(--black)" }}>{total >= 50 ? "Free" : "Calculated at checkout"}</span>
                            </div>
                            {total < 50 && (
                                <div style={{ background: "var(--red-light)", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
                                    <span style={{ fontSize: 12, color: "var(--red-dark)" }}>Add ${(50 - total).toFixed(2)} more for free shipping</span>
                                </div>
                            )}
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                                <span style={{ fontSize: 16, fontWeight: 500, color: "var(--black)" }}>Total</span>
                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: "var(--black)" }}>${total.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" style={{ display: "block", background: "var(--red)", color: "white", padding: "13px", borderRadius: 8, fontSize: 14, fontWeight: 500, textAlign: "center" }}>
                                Proceed to Checkout
                            </Link>
                            <Link href="/products" style={{ display: "block", textAlign: "center", fontSize: 13, color: "var(--gray)", marginTop: 12 }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}