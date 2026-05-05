import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { title, sku, description, price, compareAt, category, stock, isPublished } = await req.json()

    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    let cat = await prisma.category.findUnique({ where: { slug: category.toLowerCase().replace(/\s+/g, "-") } })

    if (!cat) {
        cat = await prisma.category.create({
            data: {
                name: category,
                slug: category.toLowerCase().replace(/\s+/g, "-"),
            },
        })
    }

    const product = await prisma.product.create({
        data: {
            title,
            sku,
            slug,
            description,
            price: parseFloat(price),
            compareAt: compareAt ? parseFloat(compareAt) : null,
            categoryId: cat.id,
            isPublished,
            images: [],
            tags: [],
        },
    })

    await prisma.inventoryLog.create({
        data: {
            productId: product.id,
            delta: parseInt(stock),
            reason: "initial_stock",
        },
    })

    return NextResponse.json(product)
}

export async function GET() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
}