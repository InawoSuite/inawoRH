















// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import TableContainer from "../../../../Components/Common/TableContainer";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import Loader from "../../../../Components/Common/Loader";
// import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
// import DeleteModal from "../../../../Components/Common/DeleteModal";
// import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
// import {
//   Container,
//   Row,
//   Col,
//   Modal,
//   Form,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Label,
//   Input,
//   Button,
//   FormFeedback,
//   Badge,
//   Table,
// } from "reactstrap";
// import BreadCrumb from "../../../../Components/Common/BreadCrumb";
// import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
// import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
// import Pagination from "../../../../Components/Common/Pagination";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import * as Yup from "yup";
// import { useFormik } from "formik";

// // Types de pièces comptables
// const PIECE_TYPES = [
//   { value: 'facture', label: 'Facture' },
//   { value: 'bon_commande', label: 'Bon de commande' },
//   { value: 'bon_livraison', label: 'Bon de livraison' },
//   { value: 'devis', label: 'Devis' },
//   { value: 'avoir', label: 'Avoir' },
//   { value: 'releve_bancaire', label: 'Relevé bancaire' },
//   { value: 'fiche_paye', label: 'Fiche de paie' },
//   { value: 'autre', label: 'Autre document' },
// ];

// // Statuts des pièces
// const PIECE_STATUS = [
//   { value: 'draft', label: 'Brouillon', color: 'secondary' },
//   { value: 'pending', label: 'En attente', color: 'warning' },
//   { value: 'validated', label: 'Validée', color: 'success' },
//   { value: 'rejected', label: 'Rejetée', color: 'danger' },
//   { value: 'archived', label: 'Archivée', color: 'info' },
// ];

// // DONNÉES FICTIVES POUR LES PIÈCES COMPTABLES
// const MOCK_PIECES_DATA = [
//   {
//     id: 1,
//     reference: "FAC-2025-001",
//     type: "facture",
//     numero: "FAC-001/2025",
//     date: "2025-01-15",
//     montant: 1500000,
//     devise: "",
//     client_fournisseur: "Client Alpha SARL",
//     description: "Facture pour vente de marchandises",
//     statut: "validated",
//     fichier: "facture_001.pdf",
//     date_creation: "2025-01-15",
//     compte_associe: "701",
//   },
//   {
//     id: 2,
//     reference: "BC-2025-002",
//     type: "bon_commande",
//     numero: "BC-002/2025",
//     date: "2025-01-14",
//     montant: 850000,
//     devise: "",
//     client_fournisseur: "Fournisseur Beta",
//     description: "Commande de matières premières",
//     statut: "pending",
//     fichier: "bon_commande_002.pdf",
//     date_creation: "2025-01-14",
//     compte_associe: "601",
//   },
//   {
//     id: 3,
//     reference: "BL-2025-003",
//     type: "bon_livraison",
//     numero: "BL-003/2025",
//     date: "2025-01-13",
//     montant: 0,
//     devise: "",
//     client_fournisseur: "Client Gamma",
//     description: "Livraison de produits finis",
//     statut: "validated",
//     fichier: "bon_livraison_003.pdf",
//     date_creation: "2025-01-13",
//     compte_associe: "702",
//   },
//   {
//     id: 4,
//     reference: "DEV-2025-004",
//     type: "devis",
//     numero: "DEV-004/2025",
//     date: "2025-01-12",
//     montant: 2500000,
//     devise: "",
//     client_fournisseur: "Client Delta",
//     description: "Devis pour prestation de services",
//     statut: "draft",
//     fichier: "devis_004.pdf",
//     date_creation: "2025-01-12",
//     compte_associe: "704",
//   },
//   {
//     id: 5,
//     reference: "AV-2025-005",
//     type: "avoir",
//     numero: "AV-005/2025",
//     date: "2025-01-11",
//     montant: 150000,
//     devise: "",
//     client_fournisseur: "Client Alpha SARL",
//     description: "Avoir pour retour marchandises",
//     statut: "validated",
//     fichier: "avoir_005.pdf",
//     date_creation: "2025-01-11",
//     compte_associe: "709",
//   },
//   {
//     id: 6,
//     reference: "RB-2025-006",
//     type: "releve_bancaire",
//     numero: "RB-006/2025",
//     date: "2025-01-10",
//     montant: 0,
//     devise: "",
//     client_fournisseur: "Banque BICEC",
//     description: "Relevé bancaire décembre 2024",
//     statut: "archived",
//     fichier: "releve_bancaire_006.pdf",
//     date_creation: "2025-01-10",
//     compte_associe: "512",
//   },
//   {
//     id: 7,
//     reference: "FP-2025-007",
//     type: "fiche_paye",
//     numero: "FP-007/2025",
//     date: "2025-01-09",
//     montant: 450000,
//     devise: "",
//     client_fournisseur: "Salarié - Jean Dupont",
//     description: "Fiche de paie décembre 2024",
//     statut: "validated",
//     fichier: "fiche_paye_007.pdf",
//     date_creation: "2025-01-09",
//     compte_associe: "641",
//   },
//   {
//     id: 8,
//     reference: "AUT-2025-008",
//     type: "autre",
//     numero: "AUT-008/2025",
//     date: "2025-01-08",
//     montant: 0,
//     devise: "",
//     client_fournisseur: "Administration fiscale",
//     description: "Avis d'imposition",
//     statut: "archived",
//     fichier: "avis_imposition_008.pdf",
//     date_creation: "2025-01-08",
//     compte_associe: "445",
//   },
// ];

// const Contrat = () => {
//   const { t } = useTranslation();
  
//   // États principaux
//   const [piecesData, setPiecesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isExportCSV, setIsExportCSV] = useState(false);
//   const [exportData, setExportData] = useState([]);
  
//   // États des modals
//   const [modal, setModal] = useState(false);
//   const [detailModal, setDetailModal] = useState(false);
//   const [importModal, setImportModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [currentPiece, setCurrentPiece] = useState(null);
//   const [selectedPiece, setSelectedPiece] = useState(null);
  
//   // États pour la suppression
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [pieceToDelete, setPieceToDelete] = useState(null);

//   const itemsPerPage = 10;

//   // ✅ Options pour les types et statuts
//   const pieceTypeOptions = useMemo(() => PIECE_TYPES, []);
//   const pieceStatusOptions = useMemo(() => PIECE_STATUS, []);

//   // ✅ Filtrage optimisé des pièces
//   const filteredData = useMemo(() => {
//     if (!searchTerm.trim()) return piecesData;
    
//     return piecesData.filter((piece) =>
//       Object.values(piece).some((value) =>
//         value !== null &&
//         value !== undefined &&
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [piecesData, searchTerm]);

//   // ✅ Pagination optimisée
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredData, currentPage, itemsPerPage]);

//   // ✅ Fonction pour récupérer les pièces (MOCK)
//   const fetchPieces = useCallback(async () => {
//     setLoading(true);
    
//     setTimeout(() => {
//       try {
//         setPiecesData(MOCK_PIECES_DATA);
        
//         // Préparer les données pour l'export
//         const exportDataFormatted = MOCK_PIECES_DATA.map(piece => ({
//           "Référence": piece.reference || "N/A",
//           "Type": PIECE_TYPES.find(t => t.value === piece.type)?.label || piece.type,
//           "Numéro": piece.numero,
//           "Date": piece.date,
//           "Montant": `${piece.montant?.toLocaleString('fr-FR')} ${piece.devise}`,
//           "Client/Fournisseur": piece.client_fournisseur,
//           "Description": piece.description,
//           "Statut": PIECE_STATUS.find(s => s.value === piece.statut)?.label || piece.statut,
//           "Compte associé": piece.compte_associe || "N/A",
//         }));
//         setExportData(exportDataFormatted);
        
//         toast.success("Données des contrats chargées avec succès !");
//       } catch (err) {
//         console.error("Erreur fetchPieces:", err);
//         toast.error("Erreur lors du chargement des données");
//         setPiecesData([]);
//         setExportData([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 500);
//   }, []);
//    const { entreprise } = useParams();
//    const navigate = useNavigate();

//   // ✅ Chargement initial
//   useEffect(() => {
//     document.title = "Contrats | INAWO - Suite de Gestion";
//     fetchPieces();
//   }, [fetchPieces]);

//   // ✅ Reset de la pagination lors du filtrage
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   // ✅ Validation du formulaire (CRÉATION/MODIFICATION)
//   const pieceValidationSchema = Yup.object({
//     type: Yup.string()
//       .required("Le type de pièce est requis")
//       .oneOf(PIECE_TYPES.map(t => t.value), "Type de pièce invalide"),
//     numero: Yup.string()
//       .required("Le numéro de pièce est requis")
//       .min(2, "Le numéro doit contenir au moins 2 caractères"),
//     date: Yup.date()
//       .required("La date est requise"),
//     montant: Yup.number()
//       .min(0, "Le montant ne peut pas être négatif")
//       .nullable()
//       .transform((value, originalValue) => originalValue === '' ? null : value),
//     client_fournisseur: Yup.string()
//       .required("Le client/fournisseur est requis"),
//     description: Yup.string()
//       .required("La description est requise")
//       .min(5, "La description doit contenir au moins 5 caractères"),
//     statut: Yup.string()
//       .required("Le statut est requis")
//       .oneOf(PIECE_STATUS.map(s => s.value), "Statut invalide"),
//     compte_associe: Yup.string()
//       .matches(/^[0-9]+$/, "Le numéro de compte doit contenir uniquement des chiffres")
//       .nullable(),
//   });

//   // ✅ Formik pour la gestion du formulaire de pièce
//   const pieceFormik = useFormik({
//     initialValues: {
//       type: '',
//       numero: '',
//       date: '',
//       montant: '',
//       devise: '',
//       client_fournisseur: '',
//       description: '',
//       statut: 'draft',
//       compte_associe: '',
//       fichier: null,
//     },
//     validationSchema: pieceValidationSchema,
//     enableReinitialize: true,
//     onSubmit: async (values, { resetForm, setSubmitting }) => {
//       await handleSubmitPiece(values, resetForm, setSubmitting);
//     }
//   });
   
    

//   // ✅ Validation du formulaire d'import
//   const importValidationSchema = Yup.object({
//     nom: Yup.string()
//       .required("Le nom du fichier est requis")
//       .min(3, "Le nom doit contenir au moins 3 caractères")
//       .max(50, "Le nom ne peut pas dépasser 50 caractères"),
//     fichier: Yup.mixed()
//       .required("Le fichier est requis")
//       .test("fileType", "Format de fichier non supporté", (value) => {
//         if (!value) return false;
//         const acceptedTypes = [
//           'application/pdf',
//           'application/vnd.ms-excel',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//           'text/csv',
//           'image/jpeg',
//           'image/png',
//           'image/jpg'
//         ];
//         return acceptedTypes.includes(value.type);
//       })
//       .test("fileSize", "Fichier trop volumineux (max 5MB)", (value) => {
//         if (!value) return false;
//         return value.size <= 5 * 1024 * 1024; // 5MB
//       })
//   });

//   // ✅ Formik pour la gestion du formulaire d'import
//   const importFormik = useFormik({
//     initialValues: {
//       nom: '',
//       fichier: null,
//     },
//     validationSchema: importValidationSchema,
//     onSubmit: async (values, { resetForm, setSubmitting }) => {
//       await handleImportFile(values, resetForm, setSubmitting);
//     }
//   });

//   // ✅ Fonction de soumission de pièce (MOCK)
//   const handleSubmitPiece = async (values, resetForm, setSubmitting) => {
//     setSubmitting(true);
    
//     setTimeout(() => {
//       try {
//         if (isEdit && currentPiece) {
//           // ÉDITION
//           const updatedData = piecesData.map(piece =>
//             piece.id === currentPiece.id 
//               ? { 
//                   ...piece, 
//                   ...values,
//                   montant: parseFloat(values.montant) || 0,
//                   reference: `${values.type.toUpperCase().substring(0, 3)}-${new Date().getFullYear()}-${String(piece.id).padStart(3, '0')}`
//                 }
//               : piece
//           );
//           setPiecesData(updatedData);
//           toast.success("Pièce modifiée avec succès!");
//         } else {
//           // CRÉATION
//           const newPiece = {
//             id: piecesData.length + 1,
//             reference: `${values.type.toUpperCase().substring(0, 3)}-${new Date().getFullYear()}-${String(piecesData.length + 1).padStart(3, '0')}`,
//             ...values,
//             montant: parseFloat(values.montant) || 0,
//             date_creation: new Date().toISOString().split('T')[0],
//             fichier: values.fichier ? values.fichier.name : null,
//           };
//           setPiecesData(prev => [newPiece, ...prev]);
//           toast.success("Pièce ajoutée avec succès!");
//         }
        
//         resetForm();
//         handleModalClose();
        
//       } catch (err) {
//         console.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} de la pièce:`, err);
//         toast.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} de la pièce`);
//       } finally {
//         setSubmitting(false);
//       }
//     }, 800);
//   };

//   // ✅ Fonction d'import de fichier
//   const handleImportFile = async (values, resetForm, setSubmitting) => {
//     setSubmitting(true);
    
//     setTimeout(() => {
//       try {
//         // Simulation de l'import
//         const newPieces = [
//           {
//             id: piecesData.length + 1,
//             reference: `IMP-${new Date().getFullYear()}-${String(piecesData.length + 1).padStart(3, '0')}`,
//             type: "facture",
//             numero: `IMP-${String(piecesData.length + 1).padStart(3, '0')}/2025`,
//             date: new Date().toISOString().split('T')[0],
//             montant: 1250000,
//             devise: "",
//             client_fournisseur: "Client Import",
//             description: `Document importé: ${values.nom}`,
//             statut: "validated",
//             fichier: values.fichier.name,
//             date_creation: new Date().toISOString().split('T')[0],
//             compte_associe: "701",
//           }
//         ];

//         setPiecesData(prev => [...newPieces, ...prev]);
//         toast.success(`Fichier "${values.nom}" importé avec succès !`);
//         resetForm();
//         handleImportModalClose();
        
//       } catch (err) {
//         console.error("Erreur lors de l'import:", err);
//         toast.error("Erreur lors de l'import du fichier");
//       } finally {
//         setSubmitting(false);
//       }
//     }, 1500);
//   };

//   // ✅ Fonction de suppression (MOCK)
//   const handleDeletePiece = async () => {
//     if (!pieceToDelete?.id) return;

//     setTimeout(() => {
//       try {
//         const updatedData = piecesData.filter(piece => piece.id !== pieceToDelete.id);
//         setPiecesData(updatedData);
//         toast.success("Pièce supprimée avec succès!");
//         setDeleteModal(false);
//         setPieceToDelete(null);
        
//       } catch (err) {
//         console.error("Erreur lors de la suppression:", err);
//         toast.error("Erreur lors de la suppression de la pièce");
//       }
//     }, 600);
//   };

//   // ✅ Handlers optimisés
//   const handleModalClose = useCallback(() => {
//     setModal(false);
//     setIsEdit(false);
//     setCurrentPiece(null);
//     pieceFormik.resetForm();
//   }, [pieceFormik]);

//   const handleDetailModalClose = useCallback(() => {
//     setDetailModal(false);
//     setSelectedPiece(null);
//   }, []);

//   const handleImportModalClose = useCallback(() => {
//     setImportModal(false);
//     importFormik.resetForm();
//   }, [importFormik]);

//   const handleOpenDetailModal = useCallback((piece) => {
//     setSelectedPiece(piece);
//     setDetailModal(true);
//   }, []);

//   const handleOpenEditModal = useCallback((piece) => {
//     if (!piece?.id) {
//       toast.error("Données de pièce invalides");
//       return;
//     }

//     setCurrentPiece(piece);
//     setIsEdit(true);
//     pieceFormik.setValues({
//       type: piece.type || '',
//       numero: piece.numero || '',
//       date: piece.date || '',
//       montant: piece.montant || '',
//       devise: piece.devise || '',
//       client_fournisseur: piece.client_fournisseur || '',
//       description: piece.description || '',
//       statut: piece.statut || 'draft',
//       compte_associe: piece.compte_associe || '',
//       fichier: null,
//     });
//     setModal(true);
//   }, [pieceFormik]);

//   const handleOpenAddModal = useCallback(() => {
//     navigate(`/${entreprise}/contrat-add`);
//   }, [navigate, entreprise]);

//   const handleOpenDeleteModal = useCallback((piece) => {
//     setPieceToDelete(piece);
//     setDeleteModal(true);
//   }, []);

//   const handleOpenImportModal = useCallback(() => {
//     setImportModal(true);
//   }, []);

//   const handleFileChange = useCallback((event, formik) => {
//     const file = event.currentTarget.files[0];
//     if (file) {
//       formik.setFieldValue("fichier", file);
//       // Auto-remplir le nom si vide
//       if (!formik.values.nom.trim() && formik === importFormik) {
//         const fileName = file.name.replace(/\.[^/.]+$/, ""); // Enlever l'extension
//         formik.setFieldValue("nom", fileName);
//       }
//     }
//   }, [importFormik]);

//   // ✅ Fonction pour obtenir le label du type
//   const getTypeLabel = useCallback((typeValue) => {
//     const typeObj = PIECE_TYPES.find(t => t.value === typeValue);
//     return typeObj ? typeObj.label : typeValue;
//   }, []);

//   // ✅ Fonction pour obtenir la couleur du type
//   const getTypeColor = useCallback((typeValue) => {
//     const typeColors = {
//       'facture': 'primary',
//       'bon_commande': 'success',
//       'bon_livraison': 'info',
//       'devis': 'warning',
//       'avoir': 'danger',
//       'releve_bancaire': 'dark',
//       'fiche_paye': 'info',
//       'autre': 'secondary'
//     };
//     return typeColors[typeValue] || 'secondary';
//   }, []);

//   // ✅ Fonction pour obtenir le label du statut
//   const getStatusLabel = useCallback((statusValue) => {
//     const statusObj = PIECE_STATUS.find(s => s.value === statusValue);
//     return statusObj ? statusObj.label : statusValue;
//   }, []);

//   // ✅ Fonction pour obtenir la couleur du statut
//   const getStatusColor = useCallback((statusValue) => {
//     const statusObj = PIECE_STATUS.find(s => s.value === statusValue);
//     return statusObj ? statusObj.color : 'secondary';
//   }, []);

//   // ✅ Fonction pour formater les montants
//   const formatMontant = useCallback((montant, devise) => {
//     if (montant === null || montant === undefined) return "-";
//     return new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(montant) + ` ${devise || ''}`;
//   }, []);

//   // ✅ Colonnes du tableau
//   const columns = useMemo(() => [
//     {
//       header: "N°",
//       accessorKey: "id",
//       enableColumnFilter: false,
//       cell: (cell) => {
//         const globalIndex = (currentPage - 1) * itemsPerPage + cell.row.index + 1;
//         return <span className="fw-medium">{globalIndex}</span>;
//       },
//       size: 60,
//     },
//     {
//       header: "Référence",
//       accessorKey: "reference",
//       enableColumnFilter: false,
//       cell: (cell) => (
//         <span className="fw-semibold text-primary">{cell.getValue()}</span>
//       ),
//       size: 120,
//     },
//     {
//       header: "Type",
//       accessorKey: "type",
//       enableColumnFilter: false,
//       cell: (cell) => {
//         const typeValue = cell.getValue();
//         return (
//           <Badge color={getTypeColor(typeValue)} className="rounded-pill">
//             {getTypeLabel(typeValue)}
//           </Badge>
//         );
//       },
//       size: 100,
//     },
//     {
//       header: "Numéro",
//       accessorKey: "numero",
//       enableColumnFilter: false,
//       cell: (cell) => (
//         <span className="fw-medium">{cell.getValue()}</span>
//       ),
//       size: 100,
//     },
//     {
//       header: "Date",
//       accessorKey: "date",
//       enableColumnFilter: false,
//       cell: (cell) => (
//         <span className="text-muted">
//           {cell.getValue()}
//         </span>
//       ),
//       size: 100,
//     },
//     {
//       header: "Montant",
//       accessorKey: "montant",
//       enableColumnFilter: false,
//       cell: (cell) => {
//         const row = cell.row.original;
//         return (
//           <span className="fw-bold">
//             {formatMontant(row.montant, row.devise)}
//           </span>
//         );
//       },
//       size: 120,
//     },
//     {
//       header: "Client/Fournisseur",
//       accessorKey: "client_fournisseur",
//       enableColumnFilter: false,
//       cell: (cell) => (
//         <div className="fw-medium">
//           {cell.getValue()}
//         </div>
//       ),
//     },
//     {
//       header: "Statut",
//       accessorKey: "statut",
//       enableColumnFilter: false,
//       cell: (cell) => {
//         const statusValue = cell.getValue();
//         return (
//           <Badge color={getStatusColor(statusValue)} className="rounded-pill">
//             {getStatusLabel(statusValue)}
//           </Badge>
//         );
//       },
//       size: 100,
//     },
//     {
//       header: "Actions",
//       enableColumnFilter: false,
//       cell: (cellProps) => {
//         const piece = cellProps.row.original;
//         return (
//           <div className="d-flex gap-2">
//             <Link
                                                                   
//             to={`/${entreprise}/contrat-details/${piece.id}`}
//                 state={{ contrat: piece }}
//                 className="text-info "
//                 title="Details"
//             >
//               <i className="ri-eye-fill fs-16"></i>
//             </Link>
//             <Link
//               to={`/${entreprise}/contrat-edit/${piece.id}`}
//               className="text-primary"
              
//               title="Éditer"
//             >
//               <i className="ri-pencil-fill fs-16"></i>
//             </Link>
//             <Link
//               to="#"
//               className="text-danger"
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleOpenDeleteModal(piece);
//               }}
//               title="Supprimer"
//             >
//               <i className="ri-delete-bin-5-fill fs-16"></i>
//             </Link>
//           </div>
//         );
//       },
//       size: 100,
//     },
//   ], [currentPage, itemsPerPage, handleOpenDetailModal, handleOpenEditModal, handleOpenDeleteModal, getTypeColor, getTypeLabel, getStatusColor, getStatusLabel, formatMontant]);

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           {/* Toast Container */}
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />

//           {/* Export CSV Modal */}
//           <ExportCSVModal
//             show={isExportCSV}
//             onCloseClick={() => setIsExportCSV(false)}
//             data={exportData}
//             filename="pieces_comptables"
//           />

//           {/* Delete Modal */}
//           <DeleteModal
//             show={deleteModal}
//             onDeleteClick={handleDeletePiece}
//             onCloseClick={() => {
//               setDeleteModal(false);
//               setPieceToDelete(null);
//             }}
//             deleteMessage="Êtes-vous sûr de vouloir supprimer cet contrat ? Cette action est irréversible."
//           />

//           <BreadCrumb
//             title="Contrats"
//             pageTitle={
//               <>
//                 <i className="ri-file-text-line me-1 align-bottom"></i>
//                 &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
//               </>
//             }
//           />

//           <Row>
//             <Col lg={12}>
//               <SearchAndActionBar
//                 searchTerm={searchTerm}
//                 onSearchChange={setSearchTerm}
//                 searchPlaceholder="Rechercher par référence, numéro ou client..."
//                 showSearch={true}
//                 onAddClick={handleOpenAddModal}
//                 addButtonText="Nouveau Contrat"
//                 addButtonIcon="ri-file-add-line"
//                 showAddButton={true}
//                 onExportClick={() => setIsExportCSV(true)}
//                 exportButtonText="Exporter"
//                 exportButtonIcon="ri-file-download-line"
//                 showExportButton={true}
//                 additionalInfo={
//                   <div className="d-flex align-items-center text-muted">
//                     <i className="ri-information-line me-1"></i>
//                     {filteredData.length} pièce{filteredData.length !== 1 ? 's' : ''} trouvée{filteredData.length !== 1 ? 's' : ''}
//                   </div>
//                 }
//               />
//             </Col>
//           </Row>

//           <Row>
//             <Col lg={12}>
//               {/* Bouton d'import */}
//               {/* <div className="mb-3 d-flex justify-content-end">
//                 <Button
//                   color="info"
//                   onClick={handleOpenImportModal}
//                   className="rounded-pill"
//                 >
//                   <i className="ri-file-upload-line me-1"></i>
//                   Importer des pièces
//                 </Button>
//               </div> */}

//               {loading ? (
//                 <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
//                   <div className="text-center">
//                     <Loader />
//                     <p className="mt-3 text-muted">Chargement des contrats...</p>
//                   </div>
//                 </div>
//               ) : filteredData.length > 0 ? (
//                 <TableContainer
//                   columns={columns}
//                   data={paginatedData}
//                   isGlobalFilter={false}
//                   customPageSize={itemsPerPage}
//                   className="table-striped"
//                 >
//                   <Pagination
//                     data={filteredData}
//                     currentPage={currentPage}
//                     setCurrentPage={setCurrentPage}
//                     itemsPerPage={itemsPerPage}
//                     alwaysShow={true}
//                     showInfo={true}
//                   />
//                 </TableContainer>
//               ) : (
//                 <EmptyDataCard
//                   title="Aucun contrat trouvé"
//                   description={
//                     searchTerm
//                       ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
//                       : "Commencez par créer ou importer des contrats."
//                     }
//                   actionButton={
//                     <Button
//                       color="success"
//                       onClick={() => window.location.href = `/${entreprise}/contrat-add`}
                     
                    
//                       className="rounded-pill"
//                     >
//                       <i className="ri-file-add-line me-1"></i>
//                       Nouveau Contrat
//                     </Button>
//                   }
//                   secondaryAction={
//                     <Button
//                       color="outline-info"
//                       onClick={handleOpenImportModal}
//                       className="rounded-pill ms-2"
//                     >
//                       <i className="ri-file-upload-line me-1"></i>
//                       Importer
//                     </Button>
//                   }
//                 />
//               )}
//             </Col>
//           </Row>
//         </Container>

//         {/* Modal d'ajout/modification de pièce */}
//         <Modal
//           isOpen={modal}
//           toggle={handleModalClose}
//           centered
//           className="border-0"
//           contentClassName="custom-rounded-modal"
//           size="lg"
//         >
//           <ModalHeader
//             toggle={handleModalClose}
//             className="bg-light p-3"
//             style={{ borderRadius: "20px 20px 0 0" }}
//           >
//             {isEdit ? "Modifier la pièce" : "Ajouter une nouvelle pièce"}
//           </ModalHeader>

//           <Form onSubmit={pieceFormik.handleSubmit}>
//             <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
//               <Row>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="type" className="form-label">
//                       Type de pièce <span className="text-danger">*</span>
//                     </Label>
//                     <CustomSelect
//                       value={pieceTypeOptions.find(opt => opt.value === pieceFormik.values.type) || null}
//                       onChange={(selectedOption) => {
//                         pieceFormik.setFieldValue('type', selectedOption ? selectedOption.value : '');
//                       }}
//                       options={pieceTypeOptions}
//                       placeholder="Sélectionnez un type"
//                       isClearable={false}
//                     />
//                     {pieceFormik.touched.type && pieceFormik.errors.type && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.type}</div>
//                     )}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="numero" className="form-label">
//                       Numéro de pièce <span className="text-danger">*</span>
//                     </Label>
//                     <Input
//                       id="numero"
//                       name="numero"
//                       type="text"
//                       placeholder="Ex: FAC-001/2025"
//                       className="rounded-pill"
//                       value={pieceFormik.values.numero}
//                       onChange={pieceFormik.handleChange}
//                       onBlur={pieceFormik.handleBlur}
//                       invalid={pieceFormik.touched.numero && Boolean(pieceFormik.errors.numero)}
//                     />
//                     {pieceFormik.touched.numero && pieceFormik.errors.numero && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.numero}</div>
//                     )}
//                   </div>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="date" className="form-label">
//                       Date <span className="text-danger">*</span>
//                     </Label>
//                     <Input
//                       id="date"
//                       name="date"
//                       type="date"
//                       className="rounded-pill"
//                       value={pieceFormik.values.date}
//                       onChange={pieceFormik.handleChange}
//                       onBlur={pieceFormik.handleBlur}
//                       invalid={pieceFormik.touched.date && Boolean(pieceFormik.errors.date)}
//                     />
//                     {pieceFormik.touched.date && pieceFormik.errors.date && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.date}</div>
//                     )}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="montant" className="form-label">
//                       Montant ()
//                     </Label>
//                     <Input
//                       id="montant"
//                       name="montant"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       placeholder="0"
//                       className="rounded-pill"
//                       value={pieceFormik.values.montant}
//                       onChange={pieceFormik.handleChange}
//                       onBlur={pieceFormik.handleBlur}
//                       invalid={pieceFormik.touched.montant && Boolean(pieceFormik.errors.montant)}
//                     />
//                     {pieceFormik.touched.montant && pieceFormik.errors.montant && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.montant}</div>
//                     )}
//                   </div>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="client_fournisseur" className="form-label">
//                       Client/Fournisseur <span className="text-danger">*</span>
//                     </Label>
//                     <Input
//                       id="client_fournisseur"
//                       name="client_fournisseur"
//                       type="text"
//                       placeholder="Nom du client ou fournisseur"
//                       className="rounded-pill"
//                       value={pieceFormik.values.client_fournisseur}
//                       onChange={pieceFormik.handleChange}
//                       onBlur={pieceFormik.handleBlur}
//                       invalid={pieceFormik.touched.client_fournisseur && Boolean(pieceFormik.errors.client_fournisseur)}
//                     />
//                     {pieceFormik.touched.client_fournisseur && pieceFormik.errors.client_fournisseur && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.client_fournisseur}</div>
//                     )}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="statut" className="form-label">
//                       Statut <span className="text-danger">*</span>
//                     </Label>
//                     <CustomSelect
//                       value={pieceStatusOptions.find(opt => opt.value === pieceFormik.values.statut) || null}
//                       onChange={(selectedOption) => {
//                         pieceFormik.setFieldValue('statut', selectedOption ? selectedOption.value : '');
//                       }}
//                       options={pieceStatusOptions}
//                       placeholder="Sélectionnez un statut"
//                       isClearable={false}
//                     />
//                     {pieceFormik.touched.statut && pieceFormik.errors.statut && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.statut}</div>
//                     )}
//                   </div>
//                 </Col>
//               </Row>

//               <div className="mb-3">
//                 <Label htmlFor="description" className="form-label">
//                   Description <span className="text-danger">*</span>
//                 </Label>
//                 <Input
//                   id="description"
//                   name="description"
//                   type="textarea"
//                   rows="3"
//                   placeholder="Description détaillée de la pièce"
//                   className="rounded-4"
//                   value={pieceFormik.values.description}
//                   onChange={pieceFormik.handleChange}
//                   onBlur={pieceFormik.handleBlur}
//                   invalid={pieceFormik.touched.description && Boolean(pieceFormik.errors.description)}
//                 />
//                 {pieceFormik.touched.description && pieceFormik.errors.description && (
//                   <div className="invalid-feedback d-block">{pieceFormik.errors.description}</div>
//                 )}
//               </div>

//               <Row>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="compte_associe" className="form-label">
//                       Compte associé
//                     </Label>
//                     <Input
//                       id="compte_associe"
//                       name="compte_associe"
//                       type="text"
//                       placeholder="Ex: 701, 601"
//                       className="rounded-pill"
//                       value={pieceFormik.values.compte_associe}
//                       onChange={pieceFormik.handleChange}
//                       onBlur={pieceFormik.handleBlur}
//                       invalid={pieceFormik.touched.compte_associe && Boolean(pieceFormik.errors.compte_associe)}
//                     />
//                     {pieceFormik.touched.compte_associe && pieceFormik.errors.compte_associe && (
//                       <div className="invalid-feedback d-block">{pieceFormik.errors.compte_associe}</div>
//                     )}
//                     <small className="text-muted">
//                       Numéro de compte comptable associé (optionnel)
//                     </small>
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <div className="mb-3">
//                     <Label htmlFor="fichier" className="form-label">
//                       Fichier joint
//                     </Label>
//                     <Input
//                       id="fichier"
//                       name="fichier"
//                       type="file"
//                       className="rounded-pill"
//                       onChange={(e) => handleFileChange(e, pieceFormik)}
//                       accept=".pdf,.jpg,.jpeg,.png"
//                     />
//                     <small className="text-muted">
//                       Formats supportés : PDF, JPG, PNG (max 5MB)
//                     </small>
//                   </div>
//                 </Col>
//               </Row>
//             </ModalBody>

//             <ModalFooter>
//               <Button
//                 type="button"
//                 className="btn btn-light rounded-pill"
//                 onClick={handleModalClose}
//                 disabled={pieceFormik.isSubmitting}
//               >
//                 Annuler
//               </Button>
//               <Button
//                 type="submit"
//                 className="btn btn-success rounded-pill"
//                 disabled={pieceFormik.isSubmitting || !pieceFormik.isValid}
//               >
//                 {pieceFormik.isSubmitting ? (
//                   <>
//                     <i className="ri-loader-4-line me-1 spinner"></i>
//                     {isEdit ? "Modification..." : "Enregistrement..."}
//                   </>
//                 ) : (
//                   <>
//                     <i className={isEdit ? "ri-save-line me-1" : "ri-add-line me-1"}></i>
//                     {isEdit ? "Enregistrer" : "Ajouter la pièce"}
//                   </>
//                 )}
//               </Button>
//             </ModalFooter>
//           </Form>
//         </Modal>

//         {/* Modal d'import de fichier */}
//         <Modal
//           isOpen={importModal}
//           toggle={handleImportModalClose}
//           centered
//           className="border-0"
//           contentClassName="custom-rounded-modal"
//         >
//           <ModalHeader
//             toggle={handleImportModalClose}
//             className="bg-light p-3"
//             style={{ borderRadius: "20px 20px 0 0" }}
//           >
//             <i className="ri-file-upload-line me-2"></i>
//             Importer un fichier
//           </ModalHeader>

//           <Form onSubmit={importFormik.handleSubmit}>
//             <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
//               <div className="mb-3">
//                 <Label htmlFor="nom" className="form-label">
//                   Nom du fichier <span className="text-danger">*</span>
//                 </Label>
//                 <Input
//                   id="nom"
//                   name="nom"
//                   type="text"
//                   placeholder="Ex: Factures_Janvier_2025"
//                   className="rounded-pill"
//                   value={importFormik.values.nom}
//                   onChange={importFormik.handleChange}
//                   onBlur={importFormik.handleBlur}
//                   invalid={importFormik.touched.nom && Boolean(importFormik.errors.nom)}
//                 />
//                 {importFormik.touched.nom && importFormik.errors.nom && (
//                   <div className="invalid-feedback d-block">{importFormik.errors.nom}</div>
//                 )}
//                 <small className="text-muted">
//                   Donnez un nom descriptif à votre fichier (3-50 caractères)
//                 </small>
//               </div>

//               <div className="mb-3">
//                 <Label htmlFor="fichier" className="form-label">
//                   Fichier à importer <span className="text-danger">*</span>
//                 </Label>
//                 <div className="border rounded-3 p-3 bg-light">
//                   <Input
//                     id="fichier"
//                     name="fichier"
//                     type="file"
//                     className="form-control"
//                     onChange={(e) => handleFileChange(e, importFormik)}
//                     onBlur={importFormik.handleBlur}
//                     invalid={importFormik.touched.fichier && Boolean(importFormik.errors.fichier)}
//                     accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
//                   />
//                   {importFormik.touched.fichier && importFormik.errors.fichier && (
//                     <div className="invalid-feedback d-block">
//                       {importFormik.errors.fichier}
//                     </div>
//                   )}
//                   {importFormik.values.fichier && (
//                     <div className="mt-3 p-2 border rounded bg-white">
//                       <div className="d-flex align-items-center">
//                         <i className="ri-file-text-line text-primary fs-4 me-2"></i>
//                         <div>
//                           <p className="mb-0 fw-semibold">{importFormik.values.fichier.name}</p>
//                           <p className="mb-0 text-muted small">
//                             {(importFormik.values.fichier.size / 1024).toFixed(2)} KB • 
//                             {importFormik.values.fichier.type}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <small className="text-muted">
//                   Formats supportés : PDF, Excel, CSV, JPG, PNG (max 5MB)
//                 </small>
//               </div>

//               <div className="alert alert-info border-0">
//                 <div className="d-flex align-items-center">
//                   <i className="ri-information-line me-2"></i>
//                   <div>
//                     <strong>Conseil :</strong> 
//                     <ul className="mb-0 mt-1 small">
//                       <li>Nommez votre fichier de manière descriptive</li>
//                       <li>Vérifiez le format et la taille du fichier</li>
//                       <li>Les fichiers PDF et Excel sont recommandés</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </ModalBody>

//             <ModalFooter>
//               <Button
//                 type="button"
//                 className="btn btn-light rounded-pill"
//                 onClick={handleImportModalClose}
//                 disabled={importFormik.isSubmitting}
//               >
//                 Annuler
//               </Button>
//               <Button
//                 type="submit"
//                 className="btn btn-success rounded-pill"
//                 disabled={importFormik.isSubmitting || !importFormik.isValid}
//               >
//                 {importFormik.isSubmitting ? (
//                   <>
//                     <i className="ri-loader-4-line me-1 spinner"></i>
//                     Importation...
//                   </>
//                 ) : (
//                   <>
//                     <i className="ri-file-upload-line me-1"></i>
//                     Importer le fichier
//                   </>
//                 )}
//               </Button>
//             </ModalFooter>
//           </Form>
//         </Modal>

//         {/* Modal de détails */}
//         <Modal
//           isOpen={detailModal}
//           toggle={handleDetailModalClose}
//           centered
//           className="border-0"
//           contentClassName="rounded-4"
//           size="lg"
//         >
//           <ModalHeader
//             toggle={handleDetailModalClose}
//             className="bg-light p-3 rounded-top-4"
//           >
//             <i className="ri-information-line me-2"></i>
//             Détails de la pièce
//           </ModalHeader>

//           <ModalBody>
//             {selectedPiece && (
//               <div>
//                 <div className="mb-4">
//                   <Row>
//                     <Col md={6}>
//                       <h5 className="mb-2">Référence :</h5>
//                       <Badge color="primary" className="fs-5 px-3 py-2">
//                         {selectedPiece.reference}
//                       </Badge>
//                     </Col>
//                     <Col md={6}>
//                       <h5 className="mb-2">Type :</h5>
//                       <Badge 
//                         color={getTypeColor(selectedPiece.type)} 
//                         className="rounded-pill fs-6 px-3 py-2"
//                       >
//                         {getTypeLabel(selectedPiece.type)}
//                       </Badge>
//                     </Col>
//                   </Row>
                  
//                   <h5 className="mt-3 mb-2">Numéro :</h5>
//                   <p className="fs-5 fw-semibold text-primary">{selectedPiece.numero}</p>
                  
//                   <div className="row mt-3">
//                     <Col md={6}>
//                       <h6 className="text-muted mb-1">Date :</h6>
//                       <p className="fw-medium">{selectedPiece.date}</p>
//                     </Col>
//                     <Col md={6}>
//                       <h6 className="text-muted mb-1">Statut :</h6>
//                       <Badge color={getStatusColor(selectedPiece.statut)} className="rounded-pill">
//                         {getStatusLabel(selectedPiece.statut)}
//                       </Badge>
//                     </Col>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <h5 className="mb-3 border-bottom pb-2">
//                     <i className="ri-file-text-line me-2"></i>
//                     Informations complémentaires
//                   </h5>
                  
//                   <Table bordered striped hover className="mb-4">
//                     <thead className="table-light">
//                       <tr>
//                         <th width="150">Champ</th>
//                         <th>Valeur</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td className="fw-semibold">Client/Fournisseur</td>
//                         <td>{selectedPiece.client_fournisseur}</td>
//                       </tr>
//                       <tr>
//                         <td className="fw-semibold">Description</td>
//                         <td>{selectedPiece.description}</td>
//                       </tr>
//                       <tr>
//                         <td className="fw-semibold">Montant</td>
//                         <td className="fw-bold">
//                           {formatMontant(selectedPiece.montant, selectedPiece.devise)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="fw-semibold">Compte associé</td>
//                         <td>{selectedPiece.compte_associe || "Non spécifié"}</td>
//                       </tr>
//                       <tr>
//                         <td className="fw-semibold">Fichier joint</td>
//                         <td>
//                           {selectedPiece.fichier ? (
//                             <Badge color="info" className="rounded-pill">
//                               <i className="ri-file-text-line me-1"></i>
//                               {selectedPiece.fichier}
//                             </Badge>
//                           ) : (
//                             "Aucun fichier joint"
//                           )}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="fw-semibold">Date de création</td>
//                         <td>{selectedPiece.date_creation}</td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </div>
//               </div>
//             )}
//           </ModalBody>

//           <ModalFooter className="rounded-bottom-4">
//             <Button
//               className="btn btn-light rounded-pill"
//               onClick={handleDetailModalClose}
//             >
//               Fermer
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Contrat;











import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { ToastContainer } from 'react-toastify';
import TableContainer from "../../../../Components/Common/TableContainer";

import SimpleDonutCharts from '../../../FileManager/FileManagerCharts';
import DeleteModal from "../../../../Components/Common/DeleteModal";
//redux
import { useSelector, useDispatch } from 'react-redux';

//import action
import {
    getFolders as onGetFolders,
    updateFolder as onupdateFolder,
    deleteFolder as onDeleteFolder,
    addNewFolder as onAddNewFolder,
    getFiles as onGetFiles,
    updateFile as onupdateFile,
    deleteFile as onDeleteFile,
    addNewFile as onAddNewFile
} from "../../../../slices/thunks";

// Formik
import * as  Yup from "yup";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';



const Contrat = () => {
    document.title = "Contrat  ";

    const dispatch = useDispatch();

    const selectLayoutState = (state) => state.FileManager;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (state) => ({
            folders: state.folders,
            files: state.files,
        })
    );
    // Inside your component
    const {
        folders, files
    } = useSelector(selectLayoutProperties);


    const [deleteModal, setDeleteModal] = useState(false);

    const [deleteAlt, setDeleteAlt] = useState(false);

    // Folders
    const [folder, setFolder] = useState(null);
    const [modalFolder, setModalFolder] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        dispatch(onGetFolders());
    }, [dispatch]);

    useEffect(() => {
        setFolder(folders);
    }, [folders]);

    const folderToggle = useCallback(() => {
        if (modalFolder) {
            setModalFolder(false);
            setFolder(null);
        } else {
            setModalFolder(true);
        }
    }, [modalFolder]);

    // Update Folder
    const handleFolderClick = useCallback((arg) => {
        const folder = arg;

        setFolder({
            id: folder.id,
            folderName: folder.folderName,
            folderFile: folder.folderFile,
            size: folder.size,
        });

        setIsEdit(true);
        folderToggle();
    }, [folderToggle]);

    // Add Folder
    const handleFolderClicks = () => {
        setFolder("");
        setModalFolder(!modalFolder);
        setIsEdit(false);
        folderToggle();
    };

    // Delete Folder
    const onClickFolderDelete = (folder) => {
        setFolder(folder);
        setDeleteModal(true);
    };

    const handleDeleteFolder = () => {

        if (deleteAlt) {
            if (folder) {
                dispatch(onDeleteFolder(folder.id));
                setDeleteModal(false);
                setDeleteAlt(false);
            }
        } else {
            if (file) {
                dispatch(onDeleteFile(file.id));
                setDeleteModal(false);
                sidebarClose("file-detail-show");
            }
        }

    };

    // Files
    const [file, setFile] = useState(null);
    const [modalFile, setModalFile] = useState(false);


    const [fileList, setFileList] = useState(files);

    useEffect(() => {
        dispatch(onGetFiles());
    }, [dispatch]);

    useEffect(() => {
        setFile(files);
        setFileList(files);
    }, [files]);

    const fileToggle = useCallback(() => {
        if (modalFile) {
            setModalFile(false);
            setFile(null);
        } else {
            setModalFile(true);
        }
    }, [modalFile]);

    // Update File
    const handleFileClick = useCallback((arg) => {
        const file = arg;

        setFile({
            id: file.id,
            fileName: file.fileName,
            fileItem: file.fileItem,
            size: file.size,
        });

        setIsEdit(true);
        fileToggle();
    }, [fileToggle]);

    // Add File
    const handleFileClicks = () => {
        setFile("");
        setModalFile(!modalFile);
        setIsEdit(false);
        fileToggle();
    };

    // Delete File
    const onClickFileDelete = (file) => {
        setFile(file);
        setDeleteModal(true);
    };


    const [sidebarData, setSidebarData] = useState("");

    const [filterActive, setFilterActive] = useState("");

    const fileCategory = (e, ele) => {
        setFilterActive(ele);
        document.getElementById("folder-list").style.display = "none";
        setFileList(
            files.filter((item) => item.fileType === e)
        );
    };


    // SideBar Open
    function sidebarOpen(value) {
        const element = document.getElementsByTagName('body')[0];
        element.classList.add(value);
    }

    // SideBar Close
    function sidebarClose(value) {
        const element = document.getElementsByTagName('body')[0];
        element.classList.remove(value);
    }

    useEffect(() => {
        sidebarOpen("file-detail-show");
    }, []);

    const favouriteBtn = (ele) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    const fileSidebar = () => {
        document.getElementById("folder-overview").style.display = "none";
        document.getElementById("file-overview").style.display = "block";
    };

    // Folder validation
    const folderValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            folderName: (folder && folder.folderName) || '',
            folderFile: (folder && folder.folderFile) || '',
            size: (folder && folder.size) || '',
        },
        validationSchema: Yup.object({
            folderName: Yup.string().required("Veuillez saisir le nom du dossier"),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateFolder = {
                    id: folder ? folder.id : 0,
                    folderName: values.folderName,
                    folderFile: values.folderFile,
                    size: values.size
                };
                // save edit Folder
                dispatch(onupdateFolder(updateFolder));
                folderValidation.resetForm();

            } else {
                const newFolder = {
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    folderName: values["folderName"],
                    folderFile: "0",
                    size: "0"
                };
                // save new Folder
                dispatch(onAddNewFolder(newFolder));
                folderValidation.resetForm();
            }
            folderToggle();
        },
    });


    const dateFormat = () => {
        let d = new Date(),
            months = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
    };


    // File validation
    const fileValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            fileName: (file && file.fileName) || '',
            fileItem: (file && file.fileItem) || '',
            size: (file && file.size) || '',
        },
        validationSchema: Yup.object({
            fileName: Yup.string().required("Veuillez saisir le nom du fichier"),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateFile = {
                    id: file ? file.id : 0,
                    fileName: values.fileName,
                    fileItem: values.fileItem,
                    size: values.size
                };
                // save edit File
                dispatch(onupdateFile(updateFile));
                fileValidation.resetForm();

            } else {
                const newFile = {
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    fileName: values.fileName + ".txt",
                    fileItem: "0",
                    icon: "ri-file-text-fill",
                    iconClass: "secondary",
                    fileType: "Documents",
                    size: "0 KB",
                    createDate: dateFormat(),
                };
                // save new File
                dispatch(onAddNewFile(newFile));
                fileValidation.resetForm();
            }
            fileToggle();
        },
    });

    const fileColumns = [
        {
            header: "Nom",
            accessorKey: "fileName",
            enableColumnFilter: false,
            cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 fs-17 me-2 filelist-icon">
                            <i className={item.icon + " text-" + item.iconClass + " align-bottom"} />
                        </div>
                        <div className="flex-grow-1 filelist-name">{item.fileName}</div>
                        <div className="d-none filelist-type"> {item.fileType} </div>
                    </div>
                );
            },
        },
        {
            header: "Élément",
            accessorKey: "fileItem",
            enableColumnFilter: false,
        },
        {
            header: "Taille",
            accessorKey: "size",
            enableColumnFilter: false,
        },
        {
            header: "Date récente",
            accessorKey: "createDate",
            enableColumnFilter: false,
        },
        {
            header: "Actions",
            enableColumnFilter: false,
            cell: (cellProps) => {
                const item = cellProps.row.original;
                return (
                    <div className="d-flex gap-3 justify-content-center">
                        <button type="button" className="btn btn-ghost-primary btn-icon btn-sm favourite-btn rounded-pill" onClick={(e) => favouriteBtn(e.target)}>
                            <i className="ri-star-fill fs-13 align-bottom" />
                        </button>

                        <UncontrolledDropdown dir='start'>
                            <DropdownToggle tag="button" className="btn btn-light btn-icon btn-sm dropdown rounded-pill" id="dropdownMenuButton">
                                <i className="ri-more-fill align-bottom" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem className="viewfile-list" onClick={() => { setSidebarData(item); fileSidebar(); sidebarOpen("file-detail-show"); }}>Voir</DropdownItem>
                                <DropdownItem className="edit-list" onClick={() => handleFileClick(item)}>Renommer</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="remove-list" onClick={() => onClickFileDelete(item)}>Supprimer</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                );
            },
        },
    ];


    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={() => handleDeleteFolder()}
                onCloseClick={() => setDeleteModal(false)}
            />

            <div className="page-content">
                <Container fluid>
                    <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
                        <div className="file-manager-sidebar">
                            <div className="p-3 d-flex flex-column h-100">
                                <div className="mb-3">
                                    <h5 className="mb-0 fw-semibold">Mon espace</h5>
                                </div>
                                <div className="search-box">
                                    <input type="text" className="form-control bg-light border-light rounded-pill" placeholder="Rechercher..." />
                                    <i className="ri-search-2-line search-icon"></i>
                                </div>
                                <SimpleBar className="mt-3 mx-n4 px-4 file-menu-sidebar-scroll">
                                    <ul className="list-unstyled file-manager-menu">
                                        <li>
                                            <a data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="true" aria-controls="collapseExample">
                                                <i className="ri-folder-2-line align-bottom me-2"></i> <span className="file-list-link">Mon espace</span>
                                            </a>
                                            <div className="collapse show" id="collapseExample">
                                                <ul className="sub-menu list-unstyled">
                                                    <li>
                                                        <Link to="#">Ressources</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">Marketing</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">Personnel</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">Projets</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">Modèles</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to="#" className={filterActive === "Documents" ? "active" : ""} onClick={() => fileCategory("Documents", "Documents")}><i className="ri-file-list-2-line align-bottom me-2"></i> <span className="file-list-link">Documents</span></Link>
                                        </li>
                                        <li>
                                            <Link to="#" className={filterActive === "Media" ? "active" : ""} onClick={() => fileCategory("Media", "Media")}><i className="ri-image-2-line align-bottom me-2"></i> <span className="file-list-link">Médias</span></Link>
                                        </li>
                                        <li>
                                            <Link to="#" className={filterActive === "Recents" ? "active" : ""} onClick={() => fileCategory("Media", "Recents")}><i className="ri-history-line align-bottom me-2"></i> <span className="file-list-link">Récents</span></Link>
                                        </li>
                                        <li>
                                            <Link to="#" className={filterActive === "Important" ? "active" : ""} onClick={() => fileCategory("Documents", "Important")}><i className="ri-star-line align-bottom me-2"></i> <span className="file-list-link">Importants</span></Link>
                                        </li>
                                        <li>
                                            <Link to="#" className={filterActive === "Deleted" ? "active" : ""} onClick={() => fileCategory("Deleted", "Deleted")}><i className="ri-delete-bin-line align-bottom me-2"></i> <span className="file-list-link">Supprimés</span></Link>
                                        </li>
                                    </ul>
                                </SimpleBar>

                                <div className="mt-auto">
                                    <h6 className="fs-11 text-muted text-uppercase mb-3">État du stockage</h6>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <i className="ri-database-2-line fs-17"></i>
                                        </div>
                                        <div className="flex-grow-1 ms-3 overflow-hidden">
                                            <div className="progress mb-2 progress-sm">
                                                <div className="progress-bar bg-success" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <span className="text-muted fs-12 d-block text-truncate"><b>47,52</b> Go utilisés sur <b>119</b> Go</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="file-manager-content w-100 p-3 py-0">
                            <div className="mx-n3 pt-4 px-4 file-manager-content-scroll overflow-x-hidden overflow-y-auto">
                                <div id="folder-list" className="mb-2">
                                    <Row className="justify-content-beetwen g-2 mb-4">

                                        <Col>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-2 d-block d-lg-none">
                                                    <button type="button" className="btn btn-soft-success btn-icon btn-sm fs-16 file-menu-btn">
                                                        <i className="ri-menu-2-fill align-bottom"></i>
                                                    </button>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="fs-16 mb-0">Dossiers</h5>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="col-auto">
                                            <div className="d-flex gap-2 align-items-start">
                                                <select className="form-control rounded-pill" data-choices data-choices-search-false name="choices-single-default" id="file-type">
                                                    <option value="">Type de fichier</option>
                                                    <option value="All" defaultValue>Tous</option>
                                                    <option value="Video">Vidéos</option>
                                                    <option value="Images">Images</option>
                                                    <option value="Music">Musique</option>
                                                    <option value="Documents">Documents</option>
                                                </select>

                                                <button className="btn btn-primary text-nowrap create-folder-modal flex-shrink-0 rounded-pill" onClick={() => handleFolderClicks()}><i className="ri-file-add-line align-bottom me-1"></i> Créer des dossiers</button>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row id="folderlist-data">

                                        {(folders || []).map((item, key) => (
                                            <Col xxl={3} className="col-6 folder-card" key={key}>
                                                <Card className="bg-light shadow-none rounded-4" id={"folder-" + item.id}>
                                                    <CardBody>
                                                        <div className="d-flex mb-1">
                                                            <div className="form-check form-check-danger mb-3 fs-15 flex-grow-1">
                                                                <input className="form-check-input" type="checkbox" value="" id={"folderlistCheckbox_" + item.id} />
                                                                <label className="form-check-label" htmlFor={"folderlistCheckbox_" + item.id}></label>
                                                            </div>

                                                            <UncontrolledDropdown>
                                                                <DropdownToggle tag="button" className="btn btn-ghost-primary btn-icon btn-sm dropdown rounded-pill">
                                                                    <i className="ri-more-2-fill fs-16 align-bottom" />
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-end">
                                                                    <DropdownItem className="view-item-btn">Ouvrir</DropdownItem>
                                                                    <DropdownItem className="edit-folder-list" onClick={() => handleFolderClick(item)}>Renommer</DropdownItem>
                                                                    <DropdownItem onClick={() => { onClickFolderDelete(item); setDeleteAlt(true); }}>Supprimer</DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>

                                                        </div>

                                                        <div className="text-center">
                                                            <div className="mb-2">
                                                                <i className="ri-folder-2-fill align-bottom text-warning display-5"></i>
                                                            </div>
                                                            <h6 className="fs-15 folder-name">{item.folderName}</h6>
                                                        </div>
                                                        <div className="hstack mt-4 text-muted">
                                                            <span className="me-auto"><b>{item.folderFile}</b> fichiers</span>
                                                            <span><b>{item.size}</b> Go</span>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>))}
                                    </Row>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center mb-3">
                                        <h5 className="flex-grow-1 fs-16 mb-0" id="filetype-title">Fichiers récents</h5>
                                        <div className="flex-shrink-0">
                                            <button className="btn btn-primary createFile-modal rounded-pill" onClick={() => handleFileClicks()}><i className="ri-file-add-line align-bottom me-1"></i> Créer un fichier</button>
                                        </div>
                                    </div>
                                    <TableContainer
                                        columns={fileColumns}
                                        data={fileList || []}
                                        isGlobalFilter={false}
                                        customPageSize={10}
                                        divClass="table-responsive table-card mb-0"
                                        tableClass="table align-middle table-nowrap mb-0"
                                        theadClass="table-active"
                                        showCard={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="file-manager-detail-content p-3 py-0">
                            <SimpleBar className="mx-n3 pt-3 px-3 file-detail-content-scroll">
                                <div id="folder-overview">
                                    <div className="d-flex align-items-center pb-3 border-bottom border-bottom-dashed">
                                        <h5 className="flex-grow-1 fw-semibold mb-0">Vue d’ensemble</h5>
                                        <div>
                                            <button type="button" className="btn btn-soft-danger btn-icon btn-sm fs-16 close-btn-overview rounded-pill" onClick={() => sidebarClose("file-detail-show")}>
                                                <i className="ri-close-fill align-bottom"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <SimpleDonutCharts dataColors='["--vz-info", "--vz-danger", "--vz-primary", "--vz-success"]' className="apex-charts mt-3" dir="ltr" />
                                    <div className="mt-4">
                                        <ul className="list-unstyled vstack gap-4">
                                            <li>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded bg-secondary-subtle text-secondary">
                                                                <i className="ri-file-text-line fs-17"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h5 className="mb-1 fs-15">Documents</h5>
                                                        <p className="mb-0 fs-12 text-muted">2348 fichiers</p>
                                                    </div>
                                                    <b>27.01 Go</b>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded bg-success-subtle text-success">
                                                                <i className="ri-gallery-line fs-17"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h5 className="mb-1 fs-15">Médias</h5>
                                                        <p className="mb-0 fs-12 text-muted">12480 fichiers</p>
                                                    </div>
                                                    <b>20.87 Go</b>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded bg-warning-subtle text-warning">
                                                                <i className="ri-folder-2-line fs-17"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h5 className="mb-1 fs-15">Projets</h5>
                                                        <p className="mb-0 fs-12 text-muted">349 fichiers</p>
                                                    </div>
                                                    <b>4.10 Go</b>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-xs">
                                                            <div className="avatar-title rounded bg-primary-subtle text-primary">
                                                                <i className="ri-error-warning-line fs-17"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h5 className="mb-1 fs-15">Autres</h5>
                                                        <p className="mb-0 fs-12 text-muted">9873 fichiers</p>
                                                    </div>
                                                    <b>33.54 Go</b>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="pb-3 mt-auto">
                                        <div className="alert alert-danger d-flex align-items-center mb-0">
                                            <div className="flex-shrink-0">
                                                <i className="ri-cloud-line text-danger align-bottom display-5"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h5 className="text-danger fs-14">Passer à Pro</h5>
                                                <p className="text-muted mb-2">Obtenez plus d’espace pour vos fichiers...</p>
                                                <button className="btn btn-sm btn-danger rounded-pill"><i className="ri-upload-cloud-line align-bottom"></i> Mettre à niveau</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="file-overview" className="h-100" style={{ display: 'none' }}>
                                    <div className="d-flex h-100 flex-column">
                                        <div className="d-flex align-items-center pb-3 border-bottom border-bottom-dashed mb-3 gap-2">
                                            <h5 className="flex-grow-1 fw-semibold mb-0">Aperçu du fichier</h5>
                                            <div>
                                                <button type="button" className="btn btn-ghost-primary btn-icon btn-sm fs-16 favourite-btn rounded-pill">
                                                    <i className="ri-star-fill align-bottom"></i>
                                                </button>
                                                <button type="button" className="btn btn-soft-danger btn-icon btn-sm fs-16 close-btn-overview rounded-pill" onClick={() => sidebarClose("file-detail-show")}>
                                                    <i className="ri-close-fill align-bottom"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pb-3 border-bottom border-bottom-dashed mb-3">
                                            <div className="file-details-box bg-light p-3 text-center rounded-3 border border-light mb-3">
                                                <div className="display-4 file-icon">
                                                    <i className={sidebarData.icon + " text-" + sidebarData.iconClass}></i>
                                                </div>
                                            </div>
                                            <button type="button" className="btn btn-icon btn-sm btn-ghost-success float-end fs-16 rounded-pill"><i className="ri-share-forward-line"></i></button>
                                            <h5 className="fs-16 mb-1 file-name">{sidebarData.fileName}</h5>
                                            <p className="text-muted mb-0 fs-12"><span className="file-size">{sidebarData.size}</span>, <span className="create-date">{sidebarData.createDate}</span></p>
                                        </div>
                                        <div>
                                            <h5 className="fs-12 text-uppercase text-muted mb-3">Description du fichier :</h5>

                                            <div className="table-responsive">
                                                <table className="table table-borderless table-nowrap table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row" style={{ width: "35%" }}>Nom du fichier :</th>
                                                            <td className="file-name">{sidebarData.fileName}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Type de fichier :</th>
                                                            <td className="file-type">{sidebarData.fileType}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Taille :</th>
                                                            <td className="file-size">{sidebarData.size}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Créé le :</th>
                                                            <td className="create-date">{sidebarData.createDate}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Chemin :</th>
                                                            <td className="file-path"><div className="user-select-all text-truncate">*:\projects\src\assets\images</div></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div>
                                                <h5 className="fs-12 text-uppercase text-muted mb-3">Informations de partage :</h5>
                                                <div className="table-responsive">
                                                    <table className="table table-borderless table-nowrap table-sm">
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row" style={{ width: "35%" }}>Nom du partage :</th>
                                                                <td className="share-name">\\*\Projects</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">Chemin du partage :</th>
                                                                <td className="share-path">velzon:\Documents\</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto border-top border-top-dashed py-3">
                                            <div className="hstack gap-2">
                                                <button type="button" className="btn btn-soft-primary w-100 rounded-pill"><i className="ri-download-2-line align-bottom me-1"></i> Télécharger</button>
                                                <button type="button" className="btn btn-soft-danger w-100 remove-file-overview rounded-pill" onClick={() => onClickFileDelete(sidebarData)}><i className="ri-close-fill align-bottom me-1"></i> Supprimer</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SimpleBar>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Folder Modal */}
            <Modal className="fade zoomIn" isOpen={modalFolder} toggle={() => setModalFolder(!modalFolder)} id="createFolderModal" modalClassName="zoomIn" contentClassName="rounded-4 border-0" centered tabIndex="-1">
                <ModalHeader className="p-3 bg-success-subtle rounded-top-4" id="createFolderModalLabel" toggle={() => setModalFolder(!modalFolder)}> {isEdit ? "Renommer le dossier" : "Créer un dossier"} </ModalHeader>
                <ModalBody>
                    <form autoComplete="off" className="needs-validation createfolder-form" id="createfolder-form" noValidate=""
                        onSubmit={(e) => {
                            e.preventDefault();
                            folderValidation.handleSubmit();
                            return false;
                        }}
                    >
                        <div className="mb-4">
                            <label htmlFor="foldername-input" className="form-label">Nom du dossier</label>
                            <input type="text" className="form-control rounded-pill" id="foldername-input"
                                name='folderName'
                                placeholder="Saisir le nom du dossier"
                                // validate={{
                                //     required: { value: true },
                                // }}
                                onChange={folderValidation.handleChange}
                                onBlur={folderValidation.handleBlur}
                                value={folderValidation.values.folderName || ""}
                            // invalid={folderValidation.touched.folderName && folderValidation.errors.folderName ? true : false}
                            />
                            {folderValidation.touched.folderName && folderValidation.errors.folderName ? (
                                <FormFeedback type="invalid">{folderValidation.errors.folderName}</FormFeedback>
                            ) : null}

                        </div>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-ghost-success rounded-pill" onClick={() => setModalFolder(false)}><i className="ri-close-line align-bottom"></i> Fermer</button>
                            <button type="submit" className="btn btn-primary rounded-pill" id="addNewFolder">{isEdit ? "Enregistrer" : "Ajouter un dossier"}</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            {/* File Modal */}
            <Modal id="createFileModal" isOpen={modalFile} toggle={fileToggle} modalClassName="zoomIn" contentClassName="rounded-4 border-0" centered tabIndex="-1">
                <ModalHeader toggle={fileToggle} className="p-3 bg-success-subtle rounded-top-4">{!!isEdit ? "Renommer le fichier" : "Créer un fichier"}</ModalHeader>
                <ModalBody>
                    <form className="needs-validation createfile-form" id="createfile-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            fileValidation.handleSubmit();
                            return false;
                        }}
                    >
                        <div className="mb-4">
                            <label htmlFor="filename-input" className="form-label">Nom du fichier</label>
                            <input type="text" className="form-control rounded-pill" id="filename-input"
                                name="fileName"
                                placeholder="Saisir le nom du fichier"
                                // validate={{
                                //     required: { value: true },
                                // }}
                                onChange={fileValidation.handleChange}
                                onBlur={fileValidation.handleBlur}
                                value={fileValidation.values.fileName || ""}
                            // invalid={fileValidation.touched.fileName && fileValidation.errors.fileName ? true : false}
                            />
                            {fileValidation.touched.fileName && fileValidation.errors.fileName ? (
                                <FormFeedback type="invalid">{fileValidation.errors.fileName}</FormFeedback>
                            ) : null}
                        </div>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-ghost-success rounded-pill" onClick={() => setModalFile(false)}><i className="ri-close-line align-bottom"></i> Fermer</button>
                            <button type="submit" className="btn btn-primary rounded-pill" id="addNewFile">{!!isEdit ? "Enregistrer" : "Créer"}</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default Contrat;

















