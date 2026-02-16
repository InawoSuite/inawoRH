import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Row,
  Col,
  Table,
} from "reactstrap";

const InvoiceDetailModal = ({ isOpen, toggle, depense, onEditClick }) => {
  if (!depense) return null;

  // Fonction de formatage de date simplifiée
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Format simple : JJ/MM/AAAA
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Formater les montants
  const formatMontant = (montant) => {
    if (montant === null || montant === undefined) return "0";
    return new Intl.NumberFormat('fr-FR').format(montant);
  };

  // Obtenir la couleur du badge
  const getBadgeColor = (value, type = "status") => {
    if (!value) return "secondary";
    
    const val = value.toString().toLowerCase();
    
    if (type === "status") {
      if (val.includes("payé") || val.includes("payer") || val === "paye") return "success";
      if (val.includes("terminé") || val.includes("terminer")) return "primary";
      if (val.includes("en cours")) return "warning";
      if (val.includes("non")) return "danger";
    }
    
    return "secondary";
  };

  // Formater le statut
  const formatStatus = (status) => {
    if (!status) return "Inconnu";
    const map = {
      "Paye": "Payé",
      "Payer": "Payé", 
      "Non paye": "Non payé",
      "Non payer": "Non payé",
      "En Cours": "En cours",
      "Terminer": "Terminé",
    };
    return map[status] || status;
  };

  const details = depense.detailsDepense || [];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered className="custom-rounded-modal scrollable-modal-content">
      <ModalHeader toggle={toggle}>
        <i className="ri-file-text-line me-2"></i>
        Détails dépense 
      </ModalHeader>
      
      <ModalBody>
        {/* Titre et statut */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">{depense.libelle_depense || "Dépense sans titre"}</h5>
          <Badge color={getBadgeColor(depense.status)} style={{borderRadius:70, fontSize:'0.75rem'}}>
            {formatStatus(depense.status)}
          </Badge>
        </div>

        {/* Informations principales */}
        <Row className="mb-4">
          <Col md={6}>
            <div className="card border">
              <div className="card-body">
                <h6 className="card-title text-muted">
                  <i className="ri-information-line me-2"></i>
                  Informations
                </h6>
                <div className="mb-2">
                  <small className="text-muted">Type</small>
                  <div className="fw-semibold">{depense.type_depense || "N/A"}</div>
                </div>
                <div className="mb-2" >
                  <small className="text-muted">Catégorie</small>
                  <div>
                    <Badge color="info" className="mt-1" style={{borderRadius:70, fontSize:'0.58rem'}}>
                      {depense.categorie || "Non classé"}
                    </Badge>
                  </div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Date dépense</small>
                  <div className="fw-semibold">{formatDate(depense.date_depense)}</div>
                </div>
                <div>
                  <small className="text-muted">Date réception</small>
                  <div className="fw-semibold">{formatDate(depense.date_reception)}</div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="card border">
              <div className="card-body">
                <h6 className="card-title text-muted">
                  <i className="ri-money-dollar-circle-line me-2"></i>
                  Montants
                </h6>
                <div className="mb-3">
                  <small className="text-muted">Total</small>
                  <h4 className="text-primary mb-0">{formatMontant(depense.montant_total)} </h4>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Payé</small>
                  <h5 className="text-success mb-0">{formatMontant(depense.montant_paye)} </h5>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Restant</small>
                  <h5 className="text-danger mb-0">{formatMontant(depense.montant_restant)} </h5>
                </div>
                <div>
                  <small className="text-muted">Statut paiement</small>
                  <div>
                    <Badge color={depense.statut_paiement === "Payer" ? "success" : "warning"} style={{borderRadius:70, fontSize:'0.58rem'}}>
                      {depense.statut_paiement || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Détails des articles */}
        {details.length > 0 ? (
          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="ri-list-check me-2"></i>
              Articles ({details.length})
            </h6>
            <div className="table-responsive">
              <Table bordered size="sm">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Article</th>
                    <th>Qté</th>
                    <th>Prix unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{detail.nom_depense || "Article"}</td>
                      <td>{detail.qte || 1}</td>
                      <td>{formatMontant(detail.prix)} </td>
                      <td className="fw-bold">{formatMontant(detail.prix_total || detail.prix * (detail.qte || 1))} </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            <i className="ri-information-line me-2"></i>
            Aucun détail d'article disponible
          </div>
        )}

        {/* Métadonnées */}
        <div className="text-muted small">
          <div className="d-flex justify-content-between">
            {/* <span>ID: {depense.id}</span> */}
            <span>Modifié: {formatDate(depense.updated_at)}</span>
          </div>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button color="secondary" onClick={toggle} className="rounded-pill">
          <i className="ri-close-line me-1"></i>
          Fermer
        </Button>
        {onEditClick && (
          <Button color="primary" onClick={onEditClick} className="rounded-pill">
            <i className="ri-pencil-line me-1"></i>
            Modifier
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceDetailModal;