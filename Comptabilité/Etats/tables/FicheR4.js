import React from "react";
import { Alert, Card, CardBody, Badge } from "reactstrap";

const Fiche4 = ({ data, formatAmount }) => {
  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-building-4-line me-2"></i>
          Fiche R4 - Immobilisations et Annexes
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Cette fiche regroupe toutes les notes annexes selon la nomenclature réglementaire.
        </Alert>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered rounded-4 table-hover align-middle mb-0">
          <thead className="rounded-top-4">
            <tr>
              <th width="10%" className="text-center">NOTES</th>
              <th width="60%" className="text-center">INTITULÉS</th>
              <th width="15%" className="text-center">A</th>
              <th width="15%" className="text-center">N/A</th>
            </tr>
          </thead>
          <tbody>
            {/* Note 1 */}
            <tr>
              <td className="fw-bold text-center">NOTE 1</td>
              <td>DETTES GARANTIES PAR DES SURETES REELLES ET LES ENGAGEMENTS FINANCIERS</td>
              <td className="text-center">
                <Badge color="success" className="rounded-pill">✓</Badge>
              </td>
              <td className="text-center">-</td>
            </tr>

            {/* Note 2 */}
            <tr>
              <td className="fw-bold text-center">NOTE 2</td>
              <td>INFORMATIONS OBLIGATOIRES</td>
              <td className="text-center">
                <Badge color="success" className="rounded-pill">✓</Badge>
              </td>
              <td className="text-center">-</td>
            </tr>

            {/* ... toutes les autres notes ... */}

            {/* Notes DGI & INS */}
            <tr className="table-primary">
              <td className="fw-bold text-center">NOTES DGI & INS</td>
              <td>ETATS SUPPLEMENTAIRES DGI et INS</td>
              <td className="text-center">
                <Badge color="info" className="rounded-pill">!</Badge>
              </td>
              <td className="text-center">N/A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Card className="mt-3 border-0 shadow-sm">
        <CardBody className="p-3">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <span className="text-muted me-2">Légende :</span>
            <Badge color="success" className="me-2">
              <i className="ri-check-line me-1"></i> Applicable (A)
            </Badge>
            <Badge color="warning" className="me-2">
              <i className="ri-information-line me-1"></i> Non applicable (N/A)
            </Badge>
            <Badge color="info" className="me-2">
              <i className="ri-alert-line me-1"></i> Spécial DGI/INS
            </Badge>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Fiche4;