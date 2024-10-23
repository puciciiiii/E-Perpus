"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

// Ubah nama fungsi menjadi huruf kapital
const DaftarAnggota = () => {
  const [dataanggota, setDataanggota] = useState([]);
  const [selectdivisi, setSelectdivisi] = useState([]);
  const [filterText, setFilterText] = useState(""); // Tidak perlu prefix React. karena sudah diimpor
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    try {
      const response = await axios.get(`/api/daftaranggota`);
      const result = response.data; // Menggunakan response.data langsung
      console.log("data anggota", result);
      setDataanggota(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = dataanggota.filter(
    (item: any) =>
      item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "No",
      cell: (row: any, index: number) => (
        <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
      ),
      sortable: false,
      width: "80px",
    },
    {
      name: "Nama",
      selector: (row: any) => row.nama,
      sortable: true,
      width: "150px",
    },
    {
      name: "Alamat",
      selector: (row: any) => row.alamat,
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      width: "150px",
    },
    {
      name: "No.Hp",
      selector: (row: any) => row.hp,
      sortable: true,
      width: "150px",
    },
    {
      name: "Tgl.daftar",
      selector: (row: any) => row.tanggalDaftar,
      sortable: true,
      width: "150px",
    },
  ];

  return (
    <div>
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
          padding: "20px",
          color: "grey",
          boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <center>
          <h2>Daftar Anggota</h2>
        </center>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-9">
              {/* Tempat untuk komponen lain jika ada */}
            </div>
            <div className="col-md-3">
              <div className="input-group mb-3 input-success">
                <span className="input-group-text border-0">
                  <i className="mdi mdi-magnify"></i>
                </span>
                <input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  aria-label="Search Input"
                  value={filterText}
                  onChange={(e: any) => setFilterText(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          persistTableHead
          responsive
          paginationPerPage={itemsPerPage}
          paginationTotalRows={filteredItems.length}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={handleRowsPerPageChange}
          paginationRowsPerPageOptions={[5, 10, 20]}
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#53d0b2",
                fontSize: 15,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DaftarAnggota; // Ekspor dengan nama baru
