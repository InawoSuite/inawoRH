// src/Components/Common/StockAlert.js
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Badge } from 'reactstrap';
// import { showWarning, showError } from '../../utils/ToastUtils'; // Utilisez votre système de toast
import { showWarning, showError } from '../../utils/toastManager';

const StockAlert = ({ 
  isOpen, 
  onClose, 
  items = [],
  onConfirm,
  onCancel,
  title = "Vérification de Stock"
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  // Calculer les totaux
  const totalDeficit = items.reduce((sum, item) => sum + (item.deficit || 0), 0);
  const totalRequested = items.reduce((sum, item) => sum + (item.requestedQuantity || 0), 0);
  const itemsWithDeficit = items.filter(item => !item.isAvailable);

  const handleConfirm = () => {
    setConfirmed(true);
    
    // Afficher un avertissement via votre système de toast
    if (itemsWithDeficit.length > 0) {
      showWarning(
        `Attention: ${itemsWithDeficit.length} produit(s) avec stock insuffisant`,
        { autoClose: 5000 }
      );
    }
    
    onConfirm && onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel && onCancel();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <div className="d-flex align-items-center gap-2">
          <i className="ri-error-warning-line text-warning"></i>
          <span>{title}</span>
          {itemsWithDeficit.length > 0 && (
            <Badge color="warning" pill className="ms-2">
              {itemsWithDeficit.length} problème(s)
            </Badge>
          )}
        </div>
      </ModalHeader>
      
      <ModalBody>
        <Alert color={itemsWithDeficit.length > 0 ? "warning" : "success"} className="mb-4">
          <div className="d-flex align-items-center">
            <i className={`ri-${itemsWithDeficit.length > 0 ? 'error-warning' : 'checkbox-circle'}-line me-2`}></i>
            <div>
              <h5 className="alert-heading mb-1">
                {itemsWithDeficit.length > 0 ? "Stock Insuffisant" : "Stock Disponible"}
              </h5>
              <p className="mb-0">
                {itemsWithDeficit.length > 0 
                  ? `${itemsWithDeficit.length} produit(s) n'ont pas assez de stock` 
                  : "Tous les produits ont suffisamment de stock"}
              </p>
            </div>
          </div>
        </Alert>

        {itemsWithDeficit.length > 0 && (
          <div className="mb-4">
            <h6 className="mb-3">Détails des stocks insuffisants:</h6>
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th className="text-end">Stock disponible</th>
                    <th className="text-end">Quantité demandée</th>
                    <th className="text-end">Manquant</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsWithDeficit.map((item, index) => (
                    <tr key={index} className="table-warning">
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="ri-close-circle-line text-danger me-2"></i>
                          <span>{item.itemName || `Produit ${item.productId}`}</span>
                        </div>
                      </td>
                      <td className="text-end">{item.currentStock}</td>
                      <td className="text-end">{item.requestedQuantity}</td>
                      <td className="text-end fw-bold text-danger">
                        {item.deficit || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-light">
                    <td className="fw-bold">Total</td>
                    <td></td>
                    <td className="text-end fw-bold">{totalRequested}</td>
                    <td className="text-end fw-bold text-danger">{totalDeficit}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {itemsWithDeficit.length === 0 && (
          <div className="text-center py-4">
            <i className="ri-checkbox-circle-line text-success" style={{ fontSize: '4rem' }}></i>
            <h5 className="text-success mt-3">Stock suffisant</h5>
            <p className="text-muted">Tous les produits sont disponibles en quantité suffisante.</p>
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            <i className="ri-information-line me-1"></i>
            {itemsWithDeficit.length > 0 
              ? "Vous pouvez choisir de continuer malgré le stock insuffisant."
              : "Vous pouvez procéder en toute sécurité."}
          </small>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button color="secondary" onClick={handleCancel} outline>
          <i className="ri-close-line me-1"></i>
          Annuler
        </Button>
        <Button 
          color={itemsWithDeficit.length > 0 ? "warning" : "primary"} 
          onClick={handleConfirm}
        >
          <i className={itemsWithDeficit.length > 0 ? "ri-error-warning-line" : "ri-check-line"}></i>
          {itemsWithDeficit.length > 0 ? "Continuer quand même" : "Continuer"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StockAlert;