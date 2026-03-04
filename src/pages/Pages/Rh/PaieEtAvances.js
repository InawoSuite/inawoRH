import React, { useState, useMemo, useCallback } from "react";
import { Col, Container, Row, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
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

const PaieEtAvances = () => {
    const { entreprise } = useParams();
    const { t } = useTranslation();

    // ========== ÉTATS GÉNÉRAUX ==========
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("1"); // "1" = Fiche de paie, "2" = Avance et Prêt
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    // ========== ÉTATS POUR LES MODALS ==========
    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // ========== DONNÉES STATIQUES ==========
    // Données pour Fiche de paie
    const [fichePaieList, setFichePaieList] = useState([
        {
            id: 1,
            nom: "Dupont",
            prenom: "Jean",
            periode: "Mai",
            lot_de_paie: "Lot 1",
            remuneration_totale: "500 000",
            salaire_base: "400 000",
            statut: "actif",
        },
        {
            id: 2,
            nom: "Martin",
            prenom: "Marie",
            periode: "Juin",
            lot_de_paie: "Lot 2",
            remuneration_totale: "600 000",
            salaire_base: "500 000",
            statut: "actif",
        },
        {
            id: 3,
            nom: "Durant",
            prenom: "Pierre",
            periode: "Juillet",
            lot_de_paie: "Lot 3",
            remuneration_totale: "550 000",
            salaire_base: "450 000",
            statut: "inactif",
        },
    ]);

    // Données pour Avance et Prêt
    const [avancePretList, setAvancePretList] = useState([
        {
            id: 1,
            numero: "AV-2024-001",
            employe: "Jean Dupont",
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

    // ========== FONCTIONS UTILITAIRES ==========
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPeriode = (debut, fin) => {
        return `${formatDate(debut)} - ${formatDate(fin)}`;
    };

    // ✅ Fonction pour obtenir le label du statut
    const getStatusLabel = useCallback((statusValue) => {
        const statusLabels = {
            'actif': t('Actif'),
            'inactif': t('Inactif'),
            'payé': t('Payé'),
            'dépassé': t('Dépassé')
        };
        return statusLabels[statusValue] || t('Inconnu');
    }, [t]);

    // ✅ Fonction pour obtenir la couleur du statut
    const getStatusColor = useCallback((statusValue) => {
        const statusColors = {
            'actif': 'success',
            'inactif': 'danger',
            'payé': 'primary',
            'dépassé': 'danger'
        };
        return statusColors[statusValue] || 'secondary';
    }, []);

    const getStatutBadge = (statut) => {
        switch (statut) {
            case 'actif':
                return <Badge className="badge bg-success rounded-pill" pill>{t('Actif')}</Badge>;
            case 'payé':
                return <Badge className="badge bg-primary rounded-pill" pill>{t('Payé')}</Badge>;
            case 'dépassé':
                return <Badge className="badge bg-danger rounded-pill" pill>{t('Dépassé')}</Badge>;
            default:
                return <Badge className="badge bg-secondary rounded-pill" pill>{statut}</Badge>;
        }
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
                setFichePaieList(fichePaieList.filter(i => i.id !== itemToDelete.id));
            } else {
                setAvancePretList(avancePretList.filter(i => i.id !== itemToDelete.id));
            }
            toast.success(t("Suppression effectuée avec succès"));
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
                label: t("Fiche de paie"),
                icon: "ri-money-dollar-circle-line",
            },
            {
                key: "2",
                label: t("Avance et Prêt"),
                icon: "ri-bank-line",
            }
        ],
        [t],
    );

    const handleTabChange = useCallback((tabKey) => {
        setActiveTab(tabKey);
        setCurrentPage(1);
        setSearchTerm("");
    }, []);

    // ========== FILTRAGE DES DONNÉES ==========
    const currentData = useMemo(() => {
        return activeTab === "1" ? fichePaieList : avancePretList;
    }, [activeTab, fichePaieList, avancePretList]);

    const filteredData = useMemo(() => {
        let filtered = currentData;

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
    }, [currentData, searchTerm]);

    // Pagination
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredData, currentPage, itemsPerPage]);

    // ========== COLONNES DU TABLEAU ==========
    const columns = useMemo(() => {
        if (activeTab === "1") {
            // Colonnes pour Fiche de paie
            return [
                {
                    header: t("N°"),
                    accessorKey: "id",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const index = cellProps.row.index;
                        return (currentPage - 1) * itemsPerPage + index + 1;
                    },
                },
                {
                    header: t("Nom-Prénom"),
                    accessorKey: "nom",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        const fullName = [item.prenom, item.nom].filter(Boolean).join(" ");
                        return (
                            <Link
                                to="#"
                                className="d-flex align-items-center gap-2 text-body fw-medium"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleViewModal(item);
                                }}
                            >
                                <i className="ri-user-fill text-primary"></i>
                                {fullName || t("Non défini")}
                            </Link>
                        );
                    },
                },
                {
                    header: t("Période"),
                    accessorKey: "periode",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Lot de paie"),
                    accessorKey: "lot_de_paie",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Rémunération totale"),
                    accessorKey: "remuneration_totale",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Salaire de base"),
                    accessorKey: "salaire_base",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Statut"),
                    accessorKey: "statut",
                    enableColumnFilter: false,
                    cell: (cell) => {
                        const statusValue = cell.getValue();
                        return (
                            <Badge
                                color={getStatusColor(statusValue)}
                                className="rounded-pill"
                            >
                                {getStatusLabel(statusValue)}
                            </Badge>
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
                                    to={`/${entreprise}/fiche-edit/${item.id}`}
                                    className="text-primary p-2"
                                    title={t("Modifier")}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                                <Link
                                    to="#"
                                    className="text-info p-2"
                                    title={t("Exporter")}
                                    onClick={() => toast.info(t("Export non implémenté"))}
                                >
                                    <i className="ri-file-download-line fs-16"></i>
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
            ];
        } else {
            // Colonnes pour Avance et Prêt
            return [
                {
                    header: t("N°"),
                    accessorKey: "numero",
                    enableColumnFilter: false,
                    cell: (cell) => <span className="fw-medium">{cell.getValue()}</span>,
                },
                {
                    header: t("Nom de l'employé"),
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
                    header: t("Période"),
                    accessorKey: "periodeDebut",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        return formatPeriode(item.periodeDebut, item.periodeFin);
                    },
                },
                {
                    header: t("Salaire net"),
                    accessorKey: "salaireNet",
                    enableColumnFilter: false,
                    cell: (cell) => (
                        <span className="fw-medium text-success">
                            {formatMontant(cell.getValue())}
                        </span>
                    ),
                },
                {
                    header: t("Montant prêt"),
                    accessorKey: "montantPret",
                    enableColumnFilter: false,
                    cell: (cell) => (
                        <span className="fw-medium text-danger">
                            {formatMontant(cell.getValue())}
                        </span>
                    ),
                },
                {
                    header: t("Statut"),
                    accessorKey: "statut",
                    enableColumnFilter: false,
                    cell: (cell) => getStatutBadge(cell.getValue()),
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
                                    to={`/${entreprise}/avance-et-pret-edit/${item.id}`}
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
            ];
        }
    }, [activeTab, currentPage, itemsPerPage, entreprise]);

    // ========== RENDU ==========
    document.title = t("Paie et Avances");

    return (
        <div className="page-content">
            <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={filteredData}
            />
            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Paie et Avances")}`}
                    pageTitle={
                        <>
                            <i className="ri-money-dollar-circle-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />
                <Row>
                    <Col lg={12}>
                        <SearchAndActionBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder={
                                activeTab === "1"
                                    ? "Chercher une fiche de paie..."
                                    : t("Chercher une avance ou un prêt...")
                            }
                            showSearch={true}
                            addButtonLink={
                                activeTab === "1"
                                    ? `/${entreprise}/fiche-add`
                                    : `/${entreprise}/avance-et-pret-add`
                            }
                            addButtonText={
                                activeTab === "1"
                                    ? "Nouvelle fiche de paie"
                                    : t("Faire une demande d'avance ou de prêt")
                            }
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
                        ) : filteredData.length > 0 ? (
                            <TableContainer
                                columns={columns}
                                data={currentItems}
                                isGlobalFilter={false}
                                customPageSize={itemsPerPage}
                                showNavTabs={true}
                                navTabs={navTabsData}
                                activeTab={activeTab}
                                onTabChange={handleTabChange}
                                navTabsClass="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
                                containerStyle={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                                }}
                            >
                                <Pagination
                                    data={filteredData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    perPageData={itemsPerPage}
                                    alwaysShow={true}
                                    showInfo={true}
                                />
                            </TableContainer>
                        ) : (
                            <EmptyDataCard
                                title={
                                    activeTab === "1"
                                        ? "Aucune fiche de paie trouvée"
                                        : t("Aucune avance ou prêt trouvé")
                                }
                                description={
                                    activeTab === "1"
                                        ? t("Commencez par ajouter une fiche de paie")
                                        : t("Commencez par créer une nouvelle avance ou prêt")
                                }
                                actionButton={
                                    <Link
                                        to={
                                            activeTab === "1"
                                                ? `/${entreprise}/fiche-add`
                                                : `/${entreprise}/avance-et-pret-add`
                                        }
                                        className="btn btn-success add-btn"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        <i className="ri-user-add-line me-1"></i>
                                        {activeTab === "1"
                                            ? "Ajouter une fiche de paie"
                                            : t("Ajouter une avance ou un prêt")}
                                    </Link>
                                }
                            />
                        )}
                    </Col>
                </Row>

                {/* MODAL DE SUPPRESSION */}
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
                                    <i className="ri-eye-line"></i>
                                </span>
                            </div>
                            <div>
                                <h5 className="modal-title mb-0">
                                    {activeTab === "1"
                                        ? "Détails de la fiche de paie"
                                        : "Détails de l'avance/prêt"}
                                </h5>
                                <p className="text-muted mb-0">
                                    {activeTab === "1" ? "Fiche #" : "N° "}{selectedItem?.numero || selectedItem?.id}
                                </p>
                            </div>
                        </div>
                    </ModalHeader>

                    <ModalBody className="p-4">
                        {selectedItem && activeTab === "1" && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Nom complet</Label>
                                        <p className="fw-semibold fs-5 mb-0">
                                            {selectedItem.prenom} {selectedItem.nom}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Période</Label>
                                        <p className="fw-semibold mb-0">{selectedItem.periode}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Lot de paie</Label>
                                        <p className="fw-semibold mb-0">{selectedItem.lot_de_paie}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Rémunération totale</Label>
                                        <p className="fw-semibold text-success mb-0">{selectedItem.remuneration_totale}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Salaire de base</Label>
                                        <p className="fw-semibold text-primary mb-0">{selectedItem.salaire_base}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Statut</Label>
                                        <div>
                                            <Badge
                                                color={getStatusColor(selectedItem.statut)}
                                                className="rounded-pill"
                                            >
                                                {getStatusLabel(selectedItem.statut)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {selectedItem && activeTab === "2" && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Nom de l'employé</Label>
                                        <p className="fw-semibold fs-5 mb-0">{selectedItem.employe}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Salaire net</Label>
                                        <p className="fw-semibold fs-5 text-success mb-0">{formatMontant(selectedItem.salaireNet)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Période</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-calendar-line me-2 text-primary"></i>
                                            {formatPeriode(selectedItem.periodeDebut, selectedItem.periodeFin)}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Montant du prêt</Label>
                                        <p className="fw-semibold fs-5 text-danger mb-0">{formatMontant(selectedItem.montantPret)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Date de remboursement</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-calendar-event-line me-2 text-warning"></i>
                                            {formatDate(selectedItem.dateRemboursement)}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Montant remboursé</Label>
                                        <p className="fw-semibold text-info mb-0">{formatMontant(selectedItem.montantRembourse || 0)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">Solde restant</Label>
                                        <p className="fw-semibold text-warning mb-0">{formatMontant(selectedItem.solde || 0)}</p>
                                    </div>
                                </Col>
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
            </Container>
        </div>
    );
};

export default PaieEtAvances;