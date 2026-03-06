import React, { useState, useMemo, useCallback } from "react";
import { Col, Container, Row, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import Pagination from "../../../Components/Common/Pagination";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";

import Pointage from "./Pointage/Pointage";

const PresenceEtAbsence = () => {
    const { entreprise } = useParams();
    const { t } = useTranslation();

    // ========== ÉTATS GÉNÉRAUX ==========
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("1"); // "1" = Congés, "2" = Pointage
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    // ========== ÉTATS POUR LES MODALS ==========
    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // ========== DONNÉES STATIQUES POUR CONGÉS ==========
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

    // ========== FONCTIONS UTILITAIRES POUR CONGÉS ==========
    const getApprouveBadge = (approuve) => {
        return approuve === "Oui"
            ? <Badge className="badge bg-success rounded-pill" pill>{t("Oui")}</Badge>
            : <Badge className="badge bg-danger rounded-pill" pill>{t("Non")}</Badge>;
    };

    const getDifferenceColor = (diff) => {
        if (diff > 0) return "text-success";
        if (diff < 0) return "text-danger";
        return "text-primary";
    };

    // ========== FONCTIONS POUR LES MODALS ==========
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
            if (activeTab === "1") {
                setCongeList(congeList.filter(i => i.id !== itemToDelete.id));
                toast.success(t("Demande supprimée avec succès"));
            } else {
                // Pour l'onglet Pointage, on ne fait rien car la suppression est gérée dans le composant Pointage
                toast.info(t("La suppression est gérée dans le composant Pointage"));
            }
            setDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal(false);
        setItemToDelete(null);
    };

    // ========== ONGLETS DE NAVIGATION ==========
    const navTabsData = useMemo(
        () => [
            {
                key: "1",
                label: t("Congés et Absences"),
                icon: "ri-calendar-check-line",
            },
            {
                key: "2",
                label: t("Pointage"),
                icon: "ri-timer-line",
            }
        ],
        [t],
    );

    const handleTabChange = useCallback((tabKey) => {
        setActiveTab(tabKey);
        setCurrentPage(1);
        setSearchTerm("");
    }, []);

    // ========== FILTRAGE DES DONNÉES POUR CONGÉS ==========
    const filteredCongeData = useMemo(() => {
        if (activeTab !== "1") return [];

        let filtered = congeList;

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (value) =>
                        value &&
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        return filtered;
    }, [congeList, searchTerm, activeTab]);

    // Pagination pour les congés
    const currentCongeItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredCongeData.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredCongeData, currentPage, itemsPerPage]);

    // ========== COLONNES DU TABLEAU POUR CONGÉS ==========
    const congeColumns = useMemo(() => [
        {
            header: t("N°"),
            accessorKey: "numero",
            enableColumnFilter: false,
            cell: (cell) => <span className="fw-medium">{cell.getValue()}</span>,
        },
        {
            header: t("Employé"),
            accessorKey: "employe",
            enableColumnFilter: false,
            cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
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
                );
            },
        },
        {
            header: t("Date"),
            accessorKey: "date",
            enableColumnFilter: false,
        },
        {
            header: t("Jours prévus"),
            accessorKey: "joursPrevue",
            enableColumnFilter: false,
            cell: (cell) => (
                <span className="fw-medium text-success">
                    {cell.getValue()} {t("jours")}
                </span>
            ),
        },
        {
            header: t("Congés approuvés"),
            accessorKey: "congesApprouves",
            enableColumnFilter: false,
            cell: (cell) => getApprouveBadge(cell.getValue()),
        },
        {
            header: t("Différence"),
            accessorKey: "difference",
            enableColumnFilter: false,
            cell: (cell) => {
                const diff = cell.getValue();
                return (
                    <span className={`fw-medium ${getDifferenceColor(diff)}`}>
                        {diff > 0 ? '+' : ''}{diff} {t("jours")}
                    </span>
                );
            },
        },
        {
            header: t("Actions"),
            enableColumnFilter: false,
            cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
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
                            to={`/${entreprise}/conge-et-absence-edit/${item.id}`}
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
                );
            },
        },
    ], [entreprise, t]);

    document.title = t("Presence et Absence");

    // ========== RENDU ==========
    return (
        <div className="page-content">
            <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={filteredCongeData}
            />
            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Presence et Absence")}`}
                    pageTitle={
                        <>
                            <i className="ri-calendar-check-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />

                {/* Barre d'onglets */}
                <Row className="mb-4">
                    <Col lg={12}>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {navTabsData.map((tab) => (
                                <Link
                                    key={tab.key}
                                    to="#"
                                    className={`btn ${activeTab === tab.key
                                        ? "btn-primary"
                                        : "btn-soft-secondary"
                                        } rounded-4 px-4 py-2`}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    <i className={`${tab.icon} me-2`}></i>
                                    {tab.label}
                                </Link>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* CONTENU SELON L'ONGLET */}
                {activeTab === "1" ? (
                    /* ========== ONGLET CONGÉS ET ABSENCES ========== */
                    <Row>
                        <Col lg={12}>
                            <SearchAndActionBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                searchPlaceholder={t("Chercher un congé ou une absence...")}
                                showSearch={true}
                                addButtonLink={`/${entreprise}/conge-et-absence-add`}
                                addButtonText={t("Faire une demande de congé/absence")}
                                addButtonIcon="ri-file-add-line"
                                showAddButton={true}
                                onExportClick={() => setIsExportCSV(true)}
                                exportButtonText={t("Exporter")}
                                exportButtonIcon="ri-file-upload-line"
                                showExportButton={true}
                            />
                        </Col>
                        <Col lg={12}>
                            {loading ? (
                                <div className="d-flex justify-content-center my-5">
                                    <Loader />
                                </div>
                            ) : filteredCongeData.length > 0 ? (
                                <TableContainer
                                    columns={congeColumns}
                                    data={currentCongeItems}
                                    isGlobalFilter={false}
                                    customPageSize={itemsPerPage}
                                    showNavTabs={false}
                                    containerStyle={{
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                                    }}
                                >
                                    <Pagination
                                        data={filteredCongeData}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        perPageData={itemsPerPage}
                                        alwaysShow={true}
                                        showInfo={true}
                                    />
                                </TableContainer>
                            ) : (
                                <EmptyDataCard
                                    title={t("Aucun congé ou absence trouvé")}
                                    description={t("Commencez par créer une nouvelle demande")}
                                    actionButton={
                                        <Link
                                            to={`/${entreprise}/conge-et-absence-add`}
                                            className="btn btn-success add-btn"
                                            style={{ borderRadius: "20px" }}
                                        >
                                            <i className="ri-calendar-check-line me-1"></i>
                                            {t("Nouvelle demande")}
                                        </Link>
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                ) : (
                    /* ========== ONGLET POINTAGE ========== */
                    <Pointage />
                )}

                {/* MODAL DE SUPPRESSION (uniquement pour les congés) */}
                {activeTab === "1" && (
                    <DeleteModal
                        show={deleteModal}
                        onDeleteClick={handleDeleteConfirm}
                        onCloseClick={handleDeleteClose}
                    />
                )}

                {/* MODAL VOIR DÉTAILS POUR CONGÉS */}
                <Modal
                    isOpen={viewModal && activeTab === "1"}
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
                                <h5 className="modal-title mb-0">{t("Détails du congé/absence")}</h5>
                                <p className="text-muted mb-0">{t("N°")} {selectedItem?.numero}</p>
                            </div>
                        </div>
                    </ModalHeader>

                    <ModalBody className="p-4">
                        {selectedItem && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">{t("Employé")}</small>
                                        <p className="fw-semibold fs-5 mb-0">{selectedItem.employe}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">{t("Date")}</small>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-calendar-line me-2 text-primary"></i>
                                            {selectedItem.date}
                                        </p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">{t("Jours prévus")}</small>
                                        <p className="fw-semibold text-success fs-5 mb-0">{selectedItem.joursPrevue} {t("jours")}</p>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">{t("Congés approuvés")}</small>
                                        <div>{getApprouveBadge(selectedItem.congesApprouves)}</div>
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block mb-1">{t("Différence")}</small>
                                        <p className={`fw-semibold fs-5 mb-0 ${getDifferenceColor(selectedItem.difference)}`}>
                                            {selectedItem.difference > 0 ? '+' : ''}{selectedItem.difference} {t("jours")}
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
                            {t("Fermer")}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default PresenceEtAbsence;