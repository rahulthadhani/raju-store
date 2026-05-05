import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/AddToCartButton"

const prisma = new PrismaClient()

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true, reviews: true },
    })

    if (!product) return notFound()

    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div style={{ background: "#f5f5f5", borderRadius: 8, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.title} style={{ maxWidth: "100%", borderRadius: 8 }} />
                    ) : (
                        <p style={{ color: "#999" }}>No image</p>
                    )}
                </div>
                <div>
                    <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>{product.category.name}</p>
                    <h1 style={{ fontSize: 24, marginBottom: 12 }}>{product.title}</h1>
                    <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>${Number(product.price).toFixed(2)}</p>
                    <p style={{ color: "#555", lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>
                    <AddToCartButton product={{ id: product.id, title: product.title, price: Number(product.price), slug: product.slug }} />
                </div>
            </div>
        </main>
    )
}