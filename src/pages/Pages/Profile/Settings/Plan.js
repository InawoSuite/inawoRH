import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  UncontrolledTooltip,
  Card,
  CardBody,
  Collapse,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import Pagination from "../../../../Components/Common/Pagination";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { useFormik } from "formik";

// Types de comptes (Classes comptables)
const ACCOUNT_TYPES = [
  { value: 'charge', label: 'Charge (Classe 6)' },
  { value: 'produit', label: 'Produit (Classe 7)' },
  { value: 'actif', label: 'Actif (Classe 2)' },
  { value: 'passif', label: 'Passif (Classe 4)' },
  { value: 'tresorerie', label: 'Trésorerie (Classe 5)' },
  { value: 'capitaux', label: 'Capitaux (Classe 1)' },
  { value: 'ecarts', label: 'Écarts (Classe 8)' },
];

// Structure des classes avec couleurs
const ACCOUNT_CLASSES = {
  1: { 
    nom: 'Capitaux', 
    color: 'dark'
  },
  2: { 
    nom: 'Actif', 
    color: 'primary'
  },
  4: { 
    nom: 'Passif', 
    color: 'warning'
  },
  5: { 
    nom: 'Trésorerie', 
    color: 'info'
  },
  6: { 
    nom: 'Charges', 
    color: 'danger'
  },
  7: { 
    nom: 'Produits', 
    color: 'success'
  },
  8: { 
    nom: 'Écarts', 
    color: 'secondary'
  }
};

// DONNÉES FICTIVES POUR LE PLAN COMPTABLE
const MOCK_ACCOUNTS_DATA = [
  { id: 1, numero: "1", nom: "CAPITAUX PROPRES", type: "capitaux" },
  { id: 2, numero: "101", nom: "Capital social", type: "capitaux" },
  { id: 3, numero: "1011", nom: "Capital social souscrit", type: "capitaux" },
  { id: 4, numero: "1012", nom: "Capital social non appelé", type: "capitaux" },
  { id: 5, numero: "2", nom: "ACTIF IMMOBILISÉ", type: "actif" },
  { id: 6, numero: "21", nom: "Immobilisations incorporelles", type: "actif" },
  { id: 7, numero: "211", nom: "Fonds commercial", type: "actif" },
  { id: 8, numero: "2111", nom: "Droit au bail", type: "actif" },
  { id: 9, numero: "22", nom: "Immobilisations corporelles", type: "actif" },
  { id: 10, numero: "221", nom: "Terrains", type: "actif" },
  { id: 11, numero: "2211", nom: "Terrains nus", type: "actif" },
  { id: 12, numero: "2212", nom: "Terrains bâtis", type: "actif" },
  { id: 13, numero: "23", nom: "Immobilisations financières", type: "actif" },
  { id: 14, numero: "231", nom: "Titres de participation", type: "actif" },
  { id: 15, numero: "4", nom: "PASSIF CIRCULANT", type: "passif" },
  { id: 16, numero: "40", nom: "Fournisseurs et comptes rattachés", type: "passif" },
  { id: 17, numero: "401", nom: "Fournisseurs", type: "passif" },
  { id: 18, numero: "4011", nom: "Fournisseurs - Marchandises", type: "passif" },
  { id: 19, numero: "4012", nom: "Fournisseurs - Matériel", type: "passif" },
  { id: 20, numero: "5", nom: "TRÉSORERIE", type: "tresorerie" },
  { id: 21, numero: "51", nom: "Banques", type: "tresorerie" },
  { id: 22, numero: "511", nom: "Banque BICEC", type: "tresorerie" },
  { id: 23, numero: "5111", nom: "Compte courant BICEC", type: "tresorerie" },
  { id: 24, numero: "5112", nom: "Compte épargne BICEC", type: "tresorerie" },
  { id: 25, numero: "52", nom: "Caisses", type: "tresorerie" },
  { id: 26, numero: "521", nom: "Caisse principale", type: "tresorerie" },
  { id: 27, numero: "5211", nom: "Caisse siège", type: "tresorerie" },
  { id: 28, numero: "6", nom: "CHARGES", type: "charge" },
  { id: 29, numero: "60", nom: "Achats", type: "charge" },
  { id: 30, numero: "601", nom: "Achats stockés", type: "charge" },
  { id: 31, numero: "6011", nom: "Achats de matières premières", type: "charge" },
  { id: 32, numero: "6012", nom: "Achats de marchandises", type: "charge" },
  { id: 33, numero: "602", nom: "Achats non stockés", type: "charge" },
  { id: 34, numero: "6021", nom: "Achats de fournitures", type: "charge" },
  { id: 35, numero: "61", nom: "Services extérieurs", type: "charge" },
  { id: 36, numero: "611", nom: "Sous-traitance", type: "charge" },
  { id: 37, numero: "6111", nom: "Sous-traitance générale", type: "charge" },
  { id: 38, numero: "62", nom: "Autres services extérieurs", type: "charge" },
  { id: 39, numero: "621", nom: "Location", type: "charge" },
  { id: 40, numero: "6211", nom: "Location de matériel", type: "charge" },
  { id: 41, numero: "63", nom: "Impôts et taxes", type: "charge" },
  { id: 42, numero: "631", nom: "Impôts sur les bénéfices", type: "charge" },
  { id: 43, numero: "6311", nom: "IS", type: "charge" },
  { id: 44, numero: "64", nom: "Charges de personnel", type: "charge" },
  { id: 45, numero: "641", nom: "Salaires et appointements", type: "charge" },
  { id: 46, numero: "6411", nom: "Salaires bruts", type: "charge" },
  { id: 47, numero: "6412", nom: "Primes et gratifications", type: "charge" },
  { id: 48, numero: "65", nom: "Autres charges", type: "charge" },
  { id: 49, numero: "651", nom: "Pertes sur créances", type: "charge" },
  { id: 50, numero: "7", nom: "PRODUITS", type: "produit" },
  { id: 51, numero: "70", nom: "Ventes", type: "produit" },
  { id: 52, numero: "701", nom: "Ventes de marchandises", type: "produit" },
  { id: 53, numero: "7011", nom: "Ventes au détail", type: "produit" },
  { id: 54, numero: "7012", nom: "Ventes en gros", type: "produit" },
  { id: 55, numero: "702", nom: "Ventes de produits finis", type: "produit" },
  { id: 56, numero: "7021", nom: "Ventes produits A", type: "produit" },
  { id: 57, numero: "7022", nom: "Ventes produits B", type: "produit" },
  { id: 58, numero: "71", nom: "Production immobilisée", type: "produit" },
  { id: 59, numero: "711", nom: "Production pour soi-même", type: "produit" },
  { id: 60, numero: "7111", nom: "Construction bâtiment", type: "produit" },
  { id: 61, numero: "72", nom: "Autres produits", type: "produit" },
  { id: 62, numero: "721", nom: "Produits accessoires", type: "produit" },
  { id: 63, numero: "7211", nom: "Ventes d'emballages", type: "produit" },
  { id: 64, numero: "8", nom: "COMPTES SPÉCIAUX", type: "ecarts" },
  { id: 65, numero: "81", nom: "Résultats", type: "ecarts" },
  { id: 66, numero: "811", nom: "Résultat de l'exercice", type: "ecarts" },
  { id: 67, numero: "8111", nom: "Bénéfice", type: "ecarts" },
  { id: 68, numero: "8112", nom: "Perte", type: "ecarts" },
];

const PlanComptable = () => {
  const { t } = useTranslation();
  
  // États principaux
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  
  // États des modals
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // États pour les classes déroulantes
  const [expandedClasses, setExpandedClasses] = useState({});

  const itemsPerPage = 15;

  // ✅ Options pour les types de comptes
  const accountTypeOptions = useMemo(() => ACCOUNT_TYPES, []);

  // ✅ Fonction pour déterminer la classe à partir du numéro de compte
  const getAccountClass = (accountNumber) => {
    const firstDigit = parseInt(accountNumber?.toString().charAt(0) || '0');
    return ACCOUNT_CLASSES[firstDigit] ? ACCOUNT_CLASSES[firstDigit].nom : 'Autre';
  };

  // ✅ Fonction pour obtenir les informations de la classe
  const getAccountClassInfo = (accountNumber) => {
    const firstDigit = parseInt(accountNumber?.toString().charAt(0) || '0');
    return ACCOUNT_CLASSES[firstDigit] || { nom: 'Autre', color: 'secondary' };
  };

  // ✅ Fonction pour déterminer le type de structure
  const getAccountStructure = (accountNumber) => {
    if (!accountNumber) return 'Inconnu';
    
    const length = accountNumber.toString().length;
    if (length === 1) return 'Classe';
    if (length === 2) return 'Compte Principal';
    if (length === 3) return 'Compte Divisionnaire';
    if (length >= 4) return 'Sous Compte';
    return 'Inconnu';
  };

  // ✅ Fonction pour générer les barres de hiérarchie
  const getHierarchyIndicators = useCallback((accountNumber) => {
    const length = accountNumber.toString().length;
    const indicators = [];
    
    if (length === 1) {
      return <span className="fw-bold">{accountNumber}</span>;
    }
    
    // Barres verticales pour les niveaux intermédiaires
    for (let i = 0; i < length - 1; i++) {
      indicators.push(
        <span key={`bar-${i}`} className="text-muted me-1">
          │
        </span>
      );
    }
    
    // Connecteur final
    indicators.push(
      <span key="connector" className="text-muted me-1">
        ├─
      </span>
    );
    
    return (
      <>
        <span className="d-inline-block me-1" style={{ minWidth: `${(length - 1) * 10}px` }}>
          {indicators}
        </span>
        <span className="fw-bold">{accountNumber}</span>
      </>
    );
  }, []);

  // ✅ Grouper les comptes par classe
  const groupedAccounts = useMemo(() => {
    if (!accountsData.length) return {};
    
    const groups = {};
    accountsData.forEach(account => {
      const classNum = account.numero?.toString().charAt(0) || '0';
      if (!groups[classNum]) {
        groups[classNum] = {
          classInfo: getAccountClassInfo(classNum),
          accounts: [],
          count: 0
        };
      }
      groups[classNum].accounts.push(account);
      groups[classNum].count++;
    });
    
    // Trier les classes par numéro
    return Object.keys(groups)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = groups[key];
        return sorted;
      }, {});
  }, [accountsData]);

  // ✅ Filtrage optimisé des comptes
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return accountsData;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return accountsData.filter((account) =>
      account.numero.toLowerCase().includes(lowerSearchTerm) ||
      account.nom.toLowerCase().includes(lowerSearchTerm) ||
      account.type.toLowerCase().includes(lowerSearchTerm)
    );
  }, [accountsData, searchTerm]);

  // ✅ Données paginées avec les groupes
  const paginatedGroupedAccounts = useMemo(() => {
    if (searchTerm) {
      // Si recherche, afficher tous les résultats normalement
      const startIndex = (currentPage - 1) * itemsPerPage;
      return { 
        filtered: true,
        data: filteredData.slice(startIndex, startIndex + itemsPerPage)
      };
    } else {
      // Si pas de recherche, grouper par classe
      const classKeys = Object.keys(groupedAccounts);
      const result = {};
      let totalAccounts = 0;
      
      classKeys.forEach(classKey => {
        result[classKey] = {
          ...groupedAccounts[classKey],
          accounts: groupedAccounts[classKey].accounts
        };
        totalAccounts += groupedAccounts[classKey].count;
      });
      
      return {
        filtered: false,
        data: result,
        totalAccounts
      };
    }
  }, [groupedAccounts, filteredData, currentPage, itemsPerPage, searchTerm]);

  // ✅ Fonction pour récupérer les comptes (MOCK)
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const data = MOCK_ACCOUNTS_DATA;
        setAccountsData(data);
        
        const exportDataFormatted = data.map(account => ({
          "Numéro": account.numero || "N/A",
          "Structure": getAccountStructure(account.numero),
          "Nom du compte": account.nom,
          "Type": ACCOUNT_TYPES.find(t => t.value === account.type)?.label || account.type,
        }));
        setExportData(exportDataFormatted);
        
        // Initialiser toutes les classes comme ouvertes
        const initialExpanded = {};
        data.forEach(account => {
          const classNum = account.numero?.toString().charAt(0) || '0';
          initialExpanded[classNum] = true;
        });
        setExpandedClasses(initialExpanded);
        
        toast.success("Données du plan comptable chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchAccounts:", err);
        toast.error("Erreur lors du chargement des données");
        setAccountsData([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Plan Comptable | INAWO - Suite de Gestion";
    fetchAccounts();
  }, [fetchAccounts]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Toggle l'expansion d'une classe
  const toggleClassExpansion = useCallback((classNum) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classNum]: !prev[classNum]
    }));
  }, []);

  // ✅ Toggle toutes les classes
  const toggleAllClasses = useCallback((expand = true) => {
    const newExpanded = {};
    Object.keys(groupedAccounts).forEach(classKey => {
      newExpanded[classKey] = expand;
    });
    setExpandedClasses(newExpanded);
  }, [groupedAccounts]);

  // ✅ Validation du formulaire (CRÉATION : numéro, nom, type)
  const createValidationSchema = Yup.object({
    numero: Yup.string()
      .required("Le numéro de compte est requis")
      .matches(/^[0-9]+$/, "Le numéro doit contenir uniquement des chiffres")
      .min(1, "Le numéro doit avoir au moins 1 chiffre")
      .max(10, "Le numéro ne peut pas dépasser 10 chiffres"),
    nom: Yup.string()
      .required("Le nom du compte est requis")
      .min(3, "Le nom doit contenir au moins 3 caractères"),
    type: Yup.string()
      .required("Le type de compte est requis")
      .oneOf(ACCOUNT_TYPES.map(t => t.value), "Type de compte invalide"),
  });

  // ✅ Validation du formulaire (ÉDITION : seulement numéro et nom)
  const editValidationSchema = Yup.object({
    numero: Yup.string()
      .required("Le numéro de compte est requis")
      .matches(/^[0-9]+$/, "Le numéro doit contenir uniquement des chiffres")
      .min(1, "Le numéro doit avoir au moins 1 chiffre")
      .max(10, "Le numéro ne peut pas dépasser 10 chiffres"),
    nom: Yup.string()
      .required("Le nom du compte est requis")
      .min(3, "Le nom doit contenir au moins 3 caractères"),
  });

  // ✅ Formik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      numero: '',
      nom: '',
      type: '',
    },
    validationSchema: isEdit ? editValidationSchema : createValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitAccount(values, resetForm, setSubmitting);
    }
  });

  // ✅ Fonction de soumission (MOCK)
  const handleSubmitAccount = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        if (isEdit && currentAccount) {
          // ÉDITION : seulement numéro et nom (le type reste inchangé)
          const updatedData = accountsData.map(account =>
            account.id === currentAccount.id 
              ? { 
                  ...account, 
                  numero: values.numero,
                  nom: values.nom
                  // Le type n'est PAS modifié dans l'édition
                }
              : account
          );
          setAccountsData(updatedData);
          toast.success("Compte modifié avec succès!");
        } else {
          // CRÉATION : numéro, nom et type
          const newAccount = {
            id: accountsData.length + 1,
            numero: values.numero,
            nom: values.nom,
            type: values.type
          };
          setAccountsData(prev => [...prev, newAccount]);
          toast.success("Compte ajouté avec succès!");
        }
        
        resetForm();
        handleModalClose();
        
      } catch (err) {
        console.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} du compte:`, err);
        toast.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} du compte`);
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de suppression (MOCK)
  const handleDeleteAccount = async () => {
    if (!accountToDelete?.id) return;

    setTimeout(() => {
      try {
        const updatedData = accountsData.filter(account => account.id !== accountToDelete.id);
        setAccountsData(updatedData);
        toast.success("Compte supprimé avec succès!");
        setDeleteModal(false);
        setAccountToDelete(null);
        
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression du compte");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleModalClose = useCallback(() => {
    setModal(false);
    setIsEdit(false);
    setCurrentAccount(null);
    formik.resetForm();
  }, [formik]);

  const handleDetailModalClose = useCallback(() => {
    setDetailModal(false);
    setSelectedAccount(null);
  }, []);

  const handleOpenDetailModal = useCallback((account) => {
    setSelectedAccount(account);
    setDetailModal(true);
  }, []);

  const handleOpenEditModal = useCallback((account) => {
    if (!account?.id) {
      toast.error("Données de compte invalides");
      return;
    }

    setCurrentAccount(account);
    setIsEdit(true);
    // ÉDITION : seulement numéro et nom
    formik.setValues({
      numero: account.numero || '',
      nom: account.nom || '',
      type: account.type || '', // Le type est présent mais le champ sera désactivé
    });
    setModal(true);
  }, [formik]);

  const handleOpenAddModal = useCallback(() => {
    setCurrentAccount(null);
    setIsEdit(false);
    // CRÉATION : tous les champs vides
    formik.setValues({
      numero: '',
      nom: '',
      type: '',
    });
    setModal(true);
  }, [formik]);

  const handleOpenDeleteModal = useCallback((account) => {
    setAccountToDelete(account);
    setDeleteModal(true);
  }, []);

  // ✅ Fonction pour obtenir le label du type
  const getTypeLabel = useCallback((typeValue) => {
    const typeObj = ACCOUNT_TYPES.find(t => t.value === typeValue);
    return typeObj ? typeObj.label : typeValue;
  }, []);

  // ✅ Fonction pour obtenir la couleur du type
  const getTypeColor = useCallback((typeValue) => {
    const typeColors = {
      'charge': 'danger',
      'produit': 'success',
      'actif': 'primary',
      'passif': 'warning',
      'tresorerie': 'info',
      'capitaux': 'dark',
      'ecarts': 'secondary'
    };
    return typeColors[typeValue] || 'secondary';
  }, []);

  // ✅ Fonction pour obtenir la couleur de la structure
  const getStructureColor = useCallback((structure) => {
    const structureColors = {
      'Classe': 'primary',
      'Compte Principal': 'success',
      'Compte Divisionnaire': 'warning',
      'Sous Compte': 'info'
    };
    return structureColors[structure] || 'secondary';
  }, []);

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
          />

          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
            filename="Plan_comptable"
          />

          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteAccount}
            onCloseClick={() => {
              setDeleteModal(false);
              setAccountToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible."
          />

          <BreadCrumb
            title="Plan Comptable"
            pageTitle={
              <>
                <i className="ri-book-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <SearchAndActionBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Rechercher par numéro ou nom..."
              showSearch={true}
              onAddClick={handleOpenAddModal}
              addButtonText="Nouveau compte"
              addButtonIcon="ri-file-add-line"
              showAddButton={true}
              onExportClick={() => setIsExportCSV(true)}
              exportButtonText="Exporter"
              exportButtonIcon="ri-file-download-line"
              showExportButton={true}
              additionalInfo={
                <div className="d-flex align-items-center text-muted">
                  <i className="ri-information-line me-1"></i>
                  {!searchTerm 
                    ? `${Object.keys(groupedAccounts).length} classe(s) comptable(s)` 
                    : `${filteredData.length} compte${filteredData.length !== 1 ? 's' : ''} trouvé${filteredData.length !== 1 ? 's' : ''}`
                  }
                </div>
              }
            />

            <Col lg={12}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                  <div className="text-center">
                    <Loader />
                    <p className="mt-3 text-muted">Chargement du Plan Comptable...</p>
                  </div>
                </div>
              ) : filteredData.length > 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardBody className="p-0">
                    <div className="table-responsive">
                      <Table striped hover className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}></th>
                            <th style={{ minWidth: '120px' }}>
                              <div className="text-muted font-size-12">Numéro</div>
                            </th>
                            <th style={{ minWidth: '280px' }}>
                              <div className="text-muted font-size-12">Nom du compte</div>
                            </th>
                            <th className="text-center" style={{ width: '100px' }}>
                              <div className="text-muted font-size-12">Actions</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {!searchTerm ? (
                            // AFFICHAGE GROUPÉ PAR CLASSE (sans recherche)
                            Object.keys(paginatedGroupedAccounts.data).map((classKey) => {
                              const classGroup = paginatedGroupedAccounts.data[classKey];
                              const isExpanded = expandedClasses[classKey];
                              
                              return (
                                <React.Fragment key={classKey}>
                                  {/* Ligne d'en-tête de la classe - Zone entière cliquable */}
                                  <tr 
                                    className="class-header-row" 
                                    style={{ 
                                      backgroundColor: 'rgba(var(--bs-primary-rgb), 0.05)',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => toggleClassExpansion(classKey)}
                                  >
                                    <td className="text-center">
                                      <span className="d-inline-block">
                                        <i className={`ri-arrow-${isExpanded ? 'down' : 'right'}-s-line fs-14`}></i>
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <span className="fw-bold text-dark">
                                          Classe {classKey}
                                        </span>
                                      </div>
                                    </td>
                                    <td colSpan="2">
                                      <div className="d-flex align-items-center">
                                        <span className="fw-medium me-2">{classGroup.classInfo.nom}</span>
                                        <Badge 
                                          color={classGroup.classInfo.color} 
                                          className="rounded-pill fs-11 px-2 py-1"
                                        >
                                          {classGroup.count} compte{classGroup.count > 1 ? 's' : ''}
                                        </Badge>
                                      </div>
                                    </td>
                                  </tr>
                                  
                                  {/* Comptes de la classe (dans un Collapse) */}
                                  <tr>
                                    <td colSpan="4" className="p-0 border-0">
                                      <Collapse isOpen={isExpanded}>
                                        <div className="px-3 py-2">
                                          <Table size="sm" borderless className="mb-0">
                                            <tbody>
                                              {classGroup.accounts.map((account) => {
                                                const hierarchyIndicators = getHierarchyIndicators(account.numero);
                                                
                                                return (
                                                  <tr key={account.id} className="account-row">
                                                    <td style={{ width: '40px' }}></td>
                                                    <td style={{ minWidth: '120px' }}>
                                                      <div className="text-dark fw-medium">
                                                        {hierarchyIndicators}
                                                      </div>
                                                    </td>
                                                    <td style={{ minWidth: '280px' }}>
                                                      <div className="fw-medium">
                                                        {account.nom}
                                                      </div>
                                                    </td>
                                                    <td className="text-center" style={{ width: '100px' }}>
                                                      <div className="d-flex gap-2 justify-content-center">
                                                        <Button
                                                          color="link"
                                                          size="sm"
                                                          className="p-0 text-info"
                                                          id={`view-${account.id}`}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDetailModal(account);
                                                          }}
                                                          title="Voir détails"
                                                        >
                                                          <i className="ri-eye-fill fs-14"></i>
                                                        </Button>
                                                        <UncontrolledTooltip placement="top" target={`view-${account.id}`}>
                                                          Voir détails
                                                        </UncontrolledTooltip>
                                                        
                                                        <Button
                                                          color="link"
                                                          size="sm"
                                                          className="p-0 text-primary"
                                                          id={`edit-${account.id}`}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenEditModal(account);
                                                          }}
                                                          title="Éditer"
                                                        >
                                                          <i className="ri-pencil-fill fs-14"></i>
                                                        </Button>
                                                        <UncontrolledTooltip placement="top" target={`edit-${account.id}`}>
                                                          Éditer
                                                        </UncontrolledTooltip>
                                                        
                                                        <Button
                                                          color="link"
                                                          size="sm"
                                                          className="p-0 text-danger"
                                                          id={`delete-${account.id}`}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDeleteModal(account);
                                                          }}
                                                          title="Supprimer"
                                                        >
                                                          <i className="ri-delete-bin-5-fill fs-14"></i>
                                                        </Button>
                                                        <UncontrolledTooltip placement="top" target={`delete-${account.id}`}>
                                                          Supprimer
                                                        </UncontrolledTooltip>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </Table>
                                        </div>
                                      </Collapse>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })
                          ) : (
                            // AFFICHAGE NORMAL AVEC RECHERCHE
                            paginatedGroupedAccounts.data.map((account, index) => {
                              const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                              const hierarchyIndicators = getHierarchyIndicators(account.numero);
                              
                              return (
                                <tr key={account.id} className="account-row">
                                  <td style={{ width: '40px' }}></td>
                                  <td style={{ minWidth: '120px' }}>
                                    <div className="text-dark fw-medium">
                                      {hierarchyIndicators}
                                    </div>
                                  </td>
                                  <td style={{ minWidth: '280px' }}>
                                    <div className="fw-medium">
                                      {account.nom}
                                    </div>
                                  </td>
                                  <td className="text-center" style={{ width: '100px' }}>
                                    <div className="d-flex gap-2 justify-content-center">
                                      <Button
                                        color="link"
                                        size="sm"
                                        className="p-0 text-info"
                                        id={`view-${account.id}`}
                                        onClick={() => handleOpenDetailModal(account)}
                                        title="Voir détails"
                                      >
                                        <i className="ri-eye-fill fs-14"></i>
                                      </Button>
                                      <UncontrolledTooltip placement="top" target={`view-${account.id}`}>
                                        Voir détails
                                      </UncontrolledTooltip>
                                      
                                      <Button
                                        color="link"
                                        size="sm"
                                        className="p-0 text-primary"
                                        id={`edit-${account.id}`}
                                        onClick={() => handleOpenEditModal(account)}
                                        title="Éditer"
                                      >
                                        <i className="ri-pencil-fill fs-14"></i>
                                      </Button>
                                      <UncontrolledTooltip placement="top" target={`edit-${account.id}`}>
                                        Éditer
                                      </UncontrolledTooltip>
                                      
                                      <Button
                                        color="link"
                                        size="sm"
                                        className="p-0 text-danger"
                                        id={`delete-${account.id}`}
                                        onClick={() => handleOpenDeleteModal(account)}
                                        title="Supprimer"
                                      >
                                        <i className="ri-delete-bin-5-fill fs-14"></i>
                                      </Button>
                                      <UncontrolledTooltip placement="top" target={`delete-${account.id}`}>
                                        Supprimer
                                      </UncontrolledTooltip>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </Table>
                    </div>
                    
                    {/* Boutons pour gérer l'expansion */}
                    {!searchTerm && Object.keys(groupedAccounts).length > 0 && (
                      <div className="d-flex justify-content-between align-items-center p-3 border-top">
                        <div className="text-muted small">
                          <i className="ri-information-line me-1"></i>
                          Cliquez sur la ligne de la classe pour déplier/réduire
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            color="outline-primary"
                            size="sm"
                            onClick={() => toggleAllClasses(true)}
                            className="rounded-pill"
                          >
                            <i className="ri-expand-horizontal-line me-1"></i>
                            Tout déplier
                          </Button>
                          <Button
                            color="outline-secondary"
                            size="sm"
                            onClick={() => toggleAllClasses(false)}
                            className="rounded-pill"
                          >
                            <i className="ri-collapse-horizontal-line me-1"></i>
                            Tout réduire
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Pagination */}
                    {searchTerm && (
                      <Pagination
                        data={filteredData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        alwaysShow={true}
                        showInfo={true}
                      />
                    )}
                  </CardBody>
                </Card>
              ) : (
                <EmptyDataCard
                  title="Aucun compte trouvé"
                  description={
                    searchTerm
                      ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
                      : "Commencez par créer un nouveau compte pour organiser votre plan comptable."
                  }
                  actionButton={
                    <Button
                      color="success"
                      onClick={handleOpenAddModal}
                      className="rounded-pill"
                    >
                      <i className="ri-file-add-line me-1"></i>
                      Nouveau compte
                    </Button>
                  }
                  secondaryAction={
                    searchTerm && (
                      <Button
                        color="outline-secondary"
                        onClick={() => setSearchTerm("")}
                        className="rounded-pill ms-2"
                      >
                        <i className="ri-close-line me-1"></i>
                        Effacer la recherche
                      </Button>
                    )
                  }
                />
              )}
            </Col>
          </Row>
        </Container>

        {/* Modal d'ajout/modification */}
        <Modal
          isOpen={modal}
          toggle={handleModalClose}
          centered
          className="border-0"
          contentClassName="custom-rounded-modal"
          size="md"
        >
          <ModalHeader
            toggle={handleModalClose}
            className="bg-light p-3"
            style={{ borderRadius: "20px 20px 0 0" }}
          >
            {isEdit ? "Modifier le compte" : "Créer un nouveau compte"}
          </ModalHeader>

          <Form onSubmit={formik.handleSubmit}>
            <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
              <div className="mb-3">
                <Label htmlFor="numero" className="form-label">
                  Numéro du compte <span className="text-danger">*</span>
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  type="text"
                  placeholder="Ex: 601, 4011, 281"
                  className="rounded-pill"
                  value={formik.values.numero}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.numero && Boolean(formik.errors.numero)}
                />
                {formik.touched.numero && formik.errors.numero && (
                  <FormFeedback>{formik.errors.numero}</FormFeedback>
                )}
                <small className="text-muted">
                  1-10 chiffres. Exemples : 
                  <br />
                  <span className="text-primary">1</span> (Classe), 
                  <span className="text-success"> 60</span> (Principal), 
                  <span className="text-warning"> 601</span> (Divisionnaire), 
                  <span className="text-info"> 6011</span> (Sous compte)
                </small>
              </div>

              <div className="mb-3">
                <Label htmlFor="nom" className="form-label">
                  Nom du compte <span className="text-danger">*</span>
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Ex: Achats Matériel Informatique"
                  className="rounded-pill"
                  value={formik.values.nom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.nom && Boolean(formik.errors.nom)}
                />
                {formik.touched.nom && formik.errors.nom && (
                  <FormFeedback>{formik.errors.nom}</FormFeedback>
                )}
                <small className="text-muted">
                  Nom exact et descriptif du compte
                </small>
              </div>

              {/* CHAMP TYPE - Différent selon création/édition */}
              <div className="mb-3">
                <Label htmlFor="type" className="form-label">
                  Type de compte {!isEdit && <span className="text-danger">*</span>}
                </Label>
                {isEdit ? (
                  // ÉDITION : Champ en lecture seule
                  <div>
                    <Input
                      id="type"
                      name="type"
                      type="text"
                      className="rounded-pill bg-light"
                      value={getTypeLabel(formik.values.type)}
                      disabled
                      readOnly
                    />
                    <small className="text-muted">
                      Le type ne peut pas être modifié après création
                    </small>
                  </div>
                ) : (
                  // CRÉATION : Champ sélectionnable
                  <>
                    <CustomSelect
                      value={accountTypeOptions.find(opt => opt.value === formik.values.type) || null}
                      onChange={(selectedOption) => {
                        formik.setFieldValue('type', selectedOption ? selectedOption.value : '');
                      }}
                      options={accountTypeOptions}
                      placeholder="Sélectionnez un type"
                      isClearable={false}
                      className={formik.touched.type && formik.errors.type ? 'is-invalid' : ''}
                    />
                    {formik.touched.type && formik.errors.type && (
                      <div className="invalid-feedback d-block">{formik.errors.type}</div>
                    )}
                    <small className="text-muted">
                      Type recommandé selon le numéro : 
                      <br />
                      • <strong>6xxx</strong> → Charge | • <strong>7xxx</strong> → Produit | 
                      • <strong>2xxx</strong> → Actif | • <strong>4xxx</strong> → Passif
                    </small>
                  </>
                )}
              </div>

              {isEdit && (
                <div className="alert alert-info border mb-3">
                  <div className="d-flex align-items-center">
                    <i className="ri-information-line me-2"></i>
                    <div>
                      <strong>Note :</strong> Le type du compte ne peut pas être modifié après création.
                      <br />
                      <small>Seul le numéro et le nom peuvent être édités.</small>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
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
                    {isEdit ? "Modification..." : "Enregistrement..."}
                  </>
                ) : (
                  <>
                    <i className={isEdit ? "ri-save-line me-1" : "ri-add-line me-1"}></i>
                    {isEdit ? "Enregistrer" : "Ajouter le compte"}
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
          size="lg"
        >
          <ModalHeader
            toggle={handleDetailModalClose}
            className="bg-light p-3 rounded-top-4"
          >
            {/* <i className="ri-information-line me-2"></i> */}
            Détails du compte
          </ModalHeader>

          <ModalBody>
            {selectedAccount && (
              <div>
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Numéro du compte</h6>
                      <h4 className="fw-bold text-primary">{selectedAccount.numero}</h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Type</h6>
                      <Badge 
                        color={getTypeColor(selectedAccount.type)} 
                        className="rounded-pill fs-6 px-3 py-2"
                      >
                        {getTypeLabel(selectedAccount.type)}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Nom du compte</h6>
                      <h5 className="fw-bold">{selectedAccount.nom}</h5>
                    </div>
                  </Col>
                </Row>

                <div className="mt-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <i className="ri-hierarchy me-2"></i>
                    Structure hiérarchique
                  </h6>
                  
                  <Table bordered striped hover className="mb-4">
                    <thead>
                      <tr>
                        <th width="150" className="text-gray-600 text-uppercase font-size-12">Élément</th>
                        <th width="100" className="text-gray-600 text-uppercase font-size-12">Valeur</th>
                        <th className="text-gray-600 text-uppercase font-size-12">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><Badge color="primary">CLASSE</Badge></td>
                        <td className="fw-bold text-center">{selectedAccount.numero?.toString().charAt(0) || '-'}</td>
                        <td>{getAccountClass(selectedAccount.numero)}</td>
                      </tr>
                      <tr>
                        <td><Badge color="success">COMPTE PRINCIPAL</Badge></td>
                        <td className="fw-bold text-success text-center">
                          {selectedAccount.numero?.toString().length >= 2 
                            ? selectedAccount.numero.toString().substring(0, 2) 
                            : '-'}
                        </td>
                        <td>Regroupement principal des comptes</td>
                      </tr>
                      <tr>
                        <td><Badge color="warning">COMPTE DIVISIONNAIRE</Badge></td>
                        <td className="fw-bold text-warning text-center">
                          {selectedAccount.numero?.toString().length >= 3 
                            ? selectedAccount.numero.toString().substring(0, 3) 
                            : '-'}
                        </td>
                        <td>Sous-division des comptes principaux</td>
                      </tr>
                      <tr>
                        <td><Badge color="info">SOUS COMPTE</Badge></td>
                        <td className="fw-bold text-info text-center">{selectedAccount.numero}</td>
                        <td>Compte détaillé pour la comptabilité analytique</td>
                      </tr>
                    </tbody>
                  </Table>
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
      </div>
    </React.Fragment>
  );
};

export default PlanComptable;