import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()

    await prisma.pengunjungTb.create({
        data: {
            nama: String(formData.get('nama')),
            alamat: String(formData.get('alamat')),
            hp: String(formData.get('hp')),
            email:String(formData.get('email')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil disimpan' })

}


export const GET = async () => {
    const xxx = await prisma.pengunjungTb.findMany({
        orderBy: {
            id: "asc"
        },
    });
    return NextResponse.json(xxx, { status: 200 })
}