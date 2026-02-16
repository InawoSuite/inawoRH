/**
 * Contexte pour gérer les erreurs d'abonnement (403)
 * Permet d'afficher un modal global quand l'abonnement expire
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import subscriptionErrorService from '../Services/subscriptionErrorService';

const SubscriptionErrorContext = createContext();

export const useSubscriptionError = () => {
  const context = useContext(SubscriptionErrorContext);
  if (!context) {
    throw new Error('useSubscriptionError must be used within a SubscriptionErrorProvider');
  }
  return context;
};

export const SubscriptionErrorProvider = ({ children }) => {
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Afficher l'erreur d'abonnement
  const showSubscriptionError = useCallback((errorMessage) => {
    setSubscriptionError(errorMessage);
    setIsModalOpen(true);
  }, []);

  // S'abonner au service d'erreurs d'abonnement
  useEffect(() => {
    const unsubscribe = subscriptionErrorService.subscribe((message) => {
      showSubscriptionError(message);
    });
    
    return () => {
      unsubscribe();
    };
  }, [showSubscriptionError]);

  // Fermer le modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Optionnel: garder le message pour référence
    // setSubscriptionError(null);
  }, []);

  // Réinitialiser l'erreur
  const clearError = useCallback(() => {
    setSubscriptionError(null);
    setIsModalOpen(false);
  }, []);

  // Rediriger vers la page de renouvellement
  const goToRenewal = useCallback(() => {
    setIsModalOpen(false);
    // Redirection vers la page d'abonnement
    window.location.href = '/:entreprise/abonnement';
  }, []);

  const value = {
    subscriptionError,
    isModalOpen,
    showSubscriptionError,
    closeModal,
    clearError,
    goToRenewal,
  };

  return (
    <SubscriptionErrorContext.Provider value={value}>
      {children}
    </SubscriptionErrorContext.Provider>
  );
};

export default SubscriptionErrorContext;
