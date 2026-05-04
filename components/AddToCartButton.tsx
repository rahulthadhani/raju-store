"use client"
import { addToCart } from "@/lib/cartStore"
import { useRouter } from "next/navigation"

export default function AddToCartButton({
    product,
}: {
    product: { id: string; title: string; price: number; slug: string }
}) {
    function handleAdd() {
        addToCart({
            id: product.id,
            title: product.title,
            price: Number(product.price),
            quantity: 1,
            slug: product.slug,
        })
        alert("Added to cart!")
    }

    return (
        <button
            onClick={handleAdd}
            style={{ width: "100%", padding: "14px", background: "#000", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}
        >
            Add to Cart
        </button>
    )
}