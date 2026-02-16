// import { useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSidebar } from '../../contexts/SidebarContext';

// export const useMenuNavigation = () => {
//   const { activeMenu, setActiveMenu } = useSidebar();
//   const navigate = useNavigate();

//   const handleMainMenuClick = useCallback((menuId, e, callback) => {
//     e.preventDefault();
//     setActiveMenu(menuId);
    
//     // Stocker le menuId dans sessionStorage pour persister l'état
//     sessionStorage.setItem('activeMainMenu', menuId);
    
//     if (callback) {
//       callback(e);
//     }
//   }, [setActiveMenu]);

//   const handleSubMenuClick = useCallback((subMenuId, link, onClick) => {
//     setActiveMenu(subMenuId);
    
//     if (onClick) {
//       onClick();
//     } else if (link && link !== "/#") {
//       navigate(link);
//     }
//   }, [setActiveMenu, navigate]);

//   // Fonction pour récupérer le menu principal actif
//   const getActiveMainMenu = useCallback(() => {
//     return sessionStorage.getItem('activeMainMenu') || 'Dashboard';
//   }, []);

//   return {
//     activeMenu,
//     handleMainMenuClick,
//     handleSubMenuClick,
//     getActiveMainMenu
//   };
// };


import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';

export const useMenuNavigation = () => {
  const { activeMenu, setActiveMenu, setIsMobileMenuOpen } = useSidebar();
  const navigate = useNavigate();

  const handleMainMenuClick = useCallback((menuId, e, callback) => {
    e.preventDefault();
    setActiveMenu(menuId);
    
    // Stocker le menuId dans sessionStorage pour persister l'état
    sessionStorage.setItem('activeMainMenu', menuId);
    
    if (callback) {
      callback(e);
    }
  }, [setActiveMenu]);

  const handleSubMenuClick = useCallback((subMenuId, link, onClick) => {
    setActiveMenu(subMenuId);
    
    // Fermer le menu mobile après clic sur sous-menu
    if (window.innerWidth <= 991) {
      setIsMobileMenuOpen(false);
      document.body.classList.remove('vertical-sidebar-enable');
    }
    
    if (onClick) {
      onClick();
    } else if (link && link !== "/#") {
      navigate(link);
    }
  }, [setActiveMenu, navigate, setIsMobileMenuOpen]);

  // Fonction pour récupérer le menu principal actif
  const getActiveMainMenu = useCallback(() => {
    return sessionStorage.getItem('activeMainMenu') || 'Dashboard';
  }, []);

  return {
    activeMenu,
    handleMainMenuClick,
    handleSubMenuClick,
    getActiveMainMenu
  };
};