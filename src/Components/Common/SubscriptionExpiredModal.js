/**
 * Modal d'erreur d'abonnement expiré
 * S'affiche globalement quand une erreur 403 liée à l'abonnement est détectée
 */
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useSubscriptionError } from '../../contexts/SubscriptionErrorContext';
import { useTranslation } from 'react-i18next';

const SubscriptionExpiredModal = () => {
  const { t } = useTranslation();
  const { isModalOpen, subscriptionError, closeModal, goToRenewal } = useSubscriptionError();

  return (
    <Modal 
      isOpen={isModalOpen} 
      toggle={closeModal} 
      centered
      className="subscription-expired-modal"
      contentClassName="custom-rounded-modal"
    >
      <ModalHeader 
        toggle={closeModal}
        className="bg-warning-subtle border-0 rounded-top-4"
      >
        <i className="ri-error-warning-line text-warning me-2 fs-4"></i>
        {t('Abonnement expiré')}
      </ModalHeader>
      
      <ModalBody className="text-center py-2">
        <div className="mb-2">
          <div 
            className="avatar-lg mx-auto rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            <i className="ri-calendar-close-line text-warning" style={{ fontSize: '25px' }}></i>
          </div>
        </div>
        
        <h5>{t('Votre abonnement a expiré')}</h5>
        
        <p className="text-muted mb-0">
          {subscriptionError || t('Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser toutes les fonctionnalités.')}
        </p>
        
        <div className="mt-2 p-3 bg-light rounded">
          <p className="mb-0 text-muted small">
            <i className="ri-information-line me-1"></i>
            {t('Vous pouvez toujours consulter vos données en lecture seule.')}
          </p>
        </div>
      </ModalBody>
      
      <ModalFooter className="border-0 justify-content-center gap-2">
        <Button 
          color="light" 
          onClick={closeModal}
          className="px-4 rounded-pill"
        >
          {t('Plus tard')}
        </Button>
        <Button 
          color="warning" 
          onClick={goToRenewal}
          className="px-4 rounded-pill"
        >
          <i className="ri-refresh-line me-1"></i>
          {t('Renouveler maintenant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SubscriptionExpiredModal;
