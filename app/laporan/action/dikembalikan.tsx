import axios from "axios";
import React from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import Swal from "sweetalert2";

interface StatusProps {
  id: number;
  reload: Function;
  status: string;
  qty: number;
  bukuId: number;
}

const Dikembalikan = ({ id, reload, status, qty, bukuId }: StatusProps) => {
  const handleEditStatus = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Ubah Status?",
      text: "Apakah Anda ingin mengubah status peminjaman ini menjadi selesai?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, selesai!",
      cancelButtonText: "Tidak, batalkan!",
    });

    if (confirm.isConfirmed) {
      try {
        const today = new Date().toISOString(); // Tanggal pengembalian sebenarnya
        const response = await axios.patch(`/api/laporan/${id}`, {
          status: "selesai",
          qty: qty,
          bukuId: bukuId,
          tanggalPengembalianSebenarnya: today, // Kirim tanggal pengembalian asli
        });

        // Cek apakah response berhasil
        if (response.status === 200) {
          Swal.fire(
            "Status Diperbarui!",
            "Status peminjaman telah diubah menjadi selesai.",
            "success"
          );
          reload(); // Reload laporan setelah status diperbarui
        } else {
          throw new Error("Failed to update status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire(
          "Error!",
          "Terjadi kesalahan saat mengubah status peminjaman.",
          "error"
        );
      }
    }
  };

  return (
    <div>
      <button
        className={`btn btn-sm me-2 ${
          status === "dipinjam" ? "btn-success" : "btn-secondary"
        }`}
        onClick={() => handleEditStatus(id)}
        disabled={status !== "dipinjam"}
      >
        <IoCheckmarkDoneSharp />
      </button>
    </div>
  );
};

export default Dikembalikan;
