// src/utils/subscriptionLimits.js

export const subscriptionLimits = {
  'INWOSALES': {
    'ESSENTIEL': {
      maxUsers: 1,
      allowsAddingUsers: true,
      baseUsers: 1
    },
    'PROFESSIONNEL': {
      maxUsers: 5,
      allowsAddingUsers: true,
      baseUsers: 1
    },
    'BUSINESS': {
      maxUsers: 20,
      allowsAddingUsers: true,
      baseUsers: 1
    }
  },
  'INAWOSTOCK': {
    'ESSENTIEL': {
      maxUsers: 1,
      allowsAddingUsers: true,
      baseUsers: 1
    },
    'PROFESSIONNEL': {
      maxUsers: 5,
      allowsAddingUsers: true,
      baseUsers: 1
    },
    'BUSINESS': {
      maxUsers: 20,
      allowsAddingUsers: true,
      baseUsers: 1
    }
  },
  'INAWO GLOBAL': {
    'ESSENTIEL': {
      maxUsers: 5,
      allowsAddingUsers: true,
      baseUsers: 5
    },
    'PROFESSIONNEL': {
      maxUsers: 10,
      allowsAddingUsers: true,
      baseUsers: 5
    },
    'BUSINESS': {
      maxUsers: 25,
      allowsAddingUsers: true,
      baseUsers: 5
    }
  }
};

// Fonction pour vérifier si on peut ajouter plus d'utilisateurs
export const canAddMoreUsers = (currentCount, maxUsers) => {
  return currentCount < maxUsers;
};

// Fonction pour obtenir les slots restants
export const getRemainingSlots = (currentCount, maxUsers) => {
  return Math.max(0, maxUsers - currentCount);
};