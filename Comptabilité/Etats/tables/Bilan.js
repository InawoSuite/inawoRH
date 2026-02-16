import React from "react";
import { Card, CardBody } from "reactstrap";

const Bilan = ({ data, formatAmount, type = "complet" }) => {
  
  const renderBilanComplet = () => (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0" style={{ fontSize: "0.85rem" }}>
        <thead>
          <tr>
            <th colSpan="9" className="text-center bg-success text-white">
              <strong>ACTIF (1)</strong>
            </th>
            <th colSpan="7" className="text-center bg-primary text-white">
              <strong>PASSIF</strong>
            </th>
          </tr>
          <tr className="">
            <th rowSpan="2" className="text-center align-middle">REF</th>
            <th colSpan="3" className="text-center">EXERCICE au 31/12/N</th>
            <th rowSpan="2" className="text-center align-middle">NET<br />EXERCICE au 31/12/N-1</th>
            <th colSpan="3" className="text-center">EXERCICE au 31/12/N</th>
            <th rowSpan="2" className="text-center align-middle">NET<br />EXERCICE au 31/12/N-1</th>
            <th rowSpan="2" className="text-center align-middle">REF</th>
            <th rowSpan="2" className="text-center align-middle">NOTE</th>
            <th colSpan="2" className="text-center">EXERCICE AU 31/12/N</th>
            <th colSpan="2" className="text-center">EXERCICE AU 31/12/N-1</th>
          </tr>
          <tr className="">
            <th className="text-center">NOTE</th>
            <th className="text-center">BRUT</th>
            <th className="text-center">"AMORT et<br />DEPREC."</th>
            <th className="text-center">NOTE</th>
            <th className="text-center">BRUT</th>
            <th className="text-center">"AMORT et<br />DEPREC."</th>
            <th className="text-center">NET</th>
            <th className="text-center">NET</th>
            <th className="text-center">NET</th>
            <th className="text-center">NET</th>
          </tr>
        </thead>
        <tbody>
          {/* Exemple de ligne - vous adapterez avec vos données */}
          <tr>
            <td className="fw-bold">20</td>
            <td className="text-muted">-</td>
            <td className="text-end fw-semibold">{formatAmount(1500000)}</td>
            <td className="text-end text-danger">{formatAmount(300000)}</td>
            <td className="text-end fw-bold text-success">{formatAmount(1200000)}</td>
            <td className="text-muted">-</td>
            <td className="text-end fw-semibold text-muted">{formatAmount(1400000)}</td>
            <td className="text-end text-danger text-muted">{formatAmount(250000)}</td>
            <td className="text-end fw-bold text-primary">{formatAmount(1150000)}</td>
            <td colSpan="7" className="text-center text-muted">-</td>
          </tr>
          {/* ... autres lignes */}
        </tbody>
      </table>
    </div>
  );

  const renderActifSeul = () => (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0" style={{ fontSize: "0.85rem" }}>
        <thead>
          <tr>
            <th colSpan="9" className="text-center bg-success text-white">
              <strong>ACTIF</strong>
            </th>
          </tr>
          {/* ... headers similaires mais seulement pour l'actif */}
        </thead>
        <tbody>
          {/* Données actif seulement */}
        </tbody>
      </table>
    </div>
  );

  const renderPassifSeul = () => (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0" style={{ fontSize: "0.85rem" }}>
        <thead>
          <tr>
            <th colSpan="7" className="text-center bg-primary text-white">
              <strong>PASSIF</strong>
            </th>
          </tr>
          {/* ... headers similaires mais seulement pour le passif */}
        </thead>
        <tbody>
          {/* Données passif seulement */}
        </tbody>
      </table>
    </div>
  );

  const getTitle = () => {
    switch(type) {
      case "complet": return "Bilan Complet (Actif + Passif)";
      case "actif": return "Bilan - Actif";
      case "passif": return "Bilan - Passif";
      default: return "Bilan";
    }
  };

  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-file-chart-line me-2"></i>
          {getTitle()}
        </h5>
      </div>

      {type === "complet" && renderBilanComplet()}
      {type === "actif" && renderActifSeul()}
      {type === "passif" && renderPassifSeul()}

      <Card className="mt-3 border-0 shadow-sm">
        <CardBody className="p-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-muted me-2">Légende :</span>
            {type !== "passif" && <span className="badge bg-success me-2">ACTIF</span>}
            {type !== "actif" && <span className="badge bg-primary me-2">PASSIF</span>}
            <span className="text-success me-2">
              <i className="ri-checkbox-blank-circle-fill me-1"></i>
              Valeurs N (Exercice courant)
            </span>
            <span className="text-primary me-2">
              <i className="ri-checkbox-blank-circle-fill me-1"></i>
              Valeurs N-1 (Exercice précédent)
            </span>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Bilan;