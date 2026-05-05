import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import SearchBar from "@/components/SearchBar"

const prisma = new PrismaClient()

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
            ...(category && {
                category: { slug: category },
            }),
            ...(q && {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            }),
        },
        include: { category: true },
        orderBy:
            sort === "price_asc"
                ? { price: "asc" }
                : sort === "price_desc"
                    ? { price: "desc" }
                    : { createdAt: "desc" },
    })

    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
            <h1 style={{ marginBottom: "1.5rem" }}>All Products</h1>

            <div style={{ marginBottom: "1.5rem" }}>
                <SearchBar />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
                <Link href="/products" style={{ padding: "6px 14px", border: "1px solid #ddd", borderRadius: 99, textDecoration: "none", color: "inherit", fontSize: 13 }}>
                    All
                </Link>
                {categories.map(cat => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ padding: "6px 14px", border: "1px solid #ddd", borderRadius: 99, textDecoration: "none", color: "inherit", fontSize: 13 }}>
                        {cat.name}
                    </Link>
                ))}
                <Link href="/products?sort=price_asc" style={{ padding: "6px 14px", border: "1px solid #ddd", borderRadius: 99, textDecoration: "none", color: "inherit", fontSize: 13 }}>
                    Price: Low → High
                </Link>
                <Link href="/products?sort=price_desc" style={{ padding: "6px 14px", border: "1px solid #ddd", borderRadius: 99, textDecoration: "none", color: "inherit", fontSize: 13 }}>
                    Price: High → Low
                </Link>
            </div>

            {products.length === 0 ? (
                <p style={{ color: "#666" }}>No products found.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                    {products.map(product => (
                        <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <div style={{ border: "1px solid #eee", borderRadius: 8, padding: "1rem" }}>
                                <p style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>{product.category.name}</p>
                                <h2 style={{ fontSize: 15, marginBottom: 8 }}>{product.title}</h2>
                                <p style={{ fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}