// // src/components/Subscription/FirstLoginSubscriptionModal.js
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Alert,
//   Row,
//   Col,
//   Badge,
// } from "reactstrap";

// const FirstLoginSubscriptionModal = ({
//   isOpen,
//   toggle,
//   userProfile,
//   onProceedToPayment,
// }) => {
//   if (!userProfile?.abonnement) return null;

//   const { abonnement } = userProfile;
//   const { module, categorie_nom } = abonnement;
//     const navigate = useNavigate();

//    const handleProceedToPayment = () => {
//     // Définir un flag dans sessionStorage pour indiquer la provenance
//     sessionStorage.setItem('fromWelcomeModal', 'true');
    
//     // Fermer le modal actuel
//     toggle();

//     // Appeler le callback parent
//     if (onProceedToPayment) {
//       onProceedToPayment();
//     }
    
//     // Rediriger vers la page de souscription
//       navigate("/:entreprise/abonnement"); // ou utilisez navigate si vous avez react-router
//   };

//   const getModuleDisplayName = (module) => {
//     switch (module) {
//       case "InawoGlobal":
//         return "Inawo Global";
//       case "InawoSales":
//         return "Inawo Sales";
//       case "InawoStock":
//         return "Inawo Stock";
//       default:
//         return module;
//     }
//   };

//   const getCategorieColor = (categorie_nom) => {
//     switch (categorie_nom) {
//       case "Essentiel":
//         return "primary";
//       case "Business":
//         return "success";
//       case "Professionnel":
//         return "warning";
//       default:
//         return "secondary";
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       toggle={toggle}
//       centered
//       backdrop="static"
//       contentClassName="rounded-4 border-0 shadow"
//       size="md"
//       backdrop="static"
//       keyboard={false}
//     >
//       <ModalHeader
//         className="bg-primary text-white border-0 rounded-top-4 d-flex justify-content-center align-items-center"
//         style={{
//           borderBottom: "none",
//           padding: "1.5rem",
//         }}
//         toggle={null}
//       >
//         <div className="text-white text-center">
//           <i className="ri-star-s-fill me-2 fs-18"></i>
//           <span className="fw-semibold fs-18">Finalisez votre abonnement</span>
//         </div>
//       </ModalHeader>

//       <ModalBody className="px-4">
//         <div className="text-center mb-4">
//           <div className="avatar-lg mx-auto mb-3">
//             <div className="avatar-title bg-light text-primary display-4 rounded-circle">
//               <i className="ri-rocket-2-line"></i>
//             </div>
//           </div>
//           <h4 className="text-primary mb-2">Bienvenue sur INAWO !</h4>
//           <p className="text-muted mb-0">
//             Votre formule d'abonnement nécessite une activation
//           </p>
//         </div>

// <div className="rounded-3 mb-4">
//   <div className="d-flex justify-content-center align-items-center gap-3" style={{ lineHeight: "1.2" }}>
//     <div className="text-center">
//       <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.8rem" }}>Formule</div>
//       <Badge color="info" className="rounded-pill px-2 py-1" style={{ fontSize: "0.8rem" }}>
//         {getModuleDisplayName(module)}
//       </Badge>
//     </div>
    
//     <div className="text-center">
//       <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.8rem" }}>Catégorie</div>
//       <Badge
//         color={getCategorieColor(categorie_nom)}
//         className="rounded-pill px-2 py-1"
//         style={{ fontSize: "0.8rem" }}
//       >
//         {categorie_nom}
//       </Badge>
//     </div>
//   </div>
// </div>

//         <Alert color="info" className="border-0 rounded-3 mb-4">
//           <div className="d-flex align-items-center justify-content-center">
//             <i className="ri-information-line me-2 fs-16"></i>
//             <small className="fw-medium text-center">
//               Activez votre abonnement pour profiter de toutes les
//               fonctionnalités
//             </small>
//           </div>
//         </Alert>

//         <div className="text-center">
//           <h6 className="text-muted mb-0">
//             <i className="ri-shield-check-line me-2 text-success"></i>
//             Paiement 100% sécurisé
//           </h6>
//         </div>
//       </ModalBody>

//        <ModalFooter className="border-0 rounded-bottom-4 justify-content-center pt-0 pb-4">
//         <Button
//           color="primary"
//           onClick={handleProceedToPayment} // Utiliser la nouvelle fonction
//           className="rounded-pill px-5 py-2 fw-semibold"
//           style={{ minWidth: "220px", fontSize: "0.9rem" }}
//         >
//           <i className="ri-bank-card-line me-2"></i>
//           Procéder au paiement
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default FirstLoginSubscriptionModal;


// src/components/Subscription/FirstLoginSubscriptionModal.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  Row,
  Col,
  Badge,
} from "reactstrap";

const FirstLoginSubscriptionModal = ({
  isOpen,
  toggle,
  userProfile,
  onProceedToPayment,
}) => {
  const navigate = useNavigate();

  // CONDITION RÉELLE D'AFFICHAGE :
  // Le modal doit s'afficher uniquement si :
  // 1. L'utilisateur a un abonnement
  // 2. L'abonnement est PAYANT
  // 3. Le paiement n'est PAS encore effectué
  const shouldShowModal = () => {
    if (!userProfile?.abonnement) return false;
    
    const { abonnement } = userProfile;
    const { module, categorie_nom, etat } = abonnement;
    
    // Vérifier si l'abonnement est payant
    const isPaidSubscription = isSubscriptionPaid(module, categorie_nom);
    
    // Vérifier si le paiement n'est pas encore effectué
    const isPaymentPending = !etat || etat === "en_attente" || etat === "pending" || etat === "inactif";
    
    return isPaidSubscription && isPaymentPending;
  };

  // Fonction pour déterminer si un abonnement est payant
  const isSubscriptionPaid = (module, categorie) => {
    // InawoSales et InawoStock avec catégorie Essentiel sont GRATUITS
    if ((module === "InawoSales" || module === "InawoStock") && 
        categorie === "Essentiel") {
      return false;
    }
    
    // InawoGlobal et toutes les autres catégories sont PAYANTES
    // InawoSales Business/Professionnel sont payants
    // InawoStock Business/Professionnel sont payants
    return true;
  };

  // Si la condition n'est pas remplie, ne pas afficher le modal
  if (!shouldShowModal()) {
    return null;
  }

  const { abonnement } = userProfile;
  const { module, categorie_nom } = abonnement;

  const handleProceedToPayment = () => {
    // Définir un flag dans sessionStorage pour indiquer la provenance
    sessionStorage.setItem('fromWelcomeModal', 'true');
    
    // Fermer le modal actuel
    toggle();

    // Appeler le callback parent
    if (onProceedToPayment) {
      onProceedToPayment();
    }
    
    // Correction : utilisez le bon chemin sans les ":"
    navigate("/:entreprise/abonnement"); 
  };

  const getModuleDisplayName = (module) => {
    switch (module) {
      case "InawoGlobal":
        return "Inawo Global";
      case "InawoSales":
        return "Inawo Sales";
      case "InawoStock":
        return "Inawo Stock";
      default:
        return module;
    }
  };

  const getCategorieColor = (categorie_nom) => {
    switch (categorie_nom) {
      case "Essentiel":
        return "primary";
      case "Business":
        return "success";
      case "Professionnel":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      backdrop="static"
      contentClassName="rounded-4 border-0 shadow"
      size="md"
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader
        className="bg-primary text-white border-0 rounded-top-4 d-flex justify-content-center align-items-center"
        style={{
          borderBottom: "none",
          padding: "1.5rem",
        }}
        toggle={null}
      >
        <div className="text-white text-center">
          <i className="ri-star-s-fill me-2 fs-18"></i>
          <span className="fw-semibold fs-18">Finalisez votre abonnement</span>
        </div>
      </ModalHeader>

      <ModalBody className="px-4">
        <div className="text-center mb-4">
          <div className="avatar-lg mx-auto mb-3">
            <div className="avatar-title bg-light text-primary display-4 rounded-circle">
              <i className="ri-rocket-2-line"></i>
            </div>
          </div>
          <h4 className="text-primary mb-2">Bienvenue sur INAWO !</h4>
          <p className="text-muted mb-0">
            Votre formule d'abonnement nécessite une activation
          </p>
        </div>

        <div className="rounded-3 mb-4">
          <div className="d-flex justify-content-center align-items-center gap-3" style={{ lineHeight: "1.2" }}>
            <div className="text-center">
              <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.8rem" }}>Formule</div>
              <Badge color="info" className="rounded-pill px-2 py-1" style={{ fontSize: "0.8rem" }}>
                {getModuleDisplayName(module)}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.8rem" }}>Catégorie</div>
              <Badge
                color={getCategorieColor(categorie_nom)}
                className="rounded-pill px-2 py-1"
                style={{ fontSize: "0.8rem" }}
              >
                {categorie_nom}
              </Badge>
            </div>
          </div>
        </div>

        <Alert color="info" className="border-0 rounded-3 mb-4">
          <div className="d-flex align-items-center justify-content-center">
            <i className="ri-information-line me-2 fs-16"></i>
            <small className="fw-medium text-center">
              Activez votre abonnement pour profiter de toutes les fonctionnalités
            </small>
          </div>
        </Alert>

        <div className="text-center">
          <h6 className="text-muted mb-0">
            <i className="ri-shield-check-line me-2 text-success"></i>
            Paiement 100% sécurisé
          </h6>
        </div>
      </ModalBody>

      <ModalFooter className="border-0 rounded-bottom-4 justify-content-center pt-0 pb-4">
        <Button
          color="primary"
          onClick={handleProceedToPayment}
          className="rounded-pill px-5 py-2 fw-semibold"
          style={{ minWidth: "220px", fontSize: "0.9rem" }}
        >
          <i className="ri-bank-card-line me-2"></i>
          Procéder au paiement
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FirstLoginSubscriptionModal;

