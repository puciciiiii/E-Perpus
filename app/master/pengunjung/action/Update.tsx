/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, SyntheticEvent } from "react";
import { pengunjungTb } from "@prisma/client";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

function Update({ pengunjung, reload }: { pengunjung: pengunjungTb, reload: Function }) {
    const [nama, setNama] = useState(pengunjung.nama);
    const [alamat, setAlamat] = useState(pengunjung.alamat);
    const [hp, setHp] = useState(pengunjung.hp);
    const [email, setEmail] = useState(pengunjung.email);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshForm();
    };

    const handleShow = () => {
        setShow(true);
        refreshForm();
    };

    const refreshForm = () => {
        setNama(pengunjung.nama);
        setAlamat(pengunjung.alamat);
        setHp(pengunjung.hp);
        setEmail(pengunjung.email);
    };

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);

        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang mengirim data ke server",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const formData = new FormData();
            formData.append('nama', nama);
            formData.append('alamat', alamat);
            formData.append('hp', hp);
            formData.append('email', email);

            const response = await axios.patch(`/api/pengunjung/${pengunjung.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.pesan === 'berhasil') {
                reload();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil diubah',
                    showConfirmButton: false,
                    timer: 1500
                });
                handleClose();
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: response.data.pesan,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error updating data:', error);
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || 'Terjadi kesalahan'
                : 'Terjadi kesalahan yang tidak terduga';

            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: message,
                showConfirmButton: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <span onClick={handleShow} className="btn btn-success shadow btn-xs sharp mx-1">
                <i className="fa fa-edit"></i>
            </span>
            <Modal
                dialogClassName="modal-mg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="col-form-label">Nama</label>
                            <input
                                autoFocus
                                required
                                type="text"
                                className="form-control"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">Alamat</label>
                            <input
                                required
                                type="text"
                                className="form-control"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">HP</label>
                            <input
                                required
                                type="Number"
                                className="form-control"
                                value={hp}
                                onChange={(e) => setHp(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">Email</label>
                            <input
                                required
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light" disabled={isLoading}>Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}

export default Update;
