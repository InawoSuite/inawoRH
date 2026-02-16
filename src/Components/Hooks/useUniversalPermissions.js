// src/Components/Hooks/useUniversalPermissions.js
import { useState, useEffect } from "react";
import { useProfile } from "./UserHooks";

export const useUniversalPermissions = () => {
  const { userProfile, token } = useProfile();
  const [userPermissions, setUserPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const fetchUserPermissions = async () => {
    if (!userProfile?.id || !token) {
      setPermissionsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://inawoapiv3.inawo.pro/utilisateurs/userspermission/${userProfile.id}/`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const permissionsData = await response.json();
      setUserPermissions(permissionsData);
      
    } catch (error) {
      console.error(" Erreur récupération permissions:", error);
      setUserPermissions({ is_admin: false, permissions: [] });
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [userProfile?.id, token]);

  const hasPermission = (permissionCode) => {
    if (permissionsLoading || !userPermissions) return false;
    if (userPermissions.is_admin === true) return true;
    if (!permissionCode) return true;
    return userPermissions.permissions.includes(permissionCode);
  };

  const hasAnyPermission = (permissionCodes) => {
    return permissionCodes.some(code => hasPermission(code));
  };

  const hasAllPermissions = (permissionCodes) => {
    return permissionCodes.every(code => hasPermission(code));
  };

  return {
    userPermissions,
    permissionsLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: userPermissions?.is_admin === true,
    refetchPermissions: fetchUserPermissions
  };
};