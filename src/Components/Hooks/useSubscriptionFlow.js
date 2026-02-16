// src/Components/Hooks/useSubscriptionFlow.js
import { useState, useEffect } from "react";
import { useProfile } from "./UserHooks";

export const useSubscriptionFlow = () => {
  const { userProfile } = useProfile();
  const [subscriptionFlow, setSubscriptionFlow] = useState({
    showSubscriptionModal: false,
    showOnboarding: false,
    isLoading: true,
    subscriptionType: null // "paid" | "free" | "none"
  });

  useEffect(() => {
    const determineSubscriptionFlow = () => {
      if (!userProfile) return;

      const userAbonnement = userProfile?.abonnement;
      const hasCompletedOnboarding = userProfile?.onboarding_complete;

      let flow = {
        showSubscriptionModal: false,
        showOnboarding: false,
        isLoading: false,
        subscriptionType: "none"
      };

      if (userAbonnement) {
        const { module, categorie_nom } = userAbonnement;
        
        // Déterminer le type d'abonnement
        const isPaid = isSubscriptionPaid(module, categorie_nom);
        
        if (isPaid) {
          flow.subscriptionType = "paid";
          // Vérifier si le paiement a été effectué
          const hasPaid = checkIfUserHasPaid(userProfile.id);
          
          if (hasPaid && !hasCompletedOnboarding) {
            flow.showOnboarding = true;
          } else if (!hasPaid) {
            flow.showSubscriptionModal = true;
          }
        } else {
          flow.subscriptionType = "free";
          // Abonnement gratuit - onboarding direct
          if (!hasCompletedOnboarding) {
            flow.showOnboarding = true;
          }
        }
      } else {
        // Pas d'abonnement - besoin de souscrire
        flow.showSubscriptionModal = true;
      }

      setSubscriptionFlow(flow);
    };

    determineSubscriptionFlow();
  }, [userProfile]);

  const isSubscriptionPaid = (module, categorie) => {
    // Logique pour déterminer si l'abonnement est payant
    if ((module === "InawoSales" || module === "InawoStock") && 
        categorie === "Essentiel") {
      return false;
    }
    return true;
  };

  const checkIfUserHasPaid = (userId) => {
    // Implémentez la vérification du paiement
    // Retourne true si payé, false sinon
    return false; // À adapter
  };

  const handlePaymentSuccess = () => {
    setSubscriptionFlow(prev => ({
      ...prev,
      showSubscriptionModal: false,
      showOnboarding: true
    }));
  };

  const handleOnboardingComplete = () => {
    setSubscriptionFlow(prev => ({
      ...prev,
      showOnboarding: false
    }));
  };

  return {
    ...subscriptionFlow,
    handlePaymentSuccess,
    handleOnboardingComplete
  };
};