import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

    const formData = await request.formData()

    await prisma.kategoriTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nama: String(formData.get('nama')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    const kategori = await prisma.kategoriTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(kategori, { status: 200 })

}