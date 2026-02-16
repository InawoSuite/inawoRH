// src/hooks/useApiNotification.js
import { useCallback } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

export const useApiNotification = () => {
  const { success, error, warning, info } = useNotification();

  const handleApiResponse = useCallback((response, options = {}) => {
    const {
      successMessage = 'Opération réussie',
      errorMessage = 'Une erreur est survenue',
      useToast = true,
      usePageAlert = false,
    } = options;

    if (response && response.ok) {
      if (successMessage) {
        success(successMessage, { useToast, usePageAlert });
      }
      return true;
    } else {
      const message = response?.error?.message || errorMessage;
      error(message, { useToast, usePageAlert });
      return false;
    }
  }, [success, error]);

  const handleApiError = useCallback((err, options = {}) => {
    const {
      errorMessage = 'Erreur de connexion',
      useToast = true,
      usePageAlert = true, // Par défaut, on montre une alerte page pour les erreurs
    } = options;

    const message = err?.message || errorMessage;
    error(message, { useToast, usePageAlert });
    
    return false;
  }, [error]);

  return {
    handleApiResponse,
    handleApiError,
    apiSuccess: success,
    apiError: error,
    apiWarning: warning,
    apiInfo: info
  };
};