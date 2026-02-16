// src/Components/Hooks/usePermissions.js
import { useState, useEffect, useCallback } from 'react';
import { useProfile } from './UserHooks';

export const usePermissions = () => {
  const { userProfile } = useProfile();
  const [userPermissions, setUserPermissions] = useState({
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    isTrialActive: true,
    trialDaysLeft: 21,
    isSubscriptionActive: true
  });

  // Fonction pour vérifier si l'utilisateur est en période d'essai
  const checkTrialStatus = useCallback(() => {
    if (!userProfile?.abonnement) return;

    const { categorie_nom, date_debut, date_fin, statut } = userProfile.abonnement;
    
    // Vérifier si c'est une formule Essentiel avec montant 0 (période d'essai)
    const isEssentielTrial = categorie_nom === "Essentiel" && userProfile.abonnement.montant_payer === 0;
    
    if (isEssentielTrial) {
      const today = new Date();
      const endDate = new Date(date_fin);
      const timeDiff = endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      const isTrialActive = daysLeft > 0 && statut === "actif";
      
      setUserPermissions(prev => ({
        ...prev,
        isTrialActive,
        trialDaysLeft: Math.max(0, daysLeft),
        canCreate: isTrialActive,
        canEdit: isTrialActive,
        canDelete: isTrialActive,
        isSubscriptionActive: isTrialActive
      }));
    } else {
      // Pour les abonnements payants ou autres catégories
      const isActive = statut === "actif";
      setUserPermissions(prev => ({
        ...prev,
        isTrialActive: false,
        trialDaysLeft: 0,
        canCreate: isActive,
        canEdit: isActive,
        canDelete: isActive,
        isSubscriptionActive: isActive
      }));
    }
  }, [userProfile]);

  useEffect(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  return userPermissions;
};