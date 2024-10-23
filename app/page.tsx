"use client";
import { LineChart } from "./components/Charts"; // Importing chart components
import { StatisticsIcons } from "./components/StatisticsIcons"; // Importing statistics icons component
import { Chart, registerables } from "chart.js"; // Importing Chart.js
import axios from "axios"; // Importing axios for HTTP requests
import React, { useEffect, useState } from "react"; // Importing React hooks
import CalculateTotalDenda from "./components/calculateTotalDenda"; // Import CalculateTotalDenda component

Chart.register(...registerables);

export default function Home() {
  const [totalAnggota, setTotalAnggota] = useState(0);
  const [totalDenda, setTotalDenda] = useState(0); // Initialize totalDenda as number
  const [totalPengunjung, setTotalPengunjung] = useState(0); // Initialize totalPengunjung
  const [totalBuku, setTotalBuku] = useState(0); // Initialize totalBuku
  const [totalTransaksi, setTotalTransaksi] = useState(0); // Initialize totalTransaksi

  const today = new Date();
  const quotes = [
    "Membaca adalah jendela dunia. Jadikanlah perpustakaan sebagai tempat untuk memperluas wawasan!",
    "Kegagalan adalah batu loncatan menuju kesuksesan.",
    "Belajar dari kemarin, hidup untuk hari ini, berharap untuk hari esok.",
    "Setiap hari adalah kesempatan baru untuk meraih impianmu.",
    "Kreativitas adalah kecerdasan yang bersenang-senang.",
    "Pengetahuan adalah kekuatan. Isi harimu dengan membaca, dan lihat perubahan besar dalam hidupmu.",
    "Membaca adalah investasi terbaik untuk masa depan. Mulai sekarang, satu buku, satu langkah menuju kesuksesan.",
    "Buku adalah jendela dunia. Jelajahi lebih banyak, temukan dunia baru dalam setiap halaman.",
  ];
  const quoteOfTheDay = quotes[today.getDate() % quotes.length]; // Select a quote based on the date

  useEffect(() => {
    const fetchDataAnggota = async () => {
      try {
        const response = await axios.get("/api/daftaranggota");
        setTotalAnggota(response.data.length); // Count total members
      } catch (error) {
        console.error("Error fetching anggota data:", error);
      }
    };

    const fetchDenda = async () => {
      try {
        const response = await axios.get("/api/denda");
        console.log("Total Denda Response:", response.data); // Pastikan ini berisi "totalDenda"
        setTotalDenda(response.data.totalDenda || 0); // Pastikan ini di-set
      } catch (error) {
        console.error("Error fetching total denda:", error);
      }
    };

    const fetchPengunjung = async () => {
      try {
        const response = await axios.get("/api/pengunjung"); // API untuk pengunjung
        setTotalPengunjung(response.data.length); // Anggap response.data adalah array pengunjung
      } catch (error) {
        console.error("Error fetching pengunjung data:", error);
      }
    };

    const fetchBuku = async () => {
      try {
        const response = await axios.get("/api/buku"); // API untuk buku
        // Hitung total stok buku
        const totalStok = response.data.reduce(
          (total: number, buku: { stok: number }) => total + buku.stok,
          0
        );
        setTotalBuku(totalStok); // Set total buku ke total stok
      } catch (error) {
        console.error("Error fetching buku data:", error);
      }
    };

    const fetchTransaksi = async () => {
      try {
        const response = await axios.get("/api/laporan");
        setTotalTransaksi(response.data.length);
        console.log("Total Transaksi:", response.data.length); // Cek nilai total transaksi
      } catch (error) {
        console.error("Error fetching transaksi data:", error);
      }
    };

    fetchDataAnggota();
    fetchDenda(); // Fetch total denda dari laporan
    fetchPengunjung(); // Fetch total pengunjung
    fetchBuku(); // Fetch total buku
    fetchTransaksi(); // Fetch total transaksi
  }, []);

  return (
    <div style={{ padding: "10px", maxWidth: "1200px", margin: "0 auto" }}>
      <StatisticsIcons
        totalAnggota={totalAnggota}
        totalBuku={totalBuku} // Pass totalBuku
        totalTransaksi={totalTransaksi}
        totalPengunjung={totalPengunjung}
        totalDenda={totalDenda}
      />
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div style={{ flex: 1, marginRight: "10px" }}>
          <div style={{ width: "100%", height: "300px", margin: "0 auto" }}>
            {/* Chart Component */}
            <LineChart />
          </div>
        </div>
        <div style={{ flex: 0.5 }}>
          <div style={{ marginBottom: "20px" }}>
            {" "}
            {/* Menambahkan margin bottom untuk jarak */}
            <CalculateTotalDenda /> {/* Menampilkan total denda */}
          </div>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontStyle: "italic", fontSize: "16px", color: "grey" }}>
              {quoteOfTheDay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
