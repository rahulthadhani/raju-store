"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        if (res?.error) {
            setError("Invalid email or password")
        } else {
            router.push("/")
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: "100px auto", padding: "0 1rem" }}>
            <h1 style={{ marginBottom: "1.5rem" }}>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ display: "block", width: "100%", marginBottom: 12, padding: 10 }}
                />
                {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
                <button type="submit" style={{ width: "100%", padding: 10 }}>Sign in</button>
            </form>
        </div>
    )
}