/**
 * Utilitaires pour le lazy loading des composants React
 * Améliore les performances en chargeant les composants à la demande
 */

import React, { lazy, Suspense } from 'react';
import loadingInawoGif from '../assets/images/loading_inawo.gif.gif';

/**
 * Composant de chargement par défaut
 */
export const DefaultLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff',
    }}
  >
    <img src={loadingInawoGif} alt="Chargement..." style={{ width: '150px' }} />
  </div>
);

/**
 * Composant de chargement compact pour les sections
 */
export const CompactLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      minHeight: '200px',
    }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Chargement...</span>
    </div>
  </div>
);

/**
 * Wrapper pour le lazy loading avec gestion des erreurs
 * @param {Function} importFn - La fonction d'import dynamique
 * @param {string} moduleName - Le nom du module pour le debug
 * @returns {React.LazyExoticComponent}
 */
export const lazyWithRetry = (importFn, moduleName = 'Component') => {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem(`retry-lazy-${moduleName}`) || 'false'
    );

    try {
      const component = await importFn();
      window.sessionStorage.setItem(`retry-lazy-${moduleName}`, 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Supposons qu'il s'agit d'une erreur de version de chunk
        window.sessionStorage.setItem(`retry-lazy-${moduleName}`, 'true');
        // Recharger la page pour obtenir les nouveaux chunks
        window.location.reload();
        return { default: () => null };
      }
      
      // Si le rechargement n'a pas aidé, lancer l'erreur
      throw error;
    }
  });
};

/**
 * HOC pour wrapper un composant avec Suspense
 * @param {React.LazyExoticComponent} LazyComponent - Le composant lazy
 * @param {React.ComponentType} Fallback - Le composant de fallback
 * @returns {React.FC}
 */
export const withSuspense = (LazyComponent, Fallback = CompactLoader) => {
  const WrappedComponent = (props) => (
    <Suspense fallback={<Fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `withSuspense(${LazyComponent.displayName || 'Component'})`;
  
  return WrappedComponent;
};

/**
 * Précharge un composant lazy en arrière-plan
 * Utile pour précharger les routes que l'utilisateur va probablement visiter
 * @param {Function} importFn - La fonction d'import dynamique
 */
export const preloadComponent = (importFn) => {
  try {
    importFn();
  } catch (error) {
    // Ignorer les erreurs de préchargement
    console.warn('Preload failed:', error);
  }
};

/**
 * Précharge plusieurs composants
 * @param {Array<Function>} importFns - Les fonctions d'import dynamique
 */
export const preloadComponents = (importFns) => {
  // Précharger après un délai pour ne pas bloquer le thread principal
  requestIdleCallback(() => {
    importFns.forEach(preloadComponent);
  }, { timeout: 2000 });
};

// Polyfill pour requestIdleCallback
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  window.requestIdleCallback = (callback, options) => {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, options?.timeout || 1);
  };
  
  window.cancelIdleCallback = (id) => clearTimeout(id);
}

/**
 * Composants lazy pré-configurés pour les pages principales
 */
export const LazyComponents = {
  // Dashboard
  Dashboard: lazyWithRetry(() => import('../pages/DashboardEcommerce'), 'Dashboard'),
  DashboardVente: lazyWithRetry(() => import('../pages/DashboardVente'), 'DashboardVente'),
  DashboardStock: lazyWithRetry(() => import('../pages/DashboardStock'), 'DashboardStock'),
  
  // Gestion utilisateurs
  Team: lazyWithRetry(() => import('../pages/Pages/Team/Team'), 'Team'),
  
  // Produits
  Products: lazyWithRetry(() => import('../pages/Ecommerce/Produits'), 'Products'),
  
  // Factures
  Factures: lazyWithRetry(() => import('../pages/Ecommerce/Factures'), 'Factures'),
  FacturesNormalisees: lazyWithRetry(() => import('../pages/Ecommerce/FacturesNormalisees'), 'FacturesNormalisees'),
  
  // Ventes
  Ventes: lazyWithRetry(() => import('../pages/Ecommerce/ventes/vente'), 'Ventes'),
  
  // Contacts
  Contacts: lazyWithRetry(() => import('../pages/Crm/CrmLeads/Contact'), 'Contacts'),
  
  // Agenda
  Calendar: lazyWithRetry(() => import('../pages/Calendar/Maincalender'), 'Calendar'),
  
  // Stock
  Magasin: lazyWithRetry(() => import('../pages/magasin/Magasin_list'), 'Magasin'),
  Approvisionnement: lazyWithRetry(() => import('../pages/Approvisionnement/Appro_liste'), 'Approvisionnement'),
  
  // Profil
  UserProfile: lazyWithRetry(() => import('../pages/Authentication/user-profile'), 'UserProfile'),
  Settings: lazyWithRetry(() => import('../pages/Pages/Profile/Settings/Profile/Settings'), 'Settings'),
};

export default {
  DefaultLoader,
  CompactLoader,
  lazyWithRetry,
  withSuspense,
  preloadComponent,
  preloadComponents,
  LazyComponents,
};
