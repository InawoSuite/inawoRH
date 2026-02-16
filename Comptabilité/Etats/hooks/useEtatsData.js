// hooks/useEtatsData.js
import { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

// Import de toutes les données
import {
  NOTE_36_CODES,
  NOMENCLATURE_DATA,
  FICHE_R3_DATA,
  BILAN_ACTIF_DATA,
  BILAN_PASSIF_DATA,
  BILAN_RESULTAT_DATA,
  TFT_COMPLET_DATA,
  FICHE_4_DATA,
  NOTE_1_DATA,
  NOTE_2_DATA,
  // ... autres imports de données
} from "./etatsData";

export const useEtatsData = (activeTab, searchTerm) => {
  const [loading, setLoading] = useState(true);
  const [exportData, setExportData] = useState([]);

  // Fonction pour formater les montants
  const formatAmount = useCallback((amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Récupérer les données selon l'onglet
  const getCurrentData = useCallback(() => {
    const dataMap = {
1: "Note 36 (Tableau des codes)",
      2: "Note 36 (Nomenclature)",
      3: "Fiche R3",
      4: "Bilan Complet",
      5: "Actif",
      6: "Passif",
      7: "Résultat",
      8: "TFT - Financement par Tiers",
      9: "Fiche R4 - Immobilisations",
      10: "Note 1 - États comparatifs",
      11: "Note 2 - SIG",
      12: "Note 3A - Produits",
      13: "Note 3B - Charges",
      14: "Note 3C - Produits financiers",
      15: "Note 3D - Charges financières",
      16: "Note 3E - Opérations exceptionnelles",
      17: "Note 4 - Impôts",
      18: "Note 5 - Immobilisations",
      19: "Note 6 - Stocks",
      20: "Note 7 - Créances",
      21: "Note 8 - Disponibilités",
      22: "Note 8A - Trésorerie-actif",
      23: "Note 8B - Valeurs mobilières",
      24: "Note 8C - Placements",
      25: "Note 9 - Capital",
      26: "Note 10 - Réserves",
      27: "Note 11 - Report à nouveau",
      28: "Note 12 - Résultat",
      29: "Note 13 - Provisions",
      30: "Note 14 - Dettes financières",
      31: "Note 15 - Dettes fournisseurs",
      32: "Note 15A - Dettes fiscales",
      33: "Note 15B - Dettes sociales",
      34: "Note 15C - Autres dettes",
      35: "Note 16BIS - Comptes de liaison",
      36: "Note 16C - Écarts de conversion",
      37: "Note 17 - Engagements donnés/reçus",
      38: "Note 18 - Actifs/Passifs devises",
      39: "Note 19 - Parties liées",
      40: "Note 20 - Salaires et rémunérations",
      41: "Note 21 - Événements post-clôture",
      42: "Note 22 - Politiques comptables",
      43: "Note 23 - Taux de change",
      44: "Note 24 - Informations sectorielles",
      45: "Note 25 - Impact COVID-19",
      46: "Note 26 - Contrats de location",
      47: "Note 27 - Instruments financiers",
      48: "Note 28 - Capital risque",
      49: "Note 29 - Partenariats",
      50: "Note 30 - Développement durable",
      51: "Note 31 - Recherche & Développement",
      52: "Note 32 - Goodwill",
      53: "Note 33 - Stock-options",
      54: "Note 34 - Pensions et retraites",
      55: "Note 35 - Autres informations",
    };

    return dataMap[activeTab] || [];
  }, [activeTab]);

  // Données actuelles
  const currentData = useMemo(() => getCurrentData(), [getCurrentData]);

  // Données filtrées
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return currentData;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return currentData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [currentData, searchTerm]);

  // Titre de l'onglet actif
  const getActiveTabTitle = useMemo(() => {
    const titles = {
1: "Note 36 (Tableau des codes)",
      2: "Note 36 (Nomenclature)",
      3: "Fiche R3",
      4: "Bilan Complet",
      5: "Actif",
      6: "Passif",
      7: "Résultat",
      8: "TFT - Financement par Tiers",
      9: "Fiche R4 - Immobilisations",
      10: "Note 1 - États comparatifs",
      11: "Note 2 - SIG",
      12: "Note 3A - Produits",
      13: "Note 3B - Charges",
      14: "Note 3C - Produits financiers",
      15: "Note 3D - Charges financières",
      16: "Note 3E - Opérations exceptionnelles",
      17: "Note 4 - Impôts",
      18: "Note 5 - Immobilisations",
      19: "Note 6 - Stocks",
      20: "Note 7 - Créances",
      21: "Note 8 - Disponibilités",
      22: "Note 8A - Trésorerie-actif",
      23: "Note 8B - Valeurs mobilières",
      24: "Note 8C - Placements",
      25: "Note 9 - Capital",
      26: "Note 10 - Réserves",
      27: "Note 11 - Report à nouveau",
      28: "Note 12 - Résultat",
      29: "Note 13 - Provisions",
      30: "Note 14 - Dettes financières",
      31: "Note 15 - Dettes fournisseurs",
      32: "Note 15A - Dettes fiscales",
      33: "Note 15B - Dettes sociales",
      34: "Note 15C - Autres dettes",
      35: "Note 16BIS - Comptes de liaison",
      36: "Note 16C - Écarts de conversion",
      37: "Note 17 - Engagements donnés/reçus",
      38: "Note 18 - Actifs/Passifs devises",
      39: "Note 19 - Parties liées",
      40: "Note 20 - Salaires et rémunérations",
      41: "Note 21 - Événements post-clôture",
      42: "Note 22 - Politiques comptables",
      43: "Note 23 - Taux de change",
      44: "Note 24 - Informations sectorielles",
      45: "Note 25 - Impact COVID-19",
      46: "Note 26 - Contrats de location",
      47: "Note 27 - Instruments financiers",
      48: "Note 28 - Capital risque",
      49: "Note 29 - Partenariats",
      50: "Note 30 - Développement durable",
      51: "Note 31 - Recherche & Développement",
      52: "Note 32 - Goodwill",
      53: "Note 33 - Stock-options",
      54: "Note 34 - Pensions et retraites",
      55: "Note 35 - Autres informations",
      
    };
    return titles[activeTab] || "États Comptables";
  }, [activeTab]);

  // Fonction pour récupérer les données
  const fetchData = useCallback(async () => {
    setLoading(true);

    setTimeout(() => {
      try {
        const data = getCurrentData();
        const exportDataFormatted = data.map((item, index) => {
          const baseItem = { "N°": index + 1 };
          Object.keys(item).forEach((key) => {
            if (key !== "id") {
              const value = item[key];
              if (typeof value === "number" && value > 1000) {
                baseItem[key] = formatAmount(value);
              } else {
                baseItem[key] = value;
              }
            }
          });
          return baseItem;
        });

        setExportData(exportDataFormatted);
        toast.success("Données chargées avec succès !");
      } catch (err) {
        console.error("Erreur fetchData:", err);
        toast.error("Erreur lors du chargement des données");
        setExportData([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [activeTab, getCurrentData, formatAmount]);

  return {
    loading,
    currentData,
    filteredData,
    exportData,
    formatAmount,
    fetchData,
    getActiveTabTitle
  };
};