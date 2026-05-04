"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
    const [query, setQuery] = useState("")
    const router = useRouter()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (query.trim()) router.push(`/products?q=${query}`)
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
            <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, flex: 1 }}
            />
            <button type="submit" style={{ padding: "8px 16px", background: "#000", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                Search
            </button>
        </form>
    )
}