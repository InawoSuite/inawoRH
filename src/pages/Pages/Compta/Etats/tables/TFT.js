import React from "react";
import { Alert, Card, CardBody, Badge, Row, Col } from "reactstrap";

const TFT = ({ data, formatAmount }) => {
  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-exchange-dollar-line me-2"></i>
          Tableau de Financement par Tiers (TFT)
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Ce tableau retrace les flux de trésorerie selon la méthode indirecte, ventilés par catégories d'activités.
        </Alert>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead>
            <tr>
              <th rowSpan="2" className="text-center align-middle">REF</th>
              <th rowSpan="2" className="text-center align-middle">LIBELLES</th>
              <th colSpan="1" className="text-center align-middle">(4)</th>
              <th rowSpan="2" className="text-center align-middle">NOTE</th>
              <th rowSpan="2" className="text-center align-middle">EXERCICE<br />N</th>
              <th rowSpan="2" className="text-center align-middle">EXERCICE<br />N-1</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              let rowClass = "";
              let isTotalRow = false;

              if (item.type === "tresorerie_initiale") {
                rowClass = "table-primary";
              } else if (item.type.includes("total")) {
                rowClass = "table-success";
                isTotalRow = true;
              } else if (item.type === "synthese" || item.type === "tresorerie_finale") {
                rowClass = "table-warning";
                isTotalRow = true;
              } else if (item.type === "tiers") {
                rowClass = "table-light";
              }

              return (
                <tr key={index} className={rowClass}>
                  <td className={`fw-bold ${isTotalRow ? "text-primary" : ""}`}>
                    {item.ref}
                  </td>
                  <td style={{
                    whiteSpace: "normal",
                    paddingLeft: item.libelle.startsWith(" - ") || item.libelle.startsWith(" + ") ? "30px" : "10px",
                  }}>
                    {item.libelle}
                  </td>
                  <td></td>
                  <td className={!isNaN(item.note) && item.note !== "" ? "text-muted" : ""}>
                    {item.note}
                  </td>
                  <td className="text-end">
                    {item.exerciceN === 0 ? "0" : (
                      <>
                        <span className={item.exerciceN < 0 ? "text-danger" : "text-success"}>
                          {formatAmount(Math.abs(item.exerciceN))}
                          {item.exerciceN < 0 ? " -" : ""}
                        </span>
                        {isTotalRow && " "}
                      </>
                    )}
                  </td>
                  <td className="text-end text-muted">
                    {item.exerciceN1 === 0 ? "0" : (
                      <>
                        {formatAmount(Math.abs(item.exerciceN1))}
                        {item.exerciceN1 < 0 ? " -" : ""}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Card className="mt-3 border-0 shadow-sm">
        <CardBody>
          <Row>
            <Col md={6}>
              <h6 className="mb-2">
                <i className="ri-information-line me-2"></i>
                Analyse des flux de trésorerie
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <Badge color="success" className="me-2">CAFG</Badge>
                  Capacité d'Autofinancement Globale
                </li>
                <li className="mb-1">
                  <Badge color="primary" className="me-2">BFR</Badge>
                  Besoin en Fonds de Roulement
                </li>
                <li className="mb-1">
                  <Badge color="warning" className="me-2">∆ Trésorerie</Badge>
                  Variation nette de trésorerie
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="mb-2">
                <i className="ri-trending-up-line me-2"></i>
                Indicateurs clés
              </h6>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-1">
                  <span>CAFG / CA :</span>
                  <span className="fw-bold text-success">20.0%</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Autofinancement / Investissements :</span>
                  <span className="fw-bold text-info">125.0%</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>∆ Trésorerie nette :</span>
                  <span className="fw-bold text-primary">+{formatAmount(2100000)} </span>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default TFT;