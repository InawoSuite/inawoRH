// src/common/data/revenuTypes.js
const revenuTypes = {
  categories: {
    "Revenus d'exploitation": [
      { value: "ABONNEMENT", label: "Revenus d’abonnement / licences" },
      { value: "COMMISSION", label: "Revenus de commission / intermédiation" },
      { value: "CONTRAT", label: "Revenus de contrats à long terme" }
    ],
    "Revenus annexes": [
      { value: "PUBLICITE", label: "Revenus publicitaires" },
      { value: "AFFILIATION", label: "Revenus d'affiliation" },
      { value: "LOCATION", label: "Revenus de location" },
      { value: "FORMATION", label: "Revenus de formation / ateliers" },
      { value: "SPONSORING", label: "Revenus de sponsoring / partenariats" }
    ],
    "Revenus financiers": [
      { value: "INTERET", label: "Intérêts perçus" },
      { value: "DIVIDENDE", label: "Dividendes reçus" },
      { value: "PLUS_VALUE", label: "Plus-values de cession d'actifs financiers" },
      { value: "CHANGE", label: "Revenus de change" }
    ],
    "Revenus exceptionnels": [
      { value: "VENTE_ACTIF", label: "Vente d'actifs" },
      { value: "SUBVENTION", label: "Subventions / aides" },
      { value: "INDEMNISATION", label: "Indemnisations / dédommagements" },
      { value: "LITIGE", label: "Litiges / arbitrages favorables" }
    ],
    "Propriété intellectuelle": [
      { value: "LICENCE", label: "Revenus de licences" },
      { value: "REDEVANCE", label: "Redevances (royalties)" },
      { value: "FRANCHISE", label: "Revenus de franchise" }
    ]
  },
  modesPaiement: [
    { value: "ESPECE", label: "Espèce" },
    { value: "VIREMENT", label: "Virement" },
    { value: "CHEQUE", label: "Chèque" },
    { value: "MOBILE_MONEY", label: "Mobile money" }
  ]
};

export default revenuTypes;