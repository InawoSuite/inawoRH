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
  Alert,
  Progress,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
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
import { CustomSelect } from "../../Components/Common/CustomSelectStyles";

// Types de comptes comptables
const ACCOUNT_TYPES = [
  { value: "revenue", label: "Recettes", color: "success" },
  { value: "expense", label: "Dépenses", color: "danger" },
  { value: "investment", label: "Investissements", color: "info" },
  { value: "overhead", label: "Frais généraux", color: "warning" },
  { value: "personnel", label: "Personnel", color: "primary" },
];

// Périodes budgétaires
const BUDGET_PERIODS = [
  { value: "annual", label: "Annuel" },
  { value: "quarterly", label: "Trimestriel" },
  { value: "monthly", label: "Mensuel" },
];

// Méthodes de répartition
const DISTRIBUTION_METHODS = [
  { value: "linear", label: "Linéaire" },
  { value: "seasonal", label: "Saisonnier" },
  { value: "manual", label: "Manuel" },
  { value: "percentage", label: "Par pourcentage" },
];

// Centres de coût / Départements
const COST_CENTERS = [
  { id: 1, code: "ADM", name: "Administration" },
  { id: 2, code: "VENT", name: "Ventes & Marketing" },
  { id: 3, code: "PROD", name: "Production" },
  { id: 4, code: "RH", name: "Ressources Humaines" },
  { id: 5, code: "FIN", name: "Finances" },
  { id: 6, code: "LOG", name: "Logistique" },
];

// Projets
const PROJECTS = [
  { id: 1, code: "PROJ-001", name: "Développement produit A" },
  { id: 2, code: "PROJ-002", name: "Expansion marché" },
  { id: 3, code: "PROJ-003", name: "Digitalisation interne" },
  { id: 4, code: "PROJ-004", name: "Formation personnel" },
];

// Exercices budgétaires
const FISCAL_YEARS = [
  {
    id: 1,
    year: 2024,
    status: "closed",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: 2,
    year: 2025,
    status: "current",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  },
  {
    id: 3,
    year: 2026,
    status: "planned",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
];

// DONNÉES FICTIVES POUR LES LIGNES BUDGÉTAIRES
const MOCK_BUDGET_LINES = [
  {
    id: 1,
    accountNumber: "701",
    accountName: "Ventes de marchandises",
    accountType: "revenue",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 50000000,
    actualAmount: 42500000,
    january: { budget: 4166667, actual: 3500000 },
    february: { budget: 4166667, actual: 3800000 },
    march: { budget: 4166667, actual: 4200000 },
    april: { budget: 4166667, actual: 4000000 },
    may: { budget: 4166667, actual: 4100000 },
    june: { budget: 4166667, actual: 3900000 },
    july: { budget: 4166667, actual: 3800000 },
    august: { budget: 4166667, actual: 3700000 },
    september: { budget: 4166667, actual: 3600000 },
    october: { budget: 4166667, actual: 3500000 },
    november: { budget: 4166667, actual: 3400000 },
    december: { budget: 4166667, actual: 3300000 },
    costCenterId: 2,
    costCenterName: "Ventes & Marketing",
    projectId: 2,
    projectName: "Expansion marché",
    distributionMethod: "linear",
    budgetOwner: "Jean Dupont",
    status: "validated",
    comments: "Objectif de croissance de 10% par rapport à 2024",
    variance: -7500000,
    variancePercentage: -15,
    lastUpdated: "2025-08-15",
  },
  {
    id: 2,
    accountNumber: "611",
    accountName: "Achats de marchandises",
    accountType: "expense",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 25000000,
    actualAmount: 23000000,
    january: { budget: 2083333, actual: 2000000 },
    february: { budget: 2083333, actual: 1900000 },
    march: { budget: 2083333, actual: 2100000 },
    april: { budget: 2083333, actual: 1950000 },
    may: { budget: 2083333, actual: 2050000 },
    june: { budget: 2083333, actual: 1850000 },
    july: { budget: 2083333, actual: 1900000 },
    august: { budget: 2083333, actual: 1950000 },
    september: { budget: 2083333, actual: 1850000 },
    october: { budget: 2083333, actual: 1800000 },
    november: { budget: 2083333, actual: 1750000 },
    december: { budget: 2083333, actual: 1700000 },
    costCenterId: 3,
    costCenterName: "Production",
    projectId: null,
    projectName: null,
    distributionMethod: "linear",
    budgetOwner: "Marie Curie",
    status: "validated",
    comments: "Optimisation des achats groupés",
    variance: -2000000,
    variancePercentage: -8,
    lastUpdated: "2025-08-10",
  },
  {
    id: 3,
    accountNumber: "641",
    accountName: "Salaires et charges sociales",
    accountType: "personnel",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 15000000,
    actualAmount: 15500000,
    january: { budget: 1250000, actual: 1250000 },
    february: { budget: 1250000, actual: 1250000 },
    march: { budget: 1250000, actual: 1300000 },
    april: { budget: 1250000, actual: 1250000 },
    may: { budget: 1250000, actual: 1300000 },
    june: { budget: 1250000, actual: 1250000 },
    july: { budget: 1250000, actual: 1300000 },
    august: { budget: 1250000, actual: 1350000 },
    september: { budget: 1250000, actual: 1300000 },
    october: { budget: 1250000, actual: 1300000 },
    november: { budget: 1250000, actual: 1350000 },
    december: { budget: 1250000, actual: 1400000 },
    costCenterId: 4,
    costCenterName: "Ressources Humaines",
    projectId: 4,
    projectName: "Formation personnel",
    distributionMethod: "linear",
    budgetOwner: "Sophie Laurent",
    status: "validated",
    comments: "Inclut les augmentations salariales prévues",
    variance: 500000,
    variancePercentage: 3.33,
    lastUpdated: "2025-08-12",
  },
  {
    id: 4,
    accountNumber: "613",
    accountName: "Loyers et charges locatives",
    accountType: "expense",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 6000000,
    actualAmount: 6000000,
    january: { budget: 500000, actual: 500000 },
    february: { budget: 500000, actual: 500000 },
    march: { budget: 500000, actual: 500000 },
    april: { budget: 500000, actual: 500000 },
    may: { budget: 500000, actual: 500000 },
    june: { budget: 500000, actual: 500000 },
    july: { budget: 500000, actual: 500000 },
    august: { budget: 500000, actual: 500000 },
    september: { budget: 500000, actual: 500000 },
    october: { budget: 500000, actual: 500000 },
    november: { budget: 500000, actual: 500000 },
    december: { budget: 500000, actual: 500000 },
    costCenterId: 1,
    costCenterName: "Administration",
    projectId: null,
    projectName: null,
    distributionMethod: "linear",
    budgetOwner: "Thomas Bernard",
    status: "validated",
    comments: "Contrat de location fixe",
    variance: 0,
    variancePercentage: 0,
    lastUpdated: "2025-08-05",
  },
  {
    id: 5,
    accountNumber: "615",
    accountName: "Électricité, eau, téléphone",
    accountType: "overhead",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 3000000,
    actualAmount: 2800000,
    january: { budget: 250000, actual: 230000 },
    february: { budget: 250000, actual: 240000 },
    march: { budget: 250000, actual: 250000 },
    april: { budget: 250000, actual: 240000 },
    may: { budget: 250000, actual: 230000 },
    june: { budget: 250000, actual: 220000 },
    july: { budget: 250000, actual: 210000 },
    august: { budget: 250000, actual: 220000 },
    september: { budget: 250000, actual: 230000 },
    october: { budget: 250000, actual: 240000 },
    november: { budget: 250000, actual: 250000 },
    december: { budget: 250000, actual: 240000 },
    costCenterId: 1,
    costCenterName: "Administration",
    projectId: null,
    projectName: null,
    distributionMethod: "seasonal",
    budgetOwner: "Thomas Bernard",
    status: "validated",
    comments: "Économies réalisées grâce aux nouvelles installations",
    variance: -200000,
    variancePercentage: -6.67,
    lastUpdated: "2025-08-08",
  },
  {
    id: 6,
    accountNumber: "621",
    accountName: "Publicité et communication",
    accountType: "expense",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 8000000,
    actualAmount: 9500000,
    january: { budget: 666667, actual: 700000 },
    february: { budget: 666667, actual: 750000 },
    march: { budget: 666667, actual: 800000 },
    april: { budget: 666667, actual: 850000 },
    may: { budget: 666667, actual: 900000 },
    june: { budget: 666667, actual: 850000 },
    july: { budget: 666667, actual: 800000 },
    august: { budget: 666667, actual: 900000 },
    september: { budget: 666667, actual: 950000 },
    october: { budget: 666667, actual: 1000000 },
    november: { budget: 666667, actual: 1100000 },
    december: { budget: 666667, actual: 1200000 },
    costCenterId: 2,
    costCenterName: "Ventes & Marketing",
    projectId: 2,
    projectName: "Expansion marché",
    distributionMethod: "seasonal",
    budgetOwner: "Jean Dupont",
    status: "validated",
    comments: "Campagne marketing renforcée",
    variance: 1500000,
    variancePercentage: 18.75,
    lastUpdated: "2025-08-14",
  },
  {
    id: 7,
    accountNumber: "628",
    accountName: "Formation du personnel",
    accountType: "investment",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 2000000,
    actualAmount: 1500000,
    january: { budget: 166667, actual: 100000 },
    february: { budget: 166667, actual: 120000 },
    march: { budget: 166667, actual: 140000 },
    april: { budget: 166667, actual: 150000 },
    may: { budget: 166667, actual: 130000 },
    june: { budget: 166667, actual: 125000 },
    july: { budget: 166667, actual: 110000 },
    august: { budget: 166667, actual: 105000 },
    september: { budget: 166667, actual: 100000 },
    october: { budget: 166667, actual: 95000 },
    november: { budget: 166667, actual: 90000 },
    december: { budget: 166667, actual: 85000 },
    costCenterId: 4,
    costCenterName: "Ressources Humaines",
    projectId: 4,
    projectName: "Formation personnel",
    distributionMethod: "manual",
    budgetOwner: "Sophie Laurent",
    status: "validated",
    comments: "Budget sous-utilisé",
    variance: -500000,
    variancePercentage: -25,
    lastUpdated: "2025-08-11",
  },
  {
    id: 8,
    accountNumber: "633",
    accountName: "Entretien et réparations",
    accountType: "expense",
    fiscalYear: 2025,
    period: "annual",
    budgetAmount: 1500000,
    actualAmount: 1800000,
    january: { budget: 125000, actual: 140000 },
    february: { budget: 125000, actual: 130000 },
    march: { budget: 125000, actual: 150000 },
    april: { budget: 125000, actual: 160000 },
    may: { budget: 125000, actual: 170000 },
    june: { budget: 125000, actual: 180000 },
    july: { budget: 125000, actual: 190000 },
    august: { budget: 125000, actual: 200000 },
    september: { budget: 125000, actual: 190000 },
    october: { budget: 125000, actual: 180000 },
    november: { budget: 125000, actual: 170000 },
    december: { budget: 125000, actual: 160000 },
    costCenterId: 6,
    costCenterName: "Logistique",
    projectId: null,
    projectName: null,
    distributionMethod: "seasonal",
    budgetOwner: "Pierre Martin",
    status: "validated",
    comments: "Coûts de maintenance imprévus",
    variance: 300000,
    variancePercentage: 20,
    lastUpdated: "2025-08-13",
  },
];

const Budget = () => {
  const { t } = useTranslation();

  // États principaux
  const [budgetLines, setBudgetLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2025");

  // États des modals
  const [budgetModal, setBudgetModal] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBudgetLine, setSelectedBudgetLine] = useState(null);
  const [importModal, setImportModal] = useState(false);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // États pour les filtres
  const [filterFiscalYear, setFilterFiscalYear] = useState("all");
  const [filterAccountType, setFilterAccountType] = useState("all");
  const [filterCostCenter, setFilterCostCenter] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  // ✅ Fonction pour formater les pourcentages
  const formatPercentage = useCallback((percentage) => {
    if (percentage === null || percentage === undefined) return "-";
    return percentage.toFixed(2) + "%";
  }, []);

  // ✅ Fonction pour formater les dates
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // ✅ Fonction pour obtenir les infos du type de compte
  const getAccountTypeInfo = useCallback((type) => {
    const typeInfo = ACCOUNT_TYPES.find((t) => t.value === type);
    return typeInfo || { label: "Inconnu", color: "secondary" };
  }, []);

  // ✅ Fonction pour obtenir la couleur de l'écart
  const getVarianceColor = useCallback((variance) => {
    if (variance === null || variance === undefined) return "secondary";
    if (variance > 0) return "danger"; // Dépassement (mauvais pour dépenses, bon pour recettes)
    if (variance < 0) return "success"; // Sous-utilisation (bon pour dépenses, mauvais pour recettes)
    return "primary"; // Équilibre
  }, []);

  // ✅ Fonction pour obtenir l'icône de l'écart
  const getVarianceIcon = useCallback((variance) => {
    if (variance === null || variance === undefined) return "ri-question-line";
    if (variance > 0) return "ri-arrow-up-line";
    if (variance < 0) return "ri-arrow-down-line";
    return "ri-check-line";
  }, []);

  // ✅ Fonction pour obtenir le libellé du statut
  const getStatusInfo = useCallback((status) => {
    const statusInfo = {
      draft: { label: "Brouillon", color: "warning", icon: "ri-draft-line" },
      validated: {
        label: "Validé",
        color: "success",
        icon: "ri-checkbox-circle-line",
      },
      locked: { label: "Verrouillé", color: "danger", icon: "ri-lock-line" },
      archived: {
        label: "Archivé",
        color: "secondary",
        icon: "ri-archive-line",
      },
    };
    return (
      statusInfo[status] || {
        label: "Inconnu",
        color: "secondary",
        icon: "ri-question-line",
      }
    );
  }, []);

  // ✅ Calcul des totaux
  const calculateTotals = useMemo(() => {
    const totals = {
      totalBudget: 0,
      totalActual: 0,
      totalVariance: 0,
      revenueBudget: 0,
      revenueActual: 0,
      expenseBudget: 0,
      expenseActual: 0,
      completionRate: 0,
    };

    budgetLines.forEach((line) => {
      totals.totalBudget += line.budgetAmount || 0;
      totals.totalActual += line.actualAmount || 0;
      totals.totalVariance += line.variance || 0;

      if (line.accountType === "revenue") {
        totals.revenueBudget += line.budgetAmount || 0;
        totals.revenueActual += line.actualAmount || 0;
      } else {
        totals.expenseBudget += line.budgetAmount || 0;
        totals.expenseActual += line.actualAmount || 0;
      }
    });

    if (totals.totalBudget > 0) {
      totals.completionRate = (totals.totalActual / totals.totalBudget) * 100;
    }

    return totals;
  }, [budgetLines]);

  // ✅ Filtrage optimisé des lignes budgétaires
  const filteredData = useMemo(() => {
    let filtered = budgetLines;

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (line) =>
          line.accountNumber.toLowerCase().includes(lowerSearchTerm) ||
          line.accountName.toLowerCase().includes(lowerSearchTerm) ||
          line.costCenterName?.toLowerCase().includes(lowerSearchTerm) ||
          line.budgetOwner.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filtre par exercice fiscal
    if (filterFiscalYear !== "all") {
      filtered = filtered.filter(
        (line) => line.fiscalYear === parseInt(filterFiscalYear)
      );
    }

    // Filtre par type de compte
    if (filterAccountType !== "all") {
      filtered = filtered.filter(
        (line) => line.accountType === filterAccountType
      );
    }

    // Filtre par centre de coût
    if (filterCostCenter !== "all") {
      filtered = filtered.filter(
        (line) => line.costCenterId === parseInt(filterCostCenter)
      );
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((line) => line.status === filterStatus);
    }

    return filtered;
  }, [
    budgetLines,
    searchTerm,
    filterFiscalYear,
    filterAccountType,
    filterCostCenter,
    filterStatus,
  ]);

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
        setBudgetLines(MOCK_BUDGET_LINES);

        // Préparer les données pour l'export
        const exportDataFormatted = MOCK_BUDGET_LINES.map((item) => ({
          Compte: item.accountNumber,
          Intitulé: item.accountName,
          Type: getAccountTypeInfo(item.accountType).label,
          Exercice: item.fiscalYear,
          Budget: formatAmount(item.budgetAmount),
          Réalisation: formatAmount(item.actualAmount),
          Écart: formatAmount(item.variance),
          "% Écart": formatPercentage(item.variancePercentage),
          "Centre de coût": item.costCenterName,
          Responsable: item.budgetOwner,
          Statut: getStatusInfo(item.status).label,
        }));
        setExportData(exportDataFormatted);

        toast.success("Données budgétaires chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchData:", err);
        toast.error("Erreur lors du chargement des données");
        setBudgetLines([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [formatAmount, formatPercentage, getAccountTypeInfo, getStatusInfo]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Gestion Budgétaire | INAWO - Suite de Gestion";
    fetchData();
  }, [fetchData]);

  // ✅ Reset de la pagination lors des changements
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    activeTab,
    filterFiscalYear,
    filterAccountType,
    filterCostCenter,
    filterStatus,
  ]);

  // ✅ Validation du formulaire de création de ligne budgétaire
  const budgetValidationSchema = Yup.object({
    accountNumber: Yup.string()
      .required("Le numéro de compte est requis")
      .matches(/^[0-9]{3,6}$/, "Numéro de compte invalide (3-6 chiffres)"),
    accountName: Yup.string().required("L'intitulé du compte est requis"),
    accountType: Yup.string().required("Le type de compte est requis"),
    fiscalYear: Yup.number()
      .required("L'exercice fiscal est requis")
      .min(2000, "Année invalide"),
    period: Yup.string().required("La période est requise"),
    budgetAmount: Yup.number()
      .required("Le montant budgété est requis")
      .min(0, "Le montant ne peut pas être négatif"),
    distributionMethod: Yup.string().required(
      "La méthode de répartition est requise"
    ),
    costCenterId: Yup.string().required("Le centre de coût est requis"),
    budgetOwner: Yup.string().required("Le responsable budgétaire est requis"),
  });

  // ✅ Formik pour le formulaire de ligne budgétaire
  const budgetFormik = useFormik({
    initialValues: {
      accountNumber: "",
      accountName: "",
      accountType: "",
      fiscalYear: new Date().getFullYear(),
      period: "annual",
      budgetAmount: "",
      distributionMethod: "linear",
      costCenterId: "",
      projectId: "",
      budgetOwner: "",
      comments: "",
    },
    validationSchema: budgetValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitBudgetLine(values, resetForm, setSubmitting);
    },
  });

  // ✅ Formik pour la configuration
  const configFormik = useFormik({
    initialValues: {
      fiscalYear: "",
      startDate: "",
      endDate: "",
      currency: "",
      budgetMethod: "account",
      enableCostCenters: true,
      enableProjects: true,
      enableAnalytics: true,
    },
    validationSchema: Yup.object({
      fiscalYear: Yup.number()
        .required("L'exercice fiscal est requis")
        .min(2000, "Année invalide"),
      startDate: Yup.date().required("La date de début est requise"),
      endDate: Yup.date()
        .required("La date de fin est requise")
        .min(
          Yup.ref("startDate"),
          "La date de fin doit être après la date de début"
        ),
      currency: Yup.string().required("La devise est requise"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleConfigureBudget(values, resetForm, setSubmitting);
    },
  });

  // ✅ Soumission d'une ligne budgétaire (MOCK)
  const handleSubmitBudgetLine = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);

    setTimeout(() => {
      try {
        const costCenter = COST_CENTERS.find(
          (c) => c.id === parseInt(values.costCenterId)
        );
        const project = values.projectId
          ? PROJECTS.find((p) => p.id === parseInt(values.projectId))
          : null;
        const accountTypeInfo = getAccountTypeInfo(values.accountType);

        const newBudgetLine = {
          id: budgetLines.length + 1,
          accountNumber: values.accountNumber,
          accountName: values.accountName,
          accountType: values.accountType,
          fiscalYear: parseInt(values.fiscalYear),
          period: values.period,
          budgetAmount: parseFloat(values.budgetAmount),
          actualAmount: 0,
          january: { budget: 0, actual: 0 },
          february: { budget: 0, actual: 0 },
          march: { budget: 0, actual: 0 },
          april: { budget: 0, actual: 0 },
          may: { budget: 0, actual: 0 },
          june: { budget: 0, actual: 0 },
          july: { budget: 0, actual: 0 },
          august: { budget: 0, actual: 0 },
          september: { budget: 0, actual: 0 },
          october: { budget: 0, actual: 0 },
          november: { budget: 0, actual: 0 },
          december: { budget: 0, actual: 0 },
          costCenterId: parseInt(values.costCenterId),
          costCenterName: costCenter?.name || "Inconnu",
          projectId: project?.id || null,
          projectName: project?.name || null,
          distributionMethod: values.distributionMethod,
          budgetOwner: values.budgetOwner,
          status: "draft",
          comments: values.comments,
          variance: 0,
          variancePercentage: 0,
          lastUpdated: new Date().toISOString().split("T")[0],
        };

        setBudgetLines((prev) => [newBudgetLine, ...prev]);
        toast.success("Ligne budgétaire créée avec succès !");
        resetForm();
        setBudgetModal(false);
      } catch (err) {
        console.error("Erreur lors de la création de ligne budgétaire:", err);
        toast.error("Erreur lors de la création de la ligne budgétaire");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Configuration du budget (MOCK)
  const handleConfigureBudget = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);

    setTimeout(() => {
      try {
        const newFiscalYear = {
          id: FISCAL_YEARS.length + 1,
          year: parseInt(values.fiscalYear),
          status: "planned",
          startDate: values.startDate,
          endDate: values.endDate,
        };

        toast.success("Configuration budgétaire enregistrée !");
        resetForm();
        setConfigModal(false);
      } catch (err) {
        console.error("Erreur lors de la configuration:", err);
        toast.error("Erreur lors de la configuration budgétaire");
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de suppression (MOCK)
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;

    setTimeout(() => {
      try {
        const updatedData = budgetLines.filter(
          (item) => item.id !== itemToDelete.id
        );
        setBudgetLines(updatedData);
        toast.success("Ligne budgétaire supprimée avec succès !");

        setDeleteModal(false);
        setItemToDelete(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleOpenBudgetModal = useCallback(() => {
    budgetFormik.resetForm();
    budgetFormik.setValues({
      accountNumber: "",
      accountName: "",
      accountType: "",
      fiscalYear: new Date().getFullYear(),
      period: "annual",
      budgetAmount: "",
      distributionMethod: "linear",
      costCenterId: "",
      projectId: "",
      budgetOwner: "",
      comments: "",
    });
    setIsEdit(false);
    setBudgetModal(true);
  }, [budgetFormik]);

  const handleOpenConfigModal = useCallback(() => {
    configFormik.resetForm();
    configFormik.setValues({
      fiscalYear: new Date().getFullYear() + 1,
      startDate: new Date(new Date().getFullYear() + 1, 0, 1)
        .toISOString()
        .split("T")[0],
      endDate: new Date(new Date().getFullYear() + 1, 11, 31)
        .toISOString()
        .split("T")[0],
      currency: "",
      budgetMethod: "account",
      enableCostCenters: true,
      enableProjects: true,
      enableAnalytics: true,
    });
    setConfigModal(true);
  }, [configFormik]);

  const handleOpenDetailModal = useCallback((budgetLine) => {
    setSelectedBudgetLine(budgetLine);
    setDetailModal(true);
  }, []);

  const handleOpenDeleteModal = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  }, []);

  // ✅ Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilterFiscalYear("all");
    setFilterAccountType("all");
    setFilterCostCenter("all");
    setFilterStatus("all");
    setSearchTerm("");
  }, []);

  // ✅ Colonnes pour le tableau principal - UNIFORME POUR TOUS LES ONGLETS
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
        header: "Compte",
        accessorKey: "accountNumber",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div>
            <span className="fw-semibold text-primary">
              {row.original.accountNumber}
            </span>
            <div className="small text-muted">{row.original.accountName}</div>
          </div>
        ),
        size: 120,
      },
      {
        header: "Type",
        accessorKey: "accountType",
        enableColumnFilter: false,
        cell: (cell) => {
          const typeInfo = getAccountTypeInfo(cell.getValue());
          return (
            <Badge color={typeInfo.color} className="rounded-pill">
              {typeInfo.label}
            </Badge>
          );
        },
        size: 100,
      },
      {
        header: "Centre de coût",
        accessorKey: "costCenterName",
        enableColumnFilter: false,
        cell: (cell) => (
          <div>{cell.getValue() || <span className="text-muted">-</span>}</div>
        ),
        size: 130,
      },
      {
        header: "Prévision",
        accessorKey: "budgetAmount",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
        ),
        size: 120,
      },
      {
        header: "Réalisation",
        accessorKey: "actualAmount",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
        ),
        size: 120,
      },
      {
        header: "Écart",
        accessorKey: "variance",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const item = row.original;
          const varianceColor = getVarianceColor(item.variance);
          const varianceIcon = getVarianceIcon(item.variance);

          return (
            <div>
              <Badge color={varianceColor} className="rounded-pill">
                <i className={`${varianceIcon} me-1`}></i>
                {formatAmount(item.variance)}
              </Badge>
              <div className="mt-1">
                <small
                  className={`fw-medium ${
                    varianceColor === "success"
                      ? "text-success"
                      : varianceColor === "danger"
                      ? "text-danger"
                      : "text-muted"
                  }`}
                >
                  {formatPercentage(item.variancePercentage)}
                </small>
              </div>
            </div>
          );
        },
        size: 140,
      },
      {
        header: "Taux réalisation",
        accessorKey: "completionRate",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const item = row.original;
          const completionRate =
            item.budgetAmount > 0
              ? (item.actualAmount / item.budgetAmount) * 100
              : 0;
          const color =
            completionRate >= 90
              ? "success"
              : completionRate >= 70
              ? "warning"
              : "danger";

          return (
            <div>
              <div className="d-flex align-items-center">
                <Progress
                  value={completionRate}
                  max={100}
                  color={color}
                  className="w-100"
                  style={{ height: "8px" }}
                />
              </div>
              <small className={`fw-medium text-${color}`}>
                {completionRate.toFixed(1)}%
              </small>
            </div>
          );
        },
        size: 140,
      },
      {
        header: "Statut",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          const statusInfo = getStatusInfo(cell.getValue());
          return (
            <Badge className={`${statusInfo.color} fw-medium rounded-pill`}>
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

              {item.status !== "locked" && (
                <>
                  <Link
                    to="#"
                    className="text-warning"
                    onClick={(e) => {
                      e.preventDefault();
                      // handleOpenEditModal(item);
                    }}
                    title="Modifier"
                  >
                    <i className="ri-pencil-fill fs-16"></i>
                  </Link>

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
                </>
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
      formatPercentage,
      getAccountTypeInfo,
      getVarianceColor,
      getVarianceIcon,
      getStatusInfo,
      handleOpenDetailModal,
      handleOpenDeleteModal,
    ]
  );

  // ✅ Données pour l'onglet Configuration (exemples d'exercices budgétaires)
  const fiscalYearsData = useMemo(() => {
    return FISCAL_YEARS.map((year) => {
      const yearLines = budgetLines.filter(
        (line) => line.fiscalYear === year.year
      );
      const budgetTotal = yearLines.reduce(
        (sum, line) => sum + line.budgetAmount,
        0
      );
      const actualTotal = yearLines.reduce(
        (sum, line) => sum + line.actualAmount,
        0
      );
      const variance = actualTotal - budgetTotal;
      const variancePercentage =
        budgetTotal > 0 ? (variance / budgetTotal) * 100 : 0;
      const completionRate =
        budgetTotal > 0 ? (actualTotal / budgetTotal) * 100 : 0;

      return {
        ...year,
        budgetTotal,
        actualTotal,
        variance,
        variancePercentage,
        completionRate,
        linesCount: yearLines.length,
      };
    });
  }, [budgetLines]);

  // Périodes fiscales
  const FISCAL_PERIODS = [
    { value: "2023", label: "Exercice 2022" },
    { value: "2024", label: "Exercice 2024" },
    { value: "2025", label: "Exercice 2026" },
  ];

  // ✅ Colonnes pour l'onglet Configuration (même structure)
  const configColumns = useMemo(
    () => [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => {
          const globalIndex = cell.row.index + 1;
          return <span className="fw-medium">{globalIndex}</span>;
        },
        size: 60,
      },
      {
        header: "Exercice",
        accessorKey: "year",
        enableColumnFilter: false,
        cell: (cell) => (
          <div>
            <span className="fw-semibold text-primary">{cell.getValue()}</span>
            <div className="small text-muted">
              {formatDate(cell.row.original.startDate)} -{" "}
              {formatDate(cell.row.original.endDate)}
            </div>
          </div>
        ),
        size: 120,
      },
      {
        header: "Statut",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          const status = cell.getValue();
          const statusConfig = {
            current: {
              label: "En cours",
              color: "success",
              icon: "ri-play-circle-line",
            },
            planned: {
              label: "Planifié",
              color: "warning",
              icon: "ri-time-line",
            },
            closed: {
              label: "Clôturé",
              color: "secondary",
              icon: "ri-check-double-line",
            },
          };
          const config = statusConfig[status] || {
            label: "Inconnu",
            color: "secondary",
            icon: "ri-question-line",
          };

          return (
            <Badge className={`${config.color} fw-medium rounded-pill`}>
              <i className={`${config.icon} me-1`}></i>
              {config.label}
            </Badge>
          );
        },
        size: 100,
      },
      {
        header: "Prévision",
        accessorKey: "budgetTotal",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
        ),
        size: 120,
      },
      {
        header: "Réalisation",
        accessorKey: "actualTotal",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
        ),
        size: 120,
      },
      {
        header: "Écart",
        accessorKey: "variance",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const item = row.original;
          const varianceColor = getVarianceColor(item.variance);
          const varianceIcon = getVarianceIcon(item.variance);

          return (
            <div>
              <Badge color={varianceColor} className="rounded-pill">
                <i className={`${varianceIcon} me-1`}></i>
                {formatAmount(item.variance)}
              </Badge>
              <div className="mt-1">
                <small
                  className={`fw-medium ${
                    varianceColor === "success"
                      ? "text-success"
                      : varianceColor === "danger"
                      ? "text-danger"
                      : "text-muted"
                  }`}
                >
                  {formatPercentage(item.variancePercentage)}
                </small>
              </div>
            </div>
          );
        },
        size: 140,
      },
      {
        header: "Taux réalisation",
        accessorKey: "completionRate",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const item = row.original;
          const color =
            item.completionRate >= 90
              ? "success"
              : item.completionRate >= 70
              ? "warning"
              : "danger";

          return (
            <div>
              <div className="d-flex align-items-center">
                <Progress
                  value={item.completionRate}
                  max={100}
                  color={color}
                  className="w-100"
                  style={{ height: "8px" }}
                />
              </div>
              <small className={`fw-medium text-${color}`}>
                {item.completionRate.toFixed(1)}%
              </small>
            </div>
          );
        },
        size: 140,
      },
      {
        header: "Lignes",
        accessorKey: "linesCount",
        enableColumnFilter: false,
        cell: (cell) => (
          <Badge color="info" className="fw-medium rounded-pill">
            {cell.getValue()}
          </Badge>
        ),
        size: 80,
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
                  toast.info(`Consultation de l'exercice ${item.year}`);
                }}
                title="Consulter"
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>

              <Link
                to="#"
                className="text-success"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.status !== "closed") {
                    toast.info(`Duplication de l'exercice ${item.year}`);
                  }
                }}
                title="Dupliquer"
                style={{ opacity: item.status === "closed" ? 0.5 : 1 }}
              >
                <i className="ri-file-copy-fill fs-16"></i>
              </Link>

              {item.status !== "closed" && (
                <Link
                  to="#"
                  className="text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info(`Configuration de l'exercice ${item.year}`);
                  }}
                  title="Configurer"
                >
                  <i className="ri-settings-3-fill fs-16"></i>
                </Link>
              )}
            </div>
          );
        },
        size: 100,
      },
    ],
    [
      formatAmount,
      formatPercentage,
      formatDate,
      getVarianceColor,
      getVarianceIcon,
    ]
  );

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
            filename="Budget_Comparatif"
          />

          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteItem}
            onCloseClick={() => {
              setDeleteModal(false);
              setItemToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cette ligne budgétaire ? Cette action est irréversible."
          />

          <BreadCrumb
            title={`Gestion Budgétaire - Exercice ${selectedPeriod}`}
            pageTitle={
              <>
                <i className="ri-money-dollar-circle-line me-1 align-bottom"></i>
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
                searchPlaceholder="Rechercher par compte, intitulé ou responsable..."
                showSearch={true}
                onAddClick={handleOpenBudgetModal}
                addButtonText="Nouvelle ligne"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                onImportClick={() => setImportModal(true)}
                importButtonText="Importer Excel"
                importButtonIcon="ri-file-excel-line"
                showImportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} ligne
                    {filteredData.length !== 1 ? "s" : ""} budgétaire
                    {filteredData.length !== 1 ? "s" : ""}
                  </div>
                }
              />

              {/* Filtres - ARRONDIS */}
              <Row className="mb-3">
                <Col lg={12}>
                  <div
                    className="d-flex align-items-center gap-3 flex-wrap rounded-pill"
                    style={{ background: "white", padding: "1rem" }}
                  >
                    {/* Filtre par exercice */}
                    {/* <div>
                      <CustomSelect
                        value={
                          FISCAL_YEARS.find(
                            (opt) => opt.year.toString() === selectedPeriod
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedPeriod(
                            selectedOption ? selectedOption.value : "2025"
                          );
                        }}
                        options={FISCAL_YEARS.map((year) => ({
                          value: year.year.toString(),
                          label: `Exercice ${year.year}`,
                        }))}
                        placeholder="Sélectionnez un exercice"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div> */}
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
                        placeholder="Filtrer par exercice"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>

                    {/* Filtre par type de compte */}
                    <div>
                      <CustomSelect
                        value={
                          ACCOUNT_TYPES.find(
                            (opt) => opt.value === filterAccountType
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setFilterAccountType(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={[
                          { value: "all", label: "Tous les types" },
                          ...ACCOUNT_TYPES,
                        ]}
                        placeholder="Filtrer par type"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>

                    {/* Filtre par centre de coût */}
                    <div>
                      <CustomSelect
                        value={
                          COST_CENTERS.find(
                            (opt) => opt.id.toString() === filterCostCenter
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setFilterCostCenter(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={[
                          { value: "all", label: "Tous les centres" },
                          ...COST_CENTERS.map((center) => ({
                            value: center.id.toString(),
                            label: `${center.code} - ${center.name}`,
                          })),
                        ]}
                        placeholder="Filtrer par centre"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>

                    {/* Filtre par statut */}
                    <div>
                      <CustomSelect
                        value={
                          filterStatus === "all"
                            ? { value: "all", label: "Tous les statuts" }
                            : filterStatus === "draft"
                            ? { value: "draft", label: "Brouillon" }
                            : filterStatus === "validated"
                            ? { value: "validated", label: "Validé" }
                            : filterStatus === "locked"
                            ? { value: "locked", label: "Verrouillé" }
                            : filterStatus === "archived"
                            ? { value: "archived", label: "Archivé" }
                            : null
                        }
                        onChange={(selectedOption) => {
                          setFilterStatus(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={[
                          { value: "all", label: "Tous les statuts" },
                          { value: "draft", label: "Brouillon" },
                          { value: "validated", label: "Validé" },
                          { value: "locked", label: "Verrouillé" },
                          { value: "archived", label: "Archivé" },
                        ]}
                        placeholder="Filtrer par statut"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>

                    {/* Bouton réinitialiser */}
                    {(searchTerm ||
                      filterAccountType !== "all" ||
                      filterCostCenter !== "all" ||
                      filterStatus !== "all" ||
                      selectedPeriod !== "2025") && (
                      <Button
                        color="outline-secondary"
                        onClick={resetFilters}
                        className="rounded-pill"
                      >
                        <i className="ri-refresh-line me-1"></i>
                        Réinitialiser
                      </Button>
                    )}
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
                          <h6 className="text-muted mb-2">Budget Total</h6>
                          <h4 className="mb-0 text-primary">
                            {formatAmount(calculateTotals.totalBudget)}
                          </h4>
                          <div className="mt-2">
                            <Progress
                              value={calculateTotals.completionRate}
                              max={100}
                              color="primary"
                              style={{ height: "6px" }}
                            />
                            <small className="text-muted">
                              Taux de réalisation:{" "}
                              {calculateTotals.completionRate.toFixed(1)}%
                            </small>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-money-dollar-circle-line text-primary fs-2"></i>
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
                          <h6 className="text-muted mb-2">
                            Réalisation Totale
                          </h6>
                          <h4 className="mb-0 text-info">
                            {formatAmount(calculateTotals.totalActual)}
                          </h4>
                          <div className="mt-2">
                            <Badge
                              color={
                                calculateTotals.totalVariance < 0
                                  ? "success"
                                  : calculateTotals.totalVariance > 0
                                  ? "danger"
                                  : "primary"
                              }
                              className="rounded-pill"
                            >
                              {formatAmount(calculateTotals.totalVariance)}
                            </Badge>
                            <small className="text-muted ms-2">
                              Écart total
                            </small>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-checkbox-circle-line text-info fs-2"></i>
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
                          <h6 className="text-muted mb-2">Recettes</h6>
                          <h4 className="mb-0 text-success">
                            {formatAmount(calculateTotals.revenueBudget)}
                          </h4>
                          <div className="mt-2">
                            <small className="text-muted">
                              Réalisé:{" "}
                              {formatAmount(calculateTotals.revenueActual)}
                            </small>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-arrow-down-circle-line text-success fs-2"></i>
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
                          <h6 className="text-muted mb-2">Dépenses</h6>
                          <h4 className="mb-0 text-danger">
                            {formatAmount(calculateTotals.expenseBudget)}
                          </h4>
                          <div className="mt-2">
                            <small className="text-muted">
                              Réalisé:{" "}
                              {formatAmount(calculateTotals.expenseActual)}
                            </small>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ri-arrow-up-circle-line text-danger fs-2"></i>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Tableau principal - ARRONDI */}
              <Row className="mb-3">
                <Col
                  lg={12}
                  className="rounded-4"
                  style={{ background: "white" }}
                >
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
                          <i className="ri-bar-chart-line me-1"></i>
                          Comparaison & Analyse
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
                          <i className="ri-file-text-line me-1"></i>
                          Budget Prévisionnel
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
                            marginRight: "1rem",
                          }}
                        >
                          <i className="ri-checkbox-circle-line me-1"></i>
                          Exécution Réelle
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "4",
                            "text-success": activeTab === "4",
                          })}
                          onClick={() => setActiveTab("4")}
                          style={{
                            cursor: "pointer",
                            color: activeTab === "4" ? "#198754" : "#6c757d",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                            padding: "0.75rem",
                          }}
                        >
                          <i className="ri-settings-3-line me-1"></i>
                          Configuration
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab} className="p-3">
                      {/* Onglet 1: Comparaison & Analyse */}
                      <TabPane tabId="1">
                        {loading ? (
                          <div
                            className="d-flex justify-content-center align-items-center my-5"
                            style={{ minHeight: "300px" }}
                          >
                            <div className="text-center">
                              <Loader />
                              <p className="mt-3 text-muted">
                                Chargement des données budgétaires...
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
                            title="Aucune ligne budgétaire trouvée"
                            description={
                              searchTerm ||
                              filterAccountType !== "all" ||
                              filterCostCenter !== "all" ||
                              filterStatus !== "all"
                                ? "Aucun résultat pour vos critères de recherche."
                                : "Commencez par créer une nouvelle ligne budgétaire."
                            }
                            actionButton={
                              <Button
                                color="success"
                                onClick={handleOpenBudgetModal}
                                className="rounded-pill"
                              >
                                {/* <i className="ri-add-circle-line me-1"></i> */}
                                Nouvelle ligne budgétaire
                              </Button>
                            }
                            secondaryAction={
                              (searchTerm ||
                                filterAccountType !== "all" ||
                                filterCostCenter !== "all" ||
                                filterStatus !== "all") && (
                                <Button
                                  color="outline-secondary"
                                  onClick={resetFilters}
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

                      {/* Onglet 2: Budget Prévisionnel */}
                      <TabPane tabId="2">
                        <Card className="rounded-4">
                          <CardBody>
                            <Alert color="info" className="mb-4 rounded-4">
                              <div className="d-flex align-items-center">
                                <i className="ri-information-line me-2"></i>
                                <div>
                                  <strong>Budget Prévisionnel</strong>
                                  <br />
                                  Définissez vos prévisions budgétaires pour
                                  l'exercice en cours. Vous pouvez importer
                                  depuis Excel, dupliquer le budget N-1 ou
                                  saisir manuellement.
                                </div>
                              </div>
                            </Alert>

                            <Row>
                              <Col lg={12} className="d-flex text-end">
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Button
                                    color="primary"
                                    className="rounded-pill"
                                    onClick={handleOpenBudgetModal}
                                  >
                                    <i className="ri-file-add-line me-1"></i>
                                    Nouvelle ligne
                                  </Button>
                                  <Button
                                    color="success"
                                    className="rounded-pill"
                                    onClick={() => setImportModal(true)}
                                  >
                                    <i className="ri-upload-line me-1"></i>
                                    Importer Excel
                                  </Button>

                                  <Button
                                    color="info"
                                    className="rounded-pill"
                                    onClick={() => {
                                      toast.info(
                                        "Fonctionnalité de duplication en cours de développement"
                                      );
                                    }}
                                  >
                                    <i className="ri-copy-line me-1"></i>
                                    Dupliquer budget
                                  </Button>
                                </div>
                              </Col>
                            </Row>

                            <div className="mt-4">
                              <h5 className="mb-3">
                                Lignes budgétaires prévisionnelles
                              </h5>
                              <TableContainer
                                columns={columns}
                                data={budgetLines.filter(
                                  (line) => line.status !== "archived"
                                )}
                                isGlobalFilter={false}
                                customPageSize={10}
                              />
                            </div>
                          </CardBody>
                        </Card>
                      </TabPane>

                      {/* Onglet 3: Exécution Réelle */}
                      <TabPane tabId="3">
                        <Card className="rounded-4">
                          <CardBody>
                            <Alert color="success" className="mb-4 rounded-4">
                              <div className="d-flex align-items-center">
                                <i className="ri-checkbox-circle-line me-2"></i>
                                <div>
                                  <strong>Exécution Réelle</strong>
                                  <br />
                                  Les données sont automatiquement alimentées
                                  par les écritures comptables. Aucune saisie
                                  manuelle n'est nécessaire.
                                </div>
                              </div>
                            </Alert>

                            <Row className="mb-4">
                              <Col md={12}>
                                <Card className="rounded-4">
                                  <CardBody>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <h6 className="mb-1">
                                          Période en cours : Août 2025
                                        </h6>
                                        <p className="text-muted mb-0">
                                          Données mises à jour automatiquement
                                          depuis le module de comptabilité
                                        </p>
                                      </div>
                                      <div>
                                        <Button
                                          color="outline-primary"
                                          className="rounded-pill"
                                          onClick={() => {
                                            toast.info(
                                              "Actualisation des données comptables en cours..."
                                            );
                                          }}
                                        >
                                          <i className="ri-refresh-line me-1"></i>
                                          Actualiser
                                        </Button>
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>

                            <div className="mt-4">
                              <h5 className="mb-3">
                                Détails des réalisations par ligne budgétaire
                              </h5>
                              <TableContainer
                                columns={columns}
                                data={budgetLines}
                                isGlobalFilter={false}
                                customPageSize={10}
                              />
                            </div>
                          </CardBody>
                        </Card>
                      </TabPane>

                      {/* Onglet 4: Configuration */}
                      <TabPane tabId="4">
                        <Card className="rounded-4">
                          <CardBody>
                            <Alert color="warning" className="mb-4 rounded-4">
                              <div className="d-flex align-items-center">
                                <i className="ri-settings-3-line me-2"></i>
                                <div>
                                  <strong>Configuration budgétaire</strong>
                                  <br />
                                  Paramétrez votre cadre budgétaire avant de
                                  commencer la saisie.
                                </div>
                              </div>
                            </Alert>

                            <Row>
                              <Col lg={6}>
                                <h5 className="card-title mb-4">
                                  Paramètres généraux
                                </h5>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Exercice fiscal en cours
                                  </Label>
                                  <div className="alert alert-light border rounded-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <h6 className="mb-1">2025</h6>
                                        <small className="text-muted">
                                          01/01/2025 au 31/12/2025
                                        </small>
                                      </div>
                                      <Badge color="success">En cours</Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <Label className="form-label">
                                    Devise budgétaire
                                  </Label>
                                  <Input
                                    type="text"
                                    value=""
                                    disabled
                                    className="rounded-pill"
                                  />
                                  <small className="text-muted">
                                    Devise principale du système
                                  </small>
                                </div>

                                <div className="mb-3">
                                  <Label className="form-label">
                                    Méthode budgétaire
                                  </Label>
                                  <Input
                                    type="select"
                                    className="form-select rounded-pill"
                                  >
                                    <option value="account">
                                      Par compte comptable
                                    </option>
                                    <option value="costcenter">
                                      Par centre de coût
                                    </option>
                                    <option value="project">Par projet</option>
                                    <option value="hybrid">Hybride</option>
                                  </Input>
                                </div>

                                <div className="mt-4">
                                  <Button
                                    color="primary"
                                    className="rounded-pill"
                                    onClick={handleOpenConfigModal}
                                  >
                                    <i className="ri-settings-3-line me-1"></i>
                                    Configurer le prochain exercice
                                  </Button>
                                </div>
                              </Col>

                              <Col lg={6}>
                                <Card className="rounded-4">
                                  <CardBody>
                                    <h5 className="card-title mb-4">
                                      Centres de coût activés
                                    </h5>
                                    <div className="mb-4">
                                      <ul className="list-group list-group-flush">
                                        {COST_CENTERS.map((center) => (
                                          <li
                                            key={center.id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                          >
                                            <div>
                                              <span className="fw-medium">
                                                {center.code}
                                              </span>
                                              <small className="text-muted ms-2">
                                                {center.name}
                                              </small>
                                            </div>
                                            <Badge
                                              color="success"
                                              className="rounded-pill"
                                            >
                                              Actif
                                            </Badge>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <h5 className="card-title mb-4">
                                      Projets actifs
                                    </h5>
                                    <div>
                                      <ul className="list-group list-group-flush">
                                        {PROJECTS.map((project) => (
                                          <li
                                            key={project.id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                          >
                                            <div>
                                              <span className="fw-medium">
                                                {project.code}
                                              </span>
                                              <small className="text-muted ms-2">
                                                {project.name}
                                              </small>
                                            </div>
                                            <Badge
                                              color="info"
                                              className="rounded-pill"
                                            >
                                              Actif
                                            </Badge>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={12}>
                                <Card className="rounded-4">
                                  <CardBody>
                                    <h5 className="card-title mb-4">
                                      Exercices budgétaires
                                    </h5>
                                    <TableContainer
                                      columns={configColumns}
                                      data={fiscalYearsData}
                                      isGlobalFilter={false}
                                      customPageSize={10}
                                    />
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        {/* Modal de création de ligne budgétaire */}
        <Modal
          isOpen={budgetModal}
          toggle={() => setBudgetModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setBudgetModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-add-circle-line me-2"></i>
            Nouvelle ligne budgétaire
          </ModalHeader>

          <Form onSubmit={budgetFormik.handleSubmit}>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="accountNumber" className="form-label">
                      Numéro de compte <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      placeholder="701, 611, 641..."
                      className="rounded-pill"
                      value={budgetFormik.values.accountNumber}
                      onChange={budgetFormik.handleChange}
                      onBlur={budgetFormik.handleBlur}
                      invalid={
                        budgetFormik.touched.accountNumber &&
                        Boolean(budgetFormik.errors.accountNumber)
                      }
                    />
                    {budgetFormik.touched.accountNumber &&
                      budgetFormik.errors.accountNumber && (
                        <FormFeedback>
                          {budgetFormik.errors.accountNumber}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="accountType" className="form-label">
                      Type de compte <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="accountType"
                      name="accountType"
                      value={
                        ACCOUNT_TYPES.find(
                          (opt) => opt.value === budgetFormik.values.accountType
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        budgetFormik.setFieldValue(
                          "accountType",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={ACCOUNT_TYPES}
                      placeholder="Sélectionnez un type"
                      className="rounded-pill"
                      isInvalid={
                        budgetFormik.touched.accountType &&
                        Boolean(budgetFormik.errors.accountType)
                      }
                    />
                    {budgetFormik.touched.accountType &&
                      budgetFormik.errors.accountType && (
                        <div className="invalid-feedback d-block">
                          {budgetFormik.errors.accountType}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="accountName" className="form-label">
                  Intitulé du poste <span className="text-danger">*</span>
                </Label>
                <Input
                  id="accountName"
                  name="accountName"
                  type="text"
                  placeholder="Ventes, Salaires, Loyers..."
                  className="rounded-pill"
                  value={budgetFormik.values.accountName}
                  onChange={budgetFormik.handleChange}
                  onBlur={budgetFormik.handleBlur}
                  invalid={
                    budgetFormik.touched.accountName &&
                    Boolean(budgetFormik.errors.accountName)
                  }
                />
                {budgetFormik.touched.accountName &&
                  budgetFormik.errors.accountName && (
                    <FormFeedback>
                      {budgetFormik.errors.accountName}
                    </FormFeedback>
                  )}
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="fiscalYear" className="form-label">
                      Exercice fiscal <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="fiscalYear"
                      name="fiscalYear"
                      value={
                        FISCAL_YEARS.find(
                          (opt) =>
                            opt.year.toString() ===
                            budgetFormik.values.fiscalYear.toString()
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        budgetFormik.setFieldValue(
                          "fiscalYear",
                          selectedOption ? parseInt(selectedOption.value) : ""
                        );
                      }}
                      options={FISCAL_YEARS.map((year) => ({
                        value: year.year.toString(),
                        label: `Exercice ${year.year}`,
                      }))}
                      placeholder="Sélectionnez un exercice"
                      className="rounded-pill"
                      isInvalid={
                        budgetFormik.touched.fiscalYear &&
                        Boolean(budgetFormik.errors.fiscalYear)
                      }
                    />
                    {budgetFormik.touched.fiscalYear &&
                      budgetFormik.errors.fiscalYear && (
                        <div className="invalid-feedback d-block">
                          {budgetFormik.errors.fiscalYear}
                        </div>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="period" className="form-label">
                      Période <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="period"
                      name="period"
                      value={
                        BUDGET_PERIODS.find(
                          (opt) => opt.value === budgetFormik.values.period
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        budgetFormik.setFieldValue(
                          "period",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={BUDGET_PERIODS}
                      placeholder="Sélectionnez une période"
                      className="rounded-pill"
                      isInvalid={
                        budgetFormik.touched.period &&
                        Boolean(budgetFormik.errors.period)
                      }
                    />
                    {budgetFormik.touched.period &&
                      budgetFormik.errors.period && (
                        <div className="invalid-feedback d-block">
                          {budgetFormik.errors.period}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="budgetAmount" className="form-label">
                      Montant budgété <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="budgetAmount"
                      name="budgetAmount"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="1000000"
                      className="rounded-pill"
                      value={budgetFormik.values.budgetAmount}
                      onChange={budgetFormik.handleChange}
                      onBlur={budgetFormik.handleBlur}
                      invalid={
                        budgetFormik.touched.budgetAmount &&
                        Boolean(budgetFormik.errors.budgetAmount)
                      }
                    />
                    {budgetFormik.touched.budgetAmount &&
                      budgetFormik.errors.budgetAmount && (
                        <FormFeedback>
                          {budgetFormik.errors.budgetAmount}
                        </FormFeedback>
                      )}
                    <small className="text-muted">Montant en </small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="distributionMethod" className="form-label">
                      Méthode de répartition{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="distributionMethod"
                      name="distributionMethod"
                      value={
                        DISTRIBUTION_METHODS.find(
                          (opt) =>
                            opt.value === budgetFormik.values.distributionMethod
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        budgetFormik.setFieldValue(
                          "distributionMethod",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={DISTRIBUTION_METHODS}
                      placeholder="Sélectionnez une méthode"
                      className="rounded-pill"
                      isInvalid={
                        budgetFormik.touched.distributionMethod &&
                        Boolean(budgetFormik.errors.distributionMethod)
                      }
                    />
                    {budgetFormik.touched.distributionMethod &&
                      budgetFormik.errors.distributionMethod && (
                        <div className="invalid-feedback d-block">
                          {budgetFormik.errors.distributionMethod}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="costCenterId" className="form-label">
                      Centre de coût <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="costCenterId"
                      name="costCenterId"
                      value={
                        COST_CENTERS.find(
                          (opt) =>
                            opt.id.toString() ===
                            budgetFormik.values.costCenterId
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        budgetFormik.setFieldValue(
                          "costCenterId",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={COST_CENTERS.map((center) => ({
                        value: center.id.toString(),
                        label: `${center.code} - ${center.name}`,
                      }))}
                      placeholder="Sélectionnez un centre"
                      className="rounded-pill"
                      isInvalid={
                        budgetFormik.touched.costCenterId &&
                        Boolean(budgetFormik.errors.costCenterId)
                      }
                    />
                    {budgetFormik.touched.costCenterId &&
                      budgetFormik.errors.costCenterId && (
                        <div className="invalid-feedback d-block">
                          {budgetFormik.errors.costCenterId}
                        </div>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="projectId" className="form-label">
                      Projet (optionnel)
                    </Label>
                    <CustomSelect
                      id="projectId"
                      name="projectId"
                      value={
                        PROJECTS.find(
                          (opt) =>
                            opt.id.toString() === budgetFormik.values.projectId
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        budgetFormik.setFieldValue(
                          "projectId",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={[
                        { value: "", label: "Sans projet" },
                        ...PROJECTS.map((project) => ({
                          value: project.id.toString(),
                          label: `${project.code} - ${project.name}`,
                        })),
                      ]}
                      placeholder="Sélectionnez un projet"
                      className="rounded-pill"
                    />
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="budgetOwner" className="form-label">
                  Responsable budgétaire <span className="text-danger">*</span>
                </Label>
                <Input
                  id="budgetOwner"
                  name="budgetOwner"
                  type="text"
                  placeholder="Nom du responsable"
                  className="rounded-pill"
                  value={budgetFormik.values.budgetOwner}
                  onChange={budgetFormik.handleChange}
                  onBlur={budgetFormik.handleBlur}
                  invalid={
                    budgetFormik.touched.budgetOwner &&
                    Boolean(budgetFormik.errors.budgetOwner)
                  }
                />
                {budgetFormik.touched.budgetOwner &&
                  budgetFormik.errors.budgetOwner && (
                    <FormFeedback>
                      {budgetFormik.errors.budgetOwner}
                    </FormFeedback>
                  )}
              </div>

              <div className="mb-3">
                <Label htmlFor="comments" className="form-label">
                  Commentaires / Hypothèses
                </Label>
                <Input
                  id="comments"
                  name="comments"
                  type="textarea"
                  rows="2"
                  className="rounded-4"
                  value={budgetFormik.values.comments}
                  onChange={budgetFormik.handleChange}
                  placeholder="Hypothèses, justifications, contraintes..."
                />
              </div>
            </ModalBody>

            <ModalFooter className="rounded-bottom-4">
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={() => setBudgetModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={budgetFormik.isSubmitting || !budgetFormik.isValid}
              >
                {budgetFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line me-1"></i>
                    Créer la ligne
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de configuration */}
        <Modal
          isOpen={configModal}
          toggle={() => setConfigModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="lg"
        >
          <ModalHeader
            toggle={() => setConfigModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-settings-3-line me-2"></i>
            Configuration budgétaire
          </ModalHeader>

          <Form onSubmit={configFormik.handleSubmit}>
            <ModalBody>
              <h6 className="mb-3 text-primary">
                Paramètres du nouvel exercice
              </h6>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="fiscalYear" className="form-label">
                      Exercice fiscal <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      id="fiscalYear"
                      name="fiscalYear"
                      value={
                        FISCAL_YEARS.find(
                          (opt) =>
                            opt.year.toString() ===
                            configFormik.values.fiscalYear.toString()
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        configFormik.setFieldValue(
                          "fiscalYear",
                          selectedOption ? parseInt(selectedOption.value) : ""
                        );
                      }}
                      options={FISCAL_YEARS.map((year) => ({
                        value: year.year.toString(),
                        label: `Exercice ${year.year}`,
                      }))}
                      placeholder="Sélectionnez un exercice"
                      className="rounded-pill"
                      isInvalid={
                        configFormik.touched.fiscalYear &&
                        Boolean(configFormik.errors.fiscalYear)
                      }
                    />
                    {configFormik.touched.fiscalYear &&
                      configFormik.errors.fiscalYear && (
                        <div className="invalid-feedback d-block">
                          {configFormik.errors.fiscalYear}
                        </div>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="currency" className="form-label">
                      Devise <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="currency"
                      name="currency"
                      type="text"
                      className="rounded-pill"
                      value={configFormik.values.currency}
                      onChange={configFormik.handleChange}
                      disabled
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="startDate" className="form-label">
                      Date de début <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="rounded-pill"
                      value={configFormik.values.startDate}
                      onChange={configFormik.handleChange}
                      onBlur={configFormik.handleBlur}
                      invalid={
                        configFormik.touched.startDate &&
                        Boolean(configFormik.errors.startDate)
                      }
                    />
                    {configFormik.touched.startDate &&
                      configFormik.errors.startDate && (
                        <FormFeedback>
                          {configFormik.errors.startDate}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="endDate" className="form-label">
                      Date de fin <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="rounded-pill"
                      value={configFormik.values.endDate}
                      onChange={configFormik.handleChange}
                      onBlur={configFormik.handleBlur}
                      invalid={
                        configFormik.touched.endDate &&
                        Boolean(configFormik.errors.endDate)
                      }
                    />
                    {configFormik.touched.endDate &&
                      configFormik.errors.endDate && (
                        <FormFeedback>
                          {configFormik.errors.endDate}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="budgetMethod" className="form-label">
                  Méthode budgétaire
                </Label>
                <CustomSelect
                  id="budgetMethod"
                  name="budgetMethod"
                  value={
                    configFormik.values.budgetMethod === "account"
                      ? { value: "account", label: "Par compte comptable" }
                      : configFormik.values.budgetMethod === "costcenter"
                      ? { value: "costcenter", label: "Par centre de coût" }
                      : configFormik.values.budgetMethod === "project"
                      ? { value: "project", label: "Par projet" }
                      : { value: "hybrid", label: "Hybride (compte + centre)" }
                  }
                  onChange={(selectedOption) => {
                    configFormik.setFieldValue(
                      "budgetMethod",
                      selectedOption ? selectedOption.value : "account"
                    );
                  }}
                  options={[
                    { value: "account", label: "Par compte comptable" },
                    { value: "costcenter", label: "Par centre de coût" },
                    { value: "project", label: "Par projet" },
                    { value: "hybrid", label: "Hybride (compte + centre)" },
                  ]}
                  placeholder="Sélectionnez une méthode"
                  className="rounded-pill"
                />
                <small className="text-muted">
                  Détermine comment seront organisées les lignes budgétaires
                </small>
              </div>

              <h6 className="mb-3 mt-4 text-primary">Options avancées</h6>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="enableCostCenters"
                    name="enableCostCenters"
                    checked={configFormik.values.enableCostCenters}
                    onChange={configFormik.handleChange}
                  />
                  <Label
                    className="form-check-label"
                    htmlFor="enableCostCenters"
                  >
                    Activer les centres de coût
                  </Label>
                </div>
                <small className="text-muted">
                  Permet l'affectation des lignes budgétaires par
                  département/service
                </small>
              </div>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="enableProjects"
                    name="enableProjects"
                    checked={configFormik.values.enableProjects}
                    onChange={configFormik.handleChange}
                  />
                  <Label className="form-check-label" htmlFor="enableProjects">
                    Activer les projets
                  </Label>
                </div>
                <small className="text-muted">
                  Permet l'affectation des lignes budgétaires par projet
                </small>
              </div>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="enableAnalytics"
                    name="enableAnalytics"
                    checked={configFormik.values.enableAnalytics}
                    onChange={configFormik.handleChange}
                  />
                  <Label className="form-check-label" htmlFor="enableAnalytics">
                    Activer l'analyse analytique
                  </Label>
                </div>
                <small className="text-muted">
                  Permet le suivi détaillé par axe analytique
                </small>
              </div>
            </ModalBody>

            <ModalFooter className="rounded-bottom-4">
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={() => setConfigModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={configFormik.isSubmitting || !configFormik.isValid}
              >
                {configFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Configuration en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line me-1"></i>
                    Enregistrer la configuration
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de détails */}
        <Modal
          isOpen={detailModal}
          toggle={() => setDetailModal(false)}
          centered
          className="border-0"
          contentClassName="rounded-4"
          size="xl"
        >
          <ModalHeader
            toggle={() => setDetailModal(false)}
            className="bg-light p-3 rounded-top-4"
          >
            <i className="ri-information-line me-2"></i>
            Détails de la ligne budgétaire
          </ModalHeader>

          <ModalBody>
            {selectedBudgetLine && (
              <div>
                {/* En-tête */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Compte</h6>
                      <h4 className="fw-bold text-primary">
                        {selectedBudgetLine.accountNumber} -{" "}
                        {selectedBudgetLine.accountName}
                      </h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Statut</h6>
                      <Badge
                        color={getStatusInfo(selectedBudgetLine.status).color}
                        className="rounded-pill fs-6 px-3 py-2"
                      >
                        <i
                          className={`${
                            getStatusInfo(selectedBudgetLine.status).icon
                          } me-1`}
                        ></i>
                        {getStatusInfo(selectedBudgetLine.status).label}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                {/* Informations de base */}
                <Row className="mb-4">
                  <Col md={6}>
                    <table className="table table-bordered table-striped mb-0">
                      <tbody>
                        <tr>
                          <th width="200">Exercice fiscal</th>
                          <td className="fw-bold">
                            {selectedBudgetLine.fiscalYear}
                          </td>
                        </tr>
                        <tr>
                          <th>Type de compte</th>
                          <td>
                            <Badge
                              color={
                                getAccountTypeInfo(
                                  selectedBudgetLine.accountType
                                ).color
                              }
                            >
                              {
                                getAccountTypeInfo(
                                  selectedBudgetLine.accountType
                                ).label
                              }
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <th>Centre de coût</th>
                          <td>
                            {selectedBudgetLine.costCenterName || (
                              <span className="text-muted">Non affecté</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Projet</th>
                          <td>
                            {selectedBudgetLine.projectName || (
                              <span className="text-muted">Non affecté</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <table className="table table-bordered table-striped mb-0">
                      <tbody>
                        <tr>
                          <th width="200">Prévision totale</th>
                          <td className="fw-bold text-primary">
                            {formatAmount(selectedBudgetLine.budgetAmount)}
                          </td>
                        </tr>
                        <tr>
                          <th>Réalisation totale</th>
                          <td className="fw-bold text-info">
                            {formatAmount(selectedBudgetLine.actualAmount)}
                          </td>
                        </tr>
                        <tr>
                          <th>Écart</th>
                          <td
                            className={`fw-bold ${
                              getVarianceColor(selectedBudgetLine.variance) ===
                              "success"
                                ? "text-success"
                                : getVarianceColor(
                                    selectedBudgetLine.variance
                                  ) === "danger"
                                ? "text-danger"
                                : "text-muted"
                            }`}
                          >
                            {formatAmount(selectedBudgetLine.variance)}(
                            {formatPercentage(
                              selectedBudgetLine.variancePercentage
                            )}
                            )
                          </td>
                        </tr>
                        <tr>
                          <th>Responsable</th>
                          <td className="fw-medium">
                            {selectedBudgetLine.budgetOwner}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>

                {/* Détails mensuels */}
                <div className="mt-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <i className="ri-calendar-line me-2"></i>
                    Répartition mensuelle
                  </h6>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover mb-4">
                      <thead className="table-light">
                        <tr>
                          <th>Mois</th>
                          <th>Budget</th>
                          <th>Réalisation</th>
                          <th>Écart</th>
                          <th>% Réalisation</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            month: "Janvier",
                            data: selectedBudgetLine.january,
                          },
                          {
                            month: "Février",
                            data: selectedBudgetLine.february,
                          },
                          { month: "Mars", data: selectedBudgetLine.march },
                          { month: "Avril", data: selectedBudgetLine.april },
                          { month: "Mai", data: selectedBudgetLine.may },
                          { month: "Juin", data: selectedBudgetLine.june },
                          { month: "Juillet", data: selectedBudgetLine.july },
                          { month: "Août", data: selectedBudgetLine.august },
                          {
                            month: "Septembre",
                            data: selectedBudgetLine.september,
                          },
                          {
                            month: "Octobre",
                            data: selectedBudgetLine.october,
                          },
                          {
                            month: "Novembre",
                            data: selectedBudgetLine.november,
                          },
                          {
                            month: "Décembre",
                            data: selectedBudgetLine.december,
                          },
                        ].map((item, index) => {
                          const variance = item.data.actual - item.data.budget;
                          const completionRate =
                            item.data.budget > 0
                              ? (item.data.actual / item.data.budget) * 100
                              : 0;
                          const statusColor =
                            completionRate >= 100
                              ? "danger"
                              : completionRate >= 80
                              ? "warning"
                              : "success";

                          return (
                            <tr key={index}>
                              <td className="fw-medium">{item.month}</td>
                              <td className="text-end">
                                {formatAmount(item.data.budget)}
                              </td>
                              <td className="text-end">
                                {formatAmount(item.data.actual)}
                              </td>
                              <td
                                className={`text-end fw-bold ${
                                  variance > 0
                                    ? "text-danger"
                                    : variance < 0
                                    ? "text-success"
                                    : "text-muted"
                                }`}
                              >
                                {formatAmount(variance)}
                              </td>
                              <td className="text-end">
                                <Badge
                                  color={statusColor}
                                  className="rounded-pill"
                                >
                                  {completionRate.toFixed(1)}%
                                </Badge>
                              </td>
                              <td>
                                {completionRate >= 100 ? (
                                  <Badge
                                    color="danger"
                                    className="rounded-pill"
                                  >
                                    <i className="ri-alert-line me-1"></i>
                                    Dépassement
                                  </Badge>
                                ) : completionRate >= 80 ? (
                                  <Badge
                                    color="warning"
                                    className="rounded-pill"
                                  >
                                    <i className="ri-alert-line me-1"></i>
                                    Attention
                                  </Badge>
                                ) : (
                                  <Badge
                                    color="success"
                                    className="rounded-pill"
                                  >
                                    <i className="ri-check-line me-1"></i>
                                    Normal
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Commentaires */}
                {selectedBudgetLine.comments && (
                  <Alert color="light" className="mt-4 rounded-4">
                    <h6 className="alert-heading">
                      <i className="ri-sticky-note-line me-2"></i>
                      Commentaires / Hypothèses
                    </h6>
                    <p className="mb-0">{selectedBudgetLine.comments}</p>
                  </Alert>
                )}
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

export default Budget;
