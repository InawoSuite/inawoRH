import React, { useMemo, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Label,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const DetailsCollaborateur = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState("informations-personnelles");

    const collaborateursData = useMemo(() => ([
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
            statut: "actif"
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
            typecontrat: "CDD"
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
            typecontrat: "Stage professionnelle"
        },
    ]), []);

    const selectedCollaborateur = useMemo(() => {
        const fromState = state?.collaborateur;
        if (fromState) {
            return fromState;
        }
        return collaborateursData.find((item) => String(item.id) === String(id)) || null;
    }, [state, collaborateursData, id]);

    const tabs = [
        { id: "informations-personnelles", label: "Informations personnelles", icon: "ri-user-3-line" },
        { id: "informations-contractuelles", label: "Informations contractuelles", icon: "ri-file-list-3-line" },
        { id: "experience-affectation", label: "Expérience ", icon: "ri-briefcase-4-line" },
        { id: "affectation", label: "Affectation ", icon: "ri-briefcase-4-line" },
        { id: "historique-salaire", label: "Historique salaire", icon: "ri-money-dollar-circle-line" },
        { id: "fiche-de-paie", label: "Fiche de paie", icon: "ri-file-text-line" },
        { id: "historique-depense", label: "Historique dépense", icon: "ri-wallet-3-line" },
        { id: "presence", label: "Présence", icon: "ri-user-follow-line" },
        { id: "informations-pointages", label: "Informations de pointages", icon: "ri-time-line" },
    ];

    const tabContents = {
        "informations-contractuelles": "Section dédiée aux informations contractuelles du collaborateur.",
        "experience-affectation": "Section dédiée à l'expérience et aux affectations du collaborateur.",
        "affectation": "Section dédiée aux affectations du collaborateur.",
        "historique-salaire": "Section dédiée à l'historique des salaires du collaborateur.",
        "fiche-de-paie": "Section dédiée aux fiches de paie du collaborateur.",
        "historique-depense": "Section dédiée à l'historique des dépenses du collaborateur.",
        presence: "Section dédiée à l'historique de présence du collaborateur.",
        "informations-pointages": "Section dédiée aux informations de pointages du collaborateur.",
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
          title="&nbsp;Collaborateurs"
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
            </>
          }
        />

        <Row>
            <Col lg={12}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
                    <CardBody className="p-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                        <Nav
                            className="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
                            role="tablist"
                            style={{ flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden" }}
                        >
                            {tabs.map((tab) => (
                                <NavItem key={tab.id} style={{ flex: "0 0 auto" }}>
                                <NavLink
                                    key={tab.id}
                                    className={activeTab === tab.id ? "active" : ""}
                                    style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <i className={tab.icon}></i>
                                    <span>{tab.label}</span>
                                </NavLink>
                                </NavItem>
                            ))}
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
                                                        <Label htmlFor="collabNom" className="form-label fw-semibold">Nom</Label>
                                                        <Input id="collabNom" type="text" className="rounded-pill" value={selectedCollaborateur?.nom || ""} placeholder="Nom" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="collabPrenom" className="form-label fw-semibold">Prénom</Label>
                                                        <Input id="collabPrenom" type="text" className="rounded-pill" value={selectedCollaborateur?.prenom || ""} placeholder="Prénom" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="collabAffiliation" className="form-label fw-semibold">Affiliation</Label>
                                                        <Input id="collabAffiliation" type="text" className="rounded-pill" value={selectedCollaborateur?.affiliation || ""} placeholder="Affiliation" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="collabTelephone" className="form-label fw-semibold">Téléphone</Label>
                                                        <Input id="collabTelephone" type="text" className="rounded-pill" value={selectedCollaborateur?.telephone || ""} placeholder="Téléphone" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-0">
                                                        <Label htmlFor="collabVille" className="form-label fw-semibold">Ville</Label>
                                                        <Input id="collabVille" type="text" className="rounded-pill" value={selectedCollaborateur?.ville || ""} placeholder="Ville" disabled />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : tab.id === "affectation" ? (
                                        <div className="p-3 border rounded-3 bg-light">
                                            <h5 className="mb-3">{tab.label}</h5>
                                            <Row>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contractNom" className="form-label fw-semibold">Nom</Label>
                                                        <Input id="contractNom" type="text" className="rounded-pill" value={selectedCollaborateur?.nom || ""} placeholder="Nom" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contractPrenom" className="form-label fw-semibold">Prénom</Label>
                                                        <Input id="contractPrenom" type="text" className="rounded-pill" value={selectedCollaborateur?.prenom || ""} placeholder="Prénom" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contractPoste" className="form-label fw-semibold">Poste</Label>
                                                        <Input id="contractPoste" type="text" className="rounded-pill" value={selectedCollaborateur?.poste || ""} placeholder="Poste" disabled />
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-0">
                                                        <Label htmlFor="contractDepartement" className="form-label fw-semibold">Département</Label>
                                                        <Input id="contractDepartement" type="text" className="rounded-pill" value={selectedCollaborateur?.departement || ""} placeholder="Département" disabled />
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
                                                        <Label htmlFor="contractNom" className="form-label fw-semibold">Nom</Label>
                                                        <Input id="contractNom" type="text" className="rounded-pill" value={selectedCollaborateur?.nom || ""} placeholder="Nom" disabled />
                                                    </div>
                                                </Col>
                                                  <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contractPrenom" className="form-label fw-semibold">Prénom</Label>
                                                        <Input id="contractPrenom" type="text" className="rounded-pill" value={selectedCollaborateur?.prenom || ""} placeholder="Prénom" disabled />
                                                    </div>
                    
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contractPoste" className="form-label fw-semibold">Type de contrat</Label>
                                                        <Input id="contractPoste" type="text" className="rounded-pill" value={selectedCollaborateur?.typecontrat || ""} placeholder="Type de contrat" disabled />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) :
                                    
                                    
                                    (
                                        <div className="p-3 border rounded-3 bg-light">
                                            <h5 className="mb-2">{tab.label}</h5>
                                            <p className="text-muted mb-0">{tabContents[tab.id]}</p>
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
            <Link to="/:entreprise/collaborateurs" className="btn btn-success" style={{ borderRadius: "20px" }}>
              <i className="ri-arrow-left-line me-1"></i>
              Retour
            </Link>
          </Col>
        </Row>
                
            </Container>
        </div>
    );
                
};

export default DetailsCollaborateur;
    