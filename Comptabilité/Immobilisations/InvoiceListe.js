import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import TableContainerTotal from "../../../../Components/Common/TableContainerTotal"; // NOUVEAU : TableContainer avec totaux
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../../../Components/Common/Loader";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
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
  Table,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import Pagination from "../../../../Components/Common/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";

// Types d'immobilisations
const ASSET_TYPES = [
  { value: "corporel", label: "Corporel" },
  { value: "incorporel", label: "Incorporel" },
  { value: "financier", label: "Financier" },
];

// Méthodes d'amortissement
const AMORTISEMENT_METHODS = [
  { value: "lineaire", label: "Linéaire" },
  { value: "degressif", label: "Dégressif" },
  { value: "exceptionnel", label: "Exceptionnel" },
];

// Comptes d'actif (classe 21X)
const ACTIF_ACCOUNTS = [
  { value: "211", label: "211 - Terrains" },
  { value: "212", label: "212 - Constructions" },
  { value: "213", label: "213 - Installations techniques" },
  { value: "214", label: "214 - Matériel industriel" },
  { value: "215", label: "215 - Matériel de bureau" },
  { value: "216", label: "216 - Matériel informatique" },
  { value: "217", label: "217 - Matériel de transport" },
  { value: "218", label: "218 - Autres immobilisations corporelles" },
  { value: "221", label: "221 - Immobilisations incorporelles" },
  { value: "241", label: "241 - Titres de participation" },
  { value: "242", label: "242 - Autres titres immobilisés" },
  { value: "2411", label: "2411 - Matériel industriel spécifique" },
  { value: "2441", label: "2441 - Matériel de bureau spécifique" },
];

// Comptes d'amortissement (classe 28X)
const AMORTISEMENT_ACCOUNTS = [
  { value: "281", label: "281 - Amortissements des constructions" },
  { value: "282", label: "282 - Amortissements des installations" },
  { value: "283", label: "283 - Amortissements du matériel industriel" },
  { value: "284", label: "284 - Amortissements du matériel de bureau" },
  { value: "285", label: "285 - Amortissements du matériel informatique" },
  { value: "286", label: "286 - Amortissements du matériel de transport" },
  { value: "287", label: "287 - Amortissements des autres immobilisations" },
  { value: "28154", label: "28154 - Amortissements matériel spécifique" },
];

// Comptes de charge (classe 68X)
const CHARGE_ACCOUNTS = [
  { value: "6811", label: "6811 - Dotations aux amortissements des immobilisations" },
  { value: "68111", label: "68111 - Dotations aux amortissements des constructions" },
  { value: "68112", label: "68112 - Dotations aux amortissements des installations" },
  { value: "68113", label: "68113 - Dotations aux amortissements du matériel industriel" },
  { value: "68114", label: "68114 - Dotations aux amortissements du matériel de bureau" },
  { value: "68115", label: "68115 - Dotations aux amortissements du matériel informatique" },
  { value: "68116", label: "68116 - Dotations aux amortissements du matériel de transport" },
  { value: "68117", label: "68117 - Dotations aux amortissements des autres immobilisations" },
];

// États des immobilisations
const ASSET_STATUS = [
  { value: "actif", label: "Actif" },
  { value: "cede", label: "Cédé" },
  { value: "hors_service", label: "Hors service" },
  { value: "en_maintenance", label: "En maintenance" },
];

const ImmobilisationsListe = ({ switchToCreate, showDetails, switchToEdit }) => {
  const { t } = useTranslation();

  // États principaux
  const [immobilisationsData, setImmobilisationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const { userProfile, token } = useProfile();

  // États des modals
  const [modal, setModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  // États pour la cession
  const [cessionModal, setCessionModal] = useState(false);
  const [cessionForm, setCessionForm] = useState({
    date_cession: new Date().toISOString().split("T")[0],
    prix_cession: "",
    motif_cession: "",
  });

  const itemsPerPage = 10;

  // ✅ Données fictives pour les immobilisations
  const demoImmobilisations = useMemo(
    () => [
      {
        id: 1,
        code: "IMM-2024-001",
        designation: "Véhicule utilitaire n°1",
        type: "corporel",
        date_acquisition: "2024-01-15",
        valeur_origine: 25000000,
        cumul_amortissement: 5000000,
        valeur_comptable: 20000000,
        taux_amortissement: 20,
        duree_amortissement: 5,
        methode_amortissement: "lineaire",
        compte_actif: "217",
        compte_amortissement: "286",
        compte_charge: "68116",
        statut: "actif",
        localisation: "Siège principal",
        responsable: "Jean Dupont",
        date_mise_service: "2024-01-20",
        fournisseur: "Toyota Gabon",
        numero_serie: "VH-2024-001",
        observations: "Véhicule de service",
      },
      {
        id: 2,
        code: "IMM-2023-045",
        designation: "Serveur informatique principal",
        type: "corporel",
        date_acquisition: "2023-06-10",
        valeur_origine: 15000000,
        cumul_amortissement: 3000000,
        valeur_comptable: 12000000,
        taux_amortissement: 33.33,
        duree_amortissement: 3,
        methode_amortissement: "lineaire",
        compte_actif: "216",
        compte_amortissement: "285",
        compte_charge: "68115",
        statut: "actif",
        localisation: "Salle serveurs",
        responsable: "Marie Tech",
        date_mise_service: "2023-06-15",
        fournisseur: "Dell Technologies",
        numero_serie: "SRV-2023-001",
        observations: "Serveur de production",
      },
      {
        id: 3,
        code: "IMM-2022-128",
        designation: "Bâtiment administratif",
        type: "corporel",
        date_acquisition: "2022-03-22",
        valeur_origine: 500000000,
        cumul_amortissement: 50000000,
        valeur_comptable: 450000000,
        taux_amortissement: 5,
        duree_amortissement: 20,
        methode_amortissement: "lineaire",
        compte_actif: "212",
        compte_amortissement: "281",
        compte_charge: "68111",
        statut: "actif",
        localisation: "Libreville",
        responsable: "Directeur Général",
        date_mise_service: "2022-04-01",
        fournisseur: "BTP Gabon",
        numero_serie: "BAT-2022-001",
        observations: "Siège social",
      },
      {
        id: 4,
        code: "IMM-2024-002",
        designation: "Logiciel de gestion ERP",
        type: "incorporel",
        date_acquisition: "2024-02-01",
        valeur_origine: 8000000,
        cumul_amortissement: 1333333,
        valeur_comptable: 6666667,
        taux_amortissement: 33.33,
        duree_amortissement: 3,
        methode_amortissement: "lineaire",
        compte_actif: "221",
        compte_amortissement: "287",
        compte_charge: "68117",
        statut: "actif",
        localisation: "Tous les postes",
        responsable: "IT Manager",
        date_mise_service: "2024-02-05",
        fournisseur: "SAP",
        numero_serie: "SW-2024-001",
        observations: "Licence 3 ans",
      },
      {
        id: 5,
        code: "IMM-2021-056",
        designation: "Véhicule de direction",
        type: "corporel",
        date_acquisition: "2021-11-10",
        valeur_origine: 35000000,
        cumul_amortissement: 14000000,
        valeur_comptable: 21000000,
        taux_amortissement: 20,
        duree_amortissement: 5,
        methode_amortissement: "lineaire",
        compte_actif: "217",
        compte_amortissement: "286",
        compte_charge: "68116",
        statut: "cede",
        localisation: "-",
        responsable: "-",
        date_mise_service: "2021-11-15",
        fournisseur: "Mercedes-Benz",
        numero_serie: "VH-2021-001",
        observations: "Cédé le 15/01/2024",
        prix_cession: 22000000,
        date_cession: "2024-01-15",
        motif_cession: "Renouvellement du parc automobile",
      },
    ],
    []
  );

  // ✅ Filtrage optimisé des immobilisations
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return immobilisationsData;

    return immobilisationsData.filter((asset) =>
      Object.values(asset).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [immobilisationsData, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Calculer les totaux pour la ligne de total
  const totals = useMemo(() => {
    // Filtrer seulement les immobilisations actives pour les totaux
    const activeAssets = filteredData.filter(asset => asset.statut === 'actif');
    
    return activeAssets.reduce((acc, asset) => {
      acc.totalValeurOrigine += asset.valeur_origine || 0;
      acc.totalCumulAmortissement += asset.cumul_amortissement || 0;
      acc.totalValeurComptable += asset.valeur_comptable || 0;
      return acc;
    }, { 
      totalValeurOrigine: 0, 
      totalCumulAmortissement: 0, 
      totalValeurComptable: 0 
    });
  }, [filteredData]);

  // ✅ Options pour les types d'immobilisations
  const assetTypeOptions = useMemo(
    () =>
      ASSET_TYPES.map((type) => ({
        value: type.value,
        label: type.label,
      })),
    []
  );

  // ✅ Options pour les méthodes d'amortissement
  const amortissementMethodOptions = useMemo(
    () =>
      AMORTISEMENT_METHODS.map((method) => ({
        value: method.value,
        label: method.label,
      })),
    []
  );

  // ✅ Options pour les comptes d'actif
  const actifAccountOptions = useMemo(
    () =>
      ACTIF_ACCOUNTS.map((account) => ({
        value: account.value,
        label: account.label,
      })),
    []
  );

  // ✅ Options pour les comptes d'amortissement
  const amortissementAccountOptions = useMemo(
    () =>
      AMORTISEMENT_ACCOUNTS.map((account) => ({
        value: account.value,
        label: account.label,
      })),
    []
  );

  // ✅ Options pour les comptes de charge
  const chargeAccountOptions = useMemo(
    () =>
      CHARGE_ACCOUNTS.map((account) => ({
        value: account.value,
        label: account.label,
      })),
    []
  );

  // ✅ Fonction pour récupérer les immobilisations
  const fetchImmobilisations = useCallback(async () => {
    setLoading(true);

    if (!token) {
      toast.error(
        "Token d'authentification manquant. Veuillez vous reconnecter."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}/immobilisations/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setImmobilisationsData(data);
        // Préparer les données pour l'export
        const exportDataFormatted = data.map((asset) => ({
          Code: asset.code || "N/A",
          Désignation: asset.designation || "N/A",
          Type: ASSET_TYPES.find((t) => t.value === asset.type)?.label || asset.type,
          "Date d'Acquisition": asset.date_acquisition || "N/A",
          "Valeur d'Origine (HT)": asset.valeur_origine?.toLocaleString("fr-FR") || "0",
          "Cumul Amortissement": asset.cumul_amortissement?.toLocaleString("fr-FR") || "0",
          "Valeur Comptable": asset.valeur_comptable?.toLocaleString("fr-FR") || "0",
          Statut: ASSET_STATUS.find((s) => s.value === asset.statut)?.label || asset.statut,
        }));
        setExportData(exportDataFormatted);
      } else {
        // Utiliser les données fictives
        setImmobilisationsData(demoImmobilisations);
        const exportDataFormatted = demoImmobilisations.map((asset) => ({
          Code: asset.code || "N/A",
          Désignation: asset.designation || "N/A",
          Type: ASSET_TYPES.find((t) => t.value === asset.type)?.label || asset.type,
          "Date d'Acquisition": asset.date_acquisition || "N/A",
          "Valeur d'Origine (HT)": asset.valeur_origine?.toLocaleString("fr-FR") || "0",
          "Cumul Amortissement": asset.cumul_amortissement?.toLocaleString("fr-FR") || "0",
          "Valeur Comptable": asset.valeur_comptable?.toLocaleString("fr-FR") || "0",
          Statut: ASSET_STATUS.find((s) => s.value === asset.statut)?.label || asset.statut,
        }));
        setExportData(exportDataFormatted);
        toast.info("Données de démonstration chargées");
      }
    } catch (err) {
      console.error("Erreur fetchImmobilisations:", err);
      // Utiliser les données fictives en cas d'erreur
      setImmobilisationsData(demoImmobilisations);
      const exportDataFormatted = demoImmobilisations.map((asset) => ({
        Code: asset.code || "N/A",
        Désignation: asset.designation || "N/A",
        Type: ASSET_TYPES.find((t) => t.value === asset.type)?.label || asset.type,
        "Date d'Acquisition": asset.date_acquisition || "N/A",
        "Valeur d'Origine (HT)": asset.valeur_origine?.toLocaleString("fr-FR") || "0",
        "Cumul Amortissement": asset.cumul_amortissement?.toLocaleString("fr-FR") || "0",
        "Valeur Comptable": asset.valeur_comptable?.toLocaleString("fr-FR") || "0",
        Statut: ASSET_STATUS.find((s) => s.value === asset.statut)?.label || asset.statut,
      }));
      setExportData(exportDataFormatted);
      toast.info("Données de démonstration chargées");
    } finally {
      setLoading(false);
    }
  }, [token, demoImmobilisations]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Immobilisations | INAWO - Suite de Gestion";
    fetchImmobilisations();
  }, [fetchImmobilisations]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Validation du formulaire d'édition
  const validationSchema = Yup.object({
    designation: Yup.string().required("La désignation est requise"),
    duree_amortissement: Yup.number()
      .min(1, "La durée doit être d'au moins 1 an")
      .required("La durée d'amortissement est requise"),
    taux_amortissement: Yup.number()
      .min(0.01, "Le taux doit être supérieur à 0%")
      .max(100, "Le taux ne peut dépasser 100%")
      .required("Le taux d'amortissement est requis"),
    compte_actif: Yup.string().required("Le compte d'actif est requis"),
    compte_amortissement: Yup.string().required("Le compte d'amortissement est requis"),
    compte_charge: Yup.string().required("Le compte de charge est requis"),
  });

  // ✅ Formik pour la gestion du formulaire d'édition
  const formik = useFormik({
    initialValues: {
      designation: "",
      duree_amortissement: "",
      taux_amortissement: "",
      compte_actif: "",
      compte_amortissement: "",
      compte_charge: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitAsset(values, resetForm, setSubmitting);
    },
  });

  // ✅ Fonction pour calculer le taux d'amortissement automatique
  const calculateAmortissementRate = (duree) => {
    if (!duree || duree <= 0) return 0;
    return (100 / duree).toFixed(2);
  };

  // ✅ Fonction de soumission pour l'édition
  const handleSubmitAsset = async (values, resetForm, setSubmitting) => {
    try {
      if (!currentAsset?.id) return;

      // Calculer les nouvelles valeurs
      const tauxAmortissement = parseFloat(values.taux_amortissement) || 0;
      const dureeAmortissement = parseInt(values.duree_amortissement) || 0;
      
      // Calculer le nouvel amortissement annuel
      const amortissementAnnuel = (currentAsset.valeur_origine * (tauxAmortissement / 100));

      // Recalculer le cumul d'amortissement basé sur la date d'acquisition
      const dateAcquisition = new Date(currentAsset.date_acquisition);
      const maintenant = new Date();
      const moisEcoules = Math.floor(
        (maintenant - dateAcquisition) / (1000 * 60 * 60 * 24 * 30.44)
      );
      const anneesEcoulees = moisEcoules / 12;
      
      let nouveauCumulAmortissement = 0;
      if (anneesEcoulees > 0 && dureeAmortissement > 0) {
        nouveauCumulAmortissement = Math.min(
          amortissementAnnuel * Math.min(anneesEcoulees, dureeAmortissement),
          currentAsset.valeur_origine
        );
      }

      const payload = {
        ...currentAsset,
        ...values,
        duree_amortissement: dureeAmortissement,
        taux_amortissement: tauxAmortissement,
        cumul_amortissement: Math.round(nouveauCumulAmortissement),
        valeur_comptable: Math.round(currentAsset.valeur_origine - nouveauCumulAmortissement),
      };

      // Mise à jour locale
      const updatedData = immobilisationsData.map((asset) =>
        asset.id === currentAsset.id ? { ...asset, ...payload } : asset
      );
      setImmobilisationsData(updatedData);
      toast.success("Immobilisation modifiée avec succès!");

      resetForm();
      setModal(false);
      setCurrentAsset(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      toast.error(err.message || "Erreur lors de la sauvegarde de l'immobilisation");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Fonction pour ouvrir le modal d'édition
  const handleOpenEditModal = useCallback(
    (asset) => {
      setCurrentAsset(asset);

      // Pré-remplir le formulaire avec les données de l'immobilisation
      formik.setValues({
        designation: asset.designation || "",
        duree_amortissement: asset.duree_amortissement?.toString() || "",
        taux_amortissement: asset.taux_amortissement?.toString() || "",
        compte_actif: asset.compte_actif || "",
        compte_amortissement: asset.compte_amortissement || "",
        compte_charge: asset.compte_charge || "",
      });

      setModal(true);
    },
    [formik]
  );

  // ✅ Fonction pour gérer la cession
  const handleCession = useCallback((asset) => {
    setCurrentAsset(asset);
    setCessionForm({
      date_cession: new Date().toISOString().split("T")[0],
      prix_cession: asset.valeur_comptable?.toString() || "",
      motif_cession: "",
    });
    setCessionModal(true);
  }, []);

  // ✅ Fonction pour confirmer la cession
  const handleConfirmCession = useCallback(() => {
    if (!currentAsset) return;

    const updatedData = immobilisationsData.map((asset) =>
      asset.id === currentAsset.id
        ? {
            ...asset,
            statut: "cede",
            prix_cession: parseFloat(cessionForm.prix_cession) || 0,
            date_cession: cessionForm.date_cession,
            motif_cession: cessionForm.motif_cession,
            valeur_comptable: 0, // La valeur comptable devient 0 après cession
          }
        : asset
    );

    setImmobilisationsData(updatedData);
    toast.success("Immobilisation cédée avec succès!");
    setCessionModal(false);
    setCurrentAsset(null);
    setCessionForm({
      date_cession: new Date().toISOString().split("T")[0],
      prix_cession: "",
      motif_cession: "",
    });
  }, [currentAsset, immobilisationsData, cessionForm]);

  // ✅ Fonction de suppression
  const handleDeleteAsset = async () => {
    if (!assetToDelete?.id) return;

    try {
      // Mise à jour locale
      const updatedData = immobilisationsData.filter(
        (asset) => asset.id !== assetToDelete.id
      );
      setImmobilisationsData(updatedData);
      toast.success("Immobilisation supprimée avec succès!");
      setDeleteModal(false);
      setAssetToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error(err.message || "Erreur lors de la suppression de l'immobilisation");
    }
  };

  // ✅ Handlers optimisés
  const handleOpenDeleteModal = useCallback((asset) => {
    setAssetToDelete(asset);
    setDeleteModal(true);
  }, []);

  // ✅ Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant || 0);
  }, []);

  // ✅ Fonction pour obtenir le label du type
  const getTypeLabel = useCallback((typeValue) => {
    const typeObj = ASSET_TYPES.find((t) => t.value === typeValue);
    return typeObj ? typeObj.label : typeValue;
  }, []);

  // ✅ Fonction pour obtenir le label du statut
  const getStatusLabel = useCallback((statusValue) => {
    const statusObj = ASSET_STATUS.find((s) => s.value === statusValue);
    return statusObj ? statusObj.label : statusValue;
  }, []);

  // ✅ Fonction pour obtenir la couleur du statut - SANS FOND, SEULEMENT TEXT-COLOR
  const getStatusColor = useCallback((statusValue) => {
    const statusColors = {
      actif: "text-success",
      cede: "text-danger",
      hors_service: "text-warning",
      en_maintenance: "text-info",
    };
    return statusColors[statusValue] || "text-secondary";
  }, []);

  // ✅ Colonnes du tableau
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
      header: "Code",
      accessorKey: "code",
      enableColumnFilter: false,
      cell: (cell) => {
        const code = cell.getValue();
        return (
          <span className="fw-medium text-primary">{code || "N/A"}</span>
        );
      },
      size: 120,
    },
    {
      header: "Désignation",
      accessorKey: "designation",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-bold">{cell.getValue() || "N/A"}</span>
      ),
      size: 200,
    },
    {
      header: "Type",
      accessorKey: "type",
      enableColumnFilter: false,
      cell: (cell) => {
        const typeValue = cell.getValue();
        const typeObj = ASSET_TYPES.find((t) => t.value === typeValue);
        const typeColors = {
          corporel: "text-info",
          incorporel: "text-primary",
          financier: "text-success",
        };
        
        return (
          <span className={`fw-medium ${typeColors[typeValue] || "text-secondary"}`}>
            {typeObj ? typeObj.label : typeValue}
          </span>
        );
      },
      size: 100,
    },
    {
      header: "Date d'Acquisition",
      accessorKey: "date_acquisition",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-medium">
          {cell.getValue()
            ? new Date(cell.getValue()).toLocaleDateString("fr-FR")
            : "N/A"}
        </span>
      ),
      size: 120,
    },
    {
      header: "Valeur d'Origine",
      accessorKey: "valeur_origine",
      enableColumnFilter: false,
      cell: (cell) => {
        const value = cell.getValue();
        return value > 0 ? (
          <span className="text-success fw-bold">
            {formatMontant(value)} 
          </span>
        ) : (
          <span className="text-muted">-</span>
        );
      },
      size: 120,
    },
    {
      header: "Valeur Comptable",
      accessorKey: "valeur_comptable",
      enableColumnFilter: false,
      cell: (cell) => {
        const value = cell.getValue();
        return value > 0 ? (
          <span className="text-primary fw-bold">
            {formatMontant(value)} 
          </span>
        ) : (
          <span className="text-muted">-</span>
        );
      },
      size: 120,
    },
    {
      header: "Statut",
      accessorKey: "statut",
      enableColumnFilter: false,
      cell: (cell) => {
        const statusValue = cell.getValue();
        const color = getStatusColor(statusValue);
        
        return (
          <span className={`fw-medium ${color}`}>
            {getStatusLabel(statusValue)}
          </span>
        );
      },
      size: 100,
    },
    {
      header: "Actions",
      enableColumnFilter: false,
      cell: (cellProps) => {
        const asset = cellProps.row.original;
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Link
                to="#"
                className="text-primary d-inline-block edit-item-btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (showDetails) showDetails(asset);
                }}
                title="Voir détails"
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>
            </li>
            <li className="list-inline-item edit">
              <Link
                to="#"
                className="text-primary d-inline-block edit-item-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenEditModal(asset);
                }}
                title="Modifier"
                disabled={asset.statut === "cede"}
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link
                to="#"
                className="text-success d-inline-block"
                onClick={(e) => {
                  e.preventDefault();
                  handleCession(asset);
                }}
                title="Céder"
                disabled={asset.statut === "cede"}
              >
                <i className="ri-exchange-dollar-fill fs-16"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link
                to="#"
                className="text-danger d-inline-block remove-item-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDeleteModal(asset);
                }}
                title="Supprimer"
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
      size: 150,
    },
  ], [
    currentPage,
    itemsPerPage,
    formatMontant,
    getStatusLabel,
    getStatusColor,
    handleOpenEditModal,
    handleCession,
    handleOpenDeleteModal,
    showDetails,
  ]);

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
          />

          {/* Export CSV Modal */}
          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
          />

          {/* Delete Modal */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteAsset}
            onCloseClick={() => {
              setDeleteModal(false);
              setAssetToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cette immobilisation ?"
          />

          {/* Cession Modal */}
          <Modal
            isOpen={cessionModal}
            toggle={() => {
              setCessionModal(false);
              setCurrentAsset(null);
              setCessionForm({
                date_cession: new Date().toISOString().split("T")[0],
                prix_cession: "",
                motif_cession: "",
              });
            }}
            centered
            className="border-0"
            contentClassName="custom-rounded-modal"
            size="lg"
          >
            <ModalHeader
              toggle={() => {
                setCessionModal(false);
                setCurrentAsset(null);
                setCessionForm({
                  date_cession: new Date().toISOString().split("T")[0],
                  prix_cession: "",
                  motif_cession: "",
                });
              }}
              className="bg-light p-3"
              style={{ borderRadius: "20px 20px 0 0" }}
            >
              <div className="d-flex align-items-center">
                <i className="ri-exchange-dollar-line me-2 text-success"></i>
                Céder l'immobilisation
                <Badge color="info" className="ms-2">
                  {currentAsset?.code}
                </Badge>
              </div>
            </ModalHeader>
            <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
              <div className="mb-4">
                <h6 className="text-primary mb-3">
                  <i className="ri-building-line me-2"></i>
                  {currentAsset?.designation}
                </h6>
                
                <div className="alert alert-warning border-0 rounded mb-3">
                  <div className="d-flex align-items-start">
                    <i className="ri-alert-line fs-5 me-2 mt-1"></i>
                    <div>
                      <h6 className="alert-heading mb-2">Informations importantes</h6>
                      <ul className="mb-0 ps-3">
                        <li>Valeur d'origine : {formatMontant(currentAsset?.valeur_origine)} </li>
                        <li>Cumul d'amortissement : {formatMontant(currentAsset?.cumul_amortissement)} </li>
                        <li>Valeur comptable actuelle : {formatMontant(currentAsset?.valeur_comptable)} </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor="date_cession" className="form-label fw-semibold">
                  Date de cession <span className="text-danger">*</span>
                </Label>
                <Input
                  id="date_cession"
                  type="date"
                  value={cessionForm.date_cession}
                  onChange={(e) =>
                    setCessionForm({ ...cessionForm, date_cession: e.target.value })
                  }
                  className="form-control"
                  style={{ borderRadius: "20px" }}
                />
              </div>

              <div className="mb-3">
                <Label htmlFor="prix_cession" className="form-label fw-semibold">
                  Prix de cession ()
                </Label>
                <div className="input-group">
                  <Input
                    id="prix_cession"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Prix de vente"
                    value={cessionForm.prix_cession}
                    onChange={(e) =>
                      setCessionForm({ ...cessionForm, prix_cession: e.target.value })
                    }
                    className="form-control"
                    style={{ borderRadius: "20px 0 0 20px" }}
                  />
                  <span className="input-group-text" style={{ borderRadius: "0 20px 20px 0" }}></span>
                </div>
                <small className="text-muted">
                  Recommandé : {formatMontant(currentAsset?.valeur_comptable)}  (valeur comptable)
                </small>
              </div>

              <div className="mb-3">
                <Label htmlFor="motif_cession" className="form-label fw-semibold">
                  Motif de cession
                </Label>
                <Input
                  id="motif_cession"
                  type="textarea"
                  rows="3"
                  placeholder="Raison de la cession (renouvellement, vente, mise hors service...)"
                  value={cessionForm.motif_cession}
                  onChange={(e) =>
                    setCessionForm({ ...cessionForm, motif_cession: e.target.value })
                  }
                  className="form-control"
                  style={{ borderRadius: "15px" }}
                />
              </div>

              <div className="alert alert-info border-0 rounded">
                <div className="d-flex align-items-start">
                  <i className="ri-information-line fs-5 me-2 mt-1"></i>
                  <div>
                    <h6 className="alert-heading mb-2">Impact comptable</h6>
                    <p className="mb-0">
                      Après la cession :
                      <ul className="mb-0 ps-3">
                        <li>Le compte {currentAsset?.compte_actif} sera débité</li>
                        <li>Le compte d'amortissement {currentAsset?.compte_amortissement} sera crédité</li>
                        <li>Un compte de produit ou de perte sera utilisé pour la différence</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="light"
                onClick={() => {
                  setCessionModal(false);
                  setCurrentAsset(null);
                  setCessionForm({
                    date_cession: new Date().toISOString().split("T")[0],
                    prix_cession: "",
                    motif_cession: "",
                  });
                }}
                style={{ borderRadius: "20px" }}
              >
                Annuler
              </Button>
              <Button
                color="success"
                onClick={handleConfirmCession}
                style={{ borderRadius: "20px" }}
              >
                <i className="ri-check-line me-1"></i>
                Confirmer la cession
              </Button>
            </ModalFooter>
          </Modal>

          <BreadCrumb
            title="Gestion des Immobilisations"
            pageTitle={
              <>
                <i className="ri-building-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher une immobilisation..."
                showSearch={true}
                onAddClick={switchToCreate}
                addButtonText="Nouvelle immobilisation"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
              />

              <Col lg={12}>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                      <Loader />
                      <p className="mt-3 text-muted">Chargement des immobilisations...</p>
                    </div>
                  </div>
                ) : filteredData.length > 0 ? (
                  <div>
                    {/*  NOUVEAU : TableContainerTotal avec ligne de totaux */}
                    <TableContainerTotal
                      columns={columns}
                      data={paginatedData}
                      isGlobalFilter={false}
                      customPageSize={itemsPerPage}
                      cardStyle={{ borderRadius: "20px", overflow: "hidden" }}
                      
                      //  NOUVEAU : Ajoutez ces props pour la ligne de totaux
                      showTotalRow={true}
                      totalConfig={{
                        totalLabel: "Total",
                        totalLabelColumn: 1,
                        columnsToSum: ['valeur_origine', 'valeur_comptable'],
                        formatValues: {
                          'valeur_origine': (val) => `${formatMontant(val)} `,
                          'valeur_comptable': (val) => `${formatMontant(val)} `,
                        },
                        textColor: "text-primary",
                        fontWeight: "fw-bold",
                        // bgColor: "table-active",
                        align: "start",
                      }}
                    >
                      <Pagination
                        data={filteredData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        alwaysShow={true}
                        showInfo={true}
                      />
                    </TableContainerTotal>
                    
                    {/*  Résumé détaillé des totaux */}
                    <div className="alert alert-light border mt-3" style={{ borderRadius: "15px" }}>
                      <h6 className="mb-3 text-primary">
                        <i className="ri-calculator-line me-2"></i>
                        Résumé du Patrimoine Immobilier
                      </h6>
                      
                      <Row className="text-center">
                        <Col md={3}>
                          <div className="border-end pe-3">
                            <h6 className="mb-1 text-muted">Valeur d'Origine</h6>
                            <p className="fs-5 fw-bold text-success mb-0">
                              {formatMontant(totals.totalValeurOrigine)} 
                            </p>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="border-end pe-3">
                            <h6 className="mb-1 text-muted">Cumul Amortissement</h6>
                            <p className="fs-5 fw-bold text-warning mb-0">
                              {formatMontant(totals.totalCumulAmortissement)} 
                            </p>
                            <small className="text-muted">
                              {totals.totalValeurOrigine > 0 
                                ? `${((totals.totalCumulAmortissement / totals.totalValeurOrigine) * 100).toFixed(1)}%` 
                                : '0%'} amorti
                            </small>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="border-end pe-3">
                            <h6 className="mb-1 text-muted">Valeur Comptable</h6>
                            <p className="fs-5 fw-bold text-primary mb-0">
                              {formatMontant(totals.totalValeurComptable)} 
                            </p>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div>
                            <h6 className="mb-1 text-muted">Taux d'Amortissement</h6>
                            <p className="fs-5 fw-bold text-info mb-0">
                              {totals.totalValeurOrigine > 0 
                                ? `${((totals.totalCumulAmortissement / totals.totalValeurOrigine) * 100).toFixed(1)}%` 
                                : '0%'}
                            </p>
                            <small className="text-muted">
                              Amortissement global
                            </small>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    
                    {/* ✅ Statistiques supplémentaires */}
                    <div className="row mt-2">
                      <Col md={4}>
                        <div className="alert alert-success border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-checkbox-circle-line me-2"></i>
                            Immobilisations Actives
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {filteredData.filter(asset => asset.statut === 'actif').length}
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="alert alert-warning border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-tools-line me-2"></i>
                            En Maintenance
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {filteredData.filter(asset => asset.statut === 'en_maintenance').length}
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="alert alert-danger border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-exchange-dollar-line me-2"></i>
                            Cédées/Hors Service
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {filteredData.filter(asset => asset.statut === 'cede' || asset.statut === 'hors_service').length}
                          </p>
                        </div>
                      </Col>
                    </div>
                  </div>
                ) : (
                  <EmptyDataCard
                    title="Aucune immobilisation trouvée"
                    description={
                      searchTerm
                        ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
                        : "Commencez par créer une nouvelle immobilisation."
                    }
                    actionButton={
                      <button
                        className="btn btn-success"
                        onClick={switchToCreate}
                        style={{ borderRadius: "20px" }}
                      >
                        <i className="ri-add-line me-1"></i>
                        Nouvelle immobilisation
                      </button>
                    }
                    secondaryAction={
                      searchTerm && (
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => setSearchTerm("")}
                          style={{ borderRadius: "20px" }}
                        >
                          <i className="ri-close-line me-1"></i>
                          Effacer la recherche
                        </button>
                      )
                    }
                  />
                )}
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ImmobilisationsListe;