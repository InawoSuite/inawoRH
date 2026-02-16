// src/hooks/useSubscriptionCheck.js
import { usePermissions } from '../../contexts/PermissionContext';

export const useSubscriptionCheck = () => {
  const permissions = usePermissions();

  // Vérifier si l'utilisateur peut accéder à une fonctionnalité spécifique
  const canAccessFeature = (feature) => {
    const featureRequirements = {
      'add_users': permissions.canAddUsers,
      'manage_permissions': permissions.canManagePermissions,
      'advanced_analytics': permissions.isPaidSubscription,
      'multiple_stores': permissions.isPaidSubscription && permissions.subscriptionCategory !== 'Essentiel',
      // Ajouter d'autres fonctionnalités au besoin
    };

    return featureRequirements[feature] || false;
  };

  // Obtenir le message d'upgrade pour une fonctionnalité
  const getUpgradeMessage = (feature) => {
    const messages = {
      'add_users': 'Veuillez vous abonner afin d\'ajouter des Collaborateurs',
      'manage_permissions': 'Un abonnement payant est requis pour gérer les permissions',
      'advanced_analytics': 'Fonctionnalité disponible avec les abonnements payants',
      'multiple_stores': 'Fonctionnalité disponible avec les abonnements Business et Professionnel'
    };

    return messages[feature] || 'Abonnement requis pour cette fonctionnalité';
  };

  return {
    ...permissions,
    canAccessFeature,
    getUpgradeMessage
  };
};