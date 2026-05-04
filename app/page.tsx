import { PrismaClient } from "@prisma/client"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    take: 8,
  })

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Welcome to Raju Store</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
        {products.map(product => (
          <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 8, padding: "1rem", cursor: "pointer" }}>
              <h2 style={{ fontSize: 16, marginBottom: 8 }}>{product.title}</h2>
              <p style={{ color: "#666", marginBottom: 8 }}>{product.description}</p>
              <p style={{ fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}