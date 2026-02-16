// src/components/Subscription/AddUserButton.js (version simplifiée)

import React, { useState } from 'react';
import { 
  Button, 
  Modal, 
  ModalBody, 
  Alert, 
  Card, 
  CardBody, 
  Badge,
  ListGroup,
  ListGroupItem 
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';

export const AddUserButton = ({ 
  onAddUser, 
  subscriptionModule, 
  subscriptionCategory,
  currentUserCount = 0,
  maxUsers = 1,
  disabled = false
}) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const navigate = useNavigate();
  
  const remainingSlots = Math.max(0, maxUsers - currentUserCount);
  const hasReachedLimit = remainingSlots <= 0;
  
  const handleClick = () => {
    if (hasReachedLimit) {
      setShowLimitModal(true);
      return;
    }
    
    onAddUser();
  };
  
  const renderLimitModalContent = () => {
    return (
      <div className="text-center">
        <div className="avatar-lg mx-auto mb-3">
          <div className="avatar-title bg-light text-warning display-3 rounded-circle">
            <i className="ri-user-unfollow-line"></i>
          </div>
        </div>
        
        <h4>Limite d'Utilisateurs Atteinte</h4>
        
        <Alert color="warning" className="text-start" style={{borderRadius: "20px"}}>
          <p className="mb-0">
            Vous avez atteint la limite de {maxUsers} utilisateur(s) avec votre 
            abonnement {subscriptionModule} - {subscriptionCategory}.
          </p>
        </Alert>

        <div className="mt-4">
          <h6>Votre abonnement actuel :</h6>
          <Card className="bg-light" style={{borderRadius: 20 }}>
            <CardBody className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Module:</strong> {subscriptionModule} <br />
                  <strong>Catégorie:</strong> {subscriptionCategory}
                </div>
                <Badge 
                  color="danger" 
                  className="ms-2" 
                  style={{ borderRadius: '20px', padding: '0.5em 1em' }}
                >
                  Limite atteinte
                </Badge>
              </div>
              <div className="mt-2 text-muted small">
                {currentUserCount} utilisateur(s) sur {maxUsers}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-4">
          <p className="text-muted">
            Pour ajouter plus d'utilisateurs, passez à une catégorie supérieure.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button color="warning" onClick={() => navigate(`/:entreprise/offres`)} className='rounded-pill'>
              Voir les offres supérieures
            </Button>
            <Button color="secondary" onClick={() => setShowLimitModal(false)} className='rounded-pill'>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button 
        color="info"
        style={{ borderRadius: "20px" }}
        onClick={handleClick}
        disabled={disabled || hasReachedLimit}
        title={hasReachedLimit ? `Limite de ${maxUsers} utilisateur(s) atteinte` : `Ajouter un utilisateur (${remainingSlots} restant(s))`}
      >
        <i className="ri-file-add-line me-1 align-bottom"></i>
        {hasReachedLimit ? 'Limite atteinte' : `Ajouter un utilisateur`}
        {/* {remainingSlots > 0 && ` (${remainingSlots})`} */}
      </Button>

      <Modal 
        isOpen={showLimitModal} 
        toggle={() => setShowLimitModal(false)} 
        centered 
        contentClassName="custom-rounded-modal"
      >
        <ModalBody className="p-4">
          {renderLimitModalContent()}
        </ModalBody>
      </Modal>
    </>
  );
};