import React, { useState } from "react";
import { Row, Col, Card, CardBody, Container, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Link } from "react-router-dom";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import Pagination from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";

const CongeEtAbsence = () => {
    document.title = "Congés et Absences";

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    
    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [congeList, setCongeList] = useState([
        {
            id: 1,
            numero: "C-2024-001",
            employe: "Jean Dupont",
            date: "01/07/2024",
            joursPrevue: 15,
            congesApprouves: "Oui",
            difference: -3
        },
        {
            id: 2,
            numero: "C-2024-002",
            employe: "Marie Martin",
            date: "05/08/2024",
            joursPrevue: 16,
            congesApprouves: "Oui",
            difference: 0
        },
        {
            id: 3,
            numero: "A-2024-003",
            employe: "Pierre Durand",
            date: "10/06/2024",
            joursPrevue: 3,
            congesApprouves: "Non",
            difference: -3
        },
        {
            id: 4,
            numero: "C-2024-004",
            employe: "Sophie Bernard",
            date: "01/09/2024",
            joursPrevue: 10,
            congesApprouves: "Oui",
            difference: 0
        },
        {
            id: 5,
            numero: "A-2024-005",
            employe: "Lucas Petit",
            date: "20/05/2024",
            joursPrevue: 6,
            congesApprouves: "Non",
            difference: -2
        }
    ]);

    const toggleViewModal = (item = null) => {
        setSelectedItem(item);
        setViewModal(!viewModal);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            setCongeList(congeList.filter(i => i.id !== itemToDelete.id));
            toast.success("Suppression effectuée avec succès");
            setDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal(false);
        setItemToDelete(null);
    };

    const getApprouveBadge = (approuve) => {
        return approuve === "Oui" 
            ? <Badge className="badge bg-success rounded-pill" pill>Oui</Badge>
            : <Badge className="badge bg-danger rounded-pill" pill>Non</Badge>;
    };

    const getDifferenceColor = (diff) => {
        if (diff > 0) return "text-success";
        if (diff < 0) return "text-danger";
        return "text-primary";
    };

    const filteredData = congeList.filter((item) =>
        Object.values(item).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="&nbsp;Congés et Absences"
                    pageTitle={
                        <>
                            <i className="ri-calendar-check-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />
                
                <Row className="mb-4">
                    <Col lg={12}>
                        <SearchAndActionBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Chercher un congé ou une absence..."
                            showSearch={true}
                            addButtonLink="/entreprise/conge-et-absence-add"
                            addButtonText="Faire une demande de congé/absence"
                            addButtonIcon="ri-file-add-line"
                            showAddButton={true}
                            onExportClick={() => setIsExportCSV(true)}
                            exportButtonText="Exporter"
                            exportButtonIcon="ri-file-upload-line"
                            showExportButton={true}
                        />
                    </Col>
                    <Col lg={12}>
                        <Card style={{ borderRadius: "20px", boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)" }}>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table className="align-middle table-nowrap mb-0">
                                        <thead className="text-muted">
                                            <tr>
                                                <th>N°</th>
                                                <th>Employé</th>
                                                <th>Date</th>
                                                <th>Jours prévus</th>
                                                <th>Congés approuvés</th>
                                                <th>Différence sur l'année</th>
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
                                                            <Link
                                                                to="#" 
                                                                className="d-flex align-items-center"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleViewModal(item);
                                                                }}
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <i className="ri-user-fill text-primary"></i>
                                                                </div>
                                                                <div className="flex-grow-1 ms-2">
                                                                    <span className="fw-medium">{item.employe}</span>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            {item.date}
                                                        </td>
                                                        <td>
                                                            <span className="fw-medium text-success">
                                                                {item.joursPrevue} jours
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {getApprouveBadge(item.congesApprouves)}
                                                        </td>
                                                        <td>
                                                            <span className={`fw-medium ${getDifferenceColor(item.difference)}`}>
                                                                {item.difference > 0 ? '+' : ''}{item.difference} jours
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="gap-1">
                                                                <Link
                                                                    to="#"
                                                                    className="text-info p-2"
                                                                    title="Voir détails"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleViewModal(item);
                                                                    }}
                                                                >
                                                                    <i className="ri-eye-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="/:entreprise/conge-et-absence-edit/:id"
                                                                    className="text-primary p-2"
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
                                                            <h5 className="mt-3">Aucun congé ou absence trouvé</h5>
                                                            <p className="mb-0">Commencez par créer un nouveau congé ou absence</p>
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
                                <h5 className="modal-title mb-0">Détails du congé/absence</h5>
                                <p className="text-muted mb-0">N° {selectedItem?.numero}</p>
                            </div>
                        </div>
                    </ModalHeader>
                    
                    <ModalBody className="p-4">
                        {selectedItem && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">Employé</small>
                                        <p className="fw-semibold fs-5 mb-0">{selectedItem.employe}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">Date</small>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-calendar-line me-2 text-primary"></i>
                                            {selectedItem.date}
                                        </p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">Jours prévus</small>
                                        <p className="fw-semibold text-success fs-5 mb-0">{selectedItem.joursPrevue} jours</p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">Congés approuvés</small>
                                        <div>{getApprouveBadge(selectedItem.congesApprouves)}</div>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">Différence</small>
                                        <p className={`fw-semibold fs-5 mb-0 ${getDifferenceColor(selectedItem.difference)}`}>
                                            {selectedItem.difference > 0 ? '+' : ''}{selectedItem.difference} jours
                                        </p>
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
            </Container>
        </div>
    );
};

export default CongeEtAbsence;