import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  UncontrolledTooltip,
} from "reactstrap";

import { useProfile } from "../../Components/Hooks/UserHooks";
import { useFirstLoginSubscription } from "../../Components/Hooks/useFirstLoginSubscription"; // Import du hook
import FirstLoginSubscriptionModal from "../../Components/Common/FirstLoginSubscriptionModal";
import InawoOnboarding from "../../Components/Common/InawoOnboarding";

const Section = (props) => {
  const { userProfile, token, loading: profileLoading } = useProfile();
  const [isRight, setIsRight] = useState(false);
  
  // Utilisation du hook pour gérer l'affichage du modal
  const { 
    showSubscriptionModal, 
    setShowSubscriptionModal, 
    hasChecked: subscriptionChecked 
  } = useFirstLoginSubscription(userProfile);
  
  // États pour gérer le flux d'onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = () => {
      if (!userProfile || profileLoading || !subscriptionChecked) return;

      setIsCheckingOnboarding(true);
      
      const userAbonnement = userProfile?.abonnement;
      const hasCompletedOnboarding = userProfile?.onboarding_complete;
      
      // console.log("🎯 Onboarding complété:", hasCompletedOnboarding);

      // Si le modal d'abonnement est affiché, on ne montre pas l'onboarding
      if (showSubscriptionModal) {
        // console.log("⏸️ Modal d'abonnement affiché - onboarding en attente");
        setShowOnboarding(false);
        setIsCheckingOnboarding(false);
        return;
      }

      // Vérifier si l'utilisateur a un abonnement
      if (userAbonnement) {
        const { module, categorie_nom, etat } = userAbonnement;
        
        // Vérifier si l'abonnement est payant
        const isPaidSubscription = isSubscriptionPaid(module, categorie_nom);
        // console.log("💰 Abonnement payant?", isPaidSubscription);

        if (isPaidSubscription) {
          // Pour les abonnements payants, vérifier le statut de paiement
          // console.log("📊 Statut du paiement:", etat);
          
          const isPaymentSuccessful = etat === "réussi" || etat === "actif" || etat === "success" || etat === "paid";
          
          if (isPaymentSuccessful && !hasCompletedOnboarding) {
            // Paiement réussi et onboarding pas complété
            // console.log("✅ Paiement réussi - lancement onboarding");
            setShowOnboarding(true);
          } else if (!isPaymentSuccessful) {
            // Paiement non effectué - onboarding en attente
            // console.log("⏳ Paiement en attente - onboarding différé");
            setShowOnboarding(false);
          } else {
            // Onboarding déjà complété
            // console.log("🎉 Onboarding déjà complété");
            setShowOnboarding(false);
          }
        } else {
          // Abonnement gratuit - vérifier l'onboarding
          // console.log("🎁 Abonnement gratuit - vérifier onboarding");
          if (!hasCompletedOnboarding) {
            setShowOnboarding(true);
            // console.log("🚀 Lancement de l'onboarding (gratuit)");
          } else {
            // console.log("🎉 Onboarding déjà complété (gratuit)");
            setShowOnboarding(false);
          }
        }
      } else {
        // Pas d'abonnement - onboarding en attente
        // console.log("❌ Pas d'abonnement - onboarding différé");
        setShowOnboarding(false);
      }
      
      setIsCheckingOnboarding(false);
    };

    checkOnboardingStatus();
  }, [userProfile, profileLoading, subscriptionChecked, showSubscriptionModal]);

  // Fonction pour déterminer si un abonnement est payant
  const isSubscriptionPaid = (module, categorie) => {
    // InawoSales et InawoStock avec catégorie Essentiel sont gratuits
    if ((module === "InawoSales" || module === "InawoStock") && 
        categorie === "Essentiel") {
      return false;
    }
    
    // InawoGlobal et toutes les autres catégories sont payantes
    return true;
  };

  const toggleRightCanvas = () => {
    setIsRight(!isRight);
  };

  // Callback quand l'utilisateur procède au paiement
  const handleProceedToPayment = () => {
    // console.log("🚀 Redirection vers la page de paiement");
    setShowSubscriptionModal(false);
    // La redirection est gérée dans le modal lui-même
  };

  // Callback quand l'onboarding est terminé
  const handleOnboardingComplete = () => {
    // console.log("✅ Onboarding terminé");
    setShowOnboarding(false);
    // Ici vous pourriez mettre à jour le profil utilisateur
    // pour marquer l'onboarding comme terminé
  };
console.log("🎯 Token:", token);
console.log("🎯 Token:", userProfile);

  return (
    <React.Fragment>
      {/* Modal de souscription pour les abonnements payants */}
      <FirstLoginSubscriptionModal
        isOpen={showSubscriptionModal}
        toggle={() => setShowSubscriptionModal(false)}
        userProfile={userProfile}
        onProceedToPayment={handleProceedToPayment}
      />
      
      {/* Onboarding - s'affiche après souscription réussie ou pour les abonnements gratuits */}
      <InawoOnboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        userProfile={userProfile}
      />

      {/* Votre contenu principal du tableau de bord */}
      <Row className="mb-3 pb-1">
        <Col xs={12}>
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">Bienvenue, {userProfile?.prenom} !</h4>
              <p className="text-muted mb-0">
                Bienvenue sur votre tableau de bord
                {/* {showSubscriptionModal && " - Finalisez votre abonnement pour continuer"}
                {showOnboarding && " - Complétez votre configuration"}
                {!showSubscriptionModal && !showOnboarding && " - Prêt à utiliser INAWO"} */}
              </p>
            </div>
            <div className="mt-3 mt-lg-0">
              <form action="#">
                <Row className="g-3 mb-0 align-items-center">
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-info btn-icon waves-effect waves-light rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: 0,
                        margin: 0,
                      }}
                      onClick={toggleRightCanvas}
                      disabled={showSubscriptionModal || showOnboarding}
                      id="activities-btn"
                    >
                      <i className="ri-pulse-line"></i>
                    </button>
                    {(showSubscriptionModal || showOnboarding) && (
                      <UncontrolledTooltip placement="top" target="activities-btn">
                        Complétez le processus en cours pour accéder à cette fonctionnalité
                      </UncontrolledTooltip>
                    )}
                  </div>
                </Row>
              </form>
            </div>
          </div>
        </Col>
      </Row>
      
      <Offcanvas
        isOpen={isRight}
        direction="end"
        toggle={toggleRightCanvas}
        id="offcanvasRight"
        className="border-bottom"
      >
        <OffcanvasHeader toggle={toggleRightCanvas} id="offcanvasRightLabel">
          Activités Récentes
        </OffcanvasHeader>
        <OffcanvasBody>
          <p>Vos activités récentes apparaîtront ici.</p>
        </OffcanvasBody>
      </Offcanvas>

      {/* Afficher un message si un processus est en cours */}
      {/* {(showSubscriptionModal || showOnboarding) && (
        <div className="alert alert-info mt-3">
          <i className="ri-information-line me-2"></i>
          {showSubscriptionModal && 
            "Veuillez finaliser votre abonnement pour activer toutes les fonctionnalités d'INAWO."}
          {showOnboarding && 
            "Complétez la configuration initiale de votre compte pour personnaliser votre expérience INAWO."}
        </div>
      )} */}
    </React.Fragment>
  );
};

export default Section;