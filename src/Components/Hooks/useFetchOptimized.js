import { useState, useEffect, useCallback } from "react";
import { fetchWithCache } from "../../helpers/fetchWithRetry";

/**
 * Hook pour récupérer des données avec retry et cache automatiques
 * @param {string} url - URL à requêter
 * @param {object} token - Token d'authentification
 * @param {object} dependencies - Dépendances useEffect
 * @returns {object} {data, loading, error, refetch}
 */
export const useFetchOptimized = (
  url,
  token,
  dependencies = []
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!url || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWithCache(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });
      setData(result);
    } catch (err) {
      console.error(`Erreur chargement ${url}:`, err);
      setError(err.message || "Erreur réseau");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

/**
 * Hook pour plusieurs requêtes en parallèle (avec limit)
 */
export const useFetchBatch = (
  urls,
  token,
  { maxConcurrent = 3, dependencies = [] } = {}
) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!urls || urls.length === 0 || !token) {
      setLoading(false);
      return;
    }

    const fetchBatch = async () => {
      setLoading(true);
      setErrors({});
      const results = {};

      // Faire les requêtes par groupes pour ne pas surcharger l'API
      for (let i = 0; i < urls.length; i += maxConcurrent) {
        const batch = urls.slice(i, i + maxConcurrent);

        const promises = batch.map((url) =>
          fetchWithCache(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 30000,
          })
            .then((result) => {
              results[url] = result;
            })
            .catch((error) => {
              setErrors((prev) => ({
                ...prev,
                [url]: error.message,
              }));
            })
        );

        await Promise.all(promises);
        // Attendre avant le prochain lot pour ne pas surcharger
        if (i + maxConcurrent < urls.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      setData(results);
      setLoading(false);
    };

    fetchBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls, token, maxConcurrent]);

  return { data, loading, errors };
};
