import axios from "axios";

/**
 * Helper pour faire des requêtes avec retry automatique et timeout augmenté
 * @param {string} url - URL à requêter
 * @param {object} options - Options (headers, method, data, timeout)
 * @param {number} retries - Nombre de tentatives (défaut: 3)
 * @returns {Promise}
 */
export const fetchWithRetry = async (
  url,
  options = {},
  retries = 3
) => {
  const {
    headers = {},
    method = "GET",
    data = null,
    timeout = 30000, // 30 secondes par défaut au lieu de 60
  } = options;

  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      // Créer une instance axios avec timeout augmenté
      const instance = axios.create({
        timeout: timeout,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
      });

      // Attendre avant de retenter (backoff exponentiel: 1s, 2s, 4s)
      if (i > 0) {
        const delay = Math.pow(2, i - 1) * 1000;
        console.log(
          `Tentative ${i + 1}/${retries} après ${delay}ms pour ${url}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Faire la requête
      const response = await instance({
        method,
        url,
        data,
      });

      return response.data;
    } catch (error) {
      lastError = error;

      // Si erreur 404, 400, 403 → ne pas retenter
      if (
        error.response?.status &&
        [400, 403, 404].includes(error.response.status)
      ) {
        console.error(
          `Erreur ${error.response.status} pour ${url} - pas de retry`
        );
        throw error;
      }

      // Si dernière tentative, lancer l'erreur
      if (i === retries - 1) {
        console.error(`Échec après ${retries} tentatives pour ${url}`);
      }
    }
  }

  throw lastError;
};

/**
 * Cache simple en mémoire pour éviter les requêtes répétées
 */
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.TTL = 5 * 60 * 1000; // 5 minutes
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const requestCache = new RequestCache();

/**
 * Requête avec cache automatique
 */
export const fetchWithCache = async (url, options = {}, retries = 3) => {
  // Vérifier le cache d'abord
  const cached = requestCache.get(url);
  if (cached) {
    console.log(`📦 Données en cache pour ${url}`);
    return cached;
  }

  // Sinon, faire la requête
  try {
    const data = await fetchWithRetry(url, options, retries);
    // Mettre en cache
    requestCache.set(url, data);
    return data;
  } catch (error) {
    console.error(`❌ Erreur requête ${url}:`, error.message);
    throw error;
  }
};

/**
 * Requête avec gestion d'erreur améliorée pour les composants
 */
export const useFetchData = async (url, options = {}) => {
  try {
    const data = await fetchWithCache(url, {
      ...options,
      timeout: 30000,
    });
    return { data, error: null, loading: false };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Erreur réseau",
      loading: false,
    };
  }
};
