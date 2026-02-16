import React, { useState, useEffect, useCallback, useMemo } from "react";
// import TableContainer from "../../../../Components/Common/TableContainer"; // IMPORTANT : Utiliser la nouvelle version
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
import TableContainerTotal from "../../../../Components/Common/TableContainerTotal";

// Types de journaux prédéfinis
const JOURNAL_TYPES = [
  { value: "ventes", label: "Ventes" },
  { value: "achats", label: "Achats" },
  { value: "banque", label: "Banque" },
  { value: "caisse", label: "Caisse" },
  { value: "operations_diverses", label: "Opérations diverses" },
  { value: "salaires", label: "Salaires" },
  { value: "impots", label: "Impôts et taxes" },
  { value: "amortissement", label: "Amortissement" },
  { value: "general", label: "Journal général" },
];

// DONNÉES FICTIVES POUR LES JOURNAUX
const MOCK_JOURNAUX = [
  {
    id: 1,
    code: "JVE",
    nom: "Journal des Ventes",
    type: "ventes",
    debit_initial: 15000000,
    credit_initial: 12000000,
    date_creation: "2025-01-10",
    dernier_mouvement: "2025-01-15",
    statut: "actif",
    operations_count: 245,
  },
  {
    id: 2,
    code: "JAC",
    nom: "Journal des Achats",
    type: "achats",
    debit_initial: 8000000,
    credit_initial: 9500000,
    date_creation: "2025-01-05",
    dernier_mouvement: "2025-01-14",
    statut: "actif",
    operations_count: 187,
  },
  {
    id: 3,
    code: "JBN",
    nom: "Journal de Banque",
    type: "banque",
    debit_initial: 25000000,
    credit_initial: 22000000,
    date_creation: "2025-01-01",
    dernier_mouvement: "2025-01-15",
    statut: "actif",
    operations_count: 342,
  },
  {
    id: 4,
    code: "JCS",
    nom: "Journal de Caisse",
    type: "caisse",
    debit_initial: 5000000,
    credit_initial: 4500000,
    date_creation: "2025-01-12",
    dernier_mouvement: "2025-01-15",
    statut: "actif",
    operations_count: 156,
  },
  {
    id: 5,
    code: "JOD",
    nom: "Journal Opérations Diverses",
    type: "operations_diverses",
    debit_initial: 3000000,
    credit_initial: 2800000,
    date_creation: "2024-12-20",
    dernier_mouvement: "2025-01-14",
    statut: "actif",
    operations_count: 98,
  },
  {
    id: 6,
    code: "JSL",
    nom: "Journal des Salaires",
    type: "salaires",
    debit_initial: 12000000,
    credit_initial: 11500000,
    date_creation: "2024-12-28",
    dernier_mouvement: "2025-01-10",
    statut: "inactif",
    operations_count: 67,
  },
  {
    id: 7,
    code: "JIT",
    nom: "Journal Impôts et Taxes",
    type: "impots",
    debit_initial: 6000000,
    credit_initial: 5500000,
    date_creation: "2025-01-03",
    dernier_mouvement: "2025-01-13",
    statut: "actif",
    operations_count: 45,
  },
  {
    id: 8,
    code: "JAM",
    nom: "Journal d'Amortissement",
    type: "amortissement",
    debit_initial: 9000000,
    credit_initial: 8500000,
    date_creation: "2025-01-08",
    dernier_mouvement: "2025-01-14",
    statut: "actif",
    operations_count: 32,
  },
];

// DONNÉES FICTIVES POUR LES OPÉRATIONS DES JOURNAUX
const MOCK_OPERATIONS = [
  {
    id: 1,
    journalId: 1,
    date: "2025-01-15",
    libelle: "Vente de marchandises",
    compte: "701",
    debit: 2500000,
    credit: 0,
    piece: "FAC-2025-001",
  },
  {
    id: 2,
    journalId: 1,
    date: "2025-01-15",
    libelle: "Vente de services",
    compte: "702",
    debit: 1500000,
    credit: 0,
    piece: "FAC-2025-002",
  },
  {
    id: 3,
    journalId: 2,
    date: "2025-01-14",
    libelle: "Achat de matières premières",
    compte: "601",
    debit: 0,
    credit: 1800000,
    piece: "FA-2025-001",
  },
  {
    id: 4,
    journalId: 3,
    date: "2025-01-15",
    libelle: "Virement bancaire reçu",
    compte: "512",
    debit: 5000000,
    credit: 0,
    piece: "VIR-2025-001",
  },
  {
    id: 5,
    journalId: 3,
    date: "2025-01-15",
    libelle: "Paiement fournisseur",
    compte: "401",
    debit: 0,
    credit: 3000000,
    piece: "CHQ-2025-001",
  },
  {
    id: 6,
    journalId: 4,
    date: "2025-01-15",
    libelle: "Encaissement espèces",
    compte: "531",
    debit: 850000,
    credit: 0,
    piece: "REC-2025-001",
  },
  {
    id: 7,
    journalId: 4,
    date: "2025-01-15",
    libelle: "Décaissement caisse",
    compte: "607",
    debit: 0,
    credit: 250000,
    piece: "DEC-2025-001",
  },
];

const Journaux = () => {
  const { t } = useTranslation();

  // États principaux
  const [journauxData, setJournauxData] = useState([]);
  const [operationsData, setOperationsData] = useState([]); // Pour les opérations des journaux
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const { userProfile, token } = useProfile();

  // États des modals
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);

  const itemsPerPage = 10;

  // ✅ Options pour les types de journaux (format CustomSelect)
  const journalTypeOptions = useMemo(
    () =>
      JOURNAL_TYPES.map((type) => ({
        value: type.value,
        label: type.label,
      })),
    []
  );

  // ✅ Filtrage optimisé des journaux
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return journauxData;

    return journauxData.filter((journal) =>
      Object.values(journal).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [journauxData, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Calculer les totaux pour la ligne de total
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, journal) => {
        acc.totalDebit += journal.debit_initial || 0;
        acc.totalCredit += journal.credit_initial || 0;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0 }
    );
  }, [filteredData]);

  // ✅ Fonction pour récupérer les journaux (données fictives)
  const fetchJournaux = useCallback(async () => {
    setLoading(true);

    // Simuler un délai de chargement
    setTimeout(() => {
      try {
        setJournauxData(MOCK_JOURNAUX);

        // Préparer les données pour l'export
        const exportDataFormatted = MOCK_JOURNAUX.map((journal) => ({
          Code: journal.code || "N/A",
          "Nom du journal": journal.nom,
          Type:
            JOURNAL_TYPES.find((t) => t.value === journal.type)?.label ||
            journal.type,
          "Débit initial":
            journal.debit_initial?.toLocaleString("fr-FR") || "0",
          "Crédit initial":
            journal.credit_initial?.toLocaleString("fr-FR") || "0",
          Statut: journal.statut === "actif" ? "Actif" : "Inactif",
          "Date création": journal.date_creation,
          "Nb opérations": journal.operations_count,
        }));
        setExportData(exportDataFormatted);

        toast.success("Données de journaux chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchJournaux:", err);
        toast.error("Erreur lors de la récupération des journaux");
        setJournauxData([]);
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  // ✅ Fonction pour récupérer les opérations d'un journal (données fictives)
  const fetchOperationsJournal = useCallback(async (journalId) => {
    // Simuler un délai de chargement
    return new Promise((resolve) => {
      setTimeout(() => {
        const journalOperations = MOCK_OPERATIONS.filter(
          (op) => op.journalId === journalId
        );
        resolve(journalOperations);
      }, 300);
    });
  }, []);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Journaux Comptables | INAWO - Suite de Gestion";
    fetchJournaux();
  }, [fetchJournaux]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Validation du formulaire avec Yup
  const validationSchema = Yup.object({
    code: Yup.string()
      .required("Le code du journal est requis")
      .min(2, "Le code doit contenir au moins 2 caractères")
      .max(10, "Le code ne peut pas dépasser 10 caractères"),
    nom: Yup.string()
      .required("Le nom du journal est requis")
      .min(3, "Le nom doit contenir au moins 3 caractères"),
    type: Yup.string()
      .required("Le type de journal est requis")
      .oneOf(
        JOURNAL_TYPES.map((t) => t.value),
        "Type de journal invalide"
      ),
    debit_initial: Yup.number()
      .min(0, "Le débit initial ne peut pas être négatif")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    credit_initial: Yup.number()
      .min(0, "Le crédit initial ne peut pas être négatif")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
  });

  // ✅ Formik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      code: "",
      nom: "",
      type: "",
      debit_initial: "",
      credit_initial: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitJournal(values, resetForm, setSubmitting);
    },
  });

  // ✅ Fonction de soumission avec données fictives
  const handleSubmitJournal = async (values, resetForm, setSubmitting) => {
    setSubmitting(true);

    // Simuler un délai de traitement
    setTimeout(() => {
      try {
        const newJournal = {
          id: journauxData.length + 1,
          code: values.code.toUpperCase(),
          nom: values.nom,
          type: values.type,
          debit_initial: parseFloat(values.debit_initial) || 0,
          credit_initial: parseFloat(values.credit_initial) || 0,
          date_creation: new Date().toISOString().split("T")[0],
          dernier_mouvement: null,
          statut: "actif",
          operations_count: 0,
        };

        if (isEdit && currentJournal) {
          // Mise à jour d'un journal existant
          const updatedData = journauxData.map((journal) =>
            journal.id === currentJournal.id
              ? { ...journal, ...newJournal }
              : journal
          );
          setJournauxData(updatedData);
          toast.success("Journal modifié avec succès!");
        } else {
          // Création d'un nouveau journal
          setJournauxData((prev) => [newJournal, ...prev]);
          toast.success("Journal ajouté avec succès!");
        }

        resetForm();
        handleModalClose();
      } catch (err) {
        console.error(
          `Erreur lors de ${
            isEdit ? "la modification" : "l'ajout"
          } du journal:`,
          err
        );
        toast.error(
          err.message ||
            `Erreur lors de ${
              isEdit ? "la modification" : "l'ajout"
            } du journal`
        );
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  // ✅ Fonction de suppression avec données fictives
  const handleDeleteJournal = async () => {
    if (!journalToDelete?.id) return;

    // Simuler un délai de suppression
    setTimeout(() => {
      try {
        const updatedData = journauxData.filter(
          (journal) => journal.id !== journalToDelete.id
        );
        setJournauxData(updatedData);
        toast.success("Journal supprimé avec succès!");

        setDeleteModal(false);
        setJournalToDelete(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error(err.message || "Erreur lors de la suppression du journal");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleModalClose = useCallback(() => {
    setModal(false);
    setIsEdit(false);
    setCurrentJournal(null);
    formik.resetForm();
  }, [formik]);

  const handleDetailModalClose = useCallback(() => {
    setDetailModal(false);
    setSelectedJournal(null);
    setOperationsData([]);
  }, []);

  const handleOpenDetailModal = useCallback(
    async (journal) => {
      setSelectedJournal(journal);
      setDetailModal(true);

      // Charger les opérations du journal (données fictives)
      setLoading(true);
      const operations = await fetchOperationsJournal(journal.id);
      setOperationsData(operations);
      setLoading(false);
    },
    [fetchOperationsJournal]
  );

  const handleOpenEditModal = useCallback(
    (journal) => {
      if (!journal?.id) {
        toast.error("Données de journal invalides");
        return;
      }

      setCurrentJournal(journal);
      setIsEdit(true);
      formik.setValues({
        code: journal.code || "",
        nom: journal.nom || "",
        type: journal.type || "",
        debit_initial: journal.debit_initial || "",
        credit_initial: journal.credit_initial || "",
      });
      setModal(true);
    },
    [formik]
  );

  const handleOpenAddModal = useCallback(() => {
    setCurrentJournal(null);
    setIsEdit(false);
    formik.resetForm();
    setModal(true);
  }, [formik]);

  const handleOpenDeleteModal = useCallback((journal) => {
    setJournalToDelete(journal);
    setDeleteModal(true);
  }, []);

  // ✅ Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    if (montant === null || montant === undefined) return "-";
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant);
  }, []);

  // ✅ Fonction pour obtenir le label du type
  const getTypeLabel = useCallback((typeValue) => {
    const typeObj = JOURNAL_TYPES.find((t) => t.value === typeValue);
    return typeObj ? typeObj.label : typeValue;
  }, []);

  // ✅ Fonction pour obtenir la couleur du type (sans fond)
  const getTypeColor = useCallback((typeValue) => {
    const typeColors = {
      ventes: "text-success", // Vert
      achats: "text-primary", // Bleu primaire
      banque: "text-info", // Bleu clair
      caisse: "text-warning", // Orange/jaune
      operations_diverses: "text-secondary", // Gris
      salaires: "text-danger", // Rouge
      impots: "text-dark", // Noir
      amortissement: "text-purple", // Violet
      general: "text-blue", // Bleu
    };
    return typeColors[typeValue] || "text-secondary";
  }, []);

  // ✅ Fonction pour obtenir la couleur du statut
  const getStatusColor = useCallback((statut) => {
    return statut === "actif" ? "success" : "secondary";
  }, []);

  // ✅ Fonction pour obtenir le libellé du statut
  const getStatusLabel = useCallback((statut) => {
    return statut === "actif" ? "Actif" : "Inactif";
  }, []);

  // ✅ Fonction pour calculer les totaux des opérations
  const calculateTotauxOperations = useCallback((operations) => {
    const totaux = operations.reduce(
      (acc, op) => {
        acc.debit += op.debit || 0;
        acc.credit += op.credit || 0;
        return acc;
      },
      { debit: 0, credit: 0 }
    );

    // Calculer le solde
    const solde = totaux.debit - totaux.credit;

    return {
      debit: totaux.debit,
      credit: totaux.credit,
      solde: solde,
    };
  }, []);

  // ✅ Colonnes du tableau (sans la colonne Solde)
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
        size: 50,
      },
      {
        header: "Code",
        accessorKey: "code",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold text-primary">{cell.getValue()}</span>
        ),
        size: 80,
      },
      {
        header: "Nom du journal",
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cell) => <div className="fw-medium">{cell.getValue()}</div>,
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        cell: (cell) => {
          const typeValue = cell.getValue();
          return (
            <span className={`fw-semibold ${getTypeColor(typeValue)}`}>
              {getTypeLabel(typeValue)}
            </span>
          );
        },
        size: 120,
      },
      {
        header: "Statut",
        accessorKey: "statut",
        enableColumnFilter: false,
        cell: (cell) => {
          const statutValue = cell.getValue();
          return (
            <Badge color={getStatusColor(statutValue)} className="rounded-pill">
              {getStatusLabel(statutValue)}
            </Badge>
          );
        },
        size: 90,
      },
      {
        header: "Débit initial",
        accessorKey: "debit_initial",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-primary fw-bold">
            {formatMontant(cell.getValue())} 
          </span>
        ),
        size: 120,
      },
      {
        header: "Crédit initial",
        accessorKey: "credit_initial",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-info fw-semibold">
            {formatMontant(cell.getValue())} 
          </span>
        ),
        size: 120,
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const journal = cellProps.row.original;
          return (
            <div className="d-flex gap-2">
              <Link
                to="#"
                className="text-info"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDetailModal(journal);
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
                  handleOpenEditModal(journal);
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
                  handleOpenDeleteModal(journal);
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
    ],
    [
      currentPage,
      itemsPerPage,
      handleOpenDetailModal,
      handleOpenEditModal,
      handleOpenDeleteModal,
      formatMontant,
      getTypeLabel,
      getTypeColor,
      getStatusColor,
      getStatusLabel,
    ]
  );

  // ✅ Fonction pour calculer le solde simple (utilisée seulement dans le modal de détail)
  const calculateSolde = useCallback((debit, credit) => {
    return (debit || 0) - (credit || 0);
  }, []);

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
            filename="journaux_comptables"
          />

          {/* Delete Modal */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteJournal}
            onCloseClick={() => {
              setDeleteModal(false);
              setJournalToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer ce journal ? Cette action est irréversible."
          />

          <BreadCrumb
            title="Journaux Comptables"
            pageTitle={
              <>
                <i className="ri-book-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher un journal..."
                showSearch={true}
                onAddClick={handleOpenAddModal}
                addButtonText="Nouveau journal"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} journal
                    {filteredData.length !== 1 ? "aux" : ""} trouvé
                    {filteredData.length !== 1 ? "s" : ""}
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center my-5"
                  style={{ minHeight: "300px" }}
                >
                  <div className="text-center">
                    <Loader />
                    <p className="mt-3 text-muted">
                      Chargement des journaux...
                    </p>
                  </div>
                </div>
              ) : filteredData.length > 0 ? (
                <div>
                  <TableContainerTotal
                    columns={columns}
                    data={paginatedData}
                    isGlobalFilter={false}
                    customPageSize={itemsPerPage}
                    className="table-striped"
                    cardStyle={{ borderRadius: "20px", overflow: "hidden" }}
                    showTotalRow={true}
                    totalConfig={{
                      totalLabel: "Total",
                      totalLabelColumn: 1,
                      columnsToSum: ["debit_initial", "credit_initial"],
                      formatValues: {
                        debit_initial: (val) => `${formatMontant(val)} `,
                        credit_initial: (val) => `${formatMontant(val)} `,
                      },
                      textColor: "text-primary",
                      fontWeight: "fw-bold",
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
                </div>
              ) : (
                <EmptyDataCard
                  title="Aucun journal trouvé"
                  description={
                    searchTerm
                      ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
                      : "Commencez par créer un nouveau journal comptable pour organiser vos écritures."
                  }
                  actionButton={
                    <Button
                      color="success"
                      onClick={handleOpenAddModal}
                      className="rounded-pill"
                    >
                      <i className="ri-file-add-line me-1"></i>
                      Nouveau journal
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
        >
          <ModalHeader
            toggle={handleModalClose}
            className="bg-light p-3"
            style={{ borderRadius: "20px 20px 0 0" }}
          >
            {isEdit ? "Modifier le journal" : "Ajouter un nouveau journal"}
          </ModalHeader>

          <Form onSubmit={formik.handleSubmit}>
            <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
              <div className="mb-3">
                <Label htmlFor="code" className="form-label">
                  Code <span className="text-danger">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="Ex: JVE, JAC, JBN"
                  className="rounded-pill"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.code && Boolean(formik.errors.code)}
                />
                {formik.touched.code && formik.errors.code && (
                  <FormFeedback>{formik.errors.code}</FormFeedback>
                )}
                <small className="text-muted">
                  Code unique du journal (2-10 caractères, majuscules
                  recommandées)
                </small>
              </div>

              <div className="mb-3">
                <Label htmlFor="nom" className="form-label">
                  Nom du journal <span className="text-danger">*</span>
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Ex: Journal des ventes, Journal de banque"
                  className="rounded-pill"
                  value={formik.values.nom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.nom && Boolean(formik.errors.nom)}
                />
                {formik.touched.nom && formik.errors.nom && (
                  <FormFeedback>{formik.errors.nom}</FormFeedback>
                )}
              </div>

              <div className="mb-3">
                <Label htmlFor="type" className="form-label">
                  Type de journal <span className="text-danger">*</span>
                </Label>
                <CustomSelect
                  value={
                    journalTypeOptions.find(
                      (opt) => opt.value === formik.values.type
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "type",
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                  options={journalTypeOptions}
                  placeholder="Sélectionnez un type"
                  isClearable={false}
                />
                {formik.touched.type && formik.errors.type && (
                  <div className="invalid-feedback d-block">
                    {formik.errors.type}
                  </div>
                )}
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="debit_initial" className="form-label">
                      Débit initial ()
                    </Label>
                    <Input
                      id="debit_initial"
                      name="debit_initial"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="rounded-pill"
                      value={formik.values.debit_initial}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.debit_initial &&
                        Boolean(formik.errors.debit_initial)
                      }
                    />
                    {formik.touched.debit_initial &&
                      formik.errors.debit_initial && (
                        <FormFeedback>
                          {formik.errors.debit_initial}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="credit_initial" className="form-label">
                      Crédit initial ()
                    </Label>
                    <Input
                      id="credit_initial"
                      name="credit_initial"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="rounded-pill"
                      value={formik.values.credit_initial}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.credit_initial &&
                        Boolean(formik.errors.credit_initial)
                      }
                    />
                    {formik.touched.credit_initial &&
                      formik.errors.credit_initial && (
                        <FormFeedback>
                          {formik.errors.credit_initial}
                        </FormFeedback>
                      )}
                  </div>
                </Col>
              </Row>
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
                    <i
                      className={
                        isEdit ? "ri-save-line me-1" : "ri-add-line me-1"
                      }
                    ></i>
                    {isEdit ? "Enregistrer" : "Ajouter le journal"}
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Modal de détails avec Code et Tableau des opérations */}
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
            Détails du journal
          </ModalHeader>

          <ModalBody>
            {selectedJournal && (
              <div>
                {/* Informations de base */}
                <div className="mb-4">
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-2">Code :</h5>
                      <span className="fs-5 fw-bold text-primary">
                        {selectedJournal.code}
                      </span>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-2">Type :</h5>
                      <span
                        className={`fs-5 fw-bold ${getTypeColor(
                          selectedJournal.type
                        )}`}
                      >
                        {getTypeLabel(selectedJournal.type)}
                      </span>
                    </Col>
                  </Row>

                  <h5 className="mt-3 mb-2">Nom du journal :</h5>
                  <p className="fs-5 fw-semibold text-primary">
                    {selectedJournal.nom}
                  </p>

                  <div className="row mt-3">
                    <Col md={6}>
                      <h6 className="text-muted mb-1">Date de création :</h6>
                      <p className="fw-medium">
                        {selectedJournal.date_creation}
                      </p>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-muted mb-1">Statut :</h6>
                      <Badge
                        color={getStatusColor(selectedJournal.statut)}
                        className="rounded-pill"
                      >
                        {getStatusLabel(selectedJournal.statut)}
                      </Badge>
                    </Col>
                  </div>
                </div>

                {/* Tableau des opérations du journal */}
                <div className="mt-4">
                  <h5 className="mb-3 border-bottom pb-2">
                    <i className="ri-table-2 me-2"></i>
                    Tableau des opérations du journal ({
                      operationsData.length
                    }{" "}
                    opérations)
                  </h5>

                  {loading ? (
                    <div className="text-center my-4">
                      <Loader size="sm" />
                      <p className="text-muted mt-2">
                        Chargement des opérations...
                      </p>
                    </div>
                  ) : operationsData.length > 0 ? (
                    <div className="table-responsive">
                      <Table bordered striped hover className="mb-4">
                        <thead className="table-light">
                          <tr>
                            <th width="100">Date</th>
                            <th>Libellé</th>
                            <th width="100">Compte</th>
                            <th width="150" className="text-end">
                              Débit ()
                            </th>
                            <th width="150" className="text-end">
                              Crédit ()
                            </th>
                            <th width="120">Pièce</th>
                          </tr>
                        </thead>
                        <tbody>
                          {operationsData.map((operation) => (
                            <tr key={operation.id}>
                              <td>{operation.date || "N/A"}</td>
                              <td>{operation.libelle || "N/A"}</td>
                              <td className="fw-semibold">
                                {operation.compte || "N/A"}
                              </td>
                              <td className="text-end text-primary fw-bold">
                                {operation.debit > 0
                                  ? formatMontant(operation.debit)
                                  : "-"}
                              </td>
                              <td className="text-end text-danger fw-semibold">
                                {operation.credit > 0
                                  ? formatMontant(operation.credit)
                                  : "-"}
                              </td>
                              <td>
                                <span className="text-info fw-medium">
                                  {operation.piece || "N/A"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-active">
                          <tr>
                            <th colSpan="3" className="text-end">
                              TOTAUX :
                            </th>
                            <th className="text-end text-primary fw-bold">
                              {formatMontant(
                                calculateTotauxOperations(operationsData).debit
                              )}{" "}
                              
                            </th>
                            <th className="text-end text-danger fw-bold">
                              {formatMontant(
                                calculateTotauxOperations(operationsData).credit
                              )}{" "}
                              
                            </th>
                            <th></th>
                          </tr>
                          <tr>
                            <th colSpan="3" className="text-end">
                              SOLDE :
                            </th>
                            <th
                              colSpan="3"
                              className={`text-center fw-bold ${
                                calculateTotauxOperations(operationsData)
                                  .solde > 0
                                  ? "text-primary"
                                  : "text-danger"
                              }`}
                            >
                              {formatMontant(
                                Math.abs(
                                  calculateTotauxOperations(operationsData)
                                    .solde
                                )
                              )}{" "}
                              
                              <span className="ms-2 fw-normal text-muted">
                                (
                                {calculateTotauxOperations(operationsData)
                                  .solde > 0
                                  ? "Débit"
                                  : "Crédit"}
                                )
                              </span>
                            </th>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  ) : (
                    <div className="alert alert-info border-0 text-center">
                      <i className="ri-information-line me-2"></i>
                      Aucune opération enregistrée pour ce journal.
                    </div>
                  )}
                </div>

                {/* Résumé financier */}
                <div className="alert alert-light border mt-4">
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h6 className="mb-1">Débit initial</h6>
                        <p className="fs-5 fw-bold text-primary mb-0">
                          {formatMontant(selectedJournal.debit_initial)} 
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h6 className="mb-1">Crédit initial</h6>
                        <p className="fs-5 fw-bold text-danger mb-0">
                          {formatMontant(selectedJournal.credit_initial)} 
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h6 className="mb-1">Solde initial</h6>
                        <p
                          className={`fs-5 fw-bold mb-0 ${
                            calculateSolde(
                              selectedJournal.debit_initial,
                              selectedJournal.credit_initial
                            ) > 0
                              ? "text-primary"
                              : "text-danger"
                          }`}
                        >
                          {formatMontant(
                            Math.abs(
                              calculateSolde(
                                selectedJournal.debit_initial,
                                selectedJournal.credit_initial
                              )
                            )
                          )}{" "}
                          
                        </p>
                      </div>
                    </Col>
                  </Row>
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

export default Journaux;
