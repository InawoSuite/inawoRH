// src/hooks/useAutoLogout.js
import { useEffect } from 'react';
import { clearAuthData } from '../utils/authUtils';

const useAutoLogout = () => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // 🔹 Déconnexion immédiate quand l'utilisateur quitte
      console.log('Utilisateur quitte la page - Déconnexion automatique');
      clearAuthData();
      
      // Optionnel: Message de confirmation
      // event.preventDefault();
      // event.returnValue = 'Êtes-vous sûr de vouloir quitter ?';
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 🔹 Déconnexion quand l'onglet devient invisible (après un délai)
        console.log('Onglet caché - Déconnexion programmée');
        setTimeout(() => {
          if (document.hidden) {
            clearAuthData();
            window.location.href = '/fr/connexion';
          }
        }, 30000); // 30 secondes après que l'onglet soit caché
      }
    };

    // Événement quand l'utilisateur quitte la page
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Événement quand l'onglet change de visibilité
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

export default useAutoLogout;