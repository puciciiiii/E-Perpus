"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Add from '../rak/action/Add';

import Update from './action/Update';
import Delete from './action/Delete';

const rak = () => {

  const [datarak, setDatarak] = useState([])
  const [selectdivisi, setSelectdivisi] = useState([])
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
  }, [])

  const reload = async () => {
    try {
      const xxx = await axios.get(`/api/rak`);
      const result = await xxx.data;
      console.log('data rak', result)
      setDatarak(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = datarak.filter(
    (item: any) => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase()),
  );

  const columns = [
    {
      name: 'No',
      cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
      sortable: false,
      width: '80px'
    },
    {
      name: 'Nama',
      selector: (row: any) => row.nama,
      sortable: true,

    },
    {
      name: 'Nama Lemari',
      selector: (row: any) => row.lemariTb.nama,
      sortable: true,

    },

    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Update rak={row} reload={reload} />
          <Delete rakId={row.id} reload={reload} />
        </div>
      ),
    },

  ];


  return (
    <div>
      <div style={{ backgroundColor: "white", width: '100%', padding: '20px', color: 'grey', boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)", borderRadius: '10px', marginBottom: '20px', }}>
       <center> <h2>Daftar Rak</h2></center>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-9">
              <Add reload={reload} />
            </div>
            <div className="col-md-3">
              <div className="input-group mb-3  input-success">
                <span className="input-group-text border-0"><i className="mdi mdi-magnify"></i></span>
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
                  backgroundColor: '#53d0b2',
                  fontSize: 15,
                },
              },
            }}
          />

        </div>
      </div>
    </div>
     
  )
}

export default rak