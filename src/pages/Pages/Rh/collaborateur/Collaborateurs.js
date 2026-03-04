import React, { useMemo, useState, useCallback } from "react";
import {
    Col,
    Container,
    Row,
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import Pagination from "../../../../Components/Common/Pagination";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";


const Collaborateurs = () => {
    const { entreprise } = useParams();
    const { t } = useTranslation();
    const initialSanctionForm = {
        employe: "",
        poste: "",
        motif: "",
        type: "Avertissement",
        pieceJustificative: "",
    };

    const [collaborateurList, setCollaborateurList] = useState([
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
    ]);

    const [sanctionsList, setSanctionsList] = useState([
        {
            id: 1,
            numero: "SN-2024-001",
            employe: "Jean Dupont",
            poste: "Directeur Général",
            motif: "Retard répété",
            type: "Avertissement",
            pieceJustificative: "document1.pdf",
            statut: "actif",
        },
        {
            id: 2,
            numero: "SN-2024-002",
            employe: "Marie Martin",
            poste: "Responsable RH",
            motif: "Absence non justifiée",
            type: "Blâme",
            pieceJustificative: "document2.pdf",
            statut: "actif",
        },
        {
            id: 3,
            numero: "SN-2024-003",
            employe: "Pierre Durand",
            poste: "Comptable",
            motif: "Manque de ponctualité",
            type: "Avertissement",
            pieceJustificative: "document3.pdf",
            statut: "inactif",
        },
    ]);

    const [loading] = useState(false);
    const [activeTab, setActiveTab] = useState("1");
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [createSanctionModal, setCreateSanctionModal] = useState(false);
    const [newSanction, setNewSanction] = useState(initialSanctionForm);
    const [editingSanctionId, setEditingSanctionId] = useState(null);

    const isSanctionsTab = activeTab === "4";

    const getStatusLabel = useCallback((statusValue) => {
        const statusLabels = {
            actif: t("Actif"),
            inactif: t("Inactif"),
        };
        return statusLabels[statusValue] || t("Inconnu");
    }, [t]);

    const getStatusColor = useCallback((statusValue) => {
        const statusColors = {
            actif: "success",
            inactif: "danger",
        };
        return statusColors[statusValue] || "secondary";
    }, []);

    const navTabsData = useMemo(
        () => [
            {
                key: "1",
                label: t("Tous les collaborateurs"),
                icon: "ri-user-line",
                filterType: "all",
            },
            {
                key: "2",
                label: t("Actifs"),
                icon: "ri-user-follow-line",
                filterType: "actif",
            },
            {
                key: "3",
                label: t("Inactifs"),
                icon: "ri-user-unfollow-line",
                filterType: "inactif",
            },
            {
                key: "4",
                label: t("Sanctions"),
                icon: "ri-shield-cross-line",
                filterType: "all",
            },
        ],
        [t],
    );

    const filteredData = useMemo(() => {
        let filtered = isSanctionsTab ? sanctionsList : collaborateurList;

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (value) =>
                        value &&
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
                ),
            );
        }

        if (!isSanctionsTab) {
            const activeStatusFilter =
                activeTab === "2" ? "actif" : activeTab === "3" ? "inactif" : "all";

            if (activeStatusFilter !== "all") {
                filtered = filtered.filter(
                    (item) => (item.statut || "").toLowerCase() === activeStatusFilter,
                );
            }
        }

        return filtered;
    }, [collaborateurList, sanctionsList, searchTerm, activeTab, isSanctionsTab]);

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredData, currentPage]);

    const toggleViewModal = (item = null) => {
        setSelectedItem(item);
        setViewModal((prev) => !prev);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;

        if (isSanctionsTab) {
            setSanctionsList((prev) => prev.filter((i) => i.id !== itemToDelete.id));
            toast.success(t("Sanction supprimée avec succès"));
        } else {
            setCollaborateurList((prev) => prev.filter((i) => i.id !== itemToDelete.id));
            toast.success(t("Collaborateur supprimé avec succès"));
        }

        setDeleteModal(false);
        setItemToDelete(null);
    };

    const handleDeleteClose = () => {
        setDeleteModal(false);
        setItemToDelete(null);
    };

    const openCreateSanctionModal = () => {
        setEditingSanctionId(null);
        setNewSanction(initialSanctionForm);
        setCreateSanctionModal(true);
    };

    const openEditSanctionModal = (item) => {
        setEditingSanctionId(item.id);
        setNewSanction({
            employe: item.employe || "",
            poste: item.poste || "",
            motif: item.motif || "",
            type: item.type || "Avertissement",
            pieceJustificative: item.pieceJustificative || "",
        });
        setCreateSanctionModal(true);
    };

    const closeSanctionModal = () => {
        setCreateSanctionModal(false);
        setEditingSanctionId(null);
        setNewSanction(initialSanctionForm);
    };

    const handleCreateSanction = (e) => {
        e.preventDefault();

        if (
            !newSanction.employe ||
            !newSanction.poste ||
            !newSanction.motif ||
            !newSanction.type
        ) {
            toast.error(t("Veuillez renseigner les champs obligatoires"));
            return;
        }

        if (editingSanctionId) {
            setSanctionsList((prev) =>
                prev.map((item) =>
                    item.id === editingSanctionId
                        ? {
                            ...item,
                            ...newSanction,
                        }
                        : item,
                ),
            );
            toast.success(t("Sanction modifiée avec succès"));
        } else {
            const nextId = sanctionsList.length
                ? Math.max(...sanctionsList.map((item) => item.id)) + 1
                : 1;

            const created = {
                id: nextId,
                numero: `SN-${new Date().getFullYear()}-${String(nextId).padStart(3, "0")}`,
                ...newSanction,
            };

            setSanctionsList((prev) => [created, ...prev]);
            toast.success(t("Sanction ajoutée avec succès"));
        }

        closeSanctionModal();
    };

    const columns = useMemo(() => {
        if (!isSanctionsTab) {
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
                    header: t("Nom complet"),
                    accessorKey: "nom",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const collab = cellProps.row.original;
                        const fullName = [collab.nom, collab.prenom].filter(Boolean).join(" ");
                        return (
                            <Link
                                to={`/${entreprise}/collaborateur-details/${collab.id}`}
                                state={{ collaborateur: collab }}
                                className="d-flex align-items-center gap-2 text-body fw-medium"
                            >
                                <i className="ri-user-fill text-primary"></i>
                                {fullName || t("Non défini")}
                            </Link>
                        );
                    },
                },
                {
                    header: t("Affiliation"),
                    accessorKey: "affiliation",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Téléphone"),
                    accessorKey: "telephone",
                    enableColumnFilter: false,
                },
                {
                    header: t("Poste"),
                    accessorKey: "poste",
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
                            <Badge color={getStatusColor(statusValue)} className="rounded-pill">
                                {getStatusLabel(statusValue)}
                            </Badge>
                        );
                    },
                },
                {
                    header: t("Actions"),
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const collab = cellProps.row.original;
                        return (
                            <div className="gap-1">
                                <Link
                                    to={`/${entreprise}/collaborateur-details/${collab.id}`}
                                    state={{ collaborateur: collab }}
                                    className="text-info p-2"
                                    title={t("Voir détails")}
                                >
                                    <i className="ri-eye-fill fs-16"></i>
                                </Link>
                                <Link
                                    to={`/${entreprise}/collaborateur-edit/${collab.id}`}
                                    state={{ collaborateur: collab }}
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
                                        handleDeleteClick(collab);
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

        return [
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
                header: t("Motif"),
                accessorKey: "motif",
                enableColumnFilter: false,
            },
            {
                header: t("Type"),
                accessorKey: "type",
                enableColumnFilter: false,
            },
            {
                header: t("Poste"),
                accessorKey: "poste",
                enableColumnFilter: false,
                cell: (cell) => cell.getValue() || t("Non défini"),
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
                                to="#"
                                className="text-primary p-2"
                                title={t("Modifier")}
                                onClick={(e) => {
                                    e.preventDefault();
                                    openEditSanctionModal(item);
                                }}
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
    }, [
        isSanctionsTab,
        currentPage,
        entreprise,
        getStatusColor,
        getStatusLabel,
        t,
    ]);

    const handleTabChange = useCallback((tabKey) => {
        setActiveTab(tabKey);
        setCurrentPage(1);
        setSearchTerm("");
    }, []);

    document.title = t("Collaborateurs | INAWO - Suite de Gestion");

    return (
        <div className="page-content">
            <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={filteredData}
            />

            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Collaborateurs")}`}
                    pageTitle={
                        <>
                            <i className="ri-shield-user-line"></i>
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
                                isSanctionsTab
                                    ? t("Chercher une sanction...")
                                    : t("Chercher un collaborateur...")
                            }
                            showSearch={true}
                            addButtonLink={
                                isSanctionsTab ? undefined : `/${entreprise}/collaborateur-add`
                            }
                            onAddClick={
                                isSanctionsTab ? openCreateSanctionModal : undefined
                            }
                            addButtonText={
                                isSanctionsTab ? t("Ajouter une sanction") : t("Ajouter un collaborateur")
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
                        {loading ? null : filteredData.length > 0 ? (
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
                                    isSanctionsTab
                                        ? t("Aucune sanction trouvée")
                                        : t("Aucun collaborateur trouvé")
                                }
                                description={
                                    isSanctionsTab
                                        ? t("Commencez par créer une nouvelle sanction")
                                        : t("Commencez par ajouter un collaborateur")
                                }
                                actionButton={
                                    isSanctionsTab ? (
                                        <button
                                            type="button"
                                            className="btn btn-success add-btn"
                                            style={{ borderRadius: "20px" }}
                                            onClick={openCreateSanctionModal}
                                        >
                                            <i className="ri-file-add-line me-1"></i>
                                            {t("Ajouter une sanction")}
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/${entreprise}/collaborateur-add`}
                                            className="btn btn-success add-btn"
                                            style={{ borderRadius: "20px" }}
                                        >
                                            <i className="ri-user-add-line me-1"></i>
                                            {t("Ajouter un collaborateur")}
                                        </Link>
                                    )
                                }
                            />
                        )}
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
                    centered
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader toggle={() => toggleViewModal()} className="border-0">
                        {isSanctionsTab ? t("Détails de la sanction") : t("Détails du collaborateur")}
                    </ModalHeader>
                    <ModalBody>
                        {selectedItem && isSanctionsTab ? (
                            <Row className="g-3">
                                <Col md={6}>
                                    <Label className="form-label text-muted small mb-1">{t("Numéro")}</Label>
                                    <p className="fw-semibold mb-0">{selectedItem.numero}</p>
                                </Col>
                                <Col md={6}>
                                    <Label className="form-label text-muted small mb-1">{t("Employé")}</Label>
                                    <p className="fw-semibold mb-0">{selectedItem.employe}</p>
                                </Col>
                                <Col md={12}>
                                    <Label className="form-label text-muted small mb-1">{t("Motif")}</Label>
                                    <p className="fw-semibold mb-0">{selectedItem.motif}</p>
                                </Col>
                                <Col md={6}>
                                    <Label className="form-label text-muted small mb-1">{t("Poste")}</Label>
                                    <p className="fw-semibold mb-0">{selectedItem.poste || t("Non défini")}</p>
                                </Col>
                                <Col md={6}>
                                    <Label className="form-label text-muted small mb-1">{t("Type")}</Label>
                                    <p className="fw-semibold mb-0">{t(selectedItem.type)}</p>
                                </Col>
                                <Col md={6}>
                                    <Label className="form-label text-muted small mb-1">{t("Pièce justificative")}</Label>
                                    <p className="fw-semibold mb-0">
                                        {selectedItem.pieceJustificative || "-"}
                                    </p>
                                </Col>
                            </Row>
                        ) : (
                            <p className="mb-0 text-muted">{t("Aucun détail à afficher")}</p>
                        )}
                    </ModalBody>
                    <ModalFooter className="border-0">
                        {selectedItem && isSanctionsTab && (
                            <Button
                                color="primary"
                                className="rounded-pill px-4"
                                onClick={() => {
                                    toggleViewModal();
                                    openEditSanctionModal(selectedItem);
                                }}
                            >
                                {t("Modifier")}
                            </Button>
                        )}
                        <Button
                            color="secondary"
                            className="rounded-pill px-4"
                            onClick={() => toggleViewModal()}
                        >
                            {t("Fermer")}
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={createSanctionModal}
                    toggle={closeSanctionModal}
                    centered
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader
                        toggle={closeSanctionModal}
                        className="border-0"
                    >
                        {editingSanctionId ? t("Modifier la sanction") : t("Ajouter une sanction")}
                    </ModalHeader>
                    <Form onSubmit={handleCreateSanction}>
                        <ModalBody>
                            <FormGroup>
                                <Label for="employe">{t("Employé")}</Label>
                                <Input
                                    id="employe"
                                    className="rounded-pill"
                                    value={newSanction.employe}
                                    onChange={(e) =>
                                        setNewSanction((prev) => ({ ...prev, employe: e.target.value }))
                                    }
                                    placeholder={t("Nom de l'employé")}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="poste">{t("Poste")}</Label>
                                <Input
                                    id="poste"
                                    className="rounded-pill"
                                    value={newSanction.poste}
                                    onChange={(e) =>
                                        setNewSanction((prev) => ({ ...prev, poste: e.target.value }))
                                    }
                                    placeholder={t("Poste de l'employé")}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="motif">{t("Motif")}</Label>
                                <Input
                                    id="motif"
                                    type="textarea"
                                    className="rounded-4"
                                    value={newSanction.motif}
                                    onChange={(e) =>
                                        setNewSanction((prev) => ({ ...prev, motif: e.target.value }))
                                    }
                                    placeholder={t("Saisir le motif")}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="type">{t("Type")}</Label>
                                <Input
                                    id="type"
                                    type="select"
                                    className="rounded-pill"
                                    value={newSanction.type}
                                    onChange={(e) =>
                                        setNewSanction((prev) => ({ ...prev, type: e.target.value }))
                                    }
                                >
                                    <option value="Avertissement">{t("Avertissement")}</option>
                                    <option value="Blâme">{t("Blâme")}</option>
                                    <option value="Mise à pied">{t("Mise à pied")}</option>
                                    <option value="Licenciement">{t("Licenciement")}</option>
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="pieceJustificative">{t("Pièce justificative")}</Label>
                                <Input
                                    id="pieceJustificative"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="rounded-pill"
                                    onChange={(e) =>
                                        setNewSanction((prev) => ({
                                            ...prev,
                                            pieceJustificative: e.target.files?.[0]?.name || "",
                                        }))
                                    }
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter className="border-0">
                            <Button
                                color="light"
                                className="rounded-pill px-4"
                                onClick={closeSanctionModal}
                                type="button"
                            >
                                {t("Annuler")}
                            </Button>
                            <Button color="success" className="rounded-pill px-4" type="submit">
                                {editingSanctionId ? t("Mettre à jour") : t("Enregistrer")}
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
};

export default Collaborateurs;
