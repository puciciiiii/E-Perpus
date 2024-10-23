"use client"; // Mengindikasikan ini adalah komponen client-side

import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs"; // Pastikan sudah menginstall dayjs: npm install dayjs

// Tipe data untuk setiap item laporan
type LaporanItem = {
  id: number;
  tanggalPinjaman: string;
  tanggalPengembalian: string;
  tanggalPengembalianSebenarnya?: string; // Tanggal pengembalian asli (opsional)
  denda: number; // Denda yang sudah terhitung
};

// Fungsi untuk menghitung denda berdasarkan keterlambatan
const hitungDenda = (
  tanggalPengembalian: string,
  tanggalPengembalianSebenarnya: string | undefined,
  dendaPerHari: number // Denda per hari
) => {
  const tanggalHarusKembali = dayjs(tanggalPengembalian); // Tanggal yang harus dikembalikan
  const tanggalSelesai = tanggalPengembalianSebenarnya
    ? dayjs(tanggalPengembalianSebenarnya) // Jika ada tanggal pengembalian sebenarnya
    : dayjs(); // Jika tidak, gunakan tanggal sekarang

  // Hitung keterlambatan
  if (tanggalSelesai.isAfter(tanggalHarusKembali)) {
    const keterlambatanHari = tanggalSelesai.diff(tanggalHarusKembali, "day");
    return keterlambatanHari * dendaPerHari; // Hitung denda keterlambatan
  }

  return 0; // Tidak ada keterlambatan
};

const CalculateTotalDenda = () => {
  const [laporan, setLaporan] = useState<LaporanItem[]>([]); // State untuk menyimpan laporan
  const [totalDenda, setTotalDenda] = useState(0); // State untuk menyimpan total denda

  // Hook untuk mengambil data laporan ketika komponen pertama kali dimuat
  useEffect(() => {
    loadLaporan();
  }, []);

  // Fungsi untuk mengambil data laporan dari API
  const loadLaporan = async () => {
    try {
      const res = await axios.get("/api/laporan"); // Endpoint API untuk mengambil laporan
      const laporanData: LaporanItem[] = res.data; // Simpan data laporan ke state

      // Hitung total denda
      const total = laporanData.reduce((acc, item) => {
        const dendaKeterlambatan = hitungDenda(
          item.tanggalPengembalian,
          item.tanggalPengembalianSebenarnya,
          1000 // Ganti sesuai tarif denda per hari
        );
        return acc + item.denda + dendaKeterlambatan; // Jumlahkan denda yang ada dan denda keterlambatan
      }, 0);

      setLaporan(laporanData); // Set state laporan
      setTotalDenda(total); // Set total denda
    } catch (error) {
      console.error("Error loading laporan:", error); // Tangani error
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#e0f7fa",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px",
      }}
    >
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>Jumlah Denda:</p>
      <p style={{ fontSize: "24px", color: "#d84315", fontWeight: "bold" }}>
        Rp {totalDenda}
      </p>
    </div>
  );
};

export default CalculateTotalDenda; // Ekspor komponen
