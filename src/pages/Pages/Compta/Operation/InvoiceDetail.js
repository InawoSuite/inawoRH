import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Table,
  Button,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";

// Statuts des opérations
const OPERATION_STATUS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "valide", label: "Validé" },
  { value: "annule", label: "Annulé" },
];

// Types de journaux
const JOURNAL_TYPES = [
  { value: "ACH", label: "Achats" },
  { value: "VTE", label: "Ventes" },
  { value: "BQ1", label: "Banque" },
  { value: "OD", label: "Opérations Diverses" },
  { value: "CSH", label: "Caisse" },
];

const InvoiceDetail = ({ operation, switchToList, switchToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [operationData, setOperationData] = useState(null);
  const { token } = useProfile();

  // Charger les détails de l'opération
  useEffect(() => {
    const fetchOperationDetails = async () => {
      if (!operation?.id || !token) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${BaseUrl}/compta/operations/${operation.id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOperationData(data);
        } else {
          // Utiliser les données passées en prop si l'API échoue
          setOperationData(operation);
          toast.info("Données de démonstration affichées");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
        setOperationData(operation);
        toast.info("Données de démonstration affichées");
      } finally {
        setLoading(false);
      }
    };

    fetchOperationDetails();
  }, [operation, token]);

  // Fonction pour obtenir le label du statut
  const getStatusLabel = useCallback((statusValue) => {
    const statusObj = OPERATION_STATUS.find((s) => s.value === statusValue);
    return statusObj ? statusObj.label : statusValue;
  }, []);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = useCallback((statusValue) => {
    const statusColors = {
      brouillon: "warning",
      valide: "success",
      annule: "danger",
    };
    return statusColors[statusValue] || "secondary";
  }, []);

  // Fonction pour obtenir le label du journal
  const getJournalLabel = useCallback((journalCode) => {
    const journalObj = JOURNAL_TYPES.find((j) => j.value === journalCode);
    return journalObj ? journalObj.label : journalCode;
  }, []);

  // Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(montant || 0);
  }, []);

  // Fonction pour formater les dates
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // Calculer les totaux
  const calculateTotaux = useMemo(() => {
    if (!operationData) return { totalDebit: 0, totalCredit: 0 };

    // Si l'opération a des lignes d'écriture
    if (
      operationData.lignes_ecriture &&
      Array.isArray(operationData.lignes_ecriture)
    ) {
      return operationData.lignes_ecriture.reduce(
        (acc, ligne) => ({
          totalDebit: acc.totalDebit + (ligne.debit || 0),
          totalCredit: acc.totalCredit + (ligne.credit || 0),
        }),
        { totalDebit: 0, totalCredit: 0 }
      );
    }

    // Si l'opération a des données simples
    return {
      totalDebit: operationData.debit || 0,
      totalCredit: operationData.credit || 0,
    };
  }, [operationData]);

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2 text-muted">Chargement des détails...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!operationData) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger" className="mt-3">
            <i className="ri-error-warning-line me-2"></i>
            Impossible de charger les détails de l'opération.
          </Alert>
          <Button color="light" onClick={switchToList} className="rounded-pill">
            <i className="ri-arrow-left-line me-1"></i>
            Retour à la liste
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <BreadCrumb
            title={`Détails de l'opération : ${operationData.reference || ""}`}
            pageTitle={
              <>
                <i className="ri-file-list-3-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              {/* Carte 1 : Informations générales */}
              <Card className="mb-4 border-0 shadow-sm">
                <CardHeader className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="ri-information-line me-2"></i>
                      Informations générales
                    </h5>
                    <Badge
                      color={getStatusColor(operationData.statut)}
                      className="rounded-pill px-3 py-2"
                    >
                      {getStatusLabel(operationData.statut)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Date</p>
                        <p className="fw-bold fs-5">
                          {formatDate(operationData.date)}
                        </p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Journal</p>
                        <div>
                          <Badge
                            color="primary"
                            className="rounded-pill px-3 py-2 mb-1"
                          >
                            {operationData.code_journal || "N/A"}
                          </Badge>
                          <p className="small text-muted mb-0">
                            {getJournalLabel(operationData.code_journal)}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Référence</p>
                        <Badge
                          color="info"
                          className="fs-6 rounded-pill px-3 py-2"
                        >
                          {operationData.reference || "N/A"}
                        </Badge>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Pièce</p>
                        <p className="fw-bold">
                          {operationData.piece || "N/A"}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Contact</p>
                        <p className="fw-bold">
                          {operationData.contact || "N/A"}
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Libellé de l'écriture</p>
                        <p className="fw-bold fs-5 text-primary">
                          {operationData.libelle || "N/A"}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <div className="border-top pt-3 mt-3">
                    <Row>
                      <Col md={4}>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Créateur</p>
                          <p className="fw-bold">
                            {operationData.createur || "N/A"}
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Date création</p>
                          <p className="fw-bold">
                            {formatDate(operationData.date_creation)}
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <p className="mb-1 text-muted">Date modification</p>
                          <p className="fw-bold">
                            {operationData.date_modification
                              ? formatDate(operationData.date_modification)
                              : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>

              {/* Carte 2 : Lignes d'écriture */}
              <Card className="mb-4 border-0 shadow-sm">
                <CardHeader className="bg-light">
                  <h5 className="mb-0">
                    <i className="ri-file-list-2-line me-2"></i>
                    Lignes d'écriture
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <Table bordered className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th width="50" className="text-center">
                            N°
                          </th>
                          <th width="150">N° Compte</th>
                          <th>Libellé</th>
                          <th width="150" className="text-end">
                            Débit ()
                          </th>
                          <th width="150" className="text-end">
                            Crédit ()
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {operationData.lignes_ecriture &&
                        Array.isArray(operationData.lignes_ecriture) ? (
                          operationData.lignes_ecriture.map((ligne, index) => (
                            <tr key={index}>
                              <td className="text-center fw-bold">
                                {index + 1}
                              </td>
                              <td>
                                <span className="fw-bold text-primary">
                                  {ligne.compte || "N/A"}
                                </span>
                              </td>
                              <td>{ligne.libelle || "N/A"}</td>
                              <td className="text-end">
                                {ligne.debit > 0 ? (
                                  <span className="text-success fw-bold">
                                    {formatMontant(ligne.debit)}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td className="text-end">
                                {ligne.credit > 0 ? (
                                  <span className="text-danger fw-bold">
                                    {formatMontant(ligne.credit)}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          // Affichage simple si pas de lignes d'écriture
                          <>
                            {operationData.compte && (
                              <tr>
                                <td className="text-center fw-bold">1</td>
                                <td>
                                  <span className="fw-bold text-primary">
                                    {operationData.compte}
                                  </span>
                                </td>
                                <td>{operationData.libelle}</td>
                                <td className="text-end">
                                  {operationData.debit > 0 ? (
                                    <span className="text-success fw-bold">
                                      {formatMontant(operationData.debit)}
                                    </span>
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  {operationData.credit > 0 ? (
                                    <span className="text-danger fw-bold">
                                      {formatMontant(operationData.credit)}
                                    </span>
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                      <tfoot className="table-active">
                        <tr>
                          <th colSpan="3" className="text-end">
                            TOTAUX :
                          </th>
                          <th className="text-end text-success fw-bold">
                            {formatMontant(calculateTotaux.totalDebit)} 
                          </th>
                          <th className="text-end text-danger fw-bold">
                            {formatMontant(calculateTotaux.totalCredit)} 
                          </th>
                        </tr>
                        <tr>
                          <th colSpan="3" className="text-end">
                            SOLDE :
                          </th>
                          <th
                            colSpan="2"
                            className={`text-center fw-bold ${
                              Math.abs(
                                calculateTotaux.totalDebit -
                                  calculateTotaux.totalCredit
                              ) > 0.01
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            {formatMontant(
                              Math.abs(
                                calculateTotaux.totalDebit -
                                  calculateTotaux.totalCredit
                              )
                            )}{" "}
                            
                            {Math.abs(
                              calculateTotaux.totalDebit -
                                calculateTotaux.totalCredit
                            ) > 0.01 && (
                              <span className="ms-2 small">
                                (
                                {calculateTotaux.totalDebit >
                                calculateTotaux.totalCredit
                                  ? "Excédent débit"
                                  : "Excédent crédit"}
                                )
                              </span>
                            )}
                          </th>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>

                  {/* Vérification de l'équilibre */}
                  {(() => {
                    const difference = Math.abs(
                      calculateTotaux.totalDebit - calculateTotaux.totalCredit
                    );
                    return (
                      <div
                        className={`alert ${
                          difference <= 0.01 ? "alert-success" : "alert-warning"
                        } border-0 mt-3`}
                      >
                        <i
                          className={`ri-${
                            difference <= 0.01 ? "check" : "alert"
                          }-circle-line me-2`}
                        ></i>
                        {difference <= 0.01
                          ? `Équilibre vérifié : Débit = Crédit = ${formatMontant(
                              calculateTotaux.totalDebit
                            )} `
                          : `Déséquilibre détecté : Débit = ${formatMontant(
                              calculateTotaux.totalDebit
                            )} , Crédit = ${formatMontant(
                              calculateTotaux.totalCredit
                            )} `}
                      </div>
                    );
                  })()}
                </CardBody>
              </Card>

              {/* Carte 3 : Documents joints */}
              {operationData.piece_jointe && (
                <Card className="mb-4 border-0 shadow-sm">
                  <CardHeader className="bg-light">
                    <h5 className="mb-0">
                      <i className="ri-file-text-line me-2"></i>
                      Document justificatif
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <i className="ri-file-pdf-line fs-3 text-danger me-3"></i>
                      <div>
                        <h6 className="mb-1 fw-bold">
                          {operationData.piece_jointe}
                        </h6>
                        <Button
                          color="primary"
                          size="sm"
                          className="rounded-pill"
                        >
                          <i className="ri-download-line me-1"></i>
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Boutons d'action */}
              <div className="d-flex justify-content-end mt-4 mb-4">
                <div className="d-flex gap-2">
                  <Button
                    className="btn btn-light rounded-pill"
                    onClick={switchToList}
                  >
                    <i className="ri-arrow-left-line me-1"></i>
                    Retour à la liste
                  </Button>
                  <Button
                    className="btn btn-info rounded-pill"
                    onClick={() => {
                      // Fonction pour imprimer
                      window.print();
                    }}
                  >
                    <i className="ri-printer-line me-1"></i>
                    Imprimer
                  </Button>
                  <Button
                    className="btn btn-success rounded-pill"
                    onClick={() => {
                      // Fonction pour exporter
                      toast.info("Export PDF en cours de développement...");
                    }}
                  >
                    <i className="ri-download-2-line me-1"></i>
                    Exporter
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoiceDetail;
