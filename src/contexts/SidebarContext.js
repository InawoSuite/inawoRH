// SidebarContext.js - Exemple de structure correcte
import React, { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const activateSidebarMenu = (menuId) => {
    console.log("SidebarContext: Setting active menu to", menuId); // Debug
    setActiveMenu(menuId);
  };
  
  const value = {
    activeMenu,
    setActiveMenu,
    activateSidebarMenu
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};