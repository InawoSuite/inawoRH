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
  ModalHeader,
  Label,
  Input,
  Button,
  FormFeedback,
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

// Statuts des opérations
const OPERATION_STATUS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "valide", label: "Validé" },
  { value: "annule", label: "Annulé" },
];

// Types de journaux
const JOURNAL_TYPES = [
  { value: "ACH", label: "Achats" },
  { value: "VTE", label: "Ventes" },
  { value: "BQ1", label: "Banque" },
  { value: "OD", label: "Opérations Diverses" },
  { value: "CSH", label: "Caisse" },
];

// Comptes prédéfinis
const PREDEFINED_ACCOUNTS = [
  { value: "411", label: "411 - Clients" },
  { value: "401", label: "401 - Fournisseurs" },
  { value: "601", label: "601 - Achats" },
  { value: "701", label: "701 - Ventes" },
  { value: "512", label: "512 - Banque" },
  { value: "531", label: "531 - Caisse" },
  { value: "4452", label: "4452 - TVA collectée" },
  { value: "4456", label: "4456 - TVA déductible" },
  { value: "681", label: "681 - Dotations" },
];

const InvoiceListe = ({ switchToCreate, showDetails, switchToEdit }) => {
  const { t } = useTranslation();

  // États principaux
  const [InvoiceListeData, setInvoiceListeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const { userProfile, token } = useProfile();

  // États des modals
  const [modal, setModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState(null);

  const itemsPerPage = 50;
  const fileInputRef = useRef(null);

  // ✅ Filtrage optimisé des opérations
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return InvoiceListeData;

    return InvoiceListeData.filter((operation) =>
      Object.values(operation).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [InvoiceListeData, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Calculer les totaux pour la ligne de total
  const totals = useMemo(() => {
    return filteredData.reduce((acc, operation) => {
      acc.totalDebit += operation.debit || 0;
      acc.totalCredit += operation.credit || 0;
      return acc;
    }, { totalDebit: 0, totalCredit: 0 });
  }, [filteredData]);

  // ✅ Options pour les types de journaux
  const journalTypeOptions = useMemo(
    () =>
      JOURNAL_TYPES.map((journal) => ({
        value: journal.value,
        label: `${journal.value} - ${journal.label}`,
      })),
    []
  );

  // ✅ Options pour les comptes
  const accountOptions = useMemo(
    () =>
      PREDEFINED_ACCOUNTS.map((account) => ({
        value: account.value,
        label: account.label,
      })),
    []
  );

  // ✅ Fonction pour récupérer les opérations
  const fetchInvoiceListe = useCallback(async () => {
    setLoading(true);

    if (!token) {
      toast.error(
        "Token d'authentification manquant. Veuillez vous reconnecter."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}/compta/InvoiceListe/`, {
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
        setInvoiceListeData(data);
        // Préparer les données pour l'export
        const exportDataFormatted = data.map((operation) => ({
          Date: operation.date || "N/A",
          "Code Journal": operation.code_journal || "N/A",
          Compte: operation.compte || "N/A",
          Contact: operation.contact || "N/A",
          Référence: operation.reference || "N/A",
          Débit: operation.debit?.toLocaleString("fr-FR") || "0",
          Crédit: operation.credit?.toLocaleString("fr-FR") || "0",
          Statut:
            OPERATION_STATUS.find((s) => s.value === operation.statut)?.label ||
            operation.statut,
        }));
        setExportData(exportDataFormatted);
      } else {
        toast.error("Format de données inattendu reçu du serveur");
        setInvoiceListeData([]);
        setExportData([]);
      }
    } catch (err) {
      console.error("Erreur fetchInvoiceListe:", err);
      // Données fictives pour démonstration
      const demoData = [
        {
          id: 1,
          date: "2024-01-25",
          code_journal: "ACH",
          compte: "6011",
          contact: "Fournisseur ABC",
          reference: "FAC-2024-001",
          debit: 205000,
          credit: 0,
          statut: "brouillon",
          piece_jointe: "facture_001.pdf",
          createur: "Admin",
          date_creation: "2024-01-25",
          libelle: "Achat fournitures de bureau",
          piece: "FAC001",
        },
        {
          id: 2,
          date: "2024-01-26",
          code_journal: "VTE",
          compte: "701",
          contact: "Client XYZ",
          reference: "VTE-2024-001",
          debit: 0,
          credit: 350000,
          statut: "valide",
          piece_jointe: "facture_vente_001.pdf",
          createur: "Commercial",
          date_creation: "2024-01-26",
          libelle: "Vente produits A",
          piece: "VTE001",
        },
        {
          id: 3,
          date: "2024-01-27",
          code_journal: "BQ1",
          compte: "512",
          contact: "Banque BGFI",
          reference: "VIR-001",
          debit: 500000,
          credit: 0,
          statut: "brouillon",
          piece_jointe: null,
          createur: "RH",
          date_creation: "2024-01-27",
          libelle: "Virement salaires",
          piece: "VIR001",
        },
        {
          id: 4,
          date: "2024-01-28",
          code_journal: "OD",
          compte: "681",
          contact: "-",
          reference: "AMT-001",
          debit: 0,
          credit: 125000,
          statut: "brouillon",
          piece_jointe: null,
          createur: "Comptable",
          date_creation: "2024-01-28",
          libelle: "Amortissement matériel",
          piece: "AMT001",
        },
        {
          id: 5,
          date: "2024-01-29",
          code_journal: "CSH",
          compte: "531",
          contact: "Fournisseur DEF",
          reference: "CHQ-001",
          debit: 0,
          credit: 75000,
          statut: "annule",
          piece_jointe: "cheque_001.jpg",
          createur: "Caissier",
          date_creation: "2024-01-29",
          libelle: "Paiement par chèque",
          piece: "CHQ001",
        },
      ];
      setInvoiceListeData(demoData);
      const exportDataFormatted = demoData.map((operation) => ({
        Date: operation.date || "N/A",
        "Code Journal": operation.code_journal || "N/A",
        Compte: operation.compte || "N/A",
        Contact: operation.contact || "N/A",
        Référence: operation.reference || "N/A",
        Débit: operation.debit?.toLocaleString("fr-FR") || "0",
        Crédit: operation.credit?.toLocaleString("fr-FR") || "0",
        Statut:
          OPERATION_STATUS.find((s) => s.value === operation.statut)?.label ||
          operation.statut,
      }));
      setExportData(exportDataFormatted);
      toast.info("Données de démonstration chargées");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Opérations Comptables | INAWO - Suite de Gestion";
    fetchInvoiceListe();
  }, [fetchInvoiceListe]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Validation du formulaire avec Yup
  const validationSchema = Yup.object({
    date: Yup.string().required("La date est requise"),
    code_journal: Yup.string().required("Le code journal est requis"),
    compte: Yup.string().required("Le compte est requis"),
    reference: Yup.string().required("La référence est requise"),
    libelle: Yup.string().required("Le libellé est requis"),
    piece: Yup.string(),
    debit: Yup.number()
      .min(0, "Le débit ne peut pas être négatif")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    credit: Yup.number()
      .min(0, "Le crédit ne peut pas être négatif")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    contact: Yup.string(),
  });

  // ✅ Formik pour la gestion du formulaire d'édition
  const formik = useFormik({
    initialValues: {
      date: "",
      code_journal: "",
      compte: "",
      reference: "",
      libelle: "",
      piece: "",
      debit: "",
      credit: "",
      contact: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitOperation(values, resetForm, setSubmitting);
    },
  });

  // ✅ Fonction de soumission pour l'édition
  const handleSubmitOperation = async (values, resetForm, setSubmitting) => {
    const payload = {
      ...values,
      debit: parseFloat(values.debit) || 0,
      credit: parseFloat(values.credit) || 0,
    };

    try {
      if (!token) {
        toast.error("Token d'authentification manquant");
        return;
      }

      // En mode édition seulement
      const response = await fetch(
        `${BaseUrl}/compta/InvoiceListe/${currentOperation.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Mise à jour locale
      const updatedData = InvoiceListeData.map((op) =>
        op.id === currentOperation.id ? { ...op, ...payload } : op
      );
      setInvoiceListeData(updatedData);
      toast.success("Opération modifiée avec succès!");

      resetForm();
      setModal(false);
      setCurrentOperation(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      toast.error(err.message || "Erreur lors de la sauvegarde de l'opération");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handlers optimisés
  const handleModalClose = useCallback(() => {
    setModal(false);
    setCurrentOperation(null);
    formik.resetForm();
  }, [formik]);

  const handleOpenEditModal = useCallback(
    (operation) => {
      setCurrentOperation(operation);

      // Pré-remplir le formulaire avec les données de l'opération
      formik.setValues({
        date: operation.date || "",
        code_journal: operation.code_journal || "",
        compte: operation.compte || "",
        reference: operation.reference || "",
        libelle: operation.libelle || "",
        piece: operation.piece || "",
        debit: operation.debit?.toString() || "",
        credit: operation.credit?.toString() || "",
        contact: operation.contact || "",
      });

      setModal(true);
    },
    [formik]
  );

  // ✅ Fonction de suppression
  const handleDeleteOperation = async () => {
    if (!operationToDelete?.id) return;

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    try {
      const response = await fetch(
        `${BaseUrl}/compta/InvoiceListe/${operationToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP ${response.status}`);
      }

      toast.success("Opération supprimée avec succès!");
      setDeleteModal(false);
      setOperationToDelete(null);

      // Mise à jour locale
      const updatedData = InvoiceListeData.filter(
        (op) => op.id !== operationToDelete.id
      );
      setInvoiceListeData(updatedData);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error(
        err.message || "Erreur lors de la suppression de l'opération"
      );
    }
  };

  const handleOpenDeleteModal = useCallback((operation) => {
    setOperationToDelete(operation);
    setDeleteModal(true);
  }, []);

  // ✅ Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant || 0);
  }, []);

  // ✅ Fonction pour obtenir le label du statut
  const getStatusLabel = useCallback((statusValue) => {
    const statusObj = OPERATION_STATUS.find((s) => s.value === statusValue);
    return statusObj ? statusObj.label : statusValue;
  }, []);

  // ✅ Fonction pour obtenir la couleur du statut
  const getStatusColor = useCallback((statusValue) => {
    const statusColors = {
      brouillon: "warning",
      valide: "success",
      annule: "danger",
    };
    return statusColors[statusValue] || "secondary";
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
    },
    {
      header: t("Date"),
      accessorKey: "date",
      enableColumnFilter: false,
      cell: (cell) => {
        return cell.getValue()
          ? new Date(cell.getValue()).toLocaleDateString("fr-FR")
          : "N/A";
      },
    },
    {
      header: t("Code journal"),
      accessorKey: "code_journal",
      enableColumnFilter: false,
    },
    {
      header: t("Compte"),
      accessorKey: "compte",
      enableColumnFilter: false,
    },
    {
      header: t("Référence"),
      accessorKey: "reference",
      enableColumnFilter: false,
    },
    {
      header: t("Débit"),
      accessorKey: "debit",
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
    },
    {
      header: t("Crédit"),
      accessorKey: "credit",
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
    },
    {
      header: t("Statut"),
      accessorKey: "statut",
      enableColumnFilter: false,
      cell: (cell) => {
        const statusValue = cell.getValue();
        const color = getStatusColor(statusValue);
        const badgeClass = {
          warning: "bg-warning-subtle text-warning",
          success: "bg-success-subtle text-success",
          danger: "bg-danger-subtle text-danger",
          secondary: "bg-secondary-subtle text-secondary"
        };
        
        return (
          <span className={`badge ${badgeClass[color] || badgeClass.secondary} rounded-pill`}>
            {getStatusLabel(statusValue)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      enableColumnFilter: false,
      cell: (cellProps) => {
        const operation = cellProps.row.original;
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Link
                to="#"
                className="text-primary d-inline-block edit-item-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenEditModal(operation);
                }}
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link
                to="#"
                className="text-danger d-inline-block remove-item-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDeleteModal(operation);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ], [t, currentPage, itemsPerPage, handleOpenEditModal, handleOpenDeleteModal, formatMontant, getStatusLabel, getStatusColor]);

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
            onDeleteClick={handleDeleteOperation}
            onCloseClick={() => {
              setDeleteModal(false);
              setOperationToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cette opération ?"
          />

          <BreadCrumb
            title={t("Opérations Comptables")}
            pageTitle={
              <>
                <i className="ri-file-list-3-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de bord")}</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Chercher une opération..."
                showSearch={true}
                onAddClick={switchToCreate}
                addButtonText="Nouvelle opération"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-upload-line"
                showExportButton={true}
              />

              <Col lg={12}>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                      <Loader />
                      <p className="mt-3 text-muted">Chargement des opérations...</p>
                    </div>
                  </div>
                ) : filteredData.length > 0 ? (
                  <div>
                    {/* ✅ NOUVEAU : TableContainerTotal avec ligne de totaux */}
                    <TableContainerTotal
                      columns={columns}
                      data={paginatedData}
                      isGlobalFilter={false}
                      customPageSize={itemsPerPage}
                      cardStyle={{ borderRadius: "20px", overflow: "hidden" }}
                      
                      // ✅ NOUVEAU : Ajoutez ces props pour la ligne de totaux
                      showTotalRow={true}
                      totalConfig={{
                        totalLabel: "Total",
                        totalLabelColumn: 1, 
                        columnsToSum: ['debit', 'credit'],
                        formatValues: {
                          'debit': (val) => `${formatMontant(val)} `,
                          'credit': (val) => `${formatMontant(val)} `,
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
                    title="Aucune opération trouvée"
                    description="Commencez par créer une nouvelle opération comptable"
                    actionButton={
                      <button
                        className="btn btn-success"
                        onClick={switchToCreate}
                        style={{ borderRadius: "20px" }}
                      >
                        Nouvelle opération
                      </button>
                    }
                  />
                )}
              </Col>
            </Col>
          </Row>

          {/* Modal d'édition */}
          <Modal
            isOpen={modal}
            toggle={handleModalClose}
            centered
            className="zoomIn"
            contentClassName="custom-rounded-modal"
            size="lg"
          >
            <ModalHeader 
              className="bg-light p-3"
              toggle={handleModalClose}
              style={{ borderRadius: "20px 20px 0 0" }}
            >
              {t("Modifier l'opération")}
            </ModalHeader>
            
            <ModalBody style={{ borderRadius: "0 0 20px 20px" }}>
              <Form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Label htmlFor="date" className="form-label">
                      {t("Date de l'écriture")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      className="form-control"
                      placeholder={t("Sélectionner une date")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.date && formik.errors.date}
                    />
                    {formik.touched.date && formik.errors.date && (
                      <FormFeedback>{formik.errors.date}</FormFeedback>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="code_journal" className="form-label">
                      {t("Code journal")} <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      value={
                        journalTypeOptions.find(
                          (opt) => opt.value === formik.values.code_journal
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "code_journal",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={journalTypeOptions}
                      placeholder={t("Sélectionnez un journal")}
                      isClearable={false}
                    />
                    {formik.touched.code_journal && formik.errors.code_journal && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.code_journal}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="compte" className="form-label">
                      {t("Compte général")} <span className="text-danger">*</span>
                    </Label>
                    <CustomSelect
                      value={
                        accountOptions.find(
                          (opt) => opt.value === formik.values.compte
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "compte",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
                      options={accountOptions}
                      placeholder={t("Sélectionnez un compte")}
                      isClearable={false}
                    />
                    {formik.touched.compte && formik.errors.compte && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.compte}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="reference" className="form-label">
                      {t("Référence")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="reference"
                      name="reference"
                      className="form-control"
                      placeholder={t("Ex: FAC-2024-001")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.reference}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.reference && formik.errors.reference}
                    />
                    {formik.touched.reference && formik.errors.reference && (
                      <FormFeedback>{formik.errors.reference}</FormFeedback>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="piece" className="form-label">
                      {t("Pièce")}
                    </Label>
                    <Input
                      type="text"
                      id="piece"
                      name="piece"
                      className="form-control"
                      placeholder={t("Ex: FAC001")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.piece}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="contact" className="form-label">
                      {t("Contact")}
                    </Label>
                    <Input
                      type="text"
                      id="contact"
                      name="contact"
                      className="form-control"
                      placeholder={t("Ex: Fournisseur ABC")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.contact}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="col-12">
                    <Label htmlFor="libelle" className="form-label">
                      {t("Libellé")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="textarea"
                      id="libelle"
                      name="libelle"
                      className="form-control rounded-4"
                      placeholder={t("Description de l'opération")}
                      style={{ borderRadius: "15px" }}
                      value={formik.values.libelle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.libelle && formik.errors.libelle}
                      rows="3"
                    />
                    {formik.touched.libelle && formik.errors.libelle && (
                      <FormFeedback>{formik.errors.libelle}</FormFeedback>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="debit" className="form-label">
                      {t("Débit ()")}
                    </Label>
                    <Input
                      type="number"
                      id="debit"
                      name="debit"
                      className="form-control"
                      placeholder="0"
                      style={{ borderRadius: "20px" }}
                      value={formik.values.debit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.debit && formik.errors.debit}
                    />
                    {formik.touched.debit && formik.errors.debit && (
                      <FormFeedback>{formik.errors.debit}</FormFeedback>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Label htmlFor="credit" className="form-label">
                      {t("Crédit ()")}
                    </Label>
                    <Input
                      type="number"
                      id="credit"
                      name="credit"
                      className="form-control"
                      placeholder="0"
                      style={{ borderRadius: "20px" }}
                      value={formik.values.credit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.touched.credit && formik.errors.credit}
                    />
                    {formik.touched.credit && formik.errors.credit && (
                      <FormFeedback>{formik.errors.credit}</FormFeedback>
                    )}
                  </div>
                </div>

                <div className="hstack gap-2 justify-content-end mt-4">
                  <Button
                    type="button"
                    className="btn btn-light"
                    onClick={handleModalClose}
                    style={{ borderRadius: "20px" }}
                  >
                    {t("Annuler")}
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-primary"
                    style={{ borderRadius: "20px" }}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line me-1"></i>
                        {t("Modification...")}
                      </>
                    ) : (
                      t("Enregistrer les modifications")
                    )}
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoiceListe;