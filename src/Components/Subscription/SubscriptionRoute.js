// src/components/Subscription/SubscriptionRoute.js
import React from 'react';
import { useSubscriptionCheck } from '../../Components/Hooks/useSubscriptionCheck';
import { Navigate } from 'react-router-dom';

export const SubscriptionRoute = ({ 
  children, 
  requiredFeature,
  fallbackPath = "/dashboard",
  fallbackMessage 
}) => {
  const { canAccessFeature, getUpgradeMessage } = useSubscriptionCheck();

  if (!canAccessFeature(requiredFeature)) {
    // Vous pouvez aussi afficher un toast ou stocker le message
    if (fallbackMessage) {
      localStorage.setItem('upgrade_message', getUpgradeMessage(requiredFeature));
    }
    
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

// Utilisation dans les routes
<Route 
  path="/gestion-utilisateurs" 
  element={
    <SubscriptionRoute requiredFeature="add_users" fallbackMessage>
      <UserManagement />
    </SubscriptionRoute>
  } 
/>