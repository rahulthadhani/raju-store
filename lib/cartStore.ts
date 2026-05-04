export type CartItem = {
    id: string
    title: string
    price: number
    quantity: number
    slug: string
}

export function getCart(): CartItem[] {
    if (typeof window === "undefined") return []
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
}

export function addToCart(item: CartItem) {
    const cart = getCart()
    const existing = cart.find(i => i.id === item.id)
    if (existing) {
        existing.quantity += item.quantity
    } else {
        cart.push(item)
    }
    localStorage.setItem("cart", JSON.stringify(cart))
}

export function removeFromCart(id: string) {
    const cart = getCart().filter(i => i.id !== id)
    localStorage.setItem("cart", JSON.stringify(cart))
}

export function updateQuantity(id: string, quantity: number) {
    const cart = getCart().map(i => i.id === id ? { ...i, quantity } : i)
    localStorage.setItem("cart", JSON.stringify(cart))
}

export function clearCart() {
    localStorage.removeItem("cart")
}