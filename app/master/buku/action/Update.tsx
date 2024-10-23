"use client";
import { useState, SyntheticEvent, useEffect } from "react";
import { bukuTb } from "@prisma/client";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

function Update({ buku, reload }: { buku: bukuTb; reload: Function }) {
  // State untuk data buku
  const [kategoriId, setKategoriId] = useState<string>(
    buku.kategoriId ? buku.kategoriId.toString() : ""
  );
  const [kategoriOptions, setKategoriOptions] = useState<any[]>([]);
  const [kodeBuku, setKodeBuku] = useState(buku.kodeBuku);
  const [judul, setJudul] = useState(buku.judul);
  const [sinopsis, setSinopsis] = useState(buku.sinopsis);
  const [namaPenulis, setNamaPenulis] = useState(buku.namaPenulis);
  const [tahunTerbit, setTahunTerbit] = useState(buku.tahunTerbit);
  const [rakId, setRakId] = useState<string>(
    buku.rakId ? buku.rakId.toString() : ""
  );
  const [stok, setStok] = useState(buku.stok);

  const [rakOptions, setRakOptions] = useState<any[]>([]);

  // State untuk kontrol modal dan loading
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mengambil kategori dan rak saat komponen dimuat
  useEffect(() => {
    loadKategori();
    loadRak();
  }, []);

  const loadKategori = async () => {
    try {
      const response = await axios.get("/api/kategori");
      console.log("Kategori response:", response.data); // Debugging log
      setKategoriOptions(response.data);
    } catch (error) {
      console.error("Error fetching kategori:", error);
      Swal.fire("Error", "Gagal memuat kategori", "error");
    }
  };

  const loadRak = async () => {
    try {
      const response = await axios.get("/api/rak");
      console.log("Rak response:", response.data); // Debugging log
      setRakOptions(response.data);
    } catch (error) {
      console.error("Error fetching rak:", error);
      Swal.fire("Error", "Gagal memuat rak", "error");
    }
  };

  const handleClose = () => {
    setShow(false);
    refreshForm();
  };

  const handleShow = () => setShow(true);

  const refreshForm = () => {
    setKategoriId(buku.kategoriId ? buku.kategoriId.toString() : "");
    setKodeBuku(buku.kodeBuku || "");
    setJudul(buku.judul || "");
    setSinopsis(buku.sinopsis || "");
    setNamaPenulis(buku.namaPenulis || "");
    setTahunTerbit(buku.tahunTerbit || "");
    setRakId(buku.rakId ? buku.rakId.toString() : "");
  };

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("kategoriId", kategoriId);
      formData.append("kodeBuku", kodeBuku);
      formData.append("judul", judul);
      formData.append("sinopsis", sinopsis);
      formData.append("namaPenulis", namaPenulis);
      formData.append("tahunTerbit", tahunTerbit);
      formData.append("rakId", rakId);
      formData.append("stok", stok.toString());

      const response = await axios.patch(`/api/buku/${buku.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.close(); // Menutup loading Swal
      setIsLoading(false);

      if (response.data.pesan === "berhasil") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Berhasil diubah",
          showConfirmButton: false,
          timer: 1500,
        });
        setShow(false);
        reload();
      } else {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: response.data.pesan,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.close(); // Menutup loading Swal
      setIsLoading(false);
      console.error("Error:", error);
      Swal.fire("Error", "Gagal mengupdate data buku", "error");
    }
  };

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-success shadow btn-xs sharp mx-1"
      >
        <i className="fa fa-edit"></i>
      </span>
      <Modal
        dialogClassName="modal-mg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Data Buku</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="mb-3 col-md-12">
                <label className="col-sm-6 col-form-label">Kategori</label>
                <select
                  required
                  className="form-control"
                  value={kategoriId}
                  onChange={(e) => setKategoriId(e.target.value)}
                >
                  <option value="">Pilih kategori</option>
                  {kategoriOptions.map((kategori: any) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-md-12">
                <label className="col-sm-6 col-form-label">Kode buku</label>
                <input
                  required
                  className="form-control"
                  value={kodeBuku}
                  onChange={(e) => setKodeBuku(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-md-12">
                <label className="col-sm-6 col-form-label">Stok</label>
                <input
                  required
                  className="form-control"
                  value={stok}
                  onChange={(e) => setStok(+e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="col-sm-6 col-form-label">Judul</label>
                <input
                  required
                  className="form-control"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="col-sm-6 col-form-label">Sinopsis</label>
                <input
                  required
                  className="form-control"
                  value={sinopsis}
                  onChange={(e) => setSinopsis(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-12">
                <label className="col-sm-6 col-form-label">Nama Penulis</label>
                <textarea
                  required
                  className="form-control"
                  value={namaPenulis}
                  onChange={(e) => setNamaPenulis(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="col-sm-6 col-form-label">Tahun Terbit</label>
                <input
                  required
                  type="number"
                  className="form-control"
                  value={tahunTerbit}
                  onChange={(e) => setTahunTerbit(e.target.value)}
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="col-sm-6 col-form-label">Rak</label>
                <select
                  required
                  className="form-control"
                  value={rakId}
                  onChange={(e) => setRakId(e.target.value)}
                >
                  <option value="">Pilih rak</option>
                  {rakOptions.map((rak: any) => (
                    <option key={rak.id} value={rak.id}>
                      {rak.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-danger light"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary light"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
