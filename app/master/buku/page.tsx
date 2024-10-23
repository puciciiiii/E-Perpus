"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Add from "../buku/action/Add";
import Update from "../buku/action/Update";
import Delete from "../buku/action/Delete";

const Buku = () => {
  const [databuku, setDatabuku] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    try {
      const response = await axios.get(`/api/buku`);
      const result = response.data;
      console.log("data buku", result);
      setDatabuku(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = databuku.filter(
    (item: any) =>
      item.judul && item.judul.toLowerCase().includes(filterText.toLowerCase())
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
      name: "Kategori",
      selector: (row: any) => row.kategoriTb?.nama,
      sortable: true,
      width: "150px",
    },
    {
      name: "kode buku",
      selector: (row: any) => row.kodeBuku,
      sortable: true,
      width: "150px",
    },
    {
      name: "stok",
      selector: (row: any) => row.stok,
      sortable: true,
      width: "150px",
    },
    {
      name: "Judul",
      selector: (row: any) => row.judul,
      sortable: true,
      width: "250px",
    },
    {
      name: "Sinopsis",
      selector: (row: any) => row.sinopsis,
      sortable: true,
      width: "250px",
    },
    {
      name: "Nama Penulis",
      selector: (row: any) => row.namaPenulis,
      sortable: true,
      width: "150px",
    },
    {
      name: "Tahun Terbit",
      selector: (row: any) => row.tahunTerbit,
      sortable: true,
      width: "150px",
    },
    {
      name: "Rak",
      selector: (row: any) => row.rakTb?.nama,
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      cell: (row: any) => (
        <div className="d-flex">
          <Update buku={row} reload={reload} />
          <Delete bukuId={row.id} reload={reload} />
        </div>
      ),
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
          <h2>Daftar Buku</h2>
        </center>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-9">
              <Add reload={reload} />
            </div>
            <div className="col-md-3">
              <div className="input-group mb-3  input-success">
                <span className="input-group-text border-0">
                  <i className="mdi mdi-magnify"></i>
                </span>
                <input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  aria-label="Search Input"
                  value={filterText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilterText(e.target.value)
                  }
                  className="form-control"
                />
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
    </div>
  );
};

export default Buku;
