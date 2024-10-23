import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE Method - Menghapus laporan peminjaman berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    // Cek apakah record dengan ID tersebut ada, termasuk relasi buku
    const existingLoan = await prisma.laporanTb.findUnique({
      where: { id },
      include: { bukuTb: true }, // Memuat relasi buku
    });

    // Jika tidak ada, kembalikan pesan error
    if (!existingLoan) {
      return NextResponse.json(
        { pesan: "Record tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika record ada, lanjutkan penghapusan
    await prisma.laporanTb.delete({
      where: { id },
    });

    await prisma.bukuTb.update({
      where: { id: existingLoan.bukuTb[0].id }, // Akses id buku dari relasi buku
      data: {
        stok: {
          increment: 1, // Tambah stok buku
        },
        isAvailable: true, // Set buku tersedia
      },
    });

    return NextResponse.json({ pesan: "berhasil" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting loan:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// PATCH Method - Mengubah status peminjaman dan menghitung denda jika terlambat
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body = await request.json();

  // Validasi input, status harus ada
  if (!body.status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  try {
    // Cari peminjaman berdasarkan id, termasuk relasi buku
    const existingLoan = await prisma.laporanTb.findUnique({
      where: { id: Number(params.id) },
      include: { bukuTb: true }, // Memuat relasi buku
    });

    // Jika peminjaman tidak ditemukan, kembalikan pesan error
    if (!existingLoan) {
      return NextResponse.json(
        { error: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika statusnya "dikembalikan", update status menjadi "selesai dikembalikan"
    const updatedStatus =
      body.status === "dikembalikan" ? "selesai dikembalikan" : body.status;

    // Hitung denda jika tanggal pengembalian sudah lewat
    const currentDate = new Date();
    const pengembalianDate = existingLoan?.tanggalPengembalian
      ? new Date(existingLoan.tanggalPengembalian)
      : null;

    // Hitung keterlambatan dan denda (misal denda per hari: 1000)
    const keterlambatan = pengembalianDate?.getTime()
      ? Math.max(
          0,
          Math.ceil(
            (currentDate.getTime() - pengembalianDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
    const denda = keterlambatan > 0 ? keterlambatan * 1000 : 0;

    // Update status dan denda peminjaman di database
    const updatedLoan = await prisma.laporanTb.update({
      where: { id: Number(params.id) },
      data: { status: updatedStatus, denda },
    });

    // Jika status peminjaman berubah menjadi "selesai dikembalikan", tambahkan stok buku
    if (updatedStatus === "selesai dikembalikan") {
      await prisma.bukuTb.update({
        where: { id: existingLoan.bukuTb[0].id },
        data: {
          stok: {
            increment: 1, // Tambah stok buku
          },
          isAvailable: true, // Set buku tersedia
        },
      });
    }

    return NextResponse.json({
      message: "Status peminjaman berhasil diperbarui",
      updatedLoan,
    });
  } catch (error) {
    console.error("Error updating status:", error);

    // Penanganan error jika ada masalah dengan Prisma atau server
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Kesalahan Server Internal" },
      { status: 500 }
    );
  }
};

// GET Method - Mendapatkan daftar buku yang tersedia untuk dipinjam
export async function GET(request: Request) {
  try {
    // Hanya ambil buku yang available
    const availableBooks = await prisma.bukuTb.findMany({
      where: { isAvailable: true }, // Menampilkan hanya buku yang tersedia
    });

    return NextResponse.json(availableBooks, { status: 200 });
  } catch (error) {
    console.error("Error fetching available books:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
