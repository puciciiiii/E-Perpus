import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()

    await prisma.kategoriTb.create({
        data: {
            nama:String(formData.get('nama')),
        }
    })

    return NextResponse.json({ pesan: 'berhasil disimpan' })
}


export const GET = async () => {
    const xxx = await prisma.kategoriTb.findMany({
        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(xxx, { status: 200 })
}