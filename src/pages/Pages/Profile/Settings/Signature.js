import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  CardBody,
  Col,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  Input,
  Badge,
  Spinner,
} from "reactstrap";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import TableContainer from "../../../../Components/Common/TableContainer";
import Pagination from "../../../../Components/Common/Pagination";
import Loader from "../../../../Components/Common/Loader";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";

const Signature = () => {
  // États
  const [signatures, setSignatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [isExportCSV, setIsExportCSV] = useState(false);

  // États pour les modals
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState(null);

  // États pour les formulaires
  const [formData, setFormData] = useState({
    nom: "",
    signature: null,
    utilisateur: null,
  });

  const { userProfile, token } = useProfile();
  const navigate = useNavigate();

  // Récupération des signatures depuis l'API
  const fetchSignatures = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${BaseUrl}/facture/signatures/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response && Array.isArray(response)) {
        setSignatures(response);
      } else {
        throw new Error("Format de données invalide");
      }
    } catch (err) {
      console.error("ERREUR API:", err);
      const errorMsg =
        err.response?.message ||
        err.response?.detail ||
        err.message ||
        "Erreur lors du chargement des signatures";
      setError(errorMsg);
      toast.error(errorMsg);
      setSignatures([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    if (token) {
      fetchSignatures();
    }
  }, [token]);

  // Fonctions pour les modals
  const toggle = () => setModal(!modal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleEditModal = () => setEditModal(!editModal);

  const openEditModal = (signature) => {
    setSelectedSignature(signature);
    setFormData({
      nom: signature.nom,
      signature: null, // Reset du fichier pour éviter de réuploader le même
    });
    setEditModal(true);
  };

  const openDeleteModal = (signature) => {
    setSelectedSignature(signature);
    setDeleteModal(true);
  };

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      if (files[0]) {
        const fileNameElement = document.getElementById(
          name === "signature" ? "file-name" : "edit-file-name"
        );
        if (fileNameElement) {
          fileNameElement.textContent = files[0].name;
        }
      }
    } else if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Redirection vers la page des signatures
  const redirectToSignatures = () => {
    navigate("/:entreprise/signature");
  };

  // Création d'une signature via API
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nom.trim()) {
        toast.error("Le nom est obligatoire");
        return;
      }

      if (!userProfile?.id) {
        toast.error("Utilisateur non connecté");
        return;
      }

      const signatureData = new FormData();
      signatureData.append("nom", formData.nom);
      signatureData.append("utilisateur", userProfile.id.toString()); // Convertir en string
      if (formData.signature) {
        signatureData.append("signature", formData.signature);
      }

      console.log("Données envoyées:", {
        nom: formData.nom,
        utilisateur: userProfile.id,
        signature: formData.signature ? formData.signature.nom : "Aucun"
      });

      const response = await axios.post(
        `${BaseUrl}/facture/signatures/`,
        signatureData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        await fetchSignatures();
        setModal(false);
        setFormData({ nom: "", signature: null, statut: true });
        toast.success("Signature créée avec succès");
        redirectToSignatures();
      } else {
        throw new Error("Erreur lors de la création");
      }
    } catch (err) {
      console.error("ERREUR CRÉATION:", err);
      const errorMsg =
        err.response?.utilisateur?.[0] ||
        err.response?.message ||
        err.response?.detail ||
        err.message ||
        "Erreur lors de la création de la signature";
      toast.error(errorMsg);
    }
  };

  // Modification d'une signature via API
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nom.trim()) {
        toast.error("Le nom est obligatoire");
        return;
      }

      const signatureData = new FormData();
      signatureData.append("nom", formData.nom);
      if (formData.signature) {
        signatureData.append("signature", formData.signature);
      }

      const response = await axios.put(
        `${BaseUrl}/facture/signatures/${selectedSignature.id}/`,
        signatureData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        await fetchSignatures();
        setEditModal(false);
        setSelectedSignature(null);
        setFormData({ nom: "", signature: null });
        toast.success("Signature modifiée avec succès");
        redirectToSignatures();
      } else {
        throw new Error("Erreur lors de la modification");
      }
    } catch (err) {
      console.error("ERREUR MODIFICATION:", err);
      const errorMsg =
        err.response?.message ||
        err.response?.detail ||
        err.message ||
        "Erreur lors de la modification de la signature";
      toast.error(errorMsg);
    }
  };

  // Suppression d'une signature via API
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BaseUrl}/facture/signatures/${selectedSignature.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        await fetchSignatures();
        setDeleteModal(false);
        setSelectedSignature(null);
        toast.success("Signature supprimée avec succès");
        redirectToSignatures();
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("ERREUR SUPPRESSION:", err);
      const errorMsg =
        err.response?.message ||
        err.response?.detail ||
        err.message ||
        "Erreur lors de la suppression de la signature";
      toast.error(errorMsg);
    }
  };

  // Fonction pour changer le statut via API
  const toggleStatut = async (id, currentStatut) => {
    try {
      const response = await axios.patch(
        `${BaseUrl}/facture/signatures/${id}/`,
        { statut: !currentStatut },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSignatures((prev) =>
          prev.map((sig) =>
            sig.id === id ? { ...sig, statut: !currentStatut } : sig
          )
        );
        toast.success("Statut modifié avec succès");
      } else {
        throw new Error("Erreur lors du changement de statut");
      }
    } catch (err) {
      console.error("ERREUR STATUT:", err);
      const errorMsg =
        err.response?.message ||
        err.response?.detail ||
        err.message ||
        "Erreur lors du changement de statut";
      toast.error(errorMsg);
    }
  };

  // Fonction pour la pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculs pour la pagination et filtrage
  const filteredData = useMemo(() => {
    if (!searchTerm) return signatures;

    return signatures.filter(
      (item) =>
        item.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.code &&
          item.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [signatures, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Colonnes pour TableContainer
  const columns = [
    {
      header: "#",
      accessorKey: "id",
      enableColumnFilter: false,
      cell: (cellProps) => {
        const index = signatures.findIndex(
          (item) => item.id === cellProps.row.original.id
        );
        return signatures.length - (indexOfFirstItem + index);
      },
    },
    {
      header: "Nom",
      accessorKey: "nom",
      enableColumnFilter: false,
      cell: (cellProps) => <strong>{cellProps.getValue()}</strong>,
    },
    {
      header: "Signature",
      accessorKey: "signature",
      enableColumnFilter: false,
      cell: (cellProps) => {
        const signature = cellProps.getValue();
        return signature ? (
          <img
            src={signature}
            alt={`Signature de ${cellProps.row.original.nom}`}
            style={{
              width: "150px",
              height: "auto",
              maxHeight: "80px",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "inline-block";
            }}
          />
        ) : (
          <Badge color="secondary">Aucune image</Badge>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableColumnFilter: false,
      cell: (cellProps) => (
        <div className="d-flex gap-2">
          <Link
            to="#"
            className="text-primary"
            onClick={() => openEditModal(cellProps.row.original)}
          >
            <i className="ri-pencil-fill fs-16"></i>
          </Link>
          <Link
            to="#"
            className="text-danger"
            onClick={() => openDeleteModal(cellProps.row.original)}
          >
            <i className="ri-delete-bin-5-fill fs-16"></i>
          </Link>
        </div>
      ),
    },
  ];

  document.title = "Signatures | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={filteredData}
      />
      <div className="page-content">
        <Container fluid>
          <ToastContainer position="top-right" autoClose={3000} />

          <BreadCrumb
            title="&nbsp; Signature"
            pageTitle={
              <>
                <i className="ri-sketching"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <SearchAndActionBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Chercher une signature..."
              showSearch={true}
              onAddClick={toggle}
              addButtonText="Ajouter une signature"
              addButtonIcon="ri-file-add-line"
              showAddButton={true}
              onExportClick={() => setIsExportCSV(true)}
              exportButtonText="Exporter"
              exportButtonIcon="ri-file-upload-line"
              showExportButton={true}
            />
          </Row>

          <div className="row">
            <Col lg={12}>
              {isLoading ? (
                <div className="d-flex justify-content-center my-5">
                  <Loader />
                </div>
              ) : filteredData.length > 0 ? (
                <TableContainer
                  columns={columns}
                  data={currentItems}
                  isGlobalFilter={false}
                  customPageSize={itemsPerPage}
                >
                  <Pagination
                    data={filteredData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    perPageData={itemsPerPage}
                    alwaysShow={true}
                    showInfo={true}
                  />
                </TableContainer>
              ) : (
                <EmptyDataCard
                  title="Aucune signature trouvée"
                  description="Commencez par créer une nouvelle signature"
                  actionButton={
                    <Button
                      color="success"
                      onClick={toggle}
                      style={{ borderRadius: "20px" }}
                    >
                      <i className="ri-file-add-line me-1"></i>
                      Ajouter une signature
                    </Button>
                  }
                />
              )}
            </Col>
          </div>
        </Container>
      </div>

      {/* Modal d'ajout */}
      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        contentClassName="custom-rounded-modal"
      >
        <div className="modal-content" style={{ borderRadius: "30px" }}>
          <div
            className="modal-header bg-info-subtle p-3"
            style={{ borderRadius: "30px 30px 0px 0px" }}
          >
            <h5 className="modal-title">Ajouter une signature</h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggle}
              aria-label="Close"
            ></button>
          </div>
          <Form
            className="tablelist-form"
            autoComplete="off"
            onSubmit={handleCreate}
          >
            <div className="modal-body">
              <input type="hidden" id="id-field" />
              <div className="row g-3">
                <div className="col-lg-12">
                  <div>
                    <Label for="name-field" className="form-label">
                      Nom
                    </Label>
                    <Input
                      type="text"
                      id="customername-field"
                      className="form-control"
                      placeholder="Entrer le nom"
                      required
                      style={{ borderRadius: "20px" }}
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div>
                    <div className="mb-3">
                      <Label for="signature-upload" className="form-label">
                        Signature
                      </Label>
                      <div
                        className="d-flex justify-content-center align-items-center border border-primary border-dashed p-4 text-center"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          minHeight: "100px",
                          borderRadius: "30px",
                        }}
                        onClick={() =>
                          document.getElementById("signature-file").click()
                        }
                      >
                        <i className="ri-cloud-upload-line me-2 fs-4"></i>
                        <span>Sélectionner ou déposer un fichier</span>
                        <Input
                          type="file"
                          id="signature-file"
                          className="form-control position-absolute opacity-0"
                          accept=".pdf,.png,.jpg,.jpeg"
                          name="signature"
                          onChange={handleChange}
                          style={{
                            cursor: "pointer",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: "30px",
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        <span id="file-name" className="text-muted">
                          {formData.signature
                            ? formData.signature.name
                            : "Le fichier doit être PDF, PNG, JPG ou JPEG"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="hstack gap-2 justify-content-end">
                <Button
                  type="button"
                  color="light"
                  onClick={toggle}
                  style={{ borderRadius: "20px" }}
                >
                  Fermer
                </Button>
                <Button
                  type="submit"
                  color="success"
                  id="add-btn"
                  style={{ borderRadius: "20px" }}
                >
                  Ajouter la signature
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal d'édition */}
      <Modal
        isOpen={editModal}
        toggle={toggleEditModal}
        centered
        className="modal-dialog-centered"
      >
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header bg-primary-subtle p-3 rounded-top-4">
            <h5 className="modal-title">Modifier la signature</h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggleEditModal}
              aria-label="Close"
            ></button>
          </div>
          <Form
            className="tablelist-form"
            autoComplete="off"
            onSubmit={handleUpdate}
          >
            <div className="modal-body">
              <input type="hidden" id="id-field" />
              <div className="row g-3">
                <div className="col-lg-12">
                  <div>
                    <Label for="edit-name-field" className="form-label">
                      Nom
                    </Label>
                    <Input
                      type="text"
                      id="edit-customername-field"
                      className="form-control"
                      placeholder="Entrer le nom"
                      required
                      style={{ borderRadius: "20px" }}
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div>
                    <div className="mb-3">
                      <Label for="edit-signature-upload" className="form-label">
                        Signature
                      </Label>
                      <div
                        className="d-flex justify-content-center align-items-center border border-primary border-dashed rounded-3 p-4 text-center"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          minHeight: "100px",
                        }}
                        onClick={() =>
                          document.getElementById("edit-signature-file").click()
                        }
                      >
                        <i className="ri-cloud-upload-line me-2 fs-4"></i>
                        <span>Sélectionner ou déposer un fichier</span>
                        <Input
                          type="file"
                          id="edit-signature-file"
                          className="form-control position-absolute opacity-0"
                          accept=".pdf,.png,.jpg,.jpeg"
                          name="signature"
                          onChange={handleChange}
                          style={{
                            cursor: "pointer",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        <span id="edit-file-name" className="text-muted">
                          {formData.signature
                            ? formData.signature.name
                            : `Fichier actuel: ${
                                selectedSignature?.signature || "Aucun"
                              }`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="hstack gap-2 justify-content-end">
                <Button
                  type="button"
                  color="light"
                  onClick={toggleEditModal}
                  style={{ borderRadius: "20px" }}
                >
                  Fermer
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  style={{ borderRadius: "20px" }}
                >
                  Modifier la signature
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal de suppression avec DeleteModal component */}
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDelete}
        title="Confirmer la suppression"
        description={
          <p className="text-muted">
            Êtes-vous sûr de vouloir supprimer la signature de{" "}
            <strong>{selectedSignature?.nom}</strong> ? Cette action est
            irréversible.
          </p>
        }
      />
    </React.Fragment>
  );
};

export default Signature;