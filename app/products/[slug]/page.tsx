import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/AddToCartButton"
import ReviewForm from "@/components/ReviewForm"
import { auth } from "@/lib/auth"

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const session = await auth()

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            reviews: {
                include: { user: true },
                orderBy: { createdAt: "desc" },
            },
        },
    })

    if (!product) return notFound()

    const avgRating = product.reviews.length
        ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
        : null

    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
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
                    {avgRating && (
                        <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>⭐ {avgRating} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})</p>
                    )}
                    <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>${Number(product.price).toFixed(2)}</p>
                    {product.compareAt && (
                        <p style={{ textDecoration: "line-through", color: "#999", marginBottom: 8 }}>
                            ${Number(product.compareAt).toFixed(2)}
                        </p>
                    )}
                    <p style={{ color: "#555", lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>
                    <AddToCartButton product={{ id: product.id, title: product.title, price: Number(product.price), slug: product.slug }} />
                </div>
            </div>

            {/* Reviews */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "2rem" }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: "1.5rem" }}>Reviews</h2>

                {product.reviews.length === 0 ? (
                    <p style={{ color: "#666", marginBottom: "2rem" }}>No reviews yet. Be the first!</p>
                ) : (
                    <div style={{ marginBottom: "2rem" }}>
                        {product.reviews.map(review => (
                            <div key={review.id} style={{ borderBottom: "1px solid #f5f5f5", padding: "1rem 0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>{review.user.name || review.user.email}</span>
                                    <span style={{ fontSize: 13, color: "#666" }}>{"⭐".repeat(review.rating)}</span>
                                </div>
                                {review.body && <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{review.body}</p>}
                                <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {session?.user ? (
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Write a Review</h3>
                        <ReviewForm productId={product.id} />
                    </div>
                ) : (
                    <p style={{ fontSize: 14, color: "#666" }}>
                        <a href="/login" style={{ color: "#000" }}>Sign in</a> to leave a review
                    </p>
                )}
            </div>
        </main>
    )
}