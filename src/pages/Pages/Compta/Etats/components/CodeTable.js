import React from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import Pagination from "../../../../Components/Common/Pagination";
import { Alert } from "reactstrap";

const CodesTable = ({ data, formatAmount, currentPage, setCurrentPage, itemsPerPage = 10 }) => {
  
  const columns = [
    {
      header: "N°",
      accessorKey: "id",
      cell: (cell) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + cell.row.index + 1;
        return <span className="fw-medium">{globalIndex}</span>;
      },
      size: 60,
    },
    {
      header: "Code",
      accessorKey: "code",
      size: 80,
    },
    {
      header: "Forme juridique",
      accessorKey: "formeJuridique",
      size: 200,
    },
    {
      header: "Num",
      accessorKey: "num",
      size: 80,
    },
    {
      header: "Pays siège social",
      accessorKey: "paysSiegeSocial",
      size: 150,
    },
    {
      header: "A",
      accessorKey: "A",
      size: 60,
    },
    {
      header: "B",
      accessorKey: "B",
      size: 60,
    },
  ];

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-code-line me-2"></i>
          Note 36 - Tableau des codes (Formes juridiques)
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Ce tableau présente les codes des différentes formes juridiques selon la nomenclature réglementaire.
        </Alert>
      </div>

      <TableContainer
        columns={columns}
        data={paginatedData}
        isGlobalFilter={false}
        customPageSize={itemsPerPage}
      />

      <Pagination
        data={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
        showInfo={true}
      />
    </>
  );
};

export default CodesTable;