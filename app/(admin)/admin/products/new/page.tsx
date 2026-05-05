"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: "",
        sku: "",
        description: "",
        price: "",
        compareAt: "",
        category: "",
        stock: "",
        isPublished: false,
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        if (res.ok) {
            router.push("/admin/products")
        } else {
            alert("Failed to create product")
        }
        setLoading(false)
    }

    const inputStyle = { display: "block", width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, marginBottom: 16 }
    const labelStyle = { display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#333" }

    return (
        <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "2rem" }}>Add Product</h1>
            <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: 8, border: "1px solid #eee" }}>
                <label style={labelStyle}>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>SKU</label>
                <input name="sku" value={form.sku} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} />

                <label style={labelStyle}>Price</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Compare At Price (optional)</label>
                <input name="compareAt" type="number" step="0.01" value={form.compareAt} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Category (name)</label>
                <input name="category" value={form.category} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Stock Quantity</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required style={inputStyle} />

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 24 }}>
                    <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={handleChange} />
                    Publish immediately
                </label>

                <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#000", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, cursor: "pointer" }}>
                    {loading ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    )
}