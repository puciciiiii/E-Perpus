import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const { status, qty, bukuId, tanggalPengembalianSebenarnya } =
      await request.json();

    // Dapatkan data laporan yang ada
    const laporan = await prisma.laporanTb.findUnique({
      where: { id: Number(id) },
    });

    if (!laporan) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah tanggalPengembalian valid
    if (!laporan.tanggalPengembalian) {
      return NextResponse.json(
        { message: "Tanggal pengembalian tidak ditemukan" },
        { status: 400 }
      );
    }

    const tanggalHarusKembali = new Date(laporan.tanggalPengembalian);
    if (isNaN(tanggalHarusKembali.getTime())) {
      return NextResponse.json(
        { message: "Tanggal pengembalian tidak valid" },
        { status: 400 }
      );
    }

    // Hitung denda jika status menjadi selesai
    let denda = laporan.denda;
    if (status === "selesai" && tanggalPengembalianSebenarnya) {
      const tanggalSelesai = new Date(tanggalPengembalianSebenarnya);

      if (tanggalSelesai > tanggalHarusKembali) {
        const timeDiff =
          tanggalSelesai.getTime() - tanggalHarusKembali.getTime();
        const keterlambatanHari = Math.ceil(timeDiff / (1000 * 3600 * 24));
        denda = keterlambatanHari * 1000; // Misal denda 1000 per hari
      } else {
        denda = 0; // Tidak ada keterlambatan
      }
    }

    // Update status dan denda
    await prisma.laporanTb.update({
      where: { id: Number(id) },
      data: {
        status: status,
        denda: denda,
      },
    });

    // Update stok buku jika status selesai
    if (status === "selesai") {
      await prisma.bukuTb.update({
        where: { id: bukuId },
        data: {
          stok: { increment: qty },
        },
      });
    }

    return NextResponse.json({
      message: "Status dan denda berhasil diperbarui!",
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui status." },
      { status: 500 }
    );
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const deletedReport = await prisma.laporanTb.delete({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json({
      message: "Laporan berhasil dihapus",
      deletedReport,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus laporan." },
      { status: 500 }
    );
  }
};
