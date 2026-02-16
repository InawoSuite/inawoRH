/**
 * Utilitaires de performance pour l'application
 * Contient des fonctions d'optimisation pour améliorer l'expérience utilisateur
 */

/**
 * Crée une version debounced d'une fonction
 * Utile pour les recherches, les sauvegardes automatiques, etc.
 * @param {Function} func - La fonction à debounce
 * @param {number} wait - Le délai en millisecondes
 * @returns {Function} - La fonction debounced
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Crée une version throttled d'une fonction
 * Utile pour les événements de scroll, resize, etc.
 * @param {Function} func - La fonction à throttle
 * @param {number} limit - L'intervalle minimum en millisecondes
 * @returns {Function} - La fonction throttled
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Cache en mémoire simple avec expiration
 */
class MemoryCache {
  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes par défaut
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
    return value;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Nettoie les entrées expirées
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Instance globale du cache
export const apiCache = new MemoryCache();

/**
 * Wrapper pour les appels API avec cache
 * @param {string} key - Clé unique pour le cache
 * @param {Function} apiCall - La fonction d'appel API
 * @param {number} ttl - Durée de vie du cache en ms
 * @returns {Promise} - Les données (du cache ou de l'API)
 */
export const cachedApiCall = async (key, apiCall, ttl = 5 * 60 * 1000) => {
  // Vérifier le cache
  const cached = apiCache.get(key);
  if (cached) {
    console.log(`[Cache] Hit: ${key}`);
    return cached;
  }

  // Appeler l'API
  console.log(`[Cache] Miss: ${key}`);
  const result = await apiCall();
  
  // Mettre en cache
  apiCache.set(key, result, ttl);
  
  return result;
};

/**
 * Invalide le cache pour une clé ou un pattern
 * @param {string|RegExp} pattern - La clé ou le pattern à invalider
 */
export const invalidateCache = (pattern) => {
  if (typeof pattern === 'string') {
    apiCache.delete(pattern);
  } else if (pattern instanceof RegExp) {
    for (const key of apiCache.cache.keys()) {
      if (pattern.test(key)) {
        apiCache.delete(key);
      }
    }
  }
};

/**
 * Précharge des données en arrière-plan
 * @param {Array<{key: string, loader: Function}>} items - Les éléments à précharger
 */
export const prefetchData = async (items) => {
  const promises = items.map(async ({ key, loader, ttl }) => {
    if (!apiCache.has(key)) {
      try {
        const data = await loader();
        apiCache.set(key, data, ttl);
      } catch (error) {
        console.warn(`[Prefetch] Failed for ${key}:`, error);
      }
    }
  });
  
  await Promise.allSettled(promises);
};

/**
 * Mesure le temps d'exécution d'une fonction
 * @param {string} label - Label pour le log
 * @param {Function} fn - La fonction à mesurer
 * @returns {any} - Le résultat de la fonction
 */
export const measurePerformance = async (label, fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  
  return result;
};

/**
 * Chunk un tableau pour le traitement par lots
 * @param {Array} array - Le tableau à chunker
 * @param {number} size - La taille des chunks
 * @returns {Array} - Le tableau de chunks
 */
export const chunkArray = (array, size = 10) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Détecte si l'utilisateur est sur une connexion lente
 * @returns {boolean}
 */
export const isSlowConnection = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  
  return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
};

/**
 * Précharge une image en arrière-plan
 * @param {string} src - L'URL de l'image
 * @returns {Promise}
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Retarde l'exécution d'une promesse
 * @param {number} ms - Le délai en millisecondes
 * @returns {Promise}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  debounce,
  throttle,
  apiCache,
  cachedApiCall,
  invalidateCache,
  prefetchData,
  measurePerformance,
  chunkArray,
  isSlowConnection,
  preloadImage,
  delay,
};
