
// // src/hooks/useSubscription.js
// import { useMemo } from 'react';

// export const useSubscription = (user) => {
//   const subscriptionInfo = useMemo(() => {
//     if (!user?.abonnement) {
//       return {
//         hasActiveSubscription: false,
//         isPaidSubscription: false,
//         isSubscriptionExpired: true, // Nouveau
//         subscriptionModule: null,
//         subscriptionCategory: null,
//         canAddUsers: false,
//         canManagePermissions: false,
//         canModifyData: false, // Nouveau
//         canExportData: false, // Nouveau
//         canDeleteData: false // Nouveau
//       };
//     }

//     const { categorie_nom, module: subscriptionModule, statut, date_fin } = user.abonnement;
    
//     // Vérifier si l'abonnement est actif
//     const hasActiveSubscription = statut === 'actif';
//     const isSubscriptionExpired = !hasActiveSubscription || (date_fin && new Date(date_fin) < new Date());
    
//     // Déterminer si c'est un abonnement payant
//     const isPaidSubscription = useMemo(() => {
//       if (!hasActiveSubscription || isSubscriptionExpired) return false;
      
//       if (subscriptionModule === 'Inawoglobal') {
//         return true;
//       }
      
//       if (['InawoSales', 'InawoStock'].includes(subscriptionModule)) {
//         return ['Business', 'Professionnel'].includes(categorie_nom);
//       }
      
//       return false;
//     }, [hasActiveSubscription, isSubscriptionExpired, subscriptionModule, categorie_nom]);

//     // Permissions basées sur l'abonnement (selon le document)
//     const canAddUsers = isPaidSubscription && !isSubscriptionExpired && user?.type_utilisateur === 'Administrateur';
//     const canManagePermissions = isPaidSubscription && !isSubscriptionExpired && user?.type_utilisateur === 'Administrateur';
    
//     // Restrictions pour abonnement expiré
//     const canModifyData = !isSubscriptionExpired;
//     const canExportData = !isSubscriptionExpired;
//     const canDeleteData = !isSubscriptionExpired;

//     return {
//       hasActiveSubscription,
//       isPaidSubscription,
//       isSubscriptionExpired, // Important pour gérer les accès
//       subscriptionModule,
//       subscriptionCategory: categorie_nom,
//       canAddUsers,
//       canManagePermissions,
//       canModifyData,
//       canExportData,
//       canDeleteData,
//       subscription: user.abonnement
//     };
//   }, [user]);

//   return subscriptionInfo;
// };


// src/hooks/useSubscription.js
import { useMemo } from 'react';

export const useSubscription = (user) => {
  const subscriptionInfo = useMemo(() => {
    // Si l'utilisateur n'est pas encore chargé, ne pas considérer comme expiré
    // pour éviter d'afficher le modal prématurément
    if (!user) {
      return {
        hasActiveSubscription: false,
        isPaidSubscription: false,
        isSubscriptionExpired: false, // false car user pas encore chargé
        isLoading: true, // Indicateur de chargement
        subscriptionStatus: 'loading',
        daysRemaining: 0,
        subscriptionEndDate: null,
        subscriptionModule: null,
        subscriptionCategory: null,
        canAddUsers: false,
        canManagePermissions: false,
        canModifyData: true, // Permettre temporairement pendant le chargement
        canExportData: true,
        canDeleteData: true
      };
    }
    
    // Si l'utilisateur existe mais n'a pas d'abonnement
    if (!user.abonnement) {
      return {
        hasActiveSubscription: false,
        isPaidSubscription: false,
        isSubscriptionExpired: true,
        isLoading: false,
        subscriptionStatus: 'no_subscription',
        daysRemaining: 0,
        subscriptionEndDate: null,
        subscriptionModule: null,
        subscriptionCategory: null,
        canAddUsers: false,
        canManagePermissions: false,
        canModifyData: false,
        canExportData: false,
        canDeleteData: false
      };
    }

    const { categorie_nom, module: subscriptionModule, statut, date_fin, date_debut } = user.abonnement;
    
    // Vérifier si l'abonnement est actif
    const hasActiveSubscription = statut === 'actif';
    
    // Calculer les jours restants et statut
    const now = new Date();
    const endDate = date_fin ? new Date(date_fin) : null;
    const startDate = date_debut ? new Date(date_debut) : null;
    
    let daysRemaining = 0;
    let subscriptionStatus = 'active';
    let isSubscriptionExpired = !hasActiveSubscription;

    if (endDate) {
      const timeDiff = endDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysRemaining <= 0) {
        isSubscriptionExpired = true;
        subscriptionStatus = 'expired';
      } else if (daysRemaining <= 7) {
        subscriptionStatus = 'expiring_soon';
      } else {
        subscriptionStatus = 'active';
      }
    } else {
      // Si pas de date de fin, considérer comme actif
      daysRemaining = 999;
      subscriptionStatus = 'active';
      isSubscriptionExpired = !hasActiveSubscription;
    }

    // Vérifier aussi le statut texte
    if (statut !== 'actif') {
      isSubscriptionExpired = true;
      subscriptionStatus = 'expired';
    }

    // Déterminer si c'est un abonnement payant (calculé directement, pas de useMemo imbriqué)
    let isPaidSubscription = false;
    if (hasActiveSubscription && !isSubscriptionExpired) {
      if (subscriptionModule === 'Inawoglobal') {
        isPaidSubscription = true;
      } else if (['InawoSales', 'InawoStock'].includes(subscriptionModule)) {
        isPaidSubscription = ['Business', 'Professionnel'].includes(categorie_nom);
      }
    }

    // Permissions basées sur l'abonnement (selon le document)
    const canAddUsers = isPaidSubscription && !isSubscriptionExpired && user?.type_utilisateur === 'Administrateur';
    const canManagePermissions = isPaidSubscription && !isSubscriptionExpired && user?.type_utilisateur === 'Administrateur';
    
    // Restrictions pour abonnement expiré
    const canModifyData = !isSubscriptionExpired;
    const canExportData = !isSubscriptionExpired;
    const canDeleteData = !isSubscriptionExpired;

    return {
      hasActiveSubscription,
      isPaidSubscription,
      isSubscriptionExpired,
      isLoading: false,
      subscriptionStatus, // 'active', 'expiring_soon', 'expired', 'no_subscription'
      daysRemaining,
      subscriptionEndDate: endDate,
      subscriptionStartDate: startDate,
      subscriptionModule,
      subscriptionCategory: categorie_nom,
      canAddUsers,
      canManagePermissions,
      canModifyData,
      canExportData,
      canDeleteData,
      subscription: user.abonnement
    };
  }, [user]);

  return subscriptionInfo;
};