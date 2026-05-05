import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json()

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: { email, password: hashed, name, role: "CUSTOMER" },
    })

    return NextResponse.json({ success: true })
}