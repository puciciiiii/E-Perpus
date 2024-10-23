import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk menangani permintaan POST untuk menambahkan buku
export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();

    const newBook = await prisma.bukuTb.create({
      data: {
        kategoriId: Number(formData.get("kategoriId")),
        kodeBuku: String(formData.get("kodeBuku")),
        judul: String(formData.get("judul")),
        sinopsis: String(formData.get("sinopsis")),
        namaPenulis: String(formData.get("namaPenulis")),
        tahunTerbit: String(formData.get("tahunTerbit")),
        rakId: Number(formData.get("rakId")),
        stok: Number(formData.get("stok")),
      },
    });

    return NextResponse.json(
      { pesan: "Buku berhasil disimpan", book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Fungsi untuk mengambil semua buku
export async function GET() {
  try {
    const buku = await prisma.bukuTb.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        kategoriTb: true,
        rakTb: true,
      },
    });

    return NextResponse.json(buku);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
