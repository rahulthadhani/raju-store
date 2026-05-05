"use client"
import { addToCart } from "@/lib/cartStore"
import { useState } from "react"

export default function AddToCartButton({
    product,
}: {
    product: { id: string; title: string; price: number; slug: string }
}) {
    const [added, setAdded] = useState(false)

    function handleAdd() {
        addToCart({ id: product.id, title: product.title, price: product.price, quantity: 1, slug: product.slug })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <button
            onClick={handleAdd}
            style={{ width: "100%", padding: "14px", background: added ? "#1e7e34" : "var(--red)", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background .2s" }}
        >
            {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
    )
}