export const saveAuthData = (data, rememberMe = false) => {
  // 🔹 TOUJOURS utiliser sessionStorage pour plus de sécurité
  const storage = sessionStorage;

  
  
  if (data.access_token) {
    storage.setItem('token', data.access_token);
  }
  
  // ✅ CORRECTION : Sauvegarder le refresh_token s'il existe
  if (data.refresh_token) {
    storage.setItem('refresh_token', data.refresh_token);
  } else {
    // ✅ Fallback : utiliser l'access_token comme refresh_token si non fourni
    storage.setItem('refresh_token', data.access_token);
  }
  
  if (data.user) {
    storage.setItem('user', JSON.stringify(data.user));
  }
  
  // 🔹 Optionnel: Si "Se souvenir de moi" est coché, sauvegarder aussi dans localStorage
  if (rememberMe) {
    localStorage.setItem('rememberedToken', data.access_token);
    localStorage.setItem('rememberedRefreshToken', data.refresh_token || data.access_token);
    localStorage.setItem('rememberedUser', JSON.stringify(data.user));
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('rememberMe');
  }
};

export const getAuthData = () => {
  // 🔹 Priorité à sessionStorage
  let token = sessionStorage.getItem('token');
  let refresh_token = sessionStorage.getItem('refresh_token');
  let user = sessionStorage.getItem('user');
  
  // 🔹 Si pas de session, vérifier le "Se souvenir de moi"
  if (!token) {
    token = localStorage.getItem('rememberedToken');
    refresh_token = localStorage.getItem('rememberedRefreshToken');
    user = localStorage.getItem('rememberedUser');
    
    // 🔹 Migrer vers sessionStorage si trouvé dans localStorage
    if (token && user) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('refresh_token', refresh_token || token);
      sessionStorage.setItem('user', user);
    }
  }
  
  // ✅ CORRECTION : Retourner le refresh_token
  return {
    access_token: token,
    refresh_token: refresh_token || token, // Fallback si pas de refresh_token
    user: user ? JSON.parse(user) : null
  };
};

export const clearAuthData = () => {
  // 🔹 Nettoyer sessionStorage (déconnexion automatique à la fermeture)
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('user');
  
  // 🔹 Optionnel: Nettoyer aussi localStorage si besoin
  localStorage.removeItem('rememberedToken');
  localStorage.removeItem('rememberedRefreshToken');
  localStorage.removeItem('rememberedUser');
  localStorage.removeItem('rememberMe');
};

// Nettoyer les données dupliquées
export const cleanupStorageData = () => {
  // Si les deux objets existent, consolider dans 'user'
  const userData = localStorage.getItem('userData');
  const user = localStorage.getItem('user');
  
  if (userData && !user) {
    localStorage.setItem('user', userData);
    localStorage.removeItem('userData');
  } else if (user && userData) {
    // Garder uniquement 'user'
    localStorage.removeItem('userData');
  }
};

// Récupère les groupes (succursales) de l'utilisateur
export const getUserGroups = () => {
  const authData = getAuthData();
  if (!authData.user) return [];
  
  try {
    return authData.user.groupes || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return [];
  }
};

// Récupère les magasins de l'utilisateur
export const getUserMagasins = (groupeId = null) => {
  const authData = getAuthData();
  if (!authData.user) return [];
  
  try {
    const magasins = authData.user.magasins || [];
    
    // Si un ID de groupe est fourni, filtrer les magasins par groupe
    if (groupeId !== null) {
      return magasins.filter(magasin => magasin.groupe_id === parseInt(groupeId));
    }
    
    return magasins;
  } catch (error) {
    console.error('Erreur lors de la récupération des magasins:', error);
    return [];
  }
};

// export const saveAuthData = (data, rememberMe = false) => {
//   // 🔹 TOUJOURS utiliser sessionStorage pour plus de sécurité
//   const storage = sessionStorage; // Forcer sessionStorage pour la déconnexion automatique
  
//   if (data.access_token) {
//     storage.setItem('token', data.access_token);
//   }
  
//   if (data.user) {
//     storage.setItem('user', JSON.stringify(data.user));
//   }
  
//   // 🔹 Optionnel: Si "Se souvenir de moi" est coché, sauvegarder aussi dans localStorage
//   if (rememberMe) {
//     localStorage.setItem('rememberedToken', data.access_token);
//     localStorage.setItem('rememberedUser', JSON.stringify(data.user));
//   }
// };

// export const getAuthData = () => {
//   // 🔹 Priorité à sessionStorage
//   let token = sessionStorage.getItem('token');
//   let user = sessionStorage.getItem('user');
  
//   // 🔹 Si pas de session, vérifier le "Se souvenir de moi"
//   if (!token) {
//     token = localStorage.getItem('rememberedToken');
//     user = localStorage.getItem('rememberedUser');
    
//     // 🔹 Migrer vers sessionStorage si trouvé dans localStorage
//     if (token && user) {
//       sessionStorage.setItem('token', token);
//       sessionStorage.setItem('user', user);
//     }
//   }
  
//   return {
//     access_token: token,
//     user: user ? JSON.parse(user) : null
//   };
// };

// export const clearAuthData = () => {
//   // 🔹 Nettoyer sessionStorage (déconnexion automatique à la fermeture)
//   sessionStorage.clear()

// }

// // Nettoyer les données dupliquées
// export const cleanupStorageData = () => {
//   // Si les deux objets existent, consolider dans 'user'
//   const userData = localStorage.getItem('userData');
//   const user = localStorage.getItem('user');
  
//   if (userData && !user) {
//     localStorage.setItem('user', userData);
//     localStorage.removeItem('userData');
//   } else if (user && userData) {
//     // Garder uniquement 'user'
//     localStorage.removeItem('userData');
//   }
// };

// // Récupère les groupes (succursales) de l'utilisateur
// export const getUserGroups = () => {
//   const userData = localStorage.getItem('user');
//   if (!userData) return [];
  
//   try {
//     const parsedData = JSON.parse(userData);
//     return parsedData.groupes || [];
//   } catch (error) {
//     console.error('Erreur lors de la récupération des groupes:', error);
//     return [];
//   }
// };

// // Récupère les magasins de l'utilisateur
// export const getUserMagasins = (groupeId = null) => {
//   const userData = localStorage.getItem('user');
//   if (!userData) return [];
  
//   try {
//     const parsedData = JSON.parse(userData);
//     const magasins = parsedData.magasins || [];
    
//     // Si un ID de groupe est fourni, filtrer les magasins par groupe
//     if (groupeId !== null) {
//       return magasins.filter(magasin => magasin.groupe_id === parseInt(groupeId));
//     }
    
//     return magasins;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des magasins:', error);
//     return [];
//   }
// };
