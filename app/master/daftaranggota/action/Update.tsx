"use client"
import { useState, SyntheticEvent } from "react";
import { daftaranggotaTb } from "@prisma/client";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

function Update({ daftaranggota, reload }: { daftaranggota: daftaranggotaTb; reload: Function }) {
    const [nama, setNama] = useState(daftaranggota.nama);
    const [alamat, setAlamat] = useState(daftaranggota.alamat);
    const [email, setEmail] = useState(daftaranggota.email);
    const [hp, setHp] = useState(daftaranggota.hp);
    const [tanggalDaftar, setTanggalDaftar] = useState(new Date(daftaranggota.tanggalDaftar));
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshForm();
    };

    const handleShow = () => setShow(true);

    const refreshForm = () => {
        setNama(daftaranggota.nama);
        setAlamat(daftaranggota.alamat);
        setEmail(daftaranggota.email);
        setHp(daftaranggota.hp);
        setTanggalDaftar(new Date(daftaranggota.tanggalDaftar));
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
            formData.append('email', email);
            formData.append('hp', hp.toString());
            formData.append('tanggalDaftar', tanggalDaftar.toISOString());

            const response = await axios.patch(`/api/daftaranggota/${daftaranggota.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsLoading(false);
            Swal.close();

            if (response.data.pesan === 'sudah ada email') {
                Swal.fire({ icon: 'warning', title: 'Email ini sudah terdaftar', showConfirmButton: false, timer: 1500 });
            } else if (response.data.pesan === 'sudah ada hp') {
                Swal.fire({ icon: 'warning', title: 'No Hp ini sudah terdaftar', showConfirmButton: false, timer: 1500 });
            } else if (response.data.pesan === 'berhasil') {
                setShow(false);
                reload();
                Swal.fire({ icon: 'success', title: 'Berhasil diubah', showConfirmButton: false, timer: 1500 });
            }
        } catch (error) {
            setIsLoading(false);
            Swal.close();
            Swal.fire({ icon: 'error', title: 'Terjadi kesalahan', text: 'Silakan coba lagi.' });
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <span onClick={handleShow} className="btn btn-success shadow btn-xs sharp mx-1">
                <i className="fa fa-edit"></i>
            </span>
            <Modal dialogClassName="modal-mg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Nama</label>
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
                            <label className="form-label">Alamat</label>
                            <input
                                required
                                type="text"
                                className="form-control"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                required
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">No. Hp</label>
                            <input
                                required
                                type="Number"  // Changed to 'tel' for better mobile input
                                className="form-control"
                                value={hp}
                                onChange={(e) => setHp(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tgl. Daftar</label>
                            <input
                                required
                                type="date"
                                className="form-control"
                                value={tanggalDaftar.toISOString().split('T')[0]}
                                onChange={(e) => setTanggalDaftar(new Date(e.target.value))}
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
