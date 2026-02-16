// Gestionnaire d'authentification avec appels API
import axios from 'axios';
import { api } from '../../../config';
import { saveAuthData, clearAuthData } from '../../../utils/authUtils';
import {
  loginRequest,
  loginSuccess,
  logoutUserSuccess,
  apiError,
  clearError,
  tokenRefreshed,
  reset_login_flag
} from './reducer';

/**
 * Effectue la connexion de l'utilisateur
 * @param {Object} credentials - Informations de connexion (email, password)
 * @param {Function} navigate - Fonction de navigation (react-router-dom)
 * @param {boolean} rememberMe - Si vrai, stocker dans localStorage, sinon dans sessionStorage
 */
export const loginUser = (credentials, navigate, rememberMe = false) => async (dispatch) => {
  try {
    // Notifier le début de la requête
    dispatch(loginRequest());

    // Appel API de connexion
    const response = await axios.post(
      `${api.API_URL}/utilisateurs/connexion/`,
      {
        email: credentials.email.trim(),
        password: credentials.password.trim()
      }
    );

    // Vérifier la réponse
    if (response && response.data) {
      const { access_token, refresh_token, user } = response.data;

      if (access_token && refresh_token && user) {
        // Sauvegarder les données d'authentification
        saveAuthData({
          access_token,
          refresh_token,
          user
        }, rememberMe);

        // Mettre à jour le state Redux
        dispatch(loginSuccess({
          user,
          token: access_token,
          refreshToken: refresh_token
        }));

        // Redirection vers le dashboard
        navigate('/dashboard', { replace: true });
        return true;
      } else {
        throw new Error("Informations d'authentification incomplètes dans la réponse");
      }
    } else {
      throw new Error("Format de réponse invalide");
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    
    let errorMessage = "Erreur lors de la connexion";
    
    // Extraire le message d'erreur spécifique si disponible
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || error.response.data.error || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch(apiError({ message: errorMessage }));
    return false;
  }
};

/**
 * Déconnecte l'utilisateur
 * @param {Function} navigate - Fonction de navigation (react-router-dom)
 */
export const logoutUser = (navigate) => async (dispatch) => {
  try {
    // Si un endpoint de déconnexion existe, on peut l'appeler ici
    // await axios.post(`${api.API_URL}/auth/logout`);
    
    // Supprimer les données d'authentification
    clearAuthData();
    
    // Mettre à jour le state Redux
    dispatch(logoutUserSuccess());
    
    // Rediriger vers la page de connexion
    if (navigate) {
      navigate('/fr/connexion', { replace: true });
    } else {
      // Si navigate n'est pas disponible, recharger la page
      window.location.href = '/fr/connexion';
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    dispatch(apiError(error));
    return false;
  }
};

/**
 * Rafraîchit manuellement le token d'accès
 */
export const refreshToken = () => async (dispatch) => {
  try {
    const currentAuth = JSON.parse(localStorage.getItem('authUser') || 'null');
    if (!currentAuth?.refreshToken) {
      throw new Error("Aucun token de rafraîchissement disponible");
    }
    
    const response = await axios.post(`${api.API_URL}/utilisateurs/refresh-token/`, {
      refresh_token: currentAuth.refreshToken
    });
    
    if (response && response.data && response.data.access_token) {
      const { access_token, refresh_token } = response.data;
      
      // Mettre à jour le storage
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem('access_token', access_token);
      if (refresh_token) {
        storage.setItem('refresh_token', refresh_token);
      }
      
      // Mettre à jour le state Redux
      dispatch(tokenRefreshed({
        token: access_token,
        refreshToken: refresh_token || currentAuth.refreshToken
      }));
      
      return true;
    } else {
      throw new Error("Format de réponse invalide pour le rafraîchissement du token");
    }
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    
    // Si l'erreur est liée à l'expiration du refresh token, déconnecter l'utilisateur
    if (error.response && error.response.status === 401) {
      dispatch(logoutUser());
    } else {
      dispatch(apiError(error));
    }
    
    return false;
  }
};

/**
 * Réinitialise le drapeau de connexion
 */
export const resetLoginFlag = () => async (dispatch) => {
  dispatch(reset_login_flag());
};

/**
 * Efface les erreurs d'authentification
 */
export const clearAuthError = () => async (dispatch) => {
  dispatch(clearError());
};


// // Gestionnaire d'authentification avec appels API
// import axios from 'axios';
// import { api } from '../../../config';
// import { saveAuthData, clearAuthData } from '../../../utils/authUtils';
// import {
//   loginRequest,
//   loginSuccess,
//   logoutUserSuccess,
//   apiError,
//   clearError,
//   tokenRefreshed,
//   reset_login_flag
// } from './reducer';

// /**
//  * Effectue la connexion de l'utilisateur
//  * @param {Object} credentials - Informations de connexion (email, password)
//  * @param {Function} navigate - Fonction de navigation (react-router-dom)
//  * @param {boolean} rememberMe - Si vrai, stocker dans localStorage, sinon dans sessionStorage
//  */
// export const loginUser = (credentials, navigate, rememberMe = false) => async (dispatch) => {
//   try {
//     // Notifier le début de la requête
//     dispatch(loginRequest());

//     // Appel API de connexion
//     const response = await axios.post(
//       `${api.API_URL}/utilisateurs/connexion/`,
//       {
//         email: credentials.email.trim(),
//         password: credentials.password.trim()
//       }
//     );

//     // Vérifier la réponse
//     if (response && response.data) {
//       const { access_token, refresh_token, user } = response.data;

//       if (access_token && refresh_token && user) {
//         // Sauvegarder les données d'authentification
//         saveAuthData({
//           access_token,
//           refresh_token,
//           user
//         }, rememberMe);

//         // Mettre à jour le state Redux
//         dispatch(loginSuccess({
//           user,
//           token: access_token,
//           refreshToken: refresh_token
//         }));

//         // Redirection vers le dashboard
//         navigate('/suite.inawo.pro/:entreprise/dashboard', { replace: true });
//         return true;
//       } else {
//         throw new Error("Informations d'authentification incomplètes dans la réponse");
//       }
//     } else {
//       throw new Error("Format de réponse invalide");
//     }
//   } catch (error) {
//     console.error("Erreur de connexion:", error);
    
//     let errorMessage = "Erreur lors de la connexion";
    
//     // Extraire le message d'erreur spécifique si disponible
//     if (error.response && error.response.data) {
//       errorMessage = error.response.data.message || error.response.data.error || errorMessage;
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     dispatch(apiError({ message: errorMessage }));
//     return false;
//   }
// };

// /**
//  * Déconnecte l'utilisateur
//  * @param {Function} navigate - Fonction de navigation (react-router-dom)
//  */
// export const logoutUser = (navigate, lang = "fr") => async (dispatch) => {
//   try {
//     clearAuthData();
//     dispatch(logoutUserSuccess());

//     const redirectUrl = `/${lang}/connexion`;
//     if (navigate) {
//       navigate(redirectUrl, { replace: true });
//     } else {
//       window.location.href = redirectUrl;
//     }
//     return true;
//   } catch (error) {
//     console.error("Erreur lors de la déconnexion:", error);
//     dispatch(apiError(error));
//     return false;
//   }
// };

// /**
//  * Rafraîchit manuellement le token d'accès
//  */
// export const refreshToken = () => async (dispatch) => {
//   try {
//     const currentAuth = JSON.parse(localStorage.getItem('authUser') || 'null');
//     if (!currentAuth?.refreshToken) {
//       throw new Error("Aucun token de rafraîchissement disponible");
//     }
    
//     const response = await axios.post(`${api.API_URL}/utilisateurs/refresh-token/`, {
//       refresh_token: currentAuth.refreshToken
//     });
    
//     if (response && response.data && response.data.access_token) {
//       const { access_token, refresh_token } = response.data;
      
//       // Mettre à jour le storage
//       const rememberMe = localStorage.getItem('rememberMe') === 'true';
//       const storage = rememberMe ? localStorage : sessionStorage;
      
//       storage.setItem('access_token', access_token);
//       if (refresh_token) {
//         storage.setItem('refresh_token', refresh_token);
//       }
      
//       // Mettre à jour le state Redux
//       dispatch(tokenRefreshed({
//         token: access_token,
//         refreshToken: refresh_token || currentAuth.refreshToken
//       }));
      
//       return true;
//     } else {
//       throw new Error("Format de réponse invalide pour le rafraîchissement du token");
//     }
//   } catch (error) {
//     console.error("Erreur lors du rafraîchissement du token:", error);
    
//     // Si l'erreur est liée à l'expiration du refresh token, déconnecter l'utilisateur
//     if (error.response && error.response.status === 401) {
//       dispatch(logoutUser(navigate, lang));
//     } else {
//       dispatch(apiError(error));
//     }
    
//     return false;
//   }
// };

// /**
//  * Réinitialise le drapeau de connexion
//  */
// export const resetLoginFlag = () => async (dispatch) => {
//   dispatch(reset_login_flag());
// };

// /**
//  * Efface les erreurs d'authentification
//  */
// export const clearAuthError = () => async (dispatch) => {
//   dispatch(clearError());
// };

