"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        })
        if (res.ok) {
            router.push("/login")
        } else {
            const data = await res.json()
            setError(data.error || "Something went wrong")
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: "100px auto", padding: "0 1rem" }}>
            <h1 style={{ marginBottom: "1.5rem" }}>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }} />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }} />
                {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
                <button type="submit" style={{ width: "100%", padding: 10 }}>Register</button>
            </form>
        </div>
    )
}