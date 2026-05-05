import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: 24, fontWeight: 600 }}>Products</h1>
                <Link href="/admin/products/new" style={{ padding: "10px 20px", background: "#000", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 14 }}>
                    + Add Product
                </Link>
            </div>

            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee" }}>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Title</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>SKU</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Category</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Price</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Status</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>{product.title}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14, color: "#666" }}>{product.sku}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>{product.category.name}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>${Number(product.price).toFixed(2)}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>
                                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 12, background: product.isPublished ? "#e6f4ea" : "#f5f5f5", color: product.isPublished ? "#1e7e34" : "#666" }}>
                                        {product.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>
                                    <Link href={`/admin/products/${product.id}/edit`} style={{ color: "#000", textDecoration: "none", marginRight: 12, fontSize: 13 }}>Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}