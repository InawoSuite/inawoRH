// src/contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('userProfile');
        
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
        
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Mettre à jour les données utilisateur
  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
    
    // Mettre à jour le localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...newData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Mettre à jour le profil utilisateur
  const updateUserProfile = (newProfile) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
    
    // Mettre à jour le localStorage
    const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const updatedProfile = { ...currentProfile, ...newProfile };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  // Rafraîchir les données depuis l'API
  const refreshUserData = async (userId, token) => {
    try {
      // Guard: vérifier que userId n'est pas undefined/null
      if (!userId || !token) {
        console.warn('[UserContext] refreshUserData: userId ou token manquant', { userId, token });
        return;
      }
      
      setLoading(true);
      const response = await fetch(
        `https://inawoapiv3.inawo.pro/utilisateurs/getuser/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userData,
    userProfile,
    loading,
    updateUserData,
    updateUserProfile,
    refreshUserData,
    setUserData,
    setUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};