import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Form,
  Button,
  FormFeedback,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import Pagination from "../../../../Components/Common/Pagination";
import Loader from "../../../../Components/Common/Loader";
import { useTranslation } from "react-i18next";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";
import { useSubscriptionGuard } from "../../../../Components/Hooks/useSubscriptionGuard";

const Unit = () => {
  const { t } = useTranslation();
  const { guardAction, isExpired } = useSubscriptionGuard();

  // États principaux
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const { userProfile, token } = useProfile();

  // États des modals
  const [mainModalOpen, setMainModalOpen] = useState(false); // Modal principal avec tableau
  const [addUnitModalOpen, setAddUnitModalOpen] = useState(false); // Modal d'ajout d'une unité
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);

  // États pour la gestion des unités temporaires
  const [tempUnits, setTempUnits] = useState([]); // Unités en attente d'envoi
  const [tempCurrentPage, setTempCurrentPage] = useState(1);
  const [editingTempUnit, setEditingTempUnit] = useState(null); // Pour éditer une unité temporaire

  // État pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [deleteTempModal, setDeleteTempModal] = useState(false);
  const [tempUnitToDelete, setTempUnitToDelete] = useState(null);

  // ✅ État pour le modal de détails
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // ✅ Fonction pour ouvrir le modal de détails
  const handleOpenUnitDetails = useCallback((unit) => {
    setSelectedUnit(unit);
    setDetailsModalOpen(true);
  }, []);

  // ✅ Fonction pour fermer le modal de détails
  const handleCloseUnitDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedUnit(null);
  }, []);

  const itemsPerPage = 50;
  const tempItemsPerPage = 10;

  // ✅ Filtrage optimisé des unités
  const filteredUnits = useMemo(() => {
    if (!searchTerm.trim()) return units;

    const searchLower = searchTerm.toLowerCase();
    return units.filter(
      (unit) =>
        unit.nom?.toLowerCase().includes(searchLower) ||
        unit.symbole?.toLowerCase().includes(searchLower) ||
        unit.sous_unite?.toLowerCase().includes(searchLower)
    );
  }, [units, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUnits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUnits, currentPage]);

  // ✅ Pagination pour les unités temporaires
  const paginatedTempData = useMemo(() => {
    const startIndex = (tempCurrentPage - 1) * tempItemsPerPage;
    return tempUnits.slice(startIndex, startIndex + tempItemsPerPage);
  }, [tempUnits, tempCurrentPage]);

  // ✅ Fonction pour récupérer les unités
  const fetchUnits = useCallback(async () => {
    setLoading(true);

    if (!token) {
      toast.error(
        "Token d'authentification manquant. Veuillez vous reconnecter."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}/stocks/unites/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUnits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors de la récupération des unités:", err);
      toast.error("Impossible de charger les unités");
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = `${t("Unité")} | INAWO - Suite de Gestion`;
    fetchUnits();
  }, [t, fetchUnits]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Validation du formulaire avec Yup
  const validationSchema = Yup.object({
    nom: Yup.string()
      .required("Le nom de l'unité est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne doit pas dépasser 100 caractères"),
    symbole: Yup.string()
      .required("L'abréviation est requise")
      .min(1, "L'abréviation doit contenir au moins 1 caractère")
      .max(10, "L'abréviation ne doit pas dépasser 10 caractères"),
    sous_unite: Yup.string().max(
      50,
      "La sous-unité ne doit pas dépasser 50 caractères"
    ),
    eng: Yup.boolean().required("La langue est requise"),
  });

  // ✅ Formik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      nom: "",
      symbole: "",
      sous_unite: "",
      eng: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      if (isEditMode && currentUnit) {
        // Mode édition d'une unité existante en base
        await handleUpdateExistingUnit(values, resetForm, setSubmitting);
      } else if (editingTempUnit !== null) {
        // Mode édition d'une unité temporaire
        handleUpdateTempUnit(values, resetForm);
      } else {
        // Mode ajout d'une nouvelle unité temporaire
        handleAddTempUnit(values, resetForm);
      }
    },
  });

  // ✅ Ajouter une unité au tableau temporaire
  const handleAddTempUnit = (values, resetForm) => {
    const newUnit = {
      id: Date.now(), // ID temporaire
      nom: values.nom.trim(),
      symbole: values.symbole.trim().toUpperCase(),
      sous_unite: values.sous_unite?.trim() || null,
      eng: values.eng,
      isTemp: true,
    };

    setTempUnits([...tempUnits, newUnit]);
    toast.success("Unité ajoutée au tableau");
    resetForm();
    setAddUnitModalOpen(false);
  };

  // ✅ Modifier une unité temporaire
  const handleUpdateTempUnit = (values, resetForm) => {
    const updatedUnits = tempUnits.map((unit) =>
      unit.id === editingTempUnit.id
        ? {
            ...unit,
            nom: values.nom.trim(),
            symbole: values.symbole.trim().toUpperCase(),
            sous_unite: values.sous_unite?.trim() || null,
            eng: values.eng,
          }
        : unit
    );

    setTempUnits(updatedUnits);
    toast.success("Unité modifiée dans le tableau");
    resetForm();
    setEditingTempUnit(null);
    setAddUnitModalOpen(false);
  };

  // ✅ Supprimer une unité temporaire
  const handleDeleteTempUnit = () => {
    if (tempUnitToDelete) {
      setTempUnits(tempUnits.filter((unit) => unit.id !== tempUnitToDelete.id));
      toast.success("Unité retirée du tableau");
      setDeleteTempModal(false);
      setTempUnitToDelete(null);
    }
  };

  // ✅ Envoyer toutes les unités temporaires en base
  const handleSubmitAllUnits = async () => {
    // Protection abonnement
    if (!guardAction('add')) return;

    if (tempUnits.length === 0) {
      toast.error("Aucune unité à enregistrer");
      return;
    }

    if (!userProfile?.id) {
      toast.error("ID utilisateur non trouvé");
      return;
    }

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    const unitsData = tempUnits.map((unit) => ({
      nom: unit.nom,
      symbole: unit.symbole,
      sous_unite: unit.sous_unite,
      nombre_totale: null,
      eng: unit.eng,
      utilisateur: userProfile.id,
    }));

    try {
      const response = await fetch(`${BaseUrl}/stocks/unites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unitsData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 400 && errorData) {
          const errorMessages = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("\n");
          throw new Error(errorMessages);
        }

        throw new Error(
          errorData?.detail ||
            `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      const count = Array.isArray(result) ? result.length : unitsData.length;
      toast.success(`${count} unité(s) enregistrée(s) avec succès!`);

      setTempUnits([]);
      setMainModalOpen(false);
      fetchUnits();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des unités:", err);
      toast.error(err.message || "Erreur lors de l'enregistrement des unités");
    }
  };

  // ✅ Modifier une unité existante en base
  const handleUpdateExistingUnit = async (values, resetForm, setSubmitting) => {
    // Protection abonnement
    if (!guardAction('edit')) {
      setSubmitting(false);
      return;
    }

    if (!userProfile?.id) {
      toast.error("ID utilisateur non trouvé");
      setSubmitting(false);
      return;
    }

    if (!token) {
      toast.error("Token d'authentification manquant");
      setSubmitting(false);
      return;
    }

    const unitData = {
      nom: values.nom.trim(),
      symbole: values.symbole.trim().toUpperCase(),
      sous_unite: values.sous_unite?.trim() || null,
      nombre_totale: currentUnit?.nombre_totale || null,
      eng: values.eng,
      utilisateur: userProfile.id,
    };

    try {
      const response = await fetch(
        `${BaseUrl}/stocks/unites/${currentUnit.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(unitData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Erreur ${response.status}`);
      }

      toast.success("Unité modifiée avec succès!");
      resetForm();
      setIsEditMode(false);
      setCurrentUnit(null);
      setMainModalOpen(false);
      fetchUnits();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      toast.error(err.message || "Erreur lors de la modification de l'unité");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Fonction de suppression d'une unité existante
  const handleDeleteUnit = async () => {
    // Protection abonnement
    if (!guardAction('delete')) return;

    if (!unitToDelete?.id) return;

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    try {
      const response = await fetch(
        `${BaseUrl}/stocks/unites/${unitToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Erreur ${response.status}`);
      }

      toast.success("Unité supprimée avec succès!");
      setDeleteModal(false);
      setUnitToDelete(null);
      fetchUnits();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error(err.message || "Erreur lors de la suppression de l'unité");
    }
  };

  // ✅ Handlers pour les modals
  const handleOpenMainModal = useCallback(() => {
    setTempUnits([]);
    setTempCurrentPage(1);
    setIsEditMode(false);
    setCurrentUnit(null);
    setMainModalOpen(true);
  }, []);

  const handleCloseMainModal = useCallback(() => {
    setMainModalOpen(false);
    setTempUnits([]);
    setTempCurrentPage(1);
  }, []);

  const handleOpenAddUnitModal = useCallback(() => {
    setEditingTempUnit(null);
    formik.resetForm();
    setAddUnitModalOpen(true);
  }, [formik]);

  const handleCloseAddUnitModal = useCallback(() => {
    setAddUnitModalOpen(false);
    setEditingTempUnit(null);
    formik.resetForm();
  }, [formik]);

  const handleOpenEditExistingModal = useCallback(
    (unit) => {
      setCurrentUnit(unit);
      setIsEditMode(true);
      formik.setValues({
        nom: unit.nom || "",
        symbole: unit.symbole || "",
        sous_unite: unit.sous_unite || "",
        eng: unit.eng || false,
      });
      setMainModalOpen(true);
    },
    [formik]
  );

  const handleOpenEditTempModal = useCallback(
    (unit) => {
      setEditingTempUnit(unit);
      formik.setValues({
        nom: unit.nom || "",
        symbole: unit.symbole || "",
        sous_unite: unit.sous_unite || "",
        eng: unit.eng || false,
      });
      setAddUnitModalOpen(true);
    },
    [formik]
  );

  const handleOpenDeleteModal = useCallback((unit) => {
    setUnitToDelete(unit);
    setDeleteModal(true);
  }, []);

  const handleOpenDeleteTempModal = useCallback((unit) => {
    setTempUnitToDelete(unit);
    setDeleteTempModal(true);
  }, []);

  // ✅ Colonnes du tableau principal
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
      },
      // {
      //   header: t("Nom"),
      //   accessorKey: "nom",
      //   enableColumnFilter: false,
      //   cell: (cell) => (
      //     <span className="fw-medium text-primary">{cell.getValue()}</span>
      //   ),
      // },
      {
        header: t("Nom"),
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cell) => {
          const unit = cell.row.original;
          return (
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleOpenUnitDetails(unit);
              }}
              className="text-primary"
              style={{
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
            >
              {cell.getValue()}
            </Link>
          );
        },
      },
      {
        header: t("Symbole"),
        accessorKey: "symbole",
        enableColumnFilter: false,
        cell: (cell) => (
          <span
            style={{ fontSize: "0.58rem" }}
            className="badge rounded-pill bg-info"
          >
            {cell.getValue()}
          </span>
        ),
      },
      {
        header: t("Sous unité"),
        accessorKey: "sous_unite",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-muted">{cell.getValue() || "—"}</span>
        ),
      },
      {
        header: t("Langue"),
        accessorKey: "eng",
        enableColumnFilter: false,
        cell: (cell) => (
          <span
            style={{ fontSize: "0.58rem" }}
            className={`badge rounded-pill ${
              cell.getValue() ? "bg-primary" : "bg-success"
            }`}
          >
            {cell.getValue() ? "Anglais" : "Français"}
          </span>
        ),
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const unit = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenEditExistingModal(unit);
                  }}
                  data-bs-toggle="tooltip"
                  title="Modifier"
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
                    handleOpenDeleteModal(unit);
                  }}
                  data-bs-toggle="tooltip"
                  title="Supprimer"
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [t, currentPage, handleOpenEditExistingModal, handleOpenDeleteModal]
  );

  // ✅ Colonnes du tableau temporaire
  const tempColumns = useMemo(
    () => [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => {
          const globalIndex =
            (tempCurrentPage - 1) * tempItemsPerPage + cell.row.index + 1;
          return <span className="fw-medium">{globalIndex}</span>;
        },
      },
      {
        header: t("Nom"),
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-medium text-primary">{cell.getValue()}</span>
        ),
      },
      {
        header: t("Symbole"),
        accessorKey: "symbole",
        enableColumnFilter: false,
        cell: (cell) => (
          <span
            style={{ fontSize: "0.58rem" }}
            className="badge rounded-pill bg-info"
          >
            {cell.getValue()}
          </span>
        ),
      },
      {
        header: t("Sous unité"),
        accessorKey: "sous_unite",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-muted">{cell.getValue() || "—"}</span>
        ),
      },
      {
        header: t("Langue"),
        accessorKey: "eng",
        enableColumnFilter: false,
        cell: (cell) => (
          <span
            style={{ fontSize: "0.58rem" }}
            className={`badge rounded-pill ${
              cell.getValue() ? "bg-primary" : "bg-success"
            }`}
          >
            {cell.getValue() ? "Anglais" : "Français"}
          </span>
        ),
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const unit = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenEditTempModal(unit);
                  }}
                  data-bs-toggle="tooltip"
                  title="Modifier"
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
                    handleOpenDeleteTempModal(unit);
                  }}
                  data-bs-toggle="tooltip"
                  title="Retirer"
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [t, tempCurrentPage, handleOpenEditTempModal, handleOpenDeleteTempModal]
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
            theme="light"
          />

          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={orderList}
          />

          {/* Delete Modal - Unité existante */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteUnit}
            onCloseClick={() => {
              setDeleteModal(false);
              setUnitToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cette unité ?"
          />

          {/* Delete Modal - Unité temporaire */}
          <DeleteModal
            show={deleteTempModal}
            onDeleteClick={handleDeleteTempUnit}
            onCloseClick={() => {
              setDeleteTempModal(false);
              setTempUnitToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir retirer cette unité du tableau ?"
          />

          <BreadCrumb
            title={t("Unités")}
            pageTitle={
              <>
                <i className="ri-ruler-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de bord")}</Link>
                &nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Chercher une unité..."
                showSearch={true}
                onAddClick={handleOpenMainModal}
                addButtonText="Ajouter des unités"
                addButtonIcon="ri-file-add-line"
                showAddButton={true}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-upload-line"
                showExportButton={false}
              />

              <Col lg={12}>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center my-5"
                    style={{ minHeight: "300px" }}
                  >
                    <div className="text-center">
                      <Loader />
                      <p className="mt-3 text-muted">
                        Chargement des unités...
                      </p>
                    </div>
                  </div>
                ) : filteredUnits.length > 0 ? (
                  <TableContainer
                    columns={columns}
                    data={paginatedData}
                    isGlobalFilter={false}
                    customPageSize={itemsPerPage}
                  >
                    <Pagination
                      data={filteredUnits}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      perPageData={itemsPerPage}
                      alwaysShow={true}
                      showInfo={true}
                    />
                  </TableContainer>
                ) : (
                  <EmptyDataCard
                    title="Aucune unité trouvée"
                    description={
                      searchTerm
                        ? "Aucune unité ne correspond à votre recherche"
                        : "Commencez par ajouter des unités de mesure"
                    }
                    actionButton={
                      <button
                        className="btn btn-success"
                        onClick={handleOpenMainModal}
                        style={{ borderRadius: "20px" }}
                      >
                        <i className="ri-file-add-line me-1"></i>
                        Ajouter des unités
                      </button>
                    }
                  />
                )}
              </Col>
            </Col>
          </Row>

          {/* Modal Principal - Affichage du tableau avec unités en attente */}
          <Modal
            isOpen={mainModalOpen && !isEditMode}
            toggle={handleCloseMainModal}
            centered
            className="zoomIn"
            size="lg-6"
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              className="bg-light p-3 rounded-top-4"
              toggle={handleCloseMainModal}
            >
              <div className="d-flex align-items-center justify-content-between w-100 me-5">
                <span>
                  <i className="ri-table-line me-2"></i>
                  {t("Gestion des unités à ajouter")}
                </span>
                <Button
                  color="success"
                  size="sm"
                  onClick={handleOpenAddUnitModal}
                  style={{ borderRadius: "20px", marginRight: "40px" }}
                >
                  <i className="ri-add-line me-1"></i>
                  Ajouter une unité
                </Button>
              </div>
            </ModalHeader>

            <ModalBody>
              {tempUnits.length > 0 && (
                <Alert color="info" className="mb-3">
                  <i className="ri-information-line me-2"></i>
                  <strong>{tempUnits.length}</strong> unité(s) en attente
                  d'enregistrement
                </Alert>
              )}

              <TableContainer
                columns={tempColumns}
                data={paginatedTempData}
                isGlobalFilter={false}
                customPageSize={tempItemsPerPage}
                size ="md"
              >
                {tempUnits.length > 0 && (
                  <Pagination
                    data={tempUnits}
                    currentPage={tempCurrentPage}
                    setCurrentPage={setTempCurrentPage}
                    itemsPerPage={tempItemsPerPage}
                    alwaysShow={true}
                    showInfo={true}
                  />
                )}
              </TableContainer>

              {tempUnits.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <i className="ri-information-line me-1"></i>
                  Cliquez sur "Ajouter une unité" pour commencer
                </div>
              )}

              <div className="hstack gap-2 justify-content-end mt-4">
                <Button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCloseMainModal}
                  style={{ borderRadius: "20px" }}
                >
                  <i className="ri-close-line me-1"></i>
                  Annuler
                </Button>
                <Button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmitAllUnits}
                  style={{ borderRadius: "20px" }}
                  disabled={tempUnits.length === 0}
                >
                  <i className="ri-save-line me-1"></i>
                  Enregistrer toutes les unités{" "}
                  {tempUnits.length > 0 && `(${tempUnits.length})`}
                </Button>
              </div>
            </ModalBody>
          </Modal>

          {/* Modal d'édition d'une unité existante */}
          <Modal
            isOpen={mainModalOpen && isEditMode}
            toggle={() => {
              setMainModalOpen(false);
              setIsEditMode(false);
              setCurrentUnit(null);
              formik.resetForm();
            }}
            centered
            className="zoomIn"
            size="md"
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              className="bg-light p-3 rounded-top-4"
              toggle={() => {
                setMainModalOpen(false);
                setIsEditMode(false);
                setCurrentUnit(null);
                formik.resetForm();
              }}
            >
              {t("Modifier l'unité")}
            </ModalHeader>

            <ModalBody>
              <Form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <Label htmlFor="nom" className="form-label">
                      {t("Nom")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="nom"
                      name="nom"
                      className="form-control"
                      placeholder={t("ex: Kilogramme")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.nom}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={!!(formik.touched.nom && formik.errors.nom)}
                    />
                    {formik.touched.nom && formik.errors.nom && (
                      <FormFeedback>{formik.errors.nom}</FormFeedback>
                    )}
                  </div>

                  <div className="col-12">
                    <Label htmlFor="symbole" className="form-label">
                      {t("Symbole")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="symbole"
                      name="symbole"
                      className="form-control"
                      placeholder={t("ex: KG")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.symbole}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        !!(formik.touched.symbole && formik.errors.symbole)
                      }
                    />
                    {formik.touched.symbole && formik.errors.symbole && (
                      <FormFeedback>{formik.errors.symbole}</FormFeedback>
                    )}
                  </div>

                  <div className="col-12">
                    <Label htmlFor="sous_unite" className="form-label">
                      {t("Sous unité")}
                    </Label>
                    <Input
                      type="text"
                      id="sous_unite"
                      name="sous_unite"
                      className="form-control"
                      placeholder={t("ex: g (optionnel)")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.sous_unite}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        !!(
                          formik.touched.sous_unite && formik.errors.sous_unite
                        )
                      }
                    />
                    {formik.touched.sous_unite && formik.errors.sous_unite && (
                      <FormFeedback>{formik.errors.sous_unite}</FormFeedback>
                    )}
                  </div>

                  <div className="col-12">
                    <Label htmlFor="eng" className="form-label">
                      {t("Langue")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      id="eng"
                      name="eng"
                      className="form-select"
                      style={{ borderRadius: "20px" }}
                      value={formik.values.eng}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={!!(formik.touched.eng && formik.errors.eng)}
                    >
                      <option value={false}>Français</option>
                      <option value={true}>Anglais</option>
                    </Input>
                    {formik.touched.eng && formik.errors.eng && (
                      <FormFeedback>{formik.errors.eng}</FormFeedback>
                    )}
                  </div>
                </div>

                <div className="hstack gap-2 justify-content-end mt-4">
                  <Button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      setMainModalOpen(false);
                      setIsEditMode(false);
                      setCurrentUnit(null);
                      formik.resetForm();
                    }}
                    style={{ borderRadius: "20px" }}
                    disabled={formik.isSubmitting}
                  >
                    {t("Annuler")}
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-success"
                    style={{ borderRadius: "20px" }}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {t("Modification...")}
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line me-1"></i>
                        {t("Modifier l'unité")}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </Modal>

          {/* Modal d'ajout/modification d'une unité temporaire */}
          <Modal
            isOpen={addUnitModalOpen}
            toggle={handleCloseAddUnitModal}
            centered
            className="zoomIn"
            size="md"
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              className="bg-light p-3 rounded-top-4"
              toggle={handleCloseAddUnitModal}
            >
              {editingTempUnit ? t("Modifier l'unité") : t("Ajouter une unité")}
            </ModalHeader>

            <ModalBody>
              <Form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <Label htmlFor="nom" className="form-label">
                      {t("Nom")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="nom"
                      name="nom"
                      className="form-control"
                      placeholder={t("ex: Kilogramme")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.nom}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={!!(formik.touched.nom && formik.errors.nom)}
                    />
                    {formik.touched.nom && formik.errors.nom && (
                      <FormFeedback>{formik.errors.nom}</FormFeedback>
                    )}
                  </div>

                  <div className="col-12">
                    <Label htmlFor="symbole" className="form-label">
                      {t("Symbole")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="symbole"
                      name="symbole"
                      className="form-control"
                      placeholder={t("ex: KG")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.symbole}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        !!(formik.touched.symbole && formik.errors.symbole)
                      }
                    />
                    {formik.touched.symbole && formik.errors.symbole && (
                      <FormFeedback>{formik.errors.symbole}</FormFeedback>
                    )}
                  </div>

                  <div className="col-12">
                    <Label htmlFor="sous_unite" className="form-label">
                      {t("Sous unité")}
                    </Label>
                    <Input
                      type="text"
                      id="sous_unite"
                      name="sous_unite"
                      className="form-control"
                      placeholder={t("ex: g (optionnel)")}
                      style={{ borderRadius: "20px" }}
                      value={formik.values.sous_unite}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        !!(
                          formik.touched.sous_unite && formik.errors.sous_unite
                        )
                      }
                    />
                    {formik.touched.sous_unite && formik.errors.sous_unite && (
                      <FormFeedback>{formik.errors.sous_unite}</FormFeedback>
                    )}
                  </div>

                  <div className="col-12">
                    <Label htmlFor="eng" className="form-label">
                      {t("Langue")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      id="eng"
                      name="eng"
                      className="form-select"
                      style={{ borderRadius: "20px" }}
                      value={formik.values.eng}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={!!(formik.touched.eng && formik.errors.eng)}
                    >
                      <option value={false}>Français</option>
                      <option value={true}>Anglais</option>
                    </Input>
                    {formik.touched.eng && formik.errors.eng && (
                      <FormFeedback>{formik.errors.eng}</FormFeedback>
                    )}
                  </div>
                </div>

                <div className="hstack gap-2 justify-content-end mt-4">
                  <Button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCloseAddUnitModal}
                    style={{ borderRadius: "20px" }}
                    disabled={formik.isSubmitting}
                  >
                    {t("Annuler")}
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-success"
                    style={{ borderRadius: "20px" }}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {editingTempUnit ? t("Modification...") : t("Ajout...")}
                      </>
                    ) : (
                      <>
                        <i
                          className={
                            editingTempUnit
                              ? "ri-save-line me-1"
                              : "ri-add-line me-1"
                          }
                        ></i>
                        {editingTempUnit
                          ? t("Modifier")
                          : t("Ajouter au tableau")}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </Modal>

          {/* Modal de Détails de l'Unité */}
          <Modal
            isOpen={detailsModalOpen}
            toggle={handleCloseUnitDetails}
            centered
            className="zoomIn"
            size="md"
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              className="bg-light p-3 rounded-top-4"
              toggle={handleCloseUnitDetails}
            >
              <i className="ri-information-line me-2"></i>
              Détails de l'Unité
            </ModalHeader>

            <ModalBody>
              {selectedUnit ? (
                <div className="row g-3">
                  {/* Section Informations Générales */}
                  <div className="col-12">
                    <h5 className="text-primary mb-3">
                      <i className="ri-ruler-line me-2"></i>
                      Informations Générales
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <Label className="fw-bold">Nom complet</Label>
                        <div className="p-2 rounded-pill border border-light bg-light">
                          {selectedUnit.nom || "Non renseigné"}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <Label className="fw-bold">Symbole</Label>
                        <div className="p-2 rounded-pill border border-light bg-light">
                          <span className="badge bg-info rounded-pill" style={{fontSize:"0.58rem"}}>
                            {selectedUnit.symbole || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <Label className="fw-bold">Sous-unité</Label>
                        <div className="p-2 rounded-pill border border-light bg-light">
                          {selectedUnit.sous_unite || "Aucune sous-unité"}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <Label className="fw-bold">Langue</Label>
                        <div className="p-2 rounded-pill border border-light bg-light">
                          <span  style={{ fontSize: "0.58rem" }}
                            className={`badge rounded-pill ${
                              selectedUnit.eng ? "bg-primary" : "bg-success"
                            }`}
                          >
                            {selectedUnit.eng ? "Anglais" : "Français"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Informations Techniques */}
                  <div className="col-12">
                    <h5 className="text-primary mb-3">
                      <i className="ri-settings-3-line me-2"></i>
                      Informations Techniques
                    </h5>
                    <div className="row g-3">
                      {/* <div className="col-md-6">
                        <Label className="fw-bold">ID de l'unité</Label>
                        <div className="p-2 rounded-pill border border-light bg-light">
                          #{selectedUnit.id}
                        </div>
                      </div> */}
                      <div className="col-md-12">
                        <Label className="fw-bold">Quantité totale</Label>
                        <div className="p-2 rounded-pill border border-light bg-light">
                          {selectedUnit.nombre_totale || "Non définie"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Utilisateur */}
                  {selectedUnit.utilisateur_details && (
                    <div className="col-12">
                      <h5 className="text-primary mb-3">
                        <i className="ri-user-line me-2"></i>
                        Créé par
                      </h5>
                      <div className="p-3 border border-light rounded-4 bg-light">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <i className="ri-user-3-line fs-4 text-muted"></i>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">
                              {selectedUnit.utilisateur_details.first_name}{" "}
                              {selectedUnit.utilisateur_details.last_name}
                            </h6>
                            <p className="text-muted mb-0 small">
                              {selectedUnit.utilisateur_details.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section Date de création */}
                  {selectedUnit.created_at && (
                    <div className="col-12">
                      <h5 className="text-primary mb-3">
                        <i className="ri-calendar-line me-2"></i>
                        Historique
                      </h5>
                      <div className="p-2 rounded-pill border border-light bg-light">
                        <i className="ri-time-line me-2 text-muted"></i>
                        Créée le{" "}
                        {new Date(selectedUnit.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                        {selectedUnit.updated_at &&
                          selectedUnit.updated_at !==
                            selectedUnit.created_at && (
                            <span className="text-muted ms-2">
                              • Modifiée le{" "}
                              {new Date(
                                selectedUnit.updated_at
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Chargement...</span>
                  </div>
                  <p className="mt-2 mb-0">Chargement des détails...</p>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <div className="d-flex justify-content-between w-100">
                <Button
                  color="primary"
                  onClick={() => {
                    if (selectedUnit) {
                      handleOpenEditExistingModal(selectedUnit);
                      handleCloseUnitDetails();
                    }
                  }}
                  style={{ borderRadius: "50px" }}
                >
                  <i className="ri-pencil-line me-2"></i>
                  Modifier
                </Button>
                <Button
                  color="light"
                  onClick={handleCloseUnitDetails}
                  style={{ borderRadius: "50px" }}
                >
                  Fermer
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Unit;
