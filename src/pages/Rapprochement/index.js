import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../Components/Common/Loader";
import EmptyDataCard from "../../Components/Common/EmptyDataCard";
import DeleteModal from "../../Components/Common/DeleteModal";
import { CustomSelect } from "../../Components/Common/CustomSelectStyles";
import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Button,
  FormFeedback,
  Badge,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import SearchAndActionBar from "../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import Pagination from "../../Components/Common/Pagination";
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import classnames from "classnames";

// Types de comptes bancaires
const BANK_ACCOUNTS = [
  { value: "511", label: "511 - Banque BICEC" },
  { value: "512", label: "512 - Banque Afriland" },
  { value: "513", label: "513 - Banque SCB" },
  { value: "514", label: "514 - Banque UBA" },
];

// Options pour les journaux
const JOURNAL_OPTIONS = [
  { value: "all", label: "Tous les journaux" },
  { value: "BQ", label: "Banque" },
  { value: "VTE", label: "Ventes" },
  { value: "ACH", label: "Achats" },
  { value: "OD", label: "Opérations Diverses" },
];

// Options de statut de rapprochement
const RECONCILIATION_STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "pending", label: "En attente" },
  { value: "cancelled", label: "Annulé" },
];

// Périodes fiscales
const FISCAL_PERIODS = [
  { value: "2024", label: "Exercice 2024" },
  { value: "2023", label: "Exercice 2023" },
  { value: "2022", label: "Exercice 2022" },
];

// DONNÉES FICTIVES POUR LES RAPPROCHEMENTS
const MOCK_RECONCILIATIONS = [
  {
    id: 1,
    reference: "RAP-2024-001",
    account: "Banque BICEC (511)",
    start_date: "01/01/2024",
    end_date: "31/01/2024",
    bank_balance: 12500000,
    accounting_balance: 12480000,
    difference: -20000,
    status: "completed",
    completed_date: "05/02/2024",
    validator: "Admin System",
    reconciled_entries: 4,
    pending_entries: 3,
    missing_entries: 1,
  },
  {
    id: 2,
    reference: "RAP-2024-002",
    account: "Banque BICEC (511)",
    start_date: "01/02/2024",
    end_date: "28/02/2024",
    bank_balance: null,
    accounting_balance: 13500000,
    difference: null,
    status: "in_progress",
    completed_date: null,
    validator: null,
    reconciled_entries: 0,
    pending_entries: 5,
    missing_entries: 0,
  },
  {
    id: 3,
    reference: "RAP-2024-003",
    account: "Banque Afriland (512)",
    start_date: "01/01/2024",
    end_date: "31/01/2024",
    bank_balance: 7500000,
    accounting_balance: 7450000,
    difference: -50000,
    status: "pending",
    completed_date: null,
    validator: null,
    reconciled_entries: 2,
    pending_entries: 2,
    missing_entries: 1,
  },
];

const RapprochementBancaire = () => {
  const { t } = useTranslation();

  // États principaux
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedBank, setSelectedBank] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // États des modals
  const [reconciliationModal, setReconciliationModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] = useState(null);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const itemsPerPage = 10;

  // ✅ Fonction pour formater les montants
  const formatAmount = useCallback((amount) => {
    if (amount === null || amount === undefined) return "-";
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " "
    );
  }, []);

  // ✅ Fonction pour obtenir les infos du statut
  const getStatusInfo = useCallback((status) => {
    const statusColors = {
      in_progress: {
        label: "En cours",
        color: "text-warning",
        icon: "ri-refresh-line",
      },
      completed: {
        label: "Terminé",
        color: "text-success",
        icon: "ri-checkbox-circle-line",
      },
      pending: {
        label: "En attente",
        color: "text-info",
        icon: "ri-alert-line",
      },
      cancelled: {
        label: "Annulé",
        color: "text-danger",
        icon: "ri-close-circle-line",
      },
    };
    return (
      statusColors[status] || {
        label: "Inconnu",
        color: "text-secondary",
        icon: "ri-question-line",
      }
    );
  }, []);

  // ✅ Filtrage optimisé des rapprochements
  const filteredData = useMemo(() => {
    let filtered = reconciliations;

    // Filtre par banque
    if (selectedBank !== "all") {
      filtered = filtered.filter((item) => item.account.includes(selectedBank));
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchLower)
        )
      );
    }

    return filtered;
  }, [reconciliations, selectedBank, selectedStatus, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Fonction pour récupérer les données (MOCK)
  const fetchData = useCallback(async () => {
    setLoading(true);

    setTimeout(() => {
      try {
        setReconciliations(MOCK_RECONCILIATIONS);

        // Préparer les données pour l'export
        const exportDataFormatted = MOCK_RECONCILIATIONS.map((item) => ({
          Référence: item.reference,
          Compte: item.account,
          Période: `${item.start_date} - ${item.end_date}`,
          "Solde Bancaire": formatAmount(item.bank_balance),
          "Solde Comptable": formatAmount(item.accounting_balance),
          Écart: formatAmount(item.difference),
          Statut: getStatusInfo(item.status).label,
          "Date Validation": item.completed_date || "-",
        }));
        setExportData(exportDataFormatted);

        toast.success("Données chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchData:", err);
        toast.error("Erreur lors du chargement des données");
        setReconciliations([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [formatAmount, getStatusInfo]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Rapprochement Bancaire | INAWO - Suite de Gestion";
    fetchData();
  }, [fetchData]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBank, selectedStatus]);

  // ✅ Validation du formulaire de rapprochement
  const reconciliationValidationSchema = Yup.object({
    account: Yup.string().required("Le compte bancaire est requis"),
    start_date: Yup.date().required("La date de début est requise"),
    end_date: Yup.date()
      .required("La date de fin est requise")
      .min(
        Yup.ref("start_date"),
        "La date de fin doit être après la date de début"
      ),
    bank_balance: Yup.number()
      .required("Le solde du relevé bancaire est requis")
      .typeError("Veuillez entrer un montant valide"),
  });

  // ✅ Formik pour le formulaire de rapprochement
  const reconciliationFormik = useFormik({
    initialValues: {
      account: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      bank_balance: "",
      notes: "",
    },
    validationSchema: reconciliationValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleCreateReconciliation(values, resetForm, setSubmitting);
    },
  });

  // ✅ Créer un nouveau rapprochement
  const handleCreateReconciliation = async (
    values,
    resetForm,
    setSubmitting
  ) => {
    setSubmitting(true);

    setTimeout(() => {
      try {
        const accountInfo = BANK_ACCOUNTS.find(
          (a) => a.value === values.account
        );
        const newReconciliation = {
          id: reconciliations.length + 1,
          reference: `RAP-${new Date().getFullYear()}-${String(
            reconciliations.length + 1
          ).padStart(3, "0")}`,
          account: accountInfo?.label || values.account,
          start_date: new Date(values.start_date).toLocaleDateString("fr-FR"),
          end_date: new Date(values.end_date).toLocaleDateString("fr-FR"),
          bank_balance: parseFloat(values.bank_balance),
          accounting_balance: null,
          difference: null,
          status: "in_progress",
          completed_date: null,
          validator: null,
          notes: values.notes,
          reconciled_entries: 0,
          pending_entries: 0,
          missing_entries: 0,
        };

        setReconciliations((prev) => [newReconciliation, ...prev]);
        toast.success("Rapprochement créé avec succès !");
        resetForm();
        setReconciliationModal(false);
      } catch (err) {
        console.error("Erreur lors de la création du rapprochement:", err);
        toast.error("Erreur lors de la création du rapprochement");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de suppression
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;

    setTimeout(() => {
      try {
        const updatedData = reconciliations.filter(
          (item) => item.id !== itemToDelete.id
        );
        setReconciliations(updatedData);
        toast.success("Rapprochement supprimé avec succès !");

        setDeleteModal(false);
        setItemToDelete(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleOpenReconciliationModal = useCallback(() => {
    reconciliationFormik.resetForm();
    reconciliationFormik.setValues({
      account: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      bank_balance: "",
      notes: "",
    });
    setReconciliationModal(true);
  }, [reconciliationFormik]);

  const handleOpenDetailModal = useCallback((reconciliation) => {
    setSelectedReconciliation(reconciliation);
    setDetailModal(true);
  }, []);

  const handleOpenDeleteModal = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  }, []);

  // ✅ Colonnes pour le tableau des rapprochements - EXACTEMENT COMME LA PAGE GRAND LIVRE
  const columns = useMemo(
    () => [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => {
          const globalIndex =
            (currentPage - 1) * itemsPerPage + cell.row.index + 1;
          return <span className="fw-medium">{globalIndex}</span>;
        },
        size: 60,
      },
      {
        header: "Référence",
        accessorKey: "reference",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold text-primary">{cell.getValue()}</span>
        ),
        size: 120,
      },
      {
        header: "Compte",
        accessorKey: "account",
        enableColumnFilter: false,
        cell: (cell) => <span className="fw-medium">{cell.getValue()}</span>,
        size: 150,
      },
      {
        header: "Période",
        accessorKey: "period",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="text-muted">
            {row.original.start_date} - {row.original.end_date}
          </span>
        ),
        size: 150,
      },
      {
        header: "Solde Bancaire",
        accessorKey: "bank_balance",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
        ),
        size: 140,
      },
      {
        header: "Solde Comptable",
        accessorKey: "accounting_balance",
        enableColumnFilter: false,
        cell: (cell) => {
          const value = cell.getValue();
          if (value === null || value === undefined) {
            return <span className="text-muted">-</span>;
          }
          return <span className="fw-semibold">{formatAmount(value)}</span>;
        },
        size: 140,
      },
      {
        header: "Écart",
        accessorKey: "difference",
        enableColumnFilter: false,
        cell: (cell) => {
          const value = cell.getValue();
          if (value === null || value === undefined) {
            return <span className="text-muted">-</span>;
          }
          return (
            <span
              className={`fw-bold ${value > 0
                  ? "text-success"
                  : value < 0
                    ? "text-danger"
                    : "text-primary"
                }`}
            >
              {formatAmount(value)}
            </span>
          );
        },
        size: 120,
      },
      {
        header: "Statut",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          const statusInfo = getStatusInfo(cell.getValue());
          return (
            <span className={`fw-medium ${statusInfo.color}`}>
              <i className={`${statusInfo.icon} me-1`}></i>
              {statusInfo.label}
            </span>
          );
        },
        size: 120,
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="d-flex gap-2">
              <Link
                to="#"
                className="text-info"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDetailModal(item);
                }}
                title="Voir détails"
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>

              {item.status !== "completed" && (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenDeleteModal(item);
                  }}
                  title="Supprimer"
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              )}
            </div>
          );
        },
        size: 100,
      },
    ],
    [
      currentPage,
      itemsPerPage,
      formatAmount,
      getStatusInfo,
      handleOpenDetailModal,
      handleOpenDeleteModal,
    ]
  );

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
            style={{ marginTop: "70px" }}
          />

          {/* Export CSV Modal */}
          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
            filename="Rapprochements_Bancaires"
          />

          {/* Delete Modal */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteItem}
            onCloseClick={() => {
              setDeleteModal(false);
              setItemToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer ce rapprochement ? Cette action est irréversible."
          />

          <BreadCrumb
            title={`Rapprochement Bancaire - Exercice ${selectedPeriod}`}
            pageTitle={
              <>
                <i className="ri-bank-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher un rapprochement..."
                showSearch={true}
                onAddClick={handleOpenReconciliationModal}
                addButtonText="Nouveau rapprochement"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} rapprochement
                    {filteredData.length !== 1 ? "s" : ""} trouvé
                    {filteredData.length !== 1 ? "s" : ""}
                  </div>
                }
              />

              <Row className="mb-3">
                <Col lg={12}>
                  <div
                    className="d-flex align-items-center gap-3 flex-wrap rounded-pill"
                    style={{ background: "white", padding: "1%" }}
                  >
                    <div>
                      <CustomSelect
                        value={
                          FISCAL_PERIODS.find(
                            (opt) => opt.value === selectedPeriod
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedPeriod(
                            selectedOption ? selectedOption.value : "2024"
                          );
                        }}
                        options={FISCAL_PERIODS}
                        placeholder="Sélectionnez un exercice"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    <div>
                      <CustomSelect
                        value={
                          BANK_ACCOUNTS.find(
                            (opt) => opt.value === selectedBank
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedBank(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={[
                          { value: "all", label: "Toutes les banques" },
                          ...BANK_ACCOUNTS,
                        ]}
                        placeholder="Filtrer par banque"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    <div>
                      <CustomSelect
                        value={
                          RECONCILIATION_STATUS_OPTIONS.find(
                            (opt) => opt.value === selectedStatus
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedStatus(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={RECONCILIATION_STATUS_OPTIONS}
                        placeholder="Filtrer par statut"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg={12}>
                  <Card className="rounded-4">
                    <CardBody className="p-0">
                      <Nav tabs className="nav-tabs-custom">
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "1",
                              "text-success": activeTab === "1",
                            })}
                            onClick={() => setActiveTab("1")}
                            style={{
                              cursor: "pointer",
                              color:
                                activeTab === "1" ? "#198754" : "#afb3b6ff",
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                              // borderBottom:
                              //   activeTab === "1"
                              //     ? "0.5px solid #198754"
                              //     : "none",
                              padding: "0.75rem 1rem",
                              marginRight: "1rem",
                            }}
                          >
                            <i className="ri-file-list-line me-1"></i>
                            Rapports de Rapprochement
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "2",
                              "text-success": activeTab === "2",
                            })}
                            onClick={() => setActiveTab("2")}
                            style={{
                              cursor: "pointer",
                              color: activeTab === "2" ? "#198754" : "#6c757d",
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                              // borderBottom:
                              //   activeTab === "2"
                              //     ? "0.5px solid #198754"
                              //     : "none",
                              padding: "0.75rem",
                              marginRight: "1rem",
                            }}
                          >
                            <i className="ri-history-line me-1"></i>
                            Historique des Écritures
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "3",
                              "text-success": activeTab === "3",
                            })}
                            onClick={() => setActiveTab("3")}
                            style={{
                              cursor: "pointer",
                              color: activeTab === "3" ? "#198754" : "#6c757d",
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                              // borderBottom:
                              //   activeTab === "3"
                              //     ? "0.5px solid #198754"
                              //     : "none",
                              padding: "0.75rem",
                            }}
                          >
                            <i className="ri-guide-line me-1"></i>
                            Guide de Procédure
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <TabContent activeTab={activeTab} className="p-3">
                        <TabPane tabId="1">
                          {loading ? (
                            <div
                              className="d-flex justify-content-center align-items-center my-5"
                              style={{ minHeight: "300px" }}
                            >
                              <div className="text-center">
                                <Loader />
                                <p className="mt-3 text-muted">
                                  Chargement des rapprochements...
                                </p>
                              </div>
                            </div>
                          ) : filteredData.length > 0 ? (
                            <>
                              <TableContainer
                                columns={columns}
                                data={paginatedData}
                                isGlobalFilter={false}
                                custom PageSize={itemsPerPage}
                              >
                                <Pagination
                                  data={filteredData}
                                  currentPage={currentPage}
                                  setCurrentPage={setCurrentPage}
                                  itemsPerPage={itemsPerPage}
                                  alwaysShow={true}
                                  showInfo={true}
                                />
                              </TableContainer>
                            </>
                          ) : (
                            <EmptyDataCard
                              title="Aucun rapport de rapprochement"
                              description={
                                searchTerm ||
                                  selectedBank !== "all" ||
                                  selectedStatus !== "all"
                                  ? `Aucun résultat pour vos critères de recherche.`
                                  : "Commencez par créer un nouveau rapprochement bancaire."
                              }
                              actionButton={
                                <Button
                                  color="success"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setSelectedBank("all");
                                    setSelectedStatus("all");
                                  }}
                                  className="rounded-pill"
                                >
                                  <i className="ri-refresh-line me-1"></i>
                                  Réinitialiser les filtres
                                </Button>
                              }
                              secondaryAction={
                                searchTerm && (
                                  <Button
                                    color="outline-secondary"
                                    onClick={() => setSearchTerm("")}
                                    className="rounded-pill"
                                  >
                                    <i className="ri-close-line me-1"></i>
                                    Effacer la recherche
                                  </Button>
                                )
                              }
                            />
                          )}
                        </TabPane>

                        <TabPane tabId="2">
                          <EmptyDataCard
                            title="Historique des Écritures"
                            description="Cette fonctionnalité sera bientôt disponible."
                            actionButton={
                              <Button
                                color="success"
                                className="rounded-pill"
                                disabled
                              >
                                <i className="ri-history-line me-1"></i>À venir
                              </Button>
                            }
                          />
                        </TabPane>

                        <TabPane tabId="3">
                          <Card>
                            <CardBody>
                              <h5 className="card-title mb-3">
                                <i className="ri-guide-line me-2"></i>
                                Procédure de Rapprochement Bancaire
                              </h5>

                              <div className="timeline-2">
                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-play-circle-line text-primary"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 1 : Ouvrir l'outil de rapprochement
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Cliquez sur "Nouveau rapprochement" pour
                                      démarrer le processus.
                                    </p>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-bank-line text-info"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 2 : Sélectionner le compte bancaire
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Choisissez le compte (ex: 52 - Banque) que
                                      vous souhaitez rapprocher.
                                    </p>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-file-text-line text-warning"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 3 : Saisir les informations du
                                      relevé
                                    </h6>
                                    <ul className="text-muted mb-0">
                                      <li>Solde exact du relevé bancaire</li>
                                      <li>Période du rapprochement</li>
                                      <li>Dates de début et fin</li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-refresh-line text-success"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 4 : Comparer les écritures
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Comparez les écritures avec le relevé
                                      bancaire :
                                    </p>
                                    <ul className="text-muted">
                                      <li>
                                        Cochez les écritures qui correspondent
                                      </li>
                                      <li>Ajoutez les écritures manquantes</li>
                                      <li>Vérifiez les écarts</li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-checkbox-circle-line text-success"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 5 : Finaliser le rapprochement
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Une fois que l'écart est nul (ou
                                      acceptable), validez le rapprochement.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Alert color="info" className="mt-4">
                                <h6 className="alert-heading">
                                  <i className="ri-lightbulb-line me-2"></i>
                                  Signification des termes
                                </h6>
                                <ul className="mb-0">
                                  <li>
                                    <strong>Rapprocher</strong> = faire
                                    concorder les écritures comptables avec le
                                    relevé bancaire
                                  </li>
                                  <li>
                                    <strong>Solde relevé</strong> = montant sur
                                    le relevé bancaire
                                  </li>
                                  <li>
                                    <strong>Écart</strong> = différence entre
                                    comptabilité et relevé (doit tendre vers 0)
                                  </li>
                                  <li>
                                    <strong>Omissions</strong> = opérations
                                    manquantes en compta mais présentes sur le
                                    relevé
                                  </li>
                                  <li>
                                    <strong>Éléments non rapprochés</strong> =
                                    opérations en compta pas encore appairées au
                                    relevé
                                  </li>
                                </ul>
                              </Alert>
                            </CardBody>
                          </Card>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        {/* Modal de création de rapprochement */}
        <Modal
          isOpen={reconciliationModal}
          toggle={() => setReconciliationModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setReconciliationModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            {/* <i className="ri-add-circle-line me-2"></i> */}
            Nouveau rapprochement bancaire
          </ModalHeader>

          <Form onSubmit={reconciliationFormik.handleSubmit}>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="account" className="form-label">
                      Compte Bancaire <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="account"
                      name="account"
                      value={
                        BANK_ACCOUNTS.find(
                          (account) => account.value === reconciliationFormik.values.account
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        reconciliationFormik.setFieldValue(
                          "account",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      onBlur={() => reconciliationFormik.setFieldTouched("account", true)}
                      options={BANK_ACCOUNTS}
                      placeholder="Sélectionnez un compte"
                      isClearable={false}
                      className={`w-100 ${reconciliationFormik.touched.account && reconciliationFormik.errors.account ? 'is-invalid' : ''}`}
                    />
                    {reconciliationFormik.touched.account &&
                      reconciliationFormik.errors.account && (
                        <FormFeedback>
                          {reconciliationFormik.errors.account}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="bank_balance" className="form-label">
                      Solde du Relevé Bancaire{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="bank_balance"
                      name="bank_balance"
                      type="number"
                      step="100"
                      placeholder="12500000"
                      className="rounded-pill"
                      value={reconciliationFormik.values.bank_balance}
                      onChange={reconciliationFormik.handleChange}
                      onBlur={reconciliationFormik.handleBlur}
                      invalid={
                        reconciliationFormik.touched.bank_balance &&
                        Boolean(reconciliationFormik.errors.bank_balance)
                      }
                    />
                    {reconciliationFormik.touched.bank_balance &&
                      reconciliationFormik.errors.bank_balance && (
                        <FormFeedback>
                          {reconciliationFormik.errors.bank_balance}
                        </FormFeedback>
                      )}
                    <small className="text-muted">
                      Montant EXACT figurant sur le relevé à la date de fin
                    </small>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="start_date" className="form-label">
                      Date de Début <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      className="rounded-pill"
                      value={reconciliationFormik.values.start_date}
                      onChange={reconciliationFormik.handleChange}
                      onBlur={reconciliationFormik.handleBlur}
                      invalid={
                        reconciliationFormik.touched.start_date &&
                        Boolean(reconciliationFormik.errors.start_date)
                      }
                    />
                    {reconciliationFormik.touched.start_date &&
                      reconciliationFormik.errors.start_date && (
                        <FormFeedback>
                          {reconciliationFormik.errors.start_date}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="end_date" className="form-label">
                      Date de Fin <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      className="rounded-pill"
                      value={reconciliationFormik.values.end_date}
                      onChange={reconciliationFormik.handleChange}
                      onBlur={reconciliationFormik.handleBlur}
                      invalid={
                        reconciliationFormik.touched.end_date &&
                        Boolean(reconciliationFormik.errors.end_date)
                      }
                    />
                    {reconciliationFormik.touched.end_date &&
                      reconciliationFormik.errors.end_date && (
                        <FormFeedback>
                          {reconciliationFormik.errors.end_date}
                        </FormFeedback>
                      )}
                    <small className="text-muted">
                      Généralement la période couverte par le relevé
                    </small>
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="notes" className="form-label">
                  Notes/Observations
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  type="textarea"
                  rows="3"
                  className="rounded"
                  value={reconciliationFormik.values.notes}
                  onChange={reconciliationFormik.handleChange}
                  placeholder="Notes supplémentaires sur ce rapprochement..."
                />
              </div>

              <Alert color="info" className="mt-3">
                <div className="d-flex align-items-center">
                  <i className="ri-information-line me-2"></i>
                  <div>
                    <strong>Important :</strong> Assurez-vous d'avoir le relevé
                    bancaire correspondant à la période sélectionnée.
                    <br />
                    <small>
                      Les écarts sont souvent dus aux agios, chèques non
                      encaissés, ou écritures manquantes.
                    </small>
                  </div>
                </div>
              </Alert>
            </ModalBody>

            <ModalFooter className="rounded-bottom-4">
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={() => setReconciliationModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={
                  reconciliationFormik.isSubmitting ||
                  !reconciliationFormik.isValid
                }
              >
                {reconciliationFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line me-1"></i>
                    Créer le rapprochement
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de détails du rapprochement */}
        <Modal
          isOpen={detailModal}
          toggle={() => setDetailModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setDetailModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            {/* <i className="ri-information-line me-2"></i> */}
            Détails du rapprochement
          </ModalHeader>

          <ModalBody>
            {selectedReconciliation && (
              <div>
                {/* En-tête */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Référence</h6>
                      <h4 className="fw-bold text-primary">
                        {selectedReconciliation.reference}
                      </h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Statut</h6>
                      <span
                        className={`fw-medium ${getStatusInfo(selectedReconciliation.status).color
                          }`}
                      >
                        <i
                          className={`${getStatusInfo(selectedReconciliation.status).icon
                            } me-1`}
                        ></i>
                        {getStatusInfo(selectedReconciliation.status).label}
                      </span>
                    </div>
                  </Col>
                </Row>

                {/* Informations de base */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Compte Bancaire</h6>
                      <p className="fw-medium">
                        {selectedReconciliation.account}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Période</h6>
                      <p className="fw-medium">
                        {selectedReconciliation.start_date} au{" "}
                        {selectedReconciliation.end_date}
                      </p>
                    </div>
                  </Col>
                </Row>

                {/* Solde et écart */}
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="text-center p-3 border rounded-pill bg-light">
                      <p className="text-muted mb-1">Solde Bancaire</p>
                      <h4 className="text-primary fw-bold">
                        {formatAmount(selectedReconciliation.bank_balance)}
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 border rounded-pill bg-light">
                      <p className="text-muted mb-1">Solde Comptable</p>
                      <h4 className="text-info fw-bold">
                        {formatAmount(
                          selectedReconciliation.accounting_balance
                        )}
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 border rounded-pill bg-light">
                      <p className="text-muted mb-1">Écart</p>
                      <h4
                        className={`fw-bold ${selectedReconciliation.difference > 0
                            ? "text-success"
                            : selectedReconciliation.difference < 0
                              ? "text-danger"
                              : "text-muted"
                          }`}
                      >
                        {formatAmount(selectedReconciliation.difference)}
                      </h4>
                    </div>
                  </Col>
                </Row>

                {/* Informations supplémentaires */}
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Date de validation</h6>
                      <p className="fw-medium">
                        {selectedReconciliation.completed_date || (
                          <span className="text-muted">Non validé</span>
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Validé par</h6>
                      <p className="fw-medium">
                        {selectedReconciliation.validator || (
                          <span className="text-muted">Non spécifié</span>
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="rounded-bottom-4">
            <Button
              className="btn btn-light rounded-pill"
              onClick={() => setDetailModal(false)}
            >
              Fermer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default RapprochementBancaire;
