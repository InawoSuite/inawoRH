// src/Components/Common/AccessRestriction.js
import React from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const AccessRestriction = ({ 
  actionType = "cette action", 
  showUpgradeButton = true,
  children 
}) => {
  return (
    <div className="access-restriction-container">
      <Alert color="warning" className="text-center">
        <div className="d-flex flex-column align-items-center">
          <i className="ri-time-line display-4 text-warning mb-3"></i>
          <h5 className="alert-heading">Accès restreint</h5>
          <p className="mb-3">
            Votre période d'essai est terminée. Pour {actionType}, veuillez souscrire à un abonnement.
          </p>
          {showUpgradeButton && (
            <div className="d-flex gap-2">
              <Button 
                color="primary" 
                tag={Link}
                to="/:entreprise/abonnement"
                style={{ borderRadius: '70px' }}
              >
                <i className="ri-rocket-line me-2"></i>
                Souscrire maintenant
              </Button>
              <Button 
                color="outline-primary" 
                tag={Link}
                // to="/pricing"
                onClick={() => setShowPricing(true)}
                style={{ borderRadius: '70px' }}
              >
                <i className="ri-information-line me-2"></i>
                Voir les formules
              </Button>
            </div>
          )}
        </div>
      </Alert>
      {children}
    </div>
  );
};

export default AccessRestriction;