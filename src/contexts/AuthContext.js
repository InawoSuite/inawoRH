// src/contexts/AuthContext.js
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useProfile } from "../Components/Hooks/UserHooks";
import { ROLE_PERMISSIONS } from '../config/permissions';
import { clearAuthData, getAuthData } from '../utils/authUtils';
// import { logoutSuccess } from '../slices/auth/login/reducer';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { userProfile, loading, token } = useProfile();
  
  // 🔹 CORRECTION: Utiliser "Login" au lieu de "auth"
  const loginState = useSelector(state => state.Login || {});
  const dispatch = useDispatch();
  
  const [sessionTimer, setSessionTimer] = useState(null);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  // 🔹 CORRECTION: Prendre l'user de loginState ou userProfile
  const currentUser = useMemo(() => {
    return loginState.user || userProfile || null;
  }, [loginState.user, userProfile]);

  const userPermissions = useMemo(() => {
    if (!currentUser) return new Set();
    
    const userType = currentUser.type_utilisateur?.toLowerCase();
    const permissions = ROLE_PERMISSIONS[userType] || [];
    
    return new Set(permissions);
  }, [currentUser]);

  // 🔹 Déconnexion automatique
  const autoLogout = (reason = 'session_expired') => {
    console.log(`Déconnexion automatique: ${reason}`);
    
    // Nettoyer les timers
    if (sessionTimer) clearTimeout(sessionTimer);
    if (inactivityTimer) clearInterval(inactivityTimer);
    
    // Clear storage et state
    clearAuthData();
    // dispatch(logoutSuccess());
    
    // Redirection vers login avec message
    const message = reason === 'session_expired' 
      ? 'Votre session a expiré pour des raisons de sécurité' 
      : 'Vous avez été inactif trop longtemps';
    
    sessionStorage.setItem('logoutReason', message);
    window.location.href = '/fr/connexion';
  };

  // 🔹 Démarrer le timer de session
  const startSessionTimer = () => {
    if (sessionTimer) clearTimeout(sessionTimer);
    
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 heures
    
    const timer = setTimeout(() => {
      autoLogout('session_expired');
    }, sessionDuration);
    
    setSessionTimer(timer);
  };

  // 🔹 Démarrer le timer d'inactivité
  const startInactivityTimer = () => {
    if (inactivityTimer) clearInterval(inactivityTimer);
    
    const maxInactivityTime = 30 * 60 * 1000; // 30 minutes
    
    localStorage.setItem('lastActivity', Date.now().toString());
    
    const timer = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity);
        
        if (inactiveTime > maxInactivityTime && currentUser) {
          autoLogout('inactivity');
        }
      }
    }, 60000);
    
    setInactivityTimer(timer);
  };

  // 🔹 Réinitialiser l'activité utilisateur
  const resetInactivityTimer = () => {
    if (currentUser) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  };

  // 🔹 Écouter les événements d'activité utilisateur
  useEffect(() => {
    if (currentUser) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const handleActivity = () => resetInactivityTimer();
      
      events.forEach(event => {
        document.addEventListener(event, handleActivity);
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [currentUser]);

  // 🔹 Initialiser les timers quand l'utilisateur se connecte
  useEffect(() => {
    if (currentUser && !loading && token) {
      startSessionTimer();
      startInactivityTimer();
      console.log('Timers de session démarrés pour:', currentUser.email);
    } else if (!currentUser && !loading) {
      // Nettoyer les timers si déconnecté
      if (sessionTimer) clearTimeout(sessionTimer);
      if (inactivityTimer) clearInterval(inactivityTimer);
    }
    
    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      if (inactivityTimer) clearInterval(inactivityTimer);
    };
  }, [currentUser, loading, token]);

  const hasPermission = (permission) => {
    return userPermissions.has(permission);
  };

  const can = (action, resource) => {
    const permissionString = `${action}_${resource}`;
    return hasPermission(permissionString);
  };

  // 🔹 Fonction de déconnexion manuelle
  const logout = (reason = 'manual') => {
    autoLogout(reason);
  };

  // 🔹 Valeur du contexte
  const value = {
    user: currentUser,
    loading: loading || false,
    isAuthenticated: !!currentUser && !!token,
    hasPermission,
    can,
    isAdmin: currentUser?.type_utilisateur?.toLowerCase() === 'administrateur',
    isCollaborator: currentUser?.type_utilisateur?.toLowerCase() === 'collaborateur',
    isObserver: currentUser?.type_utilisateur?.toLowerCase() === 'observateur',
    permissions: Array.from(userPermissions),
    logout,
    resetInactivityTimer
  };

  // Temporairement dans AuthContext.js pour debugger
useEffect(() => {
  console.log('Structure du store Redux:', {
    loginState: loginState,
    userProfile: userProfile,
    token: token
  });
}, [loginState, userProfile, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};