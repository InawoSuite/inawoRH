import React, { useState } from "react";
import { Row, Col, Card, CardBody, Container, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import Pagination from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";

const Poste = () => {
    const { t } = useTranslation(); 

    document.title = t("Gestion des Postes");  

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    
    // États pour les modals
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [posteList, setPosteList] = useState([
        {
            id: 1,
            code: "POSTE-001",
            nomTitre: "Directeur Commercial",
            departementService: "Direction Commerciale",
            missions: "Développer la stratégie commerciale, manager l'équipe, atteindre les objectifs de vente",
            responsabilites: "Gestion du chiffre d'affaires, fidélisation clients, reporting direction",
            superieurHierarchique: "Directeur Général",
            subordonnes: "Chefs des ventes, Chargés de clientèle",
            niveauOrganigramme: "Niveau 2",
            employe: "Jean Dupont",
            lieuAffectation: "Siège - Abidjan",
            type: "Cadre",
            statut: "Actif"
        },
        {
            id: 2,
            code: "POSTE-002",
            nomTitre: "Chef Comptable",
            departementService: "Finance et Comptabilité",
            missions: "Superviser la comptabilité, établir les états financiers, gérer les clôtures",
            responsabilites: "Fiabilité des comptes, respect des délais, supervision équipe",
            superieurHierarchique: "Directeur Financier",
            subordonnes: "Comptables, Assistants comptables",
            niveauOrganigramme: "Niveau 3",
            employe: "Marie Martin",
            lieuAffectation: "Siège - Abidjan",
            type: "Cadre",
            statut: "Actif"
        },
        {
            id: 3,
            code: "POSTE-003",
            nomTitre: "Technicien de Maintenance",
            departementService: "Maintenance",
            missions: "Assurer la maintenance préventive et corrective des équipements",
            responsabilites: "Disponibilité des machines, respect des normes",
            superieurHierarchique: "Chef de Service Maintenance",
            subordonnes: "Aucun",
            niveauOrganigramme: "Niveau 4",
            employe: "Pierre Durand",
            lieuAffectation: "Site Industriel - Yopougon",
            type: "Agent",
            statut: "Actif"
        },
        {
            id: 4,
            code: "POSTE-004",
            nomTitre: "Assistant RH",
            departementService: "Ressources Humaines",
            missions: "Gestion administrative du personnel, suivi des présences",
            responsabilites: "Tenue des dossiers, préparation des contrats",
            superieurHierarchique: "Responsable RH",
            subordonnes: "Aucun",
            niveauOrganigramme: "Niveau 4",
            employe: "Sophie Bernard",
            lieuAffectation: "Siège - Abidjan",
            type: "Agent",
            statut: "Actif"
        },
        {
            id: 5,
            code: "POSTE-005",
            nomTitre: "Conseiller Commercial",
            departementService: "Ventes",
            missions: "Prospection, vente, suivi client",
            responsabilites: "Atteinte des objectifs individuels",
            superieurHierarchique: "Chef des Ventes",
            subordonnes: "Aucun",
            niveauOrganigramme: "Niveau 5",
            employe: "Lucas Petit",
            lieuAffectation: "Agence - Marcory",
            type: "Agent",
            statut: "Actif"
        },
        {
            id: 6,
            code: "POSTE-006",
            nomTitre: "Consultant Senior",
            departementService: "Consulting",
            missions: "Conseil, accompagnement clients, développement d'offres",
            responsabilites: "Satisfaction client, qualité des livrables",
            superieurHierarchique: "Directeur de Mission",
            subordonnes: "Consultants juniors",
            niveauOrganigramme: "Niveau 3",
            employe: "Non affecté",
            lieuAffectation: "Projets",
            type: "Indépendant",
            statut: "Inactif"
        }
    ]);

    // Fonctions pour les modals
    const toggleViewModal = (item = null) => {
        setSelectedItem(item);
        setViewModal(!viewModal);
    };

    const toggleEditModal = (item = null) => {
        setSelectedItem(item);
        setEditModal(!editModal);
    };

    // Fonction pour formater le texte (troncature)
    const formatTexte = (texte, longueur = 50) => {
        if (!texte) return "-";
        return texte.length > longueur ? texte.substring(0, longueur) + "..." : texte;
    };

    // Fonction pour obtenir le badge selon le statut
    const getStatutBadge = (statut) => {
        switch(statut) {
            case 'Actif':
                return <Badge className="badge bg-success rounded-pill" pill>{t('Actif')}</Badge>;
            case 'Inactif':
                return <Badge className="badge bg-danger rounded-pill" pill>{t('Inactif')}</Badge>;
            default:
                return <Badge className="badge bg-secondary rounded-pill" pill>{t(statut) || statut}</Badge>;
        }
    };

    // Fonction pour obtenir le badge selon le type
    const getTypeBadge = (type) => {
        switch(type) {
            case 'Cadre':
                return <Badge className="badge bg-primary rounded-pill" pill>{t('Cadre')}</Badge>;
            case 'Agent':
                return <Badge className="badge bg-info rounded-pill" pill>{t('Agent')}</Badge>;
            case 'Ouvrier':
                return <Badge className="badge bg-warning text-dark rounded-pill" pill>{t('Ouvrier')}</Badge>;
            case 'Indépendant':
                return <Badge className="badge bg-secondary rounded-pill" pill>{t('Indépendant')}</Badge>;
            case 'Constituant':
                return <Badge className="badge bg-dark rounded-pill" pill>{t('Constituant')}</Badge>;
            default:
                return <Badge className="badge bg-light text-dark rounded-pill" pill>{t(type) || type}</Badge>;
        }
    };

    // Fonction de modification
    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedItem = {
            ...selectedItem,
            code: formData.get('code'),
            nomTitre: formData.get('nomTitre'),
            departementService: formData.get('departementService'),
            missions: formData.get('missions'),
            responsabilites: formData.get('responsabilites'),
            superieurHierarchique: formData.get('superieurHierarchique'),
            subordonnes: formData.get('subordonnes'),
            niveauOrganigramme: formData.get('niveauOrganigramme'),
            employe: formData.get('employe'),
            lieuAffectation: formData.get('lieuAffectation'),
            type: formData.get('type'),
            statut: formData.get('statut')
        };

        setPosteList(posteList.map(item => 
            item.id === selectedItem.id ? updatedItem : item
        ));
        toast.success("Modification effectuée avec succès");
        toggleEditModal();
    };

    // Filtrage des données par recherche
    const filteredData = posteList.filter((item) =>
        Object.values(item).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fonctions de suppression
    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            setPosteList(posteList.filter(i => i.id !== itemToDelete.id));
            toast.success("Suppression effectuée avec succès");
            setDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal(false);
        setItemToDelete(null);
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={t("Postes")}
                    pageTitle={
                        <>
                            <i className="ri-bar-chart-grouped-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />
                <Row>
                    <Col lg={12}>
                        <SearchAndActionBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            searchPlaceholder={t("Chercher un poste...")}
                            addButtonLink="/:entreprise/poste-add"
                            addButtonText={t("Ajouter un nouveau poste")}
                            addButtonIcon="ri-file-add-line"
                            showAddButton={true}
                            onExportClick={() => setIsExportCSV(true)}
                            exportButtonText={t("Exporter")}
                            exportButtonIcon="ri-file-upload-line"
                            showExportButton={true}
                        />
                    </Col>
                </Row>
                <Row>
                    
                    <Col lg={12}>
                        <Card style={{ borderRadius: "20px", boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)" }}>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table className="align-middle table-nowrap mb-0">
                                        <thead className="text-muted">
                                            <tr>
                                                <th>{t("Code")}</th>
                                                <th>{t("Nom/Titre")}</th>
                                                <th>{t("Département/Service")}</th>
                                                {/* <th>Missions</th> */}
                                                <th>{t("Responsabilités")}</th>
                                                <th>{t("Employé")}</th>
                                                {/* <th>Lieu</th> */}
                                                {/* <th>Type</th> */}
                                                <th>{t("Statut")}</th>
                                                <th>{t("Actions")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.length > 0 ? (
                                                filteredData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <span>{item.code}</span>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to="#" 
                                                                className="d-flex align-items-center"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleViewModal(item);
                                                                }}
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <i className="ri-briefcase-fill text-primary"></i>
                                                                </div>
                                                                <div className="flex-grow-1 ms-2">
                                                                    <span className="fw-medium">{t(item.nomTitre)}</span>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            {t(item.departementService)}
                                                        </td>
                                                        {/* <td>
                                                            <span title={item.missions}>
                                                                {formatTexte(item.missions, 40)}
                                                            </span>
                                                        </td> */}
                                                        <td>
                                                            <span title={item.responsabilites}>
                                                                {formatTexte(t(item.responsabilites), 40)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className="ri-user-fill text-info me-1"></i>
                                                                {t(item.employe)}
                                                            </div>
                                                        </td>
                                                        {/* <td>
                                                            <i className="ri-map-pin-line text-danger me-1"></i>
                                                            {item.lieuAffectation}
                                                        </td> */}
                                                        {/* <td>
                                                            {getTypeBadge(item.type)}
                                                        </td> */}
                                                        <td>
                                                            {getStatutBadge(item.statut)}
                                                        </td>
                                                        <td>
                                                            <div className="gap-1">
                                                                <Link
                                                                    to="#"
                                                                    className="text-info p-2"
                                                                    title={t("Voir détails")}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleViewModal(item);
                                                                    }}
                                                                >
                                                                    <i className="ri-eye-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="/:entreprise/poste-edit/:id"
                                                                    className="text-primary p-2"
                                                                    title={t("Modifier")}
                                                                    
                                                                >
                                                                    <i className="ri-pencil-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="#"
                                                                    className="text-danger p-2"
                                                                    title={t("Supprimer")}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteClick(item);
                                                                    }}
                                                                >
                                                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center py-5">
                                                        <div className="text-muted">
                                                            <i className="ri-inbox-line" style={{ fontSize: "3rem" }}></i>
                                                            <h5 className="mt-3">{t("Aucun poste trouvé")}</h5>
                                                            <p className="mb-0">{t("Commencez par créer un nouveau poste")}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="mt-3">
                                    <Pagination
                                        data={filteredData}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        perPageData={itemsPerPage}
                                        alwaysShow={true}
                                        showInfo={true}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteConfirm}
                    onCloseClick={handleDeleteClose}
                />
                
                {/* MODAL VOIR DÉTAILS */}
                <Modal 
                    isOpen={viewModal} 
                    toggle={() => toggleViewModal()} 
                    size="lg" 
                    centered
                    className="modal-dialog-centered"
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader 
                        toggle={() => toggleViewModal()}
                        className="border-0 pt-4 px-4"
                    >
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm me-3">
                                <span className="avatar-title bg-primary bg-opacity-10 text-primary rounded-3 fs-18">
                                    <i className="ri-briefcase-line"></i>
                                </span>
                            </div>
                            <div>
                                <h5 className="modal-title mb-0">{t('Détails du poste')}</h5>
                                <p className="text-muted mb-0">{t('Code')} : {selectedItem?.code}</p>
                            </div>
                        </div>
                    </ModalHeader>
                    
                    <ModalBody className="p-4">
                        {selectedItem && (
                            <Row className="g-4">
                                {/* Informations générales */}
                                <Col md={12}>
                                    <h6 className="text-primary mb-3">
                                        <i className="ri-information-line me-2"></i>
                                        {t('Informations générales')}
                                    </h6>
                                </Col>
                                
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Nom/Titre du poste")}</Label>
                                        <p className="fw-semibold fs-5 mb-0">{t(selectedItem.nomTitre)}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Département/Service")}</Label>
                                        <p className="fw-semibold mb-0">{t(selectedItem.departementService)}</p>
                                    </div>
                                </Col>

                                {/* Missions et responsabilités */}
                                <Col md={12}>
                                    <h6 className="text-primary mb-3 mt-2">
                                        <i className="ri-task-line me-2"></i>
                                        {t('Missions et responsabilités')}
                                    </h6>
                                </Col>

                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Missions")}</Label>
                                        <p className="mb-0">{t(selectedItem.missions)}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Responsabilités")}</Label>
                                        <p className="mb-0">{t(selectedItem.responsabilites)}</p>
                                    </div>
                                </Col>

                                {/* Position hiérarchique */}
                                {/* <Col md={12}>
                                    <h6 className="text-primary mb-3 mt-2">
                                        <i className="ri-organization-chart me-2"></i>
                                        {t('Position hiérarchique')}
                                    </h6>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Supérieur hiérarchique")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-arrow-up-line text-success me-1"></i>
                                            {selectedItem.superieurHierarchique}
                                        </p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Subordonnés")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-arrow-down-line text-warning me-1"></i>
                                            {selectedItem.subordonnes}
                                        </p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Niveau dans l'organigramme")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-stack-line text-info me-1"></i>
                                            {selectedItem.niveauOrganigramme}
                                        </p>
                                    </div>
                                </Col> */}

                                {/* Affectation et caractéristiques */}
                                <Col md={12}>
                                    <h6 className="text-primary mb-3 mt-2">
                                        <i className="ri-settings-line me-2"></i>
                                        {t('Affectation et caractéristiques')}
                                    </h6>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Employé affecté")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-user-fill text-info me-1"></i>
                                            {selectedItem.employe}
                                        </p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Lieu d'affectation")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-map-pin-line text-danger me-1"></i>
                                            {selectedItem.lieuAffectation}
                                        </p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Type")}</Label>
                                        <div>{getTypeBadge(t(selectedItem.type))}</div>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Statut")}</Label>
                                        <div>{getStatutBadge(t(selectedItem.statut))}</div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </ModalBody>
                    
                    <ModalFooter className="border-0 pt-0 pb-4 px-4">
                        <Link
                            to="/:entreprise/poste-edit/:id"
                            className="btn btn-primary rounded-4 px-4"
                            style={{ borderRadius: "20px" }}
                        >
                            {t("Modifier")}
                        </Link>
                        <Button 
                            color="secondary" 
                            onClick={() => toggleViewModal()}
                            className="rounded-4 px-4"
                        >
                            {t("Fermer")}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default Poste;