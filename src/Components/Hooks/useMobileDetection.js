// hooks/useMobileDetection.js
import { useState, useEffect } from 'react';

export const useMobileDetection = (breakpoint = 991) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth <= breakpoint;
    };

    // Vérifier au chargement
    setIsMobile(checkMobile());

    // Écouter les changements de taille
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    
    // Nettoyer l'event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};