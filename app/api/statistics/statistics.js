import { PrismaClient } from "@prisma/client"; // Mengimpor PrismaClient

const prisma = new PrismaClient(); // Membuat instance PrismaClient

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Menghitung jumlah anggota, buku, kategori, dan pinjaman
    const totalAnggota = await prisma.daftaranggotaTb.count();
    const totalBuku = await prisma.bukuTb.count();
    const totalPengunjung = await prisma.pengunjungTb.count();
    const totalPinjaman = await prisma.pinjamanTb.count();

    // Mengirim respon dengan data statistik
    res.status(200).json({
      totalAnggota,
      totalBuku,
      totalPengunjung,
      totalPinjaman,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Unable to fetch statistics" });
  } finally {
    await prisma.$disconnect(); // Memutuskan koneksi Prisma
  }
}
