import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";

const DetailsCollaborateur = () => {
  const { t } = useTranslation();
  const { id, entreprise } = useParams();
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState("informations-personnelles");
  const tabsScrollRef = useRef(null);

  const collaborateursData = useMemo(
    () => [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        affiliation: "Mari",
        email: "jean.dupont@inawo.com",
        telephone: "+229 97 00 00 01",
        ville: "Cotonou",
        poste: "Directeur Général",
        departement: "Direction",
        typecontrat: "CDI",
        statut: "actif",
      },
      {
        id: 2,
        nom: "Martin",
        prenom: "Marie",
        affiliation: "Femme",
        email: "marie.martin@inawo.com",
        telephone: "+229 97 00 00 02",
        ville: "Porto-Novo",
        poste: "Responsable RH",
        departement: "Ressources humaines",
        statut: "inactif",
        typecontrat: "CDD",
      },
      {
        id: 3,
        nom: "Durant",
        prenom: "Pierre",
        affiliation: "Enfant",
        email: "pierre.durant@inawo.com",
        telephone: "+229 97 00 00 03",
        ville: "Parakou",
        poste: "Comptable",
        departement: "Finance",
        statut: "actif",
        typecontrat: "Stage professionnelle",
      },
    ],
    [],
  );

  const selectedCollaborateur = useMemo(() => {
    const fromState = state?.collaborateur;
    if (fromState) {
      return fromState;
    }
    return (
      collaborateursData.find((item) => String(item.id) === String(id)) || null
    );
  }, [state, collaborateursData, id]);

  const contactUrgenceRows = useMemo(() => {
    const contactsFromState = state?.collaborateur?.contactsUrgence;
    if (Array.isArray(contactsFromState) && contactsFromState.length > 0) {
      return contactsFromState;
    }

    if (!selectedCollaborateur) {
      return [];
    }

    return [
      {
        id: 1,
        nom: selectedCollaborateur.nom || "",
        prenom: selectedCollaborateur.prenom || "",
        contact: selectedCollaborateur.telephone || "",
        lien: selectedCollaborateur.affiliation || "",
        ville: selectedCollaborateur.ville || "",
      },
    ];
  }, [state, selectedCollaborateur]);

  const getEditSectionByTab = () => {
    switch (activeTab) {
      case "informations-personnelles":
        return "informations-personnelles";
      case "informations-contractuelles":
      case "affectation":
        return "informations-contractuelles";
      case "experience-affectation":
        return "historique-professionnelle";
      default:
        return "informations-personnelles";
    }
  };

  const editCollaborateurPath = `/${entreprise}/collaborateur-edit/${selectedCollaborateur?.id || id}?section=${getEditSectionByTab()}`;

  const tabs = [
    {
      id: "informations-personnelles",
      label: t("Informations personnelles"),
      icon: "ri-user-3-line",
    },
    {
      id: "informations-contractuelles",
      label: t("Informations contractuelles"),
      icon: "ri-file-list-3-line",
    },
    {
      id: "experience-affectation",
      label: t("Expérience"),
      icon: "ri-briefcase-4-line",
    },
    { id: "affectation", label: t("Affectation"), icon: "ri-briefcase-4-line" },
    {
      id: "historique-salaire",
      label: t("Historique salaire"),
      icon: "ri-money-dollar-circle-line",
    },
    { id: "fiche-de-paie", label: t("Fiche de paie"), icon: "ri-file-text-line" },
    {
      id: "historique-depense",
      label: t("Historique dépense"),
      icon: "ri-wallet-3-line",
    },
    { id: "presence", label: t("Présence"), icon: "ri-user-follow-line" },
    {
      id: "informations-pointages",
      label: t("Informations de pointages"),
      icon: "ri-time-line",
    },
  ];

  const activeTabIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [tabs, activeTab],
  );

  const handlePrevTab = () => {
    if (activeTabIndex > 0) {
      setActiveTab(tabs[activeTabIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (activeTabIndex < tabs.length - 1) {
      setActiveTab(tabs[activeTabIndex + 1].id);
    }
  };

  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) {
      return;
    }

    const activeItem = container.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  const tabContents = {
    "informations-contractuelles":
      "Section dédiée aux informations contractuelles du collaborateur.",
    "experience-affectation":
      "Section dédiée à l'expérience et aux affectations du collaborateur.",
    affectation: "Section dédiée aux affectations du collaborateur.",
    "historique-salaire":
      "Section dédiée à l'historique des salaires du collaborateur.",
    "fiche-de-paie": "Section dédiée aux fiches de paie du collaborateur.",
    "historique-depense":
      "Section dédiée à l'historique des dépenses du collaborateur.",
    presence: "Section dédiée à l'historique de présence du collaborateur.",
    "informations-pointages":
      "Section dédiée aux informations de pointages du collaborateur.",
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={`\u00a0${t("Détails Collaborateurs")}`}
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
            </>
          }
        />

        <Row>
          <Col lg={12}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              <CardBody
                className="p-0"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <Nav
                  className="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
                  role="tablist"
                >
                  <div className="tabs-nav">
                    <div className="tabs-nav-controls">
                      <button
                        type="button"
                        className="tabs-nav-btn"
                        onClick={handlePrevTab}
                        disabled={activeTabIndex <= 0}
                        aria-label="Onglet precedent"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      <button
                        type="button"
                        className="tabs-nav-btn"
                        onClick={handleNextTab}
                        disabled={activeTabIndex >= tabs.length - 1}
                        aria-label="Onglet suivant"
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                    <div ref={tabsScrollRef} className="tabs-scroll">
                      <div className="d-flex" style={{ flexWrap: "nowrap" }}>
                        {tabs.map((tab) => (
                          <NavItem key={tab.id} style={{ flex: "0 0 auto" }}>
                            <NavLink
                              key={tab.id}
                              className={activeTab === tab.id ? "active" : ""}
                              style={{
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => setActiveTab(tab.id)}
                              data-tab-id={tab.id}
                            >
                              <i className={tab.icon}></i>
                              <span>{tab.label}</span>
                            </NavLink>
                          </NavItem>
                        ))}
                      </div>
                    </div>
                  </div>
                </Nav>

                <TabContent activeTab={activeTab} className="p-3">
                  {tabs.map((tab) => (
                    <TabPane tabId={tab.id} key={tab.id}>
                      {tab.id === "informations-personnelles" ? (
                        <div className="p-3 border rounded-3 bg-light">
                          <h5 className="mb-3">{tab.label}</h5>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabNom"
                                  className="form-label fw-semibold"
                                >
                                  {t("Nom")}
                                </Label>
                                <Input
                                  id="collabNom"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.nom || ""}
                                  placeholder={t("Nom")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabPrenom"
                                  className="form-label fw-semibold"
                                >
                                  {t("Prénom")}
                                </Label>
                                <Input
                                  id="collabPrenom"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.prenom || ""}
                                  placeholder={t("Prénom")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabDateNaissance"
                                  className="form-label fw-semibold"
                                >
                                  {t("Date de naissance")}
                                </Label>
                                <Input
                                  id="collabDateNaissance"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.dateNaissance ||
                                    selectedCollaborateur?.date_naissance ||
                                    ""
                                  }
                                  placeholder={t("Date de naissance")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabLieuNaissance"
                                  className="form-label fw-semibold"
                                >
                                  {t("Lieu de naissance")}
                                </Label>
                                <Input
                                  id="collabLieuNaissance"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.lieuNaissance ||
                                    selectedCollaborateur?.lieu_naissance ||
                                    ""
                                  }
                                  placeholder={t("Lieu de naissance")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabEnfants"
                                  className="form-label fw-semibold"
                                >
                                  {t("Nombre d'enfants à charge")}
                                </Label>
                                <Input
                                  id="collabEnfants"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.enfants ||
                                    selectedCollaborateur?.nombreEnfants ||
                                    ""
                                  }
                                  placeholder={t("Nombre d'enfants à charge")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabStatutMatrimonial"
                                  className="form-label fw-semibold"
                                >
                                  {t("Statut matrimonial")}
                                </Label>
                                <Input
                                  id="collabStatutMatrimonial"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.statutMatrimonial ||
                                    selectedCollaborateur?.statut_matrimonial ||
                                    ""
                                  }
                                  placeholder={t("Statut matrimonial")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabAdresse"
                                  className="form-label fw-semibold"
                                >
                                  {t("Adresse")}
                                </Label>
                                <Input
                                  id="collabAdresse"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.adresse || ""}
                                  placeholder={t("Adresse")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="collabPays"
                                  className="form-label fw-semibold"
                                >
                                  {t("Pays")}
                                </Label>
                                <Input
                                  id="collabPays"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.pays || ""}
                                  placeholder={t("Pays")}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-0">
                                <Label
                                  htmlFor="collabTelephone"
                                  className="form-label fw-semibold"
                                >
                                  {t("Contact")}
                                </Label>
                                <Input
                                  id="collabTelephone"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.telephone ||
                                    selectedCollaborateur?.contact ||
                                    ""
                                  }
                                  placeholder={t("Contact")}
                                  disabled
                                />
                              </div>
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col lg={12}>
                              <h6 className="text-uppercase text-muted mb-3">
                                {t("Contact d'urgence")}
                              </h6>
                              {contactUrgenceRows.length > 0 ? (
                                <Table responsive className="align-middle mb-0">
                                  <thead>
                                    <tr>
                                      <th>{t("Nom")}</th>
                                      <th>{t("Prenom")}</th>
                                      <th>{t("Contact")}</th>
                                      <th>{t("Affiliation")}</th>
                                      <th>{t("Ville")}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {contactUrgenceRows.map((item, index) => (
                                      <tr key={item.id || index}>
                                        <td>{item.nom || ""}</td>
                                        <td>{item.prenom || ""}</td>
                                        <td>{item.contact || ""}</td>
                                        <td>
                                          {item.lien || item.affiliation || ""}
                                        </td>
                                        <td>{item.ville || ""}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <p className="text-muted mb-0">
                                  {t("Aucun contact d'urgence.")}
                                </p>
                              )}
                            </Col>
                          </Row>
                        </div>
                      ) : tab.id === "affectation" ? (
                        <div className="p-3 border rounded-3 bg-light">
                          <h5 className="mb-3">{tab.label}</h5>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="contractNom"
                                  className="form-label fw-semibold"
                                >
                                  Nom
                                </Label>
                                <Input
                                  id="contractNom"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.nom || ""}
                                  placeholder="Nom"
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="contractPrenom"
                                  className="form-label fw-semibold"
                                >
                                  Prénom
                                </Label>
                                <Input
                                  id="contractPrenom"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.prenom || ""}
                                  placeholder="Prénom"
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="contractPoste"
                                  className="form-label fw-semibold"
                                >
                                  Poste
                                </Label>
                                <Input
                                  id="contractPoste"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.poste || ""}
                                  placeholder="Poste"
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-0">
                                <Label
                                  htmlFor="contractDepartement"
                                  className="form-label fw-semibold"
                                >
                                  Département
                                </Label>
                                <Input
                                  id="contractDepartement"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.departement || ""
                                  }
                                  placeholder="Département"
                                  disabled
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ) : tab.id === "informations-contractuelles" ? (
                        <div className="p-3 border rounded-3 bg-light">
                          <h5 className="mb-2">{tab.label}</h5>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="contractNom"
                                  className="form-label fw-semibold"
                                >
                                  Nom
                                </Label>
                                <Input
                                  id="contractNom"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.nom || ""}
                                  placeholder="Nom"
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="contractPrenom"
                                  className="form-label fw-semibold"
                                >
                                  Prénom
                                </Label>
                                <Input
                                  id="contractPrenom"
                                  type="text"
                                  className="rounded-pill"
                                  value={selectedCollaborateur?.prenom || ""}
                                  placeholder="Prénom"
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="contractPoste"
                                  className="form-label fw-semibold"
                                >
                                  Type de contrat
                                </Label>
                                <Input
                                  id="contractPoste"
                                  type="text"
                                  className="rounded-pill"
                                  value={
                                    selectedCollaborateur?.typecontrat || ""
                                  }
                                  placeholder="Type de contrat"
                                  disabled
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <div className="p-3 border rounded-3 bg-light">
                          <h5 className="mb-2">{tab.label}</h5>
                          <p className="text-muted mb-0">
                            {tabContents[tab.id]}
                          </p>
                        </div>
                      )}
                    </TabPane>
                  ))}
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={12} className="text-end">
            <Link
              to={editCollaborateurPath}
              state={{ collaborateur: selectedCollaborateur }}
              className="btn btn-primary me-2"
              style={{ borderRadius: "20px" }}
            >
              <i className="ri-pencil-line me-1"></i>
              {t("Modifier")}
            </Link>
            <Link
              to={`/${entreprise}/collaborateurs`}
              className="btn btn-success"
              style={{ borderRadius: "20px" }}
            >
              <i className="ri-arrow-left-line me-1"></i>
              {t("Retour")}
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DetailsCollaborateur;
