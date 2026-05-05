import { prisma } from "@/lib/db"
import Link from "next/link"
import SearchBar from "@/components/SearchBar"

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
    const { category, sort, q } = await searchParams

    const categories = await prisma.category.findMany()

    const products = await prisma.product.findMany({
        where: {
            isPublished: true,
            ...(category && { category: { slug: category } }),
            ...(q && {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            }),
        },
        include: { category: true },
        orderBy:
            sort === "price_asc" ? { price: "asc" } :
                sort === "price_desc" ? { price: "desc" } :
                    { createdAt: "desc" },
    })

    return (
        <main style={{ background: "var(--light)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>

                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 500, color: "var(--black)", marginBottom: "1.5rem" }}>
                    {q ? `Results for "${q}"` : category ? categories.find(c => c.slug === category)?.name || "Products" : "All Products"}
                </h1>

                {/* Search */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <SearchBar />
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: 8, marginBottom: "2rem", flexWrap: "wrap" }}>
                    <Link href="/products" style={{ padding: "7px 16px", border: `1px solid ${!category && !sort ? "var(--red)" : "var(--border)"}`, borderRadius: 99, fontSize: 13, color: !category && !sort ? "var(--red)" : "var(--gray)", background: "var(--white)" }}>
                        All
                    </Link>
                    {categories.map(cat => (
                        <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ padding: "7px 16px", border: `1px solid ${category === cat.slug ? "var(--red)" : "var(--border)"}`, borderRadius: 99, fontSize: 13, color: category === cat.slug ? "var(--red)" : "var(--gray)", background: "var(--white)" }}>
                            {cat.name}
                        </Link>
                    ))}
                    <Link href="/products?sort=price_asc" style={{ padding: "7px 16px", border: `1px solid ${sort === "price_asc" ? "var(--red)" : "var(--border)"}`, borderRadius: 99, fontSize: 13, color: sort === "price_asc" ? "var(--red)" : "var(--gray)", background: "var(--white)" }}>
                        Price: Low → High
                    </Link>
                    <Link href="/products?sort=price_desc" style={{ padding: "7px 16px", border: `1px solid ${sort === "price_desc" ? "var(--red)" : "var(--border)"}`, borderRadius: 99, fontSize: 13, color: sort === "price_desc" ? "var(--red)" : "var(--gray)", background: "var(--white)" }}>
                        Price: High → Low
                    </Link>
                </div>

                {/* Grid */}
                {products.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray)" }}>
                        <p style={{ fontSize: 16, marginBottom: 12 }}>No products found.</p>
                        <Link href="/products" style={{ color: "var(--red)", fontSize: 14 }}>Clear filters →</Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                        {products.map(product => (
                            <Link key={product.id} href={`/products/${product.slug}`} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", display: "block" }}>
                                <div style={{ height: 180, background: "var(--light)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)" }}>
                                    {product.images[0] ? (
                                        <img src={product.images[0]} alt={product.title} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                                    ) : (
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    )}
                                </div>
                                <div style={{ padding: "1rem" }}>
                                    <div style={{ fontSize: 11, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{product.category.name}</div>
                                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--black)", marginBottom: 10, lineHeight: 1.4 }}>{product.title}</div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: "var(--red)" }}>
                                            ${Number(product.price).toFixed(2)}
                                            {product.compareAt && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--gray)", textDecoration: "line-through", marginLeft: 6 }}>${Number(product.compareAt).toFixed(2)}</span>}
                                        </div>
                                        <div style={{ width: 32, height: 32, background: "var(--red)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20 }}>+</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}