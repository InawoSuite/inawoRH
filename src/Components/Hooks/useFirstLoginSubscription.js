// // src/hooks/useFirstLoginSubscription.js
// import { useState, useEffect } from 'react';

// export const useFirstLoginSubscription = (userProfile) => {
//   const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
//   const [hasChecked, setHasChecked] = useState(false);

//   useEffect(() => {
//     if (!userProfile?.id) {
//       setHasChecked(true);
//       return;

//     }

//     const checkSubscriptionEligibility = () => {
//       console.log("Vérification de l'éligibilité pour l'abonnement...", userProfile);
      
//       const { abonnement } = userProfile;
      
//       // Si pas d'abonnement, on ne montre pas le modal
//       if (!abonnement) {
//         console.log("Aucun abonnement trouvé");
//         setHasChecked(true);
//         return;
//       }

//       const { module, categorie_nom, montant_payer, statut } = abonnement;

//       // Vérifier si c'est la première connexion (pas de paiement effectué)
//       const isFirstLogin = (!montant_payer || montant_payer === 0) && statut === 'actif';

//       console.log("Infos abonnement:", { module, categorie_nom, montant_payer, statut, isFirstLogin });

//       if (!isFirstLogin) {
//         console.log("Pas d'éligibilité: ce n'est pas une première connexion");
//         setHasChecked(true);
//         return;
//       }

//       // Vérifier l'éligibilité selon les critères
//       const isEligible = 
//         // InawoGlobal avec n'importe quelle catégorie
//         (module === 'InawoGlobal' && ['Essentiel', 'Business', 'Professionnel'].includes(categorie_nom)) ||
//         // InawoSales ou InawoStock avec Business ou Professionnel
//         (['InawoSales', 'InawoStock'].includes(module) && ['Business', 'Professionnel'].includes(categorie_nom));

//       console.log("Éligibilité calculée:", isEligible);

//       if (isEligible) {
//         // Vérifier si on a déjà montré le modal pour cette session
//         const hasSeenModal = sessionStorage.getItem(`subscriptionModalShown_${userProfile.id}`);
        
//         if (!hasSeenModal) {
//           console.log("Affichage du modal d'abonnement");
//           setShowSubscriptionModal(true);
//           sessionStorage.setItem(`subscriptionModalShown_${userProfile.id}`, 'true');
//         } else {
//           console.log("Modal déjà affiché pour cette session");
//         }
//       } else {
//         console.log("Utilisateur non éligible pour le modal d'abonnement");
//       }

//       setHasChecked(true);
//     };

//     // Délai pour s'assurer que tout est chargé
//     const timer = setTimeout(checkSubscriptionEligibility, 1000);
    
//     return () => clearTimeout(timer);
//   }, [userProfile]);

//   return {
//     showSubscriptionModal,
//     setShowSubscriptionModal,
//     hasChecked
//   };
// };


// src/hooks/useFirstLoginSubscription.js
import { useState, useEffect } from 'react';

export const useFirstLoginSubscription = (userProfile) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!userProfile?.id) {
      setHasChecked(true);
      return;
    }

    const checkSubscriptionEligibility = () => {
      console.log("🔍 Vérification de l'éligibilité pour l'abonnement...", userProfile);
      
      const { abonnement } = userProfile;
      
      // Si pas d'abonnement, on ne montre pas le modal
      if (!abonnement) {
        console.log("❌ Aucun abonnement trouvé");
        setHasChecked(true);
        return;
      }

      const { module, categorie_nom, montant_payer, statut, etat } = abonnement;

      // Vérifier si le paiement n'a pas encore été effectué
      const needsPayment = (!montant_payer || montant_payer === 0) && 
                          (statut === 'actif' || etat === 'en_attente' || !etat);

      console.log("📋 Infos abonnement:", { 
        module, 
        categorie_nom, 
        montant_payer, 
        statut, 
        etat,
        needsPayment 
      });

      if (!needsPayment) {
        console.log("✅ Paiement déjà effectué ou non requis");
        setHasChecked(true);
        return;
      }

      // Vérifier l'éligibilité selon les critères
      const isEligible = 
        // InawoGlobal avec n'importe quelle catégorie
        (module === 'InawoGlobal' && ['Essentiel', 'Business', 'Professionnel'].includes(categorie_nom)) ||
        // InawoSales ou InawoStock avec Business ou Professionnel
        (['InawoSales', 'InawoStock'].includes(module) && ['Business', 'Professionnel'].includes(categorie_nom));

      console.log("🎯 Éligibilité calculée:", isEligible);

      if (isEligible) {
        // Vérifier si on a déjà montré le modal pour cette session
        const hasSeenModal = sessionStorage.getItem(`subscriptionModalShown_${userProfile.id}`);
        
        if (!hasSeenModal) {
          console.log("🚀 Affichage du modal d'abonnement");
          setShowSubscriptionModal(true);
          sessionStorage.setItem(`subscriptionModalShown_${userProfile.id}`, 'true');
        } else {
          console.log("⏸️ Modal déjà affiché pour cette session");
        }
      } else {
        console.log("❌ Utilisateur non éligible pour le modal d'abonnement");
      }

      setHasChecked(true);
    };

    // Délai pour s'assurer que tout est chargé
    const timer = setTimeout(checkSubscriptionEligibility, 500);
    
    return () => clearTimeout(timer);
  }, [userProfile]);

  return {
    showSubscriptionModal,
    setShowSubscriptionModal,
    hasChecked
  };
};