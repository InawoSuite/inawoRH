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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { useFormik } from "formik";
import classnames from "classnames";

// Statuts des sessions de caisse
const SESSION_STATUS = {
  OPEN: 'open',
  CLOSING: 'closing',
  PENDING: 'pending',
  VALIDATED: 'validated',
  CANCELLED: 'cancelled'
};

const STATUS_OPTIONS = [
  { value: SESSION_STATUS.OPEN, label: 'Ouverte' },
  { value: SESSION_STATUS.CLOSING, label: 'En Clôture' },
  { value: SESSION_STATUS.PENDING, label: 'En Attente' },
  { value: SESSION_STATUS.VALIDATED, label: 'Validée' },
  { value: SESSION_STATUS.CANCELLED, label: 'Annulée' },
];

// Options pour les filtres
const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: SESSION_STATUS.OPEN, label: 'Ouverte' },
  { value: SESSION_STATUS.CLOSING, label: 'En Clôture' },
  { value: SESSION_STATUS.PENDING, label: 'En Attente' },
  { value: SESSION_STATUS.VALIDATED, label: 'Validée' },
  { value: SESSION_STATUS.CANCELLED, label: 'Annulée' },
];

// Données fictives pour les caissiers
const CASHIERS_DATA = [
  { value: 1, label: "Jean Dupont", email: "jean@inawo.com" },
  { value: 2, label: "Marie Curie", email: "marie@inawo.com" },
  { value: 3, label: "Pierre Martin", email: "pierre@inawo.com" },
  { value: 4, label: "Sophie Laurent", email: "sophie@inawo.com" },
  { value: 5, label: "Thomas Bernard", email: "thomas@inawo.com" },
];

// Données fictives pour les caisses physiques
const CASH_REGISTERS = [
  { value: "Caisse-01", label: "Caisse-01 (Salle principale)" },
  { value: "Caisse-02", label: "Caisse-02 (Entrepôt)" },
  { value: "Caisse-03", label: "Caisse-03 (Bureau admin)" },
  { value: "Caisse-04", label: "Caisse-04 (Point de vente)" },
];

// Options de filtrage par caisse
const CASH_REGISTER_FILTER_OPTIONS = [
  { value: "all", label: "Toutes les caisses" },
  { value: "Caisse-01", label: "Caisse-01" },
  { value: "Caisse-02", label: "Caisse-02" },
  { value: "Caisse-03", label: "Caisse-03" },
  { value: "Caisse-04", label: "Caisse-04" },
];

// Options de périodes
const PERIOD_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "this_week", label: "Cette semaine" },
  { value: "this_month", label: "Ce mois" },
  { value: "last_month", label: "Mois dernier" },
  { value: "custom", label: "Plage personnalisée" },
];

// DONNÉES FICTIVES POUR LES SESSIONS DE CAISSE
const MOCK_CASH_SESSIONS = [
  {
    id: 1,
    sessionId: "SESSION-2025-001",
    cashRegister: "Caisse-01",
    cashier: { id: 1, name: "Jean Dupont" },
    openDate: "2025-01-15 08:00:00",
    closeDate: "2025-01-15 18:00:00",
    initialBalance: 500000,
    totalReceipts: 2500000,
    totalPayments: 1500000,
    theoreticalBalance: 1500000,
    physicalBalance: 1495000,
    amountTransferred: 1400000,
    amountLeft: 95000,
    cashDifference: -5000,
    status: SESSION_STATUS.VALIDATED,
    transactions: 45,
    validator: "Admin System",
    notes: "Session normale, légère différence due à des pièces manquantes"
  },
  {
    id: 2,
    sessionId: "SESSION-2025-002",
    cashRegister: "Caisse-02",
    cashier: { id: 2, name: "Marie Curie" },
    openDate: "2025-01-15 09:00:00",
    closeDate: null,
    initialBalance: 300000,
    totalReceipts: 1800000,
    totalPayments: 1200000,
    theoreticalBalance: 900000,
    physicalBalance: null,
    amountTransferred: null,
    amountLeft: null,
    cashDifference: null,
    status: SESSION_STATUS.OPEN,
    transactions: 32
  },
  {
    id: 3,
    sessionId: "SESSION-2025-003",
    cashRegister: "Caisse-03",
    cashier: { id: 3, name: "Pierre Martin" },
    openDate: "2025-01-14 08:30:00",
    closeDate: "2025-01-14 17:30:00",
    initialBalance: 400000,
    totalReceipts: 3200000,
    totalPayments: 2800000,
    theoreticalBalance: 800000,
    physicalBalance: 805000,
    amountTransferred: 700000,
    amountLeft: 105000,
    cashDifference: 5000,
    status: SESSION_STATUS.PENDING,
    transactions: 67
  },
  {
    id: 4,
    sessionId: "SESSION-2025-004",
    cashRegister: "Caisse-01",
    cashier: { id: 4, name: "Sophie Laurent" },
    openDate: "2025-01-14 08:00:00",
    closeDate: "2025-01-14 18:00:00",
    initialBalance: 500000,
    totalReceipts: 2800000,
    totalPayments: 2000000,
    theoreticalBalance: 1300000,
    physicalBalance: 1300000,
    amountTransferred: 1200000,
    amountLeft: 100000,
    cashDifference: 0,
    status: SESSION_STATUS.VALIDATED,
    transactions: 54
  },
  {
    id: 5,
    sessionId: "SESSION-2025-005",
    cashRegister: "Caisse-02",
    cashier: { id: 5, name: "Thomas Bernard" },
    openDate: "2025-01-13 08:00:00",
    closeDate: "2025-01-13 17:00:00",
    initialBalance: 300000,
    totalReceipts: 1500000,
    totalPayments: 1000000,
    theoreticalBalance: 800000,
    physicalBalance: 790000,
    amountTransferred: 700000,
    amountLeft: 90000,
    cashDifference: -10000,
    status: SESSION_STATUS.CLOSING,
    transactions: 38
  },
  {
    id: 6,
    sessionId: "SESSION-2025-006",
    cashRegister: "Caisse-04",
    cashier: { id: 1, name: "Jean Dupont" },
    openDate: "2025-01-13 09:00:00",
    closeDate: "2025-01-13 18:30:00",
    initialBalance: 200000,
    totalReceipts: 1200000,
    totalPayments: 800000,
    theoreticalBalance: 600000,
    physicalBalance: 600000,
    amountTransferred: 500000,
    amountLeft: 100000,
    cashDifference: 0,
    status: SESSION_STATUS.VALIDATED,
    transactions: 42
  },
  {
    id: 7,
    sessionId: "SESSION-2025-007",
    cashRegister: "Caisse-03",
    cashier: { id: 2, name: "Marie Curie" },
    openDate: "2025-01-12 08:00:00",
    closeDate: null,
    initialBalance: 400000,
    totalReceipts: 2000000,
    totalPayments: 1500000,
    theoreticalBalance: 900000,
    physicalBalance: null,
    amountTransferred: null,
    amountLeft: null,
    cashDifference: null,
    status: SESSION_STATUS.OPEN,
    transactions: 29
  },
  {
    id: 8,
    sessionId: "SESSION-2025-008",
    cashRegister: "Caisse-01",
    cashier: { id: 3, name: "Pierre Martin" },
    openDate: "2025-01-12 08:30:00",
    closeDate: "2025-01-12 17:00:00",
    initialBalance: 500000,
    totalReceipts: 2200000,
    totalPayments: 1800000,
    theoreticalBalance: 900000,
    physicalBalance: 890000,
    amountTransferred: 800000,
    amountLeft: 90000,
    cashDifference: -10000,
    status: SESSION_STATUS.CANCELLED,
    transactions: 47
  },
];

const Caisse = () => {
  const { t } = useTranslation();
  
  // États principaux
  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  
  // États pour les filtres
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCashRegister, setFilterCashRegister] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("this_month");
  const [filterCashier, setFilterCashier] = useState("all");

  // États des modals
  const [sessionModal, setSessionModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const itemsPerPage = 10;

  // ✅ Fonction pour formater les montants
  const formatAmount = useCallback((amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // ✅ Fonction pour obtenir les infos du statut
  const getStatusInfo = useCallback((status) => {
    const statusColors = {
      [SESSION_STATUS.OPEN]: {
        label: "Ouverte",
        color: "text-success",
        icon: "ri-checkbox-blank-circle-fill",
        bgColor: "bg-success-subtle"
      },
      [SESSION_STATUS.CLOSING]: {
        label: "En Clôture",
        color: "text-warning",
        icon: "ri-refresh-line",
        bgColor: "bg-warning-subtle"
      },
      [SESSION_STATUS.PENDING]: {
        label: "En Attente",
        color: "text-info",
        icon: "ri-alert-line",
        bgColor: "bg-info-subtle"
      },
      [SESSION_STATUS.VALIDATED]: {
        label: "Validée",
        color: "text-primary",
        icon: "ri-checkbox-circle-line",
        bgColor: "bg-primary-subtle"
      },
      [SESSION_STATUS.CANCELLED]: {
        label: "Annulée",
        color: "text-danger",
        icon: "ri-close-circle-line",
        bgColor: "bg-danger-subtle"
      },
    };
    return statusColors[status] || {
      label: "Inconnu",
      color: "text-secondary",
      icon: "ri-question-line",
      bgColor: "bg-secondary-subtle"
    };
  }, []);

  // ✅ Filtrage optimisé des sessions
  const filteredData = useMemo(() => {
    let filtered = sessionsData;

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((session) =>
        session.sessionId.toLowerCase().includes(lowerSearchTerm) ||
        session.cashRegister.toLowerCase().includes(lowerSearchTerm) ||
        session.cashier.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter(session => session.status === filterStatus);
    }

    // Filtre par caisse
    if (filterCashRegister !== "all") {
      filtered = filtered.filter(session => session.cashRegister === filterCashRegister);
    }

    // Filtre par caissier
    if (filterCashier !== "all") {
      filtered = filtered.filter(session => session.cashier.id.toString() === filterCashier);
    }

    return filtered;
  }, [sessionsData, searchTerm, filterStatus, filterCashRegister, filterCashier]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Fonction pour récupérer les données
  const fetchData = useCallback(async () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        setSessionsData(MOCK_CASH_SESSIONS);
        
        // Préparer les données pour l'export
        const exportDataFormatted = MOCK_CASH_SESSIONS.map((item) => ({
          "ID Session": item.sessionId,
          "Caisse": item.cashRegister,
          "Caissier": item.cashier.name,
          "Date Ouverture": item.openDate,
          "Date Fermeture": item.closeDate || "-",
          "Solde Initial": formatAmount(item.initialBalance),
          "Total Encaissements": formatAmount(item.totalReceipts),
          "Total Décaissements": formatAmount(item.totalPayments),
          "Solde Théorique": formatAmount(item.theoreticalBalance),
          "Solde Physique": formatAmount(item.physicalBalance),
          "Écart": formatAmount(item.cashDifference),
          "Statut": getStatusInfo(item.status).label,
          "Transactions": item.transactions,
        }));
        setExportData(exportDataFormatted);
        
        toast.success("Données chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchData:", err);
        toast.error("Erreur lors du chargement des données");
        setSessionsData([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [formatAmount, getStatusInfo]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Gestion de Caisse | INAWO - Suite de Gestion";
    fetchData();
  }, [fetchData]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCashRegister, filterCashier]);

  // ✅ Validation du formulaire de session
  const sessionValidationSchema = Yup.object({
    cashRegister: Yup.string().required("La caisse est requise"),
    cashier: Yup.string().required("Le caissier est requis"),
    initialBalance: Yup.number()
      .required("Le solde initial est requis")
      .min(0, "Le solde initial ne peut pas être négatif")
      .typeError("Veuillez entrer un montant valide"),
  });

  // ✅ Formik pour le formulaire de session
  const sessionFormik = useFormik({
    initialValues: {
      cashRegister: "",
      cashier: "",
      initialBalance: "",
      notes: "",
    },
    validationSchema: sessionValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleCreateSession(values, resetForm, setSubmitting);
    },
  });

  // ✅ Créer une nouvelle session
  const handleCreateSession = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        const cashierInfo = CASHIERS_DATA.find(c => c.value.toString() === values.cashier);
        const cashRegisterInfo = CASH_REGISTERS.find(c => c.value === values.cashRegister);
        
        const newSession = {
          id: sessionsData.length + 1,
          sessionId: `SESSION-${new Date().getFullYear()}-${String(sessionsData.length + 1).padStart(3, "0")}`,
          cashRegister: cashRegisterInfo?.value || values.cashRegister,
          cashier: { 
            id: parseInt(values.cashier), 
            name: cashierInfo?.label || "Caissier Inconnu" 
          },
          openDate: new Date().toISOString(),
          closeDate: null,
          initialBalance: parseFloat(values.initialBalance),
          totalReceipts: 0,
          totalPayments: 0,
          theoreticalBalance: parseFloat(values.initialBalance),
          physicalBalance: null,
          amountTransferred: null,
          amountLeft: null,
          cashDifference: null,
          status: SESSION_STATUS.OPEN,
          transactions: 0,
          notes: values.notes,
        };
        
        setSessionsData(prev => [newSession, ...prev]);
        toast.success("Session de caisse créée avec succès !");
        resetForm();
        setSessionModal(false);
      } catch (err) {
        console.error("Erreur lors de la création de la session:", err);
        toast.error("Erreur lors de la création de la session");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction pour clôturer une session
  const handleCloseSession = useCallback((session, physicalBalance, transferred, left) => {
    const theoreticalBalance = session.initialBalance + session.totalReceipts - session.totalPayments;
    const difference = theoreticalBalance - physicalBalance;
    
    const updatedSession = {
      ...session,
      closeDate: new Date().toISOString(),
      physicalBalance,
      amountTransferred: transferred,
      amountLeft: left,
      cashDifference: difference,
      status: Math.abs(difference) <= 1000 ? SESSION_STATUS.VALIDATED : SESSION_STATUS.PENDING,
    };
    
    setSessionsData(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    toast.success(`Session clôturée avec ${difference === 0 ? "succès" : "écart"}`);
    setCloseModal(false);
  }, []);

  // ✅ Fonction de suppression
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;
    
    setTimeout(() => {
      try {
        const updatedData = sessionsData.filter((item) => item.id !== itemToDelete.id);
        setSessionsData(updatedData);
        toast.success("Session supprimée avec succès !");
        
        setDeleteModal(false);
        setItemToDelete(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleOpenSessionModal = useCallback(() => {
    sessionFormik.resetForm();
    sessionFormik.setValues({
      cashRegister: "",
      cashier: "",
      initialBalance: "",
      notes: "",
    });
    setSessionModal(true);
  }, [sessionFormik]);

  const handleOpenDetailModal = useCallback((session) => {
    setSelectedSession(session);
    setDetailModal(true);
  }, []);

  const handleOpenCloseModal = useCallback((session) => {
    setSelectedSession(session);
    setCloseModal(true);
  }, []);

  const handleOpenDeleteModal = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  }, []);

  // ✅ Colonnes pour le tableau des sessions de caisse
  const columns = useMemo(() => [
    {
      header: "N°",
      accessorKey: "id",
      enableColumnFilter: false,
      cell: (cell) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + cell.row.index + 1;
        return <span className="fw-medium">{globalIndex}</span>;
      },
      size: 60,
    },
    {
      header: "ID Session",
      accessorKey: "sessionId",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-semibold text-primary">{cell.getValue()}</span>
      ),
      size: 120,
    },
    {
      header: "Caisse",
      accessorKey: "cashRegister",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-medium">{cell.getValue()}</span>
      ),
      size: 100,
    },
    {
      header: "Caissier",
      accessorKey: "cashier.name",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <span className="fw-medium">{row.original.cashier.name}</span>
      ),
      size: 120,
    },
    {
      header: "Ouverture",
      accessorKey: "openDate",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="text-muted">
          {new Date(cell.getValue()).toLocaleDateString('fr-FR')}
        </span>
      ),
      size: 100,
    },
    {
      header: "Solde Initial",
      accessorKey: "initialBalance",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-medium">{formatAmount(cell.getValue())} </span>
      ),
      size: 120,
    },
    {
      header: "Encaissements",
      accessorKey: "totalReceipts",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="text-success fw-bold">{formatAmount(cell.getValue())} </span>
      ),
      size: 120,
    },
    {
      header: "Solde Théorique",
      accessorKey: "theoreticalBalance",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const session = row.original;
        const theoretical = session.initialBalance + session.totalReceipts - session.totalPayments;
        return (
          <span className="fw-bold">{formatAmount(theoretical)} </span>
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
          <Badge className={`${statusInfo.bgColor} ${statusInfo.color} fw-medium`}>
            <i className={`${statusInfo.icon} me-1`}></i>
            {statusInfo.label}
          </Badge>
        );
      },
      size: 100,
    },
    {
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="d-flex gap-2">
            <Link
              to="#"
              className="text-info"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDetailModal(session);
              }}
              title="Voir détails"
            >
              {/* <i className="ri-eye-fill fs-16"></i> */}
            </Link>
            
            {session.status === SESSION_STATUS.OPEN && (
              <Link
                to="#"
                className="text-warning"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenCloseModal(session);
                }}
                title="Clôturer"
              >
                <i className="ri-lock-2-fill fs-16"></i>
              </Link>
            )}
            
            {session.status !== SESSION_STATUS.VALIDATED && (
              <Link
                to="#"
                className="text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDeleteModal(session);
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
  ], [currentPage, itemsPerPage, formatAmount, getStatusInfo, handleOpenDetailModal, handleOpenCloseModal, handleOpenDeleteModal]);

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
            filename="Sessions_Caisse"
          />

          {/* Delete Modal */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteItem}
            onCloseClick={() => {
              setDeleteModal(false);
              setItemToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cette session de caisse ? Cette action est irréversible."
          />

          <BreadCrumb
            title="Gestion de Caisse"
            pageTitle={
              <>
                <i className="ri-cash-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher une session..."
                showSearch={true}
                onAddClick={handleOpenSessionModal}
                addButtonText="Nouvelle session"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} session{filteredData.length !== 1 ? 's' : ''} trouvée{filteredData.length !== 1 ? 's' : ''}
                  </div>
                }
              />

              <Row className="mb-3">
                <Col lg={12}>
                  <div className="d-flex align-items-center gap-3 flex-wrap rounded-pill"
                    style={{ background: "white", padding: "1%" }}>
                    
                    {/* Filtre par période */}
                    <div>
                      <CustomSelect
                        value={PERIOD_OPTIONS.find(opt => opt.value === filterPeriod) || null}
                        onChange={(selectedOption) => {
                          setFilterPeriod(selectedOption ? selectedOption.value : "this_month");
                        }}
                        options={PERIOD_OPTIONS}
                        placeholder="Période"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    
                    {/* Filtre par statut */}
                    <div>
                      <CustomSelect
                        value={STATUS_FILTER_OPTIONS.find(opt => opt.value === filterStatus) || null}
                        onChange={(selectedOption) => {
                          setFilterStatus(selectedOption ? selectedOption.value : "all");
                        }}
                        options={STATUS_FILTER_OPTIONS}
                        placeholder="Statut"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    
                    {/* Filtre par caisse */}
                    <div>
                      <CustomSelect
                        value={CASH_REGISTER_FILTER_OPTIONS.find(opt => opt.value === filterCashRegister) || null}
                        onChange={(selectedOption) => {
                          setFilterCashRegister(selectedOption ? selectedOption.value : "all");
                        }}
                        options={CASH_REGISTER_FILTER_OPTIONS}
                        placeholder="Caisse"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    
                    {/* Filtre par caissier */}
                    <div>
                      <CustomSelect
                        value={CASHIERS_DATA.find(opt => opt.value.toString() === filterCashier) || null}
                        onChange={(selectedOption) => {
                          setFilterCashier(selectedOption ? selectedOption.value.toString() : "all");
                        }}
                        options={[
                          { value: "all", label: "Tous les caissiers" },
                          ...CASHIERS_DATA
                        ]}
                        placeholder="Caissier"
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
                              color: activeTab === "1" ? "#198754" : "#afb3b6ff",
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                              padding: "0.75rem 1rem",
                              marginRight: "1rem",
                            }}
                          >
                            <i className="ri-file-list-line me-1"></i>
                            Sessions de Caisse
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
                              padding: "0.75rem",
                              marginRight: "1rem",
                            }}
                          >
                            <i className="ri-history-line me-1"></i>
                            Historique des Transactions
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
                            <div className="d-flex justify-content-center align-items-center my-5"
                              style={{ minHeight: "300px" }}>
                              <div className="text-center">
                                <Loader />
                                <p className="mt-3 text-muted">
                                  Chargement des sessions de caisse...
                                </p>
                              </div>
                            </div>
                          ) : filteredData.length > 0 ? (
                            <>
                              <TableContainer
                                columns={columns}
                                data={paginatedData}
                                isGlobalFilter={false}
                                customPageSize={itemsPerPage}
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
                              title="Aucune session de caisse"
                              description={
                                searchTerm ||
                                filterStatus !== "all" ||
                                filterCashRegister !== "all" ||
                                filterCashier !== "all"
                                  ? "Aucun résultat pour vos critères de recherche."
                                  : "Commencez par créer une nouvelle session de caisse."
                              }
                              actionButton={
                                <Button
                                  color="success"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setFilterStatus("all");
                                    setFilterCashRegister("all");
                                    setFilterCashier("all");
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
                            title="Historique des Transactions"
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
                                Procédure de Gestion de Caisse
                              </h5>

                              <div className="timeline-2">
                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-play-circle-line text-primary"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 1 : Ouvrir une session de caisse
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Cliquez sur "Nouvelle session" pour démarrer le processus.
                                    </p>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-user-line text-info"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 2 : Sélectionner le caissier
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Choisissez le caissier responsable de la session.
                                    </p>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-cash-line text-warning"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 3 : Saisir le solde initial
                                    </h6>
                                    <ul className="text-muted mb-0">
                                      <li>Comptez le fond de caisse physique</li>
                                      <li>Saisissez le montant exact</li>
                                      <li>Vérifiez avec le caissier précédent</li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-exchange-line text-success"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 4 : Effectuer les transactions
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Le caissier peut maintenant effectuer les opérations :
                                    </p>
                                    <ul className="text-muted">
                                      <li>Encaissements (ventes, recouvrements)</li>
                                      <li>Décaissements (dépenses, remboursements)</li>
                                      <li>Gestion du fond de caisse</li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-lock-2-line text-success"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 5 : Clôturer la session
                                    </h6>
                                    <p className="text-muted mb-0">
                                      À la fin de la journée, comptez le solde physique et clôturez la session.
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
                                    <strong>Fond de caisse</strong> = montant initial laissé dans la caisse
                                  </li>
                                  <li>
                                    <strong>Solde théorique</strong> = calcul automatique (initial + encaissements - décaissements)
                                  </li>
                                  <li>
                                    <strong>Écart de caisse</strong> = différence entre solde théorique et solde physique compté
                                  </li>
                                  <li>
                                    <strong>Montant remis</strong> = espèces déposées à la banque ou au trésor
                                  </li>
                                  <li>
                                    <strong>Montant laissé</strong> = fond de caisse pour le caissier suivant
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

        {/* Modal de création de session */}
        <Modal
          isOpen={sessionModal}
          toggle={() => setSessionModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setSessionModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            {/* <i className="ri-add-circle-line me-2"></i> */}
            Nouvelle session de caisse
          </ModalHeader>

          <Form onSubmit={sessionFormik.handleSubmit}>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="cashRegister" className="form-label">
                      Caisse Physique <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="cashRegister"
                      name="cashRegister"
                      value={CASH_REGISTERS.find(account => account.value === sessionFormik.values.cashRegister) || null}
                      onChange={(selectedOption) => {
                        sessionFormik.setFieldValue(
                          "cashRegister",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      onBlur={() => sessionFormik.setFieldTouched("cashRegister", true)}
                      options={CASH_REGISTERS}
                      placeholder="Sélectionnez une caisse"
                      isClearable={false}
                      className={`w-100 ${sessionFormik.touched.cashRegister && sessionFormik.errors.cashRegister ? 'is-invalid' : ''}`}
                    />
                    {sessionFormik.touched.cashRegister &&
                      sessionFormik.errors.cashRegister && (
                        <div className="invalid-feedback d-block">
                          {sessionFormik.errors.cashRegister}
                        </div>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="cashier" className="form-label">
                      Caissier <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="cashier"
                      name="cashier"
                      value={CASHIERS_DATA.find(cashier => cashier.value.toString() === sessionFormik.values.cashier) || null}
                      onChange={(selectedOption) => {
                        sessionFormik.setFieldValue(
                          "cashier",
                          selectedOption ? selectedOption.value.toString() : ""
                        );
                      }}
                      onBlur={() => sessionFormik.setFieldTouched("cashier", true)}
                      options={CASHIERS_DATA}
                      placeholder="Sélectionnez un caissier"
                      isClearable={false}
                      className={`w-100 ${sessionFormik.touched.cashier && sessionFormik.errors.cashier ? 'is-invalid' : ''}`}
                    />
                    {sessionFormik.touched.cashier &&
                      sessionFormik.errors.cashier && (
                        <div className="invalid-feedback d-block">
                          {sessionFormik.errors.cashier}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="initialBalance" className="form-label">
                      Solde Initial (Fond de caisse) <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="initialBalance"
                      name="initialBalance"
                      type="number"
                      step="100"
                      placeholder="500000"
                      className="rounded-pill"
                      value={sessionFormik.values.initialBalance}
                      onChange={sessionFormik.handleChange}
                      onBlur={sessionFormik.handleBlur}
                      invalid={
                        sessionFormik.touched.initialBalance &&
                        Boolean(sessionFormik.errors.initialBalance)
                      }
                    />
                    {sessionFormik.touched.initialBalance &&
                      sessionFormik.errors.initialBalance && (
                        <FormFeedback>
                          {sessionFormik.errors.initialBalance}
                        </FormFeedback>
                      )}
                    <small className="text-muted">
                      Montant EXACT du fond de caisse compté physiquement
                    </small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label className="form-label">
                      Date/Heure d'Ouverture
                    </Label>
                    <Input
                      type="text"
                      className="rounded-pill bg-light"
                      value={new Date().toLocaleString('fr-FR')}
                      disabled
                    />
                    <small className="text-muted">
                      La date et heure actuelles seront enregistrées
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
                  className="rounded-4"
                  value={sessionFormik.values.notes}
                  onChange={sessionFormik.handleChange}
                  placeholder="Notes supplémentaires sur cette session..."
                />
              </div>

              <Alert color="info" className="mt-3">
                <div className="d-flex align-items-center rounded-4">
                  <i className="ri-information-line me-2"></i>
                  <div>
                    <strong>Important :</strong> Vérifiez que la caisse sélectionnée n'est pas déjà ouverte.
                    <br />
                    <small>
                      Le solde initial correspond au fond de caisse laissé par le caissier précédent.
                    </small>
                  </div>
                </div>
              </Alert>
            </ModalBody>

            <ModalFooter className="rounded-bottom-4">
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={() => setSessionModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={
                  sessionFormik.isSubmitting ||
                  !sessionFormik.isValid
                }
              >
                {sessionFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line me-1"></i>
                    Ouvrir la session
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de détails de session */}
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
            Détails de la session
          </ModalHeader>

          <ModalBody>
            {selectedSession && (
              <div>
                {/* En-tête */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">ID Session</h6>
                      <h4 className="fw-bold text-primary">
                        {selectedSession.sessionId}
                      </h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Statut</h6>
                      <span className={`fw-medium ${getStatusInfo(selectedSession.status).color}`}>
                        <i className={`${getStatusInfo(selectedSession.status).icon} me-1`}></i>
                        {getStatusInfo(selectedSession.status).label}
                      </span>
                    </div>
                  </Col>
                </Row>

                {/* Informations de base */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Caisse Physique</h6>
                      <p className="fw-medium">
                        {selectedSession.cashRegister}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Caissier</h6>
                      <p className="fw-medium">
                        {selectedSession.cashier.name}
                      </p>
                    </div>
                  </Col>
                </Row>

                {/* Dates */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Ouverture</h6>
                      <p className="fw-medium">
                        {new Date(selectedSession.openDate).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Fermeture</h6>
                      <p className="fw-medium">
                        {selectedSession.closeDate 
                          ? new Date(selectedSession.closeDate).toLocaleString('fr-FR')
                          : <span className="text-muted">Session en cours</span>
                        }
                      </p>
                    </div>
                  </Col>
                </Row>

                {/* Soldes */}
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="text-center p-3 border rounded bg-light">
                      <p className="text-muted mb-1">Solde Initial</p>
                      <h4 className="text-primary fw-bold">
                        {formatAmount(selectedSession.initialBalance)} 
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 border rounded bg-light">
                      <p className="text-muted mb-1">Total Encaissements</p>
                      <h4 className="text-success fw-bold">
                        {formatAmount(selectedSession.totalReceipts)} 
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 border rounded bg-light">
                      <p className="text-muted mb-1">Solde Théorique</p>
                      <h4 className="text-info fw-bold">
                        {formatAmount(selectedSession.theoreticalBalance)} 
                      </h4>
                    </div>
                  </Col>
                </Row>

                {/* Clôture */}
                {selectedSession.closeDate && (
                  <Row className="mb-4">
                    <Col md={4}>
                      <div className="text-center p-3 border rounded bg-light">
                        <p className="text-muted mb-1">Solde Physique</p>
                        <h4 className="fw-bold">
                          {formatAmount(selectedSession.physicalBalance)} 
                        </h4>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center p-3 border rounded bg-light">
                        <p className="text-muted mb-1">Montant Remis</p>
                        <h4 className="text-warning fw-bold">
                          {formatAmount(selectedSession.amountTransferred)} 
                        </h4>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center p-3 border rounded bg-light">
                        <p className="text-muted mb-1">Écart de Caisse</p>
                        <h4 className={`fw-bold ${getDifferenceColor(selectedSession.cashDifference)}`}>
                          {formatAmount(selectedSession.cashDifference)} 
                        </h4>
                      </div>
                    </Col>
                  </Row>
                )}

                {/* Transactions */}
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Nombre de transactions</h6>
                      <p className="fw-medium">
                        {selectedSession.transactions} opérations
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

        {/* Modal de clôture de session */}
        <Modal
          isOpen={closeModal}
          toggle={() => setCloseModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setCloseModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-lock-2-line me-2"></i>
            Clôturer la session
          </ModalHeader>

          <ModalBody>
            {selectedSession && (
              <div>
                <Alert color="warning" className="mb-4">
                  <div className="d-flex align-items-center">
                    <i className="ri-alert-line me-2"></i>
                    <div>
                      <strong>Attention :</strong> Cette action est irréversible. 
                      Veuillez compter soigneusement le solde physique avant de continuer.
                    </div>
                  </div>
                </Alert>

                <Row className="mb-3">
                  <Col md={12}>
                    <div className="mb-3">
                      <h6 className="mb-3">Session à clôturer</h6>
                      <div className="p-3 border rounded bg-light">
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">{selectedSession.sessionId}</span>
                          <span className="fw-medium">{selectedSession.cashRegister}</span>
                          <span className="fw-medium">{selectedSession.cashier.name}</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">
                        Solde Théorique Calculé
                      </Label>
                      <Input
                        type="text"
                        className="rounded-pill bg-light fw-bold"
                        value={`${formatAmount(selectedSession.theoreticalBalance)} `}
                        disabled
                      />
                      <small className="text-muted">
                        Calcul automatique : Initial + Encaissements - Décaissements
                      </small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">
                        Solde Physique Compté <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="rounded-pill"
                        placeholder="Saisir le montant compté"
                      />
                      <small className="text-muted">
                        Montant réel d'argent liquide dans la caisse
                      </small>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">
                        Montant Remis <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="rounded-pill"
                        placeholder="Montant déposé"
                      />
                      <small className="text-muted">
                        Espèces transférées au trésor ou déposées à la banque
                      </small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">
                        Montant Laissé <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="rounded-pill"
                        placeholder="Fond pour le prochain caissier"
                      />
                      <small className="text-muted">
                        Nouveau fond de caisse pour la session suivante
                      </small>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="rounded-bottom-4">
            <Button
              type="button"
              className="btn btn-light rounded-pill"
              onClick={() => setCloseModal(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              className="btn btn-success rounded-pill"
              onClick={() => {
                // Ici, vous devriez récupérer les valeurs des inputs
                const physicalBalance = 1500000; // Exemple
                const transferred = 1400000; // Exemple
                const left = 100000; // Exemple
                handleCloseSession(selectedSession, physicalBalance, transferred, left);
              }}
            >
              <i className="ri-lock-2-line me-1"></i>
              Clôturer la session
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

// Fonction pour obtenir la couleur de l'écart
const getDifferenceColor = (difference) => {
  if (difference === null || difference === undefined) return 'text-secondary';
  if (difference > 0) return 'text-success'; // Excédent
  if (difference < 0) return 'text-danger'; // Déficit
  return 'text-primary'; // Équilibre
};

export default Caisse;