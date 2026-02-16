// src/Components/Common/SubscriptionAlert.js
import React, { useState } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const SubscriptionAlert = ({ subscription, onClose }) => {
  const { 
    isSubscriptionExpired, 
    subscriptionStatus, 
    daysRemaining,
    subscriptionCategory,
    subscriptionModule
  } = subscription;

  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || (!isSubscriptionExpired && subscriptionStatus !== 'expiring_soon')) {
    return null;
  }

  // Notification d'expiration imminente (7 jours ou moins)
  if (subscriptionStatus === 'expiring_soon') {
    return (
      <Alert 
        color="warning" 
        className="d-flex align-items-center justify-content-between mb-0 border-0 rounded-0"
        style={{ 
          backgroundColor: '#fff3cd', 
          borderBottom: '2px solid #ffc107'
        }}
      >
        <div className="d-flex align-items-center flex-grow-1">
          <i className="ri-alarm-warning-line me-3 fs-18 text-warning"></i>
          <div className="flex-grow-1">
            <strong className="text-warning">Votre abonnement {subscriptionCategory} expire bientôt !</strong>
            <div className="small text-muted">
              Il reste <strong>{daysRemaining} jour(s)</strong> avant l'expiration de votre abonnement <strong>{subscriptionModule}</strong>. 
              Renouvelez maintenant pour continuer à bénéficier de toutes les fonctionnalités.
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Button 
            color="warning" 
            size="sm" 
            tag={Link} 
            to="/abonnement"
            className="me-2"
          >
            <i className="ri-refresh-line me-1"></i>
            Renouveler
          </Button>
          <Button 
            color="link" 
            size="sm" 
            onClick={handleClose}
            className="text-warning p-0"
            style={{ width: '24px', height: '24px' }}
          >
            <i className="ri-close-line"></i>
          </Button>
        </div>
      </Alert>
    );
  }

  // Notification d'abonnement expiré
  if (isSubscriptionExpired) {
    return (
      <Alert 
        color="danger" 
        className="d-flex align-items-center justify-content-between mb-0 border-0 rounded-0"
        style={{ 
          backgroundColor: '#f8d7da', 
          borderBottom: '2px solid #dc3545'
        }}
      >
        <div className="d-flex align-items-center flex-grow-1">
          <i className="ri-error-warning-line me-3 fs-18 text-danger"></i>
          <div className="flex-grow-1">
            <strong className="text-danger">Votre abonnement a expiré !</strong>
            <div className="small text-muted">
              Votre abonnement <strong>{subscriptionModule} - {subscriptionCategory}</strong> a expiré. 
              Certaines fonctionnalités sont désactivées. Veuillez vous réabonner pour retrouver l'accès complet.
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Button 
            color="danger" 
            size="sm" 
            tag={Link} 
            to="/abonnement"
            className="me-2"
          >
            <i className="ri-star-s-line me-1"></i>
            Se réabonner
          </Button>
          <Button 
            color="link" 
            size="sm" 
            onClick={handleClose}
            className="text-danger p-0"
            style={{ width: '24px', height: '24px' }}
          >
            <i className="ri-close-line"></i>
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
};

export default SubscriptionAlert;