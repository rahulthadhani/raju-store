import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q") || ""

    if (!q) return NextResponse.json([])

    const products = await prisma.product.findMany({
        where: {
            isPublished: true,
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { tags: { has: q } },
            ],
        },
        take: 10,
    })

    return NextResponse.json(products)
}