// import React, { useEffect, useRef, useCallback, useState } from 'react';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Row,
//   Col
// } from 'reactstrap';
// import { useOnboarding } from '../../contexts/OnboardingContext';
// import { useNavigate, useLocation } from 'react-router-dom';

// const InawoOnboarding = () => {
//   const {
//     onboardingState,
//     showOnboarding,
//     nextStep,
//     prevStep,
//     completeOnboarding,
//     skipOnboarding,
//     startSpotlightMode,
//     stopSpotlightMode,
//     onboardingReady
//   } = useOnboarding();

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { currentStep, spotlightMode, spotlightTarget, spotlightPosition } = onboardingState;
//   const modalRef = useRef(null);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [shouldRender, setShouldRender] = useState(false);
//   const [modalPosition, setModalPosition] = useState({ 
//     top: '50%', 
//     left: '50%', 
//     transform: 'translate(-50%, -50%)',
//     position: 'fixed'
//   });

//   // Éviter l'onboarding sur les pages d'authentification
//   const isAuthPage = location.pathname.includes('/fr/connexion') || 
//                     location.pathname === '/' || 
//                     location.pathname.includes('/auth') ||
//                     location.pathname.includes('/register') ||
//                     location.pathname.includes('/forgot-password');

//   // Déplacer steps en dehors du composant ou utiliser useMemo
//   const steps = React.useMemo(() => [
//     // Étape 1: Message de bienvenue
//     {
//       title: "Bienvenue sur Inawo ! 🎉",
//       content: "Découvrons ensemble comment simplifier la gestion de votre entreprise en quelques minutes. Nous allons vous guider à travers les fonctionnalités essentielles.",
//       showBack: false,
//       nextText: "Commencer la visite",
//       type: "modal"
//     },
//     // Étape 2: Sélection de la langue - MAINTENANT AVEC MODAL UNIFIÉ
//     {
//       title: "Choisissez votre langue",
//       content: "Sélectionnez votre langue principale pour personnaliser votre expérience. Vous pourrez la modifier à tout moment dans les paramètres.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "spotlight",
//       target: "language-dropdown",
//       action: () => navigate('/:entreprise/entreprise')
//     },
//     // Étape 3: Profil de votre entreprise
//     {
//       title: "Profil de votre entreprise",
//       content: "Ajoutez les informations de base de votre entreprise : Logo, adresse, forme juridique. Cela personnalise l'expérience et les documents (factures, rapports).",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/supportClient')
//     },
//     // Étape 4: Support client
//     {
//       title: "Support client dédié",
//       content: "Notre équipe est là pour vous accompagner. Ecrivez-nous pour toute forme d'assistance ou de renseignements. Nous répondons sous 24h.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/categories')
//     },
//     // Étape 5: Ajout d'un premier produit/service
//     {
//       title: "Votre catalogue produits",
//       content: "Dans catalogue, Ajoutez d'abord les catégories de produit ou de services avant d'ajouter votre premier produit ou service à vendre. Organisez votre inventaire efficacement.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/contact')
//     },
//     // Étape 6: Ajout d'un client ou partenaire
//     {
//       title: "Gestion des contacts",
//       content: "Dans Contact, Enregistrez votre premier client, prospect, fournisseurs ou partenaires. Centralisez toutes vos relations commerciales.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/facture')
//     },
//     // Étape 7: Création d'une première facture
//     {
//       title: "Création de factures professionnelles",
//       content: "Voyons comment créer une facture. Créer une vente → Sélectionner la vente → Modifier le formulaire de la facture → Générer la facture. Simple et rapide !",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/depense')
//     },
//     // Étape 8: Finance
//     {
//       title: "Gestion financière complète",
//       content: "Enregistrez toutes vos dépenses et vos différents revenus pour évaluer automatiquement votre rentabilité sur l'année ou le mois. Prenez des décisions éclairées.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/approvisionnement')
//     },
//     // Étape 9: Consultation du stock
//     {
//       title: "Gestion des stocks intelligente",
//       content: "Consultez votre stock et vos alertes en un clic. Ajoutez dans la section approvisionnement une commande d'approvisionnement. Ne manquez jamais de stock.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/dashboard')
//     },
//     // Étape 10: Tableau de bord analytique
//     {
//       title: "Analyses en temps réel",
//       content: "Suivez vos ventes, vos dépenses et l'évolution de votre activité en temps réel. Des graphiques clairs pour une vision d'ensemble immédiate.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/utilisateur')
//     },
//     // Étape 11: Ajout de collaborateurs
//     {
//       title: "Collaboration d'équipe",
//       content: "Dans la section utilisateurs, vous pouvez ajouter autant de collaborateurs que le permet votre formule d'abonnement. Personnalisez les rôles et permissions sur la plateforme.",
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//     },
//     // Étape 12: Final
//     {
//       title: "Félicitations ! 🎯 Votre compte est prêt",
//       content: (
//         <div style={{fontSize: '13px', marginLeft:"15px" }}>
//           <p className="mb-1"><strong>Vous maîtrisez maintenant les bases d'Inawo.</strong></p>
//           <div>
//             <div className="d-flex align-items-center mb-1">
//               <i className="ri-checkbox-circle-fill text-success me-2"></i>
//               <span>Créez vos premiers produits, clients et factures</span>
//             </div>
//             <div className="d-flex align-items-center mb-1">
//               <i className="ri-bar-chart-fill text-success me-2"></i>
//               <span>Suivez vos performances en temps réel</span>
//             </div>
//             <div className="d-flex align-items-center mb-1">
//               <i className="ri-team-fill text-success me-2"></i>
//               <span>Collaborez avec votre équipe</span>
//             </div>
//             <div className="d-flex align-items-center">
//               <i className="ri-customer-service-2-fill text-success me-2"></i>
//               <span>Notre support est là pour vous aider</span>
//             </div>
//           </div>
//         </div>
//       ),
//       showBack: true,
//       nextText: "Suivant",
//       type: "modal",
//       action: () => navigate('/:entreprise/dashboard')
//     }
//   ], [navigate]);

//   const currentStepData = steps[currentStep];

//   // Gestion du positionnement du modal
//   const updateModalPosition = useCallback(() => {
//     if (spotlightMode && spotlightPosition) {
//       // Positionner le modal près de l'élément cible pour le spotlight
//       const modalWidth = 450;
//       const modalHeight = 350;
//     const viewportWidth = window.innerWidth;
//     const viewportHeight = window.innerHeight;
//     const padding = 20;
//     const spacingFromTarget = 15; // ← NOUVEAU : Espace réduit
    
//     // ← NOUVEAU : Calcul des positions de l'élément cible
//     const targetLeft = spotlightPosition.x - spotlightPosition.width / 2;
//     const targetRight = spotlightPosition.x + spotlightPosition.width / 2;
//     const targetTop = spotlightPosition.y - spotlightPosition.height / 2;
//     const targetBottom = spotlightPosition.y + spotlightPosition.height / 2;
    
//     // ← CHANGÉ : Position en dessous, centré
//     let top = targetBottom + spacingFromTarget;
//     let left = spotlightPosition.x - modalWidth / 2;
      
//       // Ajustements si le modal sort de l'écran
//       if (top + modalHeight > viewportHeight - padding) {
//         // Placer au-dessus si pas assez de place en dessous
//         top = spotlightPosition.y - modalHeight - padding;
//       }
      
//       if (left + modalWidth > viewportWidth - padding) {
//         // Aligner à droite si pas assez de place à gauche
//         left = viewportWidth - modalWidth - padding;
//       }
      
//       if (left < padding) {
//         left = padding;
//       }
      
//       // S'assurer que le modal reste dans la vue
//       top = Math.max(padding, Math.min(top, viewportHeight - modalHeight - padding));
      
//       setModalPosition({
//         top: `${top}px`,
//         left: `${left}px`,
//         transform: 'none',
//         position: 'fixed'
//       });
//     } else {
//       // Position centrée par défaut pour les modaux normaux
//       setModalPosition({ 
//         top: '50%', 
//         left: '50%', 
//         transform: 'translate(-50%, -50%)',
//         position: 'fixed'
//       });
//     }
//   }, [spotlightMode, spotlightPosition]);

//   // Gestion du spotlight
//   const handleSpotlight = useCallback(() => {
//     const stepData = steps[currentStep];
    
//     if (!stepData || stepData.type !== 'spotlight' || !stepData.target) {
//       if (spotlightMode) {
//         stopSpotlightMode();
//       }
//       return;
//     }

//     const timer = setTimeout(() => {
//       const targetElement = document.querySelector(`[data-onboarding-target="${stepData.target}"]`);
//       if (targetElement) {
//         const rect = targetElement.getBoundingClientRect();
//         startSpotlightMode(stepData.target, {
//           x: rect.left + rect.width / 2,
//           y: rect.top + rect.height / 2,
//           width: Math.max(rect.width, 40), // Minimum width for visibility
//           height: Math.max(rect.height, 40) // Minimum height for visibility
//         });
//         // Mettre à jour la position du modal après un court délai
//         setTimeout(updateModalPosition, 150);
//       } else {
//         console.warn('❌ Élément cible non trouvé:', stepData.target);
//         stopSpotlightMode();
//         // Continuer quand même avec le modal centré
//         updateModalPosition();
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [currentStep, spotlightMode, startSpotlightMode, stopSpotlightMode, steps, updateModalPosition]);

//   // Mettre à jour la position quand les conditions changent
//   useEffect(() => {
//     if (shouldRender) {
//       updateModalPosition();
//     }
//   }, [spotlightMode, spotlightPosition, shouldRender, updateModalPosition]);

//   // Réagir aux changements de fenêtre
//   useEffect(() => {
//     const handleResize = () => {
//       if (shouldRender) {
//         updateModalPosition();
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     window.addEventListener('scroll', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       window.removeEventListener('scroll', handleResize);
//     };
//   }, [shouldRender, updateModalPosition]);

//   // Logique principale de rendu
//   useEffect(() => {
//     if (!showOnboarding || !onboardingReady) {
//       setShouldRender(false);
//       return;
//     }

//     if (isAuthPage) {
//       console.log('🚫 Onboarding bloqué - Page d\'authentification');
//       setShouldRender(false);
//       return;
//     }

//     console.log('🎯 Affichage onboarding - Étape:', currentStep + 1, 'Type:', steps[currentStep]?.type);
//     setIsInitialized(true);
//     setShouldRender(true);
    
//     // Démarrer le spotlight si nécessaire
//     if (steps[currentStep]?.type === 'spotlight') {
//       handleSpotlight();
//     } else {
//       // S'assurer que le spotlight est désactivé pour les étapes normales
//       if (spotlightMode) {
//         stopSpotlightMode();
//       }
//       updateModalPosition();
//     }
    
//   }, [showOnboarding, onboardingReady, isAuthPage, currentStep, handleSpotlight, spotlightMode, stopSpotlightMode, steps, updateModalPosition]);

//   // Nettoyer le spotlight quand le composant est démonté
//   useEffect(() => {
//     return () => {
//       if (spotlightMode) {
//         stopSpotlightMode();
//       }
//     };
//   }, [spotlightMode, stopSpotlightMode]);

//   const handleNext = useCallback(() => {
//   console.log('➡️ Passage à l\'étape suivante:', currentStep + 1);
  
//   // Arrêter le spotlight si on quitte une étape spotlight
//   if (steps[currentStep]?.type === 'spotlight' && spotlightMode) {
//     stopSpotlightMode();
//     // Attendre que le spotlight soit complètement arrêté avant de changer d'étape
//     setTimeout(() => {
//       // Exécuter l'action si définie
//       if (steps[currentStep]?.action) {
//         console.log('🎯 Exécution action pour étape:', currentStep);
//         steps[currentStep].action();
//       }
      
//       // Compléter ou passer à l'étape suivante
//       if (currentStep === steps.length - 1) {
//         completeOnboarding();
//       } else {
//         nextStep();
//       }
//     }, 100);
//   } else {
//     // Exécuter l'action si définie
//     if (steps[currentStep]?.action) {
//       console.log('🎯 Exécution action pour étape:', currentStep);
//       steps[currentStep].action();
//     }
    
//     // Compléter ou passer à l'étape suivante
//     if (currentStep === steps.length - 1) {
//       completeOnboarding();
//     } else {
//       nextStep();
//     }
//   }
// }, [currentStep, completeOnboarding, nextStep, steps, spotlightMode, stopSpotlightMode]);

// const handleBack = useCallback(() => {
//   console.log('⬅️ Retour à l\'étape précédente:', currentStep);
  
//   // Arrêter le spotlight si on est sur une étape spotlight
//   if (steps[currentStep]?.type === 'spotlight' && spotlightMode) {
//     stopSpotlightMode();
//     // Attendre que le spotlight soit complètement arrêté
//     setTimeout(() => {
//       prevStep();
//     }, 100);
//   } else {
//     prevStep();
//   }
// }, [currentStep, prevStep, steps, spotlightMode, stopSpotlightMode]);

//   const handleSkip = useCallback(() => {
//     console.log('⏭️ Onboarding sauté par l\'utilisateur');
//     skipOnboarding();
//   }, [skipOnboarding]);

//   // Ne rien rendre si les conditions ne sont pas remplies
//   if (!shouldRender || !isInitialized) {
//     return null;
//   }

//   return (
//     <>
//       {/* Overlay principal pour griser l'interface */}
//       <div 
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 1040,
//           pointerEvents: 'auto'
//         }}
//       />

//       {/* Overlay pour le mode spotlight */}
//       {spotlightMode && spotlightPosition && (
//         <div 
//           className="spotlight-overlay"
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             // backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             zIndex: 1041,
//             pointerEvents: 'auto'
//           }}
//         >
//           {/* "Trou" pour mettre en valeur l'élément cible */}
//           <div
//             style={{
//               position: 'absolute',
//               left: `${spotlightPosition.x - spotlightPosition.width / 2}px`,
//               top: `${spotlightPosition.y - spotlightPosition.height / 2}px`,
//               width: `${spotlightPosition.width}px`,
//               height: `${spotlightPosition.height}px`,
//               borderRadius: '8px',
//               boxShadow: `
//                 0 0 0 9999px rgba(0, 0, 0, 0.7),
//                 0 0 0 3px #014a92,
//                 0 0 0 6px rgba(255, 255, 255, 0.3),
//                 0 0 20px 8px rgba(1, 74, 146, 0.4)
//               `,
//               pointerEvents: 'none',
//               transition: 'all 0.3s ease'
//             }}
//           />
//         </div>
//       )}

//       {/* Modal unique pour tous les types d'étapes */}
//       <Modal 
//         isOpen={true} 
//         backdrop={false}
//         keyboard={false}
//         className={`onboarding-modal border-0 ${spotlightMode ? 'spotlight-modal' : 'centered-modal'}`}
//         contentClassName="rounded-20 shadow-lg border-0"
//         style={{
//           ...modalPosition,
//           zIndex: 1042,
//           margin: 0,
//           maxWidth: '450px',
//           width: '90vw'
//         }}
//         ref={modalRef}
//       >
//    <ModalHeader 
//   className="border-0 p-0"
//   toggle={handleSkip}
//   close={
//     <Button
//       close
//       onClick={handleSkip}
//       style={{ 
//         opacity: 1, 
//         color: "white", 
//         filter: "brightness(0) invert(1)",
//         fontSize: '0.7rem',
//         position: 'absolute',
//         right: '1.5rem',
//         top: '50%',
//         transform: 'translateY(-50%)',
//         marginTop: '5px'
//       }}
//     />
//   }
//   style={{ 
//     background: '#014a92',
//     color: 'white',
//     borderRadius: '20px 20px 0 0',
//     minHeight: '35px',
//     position: 'relative',
    
//   }}
// >
//   <div className="d-flex align-items-center gap-2">
//     <h5 className="mb-0 fw-bold text-white" style={{ fontSize: '0.85rem' ,marginLeft: '15px'}}>
//       {steps[currentStep].title}
//     </h5>
//     <span 
//       className="badge text-light px-3 py-2"
//       style={{ 
//         fontSize: '0.75rem', 
//         fontWeight: '600'
//       }}
//     >
//       {currentStep + 1}/{steps.length}
//     </span>
//   </div>
// </ModalHeader>
        
//         <ModalBody style={{ padding: '0.5rem' }}>
//           <Row>
//             <Col lg={12}>
//               <div 
//                 className="onboarding-content" 
//                 style={{ 
//                   minHeight: '80px',
//                   display: 'flex',
//                   alignItems: 'center'
//                 }}
//               >
//                 {typeof steps[currentStep].content === 'string' ? (
//                   <p 
//                     className="mb-0" 
//                     style={{ 
//                       fontSize: '13px', 
//                       lineHeight: '1.6', 
//                       // color: '#374151',
//                       textAlign: 'center'
//                     }}
//                   >
//                     {steps[currentStep].content}
//                   </p>
//                 ) : (
//                   <div 
//                     style={{ 
//                       fontSize: '13px', 
//                       lineHeight: '1.6', 
//                       // color: '#374151',
//                       width: '100%'
//                     }}
//                   >
//                     {steps[currentStep].content}
//                   </div>
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </ModalBody>

//         <ModalFooter 
//           className="border-0 pt-0 px-4 pb-2"
//           style={{ background: 'transparent' }}
//         >
//           <div className="d-flex justify-content-end w-100 gap-3 align-items-center">
//             <div className="d-flex gap-2 align-items-center">
//               {steps[currentStep].showBack && currentStep > 0 && (
//                 <Button
//                   color="light"
//                   onClick={handleBack}
//                   style={{ 
//                     borderRadius: '50px', 
//                     minWidth: '100px',
//                     border: '1px solid #dee2e6',
//                     fontWeight: '500',
//                     color: '#6c757d'
//                   }}
//                   className="fw-medium"
//                 >
//                   <i className="ri-arrow-left-line me-1"></i>
//                   Retour
//                 </Button>
//               )}
              
//               <Button
//                 color="primary"
//                 onClick={handleNext}
//                 style={{ 
//                   borderRadius: '50px', 
//                   minWidth: '160px',
//                   background: '#014a92',
//                   border: 'none',
//                   fontWeight: '600',
//                 }}
//               >
//                 {steps[currentStep].nextText}
//                 {currentStep === steps.length - 1 ? (
//                   <i className="ri-rocket-2-line ms-2"></i>
//                 ) : (
//                   <i className="ri-arrow-right-line ms-2"></i>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// };

// export default InawoOnboarding;








import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col
} from 'reactstrap';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useNavigate, useLocation } from 'react-router-dom';

const InawoOnboarding = () => {
  const {
    onboardingState,
    showOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    startSpotlightMode,
    stopSpotlightMode,
    onboardingReady
  } = useOnboarding();

  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, spotlightMode, spotlightTarget, spotlightPosition } = onboardingState;
  
  const modalRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    position: 'fixed'
  });

  // Référence pour suivre l'état du spotlight
  const isTransitioningRef = useRef(false);

  // Éviter l'onboarding sur les pages d'authentification
  const isAuthPage = location.pathname.includes('/fr/connexion') || 
                    location.pathname === '/' || 
                    location.pathname.includes('/auth') ||
                    location.pathname.includes('/register') ||
                    location.pathname.includes('/forgot-password');

  const steps = React.useMemo(() => [
    // Étape 1: Message de bienvenue
    {
      title: "Bienvenue sur Inawo ! 🎉",
      content: "Découvrons ensemble comment simplifier la gestion de votre entreprise en quelques minutes. Nous allons vous guider à travers les fonctionnalités essentielles.",
      showBack: false,
      nextText: "Commencer la visite",
      type: "modal"
    },
    // Étape 2: Sélection de la langue
    {
      title: "Choisissez votre langue",
      content: "Sélectionnez votre langue principale pour personnaliser votre expérience. Vous pourrez la modifier à tout moment dans les paramètres.",
      showBack: true,
      nextText: "Suivant",
      type: "spotlight",
      target: "language-dropdown",
      action: () => navigate('/:entreprise/entreprise')
    },
      // Étape 3: Profil de votre entreprise
    {
      title: "Profil de votre entreprise",
      content: "Ajoutez les informations de base de votre entreprise : Logo, adresse, forme juridique. Cela personnalise l'expérience et les documents (factures, rapports).",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/supportClient')
    },
    // Étape 4: Support client
    {
      title: "Support client dédié",
      content: "Notre équipe est là pour vous accompagner. Ecrivez-nous pour toute forme d'assistance ou de renseignements. Nous répondons sous 24h.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/categories')
    },
    // Étape 5: Ajout d'un premier produit/service
    {
      title: "Votre catalogue produits",
      content: "Dans catalogue, Ajoutez d'abord les catégories de produit ou de services avant d'ajouter votre premier produit ou service à vendre. Organisez votre inventaire efficacement.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/contact')
    },
    // Étape 6: Ajout d'un client ou partenaire
    {
      title: "Gestion des contacts",
      content: "Dans Contact, Enregistrez votre premier client, prospect, fournisseurs ou partenaires. Centralisez toutes vos relations commerciales.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/facture')
    },
    // Étape 7: Création d'une première facture
    {
      title: "Création de factures professionnelles",
      content: "Voyons comment créer une facture. Créer une vente → Sélectionner la vente → Modifier le formulaire de la facture → Générer la facture. Simple et rapide !",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/depense')
    },
    // Étape 8: Finance
    {
      title: "Gestion financière complète",
      content: "Enregistrez toutes vos dépenses et vos différents revenus pour évaluer automatiquement votre rentabilité sur l'année ou le mois. Prenez des décisions éclairées.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/approvisionnement')
    },
    // Étape 9: Consultation du stock
    {
      title: "Gestion des stocks intelligente",
      content: "Consultez votre stock et vos alertes en un clic. Ajoutez dans la section approvisionnement une commande d'approvisionnement. Ne manquez jamais de stock.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/dashboard')
    },
    // Étape 10: Tableau de bord analytique
    {
      title: "Analyses en temps réel",
      content: "Suivez vos ventes, vos dépenses et l'évolution de votre activité en temps réel. Des graphiques clairs pour une vision d'ensemble immédiate.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/utilisateur')
    },
    // Étape 11: Ajout de collaborateurs
    {
      title: "Collaboration d'équipe",
      content: "Dans la section utilisateurs, vous pouvez ajouter autant de collaborateurs que le permet votre formule d'abonnement. Personnalisez les rôles et permissions sur la plateforme.",
      showBack: true,
      nextText: "Suivant",
      type: "modal",
    },
    // Étape 12: Final
    {
      title: "Félicitations ! 🎯 Votre compte est prêt",
      content: (
        <div style={{fontSize: '13px', marginLeft:"15px" }}>
          <p className="mb-1"><strong>Vous maîtrisez maintenant les bases d'Inawo.</strong></p>
          <div>
            <div className="d-flex align-items-center mb-1">
              <i className="ri-checkbox-circle-fill text-success me-2"></i>
              <span>Créez vos premiers produits, clients et factures</span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <i className="ri-bar-chart-fill text-success me-2"></i>
              <span>Suivez vos performances en temps réel</span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <i className="ri-team-fill text-success me-2"></i>
              <span>Collaborez avec votre équipe</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="ri-customer-service-2-fill text-success me-2"></i>
              <span>Notre support est là pour vous aider</span>
            </div>
          </div>
        </div>
      ),
      showBack: true,
      nextText: "Suivant",
      type: "modal",
      action: () => navigate('/:entreprise/dashboard')
    }
  ], [navigate]);

  const currentStepData = steps[currentStep];

  // Gestion SIMPLIFIÉE du positionnement
  const updateModalPosition = useCallback(() => {
    if (spotlightMode && spotlightPosition) {
      const modalWidth = 450;
      const modalHeight = 350;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 20;
      const spacingFromTarget = 15;

      // Position en dessous de l'élément
      let top = spotlightPosition.y + spotlightPosition.height / 2 + spacingFromTarget;
      let left = spotlightPosition.x - modalWidth / 2;
      
      // Ajustements si nécessaire
      if (top + modalHeight > viewportHeight - padding) {
        top = spotlightPosition.y - modalHeight - spacingFromTarget;
      }
      
      left = Math.max(padding, Math.min(left, viewportWidth - modalWidth - padding));
      top = Math.max(padding, Math.min(top, viewportHeight - modalHeight - padding));
      
      setModalPosition({
        top: `${top}px`,
        left: `${left}px`,
        transform: 'none',
        position: 'fixed'
      });
    } else {
      // Position centrée par défaut
      setModalPosition({ 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      });
    }
  }, [spotlightMode, spotlightPosition]);

  // Gestion du spotlight - COMPLÈTEMENT SIMPLIFIÉE
  useEffect(() => {
    if (!showOnboarding || !onboardingReady || isAuthPage) return;

    const stepData = steps[currentStep];
    
    if (stepData?.type === 'spotlight' && stepData.target) {
      // Délai plus long pour la première transition
      const delay = currentStep === 1 ? 800 : 400;
      
      const timer = setTimeout(() => {
        if (isTransitioningRef.current) return;
        
        const targetElement = document.querySelector(`[data-onboarding-target="${stepData.target}"]`);
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          startSpotlightMode(stepData.target, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: Math.max(rect.width, 40),
            height: Math.max(rect.height, 40)
          });
          
          // Mettre à jour la position après un délai
          setTimeout(updateModalPosition, 300);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Désactiver le spotlight pour les étapes normales
      if (spotlightMode) {
        stopSpotlightMode();
      }
      updateModalPosition();
    }
  }, [currentStep, showOnboarding, onboardingReady, isAuthPage, spotlightMode, startSpotlightMode, stopSpotlightMode, steps, updateModalPosition]);

  // Gestion des événements de fenêtre
  useEffect(() => {
    if (!showOnboarding) return;

    const handleResize = () => {
      updateModalPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showOnboarding, updateModalPosition]);

  // Gestion SIMPLIFIÉE des actions
  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    
    isTransitioningRef.current = true;
    
    console.log('➡️ Passage à l\'étape suivante:', currentStep + 1);
    
    // Exécuter l'action si définie
    if (steps[currentStep]?.action) {
      steps[currentStep].action();
    }
    
    // Délai différent selon l'étape
    const transitionDelay = currentStep === 0 ? 300 : 150;
    
    setTimeout(() => {
      if (currentStep === steps.length - 1) {
        completeOnboarding();
      } else {
        nextStep();
      }
      isTransitioningRef.current = false;
    }, transitionDelay);
    
  }, [currentStep, completeOnboarding, nextStep, steps]);

  const handleBack = useCallback(() => {
    if (isTransitioningRef.current) return;
    
    isTransitioningRef.current = true;
    
    console.log('⬅️ Retour à l\'étape précédente:', currentStep);
    
    setTimeout(() => {
      prevStep();
      isTransitioningRef.current = false;
    }, 150);
    
  }, [currentStep, prevStep]);

  const handleSkip = useCallback(() => {
    console.log('⏭️ Onboarding sauté par l\'utilisateur');
    skipOnboarding();
  }, [skipOnboarding]);

  // Ne rien rendre si les conditions ne sont pas remplies
  if (!showOnboarding || !onboardingReady || isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Overlay principal */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          pointerEvents: 'auto'
        }}
      />

     {/* Overlay pour le mode spotlight */}
{spotlightMode && spotlightPosition && (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1041,
      pointerEvents: 'auto',
      backgroundColor: 'transparent' // ← IMPORTANT: fond transparent
    }}
  >
    <div
            style={{
              position: 'absolute',
              left: `${spotlightPosition.x - spotlightPosition.width / 2}px`,
              top: `${spotlightPosition.y - spotlightPosition.height / 2}px`,
              width: `${spotlightPosition.width}px`,
              height: `${spotlightPosition.height}px`,
              borderRadius: '8px',
              boxShadow: `
                0 0 0 9999px rgba(0, 0, 0, 0.5),
                0 0 0 3px #014a92,
                0 0 0 6px rgba(255, 255, 255, 0.3),
                0 0 20px 8px rgba(1, 74, 146, 0.4)
              `,
              pointerEvents: 'none',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
)}

      {/* Modal */}
      <Modal 
        isOpen={true} 
        backdrop={false}
        keyboard={false}
        className="onboarding-modal border-0"
        contentClassName="rounded-20 shadow-lg border-0"
        style={{
          ...modalPosition,
          zIndex: 1042,
          margin: 0,
          maxWidth: '450px',
          width: '90vw',
          transition: 'all 0.4s ease'
        }}
        ref={modalRef}
      >
        <ModalHeader 
          className="border-0 p-0"
          toggle={handleSkip}
          close={
            <Button
              close
              onClick={handleSkip}
              style={{ 
                opacity: 1, 
                color: "white", 
                filter: "brightness(0) invert(1)",
                fontSize: '0.7rem',
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                marginTop: '5px'
              }}
            />
          }
          style={{ 
            background: '#014a92',
            color: 'white',
            borderRadius: '20px 20px 0 0',
            minHeight: '35px',
            position: 'relative',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-bold text-white" style={{ fontSize: '0.85rem', marginLeft: '15px' }}>
              {steps[currentStep].title}
            </h5>
            <span 
              className="badge text-light px-3 py-2"
              style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600'
              }}
            >
              {currentStep + 1}/{steps.length}
            </span>
          </div>
        </ModalHeader>
        
        <ModalBody style={{ padding: '0.5rem' }}>
          <Row>
            <Col lg={12}>
              <div 
                className="onboarding-content" 
                style={{ 
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {typeof steps[currentStep].content === 'string' ? (
                  <p 
                    className="mb-0" 
                    style={{ 
                      fontSize: '13px', 
                      lineHeight: '1.6', 
                      textAlign: 'center'
                    }}
                  >
                    {steps[currentStep].content}
                  </p>
                ) : (
                  <div style={{ fontSize: '13px', lineHeight: '1.6', width: '100%' }}>
                    {steps[currentStep].content}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter className="border-0 pt-0 px-4 pb-2" style={{ background: 'transparent' }}>
          <div className="d-flex justify-content-end w-100 gap-3 align-items-center">
            <div className="d-flex gap-2 align-items-center">
              {steps[currentStep].showBack && currentStep > 0 && (
                <Button
                  color="light"
                  onClick={handleBack}
                  style={{ 
                    borderRadius: '50px', 
                    minWidth: '100px',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                    color: '#6c757d'
                  }}
                >
                  <i className="ri-arrow-left-line me-1"></i>
                  Retour
                </Button>
              )}
              
              <Button
                color="primary"
                onClick={handleNext}
                style={{ 
                  borderRadius: '50px', 
                  minWidth: '160px',
                  background: '#014a92',
                  border: 'none',
                  fontWeight: '600',
                }}
              >
                {steps[currentStep].nextText}
                {currentStep === steps.length - 1 ? (
                  <i className="ri-rocket-2-line ms-2"></i>
                ) : (
                  <i className="ri-arrow-right-line ms-2"></i>
                )}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default InawoOnboarding;



