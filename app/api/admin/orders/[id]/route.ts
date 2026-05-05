import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const formData = await req.formData()
    const status = formData.get("status") as string

    const order = await prisma.order.update({
        where: { id },
        data: { status: status as any },
    })

    return NextResponse.redirect(new URL(`/admin/orders/${id}`, req.url))
}