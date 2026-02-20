import React, { useState } from "react";
import { Row, Col, Card, CardBody, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { toast } from "react-toastify";

const AvanceEtPret = () => {
    document.title = "Avance et Prêt";

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // États pour les modals
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // AJOUTEZ CES DEUX LIGNES :
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [avancePretList, setAvancePretList] = useState([
        {
            id: 1,
            numero: "AV-2024-001",
            employe: "Jean Dupont",
            employeAvatar: "avatar-1.jpg",
            periodeDebut: "2024-01-01",
            periodeFin: "2024-01-31",
            salaireNet: 250000,
            montantPret: 50000,
            dateRemboursement: "2024-02-15",
            montantRembourse: 20000,
            solde: 30000,
            statut: "actif"
        },
        {
            id: 2,
            numero: "PR-2024-002",
            employe: "Marie Martin",
            employeAvatar: "avatar-2.jpg",
            periodeDebut: "2024-01-01",
            periodeFin: "2024-03-31",
            salaireNet: 320000,
            montantPret: 150000,
            dateRemboursement: "2024-04-30",
            montantRembourse: 50000,
            solde: 100000,
            statut: "actif"
        },
        {
            id: 3,
            numero: "AV-2024-003",
            employe: "Pierre Durand",
            employeAvatar: "avatar-3.jpg",
            periodeDebut: "2024-02-01",
            periodeFin: "2024-02-29",
            salaireNet: 280000,
            montantPret: 75000,
            dateRemboursement: "2024-03-15",
            montantRembourse: 75000,
            solde: 0,
            statut: "payé"
        },
        {
            id: 4,
            numero: "PR-2024-004",
            employe: "Sophie Bernard",
            employeAvatar: "avatar-4.jpg",
            periodeDebut: "2024-01-15",
            periodeFin: "2024-04-15",
            salaireNet: 350000,
            montantPret: 200000,
            dateRemboursement: "2024-05-15",
            montantRembourse: 50000,
            solde: 150000,
            statut: "actif"
        },
        {
            id: 5,
            numero: "AV-2024-005",
            employe: "Lucas Petit",
            employeAvatar: "avatar-5.jpg",
            periodeDebut: "2024-02-15",
            periodeFin: "2024-02-29",
            salaireNet: 220000,
            montantPret: 30000,
            dateRemboursement: "2024-03-01",
            montantRembourse: 30000,
            solde: 0,
            statut: "payé"
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

    // Fonction pour formater le montant
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    };

    // Fonction pour formater la date
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    // Fonction pour formater la période
    const formatPeriode = (debut, fin) => {
        return `${formatDate(debut)} - ${formatDate(fin)}`;
    };

    // Fonction pour obtenir le badge selon le statut
    const getStatutBadge = (statut) => {
        switch(statut) {
            case 'actif':
                return <Badge color="success" pill className="px-3 py-2">Actif</Badge>;
            case 'payé':
                return <Badge color="primary" pill className="px-3 py-2">Payé</Badge>;
            case 'dépassé':
                return <Badge color="danger" pill className="px-3 py-2">Dépassé</Badge>;
            default:
                return <Badge color="secondary" pill className="px-3 py-2">{statut}</Badge>;
        }
    };

    // Fonction de modification
    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedItem = {
            ...selectedItem,
            employe: formData.get('employe'),
            type: formData.get('type'),
            periodeDebut: formData.get('periodeDebut'),
            periodeFin: formData.get('periodeFin'),
            salaireNet: parseInt(formData.get('salaireNet')),
            montantPret: parseInt(formData.get('montantPret')),
            dateRemboursement: formData.get('dateRemboursement'),
            montantRembourse: parseInt(formData.get('montantRembourse')),
            solde: parseInt(formData.get('solde')),
            statut: formData.get('statut')
        };

        setAvancePretList(avancePretList.map(item => 
            item.id === selectedItem.id ? updatedItem : item
        ));
        toast.success("Modification effectuée avec succès");
        toggleEditModal();
    };

    // Filtrage des données par recherche
    const filteredData = avancePretList.filter((item) =>
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
            setAvancePretList(avancePretList.filter(i => i.id !== itemToDelete.id));
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
            <BreadCrumb
                title="&nbsp;Avance et Pret"
                pageTitle={
                    <>
                        <i className="ri-team-line"></i>
                        &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                    </>
                }
            />
            <div className="container-fluid">
                <Row className="mb-4">
                    <Col lg={12}>
                        <SearchAndActionBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Chercher avance/prêt..."
                            showSearch={true}
                            addButtonLink="/entreprise/avance-et-pret-add"
                            addButtonText="Créer avance/prêt"
                            addButtonIcon="ri-add-line"
                            showAddButton={true}
                            onExportClick={() => setIsExportCSV(true)}
                            exportButtonText="Exporter"
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
                                                <th>N°</th>
                                                <th>Nom de l'employé</th>
                                                <th>Période</th>
                                                <th>Montant salaire net</th>
                                                <th>Montant prêt</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.length > 0 ? (
                                                filteredData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <span className="fw-medium">{item.numero}</span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <i className="ri-user-fill text-primary"></i>
                                                                </div>
                                                                <div className="flex-grow-1 ms-2">
                                                                    <span className="fw-medium">{item.employe}</span>
                                                                    
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {formatPeriode(item.periodeDebut, item.periodeFin)}
                                                        </td>
                                                        <td>
                                                            <span className="fw-medium text-success">
                                                                {formatMontant(item.salaireNet)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-medium text-danger">
                                                                {formatMontant(item.montantPret)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {getStatutBadge(item.statut)}
                                                        </td>
                                                        <td>
                                                            <div className="gap-1">
                                                                <Link
                                                                    to="#"
                                                                    className="text-primary p-2"
                                                                    title="Voir détails"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleViewModal(item);
                                                                    }}
                                                                >
                                                                    <i className="ri-eye-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="/:entreprise/avance-et-pret-edit/:id"
                                                                    className="text-warning p-2"
                                                                    title="Modifier"
                                                                >
                                                                    <i className="ri-pencil-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="#"
                                                                    className="text-danger p-2"
                                                                    title="Supprimer"
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
                                                    <td colSpan="7" className="text-center py-5">
                                                        <div className="text-muted">
                                                            <i className="ri-inbox-line" style={{ fontSize: "3rem" }}></i>
                                                            <h5 className="mt-3">Aucune avance ou prêt trouvé</h5>
                                                            <p className="mb-0">Commencez par créer une nouvelle avance ou prêt</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
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
            </div>

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
                    <i className="ri-eye-line"></i>
                </span>
            </div>
            <div>
                <h5 className="modal-title mb-0">Détails de l'avance/prêt</h5>
                <p className="text-muted mb-0">N° {selectedItem?.numero}</p>
            </div>
        </div>
    </ModalHeader>
    
    <ModalBody className="p-4">
        {selectedItem && (
            <Row className="g-4">
                {/* Nom employé */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Nom de l'employé</Label>
                        <p className="fw-semibold fs-5 mb-0">{selectedItem.employe}</p>
                    </div>
                </Col>

                {/* Salaire net */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Salaire net</Label>
                        <p className="fw-semibold fs-5 text-success mb-0">{formatMontant(selectedItem.salaireNet)}</p>
                    </div>
                </Col>

                {/* Période */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Période</Label>
                        <p className="fw-semibold mb-0">
                            <i className="ri-calendar-line me-2 text-primary"></i>
                            {formatPeriode(selectedItem.periodeDebut, selectedItem.periodeFin)}
                        </p>
                    </div>
                </Col>

                {/* Montant du prêt */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Montant du prêt</Label>
                        <p className="fw-semibold fs-5 text-danger mb-0">{formatMontant(selectedItem.montantPret)}</p>
                    </div>
                </Col>

                {/* Date de remboursement */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Date de remboursement</Label>
                        <p className="fw-semibold mb-0">
                            <i className="ri-calendar-event-line me-2 text-warning"></i>
                            {formatDate(selectedItem.dateRemboursement)}
                        </p>
                    </div>
                </Col>

                {/* Montant remboursé */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Montant remboursé</Label>
                        <p className="fw-semibold text-info mb-0">{formatMontant(selectedItem.montantRembourse || 0)}</p>
                    </div>
                </Col>

                {/* Solde */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Solde restant</Label>
                        <p className="fw-semibold text-warning mb-0">{formatMontant(selectedItem.solde || 0)}</p>
                    </div>
                </Col>

                {/* Statut */}
                <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                        <Label className="form-label text-muted small mb-1">Statut</Label>
                        <div>{getStatutBadge(selectedItem.statut)}</div>
                    </div>
                </Col>
            </Row>
        )}
    </ModalBody>
    
    <ModalFooter className="border-0 pt-0 pb-4 px-4">
        <Button 
            color="secondary" 
            onClick={() => toggleViewModal()}
            className="rounded-3 px-4"
        >
            <i className="ri-close-line me-1"></i>
            Fermer
        </Button>
    </ModalFooter>
</Modal>
        </div>
    );
};

export default AvanceEtPret;