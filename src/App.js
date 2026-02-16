import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./slices/auth/login/reducer";
import { getAuthData } from "./utils/authUtils";
// import apiDiagnostic from './utils/diagnostic';
import { SidebarProvider } from "./contexts/SidebarContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SubscriptionErrorProvider } from "./contexts/SubscriptionErrorContext";
import SubscriptionExpiredModal from "./Components/Common/SubscriptionExpiredModal";
import "./assets/scss/themes.scss";
import "./assets/Styles/performance.css"; // Styles d'optimisation de performance
import AppRouter from "./AppRouter";
import fakeBackend from "./helpers/AuthType/fakeBackend";
import { PermissionProvider } from "./contexts/PermissionContext";
import { UserProvider } from './contexts/UserContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import InawoOnboarding from './Components/Common/InawoOnboarding';
import OnboardingTestPanel from './Components/Common/OnboardingTestPanel'; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Préchargement (version sécurisée)
import { preloadCriticalRoutes } from './utils/preloadService';
// import { initElectronAdapter } from './electron-adapter';

fakeBackend();

// Préchargement différé et sécurisé
if (typeof window !== 'undefined' && !document.hidden) {
  // Attendre que l'app soit interactive avant de précharger
  window.addEventListener('load', () => {
    setTimeout(preloadCriticalRoutes, 2000);
  }, { once: true });
}

function App() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Variable pour activer/désactiver le panel de test
  const [showTestPanel, setShowTestPanel] = useState(process.env.NODE_ENV === 'development');

// useEffect(() => {
//     // Activer le diagnostic seulement en développement
//     if (process.env.NODE_ENV === 'development' || 
//         window.location.hostname === 'localhost') {
//       apiDiagnostic.activate();
      
//       // Exporter les logs toutes les 5 minutes
//       const exportInterval = setInterval(() => {
//         if (apiDiagnostic.getLogs().length > 0) {
//           console.log('📊 Logs actuels:', apiDiagnostic.getLogs());
//         }
//       }, 300000); // 5 minutes
      
//       return () => {
//         clearInterval(exportInterval);
//         apiDiagnostic.deactivate();
//       };
//     }
//   }, []);
  

  useEffect(() => {
    const initializeAuth = async () => {
      const authData = getAuthData();
      
      if (authData.access_token && authData.user) {
        const user = authData.user;
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        dispatch(
          loginSuccess({
            user: user,
            token: authData.access_token,
            refreshToken: authData.refresh_token,
          })
        );
      }
      
      setAppReady(true);
    };

    initializeAuth();
  }, [dispatch]);

  // Raccourci clavier pour afficher/masquer le panel de test (Ctrl+Shift+O)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        setShowTestPanel(prev => !prev);
        console.log('🎛️ Panel de test:', !showTestPanel ? 'activé' : 'désactivé');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showTestPanel]);

  if (!appReady) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionErrorProvider>
      <OnboardingProvider user={isAuthenticated ? currentUser : null}>
        <UserProvider>
          <PermissionProvider user={currentUser}>
            <NotificationProvider>
              <SidebarProvider>
                <AppRouter />
                {isAuthenticated && <InawoOnboarding />}
                
                {/* Modal global pour les erreurs d'abonnement expiré */}
                <SubscriptionExpiredModal />
                
                {/* Panel de test - seulement en développement et si authentifié */}
                {/* {isAuthenticated && showTestPanel && <OnboardingTestPanel />} */}
                
                {/* Indicateur de mode test */}
                {/* {isAuthenticated && (
                  <div 
                    className="position-fixed" 
                    style={{ 
                      top: '10px', 
                      right: '10px', 
                      zIndex: 9998 
                    }}
                  >
                    <button
                      onClick={() => setShowTestPanel(!showTestPanel)}
                      className="btn btn-sm btn-outline-secondary"
                      title="Afficher/Masquer le panel de test (Ctrl+Shift+O)"
                    >
                      🧪
                    </button>
                  </div>
                )} */}
              </SidebarProvider>
            </NotificationProvider>
          </PermissionProvider>
        </UserProvider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3} // ⚠️ IMPORTANT: Limite à 3 toasts simultanés
          theme="light"
        />
      </OnboardingProvider>
    </SubscriptionErrorProvider>
  );
}

export default App;