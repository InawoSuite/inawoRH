// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const OnboardingContext = createContext();

// export const useOnboarding = () => {
//   const context = useContext(OnboardingContext);
//   if (!context) {
//     throw new Error('useOnboarding must be used within an OnboardingProvider');
//   }
//   return context;
// };

// export const OnboardingProvider = ({ children }) => {
//   const [onboardingState, setOnboardingState] = useState({
//     hasCompletedOnboarding: false,
//     currentStep: 0,
//     isActive: false,
//     userLanguage: 'fr',
//     companyProfileCreated: false,
//     spotlightMode: false,
//     spotlightTarget: null,
//     spotlightPosition: null,
//   });

//   const [showOnboarding, setShowOnboarding] = useState(false);
  
//   // 🚀 MODE PRODUCTION - false pour que l'onboarding s'affiche uniquement à la première connexion
//   const [testMode, setTestMode] = useState(false);

//   // Charger l'état initial une seule fois
//   useEffect(() => {
//     const hasSeenOnboarding = localStorage.getItem('inawo_hasSeenOnboarding');
//     const userLanguage = localStorage.getItem('inawo_userLanguage') || 'fr';
    
//     // En mode production, afficher l'onboarding uniquement si jamais vu
//     if (testMode || !hasSeenOnboarding) {
//       setShowOnboarding(true);
//       setOnboardingState(prev => ({
//         ...prev,
//         userLanguage,
//         isActive: true,
//         currentStep: 0
//       }));
//     } else {
//       setOnboardingState(prev => ({
//         ...prev,
//         userLanguage,
//         hasCompletedOnboarding: true,
//         isActive: false
//       }));
//     }
//   }, [testMode]); // testMode comme seule dépendance

//   const startOnboarding = useCallback(() => {
//     setShowOnboarding(true);
//     setOnboardingState(prev => ({
//       ...prev,
//       isActive: true,
//       currentStep: 0,
//       spotlightMode: false,
//       spotlightTarget: null,
//       spotlightPosition: null
//     }));
//   }, []);

//   const completeOnboarding = useCallback(() => {
//     setShowOnboarding(false);
//     setOnboardingState(prev => ({
//       ...prev,
//       isActive: false,
//       hasCompletedOnboarding: true,
//       currentStep: 0,
//       spotlightMode: false,
//       spotlightTarget: null,
//       spotlightPosition: null
//     }));
    
//     if (!testMode) {
//       localStorage.setItem('inawo_hasSeenOnboarding', 'true');
//     }
//   }, [testMode]);

//   const skipOnboarding = useCallback(() => {
//     setShowOnboarding(false);
//     setOnboardingState(prev => ({
//       ...prev,
//       isActive: false,
//       spotlightMode: false,
//       spotlightTarget: null,
//       spotlightPosition: null
//     }));
    
//     if (!testMode) {
//       localStorage.setItem('inawo_hasSeenOnboarding', 'true');
//     }
//   }, [testMode]);

//   // Fonction gardée pour le développement mais peu utilisée en production
//   const toggleTestMode = useCallback(() => {
//     const newTestMode = !testMode;
//     setTestMode(newTestMode);
//     if (newTestMode) {
//       localStorage.removeItem('inawo_hasSeenOnboarding');
//     }
//   }, [testMode]);

//   const startSpotlightMode = useCallback((target, position) => {
//     setOnboardingState(prev => ({
//       ...prev,
//       spotlightMode: true,
//       spotlightTarget: target,
//       spotlightPosition: position
//     }));
//   }, []);

//   const stopSpotlightMode = useCallback(() => {
//     setOnboardingState(prev => ({
//       ...prev,
//       spotlightMode: false,
//       spotlightTarget: null,
//       spotlightPosition: null
//     }));
//   }, []);

//   const nextStep = useCallback(() => {
//     setOnboardingState(prev => ({ 
//       ...prev, 
//       currentStep: prev.currentStep + 1 
//     }));
//   }, []);

//   const prevStep = useCallback(() => {
//     setOnboardingState(prev => ({ 
//       ...prev, 
//       currentStep: Math.max(0, prev.currentStep - 1)
//     }));
//   }, []);

//   const updateLanguage = useCallback((language) => {
//     setOnboardingState(prev => ({ ...prev, userLanguage: language }));
//     localStorage.setItem('inawo_userLanguage', language);
//   }, []);

//   const resetOnboarding = useCallback(() => {
//     localStorage.removeItem('inawo_hasSeenOnboarding');
//     startOnboarding();
//   }, [startOnboarding]);

//   const value = {
//     onboardingState,
//     showOnboarding,
//     startOnboarding,
//     nextStep,
//     prevStep,
//     completeOnboarding,
//     skipOnboarding,
//     updateLanguage,
//     testMode,
//     toggleTestMode,
//     resetOnboarding,
//     startSpotlightMode,
//     stopSpotlightMode,
//   };

//   return (
//     <OnboardingContext.Provider value={value}>
//       {children}
//     </OnboardingContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children, user }) => {
  const [onboardingState, setOnboardingState] = useState({
    hasCompletedOnboarding: false,
    currentStep: 0,
    isActive: false,
    userLanguage: 'fr',
    companyProfileCreated: false,
    spotlightMode: false,
    spotlightTarget: null,
    spotlightPosition: null,
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [onboardingReady, setOnboardingReady] = useState(false);

  // Fonction pour détecter si c'est la première connexion
  const isFirstLogin = useCallback((userData) => {
    if (!userData || !userData.id) return false;
    
    // Vérifier si l'utilisateur a déjà vu l'onboarding (méthode globale)
    const hasSeenOnboarding = localStorage.getItem('inawo_hasSeenOnboarding');
    if (hasSeenOnboarding === 'true') return false;

    // Vérifier par ID utilisateur pour plus de précision
    const userOnboardingKey = `inawo_onboarding_${userData.id}`;
    const hasUserSeenOnboarding = localStorage.getItem(userOnboardingKey);
    if (hasUserSeenOnboarding === 'true') return false;

    // Vérifier si l'utilisateur a déjà effectué des actions (backup)
    const hasUserActions = localStorage.getItem(`inawo_user_${userData.id}_actions`);
    if (hasUserActions) return false;

    // Si aucune des conditions ci-dessus, c'est la première connexion
    console.log('🎯 Première connexion détectée pour:', userData.email);
    return true;
  }, []);

  // Charger l'état initial - SEULEMENT quand l'utilisateur est disponible
  useEffect(() => {
    if (!user || !user.id) {
      console.log('⏳ En attente de l\'utilisateur pour l\'onboarding');
      setOnboardingReady(false);
      return;
    }

    console.log('🔍 Vérification onboarding pour utilisateur:', user.email, 'ID:', user.id);
    
    const hasSeenOnboarding = localStorage.getItem('inawo_hasSeenOnboarding');
    const userOnboardingKey = `inawo_onboarding_${user.id}`;
    const hasUserSeenOnboarding = localStorage.getItem(userOnboardingKey);
    const userLanguage = localStorage.getItem('inawo_userLanguage') || 'fr';
    
    // Détecter si c'est la première connexion
    const firstLogin = isFirstLogin(user);
    
    console.log('📊 État onboarding:', {
      user: user.email,
      hasSeenOnboarding,
      hasUserSeenOnboarding,
      firstLogin,
      testMode
    });

    // Attendre que l'application soit complètement chargée
    const timer = setTimeout(() => {
      if (testMode || firstLogin) {
        console.log('🚀 LANCEMENT ONBOARDING - Première connexion détectée');
        setShowOnboarding(true);
        setOnboardingState(prev => ({
          ...prev,
          userLanguage,
          isActive: true,
          currentStep: 0,
          hasCompletedOnboarding: false
        }));
        
        // Marquer la première connexion
        localStorage.setItem(`inawo_last_login_${user.id}`, new Date().toISOString());
        console.log('📝 Première connexion enregistrée pour:', user.email);
      } else {
        console.log('✅ Onboarding déjà complété pour cet utilisateur');
        setOnboardingState(prev => ({
          ...prev,
          userLanguage,
          hasCompletedOnboarding: true,
          isActive: false
        }));
      }
      
      setOnboardingReady(true);
      console.log('🎯 Onboarding prêt - showOnboarding:', testMode || firstLogin);
    }, 1500); // Délai de 1.5 seconde pour laisser le dashboard se charger

    return () => clearTimeout(timer);
  }, [user, testMode, isFirstLogin]);

  const startOnboarding = useCallback(() => {
    console.log('🎬 Démarrage manuel de l\'onboarding');
    setShowOnboarding(true);
    setOnboardingState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0,
      hasCompletedOnboarding: false,
      spotlightMode: false,
      spotlightTarget: null,
      spotlightPosition: null
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    console.log('🏁 Onboarding complété');
    setShowOnboarding(false);
    setOnboardingState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedOnboarding: true,
      currentStep: 0,
      spotlightMode: false,
      spotlightTarget: null,
      spotlightPosition: null
    }));
    
    if (!testMode && user) {
      localStorage.setItem('inawo_hasSeenOnboarding', 'true');
      localStorage.setItem(`inawo_onboarding_${user.id}`, 'true');
      localStorage.setItem(`inawo_user_${user.id}_actions`, 'completed_onboarding');
      console.log('💾 Onboarding marqué comme complété pour:', user.email);
    }
  }, [testMode, user]);

  const skipOnboarding = useCallback(() => {
    console.log('⏭️ Onboarding sauté');
    setShowOnboarding(false);
    setOnboardingState(prev => ({
      ...prev,
      isActive: false,
      spotlightMode: false,
      spotlightTarget: null,
      spotlightPosition: null
    }));
    
    if (!testMode && user) {
      localStorage.setItem('inawo_hasSeenOnboarding', 'true');
      localStorage.setItem(`inawo_onboarding_${user.id}`, 'true');
      console.log('💾 Onboarding marqué comme sauté pour:', user.email);
    }
  }, [testMode, user]);

  const startSpotlightMode = useCallback((target, position) => {
    setOnboardingState(prev => ({
      ...prev,
      spotlightMode: true,
      spotlightTarget: target,
      spotlightPosition: position
    }));
  }, []);

  const stopSpotlightMode = useCallback(() => {
    setOnboardingState(prev => ({
      ...prev,
      spotlightMode: false,
      spotlightTarget: null,
      spotlightPosition: null
    }));
  }, []);

  const nextStep = useCallback(() => {
    setOnboardingState(prev => ({ 
      ...prev, 
      currentStep: prev.currentStep + 1 
    }));
  }, []);

  const prevStep = useCallback(() => {
    setOnboardingState(prev => ({ 
      ...prev, 
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  }, []);

  const updateLanguage = useCallback((language) => {
    setOnboardingState(prev => ({ ...prev, userLanguage: language }));
    localStorage.setItem('inawo_userLanguage', language);
  }, []);

  const resetOnboarding = useCallback(() => {
    if (user) {
      localStorage.removeItem('inawo_hasSeenOnboarding');
      localStorage.removeItem(`inawo_onboarding_${user.id}`);
      localStorage.removeItem(`inawo_user_${user.id}_actions`);
    }
    console.log('🔄 Onboarding réinitialisé');
    startOnboarding();
  }, [startOnboarding, user]);

  const toggleTestMode = useCallback(() => {
    const newTestMode = !testMode;
    setTestMode(newTestMode);
    if (newTestMode) {
      localStorage.removeItem('inawo_hasSeenOnboarding');
      if (user) {
        localStorage.removeItem(`inawo_onboarding_${user.id}`);
      }
      console.log('🧪 Mode test activé - Onboarding forcé');
    } else {
      console.log('🚀 Mode production activé');
    }
  }, [testMode, user]);

  const value = {
    onboardingState,
    showOnboarding,
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    updateLanguage,
    testMode,
    toggleTestMode,
    resetOnboarding,
    startSpotlightMode,
    stopSpotlightMode,
    onboardingReady,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};