import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const formData = await request.formData();

    const kategoriId = Number(formData.get("kategoriId"));
    const kodeBuku = String(formData.get("kodeBuku"));
    const judul = String(formData.get("judul"));
    const sinopsis = String(formData.get("sinopsis"));
    const namaPenulis = String(formData.get("namaPenulis"));
    const tahunTerbit = String(formData.get("tahunTerbit"));
    const rakId = Number(formData.get("rakId"));
    const stok = Number(formData.get("stok"));

    // Update the record in the database
    await prisma.bukuTb.update({
      where: {
        id: Number(params.id),
      },
      data: {
        kategoriId,
        kodeBuku,
        stok,
        judul,
        sinopsis,
        namaPenulis,
        tahunTerbit,
        rakId,
      },
    });

    return NextResponse.json({ pesan: "berhasil" });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json({ pesan: "Terjadi kesalahan" }, { status: 500 });
  }
};
export const GET = async () => {
  try {
    // Ambil semua buku dari database
    const bukuList = await prisma.bukuTb.findMany({
      select: {
        id: true,
        judul: true,
        kodeBuku: true, // pastikan ini sesuai dengan nama kolom di database
      },
    });

    return NextResponse.json(bukuList);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ pesan: "Terjadi kesalahan" }, { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Delete the record from the database
    const buku = await prisma.bukuTb.delete({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json(buku, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json({ pesan: "Terjadi kesalahan" }, { status: 500 });
  }
};
