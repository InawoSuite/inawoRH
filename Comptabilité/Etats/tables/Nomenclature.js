import React from "react";
import { Alert, Card, CardBody, Badge } from "reactstrap";

const NomenclatureTable = ({ data, formatAmount }) => {
  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-list-check-2 me-2"></i>
          Nomenclature des Activités - Tableau 36B
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Cette nomenclature présente les activités classées selon le système national.
        </Alert>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="">
            <tr>
              <th width="15%" className="text-center">
                Code Activité
              </th>
              <th width="35%" className="text-center">
                Activités
              </th>
              <th width="15%" className="text-center">
                Code Activité
              </th>
              <th width="35%" className="text-center">
                Activités
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const halfLength = Math.ceil(data.length / 2);
              const rows = [];

              for (let i = 0; i < halfLength; i++) {
                const item1 = data[i];
                const item2 = data[i + halfLength];

                const isCategory1 = item1 && !item1.codeActivite && item1.codeActivite !== "000000";
                const isCategory2 = item2 && !item2.codeActivite && item2.codeActivite !== "000000";

                rows.push(
                  <tr key={i}>
                    <td className={isCategory1 ? "fw-bold text-success" : "fw-medium"}>
                      {item1?.codeActivite || ""}
                    </td>
                    <td className={isCategory1 ? "fw-bold text-success" : ""}>
                      {item1?.activite || ""}
                    </td>
                    <td className={isCategory2 ? "fw-bold text-success" : "fw-medium"}>
                      {item2?.codeActivite || ""}
                    </td>
                    <td className={isCategory2 ? "fw-bold text-success" : ""}>
                      {item2?.activite || ""}
                    </td>
                  </tr>
                );
              }

              return rows;
            })()}
          </tbody>
        </table>
      </div>

      <Card className="mt-3 border-0 shadow-sm">
        <CardBody className="p-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-muted me-2">Légende :</span>
            <Badge color="success" className="me-2">Agriculture</Badge>
            <Badge color="info" className="me-2">Élevage/Pêche</Badge>
            <Badge color="warning" className="me-2">Industrie</Badge>
            <Badge color="danger" className="me-2">Transformation</Badge>
            <Badge color="primary" className="me-2">Services</Badge>
            <span className="fw-bold text-success me-2">
              <i className="ri-bookmark-line me-1"></i>
              Catégorie principale
            </span>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default NomenclatureTable;