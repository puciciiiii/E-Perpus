/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent } from "react"
import { lemariTb } from "@prisma/client"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import Select from 'react-select'

function Update({ lemari, reload }: { lemari: lemariTb, reload: Function }) {

    const [nama, setNama] = useState(lemari.nama)

    const [st, setSt] = useState(false);
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

    const refreshform = () => {
        setNama(lemari.nama)
    }

    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true)

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
           
            const xxx = await axios.patch(`/api/lemari/${lemari.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {

                if (xxx.data.pesan == 'sudah ada email') {
                    setIsLoading(false)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'Email ini sudah terdaftar',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }

                if (xxx.data.pesan == 'sudah ada hp') {
                    setIsLoading(false)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'No Hp ini sudah terdaftar',
                        showConfirmButton: false,
                        timer: 1500
                    })

                }
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    setIsLoading(false)
                    reload()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <span onClick={handleShow} className="btn btn-success shadow btn-xs sharp mx-1"><i className="fa fa-edit"></i></span>
            <Modal
                dialogClassName="modal-mg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="col-sm-6 col-form-label">Nama</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default Update