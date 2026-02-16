// src/hooks/useMenuLinks.js
import { useMemo } from 'react';
import { getAuthData } from '../../utils/authUtils';

export const useMenuLinks = () => {
  const authData = getAuthData();
  
  return useMemo(() => {
    const entrepriseNom = authData.user?.entreprise?.nom || 'mon_entreprise';
    const cleanEntrepriseName = entrepriseNom
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const generatePath = (path) => {
      // Si le chemin commence déjà par suite.inawo.pro, le transformer
      if (path.startsWith('/mon_entreprise')) {
        return path.replace('/mon_entreprise', `/${cleanEntrepriseName}`);
      }
      if (path.startsWith('/:entreprise')) {
        return path.replace('/:entreprise', `/${cleanEntrepriseName}`);
      }
      // Pour les chemins simples comme "/dashboard"
      return `/${cleanEntrepriseName}${path.startsWith('/') ? path : '/' + path}`;
    };

    return {
      nom: entrepriseNom,
      nomUrl: cleanEntrepriseName,
      generatePath
    };
  }, [authData.user]);
};