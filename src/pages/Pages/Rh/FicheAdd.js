import React, { useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Table, Input } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const FicheAdd = () => {
  document.title = "Ajouter une fiche de paie | INAWO - Suite de Gestion";

  const ficheData = useMemo(
    () => ({
      entreprise: "",
      numero: "",
      mois: "",
      datePaie: "",
      nomPrenoms: "",
      emplois: "",
      matricule: "",
      categorie: "",
      situationFamiliale: "",
      salaireBase: "",
      primeAnciennete: "0",
      conges: "0",
      rappelsSalaire: "0",
      salaireBrut: "",
      cnss: "",
      its: "",
      totalRetenues: "",
      salaireNetPayer: "",
    }),
    []
  );

  const detailRows = [
    { label: "Nom et Prénoms", key: "nomPrenoms" },
    { label: "Emplois", key: "emplois" },
    { label: "N° Matricule", key: "matricule" },
    { label: "Catégorie", key: "categorie" },
    { label: "Situation Familiale", key: "situationFamiliale" },
    { label: "Salaire de base", key: "salaireBase" },
    { label: "Prime d'ancienneté", key: "primeAnciennete" },
    { label: "Congés", key: "conges" },
    { label: "Rappels sur salaire", key: "rappelsSalaire" },
    { label: "Salaire Brut", key: "salaireBrut" },
    { label: "CNSS (3,6%)", key: "cnss" },
    { label: "ITS", key: "its" },
    { label: "Total Retenues", key: "totalRetenues" },
    { label: "Salaire Net à Payer", key: "salaireNetPayer" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="&nbsp;Ajouter une fiche de paie"
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
            </>
          }
        />

        <Row>
          <Col lg={12}>
            <Card className="border-0" style={{ borderRadius: "20px" }}>
              <CardBody>
                <Table bordered className="align-middle mb-4">
                  <tbody>
                    <tr>
                      <td className="fw-bold" style={{ width: "25%" }}>ENTREPRISE</td>
                      <td className="fw-bold text-center" style={{ width: "55%" }}>LIVRE DE PAIE</td>
                      <td style={{ width: "20%" }}>
                        <div className="fw-bold mb-1">N°</div>
                        <Input type="text" bsSize="sm" defaultValue={ficheData.numero} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="fw-bold mb-1">Mois :</div>
                        <Input type="text" bsSize="sm" defaultValue={ficheData.mois} />
                      </td>
                      <td>
                        <div className="fw-bold mb-1">Date de Paie:</div>
                        <Input type="date" bsSize="sm" defaultValue={ficheData.datePaie} />
                      </td>
                      <td>
                        <div className="fw-bold mb-1">Entreprise</div>
                        <Input type="text" bsSize="sm" defaultValue={ficheData.entreprise} />
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Table bordered className="align-middle mb-0">
                  <tbody>
                    {detailRows.map((row) => (
                      <tr key={row.key}>
                        <td className="fw-semibold" style={{ width: "35%" }}>{row.label}</td>
                        <td style={{ width: "65%" }}>
                          <Input type="text" bsSize="sm" defaultValue={ficheData[row.key]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FicheAdd;
