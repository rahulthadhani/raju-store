"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(5)
    const [body, setBody] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, rating, body }),
        })

        const data = await res.json()

        if (res.ok) {
            setSuccess(true)
            setBody("")
            setRating(5)
            router.refresh()
        } else {
            setError(data.error || "Failed to submit review")
        }

        setLoading(false)
    }

    if (success) return <p style={{ color: "green", fontSize: 14 }}>Review submitted successfully!</p>

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Rating</label>
                <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}
                >
                    {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} star{r !== 1 ? "s" : ""}</option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Review (optional)</label>
                <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts..."
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, resize: "vertical" }}
                />
            </div>
            {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button
                type="submit"
                disabled={loading}
                style={{ padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    )
}