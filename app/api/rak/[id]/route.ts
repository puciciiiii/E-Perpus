import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()

    await prisma.rakTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nama: String(formData.get('nama')),
            lemariId: Number(formData.get('lemariId')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}
export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    const rak = await prisma.rakTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(rak, { status: 200 })

}