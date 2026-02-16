// src/Components/Common/SubscriptionRestrictionMessage.js
import React from 'react';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

const SubscriptionRestrictionMessage = ({ actionType = "modifier" }) => {
  const actions = {
    add: "ajouter",
    edit: "modifier", 
    delete: "supprimer",
    export: "exporter",
    modify: "modifier"
  };

  const actionText = actions[actionType] || actionType;

  return (
    <Alert color="warning" className="mb-3">
      <div className="d-flex align-items-center">
        <i className="ri-error-warning-line me-2"></i>
        <div>
          <strong>Abonnement expiré</strong>
          <div className="small">
            Vous ne pouvez pas {actionText} les données car votre abonnement a expiré.{' '}
            <Link to="/abonnement" className="fw-bold">
              Réabonnez-vous pour retrouver cette fonctionnalité
            </Link>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default SubscriptionRestrictionMessage;