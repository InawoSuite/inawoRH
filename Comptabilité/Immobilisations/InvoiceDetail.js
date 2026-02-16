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
  Progress,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";

// Types d'immobilisations
const ASSET_TYPES = [
  { value: "corporel", label: "Corporel" },
  { value: "incorporel", label: "Incorporel" },
  { value: "financier", label: "Financier" },
];

// Méthodes d'amortissement
const AMORTISEMENT_METHODS = [
  { value: "lineaire", label: "Linéaire" },
  { value: "degressif", label: "Dégressif" },
  { value: "exceptionnel", label: "Exceptionnel" },
];

// États des immobilisations
const ASSET_STATUS = [
  { value: "actif", label: "Actif" },
  { value: "cede", label: "Cédé" },
  { value: "hors_service", label: "Hors service" },
  { value: "en_maintenance", label: "En maintenance" },
];

// Comptes d'actif (classe 21X)
const ACTIF_ACCOUNTS = [
  { value: "211", label: "211 - Terrains" },
  { value: "212", label: "212 - Constructions" },
  { value: "213", label: "213 - Installations techniques" },
  { value: "214", label: "214 - Matériel industriel" },
  { value: "215", label: "215 - Matériel de bureau" },
  { value: "216", label: "216 - Matériel informatique" },
  { value: "217", label: "217 - Matériel de transport" },
  { value: "218", label: "218 - Autres immobilisations corporelles" },
  { value: "221", label: "221 - Immobilisations incorporelles" },
  { value: "241", label: "241 - Titres de participation" },
  { value: "242", label: "242 - Autres titres immobilisés" },
  { value: "2411", label: "2411 - Matériel industriel spécifique" },
  { value: "2441", label: "2441 - Matériel de bureau spécifique" },
];

// Comptes d'amortissement (classe 28X)
const AMORTISEMENT_ACCOUNTS = [
  { value: "281", label: "281 - Amortissements des constructions" },
  { value: "282", label: "282 - Amortissements des installations" },
  { value: "283", label: "283 - Amortissements du matériel industriel" },
  { value: "284", label: "284 - Amortissements du matériel de bureau" },
  { value: "285", label: "285 - Amortissements du matériel informatique" },
  { value: "286", label: "286 - Amortissements du matériel de transport" },
  { value: "287", label: "287 - Amortissements des autres immobilisations" },
  { value: "28154", label: "28154 - Amortissements matériel spécifique" },
];

// Comptes de charge (classe 68X)
const CHARGE_ACCOUNTS = [
  { value: "6811", label: "6811 - Dotations aux amortissements des immobilisations" },
  { value: "68111", label: "68111 - Dotations aux amortissements des constructions" },
  { value: "68112", label: "68112 - Dotations aux amortissements des installations" },
  { value: "68113", label: "68113 - Dotations aux amortissements du matériel industriel" },
  { value: "68114", label: "68114 - Dotations aux amortissements du matériel de bureau" },
  { value: "68115", label: "68115 - Dotations aux amortissements du matériel informatique" },
  { value: "68116", label: "68116 - Dotations aux amortissements du matériel de transport" },
  { value: "68117", label: "68117 - Dotations aux amortissements des autres immobilisations" },
];

const ImmobilisationDetail = ({ immobilisation, switchToList, switchToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [immobilisationData, setImmobilisationData] = useState(null);
  const { token } = useProfile();

  // Données de démonstration
  const demoImmobilisation = useMemo(() => ({
    id: "IMM-2024-001",
    code: "IMM-2024-001",
    designation: "Véhicule utilitaire n°1",
    type: "corporel",
    type_label: "Corporel",
    date_acquisition: "2024-01-15",
    valeur_origine: 25000000,
    cumul_amortissement: 5000000,
    valeur_comptable: 20000000,
    taux_amortissement: 20,
    duree_amortissement: 5,
    methode_amortissement: "lineaire",
    methode_label: "Linéaire",
    compte_actif: "217",
    compte_actif_label: " - Matériel de transport",
    compte_amortissement: "286",
    compte_amortissement_label: " - Amortissements du matériel de transport",
    compte_charge: "68116",
    compte_charge_label: " - Dotations aux amortissements du matériel de transport",
    statut: "actif",
    statut_label: "Actif",
    localisation: "Siège principal",
    responsable: "Jean Dupont",
    date_mise_service: "2024-01-20",
    fournisseur: "Toyota Gabon",
    numero_serie: "VH-2024-001",
    observations: "Véhicule de service - Couleur blanche",
    amortissement_annuel: 5000000,
    date_creation: "2024-01-15T10:30:00Z",
    createur: "Admin",
    date_modification: "2024-06-15T14:20:00Z",
  }), []);

  // Charger les détails de l'immobilisation
  useEffect(() => {
    const fetchImmobilisationDetails = async () => {
      if (!immobilisation?.id && !token) {
        // Utiliser les données de démonstration
        setImmobilisationData(demoImmobilisation);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${BaseUrl}/immobilisations/${immobilisation.id}/`,
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
          // Enrichir les données avec les labels
          const enrichedData = {
            ...data,
            type_label: ASSET_TYPES.find(t => t.value === data.type)?.label || data.type,
            methode_label: AMORTISEMENT_METHODS.find(m => m.value === data.methode_amortissement)?.label || data.methode_amortissement,
            statut_label: ASSET_STATUS.find(s => s.value === data.statut)?.label || data.statut,
            compte_actif_label: ACTIF_ACCOUNTS.find(c => c.value === data.compte_actif)?.label || data.compte_actif,
            compte_amortissement_label: AMORTISEMENT_ACCOUNTS.find(c => c.value === data.compte_amortissement)?.label || data.compte_amortissement,
            compte_charge_label: CHARGE_ACCOUNTS.find(c => c.value === data.compte_charge)?.label || data.compte_charge,
          };
          setImmobilisationData(enrichedData);
        } else {
          // Utiliser les données de démonstration
          setImmobilisationData(demoImmobilisation);
          toast.info("Données de démonstration affichées");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
        setImmobilisationData(demoImmobilisation);
        toast.info("Données de démonstration affichées");
      } finally {
        setLoading(false);
      }
    };

    fetchImmobilisationDetails();
  }, [immobilisation, token, demoImmobilisation]);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = useCallback((statusValue) => {
    const statusColors = {
      actif: "success",
      cede: "danger",
      hors_service: "warning",
      en_maintenance: "info",
    };
    return statusColors[statusValue] || "secondary";
  }, []);

  // Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  // Calculer le pourcentage d'amortissement
  const calculateAmortissementPercentage = useMemo(() => {
    if (!immobilisationData?.valeur_origine || !immobilisationData?.cumul_amortissement) 
      return 0;
    
    return Math.min((immobilisationData.cumul_amortissement / immobilisationData.valeur_origine) * 100, 100);
  }, [immobilisationData]);

  // Calculer le temps restant
  const calculateTempsRestant = useMemo(() => {
    if (!immobilisationData?.duree_amortissement || !immobilisationData?.date_acquisition) 
      return { annees: 0, mois: 0 };

    const dateAcquisition = new Date(immobilisationData.date_acquisition);
    const maintenant = new Date();
    const moisEcoules = Math.floor(
      (maintenant - dateAcquisition) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const anneesEcoulees = Math.floor(moisEcoules / 12);
    const moisRestants = Math.max(0, immobilisationData.duree_amortissement * 12 - moisEcoules);
    
    return {
      annees: Math.floor(moisRestants / 12),
      mois: moisRestants % 12,
    };
  }, [immobilisationData]);

  // Calculer le temps écoulé
  const calculateTempsEcoule = useMemo(() => {
    if (!immobilisationData?.date_acquisition) 
      return { annees: 0, mois: 0 };

    const dateAcquisition = new Date(immobilisationData.date_acquisition);
    const maintenant = new Date();
    const difference = maintenant - dateAcquisition;
    const moisEcoules = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
    
    return {
      annees: Math.floor(moisEcoules / 12),
      mois: moisEcoules % 12,
    };
  }, [immobilisationData]);

  // Calculer la valeur amortie par mois
  const calculateAmortissementMensuel = useMemo(() => {
    if (!immobilisationData?.amortissement_annuel) return 0;
    return Math.round(immobilisationData.amortissement_annuel / 12);
  }, [immobilisationData]);

  // Calculer l'historique d'amortissement
  const calculateHistoriqueAmortissement = useMemo(() => {
    if (!immobilisationData) return [];

    const historique = [];
    const dateAcquisition = new Date(immobilisationData.date_acquisition);
    const amortissementAnnuel = immobilisationData.valeur_origine * (immobilisationData.taux_amortissement / 100);

    for (let annee = 1; annee <= immobilisationData.duree_amortissement; annee++) {
      const dateFinAnnee = new Date(dateAcquisition);
      dateFinAnnee.setFullYear(dateFinAnnee.getFullYear() + annee);
      
      const cumulAmortissement = Math.min(amortissementAnnuel * annee, immobilisationData.valeur_origine);
      const valeurComptable = Math.max(immobilisationData.valeur_origine - cumulAmortissement, 0);

      historique.push({
        annee,
        date_fin: dateFinAnnee,
        amortissement_annuel: amortissementAnnuel,
        cumul_amortissement: cumulAmortissement,
        valeur_comptable: valeurComptable,
        termine: annee <= Math.ceil(calculateTempsEcoule.annees),
      });
    }

    return historique;
  }, [immobilisationData, calculateTempsEcoule.annees]);

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

  if (!immobilisationData) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger" className="mt-3">
            <i className="ri-error-warning-line me-2"></i>
            Impossible de charger les détails de l'immobilisation.
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
            title={`Détails de l'immobilisation : ${immobilisationData.designation || ""}`}
            pageTitle={
              <>
                <i className="ri-building-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              {/* Section 1 : En-tête avec statut et code */}
              <Card className="mb-4 border-0 shadow-sm rounded-4">
                <CardBody className="p-4">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="ri-building-line fs-1 text-primary"></i>
                        </div>
                        <div>
                          <h3 className="mb-1">{immobilisationData.designation}</h3>
                          <div className="d-flex align-items-center gap-2">
                            <Badge color="primary" className="rounded-pill px-3 py-2">
                              <i className="ri-hashtag me-1"></i>
                              {immobilisationData.code}
                            </Badge>
                            <Badge
                              color={getStatusColor(immobilisationData.statut)} 
                              className="rounded-pill px-3 py-2"
                            >
                              <i className="ri-checkbox-circle-line me-1"></i>
                              {immobilisationData.statut_label}
                            </Badge>
                            <Badge color="info" className="rounded-pill px-3 py-2">
                              {immobilisationData.type_label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          className="btn btn-light rounded-pill"
                          onClick={switchToList}
                        >
                          <i className="ri-arrow-left-line me-1"></i>
                          Retour
                        </Button>
                        {/* <Button
                          className="btn btn-primary rounded-pill"
                          onClick={() => switchToEdit && switchToEdit(immobilisationData)}
                          disabled={immobilisationData.statut === "cede"}
                        >
                          <i className="ri-edit-line me-1"></i>
                          Modifier
                        </Button> */}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Row>
                {/* Colonne gauche : Informations principales */}
                <Col lg={8}>
                  {/* Carte 1 : Valeurs et amortissement */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        <i className="ri-money-dollar-circle-line me-2 text-success"></i>
                        VALEURS ET AMORTISSEMENT
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={4}>
                          <div className="text-center p-3 border rounded-4 bg-light">
                            <p className="text-muted mb-1">Valeur d'origine</p>
                            <h3 className="text-success fw-bold">
                              {formatMontant(immobilisationData.valeur_origine)} 
                            </h3>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="text-center p-3 border rounded-4 bg-light">
                            <p className="text-muted mb-1">Cumul d'amortissement</p>
                            <h3 className="text-danger fw-bold">
                              {formatMontant(immobilisationData.cumul_amortissement)} 
                            </h3>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="text-center p-3 border rounded-4 bg-light">
                            <p className="text-muted mb-1">Valeur comptable actuelle</p>
                            <h3 className="text-primary fw-bold">
                              {formatMontant(immobilisationData.valeur_comptable)} 
                            </h3>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Progression de l'amortissement</span>
                          <span className="fw-bold">{calculateAmortissementPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={calculateAmortissementPercentage} 
                          color={calculateAmortissementPercentage >= 100 ? "success" : "primary"}
                          className="mb-4"
                        />

                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <p className="text-muted mb-1">Taux d'amortissement</p>
                              <p className="fw-bold fs-4">{immobilisationData.taux_amortissement}%</p>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <p className="text-muted mb-1">Durée d'amortissement</p>
                              <p className="fw-bold fs-4">{immobilisationData.duree_amortissement} ans</p>
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <p className="text-muted mb-1">Amortissement annuel</p>
                              <p className="fw-bold fs-4">
                                {formatMontant(immobilisationData.amortissement_annuel || 
                                  (immobilisationData.valeur_origine * (immobilisationData.taux_amortissement / 100)))} 
                              </p>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <p className="text-muted mb-1">Amortissement mensuel</p>
                              <p className="fw-bold fs-4">{formatMontant(calculateAmortissementMensuel)} </p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Carte 2 : Comptabilité */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        <i className="ri-file-list-2-line me-2 text-info"></i>
                        COMPTABILITÉ
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <Table bordered>
                        <tbody>
                          <tr>
                            <td width="30%" className="fw-bold">Compte d'actif</td>
                            <td>
                              <Badge color="primary" className="me-2">
                                {immobilisationData.compte_actif}
                              </Badge>
                              {immobilisationData.compte_actif_label}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Compte d'amortissement</td>
                            <td>
                              <Badge color="warning" className="me-2">
                                {immobilisationData.compte_amortissement}
                              </Badge>
                              {immobilisationData.compte_amortissement_label}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Compte de charge</td>
                            <td>
                              <Badge color="danger" className="me-2">
                                {immobilisationData.compte_charge}
                              </Badge>
                              {immobilisationData.compte_charge_label}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Méthode d'amortissement</td>
                            <td>
                              <Badge color="info" className="me-2">
                                {immobilisationData.methode_label}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Carte 3 : Historique d'amortissement */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        <i className="ri-history-line me-2 text-warning"></i>
                        HISTORIQUE D'AMORTISSEMENT
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <div className="table-responsive rounded-4">
                        <Table bordered hover className="rounded-4">
                          <thead className="">
                            <tr>
                              <th>Année</th>
                              <th>Date fin</th>
                              <th className="text-end">Amortissement annuel</th>
                              <th className="text-end">Cumul amortissement</th>
                              <th className="text-end">Valeur comptable</th>
                              <th>Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculateHistoriqueAmortissement.map((item) => (
                              <tr key={item.annee} className={item.termine ? "table-success" : ""}>
                                <td className="fw-bold">Année {item.annee}</td>
                                <td>{formatDate(item.date_fin)}</td>
                                <td className="text-end">{formatMontant(item.amortissement_annuel)} </td>
                                <td className="text-end">{formatMontant(item.cumul_amortissement)} </td>
                                <td className="text-end">{formatMontant(item.valeur_comptable)} </td>
                                <td>
                                  {item.termine ? (
                                    <Badge color="success" className="rounded-pill">
                                      <i className="ri-check-line me-1"></i>Terminé
                                    </Badge>
                                  ) : (
                                    <Badge color="info" className="rounded-pill">
                                      À venir
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                {/* Colonne droite : Informations complémentaires */}
                <Col lg={4}>
                  {/* Carte 4 : Dates importantes */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        <i className="ri-calendar-2-line me-2 text-primary"></i>
                        DATES IMPORTANTES
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <Table borderless>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Date d'acquisition</td>
                            <td className="text-end">{formatDate(immobilisationData.date_acquisition)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Date de mise en service</td>
                            <td className="text-end">{formatDate(immobilisationData.date_mise_service)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Temps écoulé</td>
                            <td className="text-end">
                              {calculateTempsEcoule.annees} ans {calculateTempsEcoule.mois} mois
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Temps restant</td>
                            <td className="text-end">
                              {calculateTempsRestant.annees > 0 || calculateTempsRestant.mois > 0 ? (
                                <>
                                  {calculateTempsRestant.annees} ans {calculateTempsRestant.mois} mois
                                </>
                              ) : (
                                <Badge color="success" className="rounded-pill">
                                  Amortissement terminé
                                </Badge>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Date création</td>
                            <td className="text-end">{formatDate(immobilisationData.date_creation)}</td>
                          </tr>
                          {immobilisationData.date_modification && (
                            <tr>
                              <td className="fw-bold">Dernière modification</td>
                              <td className="text-end">{formatDate(immobilisationData.date_modification)}</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Carte 5 : Localisation et responsable */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        <i className="ri-map-pin-line me-2 text-danger"></i>
                        LOCALISATION ET RESPONSABLE
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <div className="mb-3">
                        <p className="text-muted mb-1">Localisation</p>
                        <p className="fw-bold fs-5">
                          <i className="ri-building-2-line me-2"></i>
                          {immobilisationData.localisation || "Non spécifié"}
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted mb-1">Responsable</p>
                        <p className="fw-bold fs-5">
                          <i className="ri-user-3-line me-2"></i>
                          {immobilisationData.responsable || "Non spécifié"}
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted mb-1">Fournisseur</p>
                        <p className="fw-bold">
                          <i className="ri-store-2-line me-2"></i>
                          {immobilisationData.fournisseur || "Non spécifié"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted mb-1">Numéro de série</p>
                        <Badge color="secondary" className="fs-6">
                          <i className="ri-barcode-line me-1"></i>
                          {immobilisationData.numero_serie || "Non spécifié"}
                        </Badge>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Carte 6 : Informations système */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        <i className="ri-information-line me-2 text-secondary"></i>
                        INFORMATIONS SYSTÈME
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Créé par</td>
                            <td className="text-end">{immobilisationData.createur || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Statut</td>
                            <td className="text-end">
                              <Badge color={getStatusColor(immobilisationData.statut)} className="rounded-pill">
                                {immobilisationData.statut_label}
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Type</td>
                            <td className="text-end">
                              <Badge color="info" className="rounded-pill">
                                {immobilisationData.type_label}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Carte 7 : Observations */}
                  {immobilisationData.observations && (
                    <Card className="mb-4 border-0 shadow-sm rounded-4">
                      <CardHeader className="rounded-top-4">
                        <h5 className="mb-0">
                          <i className="ri-chat-1-line me-2 text-warning"></i>
                          OBSERVATIONS
                        </h5>
                      </CardHeader>
                      <CardBody>
                        <div className="p-3 bg-light rounded-4">
                          <p className="mb-0">{immobilisationData.observations}</p>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Boutons d'action secondaires */}
                  {/* <Card className="mb-4 border-0 shadow-sm">
                    <CardBody className="p-3">
                      <div className="d-grid gap-2">
                        <Button color="success" className="rounded-pill">
                          <i className="ri-download-line me-1"></i>
                          Télécharger la fiche
                        </Button>
                        <Button color="info" className="rounded-pill" onClick={() => window.print()}>
                          <i className="ri-printer-line me-1"></i>
                          Imprimer
                        </Button>
                        {immobilisationData.statut !== "cede" && (
                          <Button color="warning" className="rounded-pill">
                            <i className="ri-exchange-dollar-line me-1"></i>
                            Proposer la cession
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card> */}
                </Col>
              </Row>

              {/* Section de statistiques */}
              <Card className="mb-4 border-0 shadow-sm rounded-4">
                <CardHeader className="rounded-top-4">
                  <h5 className="mb-0">
                    <i className="ri-bar-chart-2-line me-2 text-info"></i>
                    STATISTIQUES
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <div className="text-center">
                        <div className="p-3 border rounded bg-primary bg-opacity-10 rounded-4">
                          <i className="ri-money-dollar-circle-line fs-1 text-primary mb-2"></i>
                          <h4 className="fw-bold">{formatMontant(immobilisationData.valeur_comptable)} </h4>
                          <p className="text-muted mb-0">Valeur actuelle</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div className="p-3 border rounded bg-success bg-opacity-10 rounded-4">
                          <i className="ri-pie-chart-line fs-1 text-success mb-2"></i>
                          <h4 className="fw-bold">{calculateAmortissementPercentage.toFixed(1)}%</h4>
                          <p className="text-muted mb-0">Amorti</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div className="p-3 border rounded bg-warning bg-opacity-10 rounded-4">
                          <i className="ri-time-line fs-1 text-warning mb-2"></i>
                          <h4 className="fw-bold">{calculateTempsRestant.annees} ans</h4>
                          <p className="text-muted mb-0">Temps restant</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center" >
                        <div className="p-3 border rounded bg-info bg-opacity-10 rounded-4">
                          <i className="ri-calendar-check-line fs-1 text-info mb-2"></i>
                          <h4 className="fw-bold">{formatDate(immobilisationData.date_acquisition)}</h4>
                          <p className="text-muted mb-0">Depuis l'acquisition</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ImmobilisationDetail;