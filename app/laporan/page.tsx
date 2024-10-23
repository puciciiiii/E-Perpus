"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import Delete from "./action/delete";
import { bukuTb } from "@prisma/client";
import Dikembalikan from "./action/dikembalikan";
import dayjs from "dayjs"; // Pastikan sudah menginstall dayjs: npm install dayjs

type Pengunjung = {
  id: number;
  nama: string;
};

type LaporanItem = {
  id: number;
  pengunjungTb: Pengunjung;
  bukuTb: bukuTb;
  tanggalPinjaman: string;
  tanggalPengembalian: string;
  tanggalPengembalianSebenarnya?: string; // Tanggal pengembalian asli
  daftaranggotaTb: Pengunjung;
  status: string;
  denda: number;
  qty: number;
  bukuId: number;
};

// Fungsi untuk menghitung denda berdasarkan keterlambatan
const hitungDenda = (
  tanggalPengembalian: string,
  tanggalPengembalianSebenarnya: string | undefined,
  dendaPerHari: number,
  status: string // Tambahkan parameter status
) => {
  // Jika status sudah selesai (buku dikembalikan), hentikan perhitungan denda
  if (status === "selesai" && tanggalPengembalianSebenarnya) {
    return 0; // Denda tidak dihitung lagi
  }

  const tanggalHarusKembali = dayjs(tanggalPengembalian);
  const tanggalSelesai = tanggalPengembalianSebenarnya
    ? dayjs(tanggalPengembalianSebenarnya)
    : dayjs();

  if (tanggalSelesai.isAfter(tanggalHarusKembali)) {
    const keterlambatanHari = tanggalSelesai.diff(tanggalHarusKembali, "day");
    return keterlambatanHari * dendaPerHari;
  }

  return 0; // Tidak ada keterlambatan
};

const Laporan = () => {
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [filteredLaporan, setFilteredLaporan] = useState<LaporanItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [totalDenda, setTotalDenda] = useState(0);

  useEffect(() => {
    loadLaporan();
    loadTotalDenda(); // Panggil API denda
  }, []);

  useEffect(() => {
    filterLaporan();
  }, [searchTerm, statusFilter, laporan]);

  // Fungsi untuk mengambil data laporan
  const loadLaporan = async () => {
    try {
      const res = await axios.get("/api/laporan"); // Pastikan endpoint sesuai
      setLaporan(res.data);
    } catch (error) {
      console.error("Error loading laporan:", error);
    }
  };

  // Fungsi untuk mengambil total denda dari API
  const loadTotalDenda = async () => {
    try {
      const res = await axios.get("/api/denda"); // Panggil API denda
      setTotalDenda(res.data.totalDenda); // Set total denda dari API
    } catch (error) {
      console.error("Error loading total denda:", error);
    }
  };

  // Fungsi untuk memfilter laporan berdasarkan status dan pencarian
  const filterLaporan = () => {
    let filtered = laporan;

    if (statusFilter === "dipinjam") {
      filtered = filtered.filter((item) => item.status === "dipinjam");
    } else if (statusFilter === "selesai") {
      filtered = filtered.filter((item) => item.status === "selesai");
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.pengunjungTb.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLaporan(filtered);
  };

  return (
    <div className="container-fluid p-4 bg-white rounded-lg shadow">
      <center>
        <h1>Laporan Peminjaman</h1>
      </center>
      <div className="d-flex justify-content-between mb-3">
        <select
          className="form-select me-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="semua">Semua</option>
          <option value="dipinjam">Masih Dipinjam</option>
          <option value="selesai">Sudah Dikembalikan</option>
        </select>
        <div className="input-group" style={{ width: "200px" }}>
          <span className="input-group-text" id="basic-addon1">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Cari Nama Pengunjung"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-responsive" style={{ marginTop: "20px" }}>
          <thead style={{ backgroundColor: "#53d0b2", color: "black" }}>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              <th style={{ width: "150px" }}>Pengunjung</th>
              <th style={{ width: "200px" }}>Buku</th>
              <th style={{ width: "150px" }}>Tgl. Pinjaman</th>
              <th style={{ width: "150px" }}>Tgl. Pengembalian</th>
              <th style={{ width: "150px" }}>Petugas</th>
              <th style={{ width: "150px" }}>Qty</th>
              <th style={{ width: "100px" }}>Status</th>
              <th style={{ width: "100px" }}>Denda</th>
              <th style={{ width: "120px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredLaporan.map((item: LaporanItem, index) => {
              const dendaKeterlambatan = hitungDenda(
                item.tanggalPengembalian,
                item.tanggalPengembalianSebenarnya,
                1000,
                item.status // Tambahkan status di sini
              );
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.pengunjungTb?.nama}</td>
                  <td>{item.bukuTb.judul}</td>
                  <td>{new Date(item.tanggalPinjaman).toLocaleDateString()}</td>
                  <td>
                    {new Date(item.tanggalPengembalian).toLocaleDateString()}
                  </td>
                  <td>{item.daftaranggotaTb?.nama}</td>
                  <td>{item.qty}</td>
                  <td>
                    <div
                      className={
                        item.status === "dipinjam"
                          ? "bg-warning p-2 rounded"
                          : "bg-success p-2 rounded"
                      }
                    >
                      {item.status}
                    </div>
                  </td>
                  <td>{item.denda || dendaKeterlambatan}</td>{" "}
                  {/* Tetap tampilkan denda */}
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Dikembalikan
                      id={item.id}
                      reload={loadLaporan}
                      status={item.status}
                      qty={item.qty}
                      bukuId={item.bukuId}
                    />
                    <Delete id={item.id} reload={loadLaporan} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Laporan;
