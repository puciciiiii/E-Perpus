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
}

const Contoh = () => {
  const [pengunjung, setPengunjung] = useState<PengunjungOption[]>([]);
  const [buku, setBuku] = useState([]);
  const [petugas, setPetugas] = useState<PengunjungOption[]>([]);
  const [selectedPengunjung, setSelectedPengunjung] =
    useState<PengunjungOption | null>(null);
  const [selectedPetugas, setSelectedPetugas] = useState<PetugasOption[]>([]);
  const [selectedBuku, setSelectedBuku] = useState<BukuOption | null>(null);
  const [bukuList, setBukuList] = useState<BukuOption[]>([]);
  const [tanggalPinjaman, setTanggalPinjaman] = useState<string>(
    new Date().toISOString().split("T")[0] // Set tanggal hari ini
  );
  const [deadline, setDeadline] = useState<string>("");

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
      setBuku(res.data);
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
    .map((item: any) => ({
      value: item.id,
      label: item.judul,
      kodeBuku: item.kodeBuku,
    }))
    .filter(
      (bukuOption) =>
        !bukuList.some(
          (bukuItem) =>
            bukuItem.label === bukuOption.label &&
            bukuItem.kodeBuku === bukuOption.kodeBuku
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
      setBukuList((prevList) => [
        ...prevList,
        {
          value: selectedOption.value,
          label: selectedOption.label,
          kodeBuku: selectedOption.kodeBuku,
        },
      ]);
      setSelectedBuku(null);
    }
  };

  const handleRemoveBuku = (bukuToRemove: BukuOption) => {
    setBukuList((prevList) =>
      prevList.filter((buku) => buku.value !== bukuToRemove.value)
    );
  };

  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("pengunjungId", String(selectedPengunjung?.value));
      formData.append("petugasId", String(selectedPetugas?.values));

      bukuList.forEach((buku) => {
        formData.append("bukuId", String(buku.value));
      });
      formData.append("tanggalPinjaman", tanggalPinjaman);
      formData.append("deadline", deadline);
      const res = await axios.post("/api/peminjaman", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container-fluid p-4 bg-white rounded-lg shadow overflow-y-scroll overflow-x-scroll">
      <div className="p-2">
        <h1>Tambah Peminjaman</h1>
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
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="scanBarcode">Pengunjung</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="scanBarcode"
                      value={selectedPengunjung ? selectedPengunjung.label : ""}
                      placeholder="Pengunjung"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="namaBuku">Nama Buku & Kode Buku</label>
                  <Select
                    options={availableBukuOptions}
                    placeholder="Pilih buku..."
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable
                    isSearchable
                    formatOptionLabel={formatOptionLabel}
                    onChange={handleBukuChange}
                    value={selectedBuku}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="petugas">Pilih Petugas Pustaka</label>
                  <Select
                    options={optionsPetugas}
                    placeholder="Pilih Petugas Pustaka..."
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable
                    isSearchable
                    onChange={handlePetugasChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Buku</th>
                    <th>Judul</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bukuList.map((buku, index) => (
                    <tr key={buku.value}>
                      <td>{index + 1}</td>
                      <td>{buku.kodeBuku}</td>
                      <td>{buku.label}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveBuku(buku)}
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button className="btn btn-primary" type="submit">
              Tambah
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Contoh;
