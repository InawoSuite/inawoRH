// src/components/Permission/SubscriptionGuard.js
import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

export const SubscriptionGuard = ({ 
  children, 
  fallback = null,
  requirePaidSubscription = false,
  requireActiveSubscription = true,
  allowReadOnly = false
}) => {
  const { 
    isSubscriptionExpired, 
    isPaidSubscription, 
    hasActiveSubscription 
  } = usePermissions();

  let hasAccess = true;

  if (requireActiveSubscription && !hasActiveSubscription) {
    hasAccess = false;
  }

  if (requirePaidSubscription && !isPaidSubscription) {
    hasAccess = false;
  }

  if (isSubscriptionExpired && !allowReadOnly) {
    hasAccess = false;
  }

  if (!hasAccess && fallback) {
    return fallback;
  }

  if (!hasAccess) {
    return (
      <div className="alert alert-warning">
        <h4>Fonctionnalité limitée</h4>
        <p>
          {isSubscriptionExpired 
            ? "Votre abonnement a expiré. Veuillez le renouveler pour accéder à toutes les fonctionnalités."
            : "Un abonnement payant est requis pour cette fonctionnalité."
          }
        </p>
      </div>
    );
  }

  return children;
};

// Utilisation combinée des permissions et abonnement
export const WithPermissionAndSubscription = ({ 
  children, 
  permission, 
  module, 
  action, 
  requirePaidSubscription = false,
  fallback = null 
}) => {
  const { can, hasPermission } = usePermissions();

  const hasAccess = permission 
    ? hasPermission(permission) 
    : can(module, action);

  if (!hasAccess) {
    return fallback;
  }

  return (
    <SubscriptionGuard 
      requirePaidSubscription={requirePaidSubscription}
      fallback={fallback}
    >
      {children}
    </SubscriptionGuard>
  );
};