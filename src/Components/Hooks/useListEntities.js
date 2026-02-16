import { useEntityData } from './useEntityData';
// import { useEntityNavigation, getCommercialName, getContactName } from '../utils/entityUtils';
import { useEntityNavigation, getCommercialName, getContactName } from '../../utils/entityUtils';

export const useListEntities = () => {
  const entityData = useEntityData();
  const navigation = useEntityNavigation();

  // Fonction pour enrichir les données avec les noms
  const enrichDataWithNames = (data, t) => {
    return data.map(item => ({
      ...item,
      // Si l'item a un commercialId, on ajoute le nom
      ...(item.commercialId && {
        commercial: getCommercialName(item.commercialId, entityData.commercials, t)
      }),
      // Si l'item a un contactId, on ajoute le nom
      ...(item.contactId && {
        contact: getContactName(item.contactId, entityData.contacts, t)
      }),
      // Si l'item a un clientId (alias de contact), on ajoute le nom
      ...(item.clientId && {
        client: getContactName(item.clientId, entityData.contacts, t)
      })
    }));
  };

  return {
    // Données des entités
    commercials: entityData.commercials,
    contacts: entityData.contacts,
    entitiesLoading: entityData.loading,
    entitiesError: entityData.error,
    
    // Fonctions de navigation
    ...navigation,
    
    // Fonctions utilitaires
    getCommercialName: (commercialId, t) => getCommercialName(commercialId, entityData.commercials, t),
    getContactName: (contactId, t) => getContactName(contactId, entityData.contacts, t),
    
    // Fonction d'enrichissement
    enrichDataWithNames,
    
    // Rechargement
    refetchEntities: entityData.refetch
  };
};