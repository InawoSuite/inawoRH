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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Table,
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
import { CustomSelect } from "../../Components/Common/CustomSelectStyles";

// Statuts des emprunts
const LOAN_STATUS = {
  ACTIVE: 'active',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PENDING: 'pending'
};

const STATUS_OPTIONS = [
  { value: LOAN_STATUS.ACTIVE, label: 'Actif', color: 'success' },
  { value: LOAN_STATUS.PAID, label: 'Remboursé', color: 'primary' },
  { value: LOAN_STATUS.OVERDUE, label: 'En Retard', color: 'danger' },
  { value: LOAN_STATUS.PENDING, label: 'En Attente', color: 'warning' },
];

// Options pour les périodicités de remboursement
const REPAYMENT_PERIODS = [
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'quarterly', label: 'Trimestrielle' },
  { value: 'semiannual', label: 'Semestrielle' },
  { value: 'annual', label: 'Annuelle' },
  { value: 'bullet', label: 'In fine' },
];

// Organismes prêteurs
const LENDER_ORGANIZATIONS = [
  { value: "1", label: "Banque Internationale pour l'Afrique (BIA)" },
  { value: "2", label: "Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)" },
  { value: "3", label: "Banque Atlantique" },
  { value: "4", label: "Ecobank" },
  { value: "5", label: "Banque de l'Habitat" },
  { value: "6", label: "Société Générale" },
  { value: "7", label: "BOA" },
  { value: "8", label: "CNSS" },
  { value: "9", label: "Autre institution" },
];

// Comptes disponibles pour les emprunts
const ACCOUNT_OPTIONS = [
  // Classe 1 - Comptes d'emprunt
  { value: "161", label: "161 - Emprunts bancaires" },
  { value: "162", label: "162 - Autres emprunts" },
  { value: "163", label: "163 - Emprunts obligataires" },
  { value: "164", label: "164 - Emprunts auprès des associés" },
  
  // Classe 4 - Comptes de réclassement
  { value: "474", label: "474 - Charges à payer / Produits à recevoir" },
  { value: "471", label: "471 - Charges constatées d'avance" },
  
  // Classe 6 - Comptes de charges d'intérêts
  { value: "671", label: "671 - Charges d'intérêts" },
  { value: "661", label: "661 - Charges d'intérêts des dettes" },
  { value: "681", label: "681 - Dotations aux amortissements" },
];

// Durées en mois
const DURATION_OPTIONS = [
  { value: 6, label: '6 mois' },
  { value: 12, label: '1 an' },
  { value: 18, label: '18 mois' },
  { value: 24, label: '2 ans' },
  { value: 36, label: '3 ans' },
  { value: 48, label: '4 ans' },
  { value: 60, label: '5 ans' },
  { value: 84, label: '7 ans' },
  { value: 120, label: '10 ans' },
  { value: 180, label: '15 ans' },
  { value: 240, label: '20 ans' },
];

// Options pour les filtres
const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: LOAN_STATUS.ACTIVE, label: 'Actif' },
  { value: LOAN_STATUS.PAID, label: 'Remboursé' },
  { value: LOAN_STATUS.OVERDUE, label: 'En Retard' },
  { value: LOAN_STATUS.PENDING, label: 'En Attente' },
];

const LENDER_FILTER_OPTIONS = [
  { value: "all", label: "Tous les organismes" },
  { value: "Banque Internationale pour l'Afrique (BIA)", label: "Banque Internationale pour l'Afrique (BIA)" },
  { value: "Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)", label: "Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)" },
  { value: "Banque Atlantique", label: "Banque Atlantique" },
  { value: "Ecobank", label: "Ecobank" },
  { value: "Banque de l'Habitat", label: "Banque de l'Habitat" },
  { value: "Société Générale", label: "Société Générale" },
  { value: "BOA", label: "BOA" },
  { value: "CNSS", label: "CNSS" },
  { value: "Autre institution", label: "Autre institution" },
];

const DURATION_FILTER_OPTIONS = [
  { value: "all", label: "Toutes durées" },
  { value: "12", label: "≤ 1 an" },
  { value: "36", label: "≤ 3 ans" },
  { value: "60", label: "≤ 5 ans" },
  { value: "120", label: "≤ 10 ans" },
];

// Périodes fiscales
const FISCAL_PERIODS = [
  { value: "2024", label: "Exercice 2024" },
  { value: "2023", label: "Exercice 2023" },
  { value: "2022", label: "Exercice 2022" },
];

// DONNÉES FICTIVES POUR LES EMPRUNTS
const MOCK_LOANS_DATA = [
  {
    id: 1,
    loanName: "Emprunt BIA 2025",
    lender: "Banque Internationale pour l'Afrique (BIA)",
    amount: 25000000,
    duration: 60,
    startDate: "2025-01-15",
    interestRate: 7.5,
    repaymentPeriod: 'monthly',
    loanAccount: "161",
    interestAccount: "671",
    reclassificationAccount: "474",
    status: LOAN_STATUS.ACTIVE,
    remainingAmount: 20000000,
    monthlyPayment: 500833,
    nextPaymentDate: "2025-02-15",
    amortizationFile: "Tableau_amortissement_BIA_2025.pdf"
  },
  {
    id: 2,
    loanName: "Prêt équipement BCEAO 2024",
    lender: "Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)",
    amount: 15000000,
    duration: 36,
    startDate: "2024-06-01",
    interestRate: 6.2,
    repaymentPeriod: 'quarterly',
    loanAccount: "162",
    interestAccount: "671",
    reclassificationAccount: "471",
    status: LOAN_STATUS.ACTIVE,
    remainingAmount: 10000000,
    monthlyPayment: 458333,
    nextPaymentDate: "2025-03-01",
    amortizationFile: "Amortissement_BCEAO_2024.xlsx"
  },
  {
    id: 3,
    loanName: "Crédit trésorerie Ecobank",
    lender: "Ecobank",
    amount: 5000000,
    duration: 12,
    startDate: "2023-03-10",
    interestRate: 9.0,
    repaymentPeriod: 'monthly',
    loanAccount: "161",
    interestAccount: "661",
    reclassificationAccount: "474",
    status: LOAN_STATUS.PAID,
    remainingAmount: 0,
    monthlyPayment: 437083,
    nextPaymentDate: null,
    amortizationFile: "Crédit_Ecobank_2023.pdf"
  },
  {
    id: 4,
    loanName: "Emprunt associés 2024",
    lender: "Autre institution",
    amount: 8000000,
    duration: 24,
    startDate: "2024-09-01",
    interestRate: 5.0,
    repaymentPeriod: 'semiannual',
    loanAccount: "164",
    interestAccount: "671",
    reclassificationAccount: "474",
    status: LOAN_STATUS.ACTIVE,
    remainingAmount: 6000000,
    monthlyPayment: 350417,
    nextPaymentDate: "2025-03-01",
    amortizationFile: "Emprunt_associes_2024.pdf"
  },
  {
    id: 5,
    loanName: "Prêt immobilier BOA",
    lender: "BOA",
    amount: 50000000,
    duration: 240,
    startDate: "2022-01-15",
    interestRate: 4.5,
    repaymentPeriod: 'monthly',
    loanAccount: "163",
    interestAccount: "681",
    reclassificationAccount: "474",
    status: LOAN_STATUS.ACTIVE,
    remainingAmount: 45000000,
    monthlyPayment: 316458,
    nextPaymentDate: "2025-02-15",
    amortizationFile: "Prêt_immobilier_BOA_2022.pdf"
  },
  {
    id: 6,
    loanName: "Crédit fournisseur SG",
    lender: "Société Générale",
    amount: 3000000,
    duration: 6,
    startDate: "2024-11-01",
    interestRate: 8.5,
    repaymentPeriod: 'monthly',
    loanAccount: "161",
    interestAccount: "671",
    reclassificationAccount: "474",
    status: LOAN_STATUS.OVERDUE,
    remainingAmount: 1500000,
    monthlyPayment: 512500,
    nextPaymentDate: "2025-01-01",
    amortizationFile: "Crédit_SG_2024.xlsx"
  },
  {
    id: 7,
    loanName: "Emprunt CNSS 2023",
    lender: "CNSS",
    amount: 12000000,
    duration: 48,
    startDate: "2023-05-20",
    interestRate: 3.5,
    repaymentPeriod: 'monthly',
    loanAccount: "162",
    interestAccount: "671",
    reclassificationAccount: "471",
    status: LOAN_STATUS.PENDING,
    remainingAmount: 11000000,
    monthlyPayment: 268750,
    nextPaymentDate: "2025-02-20",
    amortizationFile: "CNSS_emprunt_2023.pdf"
  },
];

const FinancementsEmprunts = () => {
  const { t } = useTranslation();
  
  // États principaux
  const [loansData, setLoansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false); // ÉTAT DÉCLARÉ ICI
  const [exportData, setExportData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  
  // États des modals
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [amortizationModal, setAmortizationModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);

  // États pour les filtres
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLender, setFilterLender] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");

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

  // ✅ Fonction pour obtenir les infos du statut
  const getStatusInfo = useCallback((status) => {
    const statusColors = {
      [LOAN_STATUS.ACTIVE]: {
        label: "Actif",
        color: "text-success",
        icon: "ri-checkbox-blank-circle-fill",
        bgColor: "bg-success-subtle"
      },
      [LOAN_STATUS.PAID]: {
        label: "Remboursé",
        color: "text-primary",
        icon: "ri-checkbox-circle-line",
        bgColor: "bg-primary-subtle"
      },
      [LOAN_STATUS.OVERDUE]: {
        label: "En Retard",
        color: "text-danger",
        icon: "ri-alert-line",
        bgColor: "bg-danger-subtle"
      },
      [LOAN_STATUS.PENDING]: {
        label: "En Attente",
        color: "text-warning",
        icon: "ri-time-line",
        bgColor: "bg-warning-subtle"
      },
    };
    return statusColors[status] || {
      label: "Inconnu",
      color: "text-secondary",
      icon: "ri-question-line",
      bgColor: "bg-secondary-subtle"
    };
  }, []);

  // ✅ Fonction pour obtenir le label de la périodicité
  const getPeriodLabel = useCallback((period) => {
    const periodInfo = REPAYMENT_PERIODS.find(p => p.value === period);
    return periodInfo ? periodInfo.label : period;
  }, []);

  // ✅ Fonction pour obtenir le label de la durée
  const getDurationLabel = useCallback((months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${months} mois`;
    } else if (remainingMonths === 0) {
      return `${years} an${years > 1 ? 's' : ''}`;
    } else {
      return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
    }
  }, []);

  // ✅ Filtrage optimisé des emprunts
  const filteredData = useMemo(() => {
    let filtered = loansData;

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((loan) =>
        loan.loanName.toLowerCase().includes(lowerSearchTerm) ||
        loan.lender.toLowerCase().includes(lowerSearchTerm) ||
        loan.loanAccount.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter(loan => loan.status === filterStatus);
    }

    // Filtre par prêteur
    if (filterLender !== "all") {
      filtered = filtered.filter(loan => loan.lender === filterLender);
    }

    // Filtre par durée
    if (filterDuration !== "all") {
      const duration = parseInt(filterDuration);
      filtered = filtered.filter(loan => loan.duration <= duration);
    }

    return filtered;
  }, [loansData, searchTerm, filterStatus, filterLender, filterDuration]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Fonction pour récupérer les emprunts (MOCK)
  const fetchLoans = useCallback(async () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const data = MOCK_LOANS_DATA;
        setLoansData(data);
        
        // Préparer les données pour l'export
        const exportDataFormatted = data.map(loan => ({
          "Nom de l'Emprunt": loan.loanName,
          "Organisme Prêteur": loan.lender,
          "Capital Initial": formatAmount(loan.amount),
          "Durée": getDurationLabel(loan.duration),
          "Date d'Obtention": formatDate(loan.startDate),
          "Taux d'Intérêt": `${loan.interestRate}%`,
          "Périodicité": getPeriodLabel(loan.repaymentPeriod),
          "Compte d'Emprunt": loan.loanAccount,
          "Compte Charges Intérêts": loan.interestAccount,
          "Compte Réclassement": loan.reclassificationAccount,
          "Montant Restant": formatAmount(loan.remainingAmount),
          "Mensualité": formatAmount(loan.monthlyPayment),
          "Statut": getStatusInfo(loan.status).label,
        }));
        setExportData(exportDataFormatted);
        
        toast.success("Données chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchLoans:", err);
        toast.error("Erreur lors du chargement des données");
        setLoansData([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [formatAmount, formatDate, getDurationLabel, getPeriodLabel, getStatusInfo]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Financements & Emprunts | INAWO - Suite de Gestion";
    fetchLoans();
  }, [fetchLoans]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterLender, filterDuration]);

  // ✅ Validation du formulaire de création
  const createValidationSchema = Yup.object({
    loanName: Yup.string()
      .required("Le nom de l'emprunt est requis")
      .min(3, "Le nom doit contenir au moins 3 caractères"),
    lender: Yup.string()
      .required("L'organisme prêteur est requis"),
    amount: Yup.number()
      .required("Le montant est requis")
      .min(1000, "Le montant minimum est 1.000 ")
      .positive("Le montant doit être positif"),
    duration: Yup.number()
      .required("La durée est requise")
      .min(1, "La durée minimale est 1 mois")
      .positive("La durée doit être positive"),
    startDate: Yup.date()
      .required("La date d'obtention est requise"),
    interestRate: Yup.number()
      .required("Le taux d'intérêt est requis")
      .min(0, "Le taux ne peut pas être négatif")
      .max(100, "Le taux maximum est 100%"),
    repaymentPeriod: Yup.string()
      .required("La périodicité est requise"),
    loanAccount: Yup.string()
      .required("Le compte d'emprunt est requis"),
    interestAccount: Yup.string()
      .required("Le compte de charges intérêts est requis"),
    reclassificationAccount: Yup.string()
      .required("Le compte de réclassement est requis"),
  });

  // ✅ Formik pour la gestion du formulaire de création
  const formik = useFormik({
    initialValues: {
      loanName: '',
      lender: '',
      amount: '',
      duration: '',
      startDate: new Date().toISOString().split('T')[0],
      interestRate: '',
      repaymentPeriod: '',
      loanAccount: '',
      interestAccount: '',
      reclassificationAccount: '',
      amortizationFile: null,
    },
    validationSchema: createValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitLoan(values, resetForm, setSubmitting);
    }
  });

  // ✅ Fonction pour calculer la mensualité
  const calculateMonthlyPayment = useCallback((amount, interestRate, duration) => {
    if (!amount || !interestRate || !duration) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = duration;
    
    if (monthlyRate === 0) {
      return amount / numberOfPayments;
    }
    
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(payment);
  }, []);

  // ✅ Fonction de soumission de création (MOCK)
  const handleSubmitLoan = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        const monthlyPayment = calculateMonthlyPayment(
          parseFloat(values.amount),
          parseFloat(values.interestRate),
          parseInt(values.duration)
        );

        const newLoan = {
          id: loansData.length + 1,
          loanName: values.loanName,
          lender: values.lender,
          amount: parseFloat(values.amount),
          duration: parseInt(values.duration),
          startDate: values.startDate,
          interestRate: parseFloat(values.interestRate),
          repaymentPeriod: values.repaymentPeriod,
          loanAccount: values.loanAccount,
          interestAccount: values.interestAccount,
          reclassificationAccount: values.reclassificationAccount,
          status: LOAN_STATUS.ACTIVE,
          remainingAmount: parseFloat(values.amount),
          monthlyPayment: monthlyPayment,
          nextPaymentDate: values.startDate,
          amortizationFile: values.amortizationFile ? "fichier_uploadé.pdf" : null
        };

        setLoansData(prev => [newLoan, ...prev]);
        toast.success("Emprunt créé avec succès !");
        resetForm();
        handleModalClose();
        
      } catch (err) {
        console.error("Erreur lors de la création de l'emprunt:", err);
        toast.error("Erreur lors de la création de l'emprunt");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de suppression (MOCK)
  const handleDeleteLoan = async () => {
    if (!loanToDelete?.id) return;

    setTimeout(() => {
      try {
        const updatedData = loansData.filter(loan => loan.id !== loanToDelete.id);
        setLoansData(updatedData);
        toast.success("Emprunt supprimé avec succès !");
        setDeleteModal(false);
        setLoanToDelete(null);
        
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression de l'emprunt");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleModalClose = useCallback(() => {
    setModal(false);
    setIsEdit(false);
    setCurrentLoan(null);
    formik.resetForm();
  }, [formik]);

  const handleDetailModalClose = useCallback(() => {
    setDetailModal(false);
    setSelectedLoan(null);
  }, []);

  const handleAmortizationModalClose = useCallback(() => {
    setAmortizationModal(false);
    setSelectedLoan(null);
  }, []);

  const handleOpenDetailModal = useCallback((loan) => {
    setSelectedLoan(loan);
    setDetailModal(true);
  }, []);

  const handleOpenAmortizationModal = useCallback((loan) => {
    setSelectedLoan(loan);
    setAmortizationModal(true);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setCurrentLoan(null);
    setIsEdit(false);
    formik.resetForm();
    formik.setFieldValue('startDate', new Date().toISOString().split('T')[0]);
    setModal(true);
  }, [formik]);

  const handleOpenEditModal = useCallback((loan) => {
    setCurrentLoan(loan);
    setIsEdit(true);
    
    // Pré-remplir le formulaire avec les données du prêt
    formik.setValues({
      loanName: loan.loanName,
      lender: loan.lender,
      amount: loan.amount,
      duration: loan.duration,
      startDate: loan.startDate,
      interestRate: loan.interestRate,
      repaymentPeriod: loan.repaymentPeriod,
      loanAccount: loan.loanAccount,
      interestAccount: loan.interestAccount,
      reclassificationAccount: loan.reclassificationAccount,
      amortizationFile: null,
    });
    
    setModal(true);
  }, [formik]);

  const handleOpenDeleteModal = useCallback((loan) => {
    setLoanToDelete(loan);
    setDeleteModal(true);
  }, []);

  // ✅ Calcul des totaux pour les emprunts filtrés
  const calculateTotals = useMemo(() => {
    const totals = {
      totalAmount: 0,
      totalRemaining: 0,
      totalMonthlyPayments: 0,
      activeLoans: 0,
      overdueLoans: 0
    };

    filteredData.forEach(loan => {
      totals.totalAmount += loan.amount || 0;
      totals.totalRemaining += loan.remainingAmount || 0;
      totals.totalMonthlyPayments += loan.monthlyPayment || 0;
      
      if (loan.status === LOAN_STATUS.ACTIVE) {
        totals.activeLoans++;
      } else if (loan.status === LOAN_STATUS.OVERDUE) {
        totals.overdueLoans++;
      }
    });

    return totals;
  }, [filteredData]);

  // ✅ Colonnes pour le tableau des emprunts
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
      header: "Nom de l'Emprunt",
      accessorKey: "loanName",
      enableColumnFilter: false,
      cell: (cell) => (
        <div>
          <span className="fw-semibold text-primary">{cell.getValue()}</span>
          <div className="small text-muted">{cell.row.original.lender}</div>
        </div>
      ),
      size: 180,
    },
    {
      header: "Montant",
      accessorKey: "amount",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-bold">{formatAmount(cell.getValue())}</span>
      ),
      size: 120,
    },
    {
      header: "Durée",
      accessorKey: "duration",
      enableColumnFilter: false,
      cell: (cell) => (
        <Badge color="info" className="rounded-pill">
          {getDurationLabel(cell.getValue())}
        </Badge>
      ),
      size: 100,
    },
    {
      header: "Taux",
      accessorKey: "interestRate",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-bold text-warning">{cell.getValue()}%</span>
      ),
      size: 80,
    },
    {
      header: "Mensualité",
      accessorKey: "monthlyPayment",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-bold text-danger">{formatAmount(cell.getValue())}</span>
      ),
      size: 120,
    },
    {
      header: "Restant Dû",
      accessorKey: "remainingAmount",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className={`fw-bold ${cell.row.original.status === LOAN_STATUS.PAID ? 'text-success' : 'text-primary'}`}>
          {formatAmount(cell.getValue())}
        </span>
      ),
      size: 120,
    },
    {
      header: "Statut",
      accessorKey: "status",
      enableColumnFilter: false,
      cell: (cell) => {
        const statusInfo = getStatusInfo(cell.getValue());
        return (
          <Badge className={`${statusInfo.bgColor} ${statusInfo.color} fw-medium rounded-pill`}>
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
        const loan = row.original;
        
        return (
          <div className="d-flex gap-2">
            <Link
              to="#"
              className="text-info"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDetailModal(loan);
              }}
              title="Voir détails"
            >
              <i className="ri-eye-fill fs-16"></i>
            </Link>
            
            <Link
              to="#"
              className="text-warning"
              onClick={(e) => {
                e.preventDefault();
                handleOpenAmortizationModal(loan);
              }}
              title="Tableau d'amortissement"
            >
              <i className="ri-file-chart-fill fs-16"></i>
            </Link>
            
            {loan.status !== LOAN_STATUS.PAID && (
              <Link
                to="#"
                className="text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenEditModal(loan);
                }}
                title="Modifier"
              >
                <i className="ri-edit-2-fill fs-16"></i>
              </Link>
            )}
            
            <Link
              to="#"
              className="text-danger"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDeleteModal(loan);
              }}
              title="Supprimer"
            >
              <i className="ri-delete-bin-5-fill fs-16"></i>
            </Link>
          </div>
        );
      },
      size: 120,
    },
  ], [currentPage, itemsPerPage, formatAmount, getDurationLabel, getStatusInfo, handleOpenDetailModal, handleOpenAmortizationModal, handleOpenEditModal, handleOpenDeleteModal]);

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
            filename="Financements_Emprunts"
          />

          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteLoan}
            onCloseClick={() => {
              setDeleteModal(false);
              setLoanToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cet emprunt ? Cette action est irréversible."
          />

          <BreadCrumb
            title={`Financements & Emprunts - Exercice ${selectedPeriod}`}
            pageTitle={
              <>
                <i className="ri-bank-card-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              {/* Barre de recherche, ajout et export - ARRONDIE */}
                <SearchAndActionBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  searchPlaceholder="Rechercher un emprunt..."
                  showSearch={true}
                  onAddClick={handleOpenAddModal}
                  addButtonText="Nouvel emprunt"
                  addButtonIcon="ri-file-add-line"
                  showAddButton={true}
                  onExportClick={() => setIsExportCSV(true)}
                  exportButtonText="Exporter"
                  exportButtonIcon="ri-file-download-line"
                  showExportButton={true}
                  additionalInfo={
                    <div className="d-flex align-items-center text-muted">
                      <i className="ri-information-line me-1"></i>
                      {filteredData.length} emprunt{filteredData.length !== 1 ? 's' : ''} trouvé{filteredData.length !== 1 ? 's' : ''}
                      {calculateTotals.activeLoans > 0 && (
                        <Badge color="success" className="ms-2">
                          {calculateTotals.activeLoans} actif{calculateTotals.activeLoans !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  }
                />

              {/* Filtres - ARRONDIS */}
              <Row className="mb-3">
                <Col lg={12}>
                  <div className="d-flex align-items-center gap-3 flex-wrap rounded-4"
                    style={{ background: "white", padding: "1.5rem" }}>
                    
                    {/* Filtre par exercice */}
                    <div>
                      <CustomSelect
                        value={FISCAL_PERIODS.find(opt => opt.value === selectedPeriod) || null}
                        onChange={(selectedOption) => {
                          setSelectedPeriod(selectedOption ? selectedOption.value : "2024");
                        }}
                        options={FISCAL_PERIODS}
                        placeholder="Sélectionnez un exercice"
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
                        placeholder="Filtrer par statut"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    
                    {/* Filtre par prêteur */}
                    <div>
                      <CustomSelect
                        value={LENDER_FILTER_OPTIONS.find(opt => opt.value === filterLender) || null}
                        onChange={(selectedOption) => {
                          setFilterLender(selectedOption ? selectedOption.value : "all");
                        }}
                        options={LENDER_FILTER_OPTIONS}
                        placeholder="Filtrer par prêteur"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    
                    {/* Filtre par durée */}
                    <div>
                      <CustomSelect
                        value={DURATION_FILTER_OPTIONS.find(opt => opt.value === filterDuration) || null}
                        onChange={(selectedOption) => {
                          setFilterDuration(selectedOption ? selectedOption.value : "all");
                        }}
                        options={DURATION_FILTER_OPTIONS}
                        placeholder="Filtrer par durée"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Cartes de résumé - ARRONDIES */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="card-animate rounded-4">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="text-muted mb-2">Capital Total Emprunté</h6>
                          <h4 className="mb-0 text-primary">
                            {formatAmount(calculateTotals.totalAmount)}
                          </h4>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-bank-card-line text-primary fs-2"></i>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="card-animate rounded-4">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="text-muted mb-2">Montant Restant Dû</h6>
                          <h4 className="mb-0 text-warning">
                            {formatAmount(calculateTotals.totalRemaining)}
                          </h4>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-money-dollar-circle-line text-warning fs-2"></i>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="card-animate rounded-4">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="text-muted mb-2">Charges Mensuelles</h6>
                          <h4 className="mb-0 text-danger">
                            {formatAmount(calculateTotals.totalMonthlyPayments)}
                          </h4>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-calendar-event-line text-danger fs-2"></i>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="card-animate rounded-4">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="text-muted mb-2">Emprunts en Retard</h6>
                          <h4 className={`mb-0 ${calculateTotals.overdueLoans > 0 ? 'text-danger' : 'text-success'}`}>
                            {calculateTotals.overdueLoans}
                          </h4>
                        </div>
                        <div className="flex-shrink-0">
                          <i className={`ri-alarm-warning-line fs-2 ${calculateTotals.overdueLoans > 0 ? 'text-danger' : 'text-success'}`}></i>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Tableau principal - ARRONDI */}
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
                            Liste des Emprunts
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
                            Échéances à Venir
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
                                  Chargement des emprunts...
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
                              title="Aucun emprunt trouvé"
                              description={
                                searchTerm ||
                                filterStatus !== "all" ||
                                filterLender !== "all" ||
                                filterDuration !== "all"
                                  ? "Aucun résultat pour vos critères de recherche."
                                  : "Commencez par créer un nouvel emprunt."
                              }
                              actionButton={
                                <Button
                                  color="success"
                                  onClick={handleOpenAddModal}
                                  className="rounded-pill"
                                >
                                  <i className="ri-add-circle-line me-1"></i>
                                  Nouvel emprunt
                                </Button>
                              }
                              secondaryAction={
                                (searchTerm || filterStatus !== "all" || filterLender !== "all" || filterDuration !== "all") && (
                                  <Button
                                    color="outline-secondary"
                                    onClick={() => {
                                      setSearchTerm("");
                                      setFilterStatus("all");
                                      setFilterLender("all");
                                      setFilterDuration("all");
                                    }}
                                    className="rounded-pill"
                                  >
                                    <i className="ri-refresh-line me-1"></i>
                                    Réinitialiser les filtres
                                  </Button>
                                )
                              }
                            />
                          )}
                        </TabPane>

                        <TabPane tabId="2">
                          <EmptyDataCard
                            title="Échéances à Venir"
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
                          <Card className="rounded-4">
                            <CardBody>
                              <h5 className="card-title mb-3">
                                <i className="ri-guide-line me-2"></i>
                                Procédure de Gestion des Emprunts
                              </h5>

                              <div className="timeline-2">
                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-play-circle-line text-primary"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 1 : Identifier le besoin de financement
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Déterminez le montant, la durée et la finalité de l'emprunt.
                                    </p>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-bank-line text-info"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 2 : Choisir l'organisme prêteur
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Comparez les offres des différentes banques et institutions.
                                    </p>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-file-text-line text-warning"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 3 : Négocier les conditions
                                    </h6>
                                    <ul className="text-muted mb-0">
                                      <li>Taux d'intérêt</li>
                                      <li>Durée du prêt</li>
                                      <li>Périodicité des remboursements</li>
                                      <li>Garanties exigées</li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-hand-coin-line text-success"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 4 : Configurer la comptabilité
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Définissez les comptes comptables appropriés :
                                    </p>
                                    <ul className="text-muted">
                                      <li>Compte d'emprunt (classe 1)</li>
                                      <li>Compte de charges d'intérêts (classe 6)</li>
                                      <li>Compte de réclassement (classe 4)</li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="timeline-item">
                                  <div className="timeline-icon">
                                    <i className="ri-calendar-check-line text-success"></i>
                                  </div>
                                  <div className="timeline-content">
                                    <h6 className="mb-1">
                                      Étape 5 : Suivre les échéances
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Planifiez et respectez les échéances de remboursement.
                                      Suivez régulièrement le tableau d'amortissement.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Alert color="info" className="mt-4 rounded-4">
                                <h6 className="alert-heading">
                                  <i className="ri-lightbulb-line me-2"></i>
                                  Signification des termes
                                </h6>
                                <ul className="mb-0">
                                  <li>
                                    <strong>Capital</strong> = montant initial emprunté
                                  </li>
                                  <li>
                                    <strong>Intérêts</strong> = coût du prêt exprimé en pourcentage
                                  </li>
                                  <li>
                                    <strong>Amortissement</strong> = remboursement progressif du capital
                                  </li>
                                  <li>
                                    <strong>Tableau d'amortissement</strong> = échéancier détaillé des remboursements
                                  </li>
                                  <li>
                                    <strong>Taux d'intérêt</strong> = pourcentage annuel appliqué au capital restant dû
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

        {/* Modal de création/modification d'emprunt */}
        <Modal
          isOpen={modal}
          toggle={handleModalClose}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={handleModalClose}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-bank-card-line me-2"></i>
            {isEdit ? 'Modifier l\'emprunt' : 'Nouveau contrat d\'emprunt'}
          </ModalHeader>

          <Form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="loanName" className="form-label">
                      Nom de l'Emprunt <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="loanName"
                      name="loanName"
                      type="text"
                      placeholder="ex: Emprunt BIA 2025"
                      className="rounded-pill"
                      value={formik.values.loanName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.loanName && Boolean(formik.errors.loanName)}
                    />
                    {formik.touched.loanName && formik.errors.loanName && (
                      <FormFeedback>{formik.errors.loanName}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="lender" className="form-label">
                      Organisme Prêteur <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="lender"
                      name="lender"
                      value={LENDER_FILTER_OPTIONS.find(opt => opt.value === formik.values.lender) || null}
                      onChange={(selectedOption) => {
                        formik.setFieldValue('lender', selectedOption ? selectedOption.value : '');
                      }}
                      options={LENDER_FILTER_OPTIONS.filter(opt => opt.value !== "all")}
                      placeholder="Sélectionnez un organisme"
                      className="rounded-pill"
                      isInvalid={formik.touched.lender && Boolean(formik.errors.lender)}
                    />
                    {formik.touched.lender && formik.errors.lender && (
                      <div className="invalid-feedback d-block">{formik.errors.lender}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="amount" className="form-label">
                      Montant <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="25000000"
                      className="rounded-pill"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.amount && Boolean(formik.errors.amount)}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <FormFeedback>{formik.errors.amount}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="duration" className="form-label">
                      Durée <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="duration"
                      name="duration"
                      value={DURATION_OPTIONS.find(opt => opt.value.toString() === formik.values.duration) || null}
                      onChange={(selectedOption) => {
                        formik.setFieldValue('duration', selectedOption ? selectedOption.value : '');
                      }}
                      options={DURATION_OPTIONS}
                      placeholder="Sélectionnez la durée"
                      className="rounded-pill"
                      isInvalid={formik.touched.duration && Boolean(formik.errors.duration)}
                    />
                    {formik.touched.duration && formik.errors.duration && (
                      <div className="invalid-feedback d-block">{formik.errors.duration}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="startDate" className="form-label">
                      Date d'Obtention <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="rounded-pill"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.startDate && Boolean(formik.errors.startDate)}
                    />
                    {formik.touched.startDate && formik.errors.startDate && (
                      <FormFeedback>{formik.errors.startDate}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="interestRate" className="form-label">
                      Taux d'Intérêt Annuel (%) <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="7.5"
                      className="rounded-pill"
                      value={formik.values.interestRate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.interestRate && Boolean(formik.errors.interestRate)}
                    />
                    {formik.touched.interestRate && formik.errors.interestRate && (
                      <FormFeedback>{formik.errors.interestRate}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="repaymentPeriod" className="form-label">
                      Périodicité de Remboursement <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="repaymentPeriod"
                      name="repaymentPeriod"
                      type="select"
                      className="rounded-pill"
                      value={formik.values.repaymentPeriod}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.repaymentPeriod && Boolean(formik.errors.repaymentPeriod)}
                    >
                      <option value="">Sélectionnez une périodicité</option>
                      {REPAYMENT_PERIODS.map(period => (
                        <option key={period.value} value={period.value}>
                          {period.label}
                        </option>
                      ))}
                    </Input>
                    {formik.touched.repaymentPeriod && formik.errors.repaymentPeriod && (
                      <FormFeedback>{formik.errors.repaymentPeriod}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="loanAccount" className="form-label">
                      Compte d'Emprunt (Classe 1) <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="loanAccount"
                      name="loanAccount"
                      value={ACCOUNT_OPTIONS.find(opt => opt.value === formik.values.loanAccount) || null}
                      onChange={(selectedOption) => {
                        formik.setFieldValue('loanAccount', selectedOption ? selectedOption.value : '');
                      }}
                      options={ACCOUNT_OPTIONS.filter(acc => acc.value.startsWith('16'))}
                      placeholder="Sélectionnez un compte"
                      className="rounded-pill"
                      isInvalid={formik.touched.loanAccount && Boolean(formik.errors.loanAccount)}
                    />
                    {formik.touched.loanAccount && formik.errors.loanAccount && (
                      <div className="invalid-feedback d-block">{formik.errors.loanAccount}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="interestAccount" className="form-label">
                      Compte de Charges Intérêts (Classe 6) <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="interestAccount"
                      name="interestAccount"
                      value={ACCOUNT_OPTIONS.find(opt => opt.value === formik.values.interestAccount) || null}
                      onChange={(selectedOption) => {
                        formik.setFieldValue('interestAccount', selectedOption ? selectedOption.value : '');
                      }}
                      options={ACCOUNT_OPTIONS.filter(acc => acc.value.startsWith('6'))}
                      placeholder="Sélectionnez un compte"
                      className="rounded-pill"
                      isInvalid={formik.touched.interestAccount && Boolean(formik.errors.interestAccount)}
                    />
                    {formik.touched.interestAccount && formik.errors.interestAccount && (
                      <div className="invalid-feedback d-block">{formik.errors.interestAccount}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="reclassificationAccount" className="form-label">
                      Compte de Réclassement (Classe 4) <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="reclassificationAccount"
                      name="reclassificationAccount"
                      value={ACCOUNT_OPTIONS.find(opt => opt.value === formik.values.reclassificationAccount) || null}
                      onChange={(selectedOption) => {
                        formik.setFieldValue('reclassificationAccount', selectedOption ? selectedOption.value : '');
                      }}
                      options={ACCOUNT_OPTIONS.filter(acc => acc.value.startsWith('4'))}
                      placeholder="Sélectionnez un compte"
                      className="rounded-pill"
                      isInvalid={formik.touched.reclassificationAccount && Boolean(formik.errors.reclassificationAccount)}
                    />
                    {formik.touched.reclassificationAccount && formik.errors.reclassificationAccount && (
                      <div className="invalid-feedback d-block">{formik.errors.reclassificationAccount}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="amortizationFile" className="form-label">
                      Tableau d'Amortissement (PDF/Excel)
                    </Label>
                    <Input
                      id="amortizationFile"
                      name="amortizationFile"
                      type="file"
                      accept=".pdf,.xlsx,.xls"
                      className="rounded-pill"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        formik.setFieldValue('amortizationFile', file);
                      }}
                    />
                    <small className="text-muted">
                      Téléchargez le tableau d'amortissement fourni par la banque
                    </small>
                  </div>
                </Col>
              </Row>

              {/* Calcul prévisionnel */}
              {formik.values.amount && formik.values.interestRate && formik.values.duration && (
                <Alert color="info" className="mt-3 border-0 rounded-4">
                  <div className="d-flex align-items-center">
                    <i className="ri-calculator-line me-2"></i>
                    <div>
                      <strong>Calcul prévisionnel :</strong>
                      <div className="mt-2">
                        <Row>
                          <Col md={4}>
                            <small>Mensualité estimée :</small>
                            <div className="fw-bold text-primary">
                              {formatAmount(calculateMonthlyPayment(
                                parseFloat(formik.values.amount || 0),
                                parseFloat(formik.values.interestRate || 0),
                                parseInt(formik.values.duration || 0)
                              ))}
                            </div>
                          </Col>
                          <Col md={4}>
                            <small>Total intérêts :</small>
                            <div className="fw-bold text-warning">
                              {formatAmount(
                                calculateMonthlyPayment(
                                  parseFloat(formik.values.amount || 0),
                                  parseFloat(formik.values.interestRate || 0),
                                  parseInt(formik.values.duration || 0)
                                ) * parseInt(formik.values.duration || 0) - parseFloat(formik.values.amount || 0)
                              )}
                            </div>
                          </Col>
                          <Col md={4}>
                            <small>Coût total :</small>
                            <div className="fw-bold text-danger">
                              {formatAmount(
                                calculateMonthlyPayment(
                                  parseFloat(formik.values.amount || 0),
                                  parseFloat(formik.values.interestRate || 0),
                                  parseInt(formik.values.duration || 0)
                                ) * parseInt(formik.values.duration || 0)
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Alert>
              )}
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
                    {isEdit ? 'Modification en cours...' : 'Création en cours...'}
                  </>
                ) : (
                  <>
                    <i className={isEdit ? 'ri-edit-line me-1' : 'ri-save-line me-1'}></i>
                    {isEdit ? 'Modifier l\'emprunt' : 'Créer l\'emprunt'}
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de détails de l'emprunt */}
        <Modal
          isOpen={detailModal}
          toggle={handleDetailModalClose}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={handleDetailModalClose}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-information-line me-2"></i>
            Détails de l'emprunt
          </ModalHeader>

          <ModalBody>
            {selectedLoan && (
              <div>
                {/* En-tête */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Nom de l'Emprunt</h6>
                      <h4 className="fw-bold text-primary">{selectedLoan.loanName}</h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Statut</h6>
                      <Badge 
                        color={getStatusInfo(selectedLoan.status).color} 
                        className="rounded-pill fs-6 px-3 py-2"
                      >
                        {getStatusInfo(selectedLoan.status).label}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                {/* Informations principales */}
                <h6 className="border-bottom pb-2 mb-3">
                  <i className="ri-bank-card-line me-2"></i>
                  Informations du contrat
                </h6>
                
                <Row className="mb-4">
                  <Col md={6}>
                    <table className="table table-bordered table-striped mb-0 rounded">
                      <tbody>
                        <tr>
                          <th width="200">Organisme Prêteur</th>
                          <td className="fw-bold">{selectedLoan.lender}</td>
                        </tr>
                        <tr>
                          <th>Capital Initial</th>
                          <td className="fw-bold text-primary">{formatAmount(selectedLoan.amount)}</td>
                        </tr>
                        <tr>
                          <th>Montant Restant Dû</th>
                          <td className={`fw-bold ${selectedLoan.remainingAmount > 0 ? 'text-warning' : 'text-success'}`}>
                            {formatAmount(selectedLoan.remainingAmount)}
                          </td>
                        </tr>
                        <tr>
                          <th>Date d'Obtention</th>
                          <td>{formatDate(selectedLoan.startDate)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <table className="table table-bordered table-striped mb-0 rounded">
                      <tbody>
                        <tr>
                          <th width="200">Durée</th>
                          <td>
                            <Badge color="info">{getDurationLabel(selectedLoan.duration)}</Badge>
                          </td>
                        </tr>
                        <tr>
                          <th>Taux d'Intérêt</th>
                          <td className="fw-bold text-warning">{selectedLoan.interestRate}%</td>
                        </tr>
                        <tr>
                          <th>Périodicité</th>
                          <td>{getPeriodLabel(selectedLoan.repaymentPeriod)}</td>
                        </tr>
                        <tr>
                          <th>Prochaine Échéance</th>
                          <td className="fw-bold">
                            {selectedLoan.nextPaymentDate ? (
                              formatDate(selectedLoan.nextPaymentDate)
                            ) : (
                              <span className="text-muted">Terminé</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>

                {/* Comptes comptables */}
                <h6 className="border-bottom pb-2 mb-3">
                  <i className="ri-book-line me-2"></i>
                  Comptes comptables
                </h6>
                
                <Row className="mb-4">
                  <Col md={4}>
                    <Card className="border border-primary rounded-4">
                      <CardBody className="text-center">
                        <h6 className="text-primary">Compte d'Emprunt</h6>
                        <h4 className="fw-bold text-primary">{selectedLoan.loanAccount}</h4>
                        <small className="text-muted">Classe 1 - Capitaux</small>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border border-danger rounded-4">
                      <CardBody className="text-center">
                        <h6 className="text-danger">Compte Charges Intérêts</h6>
                        <h4 className="fw-bold text-danger">{selectedLoan.interestAccount}</h4>
                        <small className="text-muted">Classe 6 - Charges</small>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border border-warning rounded-4">
                      <CardBody className="text-center">
                        <h6 className="text-warning">Compte Réclassement</h6>
                        <h4 className="fw-bold text-warning">{selectedLoan.reclassificationAccount}</h4>
                        <small className="text-muted">Classe 4 - Tiers</small>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {/* Mensualité */}
                <div className="alert alert-primary border-0 mt-3 rounded-4">
                  <div className="d-flex align-items-center">
                    <i className="ri-money-dollar-circle-line me-2"></i>
                    <div>
                      <strong>Mensualité :</strong> {formatAmount(selectedLoan.monthlyPayment)}
                      <br />
                      <small>Montant à payer {getPeriodLabel(selectedLoan.repaymentPeriod).toLowerCase()}</small>
                    </div>
                    <Button
                      color="outline-primary"
                      className="ms-auto"
                      onClick={() => {
                        handleDetailModalClose();
                        handleOpenAmortizationModal(selectedLoan);
                      }}
                    >
                      <i className="ri-file-chart-fill me-1"></i>
                      Voir tableau d'amortissement
                    </Button>
                  </div>
                </div>
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

        {/* Modal tableau d'amortissement */}
        <Modal
          isOpen={amortizationModal}
          toggle={handleAmortizationModalClose}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="xl"
        >
          <ModalHeader
            toggle={handleAmortizationModalClose}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-file-chart-line me-2"></i>
            Tableau d'amortissement
          </ModalHeader>

          <ModalBody>
            {selectedLoan && (
              <div>
                <div className="alert alert-info border-0 mb-4 rounded-4">
                  <div className="d-flex align-items-center">
                    <i className="ri-information-line me-2"></i>
                    <div>
                      <strong>Emprunt :</strong> {selectedLoan.loanName}
                      <br />
                      <small>Capital : {formatAmount(selectedLoan.amount)} | Taux : {selectedLoan.interestRate}% | Durée : {getDurationLabel(selectedLoan.duration)}</small>
                    </div>
                  </div>
                </div>

                {selectedLoan.amortizationFile ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="ri-file-pdf-fill text-danger fs-1 mb-3"></i>
                      <h5>Tableau d'amortissement disponible</h5>
                      <p className="text-muted">Fichier : {selectedLoan.amortizationFile}</p>
                      <Button color="primary" className="me-2">
                        <i className="ri-download-line me-1"></i>
                        Télécharger
                      </Button>
                      <Button color="outline-secondary">
                        <i className="ri-printer-line me-1"></i>
                        Imprimer
                      </Button>
                    </div>

                    {/* Aperçu du tableau d'amortissement */}
                    <div className="table-responsive">
                      <Table striped bordered hover className="rounded">
                        <thead className="table-light">
                          <tr>
                            <th>Échéance</th>
                            <th>Capital restant</th>
                            <th>Intérêts</th>
                            <th>Capital remboursé</th>
                            <th>Mensualité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Première année d'amortissement */}
                          {[1, 2, 3, 6, 12].map((month) => (
                            <tr key={month}>
                              <td>Échéance {month}</td>
                              <td className="text-end">
                                {formatAmount(selectedLoan.amount * (1 - (month-1)/selectedLoan.duration))}
                              </td>
                              <td className="text-end text-danger">
                                {formatAmount(selectedLoan.amount * selectedLoan.interestRate/100 / 12)}
                              </td>
                              <td className="text-end text-success">
                                {formatAmount(selectedLoan.amount / selectedLoan.duration)}
                              </td>
                              <td className="text-end fw-bold">
                                {formatAmount(selectedLoan.monthlyPayment)}
                              </td>
                            </tr>
                          ))}
                          <tr className="table-dark">
                            <td>TOTAL</td>
                            <td className="text-end">-</td>
                            <td className="text-end">
                              {formatAmount(selectedLoan.monthlyPayment * selectedLoan.duration - selectedLoan.amount)}
                            </td>
                            <td className="text-end">
                              {formatAmount(selectedLoan.amount)}
                            </td>
                            <td className="text-end">
                              {formatAmount(selectedLoan.monthlyPayment * selectedLoan.duration)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="ri-file-warning-line text-warning fs-1 mb-3"></i>
                    <h5>Aucun tableau d'amortissement disponible</h5>
                    <p className="text-muted mb-4">
                      Aucun fichier n'a été importé pour cet emprunt.
                      Vous pouvez télécharger le tableau fourni par la banque.
                    </p>
                    <Button color="primary">
                      <i className="ri-upload-line me-1"></i>
                      Importer un tableau d'amortissement
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ModalBody>

          <ModalFooter className="rounded-bottom-4">
            <Button
              className="btn btn-light rounded-pill"
              onClick={handleAmortizationModalClose}
            >
              Fermer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default FinancementsEmprunts;