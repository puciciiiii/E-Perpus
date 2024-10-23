"use client";
import { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

function Add({ reload }: { reload: Function }) {
  const [datakategori, setDatakategori] = useState([]);
  const [datarak, setDatarak] = useState([]);
  const [kategoriId, setkategoriId] = useState("");
  const [kodeBuku, setkodeBuku] = useState("");
  const [stok, setstok] = useState("");
  const [judul, setjudul] = useState("");
  const [sinopsis, setsinopsis] = useState("");
  const [namaPenulis, setnamaPenulis] = useState("");
  const [tahunTerbit, settahunTerbit] = useState("");
  const [rakId, setrakId] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    clearForm();
  };

  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    loadkategori();
    loadrak();
  }, []);

  const loadkategori = async () => {
    try {
      const response = await axios.get(`/api/kategori`);
      setDatakategori(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadrak = async () => {
    try {
      const response = await axios.get(`/api/rak`);
      setDatarak(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function clearForm() {
    setkategoriId("");
    setrakId("");
    setkodeBuku("");
    setstok("");
    setjudul("");
    setsinopsis("");
    setnamaPenulis("");
    settahunTerbit("");
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("kategoriId", kategoriId);
      formData.append("kodeBuku", kodeBuku);
      formData.append("stok", stok);
      formData.append("judul", judul);
      formData.append("sinopsis", sinopsis);
      formData.append("namaPenulis", namaPenulis);
      formData.append("tahunTerbit", tahunTerbit);
      formData.append("rakId", rakId);

      const response = await axios.post(`/api/buku`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.pesan === "Buku berhasil disimpan") {
        handleClose();
        clearForm();
        reload();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Berhasil Simpan",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menyimpan data!",
      });
    }
  };

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-success btn-icon-text"
      >
        Tambah
      </button>
      <Modal
        dialogClassName="modal-m"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label"> Kategori </label>
                  <select
                    required
                    className="form-control"
                    value={kategoriId}
                    onChange={(e) => setkategoriId(e.target.value)}
                  >
                    <option value="">pilihan</option>
                    {datakategori.map((a: any) => (
                      <option key={a.id} value={a.id}>
                        {a.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label">Kode Buku</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    className="form-control"
                    value={kodeBuku}
                    onChange={(e) => setkodeBuku(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label">Stok</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={stok}
                    onChange={(e) => setstok(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label">Judul</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={judul}
                    onChange={(e) => setjudul(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label"> Sinopsis </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={sinopsis}
                    onChange={(e) => setsinopsis(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label"> Penulis </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={namaPenulis}
                    onChange={(e) => setnamaPenulis(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label">
                    {" "}
                    Tahun Terbit{" "}
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={tahunTerbit}
                    onChange={(e) => settahunTerbit(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-12">
                  <label className="col-sm-6 col-form-label"> Rak </label>
                  <select
                    required
                    className="form-control"
                    value={rakId}
                    onChange={(e) => setrakId(e.target.value)}
                  >
                    <option value="">pilihan</option>
                    {datarak.map((a: any) => (
                      <option key={a.id} value={a.id}>
                        {a.nama}
                      </option>
                    ))}
                  </select>
                </div>
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
            <button type="submit" className="btn btn-primary light">
              Simpan
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Add;
