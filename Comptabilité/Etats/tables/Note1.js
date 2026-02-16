// components/tables/Note1Table.js
import React from "react";
import {
  Card,
  CardBody,
  Alert,
  Row,
  Col,
  Badge,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody
} from "reactstrap";

const Note1 = ({ data, formatAmount }) => {
  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-shield-check-line me-2"></i>
          Note 1 - Dettes garanties par des sûretés réelles et engagements financiers
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Cette note présente les dettes garanties par des sûretés réelles ainsi que les engagements financiers donnés et reçus par l'entité.
        </Alert>
      </div>

      {/* Tableau principal */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead>
            <tr>
              <th rowSpan="2" className="text-center align-middle" width="25%">
                LIBELLES
              </th>
              <th rowSpan="2" className="text-center align-middle" width="8%">
                Note
              </th>
              <th rowSpan="2" className="text-center align-middle" width="12%">
                Montant
                <br />
                brut (1)
              </th>
              <th colSpan="3" className="text-center" width="36%">
                SURETES REELLES (2)
              </th>
              <th rowSpan="2" className="text-center align-middle" width="12%">
                TOTAL
                <br />
                SURETES REELLES
              </th>
            </tr>
            <tr>
              <th className="text-center" width="12%">
                Hypothèques
              </th>
              <th className="text-center" width="12%">
                Nantissements
              </th>
              <th className="text-center" width="12%">
                Gages/autres
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const isTotal = item.note === "TOTAL";
              const rowClass = isTotal ? "table-primary" : "";
              
              return (
                <tr key={item.id} className={rowClass}>
                  <td className={isTotal ? "fw-bold" : ""}>
                    {item.libelle}
                  </td>
                  <td className={isTotal ? "fw-bold text-primary" : ""}>
                    {item.note}
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.montantBrut)} 
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.hypotheques)} 
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.nantissements)} 
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.gagesAutres)} 
                  </td>
                  <td className={`text-end fw-bold ${isTotal ? "text-primary" : ""}`}>
                    {formatAmount(item.totalSuretes)} 
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section de détails */}
      <Card className="mt-4 border-0 shadow-sm">
        <CardBody>
          <h6 className="mb-3">
            <i className="ri-search-eye-line me-2"></i>
            Détails des sûretés réelles et engagements
          </h6>
          
          <Accordion open="0">
            {data
              .filter(item => item.details && item.details.length > 0)
              .map((item, index) => (
                <AccordionItem key={`accordion-${item.id}`}>
                  <AccordionHeader targetId={`accordion-${item.id}`}>
                    <i className="ri-file-list-line me-2"></i>
                    {item.libelle} - Détails
                  </AccordionHeader>
                  <AccordionBody accordionId={`accordion-${item.id}`}>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th width="10%">Réf.</th>
                            <th width="40%">Description</th>
                            <th width="15%">Type</th>
                            <th width="15%">Montant</th>
                            <th width="20%">Informations complémentaires</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.details.map(detail => (
                            <tr key={detail.id}>
                              <td className="fw-bold">{detail.id}</td>
                              <td>{detail.description}</td>
                              <td>
                                <Badge
                                  color={
                                    detail.type === "hypotheque"
                                      ? "primary"
                                      : detail.type === "nantissement"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {detail.type === "hypotheque"
                                    ? "Hypothèque"
                                    : detail.type === "nantissement"
                                    ? "Nantissement"
                                    : "Gage/Autre"}
                                </Badge>
                              </td>
                              <td className="fw-semibold">
                                {formatAmount(detail.montant)} 
                              </td>
                              <td>
                                {detail.dateContrat && (
                                  <div>
                                    <small className="text-muted">
                                      Date: {detail.dateContrat}
                                    </small>
                                  </div>
                                )}
                                {detail.echeance && (
                                  <div>
                                    <small className="text-muted">
                                      Échéance: {detail.echeance}
                                    </small>
                                  </div>
                                )}
                                {(detail.beneficiaire || detail.donneur) && (
                                  <div>
                                    <small className="text-muted">
                                      {detail.beneficiaire
                                        ? `Bénéficiaire: ${detail.beneficiaire}`
                                        : `Donneur: ${detail.donneur}`}
                                    </small>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionBody>
                </AccordionItem>
              ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Légende et notes */}
      <Card className="mt-3 border-0 shadow-sm">
        <CardBody>
          <Row>
            <Col md={6}>
              <h6 className="mb-2">
                <i className="ri-information-line me-2"></i>
                Notes explicatives
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <strong>(1) Montant brut :</strong> Valeur nominale de la dette avant garanties
                </li>
                <li className="mb-1">
                  <strong>(2) Sûretés réelles :</strong> Garanties portant sur des biens spécifiques
                </li>
                <li className="mb-1">
                  <strong>Hypothèques :</strong> Garanties sur des immeubles
                </li>
                <li className="mb-1">
                  <strong>Nantissements :</strong> Garanties sur des biens mobiliers
                </li>
                <li className="mb-1">
                  <strong>Gages/autres :</strong> Autres types de garanties
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="mb-2">
                <i className="ri-bar-chart-line me-2"></i>
                Répartition des sûretés
              </h6>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-1">
                  <span>Hypothèques :</span>
                  <span className="fw-bold text-primary">
                    {formatAmount(15000000)} 
                    <small className="text-muted ms-1">(44%)</small>
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Nantissements :</span>
                  <span className="fw-bold text-success">
                    {formatAmount(8500000)} 
                    <small className="text-muted ms-1">(25%)</small>
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Gages/autres :</span>
                  <span className="fw-bold text-warning">
                    {formatAmount(10500000)} 
                    <small className="text-muted ms-1">(31%)</small>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default Note1;