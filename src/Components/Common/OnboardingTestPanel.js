import React from 'react';
import { Card, CardBody, Button, Row, Col, Badge } from 'reactstrap';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingTestPanel = () => {
  const {
    onboardingState,
    showOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    testMode,
    toggleTestMode,
    onboardingReady
  } = useOnboarding();

  const clearAllStorage = () => {
    localStorage.removeItem('inawo_hasSeenOnboarding');
    localStorage.removeItem('inawo_userLanguage');
    
    // Supprimer tous les éléments liés à l'onboarding
    Object.keys(localStorage).forEach(key => {
      if (key.includes('inawo_onboarding') || key.includes('inawo_last_login') || key.includes('inawo_user_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Stockage nettoyé !');
    window.location.reload();
  };

  const simulateNewUser = () => {
    clearAllStorage();
    setTimeout(() => {
      startOnboarding();
    }, 1000);
  };

  return (
    <Card className="position-fixed" style={{ 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999, 
      width: '350px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <CardBody className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 fw-bold">🧪 Test Onboarding</h6>
          <Badge color={testMode ? "success" : "secondary"}>
            {testMode ? "TEST MODE" : "PROD"}
          </Badge>
        </div>

        <Row className="g-2 mb-3">
          <Col>
            <Button 
              color="primary" 
              size="sm" 
              onClick={startOnboarding}
              disabled={!onboardingReady}
              className="w-100"
            >
              🚀 Démarrer
            </Button>
          </Col>
          <Col>
            <Button 
              color="success" 
              size="sm" 
              onClick={completeOnboarding}
              className="w-100"
            >
              ✅ Terminer
            </Button>
          </Col>
        </Row>

        <Row className="g-2 mb-3">
          <Col>
            <Button 
              color="warning" 
              size="sm" 
              onClick={resetOnboarding}
              className="w-100"
            >
              🔄 Reset
            </Button>
          </Col>
          <Col>
            <Button 
              color="info" 
              size="sm" 
              onClick={simulateNewUser}
              className="w-100"
            >
              👤 Nouvel User
            </Button>
          </Col>
        </Row>

        <Row className="g-2 mb-3">
          <Col>
            <Button 
              color={testMode ? "danger" : "outline-primary"} 
              size="sm" 
              onClick={toggleTestMode}
              className="w-100"
            >
              {testMode ? "🚀 Prod" : "🧪 Test"}
            </Button>
          </Col>
          <Col>
            <Button 
              color="outline-danger" 
              size="sm" 
              onClick={clearAllStorage}
              className="w-100"
            >
              🧹 Nettoyer
            </Button>
          </Col>
        </Row>

        {/* État actuel */}
        <div className="border-top pt-2">
          <small className="text-muted d-block">
            <strong>État:</strong> {showOnboarding ? '🟢 Actif' : '🔴 Inactif'}
          </small>
          <small className="text-muted d-block">
            <strong>Étape:</strong> {onboardingState.currentStep + 1}/12
          </small>
          <small className="text-muted d-block">
            <strong>Prêt:</strong> {onboardingReady ? '✅' : '⏳'}
          </small>
          <small className="text-muted d-block">
            <strong>Complété:</strong> {onboardingState.hasCompletedOnboarding ? '✅' : '❌'}
          </small>
        </div>
      </CardBody>
    </Card>
  );
};

export default OnboardingTestPanel;