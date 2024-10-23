"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Select from 'react-select'

function Add({ reload }: { reload: Function }) {
    const [pengunjung, setpengunjung] = useState([])
    const [nama, setNama] = useState("")
    const [alamat, setAlamat] = useState("")
    const [hp, setHp] = useState('')
    const [email, setEmail] = useState("")
    
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
    }, [])

    function clearForm() {
        setNama('')
        setAlamat('')
        setHp('')
        setEmail('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('alamat', alamat)
            formData.append('hp', hp.toString())
            formData.append('email', email)

            const xxx = await axios.post(`/api/pengunjung`, formData, {
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
                        <Modal.Title>Tambah pengunjung</Modal.Title>
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
                                <label className="col-sm-6 col-form-label">Alamat </label>
                                <input
                                  
                                    required
                                    type="text"
                                    className="form-control"
                                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                />
                            </div>
                        </div>   
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="col-sm-6 col-form-label">No.Hp </label>
                                <input
                                    
                                    required
                                    type="Number"
                                    className="form-control"
                                    value={hp} onChange={(e) => setHp(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="col-sm-6 col-form-label">Email </label>
                                <input
                                   
                                    required
                                    type="email"
                                    className="form-control"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
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
        </div >
    )
}

export default Add