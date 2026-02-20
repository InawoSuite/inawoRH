import React, { useState, useEffect, useCallback, useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { useFormik } from "formik";

// Types de pièces comptables
const PIECE_TYPES = [
  { value: 'facture', label: 'Facture' },
  { value: 'bon_commande', label: 'Bon de commande' },
  { value: 'bon_livraison', label: 'Bon de livraison' },
  { value: 'devis', label: 'Devis' },
  { value: 'avoir', label: 'Avoir' },
  { value: 'releve_bancaire', label: 'Relevé bancaire' },
  { value: 'fiche_paye', label: 'Fiche de paie' },
  { value: 'autre', label: 'Autre document' },
];

// Statuts des pièces
const PIECE_STATUS = [
  { value: 'draft', label: 'Brouillon', color: 'secondary' },
  { value: 'pending', label: 'En attente', color: 'warning' },
  { value: 'validated', label: 'Validée', color: 'success' },
  { value: 'rejected', label: 'Rejetée', color: 'danger' },
  { value: 'archived', label: 'Archivée', color: 'info' },
];

// DONNÉES FICTIVES POUR LES PIÈCES COMPTABLES
const MOCK_PIECES_DATA = [
  {
    id: 1,
    reference: "FAC-2025-001",
    type: "facture",
    numero: "FAC-001/2025",
    date: "2025-01-15",
    montant: 1500000,
    devise: "",
    client_fournisseur: "Client Alpha SARL",
    description: "Facture pour vente de marchandises",
    statut: "validated",
    fichier: "facture_001.pdf",
    date_creation: "2025-01-15",
    compte_associe: "701",
  },
  {
    id: 2,
    reference: "BC-2025-002",
    type: "bon_commande",
    numero: "BC-002/2025",
    date: "2025-01-14",
    montant: 850000,
    devise: "",
    client_fournisseur: "Fournisseur Beta",
    description: "Commande de matières premières",
    statut: "pending",
    fichier: "bon_commande_002.pdf",
    date_creation: "2025-01-14",
    compte_associe: "601",
  },
  {
    id: 3,
    reference: "BL-2025-003",
    type: "bon_livraison",
    numero: "BL-003/2025",
    date: "2025-01-13",
    montant: 0,
    devise: "",
    client_fournisseur: "Client Gamma",
    description: "Livraison de produits finis",
    statut: "validated",
    fichier: "bon_livraison_003.pdf",
    date_creation: "2025-01-13",
    compte_associe: "702",
  },
  {
    id: 4,
    reference: "DEV-2025-004",
    type: "devis",
    numero: "DEV-004/2025",
    date: "2025-01-12",
    montant: 2500000,
    devise: "",
    client_fournisseur: "Client Delta",
    description: "Devis pour prestation de services",
    statut: "draft",
    fichier: "devis_004.pdf",
    date_creation: "2025-01-12",
    compte_associe: "704",
  },
  {
    id: 5,
    reference: "AV-2025-005",
    type: "avoir",
    numero: "AV-005/2025",
    date: "2025-01-11",
    montant: 150000,
    devise: "",
    client_fournisseur: "Client Alpha SARL",
    description: "Avoir pour retour marchandises",
    statut: "validated",
    fichier: "avoir_005.pdf",
    date_creation: "2025-01-11",
    compte_associe: "709",
  },
  {
    id: 6,
    reference: "RB-2025-006",
    type: "releve_bancaire",
    numero: "RB-006/2025",
    date: "2025-01-10",
    montant: 0,
    devise: "",
    client_fournisseur: "Banque BICEC",
    description: "Relevé bancaire décembre 2024",
    statut: "archived",
    fichier: "releve_bancaire_006.pdf",
    date_creation: "2025-01-10",
    compte_associe: "512",
  },
  {
    id: 7,
    reference: "FP-2025-007",
    type: "fiche_paye",
    numero: "FP-007/2025",
    date: "2025-01-09",
    montant: 450000,
    devise: "",
    client_fournisseur: "Salarié - Jean Dupont",
    description: "Fiche de paie décembre 2024",
    statut: "validated",
    fichier: "fiche_paye_007.pdf",
    date_creation: "2025-01-09",
    compte_associe: "641",
  },
  {
    id: 8,
    reference: "AUT-2025-008",
    type: "autre",
    numero: "AUT-008/2025",
    date: "2025-01-08",
    montant: 0,
    devise: "",
    client_fournisseur: "Administration fiscale",
    description: "Avis d'imposition",
    statut: "archived",
    fichier: "avis_imposition_008.pdf",
    date_creation: "2025-01-08",
    compte_associe: "445",
  },
];

const Contrat = () => {
  const { t } = useTranslation();
  
  // États principaux
  const [piecesData, setPiecesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  
  // États des modals
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  
  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [pieceToDelete, setPieceToDelete] = useState(null);

  const itemsPerPage = 10;

  // ✅ Options pour les types et statuts
  const pieceTypeOptions = useMemo(() => PIECE_TYPES, []);
  const pieceStatusOptions = useMemo(() => PIECE_STATUS, []);

  // ✅ Filtrage optimisé des pièces
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return piecesData;
    
    return piecesData.filter((piece) =>
      Object.values(piece).some((value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [piecesData, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Fonction pour récupérer les pièces (MOCK)
  const fetchPieces = useCallback(async () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        setPiecesData(MOCK_PIECES_DATA);
        
        // Préparer les données pour l'export
        const exportDataFormatted = MOCK_PIECES_DATA.map(piece => ({
          "Référence": piece.reference || "N/A",
          "Type": PIECE_TYPES.find(t => t.value === piece.type)?.label || piece.type,
          "Numéro": piece.numero,
          "Date": piece.date,
          "Montant": `${piece.montant?.toLocaleString('fr-FR')} ${piece.devise}`,
          "Client/Fournisseur": piece.client_fournisseur,
          "Description": piece.description,
          "Statut": PIECE_STATUS.find(s => s.value === piece.statut)?.label || piece.statut,
          "Compte associé": piece.compte_associe || "N/A",
        }));
        setExportData(exportDataFormatted);
        
        toast.success("Données des contrats chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchPieces:", err);
        toast.error("Erreur lors du chargement des données");
        setPiecesData([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Contrats | INAWO - Suite de Gestion";
    fetchPieces();
  }, [fetchPieces]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Validation du formulaire (CRÉATION/MODIFICATION)
  const pieceValidationSchema = Yup.object({
    type: Yup.string()
      .required("Le type de pièce est requis")
      .oneOf(PIECE_TYPES.map(t => t.value), "Type de pièce invalide"),
    numero: Yup.string()
      .required("Le numéro de pièce est requis")
      .min(2, "Le numéro doit contenir au moins 2 caractères"),
    date: Yup.date()
      .required("La date est requise"),
    montant: Yup.number()
      .min(0, "Le montant ne peut pas être négatif")
      .nullable()
      .transform((value, originalValue) => originalValue === '' ? null : value),
    client_fournisseur: Yup.string()
      .required("Le client/fournisseur est requis"),
    description: Yup.string()
      .required("La description est requise")
      .min(5, "La description doit contenir au moins 5 caractères"),
    statut: Yup.string()
      .required("Le statut est requis")
      .oneOf(PIECE_STATUS.map(s => s.value), "Statut invalide"),
    compte_associe: Yup.string()
      .matches(/^[0-9]+$/, "Le numéro de compte doit contenir uniquement des chiffres")
      .nullable(),
  });

  // ✅ Formik pour la gestion du formulaire de pièce
  const pieceFormik = useFormik({
    initialValues: {
      type: '',
      numero: '',
      date: '',
      montant: '',
      devise: '',
      client_fournisseur: '',
      description: '',
      statut: 'draft',
      compte_associe: '',
      fichier: null,
    },
    validationSchema: pieceValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitPiece(values, resetForm, setSubmitting);
    }
  });

  // ✅ Validation du formulaire d'import
  const importValidationSchema = Yup.object({
    nom: Yup.string()
      .required("Le nom du fichier est requis")
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    fichier: Yup.mixed()
      .required("Le fichier est requis")
      .test("fileType", "Format de fichier non supporté", (value) => {
        if (!value) return false;
        const acceptedTypes = [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv',
          'image/jpeg',
          'image/png',
          'image/jpg'
        ];
        return acceptedTypes.includes(value.type);
      })
      .test("fileSize", "Fichier trop volumineux (max 5MB)", (value) => {
        if (!value) return false;
        return value.size <= 5 * 1024 * 1024; // 5MB
      })
  });

  // ✅ Formik pour la gestion du formulaire d'import
  const importFormik = useFormik({
    initialValues: {
      nom: '',
      fichier: null,
    },
    validationSchema: importValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleImportFile(values, resetForm, setSubmitting);
    }
  });

  // ✅ Fonction de soumission de pièce (MOCK)
  const handleSubmitPiece = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        if (isEdit && currentPiece) {
          // ÉDITION
          const updatedData = piecesData.map(piece =>
            piece.id === currentPiece.id 
              ? { 
                  ...piece, 
                  ...values,
                  montant: parseFloat(values.montant) || 0,
                  reference: `${values.type.toUpperCase().substring(0, 3)}-${new Date().getFullYear()}-${String(piece.id).padStart(3, '0')}`
                }
              : piece
          );
          setPiecesData(updatedData);
          toast.success("Pièce modifiée avec succès!");
        } else {
          // CRÉATION
          const newPiece = {
            id: piecesData.length + 1,
            reference: `${values.type.toUpperCase().substring(0, 3)}-${new Date().getFullYear()}-${String(piecesData.length + 1).padStart(3, '0')}`,
            ...values,
            montant: parseFloat(values.montant) || 0,
            date_creation: new Date().toISOString().split('T')[0],
            fichier: values.fichier ? values.fichier.name : null,
          };
          setPiecesData(prev => [newPiece, ...prev]);
          toast.success("Pièce ajoutée avec succès!");
        }
        
        resetForm();
        handleModalClose();
        
      } catch (err) {
        console.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} de la pièce:`, err);
        toast.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} de la pièce`);
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction d'import de fichier
  const handleImportFile = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);
    
    setTimeout(() => {
      try {
        // Simulation de l'import
        const newPieces = [
          {
            id: piecesData.length + 1,
            reference: `IMP-${new Date().getFullYear()}-${String(piecesData.length + 1).padStart(3, '0')}`,
            type: "facture",
            numero: `IMP-${String(piecesData.length + 1).padStart(3, '0')}/2025`,
            date: new Date().toISOString().split('T')[0],
            montant: 1250000,
            devise: "",
            client_fournisseur: "Client Import",
            description: `Document importé: ${values.nom}`,
            statut: "validated",
            fichier: values.fichier.name,
            date_creation: new Date().toISOString().split('T')[0],
            compte_associe: "701",
          }
        ];

        setPiecesData(prev => [...newPieces, ...prev]);
        toast.success(`Fichier "${values.nom}" importé avec succès !`);
        resetForm();
        handleImportModalClose();
        
      } catch (err) {
        console.error("Erreur lors de l'import:", err);
        toast.error("Erreur lors de l'import du fichier");
      } finally {
        setSubmitting(false);
      }
    }, 1500);
  };

  // ✅ Fonction de suppression (MOCK)
  const handleDeletePiece = async () => {
    if (!pieceToDelete?.id) return;

    setTimeout(() => {
      try {
        const updatedData = piecesData.filter(piece => piece.id !== pieceToDelete.id);
        setPiecesData(updatedData);
        toast.success("Pièce supprimée avec succès!");
        setDeleteModal(false);
        setPieceToDelete(null);
        
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression de la pièce");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleModalClose = useCallback(() => {
    setModal(false);
    setIsEdit(false);
    setCurrentPiece(null);
    pieceFormik.resetForm();
  }, [pieceFormik]);

  const handleDetailModalClose = useCallback(() => {
    setDetailModal(false);
    setSelectedPiece(null);
  }, []);

  const handleImportModalClose = useCallback(() => {
    setImportModal(false);
    importFormik.resetForm();
  }, [importFormik]);

  const handleOpenDetailModal = useCallback((piece) => {
    setSelectedPiece(piece);
    setDetailModal(true);
  }, []);

  const handleOpenEditModal = useCallback((piece) => {
    if (!piece?.id) {
      toast.error("Données de pièce invalides");
      return;
    }

    setCurrentPiece(piece);
    setIsEdit(true);
    pieceFormik.setValues({
      type: piece.type || '',
      numero: piece.numero || '',
      date: piece.date || '',
      montant: piece.montant || '',
      devise: piece.devise || '',
      client_fournisseur: piece.client_fournisseur || '',
      description: piece.description || '',
      statut: piece.statut || 'draft',
      compte_associe: piece.compte_associe || '',
      fichier: null,
    });
    setModal(true);
  }, [pieceFormik]);

  const handleOpenAddModal = useCallback(() => {
    setCurrentPiece(null);
    setIsEdit(false);
    pieceFormik.resetForm();
    setModal(true);
  }, [pieceFormik]);

  const handleOpenDeleteModal = useCallback((piece) => {
    setPieceToDelete(piece);
    setDeleteModal(true);
  }, []);

  const handleOpenImportModal = useCallback(() => {
    setImportModal(true);
  }, []);

  const handleFileChange = useCallback((event, formik) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("fichier", file);
      // Auto-remplir le nom si vide
      if (!formik.values.nom.trim() && formik === importFormik) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Enlever l'extension
        formik.setFieldValue("nom", fileName);
      }
    }
  }, [importFormik]);

  // ✅ Fonction pour obtenir le label du type
  const getTypeLabel = useCallback((typeValue) => {
    const typeObj = PIECE_TYPES.find(t => t.value === typeValue);
    return typeObj ? typeObj.label : typeValue;
  }, []);

  // ✅ Fonction pour obtenir la couleur du type
  const getTypeColor = useCallback((typeValue) => {
    const typeColors = {
      'facture': 'primary',
      'bon_commande': 'success',
      'bon_livraison': 'info',
      'devis': 'warning',
      'avoir': 'danger',
      'releve_bancaire': 'dark',
      'fiche_paye': 'info',
      'autre': 'secondary'
    };
    return typeColors[typeValue] || 'secondary';
  }, []);

  // ✅ Fonction pour obtenir le label du statut
  const getStatusLabel = useCallback((statusValue) => {
    const statusObj = PIECE_STATUS.find(s => s.value === statusValue);
    return statusObj ? statusObj.label : statusValue;
  }, []);

  // ✅ Fonction pour obtenir la couleur du statut
  const getStatusColor = useCallback((statusValue) => {
    const statusObj = PIECE_STATUS.find(s => s.value === statusValue);
    return statusObj ? statusObj.color : 'secondary';
  }, []);

  // ✅ Fonction pour formater les montants
  const formatMontant = useCallback((montant, devise) => {
    if (montant === null || montant === undefined) return "-";
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant) + ` ${devise || ''}`;
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
      header: "Référence",
      accessorKey: "reference",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-semibold text-primary">{cell.getValue()}</span>
      ),
      size: 120,
    },
    {
      header: "Type",
      accessorKey: "type",
      enableColumnFilter: false,
      cell: (cell) => {
        const typeValue = cell.getValue();
        return (
          <Badge color={getTypeColor(typeValue)} className="rounded-pill">
            {getTypeLabel(typeValue)}
          </Badge>
        );
      },
      size: 100,
    },
    {
      header: "Numéro",
      accessorKey: "numero",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="fw-medium">{cell.getValue()}</span>
      ),
      size: 100,
    },
    {
      header: "Date",
      accessorKey: "date",
      enableColumnFilter: false,
      cell: (cell) => (
        <span className="text-muted">
          {cell.getValue()}
        </span>
      ),
      size: 100,
    },
    {
      header: "Montant",
      accessorKey: "montant",
      enableColumnFilter: false,
      cell: (cell) => {
        const row = cell.row.original;
        return (
          <span className="fw-bold">
            {formatMontant(row.montant, row.devise)}
          </span>
        );
      },
      size: 120,
    },
    {
      header: "Client/Fournisseur",
      accessorKey: "client_fournisseur",
      enableColumnFilter: false,
      cell: (cell) => (
        <div className="fw-medium">
          {cell.getValue()}
        </div>
      ),
    },
    {
      header: "Statut",
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
      size: 100,
    },
    {
      header: "Actions",
      enableColumnFilter: false,
      cell: (cellProps) => {
        const piece = cellProps.row.original;
        return (
          <div className="d-flex gap-2">
            <Link
              to="#"
              className="text-info"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDetailModal(piece);
              }}
              title="Voir détails"
            >
              <i className="ri-eye-fill fs-16"></i>
            </Link>
            <Link
              to="#"
              className="text-primary"
              onClick={(e) => {
                e.preventDefault();
                handleOpenEditModal(piece);
              }}
              title="Éditer"
            >
              <i className="ri-pencil-fill fs-16"></i>
            </Link>
            <Link
              to="#"
              className="text-danger"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDeleteModal(piece);
              }}
              title="Supprimer"
            >
              <i className="ri-delete-bin-5-fill fs-16"></i>
            </Link>
          </div>
        );
      },
      size: 100,
    },
  ], [currentPage, itemsPerPage, handleOpenDetailModal, handleOpenEditModal, handleOpenDeleteModal, getTypeColor, getTypeLabel, getStatusColor, getStatusLabel, formatMontant]);

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
            filename="pieces_comptables"
          />

          {/* Delete Modal */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeletePiece}
            onCloseClick={() => {
              setDeleteModal(false);
              setPieceToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cet contrat ? Cette action est irréversible."
          />

          <BreadCrumb
            title="Contrats"
            pageTitle={
              <>
                <i className="ri-file-text-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher par référence, numéro ou client..."
                showSearch={true}
                onAddClick={handleOpenAddModal}
                addButtonText="Nouveau Contrat"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} pièce{filteredData.length !== 1 ? 's' : ''} trouvée{filteredData.length !== 1 ? 's' : ''}
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              {/* Bouton d'import */}
              {/* <div className="mb-3 d-flex justify-content-end">
                <Button
                  color="info"
                  onClick={handleOpenImportModal}
                  className="rounded-pill"
                >
                  <i className="ri-file-upload-line me-1"></i>
                  Importer des pièces
                </Button>
              </div> */}

              {loading ? (
                <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                  <div className="text-center">
                    <Loader />
                    <p className="mt-3 text-muted">Chargement des contrats...</p>
                  </div>
                </div>
              ) : filteredData.length > 0 ? (
                <TableContainer
                  columns={columns}
                  data={paginatedData}
                  isGlobalFilter={false}
                  customPageSize={itemsPerPage}
                  className="table-striped"
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
              ) : (
                <EmptyDataCard
                  title="Aucun contrat trouvé"
                  description={
                    searchTerm
                      ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
                      : "Commencez par créer ou importer des contrats."
                    }
                  actionButton={
                    <Button
                      color="success"
                      onClick={handleOpenAddModal}
                      className="rounded-pill"
                    >
                      <i className="ri-file-add-line me-1"></i>
                      Nouveau Contrat
                    </Button>
                  }
                  secondaryAction={
                    <Button
                      color="outline-info"
                      onClick={handleOpenImportModal}
                      className="rounded-pill ms-2"
                    >
                      <i className="ri-file-upload-line me-1"></i>
                      Importer
                    </Button>
                  }
                />
              )}
            </Col>
          </Row>
        </Container>

        {/* Modal d'ajout/modification de pièce */}
        <Modal
          isOpen={modal}
          toggle={handleModalClose}
          centered
          className="border-0"
          contentClassName="custom-rounded-modal"
          size="lg"
        >
          <ModalHeader
            toggle={handleModalClose}
            className="bg-light p-3"
            style={{ borderRadius: "20px 20px 0 0" }}
          >
            {isEdit ? "Modifier la pièce" : "Ajouter une nouvelle pièce"}
          </ModalHeader>

          <Form onSubmit={pieceFormik.handleSubmit}>
            <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="type" className="form-label">
                      Type de pièce <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      value={pieceTypeOptions.find(opt => opt.value === pieceFormik.values.type) || null}
                      onChange={(selectedOption) => {
                        pieceFormik.setFieldValue('type', selectedOption ? selectedOption.value : '');
                      }}
                      options={pieceTypeOptions}
                      placeholder="Sélectionnez un type"
                      isClearable={false}
                    />
                    {pieceFormik.touched.type && pieceFormik.errors.type && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.type}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="numero" className="form-label">
                      Numéro de pièce <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="numero"
                      name="numero"
                      type="text"
                      placeholder="Ex: FAC-001/2025"
                      className="rounded-pill"
                      value={pieceFormik.values.numero}
                      onChange={pieceFormik.handleChange}
                      onBlur={pieceFormik.handleBlur}
                      invalid={pieceFormik.touched.numero && Boolean(pieceFormik.errors.numero)}
                    />
                    {pieceFormik.touched.numero && pieceFormik.errors.numero && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.numero}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="date" className="form-label">
                      Date <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      className="rounded-pill"
                      value={pieceFormik.values.date}
                      onChange={pieceFormik.handleChange}
                      onBlur={pieceFormik.handleBlur}
                      invalid={pieceFormik.touched.date && Boolean(pieceFormik.errors.date)}
                    />
                    {pieceFormik.touched.date && pieceFormik.errors.date && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.date}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="montant" className="form-label">
                      Montant ()
                    </Label>
                    <Input
                      id="montant"
                      name="montant"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="rounded-pill"
                      value={pieceFormik.values.montant}
                      onChange={pieceFormik.handleChange}
                      onBlur={pieceFormik.handleBlur}
                      invalid={pieceFormik.touched.montant && Boolean(pieceFormik.errors.montant)}
                    />
                    {pieceFormik.touched.montant && pieceFormik.errors.montant && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.montant}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="client_fournisseur" className="form-label">
                      Client/Fournisseur <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="client_fournisseur"
                      name="client_fournisseur"
                      type="text"
                      placeholder="Nom du client ou fournisseur"
                      className="rounded-pill"
                      value={pieceFormik.values.client_fournisseur}
                      onChange={pieceFormik.handleChange}
                      onBlur={pieceFormik.handleBlur}
                      invalid={pieceFormik.touched.client_fournisseur && Boolean(pieceFormik.errors.client_fournisseur)}
                    />
                    {pieceFormik.touched.client_fournisseur && pieceFormik.errors.client_fournisseur && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.client_fournisseur}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="statut" className="form-label">
                      Statut <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      value={pieceStatusOptions.find(opt => opt.value === pieceFormik.values.statut) || null}
                      onChange={(selectedOption) => {
                        pieceFormik.setFieldValue('statut', selectedOption ? selectedOption.value : '');
                      }}
                      options={pieceStatusOptions}
                      placeholder="Sélectionnez un statut"
                      isClearable={false}
                    />
                    {pieceFormik.touched.statut && pieceFormik.errors.statut && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.statut}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="description" className="form-label">
                  Description <span className="text-danger">*</span>
                </Label>
                <Input
                  id="description"
                  name="description"
                  type="textarea"
                  rows="3"
                  placeholder="Description détaillée de la pièce"
                  className="rounded-4"
                  value={pieceFormik.values.description}
                  onChange={pieceFormik.handleChange}
                  onBlur={pieceFormik.handleBlur}
                  invalid={pieceFormik.touched.description && Boolean(pieceFormik.errors.description)}
                />
                {pieceFormik.touched.description && pieceFormik.errors.description && (
                  <div className="invalid-feedback d-block">{pieceFormik.errors.description}</div>
                )}
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="compte_associe" className="form-label">
                      Compte associé
                    </Label>
                    <Input
                      id="compte_associe"
                      name="compte_associe"
                      type="text"
                      placeholder="Ex: 701, 601"
                      className="rounded-pill"
                      value={pieceFormik.values.compte_associe}
                      onChange={pieceFormik.handleChange}
                      onBlur={pieceFormik.handleBlur}
                      invalid={pieceFormik.touched.compte_associe && Boolean(pieceFormik.errors.compte_associe)}
                    />
                    {pieceFormik.touched.compte_associe && pieceFormik.errors.compte_associe && (
                      <div className="invalid-feedback d-block">{pieceFormik.errors.compte_associe}</div>
                    )}
                    <small className="text-muted">
                      Numéro de compte comptable associé (optionnel)
                    </small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="fichier" className="form-label">
                      Fichier joint
                    </Label>
                    <Input
                      id="fichier"
                      name="fichier"
                      type="file"
                      className="rounded-pill"
                      onChange={(e) => handleFileChange(e, pieceFormik)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <small className="text-muted">
                      Formats supportés : PDF, JPG, PNG (max 5MB)
                    </small>
                  </div>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={handleModalClose}
                disabled={pieceFormik.isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={pieceFormik.isSubmitting || !pieceFormik.isValid}
              >
                {pieceFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    {isEdit ? "Modification..." : "Enregistrement..."}
                  </>
                ) : (
                  <>
                    <i className={isEdit ? "ri-save-line me-1" : "ri-add-line me-1"}></i>
                    {isEdit ? "Enregistrer" : "Ajouter la pièce"}
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal d'import de fichier */}
        <Modal
          isOpen={importModal}
          toggle={handleImportModalClose}
          centered
          className="border-0"
          contentClassName="custom-rounded-modal"
        >
          <ModalHeader
            toggle={handleImportModalClose}
            className="bg-light p-3"
            style={{ borderRadius: "20px 20px 0 0" }}
          >
            <i className="ri-file-upload-line me-2"></i>
            Importer un fichier
          </ModalHeader>

          <Form onSubmit={importFormik.handleSubmit}>
            <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
              <div className="mb-3">
                <Label htmlFor="nom" className="form-label">
                  Nom du fichier <span className="text-danger">*</span>
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Ex: Factures_Janvier_2025"
                  className="rounded-pill"
                  value={importFormik.values.nom}
                  onChange={importFormik.handleChange}
                  onBlur={importFormik.handleBlur}
                  invalid={importFormik.touched.nom && Boolean(importFormik.errors.nom)}
                />
                {importFormik.touched.nom && importFormik.errors.nom && (
                  <div className="invalid-feedback d-block">{importFormik.errors.nom}</div>
                )}
                <small className="text-muted">
                  Donnez un nom descriptif à votre fichier (3-50 caractères)
                </small>
              </div>

              <div className="mb-3">
                <Label htmlFor="fichier" className="form-label">
                  Fichier à importer <span className="text-danger">*</span>
                </Label>
                <div className="border rounded-3 p-3 bg-light">
                  <Input
                    id="fichier"
                    name="fichier"
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileChange(e, importFormik)}
                    onBlur={importFormik.handleBlur}
                    invalid={importFormik.touched.fichier && Boolean(importFormik.errors.fichier)}
                    accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
                  />
                  {importFormik.touched.fichier && importFormik.errors.fichier && (
                    <div className="invalid-feedback d-block">
                      {importFormik.errors.fichier}
                    </div>
                  )}
                  {importFormik.values.fichier && (
                    <div className="mt-3 p-2 border rounded bg-white">
                      <div className="d-flex align-items-center">
                        <i className="ri-file-text-line text-primary fs-4 me-2"></i>
                        <div>
                          <p className="mb-0 fw-semibold">{importFormik.values.fichier.name}</p>
                          <p className="mb-0 text-muted small">
                            {(importFormik.values.fichier.size / 1024).toFixed(2)} KB • 
                            {importFormik.values.fichier.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <small className="text-muted">
                  Formats supportés : PDF, Excel, CSV, JPG, PNG (max 5MB)
                </small>
              </div>

              <div className="alert alert-info border-0">
                <div className="d-flex align-items-center">
                  <i className="ri-information-line me-2"></i>
                  <div>
                    <strong>Conseil :</strong> 
                    <ul className="mb-0 mt-1 small">
                      <li>Nommez votre fichier de manière descriptive</li>
                      <li>Vérifiez le format et la taille du fichier</li>
                      <li>Les fichiers PDF et Excel sont recommandés</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                className="btn btn-light rounded-pill"
                onClick={handleImportModalClose}
                disabled={importFormik.isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn btn-success rounded-pill"
                disabled={importFormik.isSubmitting || !importFormik.isValid}
              >
                {importFormik.isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line me-1 spinner"></i>
                    Importation...
                  </>
                ) : (
                  <>
                    <i className="ri-file-upload-line me-1"></i>
                    Importer le fichier
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
            <i className="ri-information-line me-2"></i>
            Détails de la pièce
          </ModalHeader>

          <ModalBody>
            {selectedPiece && (
              <div>
                <div className="mb-4">
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-2">Référence :</h5>
                      <Badge color="primary" className="fs-5 px-3 py-2">
                        {selectedPiece.reference}
                      </Badge>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">Type :</h5>
                      <Badge 
                        color={getTypeColor(selectedPiece.type)} 
                        className="rounded-pill fs-6 px-3 py-2"
                      >
                        {getTypeLabel(selectedPiece.type)}
                      </Badge>
                    </Col>
                  </Row>
                  
                  <h5 className="mt-3 mb-2">Numéro :</h5>
                  <p className="fs-5 fw-semibold text-primary">{selectedPiece.numero}</p>
                  
                  <div className="row mt-3">
                    <Col md={6}>
                      <h6 className="text-muted mb-1">Date :</h6>
                      <p className="fw-medium">{selectedPiece.date}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-muted mb-1">Statut :</h6>
                      <Badge color={getStatusColor(selectedPiece.statut)} className="rounded-pill">
                        {getStatusLabel(selectedPiece.statut)}
                      </Badge>
                    </Col>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="mb-3 border-bottom pb-2">
                    <i className="ri-file-text-line me-2"></i>
                    Informations complémentaires
                  </h5>
                  
                  <Table bordered striped hover className="mb-4">
                    <thead className="table-light">
                      <tr>
                        <th width="150">Champ</th>
                        <th>Valeur</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-semibold">Client/Fournisseur</td>
                        <td>{selectedPiece.client_fournisseur}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Description</td>
                        <td>{selectedPiece.description}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Montant</td>
                        <td className="fw-bold">
                          {formatMontant(selectedPiece.montant, selectedPiece.devise)}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Compte associé</td>
                        <td>{selectedPiece.compte_associe || "Non spécifié"}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Fichier joint</td>
                        <td>
                          {selectedPiece.fichier ? (
                            <Badge color="info" className="rounded-pill">
                              <i className="ri-file-text-line me-1"></i>
                              {selectedPiece.fichier}
                            </Badge>
                          ) : (
                            "Aucun fichier joint"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Date de création</td>
                        <td>{selectedPiece.date_creation}</td>
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

export default Contrat;