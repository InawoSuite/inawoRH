/**
 * Hook pour protéger les actions d'ajout/modification/suppression
 * Vérifie l'abonnement avant d'exécuter une action et affiche le modal si expiré
 */
import { useCallback } from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import { useSubscriptionError } from '../../contexts/SubscriptionErrorContext';

/**
 * Hook useSubscriptionGuard
 * 
 * @example
 * const { guardAction, canPerformAction, isExpired } = useSubscriptionGuard();
 * 
 * // Utilisation simple - vérifie et affiche le modal si expiré
 * const handleAdd = () => {
 *   if (!guardAction('add')) return;
 *   // ... logique d'ajout
 * };
 * 
 * // Ou avec une fonction callback
 * const handleEdit = guardAction('edit', () => {
 *   // ... logique de modification
 * });
 */
export const useSubscriptionGuard = () => {
  const { isSubscriptionExpired, canModifyData, canDeleteData, isLoading, subscriptionStatus } = usePermissions();
  const { showSubscriptionError } = useSubscriptionError();

  /**
   * Messages personnalisés par type d'action
   */
  const actionMessages = {
    add: "Votre abonnement a expiré. Vous ne pouvez pas ajouter de nouvelles données. Veuillez renouveler votre abonnement.",
    edit: "Votre abonnement a expiré. Vous ne pouvez pas modifier les données. Veuillez renouveler votre abonnement.",
    delete: "Votre abonnement a expiré. Vous ne pouvez pas supprimer de données. Veuillez renouveler votre abonnement.",
    create: "Votre abonnement a expiré. Vous ne pouvez pas créer de nouvelles entrées. Veuillez renouveler votre abonnement.",
    update: "Votre abonnement a expiré. Vous ne pouvez pas mettre à jour les données. Veuillez renouveler votre abonnement.",
    export: "Votre abonnement a expiré. Vous ne pouvez pas exporter les données. Veuillez renouveler votre abonnement.",
    default: "Votre abonnement a expiré. Veuillez le renouveler pour continuer."
  };

  /**
   * Vérifie si une action peut être effectuée
   * @param {string} actionType - 'add' | 'edit' | 'delete' | 'create' | 'update' | 'export'
   * @returns {boolean}
   */
  const canPerformAction = useCallback((actionType = 'default') => {
    // Si en cours de chargement, autoriser temporairement
    if (isLoading || subscriptionStatus === 'loading') {
      return true;
    }
    
    if (isSubscriptionExpired) return false;
    
    switch (actionType) {
      case 'add':
      case 'create':
      case 'edit':
      case 'update':
        return canModifyData;
      case 'delete':
        return canDeleteData;
      default:
        return !isSubscriptionExpired;
    }
  }, [isSubscriptionExpired, canModifyData, canDeleteData, isLoading, subscriptionStatus]);

  /**
   * Protège une action - affiche le modal si l'abonnement est expiré
   * @param {string} actionType - Type d'action ('add', 'edit', 'delete', etc.)
   * @param {Function} [callback] - Fonction à exécuter si l'action est autorisée
   * @returns {boolean|Function} - false si bloqué, true ou le résultat du callback sinon
   */
  const guardAction = useCallback((actionType = 'default', callback = null) => {
    // Vérifier si l'action est autorisée
    if (!canPerformAction(actionType)) {
      // Afficher le modal avec le message approprié
      const message = actionMessages[actionType] || actionMessages.default;
      showSubscriptionError(message);
      return false;
    }

    // Si un callback est fourni, l'exécuter
    if (callback && typeof callback === 'function') {
      return callback();
    }

    return true;
  }, [canPerformAction, showSubscriptionError]);

  /**
   * Wrapper pour les handlers d'événements
   * @param {string} actionType - Type d'action
   * @param {Function} handler - Le handler original
   * @returns {Function} - Handler protégé
   */
  const createGuardedHandler = useCallback((actionType, handler) => {
    return (...args) => {
      if (!canPerformAction(actionType)) {
        const message = actionMessages[actionType] || actionMessages.default;
        showSubscriptionError(message);
        return;
      }
      return handler(...args);
    };
  }, [canPerformAction, showSubscriptionError]);

  /**
   * Vérification rapide avant navigation vers une page d'ajout/modification
   * @param {string} actionType - Type d'action
   * @returns {boolean}
   */
  const checkBeforeNavigate = useCallback((actionType = 'add') => {
    return guardAction(actionType);
  }, [guardAction]);

  return {
    // État
    isExpired: isSubscriptionExpired,
    canModify: canModifyData,
    canDelete: canDeleteData,
    
    // Méthodes
    canPerformAction,
    guardAction,
    createGuardedHandler,
    checkBeforeNavigate,
    
    // Raccourcis pratiques
    guardAdd: (callback) => guardAction('add', callback),
    guardEdit: (callback) => guardAction('edit', callback),
    guardDelete: (callback) => guardAction('delete', callback),
    guardCreate: (callback) => guardAction('create', callback),
  };
};

export default useSubscriptionGuard;
