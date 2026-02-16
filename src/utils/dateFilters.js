// // utils/dateFilters.js

// /**
//  * Fonction pour calculer la différence en jours entre deux dates
//  */
// const getDaysDifference = (date) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const compareDate = new Date(date);
//   compareDate.setHours(0, 0, 0, 0);
  
//   const diffTime = today - compareDate;
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
//   return diffDays;
// };

// /**
//  * Fonction pour classifier une date dans une catégorie
//  */
// export const classifyByDate = (date) => {
//   if (!date) return 'all';
  
//   const daysDiff = getDaysDifference(date);
  
//   if (daysDiff === 0) return 'today';
//   if (daysDiff === 1) return 'yesterday';
//   if (daysDiff >= 2 && daysDiff <= 7) return 'recent';
//   if (daysDiff >= 8 && daysDiff <= 30) return 'thisMonth';
//   if (daysDiff > 30) return 'older';
  
//   return 'all';
// };

// /**
//  * Fonction pour filtrer un tableau de données par catégorie de date
//  * @param {Array} data - Tableau de données
//  * @param {string} category - Catégorie ('all', 'today', 'yesterday', 'recent', 'thisMonth', 'older')
//  * @param {string} dateField - Nom du champ contenant la date (ex: 'createdAt', 'date', 'timestamp')
//  */
// export const filterByDateCategory = (data, category, dateField = 'createdAt') => {
//   if (category === 'all') return data;
  
//   return data.filter(item => {
//     const itemCategory = classifyByDate(item[dateField]);
//     return itemCategory === category;
//   });
// };

// /**
//  * Fonction pour compter les éléments par catégorie
//  * @param {Array} data - Tableau de données
//  * @param {string} dateField - Nom du champ contenant la date
//  */
// export const getDateCategoryCounts = (data, dateField = 'createdAt') => {
//   const counts = {
//     all: data.length,
//     today: 0,
//     yesterday: 0,
//     recent: 0,
//     thisMonth: 0,
//     older: 0
//   };
  
//   data.forEach(item => {
//     const category = classifyByDate(item[dateField]);
//     if (counts[category] !== undefined) {
//       counts[category]++;
//     }
//   });
  
//   return counts;
// };

// /**
//  * Configuration des onglets de filtrage par date
//  * @param {Object} counts - Objet contenant les compteurs par catégorie
//  */
// export const getDateFilterTabs = (counts) => {
//   return [
//     {
//       key: 'all',
//       label: 'Tous',
//       icon: 'ri-list-check',
//       count: counts.all
//     },
//     {
//       key: 'today',
//       label: "Aujourd'hui",
//       icon: 'ri-calendar-today-line',
//       count: counts.today
//     },
//     {
//       key: 'recent',
//       label: 'Plus Récentes',
//       icon: 'ri-time-line',
//       count: counts.recent
//     },
//     {
//       key: 'thisMonth',
//       label: 'Cette Semaine',
//       icon: 'ri-calendar-week-line',
//       count: counts.thisMonth
//     },
//     {
//       key: 'older',
//       label: 'Anciennes',
//       icon: 'ri-calendar-2-line',
//       count: counts.older
//     }
//   ];
// };


// utils/dateFilters.js

/**
 * Normalise une date en début de journée (00:00:00)
 */
const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Obtient le début de la semaine actuelle (lundi)
 */
const getStartOfWeek = (date = new Date()) => {
  const d = normalizeDate(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuster si dimanche
  return new Date(d.setDate(diff));
};

/**
 * Obtient le début du mois actuel
 */
const getStartOfMonth = (date = new Date()) => {
  const d = normalizeDate(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

/**
 * Calcule la différence en jours entre deux dates
 */
const getDaysDifference = (date) => {
  const today = normalizeDate(new Date());
  const compareDate = normalizeDate(date);
  
  const diffTime = today - compareDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Calcule la différence en minutes
 */
const getMinutesDifference = (date) => {
  const now = new Date();
  const compareDate = new Date(date);
  const diffTime = now - compareDate;
  return Math.floor(diffTime / (1000 * 60));
};

/**
 * Fonction pour classifier une date dans une catégorie (VERSION AMÉLIORÉE)
 * @param {string|Date} date - La date à classifier
 * @returns {string} - Catégorie de date
 */
export const classifyByDate = (date) => {
  if (!date) return 'all';
  
  const itemDate = new Date(date);
  const now = new Date();
  const today = normalizeDate(now);
  const itemDay = normalizeDate(itemDate);
  
  // Calculer les différences
  const daysDiff = getDaysDifference(itemDate);
  const minutesDiff = getMinutesDifference(itemDate);
  
  // Aujourd'hui (moins de 24h et même jour calendaire)
  if (itemDay.getTime() === today.getTime()) {
    return 'today';
  }
  
  // Hier (jour calendaire précédent)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (itemDay.getTime() === yesterday.getTime()) {
    return 'yesterday';
  }
  
  // Cette semaine (2-6 jours, jusqu'au dimanche précédent)
  if (daysDiff >= 2 && daysDiff <= 7) {
    return 'thisWeek';
  }
  
  // Semaine dernière (7-13 jours)
  if (daysDiff >= 8 && daysDiff <= 14) {
    return 'lastWeek';
  }
  
  // Ce mois (14-30 jours du mois en cours)
  const startOfMonth = getStartOfMonth(now);
  if (itemDate >= startOfMonth && daysDiff > 14) {
    return 'thisMonth';
  }
  
  // Mois dernier (mois calendaire précédent)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  if (itemDate >= startOfLastMonth && itemDate <= endOfLastMonth) {
    return 'lastMonth';
  }
  
  // Plus ancien (> 60 jours)
  if (daysDiff > 60) {
    return 'older';
  }
  
  return 'all';
};

/**
 * Fonction pour filtrer un tableau de données par catégorie de date
 * @param {Array} data - Tableau de données
 * @param {string} category - Catégorie de filtre
 * @param {string} dateField - Nom du champ contenant la date
 * @returns {Array} - Données filtrées
 */
export const filterByDateCategory = (data, category, dateField = 'created_at') => {
  if (!data || !Array.isArray(data)) return [];
  if (category === 'all') return data;
  
  return data.filter(item => {
    const itemDate = item[dateField];
    if (!itemDate) return false;
    
    const itemCategory = classifyByDate(itemDate);
    return itemCategory === category;
  });
};

/**
 * Fonction pour compter les éléments par catégorie (VERSION OPTIMISÉE)
 * @param {Array} data - Tableau de données
 * @param {string} dateField - Nom du champ contenant la date
 * @returns {Object} - Compteurs par catégorie
 */
export const getDateCategoryCounts = (data, dateField = 'created_at') => {
  if (!data || !Array.isArray(data)) {
    return {
      all: 0,
      today: 0,
      yesterday: 0,
      thisWeek: 0,
      lastWeek: 0,
      thisMonth: 0,
      lastMonth: 0,
      older: 0
    };
  }
  
  const counts = {
    all: data.length,
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    lastWeek: 0,
    thisMonth: 0,
    lastMonth: 0,
    older: 0
  };
  
  data.forEach(item => {
    const itemDate = item[dateField];
    if (!itemDate) return;
    
    const category = classifyByDate(itemDate);
    if (counts[category] !== undefined) {
      counts[category]++;
    }
  });
  
  return counts;
};

/**
 * Configuration des onglets de filtrage (VERSION AMÉLIORÉE)
 * @param {Object} counts - Compteurs par catégorie
 * @returns {Array} - Configuration des onglets
 */
export const getDateFilterTabs = (counts) => {
  return [
    {
      key: 'all',
      label: 'Tous',
      icon: 'ri-list-check',
      count: counts.all,
      description: 'Tous les éléments'
    },
    {
      key: 'today',
      label: "Aujourd'hui",
      icon: 'ri-calendar-today-line',
      count: counts.today,
      description: 'Éléments créés aujourd\'hui'
    },
    {
      key: 'yesterday',
      label: 'Hier',
      icon: 'ri-calendar-event-line',
      count: counts.yesterday,
      description: 'Éléments créés hier'
    },
    {
      key: 'thisWeek',
      label: 'Cette semaine',
      icon: 'ri-calendar-week-line',
      count: counts.thisWeek,
      description: '2 à 7 derniers jours'
    },
    {
      key: 'lastWeek',
      label: 'Semaine dernière',
      icon: 'ri-calendar-line',
      count: counts.lastWeek,
      description: '8 à 14 derniers jours'
    },
    {
      key: 'thisMonth',
      label: 'Ce mois',
      icon: 'ri-calendar-2-line',
      count: counts.thisMonth,
      description: 'Éléments du mois en cours'
    },
    {
      key: 'lastMonth',
      label: 'Mois dernier',
      icon: 'ri-calendar-check-line',
      count: counts.lastMonth,
      description: 'Éléments du mois précédent'
    },
    {
      key: 'older',
      label: 'Plus ancien',
      icon: 'ri-time-line',
      count: counts.older,
      description: 'Plus de 60 jours'
    }
  ].filter(tab => tab.count > 0); // Ne montrer que les onglets avec du contenu
};

/**
 * Fonction pour formater l'affichage de la date relative
 * @param {string|Date} date - La date à formater
 * @returns {string} - Texte formaté
 */
export const getRelativeDateLabel = (date) => {
  if (!date) return 'Date inconnue';
  
  const minutesDiff = getMinutesDifference(date);
  const daysDiff = getDaysDifference(date);
  
  // Moins d'une minute
  if (minutesDiff < 1) return "À l'instant";
  
  // Moins d'une heure (afficher les minutes)
  if (minutesDiff < 60) {
    return `Il y a ${minutesDiff} min`;
  }
  
  // Moins de 24h (afficher les heures)
  if (minutesDiff < 1440) {
    const hours = Math.floor(minutesDiff / 60);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  // Aujourd'hui
  const itemDay = normalizeDate(date);
  const today = normalizeDate(new Date());
  if (itemDay.getTime() === today.getTime()) {
    return "Aujourd'hui";
  }
  
  // Hier
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (itemDay.getTime() === yesterday.getTime()) {
    return "Hier";
  }
  
  // Cette semaine
  if (daysDiff >= 2 && daysDiff <= 7) {
    return `Il y a ${daysDiff} jours`;
  }
  
  // Plus ancien
  if (daysDiff > 7 && daysDiff <= 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  
  if (daysDiff > 30) {
    const months = Math.floor(daysDiff / 30);
    return `Il y a ${months} mois`;
  }
  
  return 'Date inconnue';
};

/**
 * Hook React personnalisé pour gérer le filtrage par date
 * @param {Array} data - Données à filtrer
 * @param {string} dateField - Champ de date
 */
export const useDateFilter = (data, dateField = 'created_at') => {
  const [activeFilter, setActiveFilter] = React.useState('all');
  
  // Calculer les compteurs
  const counts = React.useMemo(
    () => getDateCategoryCounts(data, dateField),
    [data, dateField]
  );
  
  // Obtenir les onglets de filtre
  const tabs = React.useMemo(
    () => getDateFilterTabs(counts),
    [counts]
  );
  
  // Filtrer les données
  const filteredData = React.useMemo(
    () => filterByDateCategory(data, activeFilter, dateField),
    [data, activeFilter, dateField]
  );
  
  return {
    activeFilter,
    setActiveFilter,
    filteredData,
    counts,
    tabs
  };
};

export default {
  classifyByDate,
  filterByDateCategory,
  getDateCategoryCounts,
  getDateFilterTabs,
  getRelativeDateLabel,
  useDateFilter
};