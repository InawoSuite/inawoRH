// src/components/Permission/WithPermission.js
import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

export const WithPermission = ({ 
  permission, 
  module, 
  action, 
  children, 
  fallback = null 
}) => {
  const { can, hasPermission } = usePermissions();

  const hasAccess = permission 
    ? hasPermission(permission) 
    : can(module, action);

  return hasAccess ? children : fallback;
};

// Composant pour protéger les routes
export const ProtectedRoute = ({ 
  module, 
  action, 
  permission, 
  children, 
  unauthorizedComponent 
}) => {
  const { can, hasPermission } = usePermissions();

  const hasAccess = permission 
    ? hasPermission(permission) 
    : can(module, action);

  if (!hasAccess) {
    return unauthorizedComponent || (
      <div className="alert alert-danger">
        <h4>Accès refusé</h4>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.</p>
      </div>
    );
  }

  return children;
};

// Composant pour cacher/montrer des éléments UI
export const ShowIf = ({ 
  condition, 
  permission, 
  module, 
  action, 
  children 
}) => {
  const { can, hasPermission } = usePermissions();

  let hasAccess = condition;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (module && action) {
    hasAccess = can(module, action);
  }

  return hasAccess ? children : null;
};