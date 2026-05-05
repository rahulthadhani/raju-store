import { prisma } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    take: 6,
    include: { category: true },
  })

  const categories = await prisma.category.findMany({
    take: 4,
  })

  return (
    <main style={{ background: "var(--light)" }}>

      {/* HERO */}
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--red)", marginBottom: "1rem" }}>
              Punta Gorda's Variety Store
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 500, color: "var(--black)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              Everything you need,{" "}
              <em style={{ color: "var(--red)", fontStyle: "italic" }}>all in one place</em>
            </h1>
            <p style={{ fontSize: 16, color: "var(--gray)", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 440 }}>
              From everyday essentials to special finds — quality products at honest prices, always in stock.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/products" style={{ background: "var(--red)", color: "var(--white)", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
                Shop Now
              </Link>
              <Link href="/products" style={{ background: "transparent", color: "var(--charcoal)", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "1px solid var(--border)" }}>
                Browse Categories
              </Link>
            </div>
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "2.5rem" }}>
              {[["500+", "Products"], ["2,400+", "Customers"], ["4.9★", "Rating"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, color: "var(--black)" }}>{num}</div>
                  <div style={{ fontSize: 12, color: "var(--gray)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--light)", borderRadius: 16, border: "1px solid var(--border)", height: 380, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16, background: "var(--red)", color: "white", padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>
              New Arrivals
            </div>
            <Image src="/logo.jpeg" alt="Raju's Store" width={260} height={130} style={{ objectFit: "contain", opacity: 0.85 }} />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section style={{ padding: "3rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, color: "var(--black)" }}>Shop by Category</h2>
            <Link href="/products" style={{ fontSize: 13, color: "var(--red)" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem", display: "block", transition: "border-color .15s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--red-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--black)", marginBottom: 2 }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "0 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, color: "var(--black)" }}>Featured Products</h2>
          <Link href="/products" style={{ fontSize: 13, color: "var(--red)" }}>View all →</Link>
        </div>
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
      </section>

      {/* PROMO BANNER */}
      <section style={{ padding: "0 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "var(--charcoal)", borderRadius: 12, padding: "2.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 500, color: "white", marginBottom: 8 }}>
              New arrivals <em style={{ color: "var(--red-mid)", fontStyle: "italic" }}>every week</em>
            </h2>
            <p style={{ fontSize: 14, color: "#999", marginBottom: "1.5rem" }}>Fresh products added regularly — check back often</p>
            <Link href="/products" style={{ background: "var(--red)", color: "white", padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
              Browse New Arrivals
            </Link>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 280 }}>
            {["Free shipping over $50", "Easy returns", "Secure checkout", "Local store"].map(pill => (
              <div key={pill} style={{ background: "rgba(255,255,255,.08)", color: "#ccc", padding: "6px 14px", borderRadius: 99, fontSize: 12, border: "1px solid rgba(255,255,255,.12)" }}>{pill}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--charcoal)", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Image src="/logo.jpeg" alt="Raju's Store" width={100} height={34} style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.8 }} />
        <div style={{ display: "flex", gap: 20 }}>
          {["Products", "Account", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 13, color: "#999", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#666" }}>© 2026 Raju's Store</div>
      </footer>

    </main>
  )
}