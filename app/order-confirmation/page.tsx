import Link from "next/link"

export default function OrderConfirmationPage() {
    return (
        <main style={{ maxWidth: 600, margin: "100px auto", padding: "2rem 1rem", textAlign: "center" }}>
            <h1 style={{ fontSize: 28, marginBottom: 16 }}>Order Confirmed!</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>Thank you for your purchase. You will receive a confirmation email shortly.</p>
            <Link href="/" style={{ padding: "12px 24px", background: "#000", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
                Continue Shopping
            </Link>
        </main>
    )
}