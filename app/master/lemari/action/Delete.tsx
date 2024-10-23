"use client"
import { useState } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

function Delete({ lemariId, reload }: { lemariId: Number, reload: Function }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isLoading, setIsLoading] = useState(false)
    if (isLoading) {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang mengirim data ke server",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })
    }


    const handleDelete = async () => {
        setIsLoading(true)
        handleClose()
        await axios.delete(`/api/lemari/${lemariId}`)
        setTimeout(function () {
            reload()
            setIsLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Berhasil dihapus',
                showConfirmButton: false,
                timer: 1500
            })
        }, 1500);
    }

    return (
        <div>
            <span onClick={handleShow} className="btn btn-danger shadow btn-xs sharp mx-1"><i className="fa fa-trash"></i></span>
            <Modal
                dialogClassName="modal-md"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <h6 className="font-bold">Anda yakin menghapus data ini ?</h6>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-warning light" onClick={handleClose}>Close</button>
                    <button type="button" className="btn btn-danger light" onClick={handleDelete}>Ya, Hapus</button>
                </Modal.Footer>

            </Modal>

        </div>
    )
}

export default Delete