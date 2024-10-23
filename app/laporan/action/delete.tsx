import { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

function Delete({ id, reload }: { id: Number; reload: Function }) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    setIsLoading(true);
    handleClose();

    try {
      console.log(`Deleting item with id: ${id}`); // Log id yang dikirim
      const res = await axios.delete(`/api/laporan/${id}`);
      console.log(res); // Log respons dari server

      if (
        res.status === 200 &&
        res.data.message === "Laporan berhasil dihapus"
      ) {
        setTimeout(function () {
          reload();
          setIsLoading(false);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Berhasil dihapus", // Perbaiki pesan sukses di sini
            showConfirmButton: false,
            timer: 1500,
          });
        }, 500);
      } else {
        Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-danger shadow btn-xs sharp mx-1"
      >
        <i className="fa fa-trash"></i>
      </span>

      {/* Modal konfirmasi penghapusan */}
      <Modal
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h6 className="font-bold">Anda yakin ingin menghapus data ini?</h6>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-warning light"
            onClick={handleClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger light"
            onClick={handleDelete}
          >
            Ya, Hapus
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Delete;
