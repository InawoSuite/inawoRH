export const TFT_COMPLET_DATA = [
  // Section A - Trésorerie nette initiale
  {
    id: "ZA",
    ref: "ZA",
    libelle: "Trésorerie nette au 1er janvier",
    note: "A",
    exerciceN: 0,
    exerciceN1: 0,
    type: "tresorerie_initiale",
  },

  // Section B - Flux des activités opérationnelles
  {
    id: "FA",
    ref: "FA",
    libelle: "Capacité d'Autofinancement Globale (CAFG)",
    note: "+",
    exerciceN: 3000000,
    exerciceN1: 2500000,
    type: "flux_operationnel",
  },
  {
    id: "FB",
    ref: "FB",
    libelle: " - Variation d'actif circulant HAO (1)",
    note: "-",
    exerciceN: -500000,
    exerciceN1: -400000,
    type: "flux_operationnel",
  },
  {
    id: "FC",
    ref: "FC",
    libelle: " - Variation des stocks",
    note: "-",
    exerciceN: -250000,
    exerciceN1: -200000,
    type: "flux_operationnel",
  },
  {
    id: "FD",
    ref: "FD",
    libelle: " - Variation des créances",
    note: "-",
    exerciceN: -450000,
    exerciceN1: -350000,
    type: "flux_operationnel",
  },
  {
    id: "FE",
    ref: "FE",
    libelle: " + Variation du passif circulant (1)",
    note: "+",
    exerciceN: 600000,
    exerciceN1: 500000,
    type: "flux_operationnel",
  },
  {
    id: "FF",
    ref: "FF",
    libelle: " Variation du BF lié aux activités opérationnelles",
    note: "+",
    exerciceN: 2400000,
    exerciceN1: 2050000,
    type: "flux_operationnel_total",
  },

  // Section C - Flux des activités d'investissement
  {
    id: "GA",
    ref: "GA",
    libelle: " - Acquisitions d'immobilisations",
    note: "-",
    exerciceN: -1500000,
    exerciceN1: -1200000,
    type: "flux_investissement",
  },
  {
    id: "GB",
    ref: "GB",
    libelle: " + Cessions d'immobilisations",
    note: "+",
    exerciceN: 300000,
    exerciceN1: 250000,
    type: "flux_investissement",
  },
  {
    id: "GC",
    ref: "GC",
    libelle: " Variation de trésorerie liée aux activités d'investissement",
    note: "-",
    exerciceN: -1200000,
    exerciceN1: -950000,
    type: "flux_investissement_total",
  },

  // Section D - Flux des activités de financement
  {
    id: "HA",
    ref: "HA",
    libelle: " + Augmentation de capital",
    note: "+",
    exerciceN: 1000000,
    exerciceN1: 800000,
    type: "flux_financement",
  },
  {
    id: "HB",
    ref: "HB",
    libelle: " + Emprunts et dettes financières",
    note: "+",
    exerciceN: 800000,
    exerciceN1: 700000,
    type: "flux_financement",
  },
  {
    id: "HC",
    ref: "HC",
    libelle: " - Remboursement d'emprunts et dettes",
    note: "-",
    exerciceN: -600000,
    exerciceN1: -500000,
    type: "flux_financement",
  },
  {
    id: "HD",
    ref: "HD",
    libelle: " - Dividendes versés",
    note: "-",
    exerciceN: -300000,
    exerciceN1: -250000,
    type: "flux_financement",
  },
  {
    id: "HE",
    ref: "HE",
    libelle: " Variation de trésorerie liée aux activités de financement",
    note: "+",
    exerciceN: 900000,
    exerciceN1: 750000,
    type: "flux_financement_total",
  },

  // Section E - Synthèse
  {
    id: "IA",
    ref: "IA",
    libelle: " Variation de trésorerie de l'exercice (B+C+D)",
    note: "+",
    exerciceN: 2100000,
    exerciceN1: 1850000,
    type: "synthese",
  },
  {
    id: "IB",
    ref: "IB",
    libelle: " Trésorerie nette au 31 décembre",
    note: "=A+E",
    exerciceN: 2100000,
    exerciceN1: 1850000,
    type: "tresorerie_finale",
  },

  // Section F - Analyse par tiers
  {
    id: "JA",
    ref: "JA",
    libelle: " Variation fournisseurs et comptes rattachés",
    note: "1.1",
    exerciceN: 300000,
    exerciceN1: 250000,
    type: "tiers",
  },
  {
    id: "JB",
    ref: "JB",
    libelle: " Variation clients et comptes rattachés",
    note: "1.2",
    exerciceN: 300000,
    exerciceN1: 250000,
    type: "tiers",
  },
  {
    id: "JC",
    ref: "JC",
    libelle: " Variation personnel",
    note: "1.3",
    exerciceN: 200000,
    exerciceN1: 150000,
    type: "tiers",
  },
  {
    id: "JD",
    ref: "JD",
    libelle: " Variation État (impôts et taxes)",
    note: "1.4",
    exerciceN: 150000,
    exerciceN1: 120000,
    type: "tiers",
  },
  {
    id: "JE",
    ref: "JE",
    libelle: " Variation banques et établissements financiers",
    note: "1.5",
    exerciceN: 500000,
    exerciceN1: 400000,
    type: "tiers",
  },
];

// Note 7 - Résultat (Compte de résultat)
export const RESULTAT_DATA = [
  {
    ref: "70",
    libelle: "Ventes de marchandises",
    note: "",
    montantN: 8500000,
    montantN1: 7200000,
  },
  {
    ref: "71",
    libelle: "Production vendue",
    note: "",
    montantN: 3200000,
    montantN1: 2800000,
  },
  {
    ref: "72",
    libelle: "Production stockée",
    note: "",
    montantN: 500000,
    montantN1: 450000,
  },
  {
    ref: "73",
    libelle: "Production immobilisée",
    note: "",
    montantN: 300000,
    montantN1: 250000,
  },
  {
    ref: "74",
    libelle: "Subventions d'exploitation",
    note: "",
    montantN: 200000,
    montantN1: 180000,
  },
  {
    ref: "75",
    libelle: "Autres produits d'exploitation",
    note: "",
    montantN: 400000,
    montantN1: 350000,
  },
  {
    ref: "60",
    libelle: "Achats de marchandises",
    note: "",
    montantN: 4500000,
    montantN1: 3800000,
  },
  {
    ref: "61",
    libelle: "Variation de stocks (marchandises)",
    note: "",
    montantN: -200000,
    montantN1: -150000,
  },
  {
    ref: "62",
    libelle: "Autres achats et charges externes",
    note: "",
    montantN: 1800000,
    montantN1: 1500000,
  },
  {
    ref: "63",
    libelle: "Impôts, taxes et versements assimilés",
    note: "",
    montantN: 500000,
    montantN1: 420000,
  },
  {
    ref: "64",
    libelle: "Charges de personnel",
    note: "",
    montantN: 3200000,
    montantN1: 2800000,
  },
  {
    ref: "65",
    libelle: "Autres charges de gestion courante",
    note: "",
    montantN: 800000,
    montantN1: 700000,
  },
  {
    ref: "66",
    libelle: "Charges financières",
    note: "",
    montantN: 300000,
    montantN1: 250000,
  },
  {
    ref: "67",
    libelle: "Charges exceptionnelles",
    note: "",
    montantN: 200000,
    montantN1: 150000,
  },
  {
    ref: "68",
    libelle: "Dotations aux amortissements et provisions",
    note: "",
    montantN: 900000,
    montantN1: 750000,
  },
  {
    ref: "69",
    libelle: "Impôts sur les bénéfices",
    note: "",
    montantN: 450000,
    montantN1: 400000,
  },
  {
    ref: "76",
    libelle: "Produits financiers",
    note: "",
    montantN: 400000,
    montantN1: 350000,
  },
  {
    ref: "77",
    libelle: "Produits exceptionnels",
    note: "",
    montantN: 150000,
    montantN1: 100000,
  },
  {
    ref: "78",
    libelle: "Reprises sur amortissements et provisions",
    note: "",
    montantN: 200000,
    montantN1: 180000,
  },
  {
    ref: "79",
    libelle: "Transferts de charges",
    note: "",
    montantN: 100000,
    montantN1: 80000,
  },
];

export const TFT_DATA = [
  {
    id: 1,
    codeTiers: "T001",
    libelleTiers: "Fournisseurs Matières",
    soldeN: 1500000,
    soldeN1: 1200000,
    variation: 300000,
  },
  {
    id: 2,
    codeTiers: "T002",
    libelleTiers: "Clients Divers",
    soldeN: 2500000,
    soldeN1: 2200000,
    variation: 300000,
  },
  {
    id: 3,
    codeTiers: "T003",
    libelleTiers: "Personnel",
    soldeN: 1800000,
    soldeN1: 1600000,
    variation: 200000,
  },
  {
    id: 4,
    codeTiers: "T004",
    libelleTiers: "État (Impôts)",
    soldeN: 900000,
    soldeN1: 750000,
    variation: 150000,
  },
  {
    id: 5,
    codeTiers: "T005",
    libelleTiers: "Banques",
    soldeN: 3500000,
    soldeN1: 3000000,
    variation: 500000,
  },
];

export const FICHE_4_DATA = [
  // Note 1 - DETTES GARANTIES PAR DES SURETES REELLES ET LES ENGAGEMENTS FINANCIERS
  {
    id: "note1",
    type: "note",
    numero: "1",
    intitule:
      "DETTES GARANTIES PAR DES SURETES REELLES ET LES ENGAGEMENTS FINANCIERS",
    sous_categories: [
      {
        id: "note1-1",
        type: "sous_categorie",
        libelle: "Hypothèques",
        lignes: [
          {
            id: "note1-1-1",
            type: "ligne",
            reference: "1.1",
            description: "Bâtiment administratif - Banque ABC",
            montant: 15000000,
            date_contrat: "2020-01-15",
            echeance: "2030-01-15",
            taux: "5.5%",
          },
          {
            id: "note1-1-2",
            type: "ligne",
            reference: "1.2",
            description: "Terrain industriel - Banque XYZ",
            montant: 8000000,
            date_contrat: "2021-03-20",
            echeance: "2031-03-20",
            taux: "6.0%",
          },
        ],
      },
      {
        id: "note1-2",
        type: "sous_categorie",
        libelle: "Nantissements",
        lignes: [
          {
            id: "note1-2-1",
            type: "ligne",
            reference: "1.3",
            description: "Stocks de matières premières",
            montant: 3000000,
            date_contrat: "2022-06-10",
            echeance: "2024-06-10",
          },
          {
            id: "note1-2-2",
            type: "ligne",
            reference: "1.4",
            description: "Matériel informatique",
            montant: 2000000,
            date_contrat: "2023-01-15",
            echeance: "2025-01-15",
          },
        ],
      },
      {
        id: "note1-3",
        type: "sous_categorie",
        libelle: "Cautions",
        lignes: [
          {
            id: "note1-3-1",
            type: "ligne",
            reference: "1.5",
            description: "Caution solidaire - Directeur Général",
            montant: 5000000,
            date_contrat: "2021-05-20",
            echeance: "2026-05-20",
          },
        ],
      },
    ],
    total: 33000000,
  },

  // Note 2 - INFORMATIONS OBLIGATOIRES
  {
    id: "note2",
    type: "note",
    numero: "2",
    intitule: "INFORMATIONS OBLIGATOIRES",
    informations: [
      {
        id: "info2-1",
        rubrique: "Méthodes comptables",
        details: [
          {
            reference: "2.1",
            description: "Évaluation des stocks",
            methode: "FIFO (Premier entré, premier sorti)",
            norme: "IAS 2",
          },
          {
            reference: "2.2",
            description: "Amortissement des immobilisations",
            methode: "Linéaire sur durée d'utilité",
            norme: "IAS 16",
          },
          {
            reference: "2.3",
            description: "Reconnaissance des produits",
            methode: "À la livraison des biens",
            norme: "IAS 18",
          },
        ],
      },
      {
        id: "info2-2",
        rubrique: "Période comptable",
        details: [
          {
            reference: "2.4",
            description: "Exercice comptable",
            valeur: "Du 1er janvier au 31 décembre",
            commentaire: "Exercice annuel",
          },
          {
            reference: "2.5",
            description: "Date de clôture",
            valeur: "31 décembre N",
            commentaire: "Arrêté des comptes",
          },
        ],
      },
    ],
  },

  // Note 3A - IMMOBILISATIONS BRUTES
  {
    id: "note3A",
    type: "note",
    numero: "3A",
    intitule: "IMMOBILISATIONS BRUTES",
    categories: [
      {
        type: "Incopropelles",
        brut_n: 2500000,
        amort_n: 500000,
        net_n: 2000000,
        brut_n1: 2300000,
        amort_n1: 400000,
        net_n1: 1900000,
        details: [
          {
            reference: "3A.1",
            designation: "Fonds commercial",
            acquisition: "2020-06-30",
            cout_acquisition: 1500000,
            amort_cumule: 300000,
          },
          {
            reference: "3A.2",
            designation: "Logiciels",
            acquisition: "2021-03-15",
            cout_acquisition: 1000000,
            amort_cumule: 200000,
          },
        ],
      },
      {
        type: "Corporelles",
        brut_n: 85000000,
        amort_n: 25000000,
        net_n: 60000000,
        brut_n1: 80000000,
        amort_n1: 22000000,
        net_n1: 58000000,
        details: [
          {
            reference: "3A.3",
            designation: "Bâtiments",
            acquisition: "2018-01-15",
            cout_acquisition: 50000000,
            amort_cumule: 15000000,
          },
          {
            reference: "3A.4",
            designation: "Matériel industriel",
            acquisition: "2020-03-20",
            cout_acquisition: 35000000,
            amort_cumule: 10000000,
          },
        ],
      },
      {
        type: "Total",
        brut_n: 87500000,
        amort_n: 25500000,
        net_n: 62000000,
        brut_n1: 82300000,
        amort_n1: 22400000,
        net_n1: 59900000,
        details: [],
      },
    ],
  },

  // Note 3B - BIENS PRIS EN LOCATION-ACQUISITION
  {
    id: "note3B",
    type: "note",
    numero: "3B",
    intitule: "BIENS PRIS EN LOCATION-ACQUISITION",
    contrats: [
      {
        id: "contrat3B-1",
        reference: "3B.1",
        bien: "Véhicules de direction",
        fournisseur: "Société de leasing ABC",
        date_debut: "2022-01-15",
        duree: "48 mois",
        valeur_actuelle: 30000000,
        loyer_mensuel: 800000,
        option_achat: "Oui",
        prix_option: 5000000,
        date_option: "2025-12-31",
      },
      {
        id: "contrat3B-2",
        reference: "3B.2",
        bien: "Équipement informatique",
        fournisseur: "Société de leasing XYZ",
        date_debut: "2023-03-20",
        duree: "36 mois",
        valeur_actuelle: 15000000,
        loyer_mensuel: 450000,
        option_achat: "Non",
        prix_option: 0,
        date_option: "N/A",
      },
    ],
    total_valeur_actuelle: 45000000,
    total_engagements: 12500000,
  },

  // Note 3C - IMMOBILISATIONS : AMORTISSEMENTS
  {
    id: "note3C",
    type: "note",
    numero: "3C",
    intitule: "IMMOBILISATIONS : AMORTISSEMENTS",
    amortissements: [
      {
        categorie: "Amortissements linéaires",
        exercice_n: 8500000,
        exercice_n1: 7800000,
        cumul_n: 25500000,
        cumul_n1: 17000000,
        details: [
          {
            reference: "3C.1",
            designation: "Bâtiments (taux 5%)",
            base: 50000000,
            dotation_n: 2500000,
            cumul: 15000000,
          },
          {
            reference: "3C.2",
            designation: "Matériel industriel (taux 20%)",
            base: 35000000,
            dotation_n: 7000000,
            cumul: 10500000,
          },
        ],
      },
      {
        categorie: "Amortissements dégressifs",
        exercice_n: 1200000,
        exercice_n1: 1500000,
        cumul_n: 4500000,
        cumul_n1: 3300000,
        details: [
          {
            reference: "3C.3",
            designation: "Véhicules (taux 30%)",
            base: 8000000,
            dotation_n: 1200000,
            cumul: 4500000,
          },
        ],
      },
    ],
    total_dotation_n: 9700000,
    total_dotation_n1: 9300000,
    total_cumul_n: 30000000,
    total_cumul_n1: 20300000,
  },

  // Note 3D - IMMOBILISATIONS : PLUS-VALUES ET MOINS-VALUES DE CESSION
  {
    id: "note3D",
    type: "note",
    numero: "3D",
    intitule: "IMMOBILISATIONS : PLUS-VALUES ET MOINS-VALUES DE CESSION",
    cessions: [
      {
        reference: "3D.1",
        date: "2023-06-30",
        designation: "Véhicule utilitaire",
        valeur_comptable: 8000000,
        prix_cession: 9500000,
        plus_value: 1500000,
        traitement_fiscal: "Report déficitaire",
        exercice: "N",
      },
      {
        reference: "3D.2",
        date: "2022-12-15",
        designation: "Matériel informatique obsolète",
        valeur_comptable: 3000000,
        prix_cession: 2000000,
        moins_value: 1000000,
        traitement_fiscal: "Déductible",
        exercice: "N-1",
      },
    ],
    total_plus_values: 1500000,
    total_moins_values: 1000000,
    resultat_net: 500000,
  },

  // Note 3E - INFORMATIONS SUR LES REEVALUATIONS EFFECTUEES PAR L'ENTITE
  {
    id: "note3E",
    type: "note",
    numero: "3E",
    intitule: "INFORMATIONS SUR LES REEVALUATIONS EFFECTUEES PAR L'ENTITE",
    revaluations: [
      {
        reference: "3E.1",
        designation: "Bâtiment administratif",
        date_revaluation: "2021-12-31",
        valeur_comptable_avant: 40000000,
        valeur_revaluee: 55000000,
        ecart_revaluation: 15000000,
        traitement_comptable: "Reporté dans les capitaux propres",
        amortissement_correspondant: 7500000,
      },
      {
        reference: "3E.2",
        designation: "Terrain industriel",
        date_revaluation: "2020-12-31",
        valeur_comptable_avant: 20000000,
        valeur_revaluee: 30000000,
        ecart_revaluation: 10000000,
        traitement_comptable: "Reporté dans les capitaux propres",
        amortissement_correspondant: 0,
      },
    ],
    total_ecart_revaluation: 25000000,
  },
];

export const NOTE_1_DATA = [
  {
    id: 1,
    libelle: "DETTES GARANTIES PAR DES SURETES REELLES",
    note: "1",
    montantBrut: 15000000,
    hypotheques: 15000000,
    nantissements: 5000000,
    gagesAutres: 8000000,
    totalSuretes: 28000000,
    details: [
      {
        id: "1.1",
        description: "Hypothèque bâtiment administratif",
        montant: 15000000,
        type: "hypotheque",
        dateContrat: "2020-01-15",
        echeance: "2030-01-15",
        taux: "5.5%"
      },
      {
        id: "1.2",
        description: "Nantissement stocks",
        montant: 3000000,
        type: "nantissement",
        dateContrat: "2022-06-10",
        echeance: "2024-06-10"
      },
      {
        id: "1.3",
        description: "Nantissement matériel informatique",
        montant: 2000000,
        type: "nantissement",
        dateContrat: "2023-01-15",
        echeance: "2025-01-15"
      },
      {
        id: "1.4",
        description: "Gage sur véhicules",
        montant: 8000000,
        type: "gage",
        dateContrat: "2021-05-20",
        echeance: "2026-05-20"
      }
    ]
  },
  {
    id: 2,
    libelle: "ENGAGEMENTS FINANCIERS DONNES",
    note: "2",
    montantBrut: 3500000,
    hypotheques: 0,
    nantissements: 2000000,
    gagesAutres: 1500000,
    totalSuretes: 3500000,
    details: [
      {
        id: "2.1",
        description: "Caution fournisseur",
        montant: 2000000,
        type: "nantissement",
        beneficiaire: "Fournisseur Principal",
        dateContrat: "2022-11-10"
      },
      {
        id: "2.2",
        description: "Garantie bancaire",
        montant: 1500000,
        type: "gage",
        beneficiaire: "Banque ABC",
        dateContrat: "2023-02-28"
      }
    ]
  },
  {
    id: 3,
    libelle: "ENGAGEMENTS FINANCIERS RECUS",
    note: "3",
    montantBrut: 2500000,
    hypotheques: 0,
    nantissements: 1500000,
    gagesAutres: 1000000,
    totalSuretes: 2500000,
    details: [
      {
        id: "3.1",
        description: "Garantie État",
        montant: 1500000,
        type: "nantissement",
        donneur: "État",
        dateContrat: "2023-05-15"
      },
      {
        id: "3.2",
        description: "Caution associé",
        montant: 1000000,
        type: "gage",
        donneur: "M. DUPONT",
        dateContrat: "2022-08-20"
      }
    ]
  },
  {
    id: 4,
    libelle: "TOTAL SURETES REELLES",
    note: "TOTAL",
    montantBrut: 21000000,
    hypotheques: 15000000,
    nantissements: 8500000,
    gagesAutres: 10500000,
    totalSuretes: 34000000,
    details: []
  }
];
// Données pour Note 2 (Tableau des soldes intermédiaires de gestion)
export const NOTE_2_DATA = [
  {
    id: 1,
    poste: "Marge commerciale",
    montantN: 4500000,
    montantN1: 4000000,
    pourcentageCA: "30.0%",
  },
  {
    id: 2,
    poste: "Production de l'exercice",
    montantN: 10500000,
    montantN1: 9500000,
    pourcentageCA: "70.0%",
  },
  {
    id: 3,
    poste: "Valeur ajoutée",
    montantN: 6000000,
    montantN1: 5400000,
    pourcentageCA: "40.0%",
  },
  {
    id: 4,
    poste: "Excédent brut d'exploitation",
    montantN: 3500000,
    montantN1: 3100000,
    pourcentageCA: "23.3%",
  },
  {
    id: 5,
    poste: "Résultat d'exploitation",
    montantN: 2500000,
    montantN1: 2200000,
    pourcentageCA: "16.7%",
  },
  {
    id: 6,
    poste: "Résultat courant",
    montantN: 2800000,
    montantN1: 2450000,
    pourcentageCA: "18.7%",
  },
];

// Données pour Note 3A (Détail des produits)
export const NOTE_3A_DATA = [
  {
    id: 1,
    compte: "70",
    libelle: "Ventes de marchandises",
    montantN: 8500000,
    montantN1: 7200000,
  },
  {
    id: 2,
    compte: "71",
    libelle: "Production vendue",
    montantN: 3200000,
    montantN1: 2800000,
  },
  {
    id: 3,
    compte: "72",
    libelle: "Production stockée",
    montantN: 500000,
    montantN1: 450000,
  },
  {
    id: 4,
    compte: "73",
    libelle: "Production immobilisée",
    montantN: 300000,
    montantN1: 250000,
  },
  {
    id: 5,
    compte: "74",
    libelle: "Subventions d'exploitation",
    montantN: 200000,
    montantN1: 180000,
  },
  {
    id: 6,
    compte: "75",
    libelle: "Autres produits",
    montantN: 400000,
    montantN1: 350000,
  },
];

// Données pour Note 3B (Détail des charges)
export const NOTE_3B_DATA = [
  {
    id: 1,
    compte: "60",
    libelle: "Achats de marchandises",
    montantN: 4500000,
    montantN1: 3800000,
  },
  {
    id: 2,
    compte: "61",
    libelle: "Achats de matières premières",
    montantN: 1200000,
    montantN1: 1000000,
  },
  {
    id: 3,
    compte: "62",
    libelle: "Autres achats et charges externes",
    montantN: 1800000,
    montantN1: 1500000,
  },
  {
    id: 4,
    compte: "63",
    libelle: "Impôts et taxes",
    montantN: 500000,
    montantN1: 420000,
  },
  {
    id: 5,
    compte: "64",
    libelle: "Charges de personnel",
    montantN: 3200000,
    montantN1: 2800000,
  },
  {
    id: 6,
    compte: "65",
    libelle: "Autres charges",
    montantN: 800000,
    montantN1: 700000,
  },
];

// Données pour Note 3C (Produits financiers)
export const NOTE_3C_DATA = [
  {
    id: 1,
    compte: "76",
    libelle: "Produits financiers",
    montantN: 400000,
    montantN1: 350000,
  },
  {
    id: 2,
    compte: "761",
    libelle: "Revenus des titres",
    montantN: 150000,
    montantN1: 120000,
  },
  {
    id: 3,
    compte: "762",
    libelle: "Revenus des créances",
    montantN: 100000,
    montantN1: 90000,
  },
  {
    id: 4,
    compte: "763",
    libelle: "Escomptes obtenus",
    montantN: 80000,
    montantN1: 70000,
  },
  {
    id: 5,
    compte: "764",
    libelle: "Gains de change",
    montantN: 70000,
    montantN1: 60000,
  },
];

// Données pour Note 3D (Charges financières)
export const NOTE_3D_DATA = [
  {
    id: 1,
    compte: "66",
    libelle: "Charges financières",
    montantN: 300000,
    montantN1: 250000,
  },
  {
    id: 2,
    compte: "661",
    libelle: "Intérêts des emprunts",
    montantN: 180000,
    montantN1: 150000,
  },
  {
    id: 3,
    compte: "662",
    libelle: "Pertes sur créances",
    montantN: 60000,
    montantN1: 50000,
  },
  {
    id: 4,
    compte: "663",
    libelle: "Escomptes accordés",
    montantN: 40000,
    montantN1: 35000,
  },
  {
    id: 5,
    compte: "664",
    libelle: "Pertes de change",
    montantN: 20000,
    montantN1: 15000,
  },
];

// Données pour Note 3E (Opérations exceptionnelles)
export const NOTE_3E_DATA = [
  {
    id: 1,
    compte: "77",
    libelle: "Produits exceptionnels",
    montantN: 150000,
    montantN1: 100000,
  },
  {
    id: 2,
    compte: "771",
    libelle: "Produits des cessions",
    montantN: 80000,
    montantN1: 60000,
  },
  {
    id: 3,
    compte: "772",
    libelle: "Subventions d'équipement",
    montantN: 40000,
    montantN1: 30000,
  },
  {
    id: 4,
    compte: "773",
    libelle: "Reprises de provisions",
    montantN: 30000,
    montantN1: 10000,
  },
  {
    id: 5,
    compte: "67",
    libelle: "Charges exceptionnelles",
    montantN: 200000,
    montantN1: 150000,
  },
  {
    id: 6,
    compte: "671",
    libelle: "Charges des cessions",
    montantN: 100000,
    montantN1: 80000,
  },
  {
    id: 7,
    compte: "675",
    libelle: "Valeurs comptables des cessions",
    montantN: 60000,
    montantN1: 50000,
  },
  {
    id: 8,
    compte: "678",
    libelle: "Autres charges",
    montantN: 40000,
    montantN1: 20000,
  },
];

// Données pour Note 4 (Impôts sur les bénéfices)
export const NOTE_4_DATA = [
  { id: 1, designation: "IS théorique (25%)", base: 1800000, montant: 450000 },
  { id: 2, designation: "Crédits d'impôt", base: 50000, montant: 50000 },
  { id: 3, designation: "Déficits reportables", base: 100000, montant: 25000 },
  { id: 4, designation: "IS dû", base: 1650000, montant: 412500 },
  { id: 5, designation: "IS payé d'avance", base: 400000, montant: 400000 },
  { id: 6, designation: "IS à payer", base: 12500, montant: 12500 },
];

// Données pour Note 5 (Immobilisations)
export const NOTE_5_DATA = [
  {
    id: 1,
    type: "Incorporelles",
    brutN: 1500000,
    amortissementsN: 300000,
    netN: 1200000,
    brutN1: 1400000,
    amortissementsN1: 250000,
    netN1: 1150000,
  },
  {
    id: 2,
    type: "Corporelles",
    brutN: 5000000,
    amortissementsN: 1500000,
    netN: 3500000,
    brutN1: 4500000,
    amortissementsN1: 1200000,
    netN1: 3300000,
  },
  {
    id: 3,
    type: "Financières",
    brutN: 2000000,
    amortissementsN: 0,
    netN: 2000000,
    brutN1: 1800000,
    amortissementsN1: 0,
    netN1: 1800000,
  },
  {
    id: 4,
    type: "Total immobilisations",
    brutN: 8500000,
    amortissementsN: 1800000,
    netN: 6700000,
    brutN1: 7700000,
    amortissementsN1: 1450000,
    netN1: 6250000,
  },
];

// Données pour Note 6 (Stocks)
export const NOTE_6_DATA = [
  {
    id: 1,
    type: "Matières premières",
    valeurN: 600000,
    valeurN1: 550000,
    variation: 50000,
  },
  {
    id: 2,
    type: "En-cours de production",
    valeurN: 300000,
    valeurN1: 250000,
    variation: 50000,
  },
  {
    id: 3,
    type: "Produits finis",
    valeurN: 300000,
    valeurN1: 200000,
    variation: 100000,
  },
  {
    id: 4,
    type: "Marchandises",
    valeurN: 200000,
    valeurN1: 150000,
    variation: 50000,
  },
  {
    id: 5,
    type: "Total stocks",
    valeurN: 1400000,
    valeurN1: 1150000,
    variation: 250000,
  },
];

// Données pour Note 7 (Créances)
export const NOTE_7_DATA = [
  {
    id: 1,
    type: "Clients et comptes rattachés",
    montantN: 2500000,
    montantN1: 2200000,
    variation: 300000,
  },
  {
    id: 2,
    type: "État",
    montantN: 500000,
    montantN1: 450000,
    variation: 50000,
  },
  {
    id: 3,
    type: "Personnel",
    montantN: 200000,
    montantN1: 150000,
    variation: 50000,
  },
  {
    id: 4,
    type: "Autres débiteurs",
    montantN: 300000,
    montantN1: 250000,
    variation: 50000,
  },
  {
    id: 5,
    type: "Total créances",
    montantN: 3500000,
    montantN1: 3050000,
    variation: 450000,
  },
];

// Données pour Note 8 (Disponibilités)
export const NOTE_8_DATA = [
  {
    id: 1,
    type: "Banques",
    montantN: 2000000,
    montantN1: 1800000,
    variation: 200000,
  },
  {
    id: 2,
    type: "Caisse",
    montantN: 200000,
    montantN1: 150000,
    variation: 50000,
  },
  {
    id: 3,
    type: "Chèques à encaisser",
    montantN: 500000,
    montantN1: 450000,
    variation: 50000,
  },
  {
    id: 4,
    type: "Total disponibilités",
    montantN: 2700000,
    montantN1: 2400000,
    variation: 300000,
  },
];

// Données pour Note 8A (Trésorerie-actif)
export const NOTE_8A_DATA = [
  {
    id: 1,
    compte: "53",
    libelle: "Banques",
    montantN: 2000000,
    montantN1: 1800000,
  },
  {
    id: 2,
    compte: "54",
    libelle: "Établissements financiers",
    montantN: 500000,
    montantN1: 450000,
  },
  {
    id: 3,
    compte: "57",
    libelle: "Caisse",
    montantN: 200000,
    montantN1: 150000,
  },
  {
    id: 4,
    compte: "58",
    libelle: "Virements internes",
    montantN: 100000,
    montantN1: 80000,
  },
  {
    id: 5,
    compte: "59",
    libelle: "Régies d'avance",
    montantN: 50000,
    montantN1: 40000,
  },
];

// Données pour Note 8B (Valeurs mobilières)
export const NOTE_8B_DATA = [
  {
    id: 1,
    designation: "Actions cotées",
    quantite: 1000,
    valeurUnitaireN: 500,
    valeurTotaleN: 500000,
    valeurUnitaireN1: 450,
    valeurTotaleN1: 450000,
  },
  {
    id: 2,
    designation: "Obligations",
    quantite: 500,
    valeurUnitaireN: 1000,
    valeurTotaleN: 500000,
    valeurUnitaireN1: 950,
    valeurTotaleN1: 475000,
  },
  {
    id: 3,
    designation: "Bons du Trésor",
    quantite: 200,
    valeurUnitaireN: 1000,
    valeurTotaleN: 200000,
    valeurUnitaireN1: 1000,
    valeurTotaleN1: 200000,
  },
  {
    id: 4,
    designation: "Total valeurs mobilières",
    quantite: 1700,
    valeurUnitaireN: 705.88,
    valeurTotaleN: 1200000,
    valeurUnitaireN1: 661.76,
    valeurTotaleN1: 1125000,
  },
];

// Données pour Note 8C (Autres placements)
export const NOTE_8C_DATA = [
  {
    id: 1,
    designation: "Dépôts à terme",
    montantN: 500000,
    montantN1: 450000,
    taux: "3.5%",
    echeance: "2024-12-31",
  },
  {
    id: 2,
    designation: "SICAV monétaires",
    montantN: 300000,
    montantN1: 250000,
    taux: "2.8%",
    echeance: "-",
  },
  {
    id: 3,
    designation: "Placements à court terme",
    montantN: 200000,
    montantN1: 150000,
    taux: "4.0%",
    echeance: "2024-06-30",
  },
  {
    id: 4,
    designation: "Total placements",
    montantN: 1000000,
    montantN1: 850000,
    taux: "-",
    echeance: "-",
  },
];

// Données pour Note 9 (Capital)
export const NOTE_9_DATA = [
  {
    id: 1,
    designation: "Capital social",
    montant: 3000000,
    dateAugmentation: "2020-05-15",
    commentaire: "Augmentation de capital",
  },
  {
    id: 2,
    designation: "Capital appelé non versé",
    montant: 0,
    dateAugmentation: "-",
    commentaire: "Capital entièrement libéré",
  },
  {
    id: 3,
    designation: "Prime d'émission",
    montant: 500000,
    dateAugmentation: "2020-05-15",
    commentaire: "Prime sur augmentation",
  },
  {
    id: 4,
    designation: "Écarts de réévaluation",
    montant: 200000,
    dateAugmentation: "2021-03-20",
    commentaire: "Réévaluation immobilisations",
  },
];

// Données pour Note 10 (Réserves)
export const NOTE_10_DATA = [
  {
    id: 1,
    type: "Réserve légale",
    montantN: 450000,
    montantN1: 400000,
    variation: 50000,
  },
  {
    id: 2,
    type: "Réserves statutaires",
    montantN: 600000,
    montantN1: 500000,
    variation: 100000,
  },
  {
    id: 3,
    type: "Réserves facultatives",
    montantN: 450000,
    montantN1: 300000,
    variation: 150000,
  },
  {
    id: 4,
    type: "Total réserves",
    montantN: 1500000,
    montantN1: 1200000,
    variation: 300000,
  },
];

// Données pour Note 11 (Report à nouveau)
export const NOTE_11_DATA = [
  { id: 1, exercice: "N-2", montant: 200000, affectation: "Report" },
  { id: 2, exercice: "N-1", montant: 400000, affectation: "Report" },
  { id: 3, exercice: "N", montant: 500000, affectation: "En instance" },
  { id: 4, exercice: "Solde", montant: 1100000, affectation: "Cumul" },
];

// Données pour Note 12 (Résultat de l'exercice)
export const NOTE_12_DATA = [
  { id: 1, rubrique: "Résultat d'exploitation", montant: 2500000 },
  { id: 2, rubrique: "Résultat financier", montant: 300000 },
  { id: 3, rubrique: "Résultat exceptionnel", montant: 200000 },
  { id: 4, rubrique: "Résultat avant impôts", montant: 3000000 },
  { id: 5, rubrique: "Impôts sur les bénéfices", montant: 450000 },
  { id: 6, rubrique: "Résultat net", montant: 2550000 },
];

// Données pour Note 13 (Provisions)
export const NOTE_13_DATA = [
  {
    id: 1,
    type: "Pour risques et charges",
    montantN: 800000,
    montantN1: 700000,
    variation: 100000,
  },
  {
    id: 2,
    type: "Pour dépréciation",
    montantN: 500000,
    montantN1: 450000,
    variation: 50000,
  },
  {
    id: 3,
    type: "Pour restructuration",
    montantN: 300000,
    montantN1: 250000,
    variation: 50000,
  },
  {
    id: 4,
    type: "Total provisions",
    montantN: 1600000,
    montantN1: 1400000,
    variation: 200000,
  },
];

// Données pour Note 14 (Dettes financières)
export const NOTE_14_DATA = [
  {
    id: 1,
    type: "Emprunts obligataires",
    montantN: 1500000,
    montantN1: 1400000,
    echeance: "2027-12-31",
    taux: "5.5%",
  },
  {
    id: 2,
    type: "Emprunts bancaires",
    montantN: 800000,
    montantN1: 700000,
    echeance: "2025-06-30",
    taux: "6.0%",
  },
  {
    id: 3,
    type: "Dettes auprès des établissements de crédit",
    montantN: 200000,
    montantN1: 100000,
    echeance: "2024-12-31",
    taux: "7.0%",
  },
  {
    id: 4,
    type: "Total dettes financières",
    montantN: 2500000,
    montantN1: 2200000,
    echeance: "-",
    taux: "-",
  },
];

// Données pour Note 15 (Dettes fournisseurs)
export const NOTE_15_DATA = [
  {
    id: 1,
    type: "Fournisseurs d'exploitation",
    montantN: 1200000,
    montantN1: 1000000,
    delaiMoyen: "45 jours",
  },
  {
    id: 2,
    type: "Fournisseurs d'immobilisations",
    montantN: 400000,
    montantN1: 350000,
    delaiMoyen: "60 jours",
  },
  {
    id: 3,
    type: "Avances reçues sur commandes",
    montantN: 200000,
    montantN1: 150000,
    delaiMoyen: "30 jours",
  },
  {
    id: 4,
    type: "Total dettes fournisseurs",
    montantN: 1800000,
    montantN1: 1500000,
    delaiMoyen: "-",
  },
];

// Données pour Note 15A (Dettes fiscales)
export const NOTE_15A_DATA = [
  {
    id: 1,
    type: "TVA à payer",
    montantN: 400000,
    montantN1: 350000,
    echeance: "Mensuelle",
  },
  {
    id: 2,
    type: "Impôt sur les sociétés",
    montantN: 200000,
    montantN1: 180000,
    echeance: "Trimestrielle",
  },
  {
    id: 3,
    type: "Impôts sur les salaires",
    montantN: 100000,
    montantN1: 80000,
    echeance: "Mensuelle",
  },
  {
    id: 4,
    type: "Total dettes fiscales",
    montantN: 700000,
    montantN1: 610000,
    echeance: "-",
  },
];

// Données pour Note 15B (Dettes sociales)
export const NOTE_15B_DATA = [
  {
    id: 1,
    type: "Sécurité sociale",
    montantN: 300000,
    montantN1: 250000,
    echeance: "Mensuelle",
  },
  {
    id: 2,
    type: "Retraite complémentaire",
    montantN: 150000,
    montantN1: 120000,
    echeance: "Mensuelle",
  },
  {
    id: 3,
    type: "Prévoyance",
    montantN: 50000,
    montantN1: 40000,
    echeance: "Mensuelle",
  },
  {
    id: 4,
    type: "Total dettes sociales",
    montantN: 500000,
    montantN1: 410000,
    echeance: "-",
  },
];

// Données pour Note 15C (Autres dettes)
export const NOTE_15C_DATA = [
  {
    id: 1,
    type: "Dettes sur immobilisations",
    montantN: 200000,
    montantN1: 150000,
    commentaire: "Crédit-bail",
  },
  {
    id: 2,
    type: "Dettes diverses",
    montantN: 100000,
    montantN1: 80000,
    commentaire: "Avances clients",
  },
  {
    id: 3,
    type: "Total autres dettes",
    montantN: 300000,
    montantN1: 230000,
    commentaire: "-",
  },
];

// Données pour Note 16BIS (Comptes de liaison)
export const NOTE_16BIS_DATA = [
  {
    id: 1,
    compte: "471",
    libelle: "Comptes de liaison siège",
    montantN: 500000,
    montantN1: 450000,
    sens: "Débiteur",
  },
  {
    id: 2,
    compte: "472",
    libelle: "Comptes de liaison succursales",
    montantN: 300000,
    montantN1: 250000,
    sens: "Créditeur",
  },
  {
    id: 3,
    compte: "473",
    libelle: "Comptes de liaison filiales",
    montantN: 200000,
    montantN1: 150000,
    sens: "Débiteur",
  },
];

// Données pour Note 16C (Écarts de conversion)
export const NOTE_16C_DATA = [
  {
    id: 1,
    devise: "USD",
    tauxN: 580,
    tauxN1: 550,
    montantDevise: 100000,
    montantN: 58000000,
    montantN1: 55000000,
    ecart: 3000000,
  },
  {
    id: 2,
    devise: "EUR",
    tauxN: 655,
    tauxN1: 650,
    montantDevise: 50000,
    montantN: 32750000,
    montantN1: 32500000,
    ecart: 250000,
  },
  {
    id: 3,
    devise: "GBP",
    tauxN: 730,
    tauxN1: 720,
    montantDevise: 20000,
    montantN: 14600000,
    montantN1: 14400000,
    ecart: 200000,
  },
];

// Note 17 - Engagements donnés et reçus
export const NOTE_17_DATA = [
  {
    id: 1,
    type: "Garanties bancaires",
    montant: 1500000,
    beneficiaire: "Banque Centrale",
    dateEmission: "2023-01-15",
    dateEcheance: "2024-12-31",
    statut: "Actif",
  },
  {
    id: 2,
    type: "Cautionnements",
    montant: 500000,
    beneficiaire: "Client Majeur",
    dateEmission: "2023-03-20",
    dateEcheance: "2025-06-30",
    statut: "Actif",
  },
  {
    id: 3,
    type: "Garanties fournisseurs",
    montant: 300000,
    beneficiaire: "Fournisseur Principal",
    dateEmission: "2022-11-10",
    dateEcheance: "2024-11-10",
    statut: "Actif",
  },
  {
    id: 4,
    type: "Engagements de crédit",
    montant: 2000000,
    beneficiaire: "Établissement Financier",
    dateEmission: "2023-02-28",
    dateEcheance: "2026-02-28",
    statut: "Non utilisé",
  },
  {
    id: 5,
    type: "Garanties reçues",
    montant: 800000,
    donneur: "État",
    dateReception: "2023-05-15",
    dateEcheance: "2025-05-15",
    statut: "Valide",
  },
];

// Note 18 - Actifs et passifs en devises
export const NOTE_18_DATA = [
  {
    id: 1,
    devise: "USD",
    tauxN: 580,
    tauxN1: 550,
    actifN: 5000000,
    passifN: 2000000,
    expositionNetteN: 3000000,
    actifN1: 4500000,
    passifN1: 1800000,
    expositionNetteN1: 2700000,
  },
  {
    id: 2,
    devise: "EUR",
    tauxN: 655,
    tauxN1: 650,
    actifN: 3000000,
    passifN: 1500000,
    expositionNetteN: 1500000,
    actifN1: 2800000,
    passifN1: 1200000,
    expositionNetteN1: 1600000,
  },
  {
    id: 3,
    devise: "GBP",
    tauxN: 730,
    tauxN1: 720,
    actifN: 2000000,
    passifN: 800000,
    expositionNetteN: 1200000,
    actifN1: 1800000,
    passifN1: 700000,
    expositionNetteN1: 1100000,
  },
  {
    id: 4,
    devise: "XOF",
    tauxN: 1,
    tauxN1: 1,
    actifN: 50000000,
    passifN: 30000000,
    expositionNetteN: 20000000,
    actifN1: 45000000,
    passifN1: 28000000,
    expositionNetteN1: 17000000,
  },
];

// Note 19 - Transactions avec les parties liées
export const NOTE_19_DATA = [
  {
    id: 1,
    partieLiee: "Société Mère",
    typeTransaction: "Ventes",
    montantN: 2500000,
    montantN1: 2200000,
    conditions: "Prix du marché",
    soldeDu: 500000,
  },
  {
    id: 2,
    partieLiee: "Filiale A",
    typeTransaction: "Achats",
    montantN: 1200000,
    montantN1: 1000000,
    conditions: "Coût majoré 5%",
    soldeCrediteur: 300000,
  },
  {
    id: 3,
    partieLiee: "Filiale B",
    typeTransaction: "Prestations",
    montantN: 800000,
    montantN1: 700000,
    conditions: "Prix coûtant",
    soldeDu: 200000,
  },
  {
    id: 4,
    partieLiee: "Administrateur X",
    typeTransaction: "Prêt",
    montantN: 500000,
    montantN1: 500000,
    conditions: "Taux 3%",
    soldeCrediteur: 500000,
  },
  {
    id: 5,
    partieLiee: "Actionnaire Y",
    typeTransaction: "Location",
    montantN: 300000,
    montantN1: 280000,
    conditions: "Loyer marché",
    soldeDu: 60000,
  },
];

export const NOTE_20_DATA = [
  {
    id: 1,
    categorie: "Direction",
    effectifN: 5,
    effectifN1: 5,
    masseSalarialeN: 1200000,
    masseSalarialeN1: 1100000,
    moyenneN: 240000,
    moyenneN1: 220000,
  },
  {
    id: 2,
    categorie: "Cadres",
    effectifN: 15,
    effectifN1: 14,
    masseSalarialeN: 900000,
    masseSalarialeN1: 800000,
    moyenneN: 60000,
    moyenneN1: 57143,
  },
  {
    id: 3,
    categorie: "Employés",
    effectifN: 30,
    effectifN1: 28,
    masseSalarialeN: 720000,
    masseSalarialeN1: 650000,
    moyenneN: 24000,
    moyenneN1: 23214,
  },
  {
    id: 4,
    categorie: "Ouvriers",
    effectifN: 50,
    effectifN1: 45,
    masseSalarialeN: 900000,
    masseSalarialeN1: 800000,
    moyenneN: 18000,
    moyenneN1: 17778,
  },
  {
    id: 5,
    categorie: "Total",
    effectifN: 100,
    effectifN1: 92,
    masseSalarialeN: 3720000,
    masseSalarialeN1: 3350000,
    moyenneN: 37200,
    moyenneN1: 36413,
  },
];

// Note 21 - Événements postérieurs à la clôture
export const NOTE_21_DATA = [
  {
    id: 1,
    evenement: "Acquisition d'une filiale",
    date: "2024-01-20",
    impact: "Augmentation actif 5M",
    statut: "Finalisé",
    commentaire: "Appro CG 15/01",
  },
  {
    id: 2,
    evenement: "Litige en cours",
    date: "2024-02-10",
    impact: "Provision 300K",
    statut: "En négociation",
    commentaire: "Audience 15/03",
  },
  {
    id: 3,
    evenement: "Signature contrat majeur",
    date: "2024-01-25",
    impact: "CA additionnel 8M",
    statut: "Signé",
    commentaire: "Démarrage 01/03",
  },
  {
    id: 4,
    evenement: "Incendie entrepôt",
    date: "2024-02-05",
    impact: "Perte 1.5M",
    statut: "Expertise",
    commentaire: "Assurance en cours",
  },
  {
    id: 5,
    evenement: "Emprunt bancaire",
    date: "2024-01-30",
    impact: "Trésorerie +2M",
    statut: "Débloqué",
    commentaire: "Taux 6.5%",
  },
];

// Note 22 - Politiques comptables
export const NOTE_22_DATA = [
  {
    id: 1,
    domaine: "Immobilisations",
    methode: "Coût historique",
    amortissement: "Linéaire",
    duree: "3-20 ans",
    commentaire: "Conformité PCGA",
  },
  {
    id: 2,
    domaine: "Stocks",
    methode: "FIFO",
    evaluation: "Coût ou VNR le plus bas",
    provision: "Dépréciation si nécessaire",
    commentaire: "Méthode cohérente",
  },
  {
    id: 3,
    domaine: "Créances clients",
    methode: "Valeur nominale",
    provision: "Douteux 2%",
    recouvrement: "Suivi mensuel",
    commentaire: "Politique prudente",
  },
  {
    id: 4,
    domaine: "Taux de change",
    methode: "Cours de clôture",
    conversion: "Actifs/Passifs",
    ecarts: "Compte de résultat",
    commentaire: "IAS 21",
  },
  {
    id: 5,
    domaine: "Impôts différés",
    methode: "Méthode du passif",
    evaluation: "Taux attendu",
    compensation: "Actif/Passif",
    commentaire: "IAS 12",
  },
];

// Note 23 - Taux de change
export const NOTE_23_DATA = [
  {
    id: 1,
    devise: "USD",
    tauxClotureN: 580,
    tauxMoyenN: 575,
    tauxClotureN1: 550,
    tauxMoyenN1: 545,
    variation: "+5.5%",
  },
  {
    id: 2,
    devise: "EUR",
    tauxClotureN: 655,
    tauxMoyenN: 650,
    tauxClotureN1: 650,
    tauxMoyenN1: 645,
    variation: "+0.8%",
  },
  {
    id: 3,
    devise: "GBP",
    tauxClotureN: 730,
    tauxMoyenN: 725,
    tauxClotureN1: 720,
    tauxMoyenN1: 715,
    variation: "+1.4%",
  },
  {
    id: 4,
    devise: "JPY",
    tauxClotureN: 4.2,
    tauxMoyenN: 4.1,
    tauxClotureN1: 4.0,
    tauxMoyenN1: 3.9,
    variation: "+5.0%",
  },
  {
    id: 5,
    devise: "CNY",
    tauxClotureN: 85,
    tauxMoyenN: 84,
    tauxClotureN1: 82,
    tauxMoyenN1: 81,
    variation: "+3.7%",
  },
];

// Note 24 - Informations sectorielles
export const NOTE_24_DATA = [
  {
    id: 1,
    secteur: "Distribution",
    caN: 8500000,
    caN1: 7200000,
    resultatN: 1200000,
    resultatN1: 1000000,
    actifs: 6000000,
    effectif: 40,
  },
  {
    id: 2,
    secteur: "Production",
    caN: 4500000,
    caN1: 4000000,
    resultatN: 800000,
    resultatN1: 700000,
    actifs: 8000000,
    effectif: 35,
  },
  {
    id: 3,
    secteur: "Services",
    caN: 2000000,
    caN1: 1800000,
    resultatN: 400000,
    resultatN1: 350000,
    actifs: 1500000,
    effectif: 25,
  },
  {
    id: 4,
    secteur: "Total",
    caN: 15000000,
    caN1: 13000000,
    resultatN: 2400000,
    resultatN1: 2050000,
    actifs: 15500000,
    effectif: 100,
  },
];

// Note 25 - Impact de la COVID-19
export const NOTE_25_DATA = [
  {
    id: 1,
    impact: "Baisse du CA",
    montantN: 2000000,
    mesure: "Plan de relance",
    aide: "Prêt garanti",
    commentaire: "Impact temporaire",
  },
  {
    id: 2,
    impact: "Provisions stocks",
    montantN: 500000,
    mesure: "Révision stocks",
    aide: "Report fiscal",
    commentaire: "Stocks obsolètes",
  },
  {
    id: 3,
    impact: "Chômage partiel",
    montantN: 300000,
    mesure: "Formation",
    aide: "Subvention état",
    commentaire: "Maintien emplois",
  },
  {
    id: 4,
    impact: "Investissements différés",
    montantN: 1000000,
    mesure: "Report projets",
    aide: "Crédit impôt",
    commentaire: "Report 12 mois",
  },
  {
    id: 5,
    impact: "Créances douteuses",
    montantN: 400000,
    mesure: "Restructuration",
    aide: "Moratoire",
    commentaire: "Clients fragilisés",
  },
];

// Note 26 - Contrats de location
export const NOTE_26_DATA = [
  {
    id: 1,
    type: "Crédit-bail immobilier",
    valeurActuelle: 3000000,
    duree: "5 ans",
    loyerAnnuel: 600000,
    optionAchat: "Oui",
    valeurOption: 2000000,
  },
  {
    id: 2,
    type: "Location véhicules",
    valeurActuelle: 800000,
    duree: "3 ans",
    loyerAnnuel: 300000,
    optionAchat: "Non",
    valeurOption: "N/A",
  },
  {
    id: 3,
    type: "Location équipement",
    valeurActuelle: 500000,
    duree: "4 ans",
    loyerAnnuel: 150000,
    optionAchat: "Oui",
    valeurOption: 100000,
  },
  {
    id: 4,
    type: "Baux commerciaux",
    valeurActuelle: 2000000,
    duree: "9 ans",
    loyerAnnuel: 400000,
    optionAchat: "Renouvellement",
    valeurOption: "N/A",
  },
  {
    id: 5,
    type: "Total engagements",
    valeurActuelle: 6300000,
    duree: "-",
    loyerAnnuel: 1450000,
    optionAchat: "-",
    valeurOption: 2100000,
  },
];

// Note 27 - Instruments financiers
export const NOTE_27_DATA = [
  {
    id: 1,
    instrument: "Actions cotées",
    categorie: "VMP",
    valeurComptable: 500000,
    valeurMarche: 550000,
    variation: "+10%",
    risque: "Marché",
  },
  {
    id: 2,
    instrument: "Obligations",
    categorie: "VMP",
    valeurComptable: 500000,
    valeurMarche: 480000,
    variation: "-4%",
    risque: "Taux",
  },
  {
    id: 3,
    instrument: "Swaps de taux",
    categorie: "Couverture",
    valeurComptable: 0,
    valeurMarche: 50000,
    variation: "N/A",
    risque: "Contrepartie",
  },
  {
    id: 4,
    instrument: "Options devises",
    categorie: "Spéculatif",
    valeurComptable: 100000,
    valeurMarche: 120000,
    variation: "+20%",
    risque: "Change",
  },
  {
    id: 5,
    instrument: "Total",
    categorie: "-",
    valeurComptable: 1100000,
    valeurMarche: 1150000,
    variation: "+4.5%",
    risque: "Diversifié",
  },
];

// Note 28 - Capital risque
export const NOTE_28_DATA = [
  {
    id: 1,
    investisseur: "Fonds A",
    montantInvesti: 2000000,
    dateEntree: "2020-05-15",
    participation: "15%",
    valorisation: 15000000,
    sortie: "2026 prévue",
  },
  {
    id: 2,
    investisseur: "Business Angel",
    montantInvesti: 500000,
    dateEntree: "2021-03-20",
    participation: "5%",
    valorisation: 10000000,
    sortie: "Négociation",
  },
  {
    id: 3,
    investisseur: "Fonds B",
    montantInvesti: 1000000,
    dateEntree: "2022-06-10",
    participation: "8%",
    valorisation: 12500000,
    sortie: "2027 prévue",
  },
  {
    id: 4,
    investisseur: "Total",
    montantInvesti: 3500000,
    dateEntree: "-",
    participation: "28%",
    valorisation: 37500000,
    sortie: "-",
  },
];

// Note 29 - Partenariats
export const NOTE_29_DATA = [
  {
    id: 1,
    partenaire: "Université X",
    objet: "R&D",
    duree: "3 ans",
    investissement: 400000,
    avantages: "Brevet exclusif",
    statut: "Actif",
  },
  {
    id: 2,
    partenaire: "ONG Y",
    objet: "Responsabilité sociale",
    duree: "2 ans",
    investissement: 200000,
    avantages: "Image positive",
    statut: "Actif",
  },
  {
    id: 3,
    partenaire: "Start-up Z",
    objet: "Innovation",
    duree: "18 mois",
    investissement: 300000,
    avantages: "Licence techno",
    statut: "En cours",
  },
  {
    id: 4,
    partenaire: "Collectivité",
    objet: "Développement local",
    duree: "4 ans",
    investissement: 500000,
    avantages: "Subventions",
    statut: "Signé",
  },
];

// Note 30 - Développement durable
export const NOTE_30_DATA = [
  {
    id: 1,
    domaine: "Environnement",
    action: "Réduction CO2",
    investissement: 300000,
    reduction: "25%",
    certification: "ISO 14001",
    annee: "2023",
  },
  {
    id: 2,
    domaine: "Social",
    action: "Formation employés",
    investissement: 200000,
    beneficiaires: "50",
    certification: "Label diversité",
    annee: "2023",
  },
  {
    id: 3,
    domaine: "Gouvernance",
    action: "Comité éthique",
    investissement: 100000,
    membres: "5",
    certification: "AFNOR",
    annee: "2022",
  },
  {
    id: 4,
    domaine: "Économique",
    action: "Circuit court",
    investissement: 150000,
    fournisseurs: "20 locaux",
    certification: "ESG",
    annee: "2023",
  },
];

// Note 31 - Recherche et développement
export const NOTE_31_DATA = [
  {
    id: 1,
    projet: "Nouveau produit A",
    budget: 800000,
    depenseN: 400000,
    depenseN1: 300000,
    capitaliseN: 200000,
    capitaliseN1: 150000,
    statut: "Phase test",
  },
  {
    id: 2,
    projet: "Amélioration procédé",
    budget: 500000,
    depenseN: 250000,
    depenseN1: 200000,
    capitaliseN: 150000,
    capitaliseN1: 100000,
    statut: "Implémentation",
  },
  {
    id: 3,
    projet: "Logiciel interne",
    budget: 300000,
    depenseN: 150000,
    depenseN1: 100000,
    capitaliseN: 100000,
    capitaliseN1: 50000,
    statut: "Développement",
  },
  {
    id: 4,
    projet: "Total R&D",
    budget: 1600000,
    depenseN: 800000,
    depenseN1: 600000,
    capitaliseN: 450000,
    capitaliseN1: 300000,
    statut: "-",
  },
];

// Note 32 - Goodwill
export const NOTE_32_DATA = [
  {
    id: 1,
    acquisition: "Société Alpha",
    date: "2020-06-30",
    prixAcquisition: 5000000,
    actifsNets: 4000000,
    goodwill: 1000000,
    amortissement: 200000,
    vnc: 800000,
  },
  {
    id: 2,
    acquisition: "Société Beta",
    date: "2021-12-15",
    prixAcquisition: 3000000,
    actifsNets: 2500000,
    goodwill: 500000,
    amortissement: 100000,
    vnc: 400000,
  },
  {
    id: 3,
    acquisition: "Société Gamma",
    date: "2022-03-20",
    prixAcquisition: 2000000,
    actifsNets: 1800000,
    goodwill: 200000,
    amortissement: 40000,
    vnc: 160000,
  },
  {
    id: 4,
    acquisition: "Total",
    date: "-",
    prixAcquisition: 10000000,
    actifsNets: 8300000,
    goodwill: 1700000,
    amortissement: 340000,
    vnc: 1360000,
  },
];

// Note 33 - Stock-options
export const NOTE_33_DATA = [
  {
    id: 1,
    beneficiaire: "Direction",
    optionsAttribuees: 50000,
    prixExercice: 10,
    valeurIntrinseque: 5,
    valeurTotale: 250000,
    dateExercice: "2025-12-31",
  },
  {
    id: 2,
    beneficiaire: "Cadres",
    optionsAttribuees: 30000,
    prixExercice: 10,
    valeurIntrinseque: 5,
    valeurTotale: 150000,
    dateExercice: "2026-06-30",
  },
  {
    id: 3,
    beneficiaire: "Employés clés",
    optionsAttribuees: 20000,
    prixExercice: 10,
    valeurIntrinseque: 5,
    valeurTotale: 100000,
    dateExercice: "2027-12-31",
  },
  {
    id: 4,
    beneficiaire: "Total",
    optionsAttribuees: 100000,
    prixExercice: "-",
    valeurIntrinseque: "-",
    valeurTotale: 500000,
    dateExercice: "-",
  },
];

// Note 34 - Pensions et retraites
export const NOTE_34_DATA = [
  {
    id: 1,
    plan: "Retraite complémentaire",
    type: "Défini",
    engagement: 800000,
    actifs: 600000,
    deficit: 200000,
    provision: 200000,
    commentaire: "Plan de financement",
  },
  {
    id: 2,
    plan: "Prévoyance",
    type: "Défini",
    engagement: 300000,
    actifs: 250000,
    deficit: 50000,
    provision: 50000,
    commentaire: "Couverture partielle",
  },
  {
    id: 3,
    plan: "Indemnités départ",
    type: "Indéfini",
    engagement: 400000,
    actifs: 0,
    deficit: 400000,
    provision: 400000,
    commentaire: "Provision annuelle",
  },
  {
    id: 4,
    plan: "Total",
    type: "-",
    engagement: 1500000,
    actifs: 850000,
    deficit: 650000,
    provision: 650000,
    commentaire: "-",
  },
];

// Note 35 - Autres informations
export const NOTE_35_DATA = [
  {
    id: 1,
    information: "Changement direction",
    date: "2023-07-01",
    impact: "Organisation",
    commentaire: "Nouveau DG nommé",
  },
  {
    id: 2,
    information: "Nouveau siège social",
    date: "2023-10-15",
    impact: "Immobilisations",
    commentaire: "Achat bâtiment",
  },
  {
    id: 3,
    information: "Certification qualité",
    date: "2023-09-30",
    impact: "Processus",
    commentaire: "ISO 9001 obtenue",
  },
  {
    id: 4,
    information: "Prix innovation",
    date: "2023-11-20",
    impact: "Réputation",
    commentaire: "Récompense nationale",
  },
  {
    id: 5,
    information: "Audit externe",
    date: "2023-12-15",
    impact: "Contrôle",
    commentaire: "Aucune réserve",
  },
];

// Données existantes (conservées pour compatibilité)
export const NOTE_36_CODES = [
  {
    id: 1,
    code: "SA",
    formeJuridique: "Société Anonyme à paricipation publique",
    num: "001",
    paysSiegeSocial: "Pays UEMOA",
    A: "",
    B: "",
  },
  {
    id: 2,
    code: "SA",
    formeJuridique: "Société Anonyme",
    num: "001",
    paysSiegeSocial: "Pays CEMAC",
    A: "",
    B: "",
  },
  {
    id: 3,
    code: "SARL",
    formeJuridique: "Société à Responsabilité Limitée",
    num: "002",
    paysSiegeSocial: "Autre pays OHADA",
    A: "",
    B: "",
  },
  {
    id: 4,
    code: "SCS",
    formeJuridique: "Société en Commandite Simple",
    num: "006",
    paysSiegeSocial: "Autre pays africains ",
    A: "2",
    B: "1",
  },
  {
    id: 5,
    code: "SNC",
    formeJuridique: "Société en Nom Collectif",
    num: "007",
    paysSiegeSocial: "France",
    A: "2",
    B: "3",
  },
  {
    id: 6,
    code: "SP",
    formeJuridique: "Société en Participation",
    num: "003",
    paysSiegeSocial: "Suisse",
    A: "2",
    B: "2",
  },
  {
    id: 7,
    code: "GIE",
    formeJuridique: "Groupement d'Intérêt Économique",
    num: "005",
    paysSiegeSocial: "Pays de l'union européenne",
    A: "3",
    B: "9",
  },
  {
    id: 8,
    code: "EI",
    formeJuridique: "Entreprise Individuelle",
    num: "004",
    paysSiegeSocial: "Pays américains",
    A: "4",
    B: "9",
  },
  {
    id: 9,
    code: "",
    formeJuridique: "Association",
    num: "008",
    paysSiegeSocial: "Pays asiatiques",
    A: "5",
    B: "9",
  },
  {
    id: 10,
    code: "",
    formeJuridique: "Autre forme juridique",
    num: "008",
    paysSiegeSocial: "Autre pays ",
    A: "9",
    B: "9",
  },
];

export const NOMENCLATURE_DATA = [
  // Agriculture vivrière
  { id: 1, codeActivite: "", activite: "Culture Céréalière" },
  { id: 1, codeActivite: "001001", activite: "Culture Céréalière" },
  {
    id: 2,
    codeActivite: "001002",
    activite: "Culture de tubercules et plantains",
  },
  { id: 3, codeActivite: "001003", activite: "Culture de légumes" },
  { id: 4, codeActivite: "001004", activite: "Culture de condiments" },
  { id: 5, codeActivite: "001005", activite: "Culture de fruits" },
  {
    id: 6,
    codeActivite: "001006",
    activite: "Culture d'autres produits de l'agriculture vivrière",
  },
  { id: "", codeActivite: "", activite: "" },

  // Agriculture Industrielle et d'exportation
  {
    id: "",
    codeActivite: "",
    activite: "Agriculture Industrielle et d'exportation",
  },
  { id: 7, codeActivite: "002001", activite: "Culture de canne à sucre" },
  { id: 8, codeActivite: "002002", activite: "Culture d'arachide d'huilerie" },
  { id: 9, codeActivite: "002003", activite: "Culture d'arachide de bouche" },
  { id: 10, codeActivite: "002004", activite: "Culture de tabac" },
  { id: 11, codeActivite: "002005", activite: "Culture de coton" },
  { id: 12, codeActivite: "002006", activite: "Culture de blé" },
  { id: 13, codeActivite: "002007", activite: "Culture de cacao" },
  { id: 14, codeActivite: "002008", activite: "Culture de café" },
  {
    id: 15,
    codeActivite: "002009",
    activite: "Culture de banane d'exportation",
  },
  {
    id: 16,
    codeActivite: "002010",
    activite: "Culture d'ananas d'exportation",
  },
  { id: 17, codeActivite: "002011", activite: "Autres cultures industrielles" },
  { id: "", codeActivite: "", activite: "" },

  // Elevage et Chasse
  { id: "", codeActivite: "", activite: "Elevage et Chasse" },
  { id: 18, codeActivite: "003001", activite: "Elevage bovin" },
  { id: 19, codeActivite: "003002", activite: "Elevage ovin, caprin, équin" },
  { id: 20, codeActivite: "003003", activite: "Elevage de volaille" },
  { id: 21, codeActivite: "003004", activite: "Autres élevages" },
  { id: 22, codeActivite: "003005", activite: "Chasse" },
  { id: "", codeActivite: "", activite: "" },

  // Sylviculture, exploitation forestière
  {
    id: "",
    codeActivite: "004001",
    activite: "Sylviculture, exploitation forestière",
  },
  { id: 23, codeActivite: "004001", activite: "Sylviculture" },
  { id: 24, codeActivite: "004002", activite: "Exploitation forestière" },
  { id: "", codeActivite: "", activite: "" },

  // Pêche et aquaculture
  { id: "", codeActivite: "", activite: "Pêche et aquaculture" },
  { id: 25, codeActivite: "005001", activite: "Pêche de poisson" },
  { id: 26, codeActivite: "005002", activite: "Autres pêches et aquaculture" },
  { id: "", codeActivite: "", activite: "" },

  // Industrie extractives
  { id: "", codeActivite: "", activite: "Industrie extractives" },
  { id: 27, codeActivite: "006001", activite: "Extraction d'hydrocarbure" },
  { id: 28, codeActivite: "006002", activite: "Extraction d'autres produits" },
  { id: "", codeActivite: "", activite: "" },

  // Production de viandes et de poissons
  {
    id: "",
    codeActivite: "",
    activite: "Production de viandes et de poissons",
  },
  {
    id: 29,
    codeActivite: "007001",
    activite: "Production de viandes et de produits à base de viande",
  },
  {
    id: 30,
    codeActivite: "007002",
    activite: "Production de poisson et de produits à base de poisson",
  },
  { id: "", codeActivite: "", activite: "" },

  // Travail de grains et fabrication de produits amylacés
  {
    id: 31,
    codeActivite: "008000",
    activite: "Travail de grains et fabrication de produits amylacés",
  },

  // Transformation du café et du cacao
  { id: 32, codeActivite: "009001", activite: "Transformation du café" },
  { id: 33, codeActivite: "009002", activite: "Transformation du cacao" },

  // Industrie des oléagineux
  { id: 34, codeActivite: "010001", activite: "Huiles brutes et tourteaux" },
  { id: 35, codeActivite: "010002", activite: "Autres corps gras" },

  // Boulangerie, Pâtisserie et pâtes alimentaires
  {
    id: 36,
    codeActivite: "011001",
    activite: "Fabrication de pains, de biscuits et de pâtisseries",
  },
  {
    id: 37,
    codeActivite: "011002",
    activite: "Fabrication de pâtes alimentaires",
  },

  // Industrie laitière
  { id: 38, codeActivite: "012000", activite: "Industrie laitière" },

  // Transformation de fruits et légumes et fabrication d'autres produits alimentaires
  { id: 39, codeActivite: "013001", activite: "Fabrication de sucre" },
  {
    id: 40,
    codeActivite: "013002",
    activite: "Fabrication de produit à base de fruits et de légumes",
  },
  {
    id: 41,
    codeActivite: "013003",
    activite: "Fabrication d'autres produits alimentaires",
  },

  // Industrie des boissons
  { id: 42, codeActivite: "014001", activite: "Brasseries et malteries" },
  {
    id: 43,
    codeActivite: "014002",
    activite: "Fabrication d'autres boissons alcoolisées",
  },
  {
    id: 44,
    codeActivite: "014003",
    activite: "Fabrication de boissons non alcoolisées et d'eaux minérales",
  },

  // Industrie de Tabac
  { id: 45, codeActivite: "015000", activite: "Industrie de Tabac" },

  // Industrie textiles et habillement
  { id: 46, codeActivite: "016001", activite: "Industrie textiles" },
  { id: 47, codeActivite: "016002", activite: "Industrie de l'habillement" },

  // Industrie de cuir et de la chaussure
  {
    id: 48,
    codeActivite: "017001",
    activite: "Fabrication de cuir et articles en cuir",
  },
  { id: 49, codeActivite: "017002", activite: "Fabrication de chaussures" },

  // Industrie du bois
  {
    id: 50,
    codeActivite: "018001",
    activite: "Sciage, rabotage et imprégnation du bois",
  },
  {
    id: 51,
    codeActivite: "018002",
    activite: "Fabrication de panneaux en bois",
  },
  {
    id: 52,
    codeActivite: "018003",
    activite: "Fabrication d'article en bois assemblés",
  },

  // Industrie du papier et cartons, de l'édition et de l'imprimerie
  {
    id: 53,
    codeActivite: "019001",
    activite: "Industrie du papier et cartons",
  },
  {
    id: 54,
    codeActivite: "019002",
    activite: "Edition, imprimerie, reproduction",
  },

  // Raffinage du pétrole
  { id: 55, codeActivite: "020000", activite: "Raffinage du pétrole" },

  // Industrie chimique
  { id: 56, codeActivite: "021001", activite: "Industrie chimique" },
  {
    id: 57,
    codeActivite: "021002",
    activite: "Fabrication de savons, de détergents et de produits d'entretien",
  },
  {
    id: 58,
    codeActivite: "021003",
    activite: "Fabrication de produit agro-chimiques",
  },
  { id: 59, codeActivite: "021004", activite: "Industries pharmaceutiques" },
  {
    id: 60,
    codeActivite: "021005",
    activite: "Fabrication d'autres produits chimiques",
  },

  // Industrie du caoutchouc et des plastiques
  {
    id: 61,
    codeActivite: "022001",
    activite: "Fabrication du caoutchouc naturel",
  },
  { id: 62, codeActivite: "022002", activite: "Industries de caoutchouc" },
  {
    id: 63,
    codeActivite: "022003",
    activite: "Fabrication de matières plastiques",
  },

  // Fabrication d'autres produits minéraux non métallique et de matériaux de construction
  { id: 64, codeActivite: "023001", activite: "Industrie du verre" },
  {
    id: 65,
    codeActivite: "023002",
    activite: "Fabrication de produits minéraux pour la construction",
  },
  {
    id: 66,
    codeActivite: "023003",
    activite: "Fabrication d'autres produits minéraux non métalliques",
  },

  // Métallurgie et travail des métaux
  { id: 67, codeActivite: "024001", activite: "Métallurgie" },
  { id: 68, codeActivite: "024002", activite: "Travail des métaux" },

  // Fabrication de machines, d'équipement et d'appareils électriques
  {
    id: 69,
    codeActivite: "025001",
    activite: "Fabrication de machines, et d'équipement",
  },
  {
    id: 70,
    codeActivite: "025002",
    activite: "Fabrication de machines de bureaux",
  },
  {
    id: 71,
    codeActivite: "025003",
    activite: "Fabrication d'appareils électriques",
  },

  // Fabrication d'équipements et appareils audiovisuels et de communication ; fabrication d'instruments médicaux, d'optique et d'horlogerie
  {
    id: 72,
    codeActivite: "026001",
    activite:
      "Fabrication d'équipements et appareils audiovisuels et de communication",
  },
  {
    id: 73,
    codeActivite: "026002",
    activite: "Fabrication d'instruments médicaux, d'optique et d'horlogerie",
  },

  // Fabrication de matériel de transport
  {
    id: 74,
    codeActivite: "027001",
    activite: "Fabrication de véhicule routier",
  },
  {
    id: 75,
    codeActivite: "027002",
    activite: "Fabrication d'autres matériels de transport",
  },

  // Industrie diverses
  { id: 76, codeActivite: "028001", activite: "Fabrication de meubles" },
  { id: 77, codeActivite: "028002", activite: "Industrie diverses" },

  // Production et distribution d'eau, d'électricité et de gaz
  {
    id: 78,
    codeActivite: "029001",
    activite: "Production, transport et distribution d'électricité",
  },
  {
    id: 79,
    codeActivite: "029002",
    activite: "Captage, épuration et distribution d'eau",
  },
  {
    id: 80,
    codeActivite: "029003",
    activite: "Production et distribution de gaz",
  },

  // Construction
  {
    id: 81,
    codeActivite: "030001",
    activite:
      "Préparation de sites et construction d'ouvrages de bâtiments ou de génie civil",
  },
  {
    id: 82,
    codeActivite: "030002",
    activite: "Travaux d'installation et de finition",
  },

  // Commerce
  {
    id: 83,
    codeActivite: "031001",
    activite: "Commerce de véhicules, d'accessoires et de carburant",
  },
  {
    id: 84,
    codeActivite: "031002",
    activite: "Commerce de produits agricoles bruts et d'animaux vivants",
  },
  { id: 85, codeActivite: "031003", activite: "Autres commerces" },

  // Réparations
  {
    id: 86,
    codeActivite: "032001",
    activite: "Entretien et réparation des véhicules automobile",
  },
  {
    id: 87,
    codeActivite: "032002",
    activite: "Réparation de biens personnels et domestiques",
  },

  // Hôtels, restaurant
  { id: 88, codeActivite: "033001", activite: "Hôtels" },
  { id: 89, codeActivite: "033002", activite: "Bars et restaurants" },

  // Transport et communication
  { id: 90, codeActivite: "034001", activite: "Transport ferroviaire" },
  {
    id: 91,
    codeActivite: "034002",
    activite: "Transports routière, transport par conduite",
  },
  { id: 92, codeActivite: "034003", activite: "Transport par eau" },
  { id: 93, codeActivite: "034004", activite: "Transport aérien" },
  {
    id: 94,
    codeActivite: "034005",
    activite: "Services annexes et auxiliaire de transport",
  },

  // Postes, télécommunication
  { id: 95, codeActivite: "035001", activite: "Postes" },
  { id: 96, codeActivite: "035002", activite: "Télécommunication" },

  // Activités financières
  {
    id: 97,
    codeActivite: "036001",
    activite: "Services d'intermédiation financière",
  },
  {
    id: 98,
    codeActivite: "036002",
    activite: "Assurances (sauf sécurité sociale)",
  },
  {
    id: 99,
    codeActivite: "036003",
    activite: "Auxiliaire financiers et d'assurances",
  },

  // Activités Immobilières
  {
    id: 100,
    codeActivite: "037001",
    activite: "Locations de biens immobiliers",
  },
  { id: 101, codeActivite: "037002", activite: "Autres services immobiliers" },

  // Services aux entités
  { id: 102, codeActivite: "038001", activite: "Locations sans opérateurs" },
  { id: 103, codeActivite: "038002", activite: "Activités informatiques" },
  {
    id: 104,
    codeActivite: "038003",
    activite: "Services rendus principalement aux entités",
  },

  // Administration publiques
  {
    id: 105,
    codeActivite: "039001",
    activite: "Administration générale, économique et sociale",
  },
  {
    id: 106,
    codeActivite: "039002",
    activite: "Services de prérogatives publiques",
  },
  { id: 107, codeActivite: "039003", activite: "Sécurité sociale obligatoire" },

  // Education
  { id: 108, codeActivite: "040000", activite: "Education" },

  // Santé et action sociale
  {
    id: 109,
    codeActivite: "041001",
    activite: "Activités pour la santé des hommes",
  },
  { id: 110, codeActivite: "041002", activite: "Activités vétérinaires" },
  { id: 111, codeActivite: "041003", activite: "Action sociale" },

  // Services collectifs, sociaux et personnels
  {
    id: 112,
    codeActivite: "042001",
    activite: "Assainissement, voirie et gestion des déchets",
  },
  { id: 113, codeActivite: "042002", activite: "Activités associatives" },
  {
    id: 114,
    codeActivite: "042003",
    activite: "Activités récréatives, culturelles et sportives",
  },
  { id: 115, codeActivite: "042004", activite: "Services personnels" },
  { id: 116, codeActivite: "042005", activite: "Services domestiques" },

  // Services d'intermédiation financière indirectement mesuré
  {
    id: 117,
    codeActivite: "043000",
    activite: "Services d'intermédiation financière indirectement mesuré",
  },

  // Correction territoriale
  { id: 118, codeActivite: "044000", activite: "Correction territoriale" },
];

export const FICHE_R3_DATA = [
  {
    id: 1,
    nomPrenom: "DUPONT Jean",
    nationalite: "Française",
    qualite: "Président",
    identFiscale: "FR12345678901",
    adresse: "123 Rue de Paris, 75001 Paris",
  },
  {
    id: 2,
    nomPrenom: "MARTIN Sophie",
    nationalite: "Française",
    qualite: "Directrice Générale",
    identFiscale: "FR98765432109",
    adresse: "456 Avenue des Champs, 75008 Paris",
  },
  {
    id: 3,
    nomPrenom: "BERNARD Pierre",
    nationalite: "Belge",
    qualite: "Administrateur",
    identFiscale: "BE1234567890",
    adresse: "789 Boulevard Anspach, 1000 Bruxelles",
  },
  {
    id: 4,
    nomPrenom: "PETIT Marie",
    nationalite: "Suisse",
    qualite: "Commissaire aux comptes",
    identFiscale: "CH123456789",
    adresse: "10 Rue du Rhône, 1204 Genève",
  },
  {
    id: 5,
    nomPrenom: "DURAND Luc",
    nationalite: "Canadienne",
    qualite: "Actionnaire",
    identFiscale: "CA123456789",
    adresse: "100 Queen Street, Ottawa, ON K1P",
  },
];

export const BILAN_ACTIF_DATA = [
  {
    id: 1,
    compte: "20",
    libelle: "Immobilisations incorporelles",
    brutN: 1500000,
    amortissementsN: 300000,
    netN: 1200000,
    brutN1: 1400000,
    amortissementsN1: 250000,
    netN1: 1150000,
  },
  {
    id: 2,
    compte: "21",
    libelle: "Immobilisations corporelles",
    brutN: 5000000,
    amortissementsN: 1500000,
    netN: 3500000,
    brutN1: 4500000,
    amortissementsN1: 1200000,
    netN1: 3300000,
  },
  {
    id: 3,
    compte: "27",
    libelle: "Immobilisations financières",
    brutN: 2000000,
    amortissementsN: 0,
    netN: 2000000,
    brutN1: 1800000,
    amortissementsN1: 0,
    netN1: 1800000,
  },
  {
    id: 4,
    compte: "3",
    libelle: "Stocks",
    brutN: 1200000,
    amortissementsN: 100000,
    netN: 1100000,
    brutN1: 1000000,
    amortissementsN1: 80000,
    netN1: 920000,
  },
  {
    id: 5,
    compte: "40",
    libelle: "Créances clients",
    brutN: 2500000,
    amortissementsN: 200000,
    netN: 2300000,
    brutN1: 2200000,
    amortissementsN1: 150000,
    netN1: 2050000,
  },
  {
    id: 6,
    compte: "50",
    libelle: "Valeurs mobilières de placement",
    brutN: 800000,
    amortissementsN: 0,
    netN: 800000,
    brutN1: 700000,
    amortissementsN1: 0,
    netN1: 700000,
  },
  {
    id: 7,
    compte: "53",
    libelle: "Trésorerie",
    brutN: 1200000,
    amortissementsN: 0,
    netN: 1200000,
    brutN1: 1000000,
    amortissementsN1: 0,
    netN1: 1000000,
  },
];

export const BILAN_PASSIF_DATA = [
  {
    id: 1,
    compte: "10",
    libelle: "Capital social",
    montantN: 3000000,
    montantN1: 3000000,
  },
  {
    id: 2,
    compte: "11",
    libelle: "Réserves",
    montantN: 1500000,
    montantN1: 1200000,
  },
  {
    id: 3,
    compte: "12",
    libelle: "Report à nouveau",
    montantN: 500000,
    montantN1: 400000,
  },
  {
    id: 4,
    compte: "13",
    libelle: "Résultat de l'exercice",
    montantN: 800000,
    montantN1: 600000,
  },
  {
    id: 5,
    compte: "16",
    libelle: "Emprunts et dettes financières",
    montantN: 2500000,
    montantN1: 2200000,
  },
  {
    id: 6,
    compte: "40",
    libelle: "Dettes fournisseurs",
    montantN: 1800000,
    montantN1: 1500000,
  },
  {
    id: 7,
    compte: "42",
    libelle: "Dettes fiscales et sociales",
    montantN: 700000,
    montantN1: 600000,
  },
  {
    id: 8,
    compte: "45",
    libelle: "Autres dettes",
    montantN: 300000,
    montantN1: 250000,
  },
];

export const BILAN_RESULTAT_DATA = [
  {
    id: 1,
    compte: "70",
    libelle: "Ventes de marchandises",
    montantN: 8500000,
    montantN1: 7200000,
  },
  {
    id: 2,
    compte: "71",
    libelle: "Production vendue",
    montantN: 3200000,
    montantN1: 2800000,
  },
  {
    id: 3,
    compte: "60",
    libelle: "Achats de marchandises",
    montantN: 4500000,
    montantN1: 3800000,
  },
  {
    id: 4,
    compte: "61",
    libelle: "Achats de matières premières",
    montantN: 1200000,
    montantN1: 1000000,
  },
  {
    id: 5,
    compte: "62",
    libelle: "Autres achats et charges externes",
    montantN: 1800000,
    montantN1: 1500000,
  },
  {
    id: 6,
    compte: "63",
    libelle: "Impôts, taxes et versements assimilés",
    montantN: 500000,
    montantN1: 420000,
  },
  {
    id: 7,
    compte: "64",
    libelle: "Charges de personnel",
    montantN: 3200000,
    montantN1: 2800000,
  },
  {
    id: 8,
    compte: "65",
    libelle: "Autres charges de gestion courante",
    montantN: 800000,
    montantN1: 700000,
  },
  {
    id: 9,
    compte: "66",
    libelle: "Charges financières",
    montantN: 300000,
    montantN1: 250000,
  },
  {
    id: 10,
    compte: "67",
    libelle: "Charges exceptionnelles",
    montantN: 200000,
    montantN1: 150000,
  },
  {
    id: 11,
    compte: "75",
    libelle: "Produits financiers",
    montantN: 400000,
    montantN1: 350000,
  },
  {
    id: 12,
    compte: "76",
    libelle: "Produits exceptionnels",
    montantN: 150000,
    montantN1: 100000,
  },
];
