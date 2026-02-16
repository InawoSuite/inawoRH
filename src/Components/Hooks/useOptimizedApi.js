import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../pages/APIKey/ApiKey';
import { useProfile } from './UserHooks';
import { apiCache, cachedApiCall, invalidateCache } from '../../utils/performance';

/**
 * Hook personnalisé pour les appels API optimisés
 * Gère le cache, le loading, les erreurs et les annulations
 */
export const useOptimizedApi = (options = {}) => {
  const { 
    cacheTTL = 5 * 60 * 1000, // 5 minutes par défaut
    enableCache = true,
    retryCount = 2,
    retryDelay = 1000,
  } = options;

  const { token } = useProfile();
  const abortControllerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Instance axios optimisée avec memoization
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BaseUrl,
      timeout: 30000, // 30 secondes timeout
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Intercepteur de requête
    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Gestion de l'expiration du token
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token]);

  /**
   * Effectue un appel GET avec cache optionnel
   */
  const get = useCallback(async (url, options = {}) => {
    const { 
      useCache = enableCache, 
      ttl = cacheTTL,
      params = {},
      forceRefresh = false,
    } = options;

    const cacheKey = `GET:${url}:${JSON.stringify(params)}`;
    
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      if (useCache && !forceRefresh) {
        const cached = apiCache.get(cacheKey);
        if (cached) {
          setLoading(false);
          return cached;
        }
      }

      const response = await axiosInstance.get(url, {
        params,
        signal: abortControllerRef.current.signal,
      });

      const data = response.data;

      if (useCache) {
        apiCache.set(cacheKey, data, ttl);
      }

      setLoading(false);
      return data;
    } catch (err) {
      if (axios.isCancel(err)) {
        return null; // Requête annulée, pas d'erreur
      }
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [axiosInstance, enableCache, cacheTTL]);

  /**
   * Effectue un appel POST
   */
  const post = useCallback(async (url, data, options = {}) => {
    const { invalidateCachePattern = null } = options;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(url, data, {
        signal: abortControllerRef.current.signal,
      });

      // Invalider le cache si spécifié
      if (invalidateCachePattern) {
        invalidateCache(invalidateCachePattern);
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        return null;
      }
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [axiosInstance]);

  /**
   * Effectue un appel PATCH
   */
  const patch = useCallback(async (url, data, options = {}) => {
    const { invalidateCachePattern = null } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch(url, data);

      if (invalidateCachePattern) {
        invalidateCache(invalidateCachePattern);
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [axiosInstance]);

  /**
   * Effectue un appel DELETE
   */
  const remove = useCallback(async (url, options = {}) => {
    const { invalidateCachePattern = null } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.delete(url);

      if (invalidateCachePattern) {
        invalidateCache(invalidateCachePattern);
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [axiosInstance]);

  /**
   * Annule toutes les requêtes en cours
   */
  const cancelRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Précharge des données
   */
  const prefetch = useCallback(async (url, params = {}) => {
    const cacheKey = `GET:${url}:${JSON.stringify(params)}`;
    
    if (apiCache.has(cacheKey)) {
      return; // Déjà en cache
    }

    try {
      const response = await axiosInstance.get(url, { params });
      apiCache.set(cacheKey, response.data, cacheTTL);
    } catch (err) {
      console.warn(`[Prefetch] Failed for ${url}:`, err);
    }
  }, [axiosInstance, cacheTTL]);

  // Nettoyage à la destruction
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    get,
    post,
    patch,
    remove,
    cancelRequests,
    prefetch,
    loading,
    error,
    axiosInstance,
    clearCache: () => apiCache.clear(),
    invalidateCache,
  };
};

/**
 * Hook pour le debouncing de valeurs
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook pour le debouncing de callbacks
 */
export const useDebouncedCallback = (callback, delay = 300) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook pour la pagination optimisée
 */
export const useOptimizedPagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil(items.length / itemsPerPage), 
    [items.length, itemsPerPage]
  );

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Réinitialiser à la page 1 quand les items changent
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalItems: items.length,
  };
};

/**
 * Hook pour le chargement progressif (virtualization simple)
 */
export const useInfiniteScroll = (loadMore, hasMore, loading) => {
  const observerRef = useRef(null);
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
};

export default {
  useOptimizedApi,
  useDebouncedValue,
  useDebouncedCallback,
  useOptimizedPagination,
  useInfiniteScroll,
};
