// src/Components/Hooks/usePermissionCheck.js
import { useMemo } from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import { useProfile } from "./UserHooks";

export const usePermissionCheck = () => {
  const permissionContext = usePermissions();
  const { userProfile } = useProfile();

  // Fonction pour calculer la limite d'utilisateurs selon le pricing
  const calculateMaxUsers = (module, category) => {
    if (!module || !category) return 1;
    
    const moduleNorm = module.trim().toUpperCase();
    const categoryNorm = category.trim().toUpperCase();

    // INAWOSALES / Vente
    if (moduleNorm === 'VENTE' || moduleNorm === 'SALES' || moduleNorm === 'INAWOSALES') {
      switch (categoryNorm) {
        case 'ESSENTIEL': return 1;
        case 'PROFESSIONNEL': return 5;
        case 'BUSINESS': return 20;
        default: return 1;
      }
    }

    // INAWOSTOCK / Stock
    if (moduleNorm === 'STOCK' || moduleNorm === 'INAWOSTOCK') {
      switch (categoryNorm) {
        case 'ESSENTIEL': return 1;
        case 'PROFESSIONNEL': return 5;
        case 'BUSINESS': return 20;
        default: return 1;
      }
    }

    // INAWO GLOBAL
    if (moduleNorm.includes('GLOBAL')) {
      switch (categoryNorm) {
        case 'ESSENTIEL': return 5;
        case 'PROFESSIONNEL': return 10;
        case 'BUSINESS': return 25;
        default: return 5;
      }
    }

    return 1;
  };

  // Calcul des informations d'abonnement
  const subscriptionInfo = useMemo(() => {
    const abonnement = userProfile?.abonnement || {};
    const module = abonnement.module || 'Vente';
    const category = abonnement.categorie_nom || 'Essentiel';
    
    const maxUsers = calculateMaxUsers(module, category);
    
    return {
      module,
      category,
      maxUsers,
      isActive: abonnement.statut === 'actif' || abonnement.statut === 'active',
      isPaid: !(category.includes('Essentiel') && !module.includes('Global'))
    };
  }, [userProfile]);

  // Rôles utilisateur
  const userRoles = useMemo(() => {
    const profile = userProfile || {};
    
    return {
      isAdmin: profile.type_utilisateur === 'Administrateur',
      isCollaborator: profile.type_utilisateur === 'Collaborateur',
      isObserver: profile.type_utilisateur === 'Observateur',
      isSuperAdmin: profile.is_superuser || false,
      
      // Identification par structure (optionnel)
      hasEntreprise: !!profile.entreprise,
      isMainUser: !!profile.entreprise && !profile.hasOwnProperty('username'),
      
      userType: profile.type_utilisateur || 'Administrateur'
    };
  }, [userProfile]);

  // Fonctions de calcul des limites
  const getRemainingUserSlots = (teamList = []) => {
    const currentCount = teamList.length;
    const maxUsers = subscriptionInfo.maxUsers;
    return Math.max(0, maxUsers - currentCount);
  };

  const hasReachedLimit = (teamList = []) => {
    return getRemainingUserSlots(teamList) <= 0;
  };

  // Vérification si on peut ajouter des utilisateurs
  const canAddUsers = (teamList = []) => {
    // Seuls les administrateurs peuvent ajouter
    if (!userRoles.isAdmin) return false;
    
    // Vérifier si la limite n'est pas atteinte
    return !hasReachedLimit(teamList);
  };

  // Permissions de gestion
  const canManagePermissions = useMemo(() => {
    // Tous les administrateurs peuvent gérer les permissions
    if (userRoles.isAdmin) return true;
    
    // Sinon, vérifier les permissions spécifiques
    return permissionContext.can('permission', 'all');
  }, [userRoles.isAdmin, permissionContext]);

  return {
    // === IDENTITÉ ===
    ...userRoles,
    
    // === ABONNEMENT ===
    subscriptionModule: subscriptionInfo.module,
    subscriptionCategory: subscriptionInfo.category,
    maxUsers: subscriptionInfo.maxUsers,
    isPaidSubscription: subscriptionInfo.isPaid,
    
    // === FONCTIONS DE LIMITES (nécessitent teamList) ===
    getRemainingUserSlots,
    hasReachedLimit,
    canAddUsers,
    
    // === PERMISSIONS ===
    canManagePermissions,
    canManageUsers: userRoles.isAdmin,
    
    // === FONCTIONS UTILITAIRES ===
    
    // Obtenir un message de limite
    getLimitMessage: (teamList = []) => {
      const remaining = getRemainingUserSlots(teamList);
      const max = subscriptionInfo.maxUsers;
      const current = teamList.length;
      
      if (remaining <= 0) {
        return `Limite atteinte (${current}/${max} utilisateurs)`;
      }
      
      return `${remaining} place(s) restante(s) (${current}/${max})`;
    },
    
    // Obtenir un badge approprié
    getUserBadge: (teamList = []) => {
      const reachedLimit = hasReachedLimit(teamList);
      
      if (userRoles.isAdmin) {
        return {
          color: reachedLimit ? 'warning' : 'primary',
          icon: reachedLimit ? 'ri-alert-line' : 'ri-shield-line',
          text: 'Administrateur',
          description: reachedLimit ? 'Limite atteinte' : 'Gestion complète'
        };
      } else if (userRoles.isCollaborator) {
        return {
          color: 'info',
          icon: 'ri-team-line',
          text: 'Collaborateur',
          description: 'Droits selon permissions'
        };
      } else if (userRoles.isObserver) {
        return {
          color: 'secondary',
          icon: 'ri-eye-line',
          text: 'Observateur',
          description: 'Visualisation seulement'
        };
      }
      
      return {
        color: 'light',
        icon: 'ri-user-line',
        text: 'Utilisateur',
        description: ''
      };
    }
  };
};

export default usePermissionCheck;