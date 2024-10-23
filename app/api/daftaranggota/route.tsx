import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()

    await prisma.daftaranggotaTb.create({
        data: {
            nama: String(formData.get('nama')),
            alamat: String(formData.get('alamat')),
            email:String(formData.get('email')),
            hp: String(formData.get('hp')),
            tanggalDaftar: new Date(String(formData.get('tanggalDaftar'))),
        }
    })
    return NextResponse.json({ pesan: 'berhasil disimpan' })

}


export const GET = async () => {
    const xxx = await prisma.daftaranggotaTb.findMany({
        orderBy: {
            id: "asc"
        },
    });
    return NextResponse.json(xxx, { status: 200 })
}