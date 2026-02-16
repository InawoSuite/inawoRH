// src/components/RouteWrapper.js
import React from 'react';
import { useLocation, Navigate, useParams } from 'react-router-dom';
import { getAuthData } from '../utils/authUtils';
import { useProfile } from "./Hooks/UserHooks";

const RouteWrapper = ({ children }) => {
  const location = useLocation();
  const params = useParams();
  const authData = getAuthData();
  const {userProfile, token} = useProfile();
  
  // Si pas d'utilisateur connecté, laisser passer (routes publiques)
  if (!authData.user) {
    return children;
  }
  
  // Récupérer le nom de l'entreprise
  // const entrepriseNom = authData.user?.entreprise?.nom || 'mon_entreprise';
  const entrepriseNom = userProfile?.entreprise?.nom || 'mon_entreprise';
  
  // Nettoyer le nom pour l'URL
  const cleanEntrepriseName = entrepriseNom
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const currentPath = location.pathname;

  // console.log("nom entreprise",entrepriseNom)

  // 🔴 CAS 1: URL avec "mon_entreprise" → rediriger vers le vrai nom
  if (currentPath.includes('/mon_entreprise')) {
    const newPath = currentPath.replace(
      '/mon_entreprise',
      `/${cleanEntrepriseName}`
    );
    // console.log("🔴 Redirection CAS 1 vers:", newPath);
    return <Navigate to={newPath} replace />;
  }

  // 🔴 CAS 2: URL sans entreprise mais utilisateur connecté → ajouter entreprise
  if (!currentPath.includes('/') && 
      !currentPath.includes('/connexion') &&
      !currentPath.includes('/forgot-password') &&
      !currentPath.includes('/register')) {
    const newPath = `/${cleanEntrepriseName}${currentPath === '/' ? '/dashboard' : currentPath}`;
    // console.log("🔴 Redirection CAS 2 vers:", newPath);
    return <Navigate to={newPath} replace />;
  }

  // 🔴 CAS 3: Mauvais nom d'entreprise dans l'URL → corriger
  if (params.entreprise && params.entreprise !== cleanEntrepriseName) {
    const newPath = currentPath.replace(
      `/${params.entreprise}`,
      `/${cleanEntrepriseName}`
    );
    // console.log("🔴 Redirection CAS 3 vers:", newPath);
    return <Navigate to={newPath} replace />;
  }

  return children;
};

export default RouteWrapper;