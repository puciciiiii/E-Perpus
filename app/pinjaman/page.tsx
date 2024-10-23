"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// Definisikan tipe untuk opsi pengunjung
interface PengunjungOption {
  value: string;
  label: string;
}

interface PetugasOption {
  value: string;
  label: string;
}

// Definisikan tipe untuk opsi buku
interface BukuOption {
  value: string;
  label: string;
  kodeBuku: string;
  namaPenulis: string;
  tahunTerbit: string;
  stok: number; // Tambahkan stok di sini untuk keperluan qty
}

const Contoh = () => {
  const [pengunjung, setPengunjung] = useState<PengunjungOption[]>([]);
  const [buku, setBuku] = useState([]);
  const [petugas, setPetugas] = useState<PengunjungOption[]>([]);
  const [selectedPengunjung, setSelectedPengunjung] =
    useState<PengunjungOption | null>(null);
  const [selectedPetugas, setSelectedPetugas] = useState<PetugasOption[]>([]);
  const [selectedBuku, setSelectedBuku] = useState<BukuOption | null>(null);
  const [bukuList, setBukuList] = useState<{ buku: BukuOption; qty: number }[]>(
    []
  );
  const [tanggalPinjaman, setTanggalPinjaman] = useState<string>(
    new Date().toISOString().split("T")[0] // Set tanggal hari ini
  );
  const [deadline, setDeadline] = useState<string>("");
  const [status, setStatus] = useState<string>("dipinjam");
  const router = useRouter();

  useEffect(() => {
    loadPengunjung();
    loadBuku();
    loadPetugas();
  }, []);

  const loadPengunjung = async () => {
    try {
      const res = await axios.get("/api/pengunjung");
      setPengunjung(res.data);
    } catch (error) {
      console.error("Error loading pengunjung:", error);
    }
  };

  const loadBuku = async () => {
    try {
      const res = await axios.get("/api/buku");
      const filteredBuku = res.data.filter((buku: any) => buku.stok > 0);
      setBuku(filteredBuku);
    } catch (error) {
      console.error("Error loading buku:", error);
    }
  };

  const loadPetugas = async () => {
    try {
      const res = await axios.get("/api/daftaranggota");
      setPetugas(res.data);
    } catch (error) {
      console.error("Error loading petugas:", error);
    }
  };

  const options = pengunjung.map((item: any) => ({
    value: item.id,
    label: item.nama,
  }));

  const optionsPetugas = petugas.map((item: any) => ({
    value: item.id,
    label: item.nama,
  }));

  const availableBukuOptions = buku
    .filter((item: any) => item.stok > 0) // Pastikan buku dengan stok > 0
    .map((item: any) => ({
      value: item.id,
      label: item.judul,
      kodeBuku: item.kodeBuku,
      namaPenulis: item.namaPenulis,
      tahunTerbit: item.tahunTerbit,
      stok: item.stok, // Tambahkan stok saat memetakan
    }))
    .filter(
      (bukuOption) =>
        !bukuList.some(
          (bukuItem) =>
            bukuItem.buku.label === bukuOption.label &&
            bukuItem.buku.kodeBuku === bukuOption.kodeBuku
        )
    );

  const formatOptionLabel = ({ label, kodeBuku }: any) => (
    <div>
      <div>{label}</div>
      <small className="text-muted">{kodeBuku}</small>
    </div>
  );

  const handlePengunjungChange = (selectedOption: PengunjungOption | null) => {
    setSelectedPengunjung(selectedOption);
  };

  const handlePetugasChange = (selectedOption: PetugasOption | null) => {
    setSelectedPetugas(selectedOption ? [selectedOption] : []);
  };

  const handleBukuChange = (selectedOption: BukuOption | null) => {
    if (selectedOption) {
      const existingBuku = bukuList.find(
        (buku) => buku.buku.value === selectedOption.value
      );
      if (existingBuku) {
        // Jika sudah ada, tidak perlu menambah, cukup fokus pada qty
        Swal.fire({
          icon: "info",
          title: "Buku sudah ada!",
          text: "Silakan atur qty untuk buku ini.",
        });
      } else {
        // Jika belum ada, tambahkan buku dengan qty 1
        setBukuList((prevList) => [
          ...prevList,
          { buku: selectedOption, qty: 1 },
        ]);
      }
      setSelectedBuku(null); // Reset pilihan buku setelah ditambahkan
    }
  };

  const handleRemoveBuku = (bukuToRemove: BukuOption) => {
    setBukuList((prevList) =>
      prevList.filter((buku) => buku.buku.value !== bukuToRemove.value)
    );
  };

  const handleQtyChange = (index: number, value: number) => {
    setBukuList((prevList) => {
      const updatedList = [...prevList];
      const bukuItem = updatedList[index];

      // Pastikan qty tidak melebihi stok
      const newQty = Math.min(value, bukuItem.buku.stok);
      updatedList[index] = { ...bukuItem, qty: newQty };

      return updatedList;
    });
  };

  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !selectedPengunjung ||
      !selectedPetugas.length ||
      !bukuList.length ||
      !deadline
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua field harus diisi!",
      });
      return;
    }

    try {
      const formData = {
        pengunjungId: selectedPengunjung.value,
        anggotaId: selectedPetugas[0].value,
        tanggalPinjaman,
        tanggalPengembalian: deadline,
        status,
        buku: bukuList.map((buku) => ({
          bukuId: buku.buku.value,
          qty: buku.qty, // Kirim qty ke backend
        })),
      };

      const res = await axios.post("/api/laporan", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.pesan === "berhasil disimpan") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Berhasil Simpan",
          showConfirmButton: false,
          timer: 1500,
        });
        router.refresh();
        router.push("/laporan");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  return (
    <div className="container-fluid p-4 bg-white rounded-lg shadow overflow-y-scroll overflow-x-scroll">
      <div className="p-2">
        <center>
          <h1>Form Peminjaman</h1>
        </center>
        <Select
          options={options}
          placeholder="Pilih pengunjung..."
          className="basic-single"
          classNamePrefix="select"
          isClearable
          isSearchable
          onChange={handlePengunjungChange}
        />
      </div>
      {selectedPengunjung && (
        <form onSubmit={handleTambah}>
          <div className="mt-2 p-2">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="tanggal">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tanggal"
                    value={tanggalPinjaman}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="deadline">Deadline Pengembalian</label>
                  <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="petugas">Petugas</label>
                <Select
                  options={optionsPetugas}
                  placeholder="Pilih petugas..."
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  onChange={handlePetugasChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="buku">Buku</label>
                <Select
                  options={availableBukuOptions}
                  placeholder="Pilih buku..."
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  onChange={handleBukuChange}
                  formatOptionLabel={formatOptionLabel}
                />
              </div>
            </div>
          </div>

          <div className="p-2">
            <h3>List Buku yang Dipinjam</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Judul Buku</th>
                    <th>Kode Buku</th>
                    <th>Penulis</th>
                    <th>Tahun terbit</th>
                    <th>Qty</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bukuList.map((bukuItem, index) => (
                    <tr key={index}>
                      <td>{bukuItem.buku.label}</td>
                      <td>{bukuItem.buku.kodeBuku}</td>
                      <td>{bukuItem.buku.namaPenulis}</td>
                      <td>{bukuItem.buku.tahunTerbit}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max={bukuItem.buku.stok}
                          value={bukuItem.qty}
                          onChange={(e) =>
                            handleQtyChange(index, parseInt(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveBuku(bukuItem.buku)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-2">
            <button type="submit" className="btn btn-primary">
              Simpan Peminjaman
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Contoh;
