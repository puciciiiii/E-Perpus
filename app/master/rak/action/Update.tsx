"use client";
import { useState, SyntheticEvent, useEffect, useRef } from "react";
import { rakTb } from "@prisma/client";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import moment from "moment";

function Update({ rak, reload }: { rak: rakTb, reload: Function }) {

    const [nama, setNama] = useState(rak.nama);
    const [lemariId, setLemariId] = useState(rak.lemariId);
    const [lemariOptions, setLemariOptions] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        loadlemari();
    }, []);

    const loadlemari = async () => {
        try {
            const response = await axios.get('/api/lemari');
            setLemariOptions(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        refreshForm();
    };

    const handleShow = () => setShow(true);

    const refreshForm = () => {
        setNama(rak.nama);
        setLemariId(rak.lemariId);
    };

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('nama', nama);
            formData.append('lemariId', String(lemariId));

            const response = await axios.patch(`/api/rak/${rak.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsLoading(false);
            if (response.data.pesan === 'berhasil') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil diubah',
                    showConfirmButton: false,
                    timer: 1500
                });
                setShow(false);
                reload();
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
            setIsLoading(false);
            console.error('Error:', error);
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
                keyboard={false}
            >
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
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="col-sm-6 col-form-label">Lemari</label>
                                <select
                                    required
                                    className="form-control"
                                    value={lemariId}
                                    onChange={(e) => setLemariId(Number(e.target.value))}
                                >
                                    <option value="">Pilih lemari</option>
                                    {lemariOptions.map((lemari: any) => (
                                        <option key={lemari.id} value={lemari.id}>{lemari.nama}</option>
                                    ))}
                                </select>
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
    );
}

export default Update;
