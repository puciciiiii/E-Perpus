// "use client";
// import { useState, SyntheticEvent, useEffect, useRef } from "react";
// import axios from "axios";
// import Modal from "react-bootstrap/Modal";
// import Swal from "sweetalert2";
// import Select from "react-select";

// function Add({ reload }: { reload: Function }) {
//   const [dataPengunjung, setdataPengunjung] = useState([]);
//   const [dataAnggota, setdataAnggota] = useState([]);
//   const [dataBuku, setdataBuku] = useState([]);
//   const [memberId, setmemberId] = useState("");
//   const [anggotaId, setanggotaId] = useState("");
//   const [tanggalPengembalian, settanggalPengembalian] = useState("");
//   const [tanggalPinjaman, settanggalPinjaman] = useState("");
//   const [bukuId, setbukuId] = useState("");
//   const [kodeBuku, setkodeBuku] = useState("");

//   const [show, setShow] = useState(false);
//   const ref = useRef<HTMLInputElement>(null);
//   const refemail = useRef<HTMLInputElement>(null);
//   const refhp = useRef<HTMLInputElement>(null);

//   const [isLoading, setIsLoading] = useState(false);
//   if (isLoading) {
//     Swal.fire({
//       title: "Mohon tunggu!",
//       html: "Sedang mengirim data ke server",
//       allowOutsideClick: false,
//       didOpen: () => {
//         Swal.showLoading();
//       },
//     });
//   }
//   const handleClose = () => {
//     setShow(false);
//     clearForm();
//   };

//   const handleShow = () => {
//     setShow(true);
//   };

//   useEffect(() => {
//     ref.current?.focus();
//     loadPengunjug();
//     loadAnggota();
//     loadBuku();
//   }, []);

//   const loadPengunjug = async () => {
//     try {
//       const xxx = await axios.get(`/api/pengunjung`);
//       const result = await xxx.data;
//       setdataPengunjung(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const loadAnggota = async () => {
//     try {
//       const xxx = await axios.get(`/api/daftaranggota`);
//       const result = await xxx.data;
//       setdataAnggota(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const loadBuku = async () => {
//     try {
//       const xxx = await axios.get(`/api/buku`);
//       const result = await xxx.data;
//       setdataBuku(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   function clearForm() {
//     setmemberId("");
//     setanggotaId("");
//     setbukuId("");
//   }

//   const pengunjungchange = (e: any) => {
//     setmemberId(e.target.value);
//   };
//   const anggotachange = (e: any) => {
//     setanggotaId(e.target.value);
//   };
//   const bukuchange = (e: any) => {
//     setbukuId(e.target.value);
//     setkodeBuku(e.target.options[e.target.selectedIndex].text);
//   }

//   const handleSubmit = async (e: SyntheticEvent) => {
//     setIsLoading(true);
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("tanggalPinjaman", tanggalPinjaman);
//       formData.append("tanggalPengembalian", tanggalPengembalian);
//       formData.append("bukuId", bukuId);
//       formData.append("memberId", memberId);
//       formData.append("anggotaId", anggotaId);
//       formData.append("kodeBuku", kodeBuku);

//       const xxx = await axios.post(`/api/pinjaman`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (xxx.data.pesan == "berhasil disimpan") {
//         handleClose();
//         clearForm();
//         reload();
//         setIsLoading(false);
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Berhasil Simpan",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handleShow}
//         type="button"
//         className="btn btn-success btn-icon-text"
//       >
//         Tambah
//       </button>
//       <Modal
//         dialogClassName="modal-m"
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <form onSubmit={handleSubmit}>
//           <Modal.Header closeButton>
//             <Modal.Title>Tambah Data Buku</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label"> Kategori </label>
//                 <select
//                   required
//                   className="form-control"
//                   value={kategoriId}
//                   onChange={(e) => kategorichange(e)}
//                 >
//                   <option value="">pilihan</option>
//                   {datakategori.map((a: any) => (
//                     <option key={a.id} value={a.id}>
//                       {a.nama}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label">Kode Buku</label>
//                 <input
//                   autoFocus
//                   required
//                   type="text"
//                   className="form-control"
//                   value={kodeBuku}
//                   onChange={(e) => setkodeBuku(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label">Judul</label>
//                 <input
//                   autoFocus
//                   required
//                   type="text"
//                   className="form-control"
//                   value={judul}
//                   onChange={(e) => setjudul(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label"> Sinopsis </label>
//                 <input
//                   required
//                   type="text"
//                   className="form-control"
//                   value={sinopsis}
//                   onChange={(e) => setsinopsis(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label"> Penulis </label>
//                 <input
//                   required
//                   type="text"
//                   className="form-control"
//                   value={namaPenulis}
//                   onChange={(e) => setnamaPenulis(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label"> TahunTerbit </label>
//                 <input
//                   required
//                   type="text"
//                   className="form-control"
//                   value={tahunTerbit}
//                   onChange={(e) => settahunTerbit(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               <div className="mb-3 col-md-12">
//                 <label className="col-sm-6 col-form-label"> Rak </label>
//                 <select
//                   required
//                   className="form-control"
//                   value={rakId}
//                   onChange={(e) => rakchange(e)}
//                 >
//                   <option value="">pilihan</option>
//                   {datarak.map((a: any) => (
//                     <option key={a.id} value={a.id}>
//                       {a.nama}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <button
//               type="button"
//               className="btn btn-danger light"
//               onClick={handleClose}
//             >
//               Close
//             </button>
//             <button type="submit" className="btn btn-primary light">
//               Simpan
//             </button>
//           </Modal.Footer>
//         </form>
//       </Modal>
//     </div>
//   );
// }

// export default Add;
