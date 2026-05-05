"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UpdateOrderStatus({
    orderId,
    currentStatus,
}: {
    orderId: string
    currentStatus: string
}) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleUpdate() {
        setLoading(true)
        const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        if (res.ok) {
            router.refresh()
            alert("Order status updated!")
        } else {
            alert("Failed to update order")
        }
        setLoading(false)
    }

    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}
            >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
            </select>
            <button
                onClick={handleUpdate}
                disabled={loading}
                style={{ padding: "8px 16px", background: "#000", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
            >
                {loading ? "Updating..." : "Update"}
            </button>
        </div>
    )
}