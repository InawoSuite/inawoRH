import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../Components/Common/Loader";
import EmptyDataCard from "../../Components/Common/EmptyDataCard";
import DeleteModal from "../../Components/Common/DeleteModal";
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

// Statuts des sessions de caisse
const SESSION_STATUS = {
  OPEN: 'open',
  CLOSING: 'closing',
  PENDING: 'pending',
  VALIDATED: 'validated',
  CANCELLED: 'cancelled'
};

const STATUS_OPTIONS = [
  { value: SESSION_STATUS.OPEN, label: 'Ouverte', color: 'success' },
  { value: SESSION_STATUS.CLOSING, label: 'En Clôture', color: 'warning' },
  { value: SESSION_STATUS.PENDING, label: 'En Attente', color: 'info' },
  { value: SESSION_STATUS.VALIDATED, label: 'Validée', color: 'primary' },
  { value: SESSION_STATUS.CANCELLED, label: 'Annulée', color: 'danger' },
];

// Données fictives pour les caissiers
const CASHIERS_DATA = [
  { id: 1, name: "Jean Dupont", email: "jean@inawo.com" },
  { id: 2, name: "Marie Curie", email: "marie@inawo.com" },
  { id: 3, name: "Pierre Martin", email: "pierre@inawo.com" },
  { id: 4, name: "Sophie Laurent", email: "sophie@inawo.com" },
  { id: 5, name: "Thomas Bernard", email: "thomas@inawo.com" },
];

// Données fictives pour les caisses physiques
const CASH_REGISTERS = [
  { id: 1, name: "Caisse-01", location: "Salle principale" },
  { id: 2, name: "Caisse-02", location: "Entrepôt" },
  { id: 3, name: "Caisse-03", location: "Bureau admin" },
  { id: 4, name: "Caisse-04", location: "Point de vente" },
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
    transactions: 45
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  
  // États des modals
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // États pour les filtres
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCashRegister, setFilterCashRegister] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");

  const itemsPerPage = 10;

  // ✅ Fonction pour formater les montants
  const formatAmount = useCallback((amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + " ";
  }, []);

  // ✅ Fonction pour formater les dates
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // ✅ Fonction pour formater les dates avec heure
  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // ✅ Fonction pour obtenir les infos du statut
  const getStatusInfo = useCallback((status) => {
    const statusInfo = STATUS_OPTIONS.find(s => s.value === status);
    return statusInfo || { label: 'Inconnu', color: 'secondary' };
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

    // Filtre par date
    if (filterDateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (filterDateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          filtered = filtered.filter(session => {
            const sessionDate = new Date(session.openDate);
            return sessionDate >= startDate && sessionDate <= endDate;
          });
          return filtered;
        case "thisWeek":
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case "thisMonth":
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
      }

      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.openDate);
        return sessionDate >= startDate;
      });
    }

    return filtered;
  }, [sessionsData, searchTerm, filterStatus, filterCashRegister, filterDateRange]);

  // ✅ Pagination optimisée
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Fonction pour récupérer les sessions (MOCK)
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const data = MOCK_CASH_SESSIONS;
        setSessionsData(data);
        
        // Préparer les données pour l'export
        const exportDataFormatted = data.map(session => ({
          "ID Session": session.sessionId,
          "Caisse": session.cashRegister,
          "Caissier": session.cashier.name,
          "Date Ouverture": formatDateTime(session.openDate),
          "Date Fermeture": formatDateTime(session.closeDate),
          "Solde Initial": formatAmount(session.initialBalance),
          "Total Encaissements": formatAmount(session.totalReceipts),
          "Total Décaissements": formatAmount(session.totalPayments),
          "Solde Final Théorique": formatAmount(session.theoreticalBalance),
          "Solde Final Physique": formatAmount(session.physicalBalance),
          "Écart": formatAmount(session.cashDifference),
          "Statut": getStatusInfo(session.status).label,
        }));
        setExportData(exportDataFormatted);
        
        toast.success("Sessions de caisse chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchSessions:", err);
        toast.error("Erreur lors du chargement des données");
        setSessionsData([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [formatAmount, formatDateTime, getStatusInfo]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Gestion de Caisse | INAWO - Suite de Gestion";
    fetchSessions();
  }, [fetchSessions]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCashRegister, filterDateRange]);

  // ✅ Validation du formulaire de création
  const createValidationSchema = Yup.object({
    cashRegister: Yup.string()
      .required("La caisse physique est requise"),
    cashier: Yup.string()
      .required("Le caissier est requis"),
    initialBalance: Yup.number()
      .required("Le solde initial est requis")
      .min(0, "Le solde initial ne peut pas être négatif"),
  });

  // ✅ Formik pour la gestion du formulaire de création
  const formik = useFormik({
    initialValues: {
      cashRegister: '',
      cashier: '',
      initialBalance: '',
    },
    validationSchema: createValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitSession(values, resetForm, setSubmitting);
    }
  });

  // ✅ Formik pour la clôture de session
  const closingFormik = useFormik({
    initialValues: {
      physicalBalance: '',
      amountTransferred: '',
      amountLeft: '',
      notes: '',
    },
    validationSchema: Yup.object({
      physicalBalance: Yup.number()
        .required("Le solde physique est requis")
        .min(0, "Le solde physique ne peut pas être négatif"),
      amountTransferred: Yup.number()
        .min(0, "Le montant remis ne peut pas être négatif"),
      amountLeft: Yup.number()
        .min(0, "Le montant laissé ne peut pas être négatif"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleCloseSession(values, resetForm, setSubmitting);
    }
  });

  // ✅ Fonction pour calculer l'écart
  const calculateDifference = useCallback((theoretical, physical) => {
    if (theoretical === null || physical === null) return null;
    return physical - theoretical;
  }, []);

  // ✅ Fonction pour obtenir la couleur de l'écart
  const getDifferenceColor = useCallback((difference) => {
    if (difference === null || difference === undefined) return 'secondary';
    if (difference > 0) return 'success'; // Excédent
    if (difference < 0) return 'danger'; // Déficit
    return 'primary'; // Équilibre
  }, []);

  // ✅ Fonction de soumission de création (MOCK)
  const handleSubmitSession = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        // Vérifier si la caisse est déjà ouverte
        const isCashRegisterOpen = sessionsData.some(
          session => session.cashRegister === values.cashRegister && 
          (session.status === SESSION_STATUS.OPEN || session.status === SESSION_STATUS.CLOSING)
        );

        if (isCashRegisterOpen) {
          toast.error("Cette caisse est déjà ouverte par un autre caissier");
          setSubmitting(false);
          return;
        }

        const selectedCashier = CASHIERS_DATA.find(c => c.id === parseInt(values.cashier));
        const newSession = {
          id: sessionsData.length + 1,
          sessionId: `SESSION-2025-${String(sessionsData.length + 1).padStart(3, '0')}`,
          cashRegister: values.cashRegister,
          cashier: selectedCashier ? { id: selectedCashier.id, name: selectedCashier.name } : { id: 0, name: 'Inconnu' },
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
          transactions: 0
        };

        setSessionsData(prev => [newSession, ...prev]);
        toast.success("Session ouverte avec succès !");
        resetForm();
        handleModalClose();
        
      } catch (err) {
        console.error("Erreur lors de l'ouverture de session:", err);
        toast.error("Erreur lors de l'ouverture de la session");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de clôture de session (MOCK)
  const handleCloseSession = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        if (!selectedSession) {
          toast.error("Aucune session sélectionnée");
          return;
        }

        const physicalBalance = parseFloat(values.physicalBalance);
        const theoreticalBalance = selectedSession.theoreticalBalance;
        const difference = calculateDifference(theoreticalBalance, physicalBalance);

        const updatedSessions = sessionsData.map(session => {
          if (session.id === selectedSession.id) {
            return {
              ...session,
              closeDate: new Date().toISOString(),
              physicalBalance: physicalBalance,
              amountTransferred: parseFloat(values.amountTransferred) || 0,
              amountLeft: parseFloat(values.amountLeft) || 0,
              cashDifference: difference,
              status: difference === 0 ? SESSION_STATUS.VALIDATED : SESSION_STATUS.PENDING,
              notes: values.notes
            };
          }
          return session;
        });

        setSessionsData(updatedSessions);
        toast.success("Session clôturée avec succès !");
        resetForm();
        setClosingModal(false);
        setSelectedSession(null);
        
      } catch (err) {
        console.error("Erreur lors de la clôture de session:", err);
        toast.error("Erreur lors de la clôture de la session");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de suppression (MOCK)
  const handleDeleteSession = async () => {
    if (!sessionToDelete?.id) return;

    setTimeout(() => {
      try {
        const updatedData = sessionsData.filter(session => session.id !== sessionToDelete.id);
        setSessionsData(updatedData);
        toast.success("Session supprimée avec succès !");
        setDeleteModal(false);
        setSessionToDelete(null);
        
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression de la session");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleModalClose = useCallback(() => {
    setModal(false);
    setIsEdit(false);
    setCurrentSession(null);
    formik.resetForm();
  }, [formik]);

  const handleDetailModalClose = useCallback(() => {
    setDetailModal(false);
    setSelectedSession(null);
  }, []);

  const handleOpenDetailModal = useCallback((session) => {
    setSelectedSession(session);
    setDetailModal(true);
  }, []);

  const handleOpenClosingModal = useCallback((session) => {
    if (!session?.id) {
      toast.error("Session invalide");
      return;
    }

    setSelectedSession(session);
    
    // Pré-remplir avec le solde théorique
    closingFormik.setValues({
      physicalBalance: session.theoreticalBalance || '',
      amountTransferred: '',
      amountLeft: '',
      notes: ''
    });
    
    setClosingModal(true);
  }, [closingFormik]);

  const handleOpenAddModal = useCallback(() => {
    setCurrentSession(null);
    setIsEdit(false);
    formik.resetForm();
    setModal(true);
  }, [formik]);

  const handleOpenDeleteModal = useCallback((session) => {
    setSessionToDelete(session);
    setDeleteModal(true);
  }, []);

  // ✅ Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilterStatus("all");
    setFilterCashRegister("all");
    setFilterDateRange("all");
    setSearchTerm("");
  }, []);

  // ✅ Calcul des totaux pour les sessions filtrées
  const calculateTotals = useMemo(() => {
    const totals = {
      initialBalance: 0,
      totalReceipts: 0,
      totalPayments: 0,
      theoreticalBalance: 0,
      cashDifference: 0,
      openSessions: 0
    };

    filteredData.forEach(session => {
      totals.initialBalance += session.initialBalance || 0;
      totals.totalReceipts += session.totalReceipts || 0;
      totals.totalPayments += session.totalPayments || 0;
      totals.theoreticalBalance += session.theoreticalBalance || 0;
      totals.cashDifference += session.cashDifference || 0;
      if (session.status === SESSION_STATUS.OPEN) {
        totals.openSessions++;
      }
    });

    return totals;
  }, [filteredData]);

  // ✅ Colonnes pour le tableau des sessions de caisse (avec style gris comme Banque)
  const sessionColumns = useMemo(() => [
    {
      header: <span className="text-muted">#</span>,
      accessorKey: "index",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + row.index + 1;
        return <div className="fw-medium" style={{ textAlign: "center" }}>{globalIndex}</div>;
      },
      size: 50,
    },
    {
      header: <span className="text-muted">id session</span>,
      accessorKey: "sessionId",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-semibold text-primary">
          {cell.getValue()}
        </span>
      ),
      size: 120,
    },
    {
      header: <span className="text-muted">caisse</span>,
      accessorKey: "cashRegister",
      enableColumnFilter: false,
      cell: (cell) => (
        <Badge color="info" className="rounded-pill">
          {cell.getValue()}
        </Badge>
      ),
      size: 100,
    },
    {
      header: <span className="text-muted">caissier</span>,
      accessorKey: "cashier.name",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.cashier.name}</div>
      ),
      size: 120,
    },
    {
      header: <span className="text-muted">date ouverture</span>,
      accessorKey: "openDate",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div>
          <div>{formatDate(row.original.openDate)}</div>
          {row.original.closeDate && (
            <small className="text-muted">
              Fermé: {formatDate(row.original.closeDate)}
            </small>
          )}
        </div>
      ),
      size: 150,
    },
    {
      header: <span className="text-muted">statut</span>,
      accessorKey: "status",
      enableColumnFilter: false,
      cell: (cell) => {
        const statusInfo = getStatusInfo(cell.getValue());
        return (
          <Badge color={statusInfo.color} className="rounded-pill">
            {statusInfo.label}
          </Badge>
        );
      },
      size: 100,
    },
    {
      header: <span className="text-muted">solde initial</span>,
      accessorKey: "initialBalance",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-semibold">
          {formatAmount(cell.getValue())}
        </span>
      ),
      size: 120,
    },
    {
      header: <span className="text-muted">total encaissé</span>,
      accessorKey: "totalReceipts",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="text-success fw-semibold">
          {formatAmount(cell.getValue())}
        </span>
      ),
      size: 120,
    },
    {
      header: <span className="text-muted">total décaissements</span>,
      accessorKey: "totalPayments",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="text-danger fw-semibold">
          {formatAmount(cell.getValue())}
        </span>
      ),
      size: 120,
    },
    {
      header: <span className="text-muted">solde théorique</span>,
      accessorKey: "theoreticalBalance",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-bold text-primary">
          {formatAmount(cell.getValue())}
        </span>
      ),
      size: 120,
    },
    {
      header: <span className="text-muted">écart caisse</span>,
      accessorKey: "cashDifference",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const session = row.original;
        if (session.cashDifference !== null) {
          const differenceColor = getDifferenceColor(session.cashDifference);
          return (
            <Badge color={differenceColor} className="rounded-pill">
              {formatAmount(session.cashDifference)}
            </Badge>
          );
        }
        return <span className="text-muted">-</span>;
      },
      size: 120,
    },
    {
      header: <span className="text-muted">actions</span>,
      accessorKey: "actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const session = row.original;
        const isOpen = session.status === SESSION_STATUS.OPEN;
        const canClose = isOpen || session.status === SESSION_STATUS.CLOSING;
        
        return (
          <div className="d-flex gap-2 justify-content-center">
            <Link
              to="#"
              className="text-info"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDetailModal(session);
              }}
              title="Voir détails"
            >
              <i className="ri-eye-fill fs-16"></i>
            </Link>
            
            {canClose && (
              <Link
                to="#"
                className="text-warning"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenClosingModal(session);
                }}
                title="Clôturer"
              >
                <i className="ri-lock-fill fs-16"></i>
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
      size: 120,
    },
  ], [currentPage, itemsPerPage, formatAmount, formatDate, getStatusInfo, getDifferenceColor, handleOpenDetailModal, handleOpenClosingModal, handleOpenDeleteModal]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
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

          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
            filename="Sessions_Caisse"
          />

          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteSession}
            onCloseClick={() => {
              setDeleteModal(false);
              setSessionToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible."
          />
b

          {/* Filtres avancés */}
          <Row className="mb-3">
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row className="g-3">
                    <Col md={3}>
                      <div>
                        <Label className="form-label">Statut</Label>
                        <Input
                          type="select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="form-select rounded-pill"
                        >
                          <option value="all">Tous les statuts</option>
                          {STATUS_OPTIONS.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div>
                        <Label className="form-label">Caisse</Label>
                        <Input
                          type="select"
                          value={filterCashRegister}
                          onChange={(e) => setFilterCashRegister(e.target.value)}
                          className="form-select rounded-pill"
                        >
                          <option value="all">Toutes les caisses</option>
                          {CASH_REGISTERS.map(register => (
                            <option key={register.id} value={register.name}>
                              {register.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div>
                        <Label className="form-label">Période</Label>
                        <Input
                          type="select"
                          value={filterDateRange}
                          onChange={(e) => setFilterDateRange(e.target.value)}
                          className="form-select rounded-pill"
                        >
                          <option value="all">Toutes périodes</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="yesterday">Hier</option>
                          <option value="thisWeek">Cette semaine</option>
                          <option value="thisMonth">Ce mois</option>
                        </Input>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="d-flex align-items-end h-100">
                        <Button
                          color="light"
                          onClick={resetFilters}
                          className="w-100 rounded-pill"
                        >
                          <i className="ri-refresh-line me-1"></i>
                          Réinitialiser
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <SearchAndActionBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Rechercher par ID, caisse ou caissier..."
              showSearch={true}
              onAddClick={handleOpenAddModal}
              addButtonText="Nouvelle session"
              addButtonIcon="ri-add-circle-line"
              showAddButton={true}
              onExportClick={() => setIsExportCSV(true)}
              exportButtonText="Exporter"
              exportButtonIcon="ri-file-download-line"
              showExportButton={true}
              additionalInfo={
                <div className="d-flex align-items-center text-muted">
                  <i className="ri-information-line me-1"></i>
                  {filteredData.length} session{filteredData.length !== 1 ? 's' : ''} 
                  {calculateTotals.openSessions > 0 && (
                    <Badge color="success" className="ms-2">
                      {calculateTotals.openSessions} ouverte{calculateTotals.openSessions !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              }
            />
          </Row>

          {/* Cartes de résumé */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="text-muted mb-2">Total Encaissements</h6>
                      <h4 className="mb-0 text-success">
                        {formatAmount(calculateTotals.totalReceipts)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <i className="ri-arrow-down-circle-line text-success fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="text-muted mb-2">Total Décaissements</h6>
                      <h4 className="mb-0 text-danger">
                        {formatAmount(calculateTotals.totalPayments)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <i className="ri-arrow-up-circle-line text-danger fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="text-muted mb-2">Solde Théorique</h6>
                      <h4 className="mb-0 text-primary">
                        {formatAmount(calculateTotals.theoreticalBalance)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <i className="ri-wallet-line text-primary fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="text-muted mb-2">Écart Total</h6>
                      <h4 className={`mb-0 ${calculateTotals.cashDifference < 0 ? 'text-danger' : calculateTotals.cashDifference > 0 ? 'text-success' : 'text-muted'}`}>
                        {formatAmount(calculateTotals.cashDifference)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <i className={`ri-equalizer-line fs-2 ${calculateTotals.cashDifference < 0 ? 'text-danger' : calculateTotals.cashDifference > 0 ? 'text-success' : 'text-muted'}`}></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Tableau des sessions avec TableContainer comme dans Banque */}
          <Row>
            <Col lg={12}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                  <div className="text-center">
                    <Loader />
                    <p className="mt-3 text-muted">Chargement des sessions de caisse...</p>
                  </div>
                </div>
              ) : filteredData.length > 0 ? (
                <>
                  <TableContainer
                    columns={sessionColumns}
                    data={currentItems}
                    isGlobalFilter={false}
                    customPageSize={itemsPerPage}
                    tableClass="table-striped"
                  />
                  
                  <Pagination
                    data={filteredData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    alwaysShow={true}
                    showInfo={true}
                  />
                </>
              ) : (
                <EmptyDataCard
                  title="Aucune session trouvée"
                  description={
                    searchTerm || filterStatus !== "all" || filterCashRegister !== "all" || filterDateRange !== "all"
                      ? "Aucune session ne correspond aux critères de recherche."
                      : "Commencez par ouvrir une nouvelle session de caisse."
                  }
                  actionButton={
                    <Button
                      color="success"
                      onClick={handleOpenAddModal}
                      className="rounded-pill"
                    >
                      <i className="ri-add-circle-line me-1"></i>
                      Nouvelle session
                    </Button>
                  }
                  secondaryAction={
                    (searchTerm || filterStatus !== "all" || filterCashRegister !== "all" || filterDateRange !== "all") && (
                      <Button
                        color="outline-secondary"
                        onClick={resetFilters}
                        className="rounded-pill ms-2"
                      >
                        <i className="ri-refresh-line me-1"></i>
                        Réinitialiser les filtres
                      </Button>
                    )
                  }
                />
              )}
            </Col>
          </Row>
        </Container>

        {/* Modal d'ouverture de session - CORRIGÉ */}
        <Modal
          isOpen={modal}
          toggle={handleModalClose}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="md"
        >
          <ModalHeader
            toggle={handleModalClose}
            className="bg-light p-3 rounded-top-4"
          >
            Ouvrir une nouvelle session de caisse
          </ModalHeader>

          <Form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="cashRegister" className="form-label">
                      Caisse Physique <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="cashRegister"
                      name="cashRegister"
                      type="select"
                      className="rounded-pill"
                      value={formik.values.cashRegister}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.cashRegister && Boolean(formik.errors.cashRegister)}
                    >
                      <option value="">Sélectionnez une caisse</option>
                      {CASH_REGISTERS.map(register => (
                        <option key={register.id} value={register.name}>
                          {register.name} - {register.location}
                        </option>
                      ))}
                    </Input>
                    {formik.touched.cashRegister && formik.errors.cashRegister && (
                      <FormFeedback>{formik.errors.cashRegister}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="cashier" className="form-label">
                      Caissier <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="cashier"
                      name="cashier"
                      type="select"
                      className="rounded-pill"
                      value={formik.values.cashier}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.cashier && Boolean(formik.errors.cashier)}
                    >
                      <option value="">Sélectionnez un caissier</option>
                      {CASHIERS_DATA.map(cashier => (
                        <option key={cashier.id} value={cashier.id}>
                          {cashier.name} - {cashier.email}
                        </option>
                      ))}
                    </Input>
                    {formik.touched.cashier && formik.errors.cashier && (
                      <FormFeedback>{formik.errors.cashier}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="initialBalance" className="form-label">
                      Solde Initial (Fond de Caisse) <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="initialBalance"
                      name="initialBalance"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="500000"
                      className="rounded-pill"
                      value={formik.values.initialBalance}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.initialBalance && Boolean(formik.errors.initialBalance)}
                    />
                    {formik.touched.initialBalance && formik.errors.initialBalance && (
                      <FormFeedback>{formik.errors.initialBalance}</FormFeedback>
                    )}
                    <small className="text-muted">
                      Montant physique laissé par le caissier précédent (en )
                    </small>
                  </div>
                </Col>
              </Row>

              <div className="alert alert-info border-0 mt-3">
                <div className="d-flex align-items-center">
                  <i className="ri-information-line me-2"></i>
                  <div>
                    <strong>Date/Heure d'ouverture :</strong> {new Date().toLocaleString('fr-FR')}
                    <br />
                    <small>Cette date sera enregistrée automatiquement lors de l'ouverture.</small>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="rounded-bottom-4">
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={handleModalClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Ouverture en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-lock-unlock-line me-1"></i>
                    Ouvrir la session
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de clôture de session */}
        <Modal
          isOpen={closingModal}
          toggle={() => setClosingModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setClosingModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-lock-fill me-2"></i>
            Clôturer la session
          </ModalHeader>

          <Form onSubmit={closingFormik.handleSubmit}>
            <ModalBody>
              {selectedSession && (
                <>
                  <div className="alert alert-primary border-0 mb-4">
                    <Row>
                      <Col md={6}>
                        <strong>Session :</strong> {selectedSession.sessionId}
                        <br />
                        <strong>Caissier :</strong> {selectedSession.cashier.name}
                      </Col>
                      <Col md={6}>
                        <strong>Solde Théorique :</strong> {formatAmount(selectedSession.theoreticalBalance)}
                        <br />
                        <strong>Date ouverture :</strong> {formatDateTime(selectedSession.openDate)}
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="physicalBalance" className="form-label">
                          Solde Final Physique <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="physicalBalance"
                          name="physicalBalance"
                          type="number"
                          min="0"
                          step="100"
                          placeholder={selectedSession.theoreticalBalance}
                          className="rounded-pill"
                          value={closingFormik.values.physicalBalance}
                          onChange={closingFormik.handleChange}
                          onBlur={closingFormik.handleBlur}
                          invalid={closingFormik.touched.physicalBalance && Boolean(closingFormik.errors.physicalBalance)}
                        />
                        {closingFormik.touched.physicalBalance && closingFormik.errors.physicalBalance && (
                          <FormFeedback>{closingFormik.errors.physicalBalance}</FormFeedback>
                        )}
                        <small className="text-muted">
                          Montant réel compté physiquement
                        </small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="amountTransferred" className="form-label">
                          Montant Remis
                        </Label>
                        <Input
                          id="amountTransferred"
                          name="amountTransferred"
                          type="number"
                          min="0"
                          step="100"
                          placeholder="0"
                          className="rounded-pill"
                          value={closingFormik.values.amountTransferred}
                          onChange={closingFormik.handleChange}
                          onBlur={closingFormik.handleBlur}
                          invalid={closingFormik.touched.amountTransferred && Boolean(closingFormik.errors.amountTransferred)}
                        />
                        {closingFormik.touched.amountTransferred && closingFormik.errors.amountTransferred && (
                          <FormFeedback>{closingFormik.errors.amountTransferred}</FormFeedback>
                        )}
                        <small className="text-muted">
                          Transféré au trésorier/coffre
                        </small>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="amountLeft" className="form-label">
                          Montant Laissé
                        </Label>
                        <Input
                          id="amountLeft"
                          name="amountLeft"
                          type="number"
                          min="0"
                          step="100"
                          placeholder="0"
                          className="rounded-pill"
                          value={closingFormik.values.amountLeft}
                          onChange={closingFormik.handleChange}
                          onBlur={closingFormik.handleBlur}
                          invalid={closingFormik.touched.amountLeft && Boolean(closingFormik.errors.amountLeft)}
                        />
                        {closingFormik.touched.amountLeft && closingFormik.errors.amountLeft && (
                          <FormFeedback>{closingFormik.errors.amountLeft}</FormFeedback>
                        )}
                        <small className="text-muted">
                          Nouveau fond de caisse
                        </small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="notes" className="form-label">
                          Notes/Observations
                        </Label>
                        <Input
                          id="notes"
                          name="notes"
                          type="textarea"
                          rows="2"
                          className="rounded"
                          value={closingFormik.values.notes}
                          onChange={closingFormik.handleChange}
                          placeholder="Observations sur l'écart de caisse..."
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="alert alert-info border-0 mt-3">
                    <div className="d-flex align-items-center">
                      <i className="ri-calculator-line me-2"></i>
                      <div>
                        <strong>Écart calculé :</strong> {
                          closingFormik.values.physicalBalance ? 
                          formatAmount(calculateDifference(
                            selectedSession.theoreticalBalance, 
                            parseFloat(closingFormik.values.physicalBalance)
                          )) : 
                          '0 '
                        }
                        <br />
                        <small>
                          Écart = Solde Physique - Solde Théorique
                          {closingFormik.values.physicalBalance && (
                            <span className={`ms-2 fw-bold ${
                              calculateDifference(
                                selectedSession.theoreticalBalance, 
                                parseFloat(closingFormik.values.physicalBalance)
                              ) > 0 ? 'text-success' : 
                              calculateDifference(
                                selectedSession.theoreticalBalance, 
                                parseFloat(closingFormik.values.physicalBalance)
                              ) < 0 ? 'text-danger' : 'text-muted'
                            }`}>
                              {calculateDifference(
                                selectedSession.theoreticalBalance, 
                                parseFloat(closingFormik.values.physicalBalance)
                              ) > 0 ? ' (Excédent)' : 
                               calculateDifference(
                                selectedSession.theoreticalBalance, 
                                parseFloat(closingFormik.values.physicalBalance)
                              ) < 0 ? ' (Déficit)' : ' (Équilibre)'}
                            </span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </ModalBody>

            <ModalFooter className="rounded-bottom-4">
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={() => setClosingModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={closingFormik.isSubmitting || !closingFormik.isValid}
              >
                {closingFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Clôture en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line me-1"></i>
                    Clôturer et Valider
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de détails */}
        <Modal
          isOpen={detailModal}
          toggle={handleDetailModalClose}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="xl"
        >
          <ModalHeader
            toggle={handleDetailModalClose}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-information-line me-2"></i>
            Détails de la session
          </ModalHeader>

          <ModalBody>
            {selectedSession && (
              <div>
                {/* En-tête de session */}
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">ID Session</h6>
                      <h4 className="fw-bold text-primary">{selectedSession.sessionId}</h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Statut</h6>
                      <Badge 
                        color={getStatusInfo(selectedSession.status).color} 
                        className="rounded-pill fs-6 px-3 py-2"
                      >
                        {getStatusInfo(selectedSession.status).label}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Caissier</h6>
                      <h5 className="fw-bold">{selectedSession.cashier.name}</h5>
                    </div>
                  </Col>
                </Row>

                {/* Informations de base */}
                <Row className="mb-4">
                  <Col md={6}>
                    <table className="table table-bordered table-striped mb-0">
                      <tbody>
                        <tr>
                          <th width="200">Caisse Physique</th>
                          <td>
                            <Badge color="info">{selectedSession.cashRegister}</Badge>
                          </td>
                        </tr>
                        <tr>
                          <th>Date Ouverture</th>
                          <td>{formatDateTime(selectedSession.openDate)}</td>
                        </tr>
                        <tr>
                          <th>Date Fermeture</th>
                          <td>
                            {selectedSession.closeDate ? 
                              formatDateTime(selectedSession.closeDate) : 
                              <span className="text-muted">Session en cours</span>
                            }
                          </td>
                        </tr>
                        <tr>
                          <th>Nombre Transactions</th>
                          <td>
                            <Badge color="primary">{selectedSession.transactions}</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <table className="table table-bordered table-striped mb-0">
                      <tbody>
                        <tr>
                          <th width="200">Solde Initial</th>
                          <td className="fw-bold">{formatAmount(selectedSession.initialBalance)}</td>
                        </tr>
                        <tr>
                          <th>Total Encaissements</th>
                          <td className="text-success fw-bold">{formatAmount(selectedSession.totalReceipts)}</td>
                        </tr>
                        <tr>
                          <th>Total Décaissements</th>
                          <td className="text-danger fw-bold">{formatAmount(selectedSession.totalPayments)}</td>
                        </tr>
                        <tr>
                          <th>Solde Théorique</th>
                          <td className="fw-bold text-primary">{formatAmount(selectedSession.theoreticalBalance)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>

                {/* Clôture et écarts */}
                {(selectedSession.status === SESSION_STATUS.VALIDATED || 
                  selectedSession.status === SESSION_STATUS.PENDING || 
                  selectedSession.status === SESSION_STATUS.CLOSING) && (
                  <div className="mt-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      <i className="ri-calculator-line me-2"></i>
                      Détails de clôture
                    </h6>
                    
                    <table className="table table-bordered table-striped table-hover mb-4">
                      <thead className="table-light">
                        <tr>
                          <th>Élément</th>
                          <th width="200">Valeur</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><Badge color="dark">SOLDE FINAL PHYSIQUE</Badge></td>
                          <td className="fw-bold">
                            {selectedSession.physicalBalance ? 
                              formatAmount(selectedSession.physicalBalance) : 
                              <span className="text-muted">Non défini</span>
                            }
                          </td>
                          <td>Montant réel compté physiquement</td>
                        </tr>
                        <tr>
                          <td><Badge color="success">MONTANT REMIS</Badge></td>
                          <td className="fw-bold text-success">
                            {selectedSession.amountTransferred ? 
                              formatAmount(selectedSession.amountTransferred) : 
                              <span className="text-muted">0 </span>
                            }
                          </td>
                          <td>Transféré au trésorier/coffre</td>
                        </tr>
                        <tr>
                          <td><Badge color="info">MONTANT LAISSÉ</Badge></td>
                          <td className="fw-bold text-info">
                            {selectedSession.amountLeft ? 
                              formatAmount(selectedSession.amountLeft) : 
                              <span className="text-muted">0 </span>
                            }
                          </td>
                          <td>Nouveau fond de caisse pour le prochain caissier</td>
                        </tr>
                        <tr>
                          <td><Badge color={getDifferenceColor(selectedSession.cashDifference)}>
                            ÉCART DE CAISSE
                          </Badge></td>
                          <td className={`fw-bold ${
                            selectedSession.cashDifference > 0 ? 'text-success' : 
                            selectedSession.cashDifference < 0 ? 'text-danger' : 'text-muted'
                          }`}>
                            {selectedSession.cashDifference !== null ? 
                              formatAmount(selectedSession.cashDifference) : 
                              <span className="text-muted">Non calculé</span>
                            }
                          </td>
                          <td>
                            {selectedSession.cashDifference > 0 ? 'Excédent' : 
                             selectedSession.cashDifference < 0 ? 'Déficit' : 'Équilibre parfait'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Actions */}
                {selectedSession.status === SESSION_STATUS.OPEN && (
                  <div className="alert alert-warning border-0 mt-4">
                    <div className="d-flex align-items-center">
                      <i className="ri-alert-line me-2"></i>
                      <div>
                        <strong>Session en cours</strong>
                        <br />
                        <small>Cette session est actuellement ouverte. Vous pouvez la clôturer.</small>
                      </div>
                      <Button
                        color="warning"
                        className="ms-auto"
                        onClick={() => {
                          handleDetailModalClose();
                          handleOpenClosingModal(selectedSession);
                        }}
                      >
                        <i className="ri-lock-fill me-1"></i>
                        Clôturer maintenant
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>

          <ModalFooter className="rounded-bottom-4">
            <Button
              className="btn btn-light rounded-pill"
              onClick={handleDetailModalClose}
            >
              Fermer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Caisse;