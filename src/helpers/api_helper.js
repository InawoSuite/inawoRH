import axios from "axios";
import { api } from "../config";
import { getAuthData, saveAuthData, clearAuthData } from "../utils/authUtils";
import subscriptionErrorService from "../Services/subscriptionErrorService";

// Configuration par défaut
axios.defaults.baseURL = api.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

/**
 * Configure l'autorisation par défaut
 * @param {string} token - Le token d'accès
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

// Récupération du token depuis le localStorage ou sessionStorage
const initializeAuthHeaders = () => {
  const authData = getAuthData();
  if (authData.access_token) {
    setAuthorization(authData.access_token);
  }
};

// Initialisation des en-têtes d'autorisation
initializeAuthHeaders();

// Intercepteur pour les requêtes
axios.interceptors.request.use(
  (config) => {
    // Ajout du token à chaque requête si disponible
    const authData = getAuthData();
    if (authData.access_token) {
      config.headers["Authorization"] = `Bearer ${authData.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses et gestion des erreurs
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => {
    return response.data ? response.data : response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (Non autorisé) et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si nous sommes déjà en train de rafraîchir le token
      if (isRefreshing) {
        // Mettre la requête en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Marquer que nous sommes en train de rafraîchir le token
      originalRequest._retry = true;
      isRefreshing = true;

      // Tenter de rafraîchir le token
      try {
        const authData = getAuthData();
        if (!authData.refresh_token) {
          console.log("Token refresh:",authData.refresh_token)
          throw new Error("Pas de token de rafraîchissement disponible");
        }

        const response = await axios.post(
          api.API_URL + "/utilisateurs/refresh-token/", 
          { refresh_token: authData.refresh_token },
          { _retry: true }  // Marqueur pour éviter une boucle
        );

        if (response.access_token) {
          // Sauvegarder le nouveau token
          saveAuthData({
            ...authData,
            access_token: response.access_token
          }, localStorage.getItem('rememberMe') === 'true');
          
          // Mettre à jour l'en-tête d'autorisation
          setAuthorization(response.access_token);
          
          // Traiter la file d'attente avec le nouveau token
          processQueue(null, response.access_token);
          
          // Refaire la requête originale avec le nouveau token
          originalRequest.headers['Authorization'] = 'Bearer ' + response.access_token;
          return axios(originalRequest);
        } else {
          throw new Error("Le rafraîchissement du token a échoué");
        }
      } catch (err) {
        // En cas d'échec, déconnecter l'utilisateur
        processQueue(err, null);
        clearAuthData();
        
        // Rediriger vers la page de connexion ou émettre un événement
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'token_expired' }
        }));
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Formatage des erreurs
    let message;
    
    // ✅ Gestion spéciale des erreurs 403 liées à l'abonnement
    if (error.response?.status === 403) {
      const isSubscriptionError = subscriptionErrorService.handle403Error(error);
      if (isSubscriptionError) {
        message = subscriptionErrorService.extractMessage(error);
        return Promise.reject({ 
          message, 
          originalError: error,
          isSubscriptionError: true 
        });
      }
      message = "Vous n'avez pas les droits nécessaires pour accéder à cette ressource";
    } else {
      switch (error.response?.status) {
        case 500:
          message = "Erreur interne du serveur";
          break;
        case 401:
          message = "Identifiants invalides ou session expirée";
          break;
        case 404:
          message = "Identifiants invalides ou ressource non trouvée";
          break;
        default:
          message = error.response?.data?.message || error.message || "Une erreur est survenue";
      }
    }
    
    return Promise.reject({ message, originalError: error });
  }
);

class APIClient {
  /**
   * Récupère des données depuis l'URL donnée
   */
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  
  /**
   * Crée une ressource avec les données fournies
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  
  /**
   * Met à jour partiellement une ressource
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  /**
   * Remplace complètement une ressource
   */
  put = (url, data) => {
    return axios.put(url, data);
  };
  
  /**
   * Supprime une ressource
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

/**
 * Récupère l'utilisateur connecté
 * @deprecated Utilisez getAuthData() à la place
 */
const getLoggedinUser = () => {
  const authData = getAuthData();
  return authData.user ? authData.user : null;
};

export { APIClient, setAuthorization, getLoggedinUser };