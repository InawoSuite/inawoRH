// src/hooks/useDynamicRoutes.js
import { useProfile } from "./UserHooks";
import { authProtectedRoutes, publicRoutes } from "../../Routes/allRoutes";

export const useDynamicRoutes = () => {
  const { userProfile } = useProfile();
  
  const companyPath = userProfile?.entreprise?.nom?.toLowerCase().replace(/\s+/g, '_') || 'mon_entreprise';

  const processedRoutes = {
    authProtectedRoutes: authProtectedRoutes.map(route => ({
      ...route,
      path: route.path?.replace('mon_entreprise', companyPath) || route.path
    })),
    publicRoutes: [...publicRoutes]
  };

  return processedRoutes;
};