import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Menggunakan ekspor bernama untuk metode GET
export async function GET() {
  try {
    // Menghitung total denda dari tabel laporanTb menggunakan Prisma
    const totalDenda = await prisma.laporanTb.aggregate({
      _sum: {
        denda: true, // Pastikan kolom denda sudah benar
      },
    });

    // Mengirim respons sukses dengan total denda
    return NextResponse.json({
      totalDenda: totalDenda._sum.denda || 0, // Jika null, setel ke 0
    });
  } catch (error) {
    console.error("Error fetching total denda:", error);
    // Mengirimkan respons error jika ada masalah saat fetching data
    return NextResponse.json(
      { error: "Unable to fetch total denda" },
      { status: 500 }
    );
  } finally {
    // Menutup koneksi Prisma
    await prisma.$disconnect();
  }
}
