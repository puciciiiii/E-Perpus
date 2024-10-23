import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()

    await prisma.rakTb.create({
        data: {
            nama:String(formData.get('nama')),
            lemariId:Number(formData.get('lemariId')),
        }
    })

    return NextResponse.json({ pesan: 'berhasil disimpan' })
}


export const GET = async () => {
    const xxx = await prisma.rakTb.findMany({
        orderBy: {
            id: "asc"
        },
        include:{
            lemariTb:true
        }
    });
    return NextResponse.json(xxx, { status: 200 })
}