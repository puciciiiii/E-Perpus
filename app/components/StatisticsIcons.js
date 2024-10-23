"use client";

export const StatisticsIcons = ({
  totalAnggota,
  totalPengunjung,
  totalBuku,
  totalTransaksi,
  totalDenda,
}) => {
  console.log("Statistics Icons Props:", {
    totalAnggota,
    totalPengunjung,
    totalBuku,
    totalTransaksi,
    totalDenda,
  });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}
    >
      {/* Statistik Total Anggota */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          flex: 1,
          margin: "0 10px",
        }}
      >
        <div style={{ fontSize: "30px" }}>👤</div> {/* Ikon untuk anggota */}
        <h3>Total Anggota</h3>
        <p>{totalAnggota}</p>
      </div>

      {/* Statistik Buku */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          flex: 1,
          margin: "0 10px",
        }}
      >
        <div style={{ fontSize: "30px" }}>📚</div> {/* Ikon untuk buku */}
        <h3>Total Buku</h3>
        <p>{totalBuku}</p>
      </div>

      {/* Statistik Transaksi */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          flex: 1,
          margin: "0 10px",
        }}
      >
        <div style={{ fontSize: "30px" }}>📊</div>
        <h3>Total Transaksi</h3>
        <p>{totalTransaksi}</p>
      </div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          flex: 1,
          margin: "0 10px",
        }}
      >
        <div style={{ fontSize: "30px" }}>👥</div> {/* Ikon untuk pengunjung */}
        <h3>Total Pengunjung</h3>
        <p>{totalPengunjung}</p>
      </div>
    </div>
  );
};
