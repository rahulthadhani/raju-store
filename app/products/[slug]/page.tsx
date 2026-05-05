import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/AddToCartButton"
import ReviewForm from "@/components/ReviewForm"
import { auth } from "@/lib/auth"
import Link from "next/link"

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
            reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
        },
    })

    if (!product) return notFound()

    const avgRating = product.reviews.length
        ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
        : null

    return (
        <main style={{ background: "var(--light)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>

                {/* Breadcrumb */}
                <div style={{ fontSize: 13, color: "var(--gray)", marginBottom: "2rem" }}>
                    <Link href="/" style={{ color: "var(--gray)" }}>Home</Link>
                    <span style={{ margin: "0 8px" }}>›</span>
                    <Link href="/products" style={{ color: "var(--gray)" }}>Products</Link>
                    <span style={{ margin: "0 8px" }}>›</span>
                    <span style={{ color: "var(--black)" }}>{product.title}</span>
                </div>

                {/* Product */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>

                    {/* Image */}
                    <div style={{ background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                        {product.images[0] ? (
                            <img src={product.images[0]} alt={product.title} style={{ maxWidth: "100%", maxHeight: 380, objectFit: "contain" }} />
                        ) : (
                            <div style={{ textAlign: "center" }}>
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                <p style={{ fontSize: 13, color: "var(--gray)", marginTop: 12 }}>No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{product.category.name}</div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 500, color: "var(--black)", lineHeight: 1.3, marginBottom: 12 }}>{product.title}</h1>

                        {avgRating && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <span style={{ color: "var(--red)", fontSize: 14 }}>{"★".repeat(Math.round(Number(avgRating)))}</span>
                                <span style={{ fontSize: 14, color: "var(--gray)" }}>{avgRating} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})</span>
                            </div>
                        )}

                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 500, color: "var(--red)" }}>${Number(product.price).toFixed(2)}</span>
                            {product.compareAt && (
                                <span style={{ fontSize: 16, color: "var(--gray)", textDecoration: "line-through" }}>${Number(product.compareAt).toFixed(2)}</span>
                            )}
                        </div>

                        <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.8, marginBottom: 28 }}>{product.description}</p>

                        <AddToCartButton product={{ id: product.id, title: product.title, price: Number(product.price), slug: product.slug }} />

                        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                            {[["Free shipping", "over $50"], ["Easy returns", "30 day policy"], ["Secure checkout", "SSL encrypted"]].map(([title, sub]) => (
                                <div key={title}>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--black)" }}>{title}</div>
                                    <div style={{ fontSize: 12, color: "var(--gray)" }}>{sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, color: "var(--black)", marginBottom: "1.5rem" }}>
                        Customer Reviews
                    </h2>

                    {product.reviews.length === 0 ? (
                        <p style={{ color: "var(--gray)", fontSize: 15, marginBottom: "2rem" }}>No reviews yet — be the first to share your thoughts!</p>
                    ) : (
                        <div style={{ marginBottom: "2rem" }}>
                            {product.reviews.map(review => (
                                <div key={review.id} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem", marginBottom: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                        <div>
                                            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--black)" }}>{review.user.name || review.user.email}</span>
                                            <span style={{ fontSize: 12, color: "var(--gray)", marginLeft: 10 }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span style={{ color: "var(--red)", fontSize: 14 }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                                    </div>
                                    {review.body && <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.7 }}>{review.body}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {session?.user ? (
                        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.5rem" }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, color: "var(--black)", marginBottom: "1rem" }}>Write a Review</h3>
                            <ReviewForm productId={product.id} />
                        </div>
                    ) : (
                        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.5rem", textAlign: "center" }}>
                            <p style={{ fontSize: 14, color: "var(--gray)" }}>
                                <Link href="/login" style={{ color: "var(--red)", fontWeight: 500 }}>Sign in</Link> to leave a review
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}