/**
 * Remplacement sécurisé de fetch() pour éviter les URLs invalides
 */

export const safeFetch = async (url, options = {}) => {
  // Validation de l'URL
  if (!url || typeof url !== 'string') {
    throw new Error(`URL invalide: ${url}`);
  }
  
  // Liste des routes qui doivent avoir un paramètre
  const routesRequiringParam = [
    { 
      pattern: /^\/utilisateurs\/inscription\/[^\/]*\/?$/,
      message: 'La route /utilisateurs/inscription/ nécessite un ID'
    },
    { 
      pattern: /^\/collaborateurs\/[^\/]*\/?$/,
      message: 'La route /collaborateurs/ nécessite un ID'
    },
    { 
      pattern: /^\/api\/v1\/facture\/taxe\/$/,
      message: 'La route /facture/taxe/ nécessite un paramètre'
    }
  ];
  
  // Vérifier les URLs avec undefined
  if (url.includes('undefined')) {
    console.error('❌ URL REJETÉE (contient undefined):', url);
    
    // Loguer l'erreur
    if (typeof window !== 'undefined') {
      fetch('/api/log/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'INVALID_URL_UNDEFINED',
          url: url,
          timestamp: new Date().toISOString(),
          location: window.location.href
        })
      }).catch(() => {});
    }
    
    throw new Error(`URL invalide: contient "undefined". URL: ${url}`);
  }
  
  // Vérifier les routes sans paramètre
  for (const route of routesRequiringParam) {
    if (route.pattern.test(url)) {
      const hasParam = url.split('/').filter(Boolean).length >= 3;
      
      if (!hasParam) {
        console.error('❌ URL REJETÉE (paramètre manquant):', url);
        
        throw new Error(`${route.message}. URL: ${url}`);
      }
    }
  }
  
  // Si tout est OK, exécuter la requête
  console.log(`✅ Requête autorisée: ${url}`);
  return fetch(url, options);
};

// Utilisation : remplacez tous vos fetch() par safeFetch()