/**
 * Service de préchargement intelligent
 * Anticipe les pages que l'utilisateur va probablement visiter
 */

// Import dynamique pour éviter les erreurs
const safeImport = async (importFn) => {
  try {
    await importFn();
  } catch (error) {
    // Ignorer silencieusement les erreurs de préchargement
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Preload] Failed:', error.message);
    }
  }
};

/**
 * Précharge plusieurs composants de manière sécurisée
 * @param {Array<Function>} importFns - Les fonctions d'import dynamique
 */
const preloadComponentsSafe = (importFns) => {
  // Utiliser setTimeout si requestIdleCallback n'est pas disponible
  const schedulePreload = typeof window !== 'undefined' && window.requestIdleCallback 
    ? window.requestIdleCallback 
    : (cb) => setTimeout(cb, 1000);
  
  schedulePreload(() => {
    importFns.forEach(safeImport);
  }, { timeout: 5000 });
};

// Mapping des routes vers leurs dépendances pour le préchargement
const routeDependencies = {
  '/dashboard': [
    () => import('../pages/Crm/CrmLeads/Contact'),
  ],
  '/contact': [
    () => import('../pages/Crm/CrmLeads/ContactsDetails'),
  ],
  '/team': [
    () => import('../pages/Pages/Team/DetailTeam'),
  ],
 
};

/**
 * Précharge les dépendances d'une route
 * @param {string} currentRoute - La route actuelle
 */
export const preloadRouteDependencies = (currentRoute) => {
  // Ne rien faire si pas de window ou si en arrière-plan
  if (typeof window === 'undefined' || document.hidden) {
    return;
  }
  
  // Trouver la route de base
  const baseRoute = Object.keys(routeDependencies).find(route => 
    currentRoute.includes(route)
  );
  
  if (baseRoute && routeDependencies[baseRoute]) {
    preloadComponentsSafe(routeDependencies[baseRoute]);
  }
};

/**
 * Précharge les routes critiques au démarrage de l'application
 */
export const preloadCriticalRoutes = () => {
  // Ne rien faire si pas de window
  if (typeof window === 'undefined') {
    return;
  }
  
  // Délayer le préchargement pour ne pas bloquer le rendu initial
  setTimeout(() => {
    preloadComponentsSafe([
      () => import('../pages/DashboardEcommerce'),
      () => import('../pages/Crm/CrmLeads/Contact'),
    ]);
  }, 5000); // Augmenté à 5 secondes
};

/**
 * Précharge une route au survol d'un lien
 * À utiliser avec onMouseEnter sur les liens
 * @param {string} route - La route à précharger
 */
export const preloadOnHover = (route) => {
  // Mapping simplifié des routes vers les imports
  const routeImports = {
    'dashboard': () => import('../pages/DashboardEcommerce'),
    'contact': () => import('../pages/Crm/CrmLeads/Contact'),
    'team': () => import('../pages/Pages/Team/Team'),
    'profil': () => import('../pages/Authentication/user-profile'),
    'calendar': () => import('../pages/Calendar/Maincalender'),
  };
  
  // Trouver la clé correspondante
  const matchedKey = Object.keys(routeImports).find(key => 
    route.toLowerCase().includes(key)
  );
  
  if (matchedKey && routeImports[matchedKey]) {
    routeImports[matchedKey]().catch(() => {
      // Ignorer les erreurs de préchargement
    });
  }
};

/**
 * Hook pour précharger au survol
 * @param {string} route - La route à précharger
 * @returns {Object} - Les handlers d'événements
 */
export const usePreloadOnHover = (route) => {
  let timeoutId = null;
  
  return {
    onMouseEnter: () => {
      // Délai pour éviter le préchargement lors d'un survol accidentel
      timeoutId = setTimeout(() => {
        preloadOnHover(route);
      }, 150);
    },
    onMouseLeave: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
};

/**
 * Précharge les images critiques
 * @param {Array<string>} imageUrls - Les URLs des images à précharger
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Précharge les polices
 * @param {Array<string>} fontUrls - Les URLs des polices à précharger
 */
export const preloadFonts = (fontUrls) => {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

export default {
  preloadRouteDependencies,
  preloadCriticalRoutes,
  preloadOnHover,
  usePreloadOnHover,
  preloadImages,
  preloadFonts,
};
