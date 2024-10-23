import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    pengunjungId,
    anggotaId,
    tanggalPinjaman,
    tanggalPengembalian,
    status,
    buku,
  } = await req.json();

  try {
    // Loop untuk setiap buku yang dipinjam
    const laporanPromises = buku.map(
      async (item: { bukuId: number; qty: number }) => {
        // Update stok buku dengan mengurangi qty yang dipinjam
        await prisma.bukuTb.update({
          where: { id: Number(item.bukuId) },
          data: { stok: { decrement: item.qty } }, // Mengurangi stok
        });

        // Simpan laporan peminjaman
        return prisma.laporanTb.create({
          data: {
            pengunjungId: Number(pengunjungId),
            anggotaId: Number(anggotaId),
            bukuId: Number(item.bukuId),
            tanggalPinjaman: new Date(tanggalPinjaman),
            tanggalPengembalian: new Date(tanggalPengembalian),
            status,
            qty: item.qty,
            denda: 0, // Denda bisa dihitung berdasarkan waktu pengembalian
          },
        });
      }
    );

    // Menyimpan semua laporan peminjaman
    await Promise.all(laporanPromises);

    return NextResponse.json({ pesan: "berhasil disimpan" });
  } catch (error) {
    console.error("Error saving laporan:", error);
    return NextResponse.json({ pesan: "gagal menyimpan" }, { status: 500 });
  }
}

// Endpoint GET untuk mengambil laporan
export async function GET() {
  try {
    const laporanList = await prisma.laporanTb.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        bukuTb: true,
        daftaranggotaTb: true,
        pengunjungTb: true,
      },
    });
    return NextResponse.json(laporanList, { status: 200 });
  } catch (error) {
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      { error: "gagal mengambil data" },
      { status: 500 }
    );
  }
}

// Close Prisma client on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
