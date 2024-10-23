import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

    const formData = await request.formData()

    await prisma.daftaranggotaTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nama: String(formData.get('nama')),
            alamat: String(formData.get('alamat')),
            email:String(formData.get('email')),
            hp: String(formData.get('hp')),
            tanggalDaftar: new Date(String(formData.get('tanggalDaftar'))),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    const daftaranggota = await prisma.daftaranggotaTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(daftaranggota, { status: 200 })

}