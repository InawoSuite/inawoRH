import React from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import Pagination from "../../../../Components/Common/Pagination";
import { Alert } from "reactstrap";

const FicheR3 = ({ data, formatAmount, currentPage, setCurrentPage, itemsPerPage = 10 }) => {
  
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
      header: "Nom et prénom",
      accessorKey: "nomPrenom",
      size: 150,
    },
    {
      header: "Nationalité",
      accessorKey: "nationalite",
      size: 100,
    },
    {
      header: "Qualité",
      accessorKey: "qualite",
      size: 120,
    },
    {
      header: "Ident. fiscale",
      accessorKey: "identFiscale",
      size: 120,
    },
    {
      header: "Adresse",
      accessorKey: "adresse",
      size: 200,
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
          <i className="ri-user-fill me-2"></i>
          Fiche R3 - Informations sur les dirigeants et représentants
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Cette fiche présente les informations relatives aux dirigeants, administrateurs et commissaires aux comptes.
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

export default FicheR3;