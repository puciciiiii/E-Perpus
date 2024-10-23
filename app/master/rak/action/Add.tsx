"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Select from 'react-select'


function Add({ reload }: { reload: Function }) {
    const [datalemari, setDatalemari] = useState([])
    const [nama, setNama] = useState("")
    const [lemariId, setlemariId] = useState("")

    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const refemail = useRef<HTMLInputElement>(null);
    const refhp = useRef<HTMLInputElement>(null);

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

    const handleClose = () => {
        setShow(false);
        clearForm();
    }



    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
        loadlemari()
    }, [])

    const loadlemari = async () => {
        try {
            const xxx = await axios.get(`/api/lemari`);
            const result = await xxx.data;
            setDatalemari(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function clearForm() {
        setNama('')
        setlemariId('')
    }

    const lemarichange=(e:any)=>{
        setlemariId(e.target.value)
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('lemariId', lemariId)

            const xxx = await axios.post(`/api/rak`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })



            if (xxx.data.pesan == 'berhasil disimpan') {
                handleClose();
                clearForm();
                reload()
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                Tambah</button>
            <Modal
                dialogClassName="modal-m"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Rak</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="col-sm-6 col-form-label">Nama </label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="col-sm-6 col-form-label">Nama Lemari</label>
                                <select
                                    required
                                    className="form-control"
                                    value={lemariId}
                                    onChange={(e) => lemarichange(e)}
                                >
                                    <option value="">Pilihan</option>
                                    {datalemari.map((a: any) => (
                                        <option key={a.id} value={a.id}>{a.nama}</option>
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
        </div >
    )
}

export default Add