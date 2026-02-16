import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Button } from "reactstrap";
import StatsDashboard from "./StatsDashboard";
import SalesByLocations from "./SalesByLocations";
import BestSellingProducts from "./BestSellingProducts";
import TopSellers from "./TopSellers";
import Section from "./Section";
import Popular from "./Popular";
import { useFirstLoginSubscription } from "../../Components/Hooks/useFirstLoginSubscription";
import FirstLoginSubscriptionModal from "../../Components/Common/FirstLoginSubscriptionModal";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { useNavigate } from "react-router-dom";

const DashboardEcommerce = () => {
  const { userProfile } = useProfile();
  const navigate = useNavigate();
  const { showSubscriptionModal, setShowSubscriptionModal, hasChecked } =
    useFirstLoginSubscription(userProfile);

  const [rightColumn, setRightColumn] = useState(true);
  const [testMode, setTestMode] = useState(false); // Mode test
  const [testUserProfile, setTestUserProfile] = useState(null);

  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  const handleProceedToPayment = () => {
    setShowSubscriptionModal(false);
    if (testMode) {
      setTestMode(false);
      setTestUserProfile(null);
    }
    navigate("/:entreprise/abonnement",{ 
    state: { fromWelcomeModal: true } 
  });
  };

  // Fonction pour simuler un utilisateur éligible
  const simulateEligibleUser = () => {
    const testProfile = {
      id: 999,
      abonnement: {
        module: "InawoGlobal",
        categorie_nom: "Business",
        montant_payer: 0, // Important: montant à 0 pour première connexion
        statut: "actif",
      },
    };

    setTestUserProfile(testProfile);
    setTestMode(true);
    setShowSubscriptionModal(true);

    console.log("🎯 Mode test activé - Profil simulé:", testProfile);
  };

  // Utiliser le profil de test ou le vrai profil
  const currentUserProfile = testMode ? testUserProfile : userProfile;

  document.title = "Dashboard | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <div className="page-content ">
        <Container fluid>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0" style={{ color: "rgb(98,116,142)" }}>
                  Tableau de bord {testMode && "(Mode Test)"}
                </h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-decoration-none d-flex fs-6">
                        <span className="ms-2 me-2">
                          <i className="ri-dashboard-fill"></i>
                        </span>
                        <span className="ms-1 me-1">&gt;</span>
                        <span className="ms-1 me-1">Inawo</span>
                        <span className="ms-1 me-1">&gt;</span>
                      </a>
                    </li>
                    <li className="breadcrumb-item active fs-6">
                      Tableau de bord
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  <Col xl={12}>
                    <StatsDashboard />
                  </Col>
                </Row>
                <Row>
                  <Col xl={12}>
                    <SalesByLocations />
                  </Col>
                </Row>
                  <Row>
                  <BestSellingProducts />
                  <TopSellers />
                </Row>
                <Row>
                  <Col xl={12}>
                    <Popular />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal de bienvenue avec abonnement en attente */}
      <FirstLoginSubscriptionModal
        isOpen={showSubscriptionModal}
        toggle={() => {
          setShowSubscriptionModal(false);
          if (testMode) {
            setTestMode(false);
            setTestUserProfile(null);
          }
        }}
        userProfile={currentUserProfile}
        onProceedToPayment={handleProceedToPayment}
      />
    </React.Fragment>
  );
};

export default DashboardEcommerce;
