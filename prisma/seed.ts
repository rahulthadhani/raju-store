import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const category = await prisma.category.create({
        data: {
            name: "General",
            slug: "general",
        },
    })

    await prisma.product.createMany({
        data: [
            {
                sku: "PROD-001",
                title: "Sample Product 1",
                slug: "sample-product-1",
                description: "A great product.",
                price: 9.99,
                categoryId: category.id,
                isPublished: true,
                images: [],
                tags: [],
            },
            {
                sku: "PROD-002",
                title: "Sample Product 2",
                slug: "sample-product-2",
                description: "Another great product.",
                price: 19.99,
                categoryId: category.id,
                isPublished: true,
                images: [],
                tags: [],
            },
        ],
    })

    console.log("Seeded successfully")
}

main().catch(console.error).finally(() => prisma.$disconnect())