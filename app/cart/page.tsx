"use client"
import { useEffect, useState } from "react"
import { getCart, removeFromCart, updateQuantity, CartItem } from "@/lib/cartStore"
import Link from "next/link"

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => {
        setCart(getCart())
    }, [])

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

    return (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
            <h1 style={{ marginBottom: "1.5rem" }}>Your Cart</h1>
            {cart.length === 0 ? (
                <div>
                    <p style={{ color: "#666", marginBottom: 16 }}>Your cart is empty.</p>
                    <Link href="/products">Continue shopping</Link>
                </div>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "1rem 0" }}>
                            <div>
                                <p style={{ fontWeight: 500 }}>{item.title}</p>
                                <p style={{ color: "#666", fontSize: 14 }}>${item.price.toFixed(2)} each</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <button onClick={() => handleQuantity(item.id, item.quantity - 1)} style={{ padding: "4px 10px", cursor: "pointer" }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantity(item.id, item.quantity + 1)} style={{ padding: "4px 10px", cursor: "pointer" }}>+</button>
                                <button onClick={() => handleRemove(item.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                        <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Total: ${total.toFixed(2)}</p>
                        <Link href="/checkout" style={{ padding: "12px 24px", background: "#000", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
                            Proceed to Checkout
                        </Link>
                    </div>
                </>
            )}
        </main>
    )
}