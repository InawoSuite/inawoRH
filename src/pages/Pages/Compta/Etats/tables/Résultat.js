import React from "react";
import { Card, CardBody } from "reactstrap";

const Resultat = ({ data, formatAmount }) => {
  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-calculator-line me-2"></i>
          Compte de Résultat
        </h5>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle mb-0" style={{ fontSize: "0.85rem" }}>
          <thead className="rounded-top-4">
            <tr className="rounded-top-4">
              <th className="text-center align-middle">REF</th>
              <th className="text-center align-middle">LIBELLES</th>
              <th className="text-center align-middle">NOTE</th>
              <th className="text-center align-middle">"EXERCICE AU<br />31/12/N"<br />NET (1)</th>
              <th className="text-center align-middle">"EXERCICE AU 31/12/N-1"<br />NET (1)</th>
            </tr>
          </thead>
          <tbody>
            {/* PRODUITS - Section A */}
            <tr>
              <td colSpan="5" className="fw-bold text-success">
                <i className="ri-arrow-up-line me-1"></i>
                PRODUITS
              </td>
            </tr>

            {/* Exemple de lignes */}
            <tr>
              <td className="fw-bold">TA</td>
              <td>Ventes de marchandises</td>
              <td className="text-center">A + 21</td>
              <td className="text-end fw-semibold text-success">{formatAmount(8500000)}</td>
              <td className="text-end text-muted">{formatAmount(7200000)}</td>
            </tr>

            <tr>
              <td className="fw-bold">TB</td>
              <td>Ventes de produits fabriqués</td>
              <td className="text-center">B + 21</td>
              <td className="text-end fw-semibold text-success">{formatAmount(3200000)}</td>
              <td className="text-end text-muted">{formatAmount(2800000)}</td>
            </tr>

            {/* ... plus de lignes ... */}

            {/* Total Produits */}
            <tr className="table-success">
              <td colSpan="3" className="fw-bold">TOTAL PRODUITS</td>
              <td className="text-end fw-bold">{formatAmount(16500000)}</td>
              <td className="text-end fw-bold">{formatAmount(14150000)}</td>
            </tr>

            {/* ... sections CHARGES et RÉSULTAT ... */}
          </tbody>
        </table>
      </div>

      <Card className="mt-3 border-0 shadow-sm">
        <CardBody className="p-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-muted me-2">Légende :</span>
            <span className="badge bg-success me-2">Produits</span>
            <span className="badge bg-danger me-2">Charges</span>
            <span className="badge bg-primary me-2">Résultat</span>
            <span className="badge bg-info me-2">Soldes intermédiaires</span>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Resultat;