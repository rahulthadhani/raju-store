import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, rating, body } = await req.json()

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const existing = await prisma.review.findFirst({
        where: { productId, userId: user.id },
    })

    if (existing) {
        return NextResponse.json({ error: "You already reviewed this product" }, { status: 400 })
    }

    const review = await prisma.review.create({
        data: {
            productId,
            userId: user.id,
            rating: parseInt(rating),
            body,
        },
    })

    return NextResponse.json(review)
}