import { useState, useEffect, useCallback } from 'react';
import { useProfile } from './UserHooks';
import { BaseUrl } from '../../pages/APIKey/ApiKey';

export const useEntityData = () => {
  const [commercials, setCommercials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useProfile();

  // Fonction pour récupérer les commerciaux
  const fetchCommercials = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/utilisateurs/commerciaux/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setCommercials(data);
      return data;
    } catch (err) {
      console.error("Erreur lors de la récupération des commerciaux:", err);
      setCommercials([]);
      return [];
    }
  }, [token]);

  // Fonction pour récupérer les contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/utilisateurs/createlistecontacte/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      let contactsData = [];
      
      if (data?.contacts) {
        const contactsStructure = data.contacts;
        contactsData = [
          ...(contactsStructure.mes_contacts || []),
          ...(contactsStructure.contacts_collaborateurs || []),
          ...(contactsStructure.contacts_commerciaux || []),
        ];
      }
      
      setContacts(contactsData);
      return contactsData;
    } catch (err) {
      console.error("Erreur lors de la récupération des contacts:", err);
      setContacts([]);
      return [];
    }
  }, [token]);

  // Charger toutes les données
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCommercials(), fetchContacts()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchCommercials, fetchContacts]);

  // Chargement initial
  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token, loadAllData]);

  return {
    commercials,
    contacts,
    loading,
    error,
    fetchCommercials,
    fetchContacts,
    loadAllData,
    refetch: loadAllData
  };
};