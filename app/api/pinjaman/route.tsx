import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Mengambil dan memvalidasi data
    const pengunjungId = Number(formData.get("pengunjungId"));
    const anggotaId = Number(formData.get("anggotaId"));
    const bukuIds = formData.getAll("bukuId");
    const tanggalPinjaman = new Date(String(formData.get("tanggalPinjaman")));
    const tanggalPengembalian = new Date(
      String(formData.get("tanggalPengembalian"))
    );
    const status = String(formData.get("status")) || "dipinjam";

    // Validasi data
    if (
      !pengunjungId ||
      !anggotaId ||
      !bukuIds.length ||
      !tanggalPinjaman ||
      !tanggalPengembalian
    ) {
      return NextResponse.json(
        { error: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const pengunjungExists = await prisma.pengunjungTb.findUnique({
      where: { id: pengunjungId },
    });

    const anggotaExists = await prisma.daftaranggotaTb.findUnique({
      where: { id: anggotaId },
    });

    if (!pengunjungExists || !anggotaExists) {
      return NextResponse.json(
        { error: "Pengunjung atau anggota tidak ditemukan." },
        { status: 404 }
      );
    }

    const bukuJudul = [];

    for (const bukuIdValue of bukuIds) {
      const bukuId = Number(bukuIdValue); // Pastikan bukuId adalah angka
      const bukuExists = await prisma.bukuTb.findUnique({
        where: { id: bukuId },
        select: { judul: true, stok: true },
      });

      if (!bukuExists) {
        return NextResponse.json(
          { error: "Buku tidak ditemukan." },
          { status: 404 }
        );
      }

      if (bukuExists.stok <= 0) {
        return NextResponse.json(
          { error: `Stok buku "${bukuExists.judul}" habis.` },
          { status: 400 }
        );
      }

      bukuJudul.push(bukuExists.judul);

      await prisma.bukuTb.update({
        where: { id: bukuId },
        data: {
          stok: { decrement: 1 },
        },
      });

      await prisma.pinjamanTb.create({
        data: {
          tanggalPinjaman,
          tanggalPengembalian,
          kode: 0,
          buku: bukuExists.judul,
          bukuId: String(bukuId), // Konversi bukuId ke string jika perlu
          memberId: pengunjungId,
          anggotaId,
          status,
          denda: 0,
        },
      });
    }

    return NextResponse.json(
      { pesan: "Pinjaman berhasil disimpan", bukuJudul },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/pinjaman:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const laporanList = await prisma.laporanTb.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(laporanList, { status: 200 });
  } catch (error) {
    console.error("Error fetching laporan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
