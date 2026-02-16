// src/contexts/NavigationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentMenuId, setCurrentMenuId] = useState(null);

  // Sauvegarder l'état de navigation
  const saveNavigationState = useCallback((menuId, path, label) => {
    console.log('💾 Sauvegarde navigation:', { menuId, path, label });
    
    setCurrentMenuId(menuId);
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      const existingIndex = newHistory.findIndex(item => item.menuId === menuId);
      
      if (existingIndex !== -1) {
        newHistory[existingIndex] = { menuId, path, label, timestamp: Date.now() };
      } else {
        newHistory.push({ menuId, path, label, timestamp: Date.now() });
      }
      
      return newHistory.slice(-10);
    });
  }, []);

  // Récupérer le chemin principal d'un menu
  const getMainPathForMenu = useCallback((menuId) => {
    const history = navigationHistory.find(item => item.menuId === menuId);
    console.log('🔍 Récupération chemin pour', menuId, ':', history?.path);
    return history?.path || null;
  }, [navigationHistory]);

  // Naviguer vers le chemin principal du menu
  const navigateToMainMenu = useCallback((menuId, defaultPath) => {
    const savedPath = getMainPathForMenu(menuId);
    const targetPath = savedPath || defaultPath;
    
    console.log('🧭 Navigation vers:', targetPath, '(depuis', location.pathname, ')');
    
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [navigate, location.pathname, getMainPathForMenu]);

  // Vérifier si on est sur une page de détail
  const isDetailPage = useCallback(() => {
    const detailPatterns = [
      /\/edit\/\d+/,
      /\/details?\/\d+/,
      /\/view\/\d+/,
      /\/add$/,
      /\/create$/,
      /\/new$/,
      /\/update\/\d+/,
      /\/modifier\/\d+/,
    ];
    
    const isDetail = detailPatterns.some(pattern => pattern.test(location.pathname));
    console.log('📄 Page de détail?', isDetail, '(chemin:', location.pathname, ')');
    return isDetail;
  }, [location.pathname]);

  const value = {
    navigationHistory,
    currentMenuId,
    saveNavigationState,
    getMainPathForMenu,
    navigateToMainMenu,
    isDetailPage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};