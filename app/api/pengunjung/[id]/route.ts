import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

    const formData = await request.formData()

    await prisma.pengunjungTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nama: String(formData.get('nama')),
            alamat: String(formData.get('alamat')),
            hp: String(formData.get('hp')),
            email:String(formData.get('email')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    const xxx = await prisma.pengunjungTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(xxx, { status: 200 })

}