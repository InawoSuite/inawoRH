// // src/contexts/PermissionContext.js (version améliorée)
// import React, { createContext, useContext, useMemo } from 'react';
// import { useSubscription } from '../Components/Hooks/useSubscription';

// const PermissionContext = createContext();

// export const usePermissions = () => {
//   const context = useContext(PermissionContext);
//   if (!context) {
//     throw new Error('usePermissions must be used within a PermissionProvider');
//   }
//   return context;
// };

// export const PermissionProvider = ({ children, user }) => {
//   const subscription = useSubscription(user);

//   // Types d'utilisateurs selon le document
//   const isAdmin = useMemo(() => {
//     return user?.type_utilisateur === 'Administrateur';
//   }, [user]);

//   const isCollaborator = useMemo(() => {
//     return user?.type_utilisateur === 'Collaborateur';
//   }, [user]);

//   const isObserver = useMemo(() => {
//     return user?.type_utilisateur === 'Observateur';
//   }, [user]);

//   // Récupérer les permissions depuis l'utilisateur
//   const userPermissions = useMemo(() => {
//     return user?.permissions || user?.groupes?.flatMap(groupe => groupe.permissions) || [];
//   }, [user]);

//   // Vérifier si l'utilisateur a une permission spécifique
//   const hasPermission = (permission) => {
//     if (isAdmin && !subscription.isSubscriptionExpired) return true;
//     return userPermissions.includes(permission);
//   };

//   // Vérifications de permissions avec gestion des abonnements expirés
//   const can = (module, action) => {
//     // Si abonnement expiré, interdire les actions de modification
//     if (subscription.isSubscriptionExpired && ['add', 'change', 'delete', 'all'].includes(action)) {
//       return false;
//     }

//     const permission = `${module}_${action}`;
//     return hasPermission(permission) || hasPermission(`${module}_all`);
//   };

//   // Vérifier l'accès en lecture seule (même avec abonnement expiré)
//   const canView = (module) => {
//     return hasPermission(`${module}_view`) || hasPermission(`${module}_all`);
//   };

//   // Vérifier si l'utilisateur a au moins une permission dans un module
//   const hasModuleAccess = (moduleId) => {
//     if (isAdmin && !subscription.isSubscriptionExpired) return true;
    
//     const modulePermissions = userPermissions.filter(perm => 
//       perm.startsWith(`${moduleId}_`)
//     );
//     return modulePermissions.length > 0;
//   };

//   // Permissions spéciales selon le rôle
//   const canConfigureSoftware = isAdmin && !subscription.isSubscriptionExpired;
//   const canManageSubscriptions = isAdmin && !subscription.isSubscriptionExpired;
//   const canManageUsers = isAdmin && !subscription.isSubscriptionExpired;
//   const canViewAllData = isAdmin; // Même avec abonnement expiré
//   const canViewFinancialReports = isAdmin; // Même avec abonnement expiré
//   const canViewActivityLogs = isAdmin; // Même avec abonnement expiré

//   // Pour collaborateurs et observateurs
//   const canOnlyViewAssignedData = isCollaborator || isObserver;
//   const canOnlyViewOwnReports = isCollaborator;

//   // Filtrer les modules accessibles
//   const getAccessibleModules = (allModules) => {
//     return allModules.filter(module => {
//       // Vérifier les permissions utilisateur
//       const hasUserAccess = hasModuleAccess(module.id);
      
//       return isAdmin || hasUserAccess;
//     });
//   };

//   const value = {
//     // Types d'utilisateurs
//     isAdmin,
//     isCollaborator,
//     isObserver,
    
//     // Informations d'abonnement
//     ...subscription,
    
//     // Permissions de base
//     hasPermission,
//     hasModuleAccess,
//     can,
//     canView,
//     getAccessibleModules,
//     userPermissions,
    
//     // Permissions spéciales (selon document)
//     canConfigureSoftware,
//     canManageSubscriptions,
//     canManageUsers,
//     canViewAllData,
//     canViewFinancialReports,
//     canViewActivityLogs,
//     canOnlyViewAssignedData,
//     canOnlyViewOwnReports,
    
//     // Données utilisateur
//     userType: user?.type_utilisateur,
//     userData: user
//   };

//   return (
//     <PermissionContext.Provider value={value}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };


// src/contexts/PermissionContext.js (version corrigée)
import React, { createContext, useContext, useMemo } from 'react';
import { useSubscription } from '../Components/Hooks/useSubscription';

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children, user }) => {
  const subscription = useSubscription(user);

  // Types d'utilisateurs selon le document
  const isAdmin = useMemo(() => {
    return user?.type_utilisateur === 'Administrateur';
  }, [user]);

  const isCollaborator = useMemo(() => {
    return user?.type_utilisateur === 'Collaborateur';
  }, [user]);

  const isObserver = useMemo(() => {
    return user?.type_utilisateur === 'Observateur';
  }, [user]);

 // ✅ IDENTIFICATION DE L'ADMINISTRATEUR PRINCIPAL
const isMainAdmin = useMemo(() => {
  // L'admin principal a un abonnement mais PAS de tableau permissions
  return user?.abonnement && !user?.permissions;
}, [user]);

  // Récupérer les permissions depuis l'utilisateur
  // ✅ S'assurer que c'est toujours un tableau
  const userPermissions = useMemo(() => {
    const perms = user?.permissions;
    // Si c'est déjà un tableau, le retourner
    if (Array.isArray(perms)) {
      return perms;
    }
    // Si c'est un objet avec des valeurs, extraire les valeurs
    if (perms && typeof perms === 'object') {
      return Object.values(perms).flat().filter(Boolean);
    }
    // Sinon retourner un tableau vide
    return [];
  }, [user]);

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission) => {
    // ✅ L'administrateur principal a TOUS les droits
    if (isMainAdmin) {
      return true;
    }
    
    // ✅ Vérification de sécurité que userPermissions est un tableau
    if (!Array.isArray(userPermissions)) {
      return false;
    }
    
    // Pour les utilisateurs créés, vérifier les permissions explicites
    return userPermissions.includes(permission);
  };

 // Dans la fonction can()
const can = (module, action) => {
  // ✅ Admin principal a tous les droits (sauf si abonnement expiré pour les modifications)
  if (isMainAdmin) {
    // Pour les actions de visualisation, toujours autoriser
    if (action === 'view') {
      return true;
    }
    // Pour les autres actions, vérifier l'abonnement
    return !subscription.isSubscriptionExpired;
  }

  // Si abonnement expiré, interdire les actions de modification
  if (subscription.isSubscriptionExpired && ['add', 'change', 'delete', 'all'].includes(action)) {
    return false;
  }

  const permission = `${module}_${action}`;
  return hasPermission(permission) || hasPermission(`${module}_all`);
};
  // Vérifier l'accès en lecture seule
  const canView = (module) => {
    // ✅ Admin principal peut toujours voir
    if (isMainAdmin) return true;
    
    return hasPermission(`${module}_view`) || hasPermission(`${module}_all`);
  };

  // Vérifier si l'utilisateur a au moins une permission dans un module
  const hasModuleAccess = (moduleId) => {
    // ✅ Admin principal a accès à tous les modules
    if (isMainAdmin) return true;
    
    // ✅ Vérification de sécurité que userPermissions est un tableau
    if (!Array.isArray(userPermissions)) {
      return false;
    }
    
    const modulePermissions = userPermissions.filter(perm => 
      typeof perm === 'string' && perm.startsWith(`${moduleId}_`)
    );
    return modulePermissions.length > 0;
  };

  // Permissions spéciales 
  const canConfigureSoftware = isMainAdmin;
  const canManageSubscriptions = isMainAdmin;
  const canManageUsers = isMainAdmin;
  const canViewAllData = isMainAdmin || hasPermission('data_view_all');
  const canViewFinancialReports = isMainAdmin || hasPermission('reports_financial_view');
  const canViewActivityLogs = isMainAdmin || hasPermission('logs_activity_view');

  // Pour collaborateurs et observateurs créés
  const canOnlyViewAssignedData = (isCollaborator || isObserver) && !isMainAdmin;
  const canOnlyViewOwnReports = (isCollaborator || isObserver) && !isMainAdmin;

  // Filtrer les modules accessibles
  const getAccessibleModules = (allModules) => {
    return allModules.filter(module => {
      // ✅ Admin principal voit tous les modules
      if (isMainAdmin) return true;
      
      // Vérifier les permissions utilisateur pour les autres
      return hasModuleAccess(module.id);
    });
  };

  const value = {
    // Types d'utilisateurs
    isAdmin,
    isCollaborator,
    isObserver,
    isMainAdmin, // ✅ Nouvelle propriété
    
    // Informations d'abonnement
    ...subscription,
    
    // Permissions de base
    hasPermission,
    hasModuleAccess,
    can,
    canView,
    getAccessibleModules,
    userPermissions,
    
    // Permissions spéciales
    canConfigureSoftware,
    canManageSubscriptions,
    canManageUsers,
    canViewAllData,
    canViewFinancialReports,
    canViewActivityLogs,
    canOnlyViewAssignedData,
    canOnlyViewOwnReports,
    
    // Données utilisateur
    userType: user?.type_utilisateur,
    userData: user
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};