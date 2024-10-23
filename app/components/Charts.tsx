"use client";
import { Line } from "react-chartjs-2";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const LineChart = () => {
  const [chartData, setChartData] = useState<number[]>([]); // State untuk data peminjaman bulanan
  const [labels, setLabels] = useState<string[]>([
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]); // Label bulan

  useEffect(() => {
    const fetchLaporanPeminjaman = async () => {
      try {
        const response = await axios.get("/api/laporan");
        const laporan = response.data;

        // Inisialisasi array untuk menghitung jumlah peminjaman per bulan
        const peminjamanBulanan = Array(12).fill(0); // Indeks 0-11 untuk Jan - Des

        laporan.forEach((laporan: { tanggalPinjaman: string }) => {
          const bulan = new Date(laporan.tanggalPinjaman).getMonth(); // Ambil bulan (0-11)

          // Increment peminjaman pada bulan tersebut
          peminjamanBulanan[bulan] += 1;
        });

        setChartData(peminjamanBulanan); // Set data ke state
      } catch (error) {
        console.error("Error fetching laporan peminjaman:", error);
      }
    };

    fetchLaporanPeminjaman();
  }, []);

  const data = {
    labels: labels, // Label bulan
    datasets: [
      {
        label: "Jumlah Peminjaman",
        data: chartData, // Data jumlah peminjaman per bulan
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return <Line data={data} />;
};
