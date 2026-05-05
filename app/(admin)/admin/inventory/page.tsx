import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getStockForProduct(productId: string) {
    const result = await prisma.inventoryLog.aggregate({
        where: { productId },
        _sum: { delta: true },
    })
    return result._sum.delta || 0
}

export default async function InventoryPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { title: "asc" },
    })

    const inventory = await Promise.all(
        products.map(async p => ({
            ...p,
            stock: await getStockForProduct(p.id),
        }))
    )

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Inventory</h1>

            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee" }}>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Product</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>SKU</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Category</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Stock</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 13, color: "#666" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(product => (
                            <tr key={product.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>{product.title}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14, color: "#666" }}>{product.sku}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>{product.category.name}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{product.stock}</td>
                                <td style={{ padding: "12px 16px", fontSize: 14 }}>
                                    <span style={{
                                        padding: "3px 10px", borderRadius: 99, fontSize: 12,
                                        background: product.stock === 0 ? "#fde8e8" : product.stock <= 5 ? "#fef3cd" : "#e6f4ea",
                                        color: product.stock === 0 ? "#c0392b" : product.stock <= 5 ? "#856404" : "#1e7e34"
                                    }}>
                                        {product.stock === 0 ? "Out of stock" : product.stock <= 5 ? "Low stock" : "In stock"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}