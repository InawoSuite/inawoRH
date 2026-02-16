// // Etats.js - Version simplifiée
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col } from "reactstrap";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useEtatsData } from "./hooks/useEtatsData";
// import NavigationTabs from "./components/NavigationTabs";
// import SearchAndActions from "./components/SearchAndActions";
// import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
// import Loader from "../../../../Components/Common/Loader";
// import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
// import DeleteModal from "../../../../Components/Common/DeleteModal";
// import BreadCrumb from "../../../../Components/Common/BreadCrumb";
// import { Link } from "react-router-dom";


// // Import des composants de tableaux
// import Note1 from "./tables/Note1";
// // import Note2Table from "./components/tables/Note2Table";
// // import TFTTable from "./components/tables/TFTTable";
// // import Fiche4Table from "./components/tables/Fiche4Table";
// // import BilanTable from "./components/tables/BilanTable";
// // import ResultatTable from "./components/tables/ResultatTable";
// // import NomenclatureTable from "./components/tables/NomenclatureTable";
// // import CodesTable from "./components/tables/CodesTable";
// // import FicheR3Table from "./components/tables/FicheR3Table";
// // import Note17_35Table from "./components/tables/Note17_35Table";

// const Etats = () => {
//   // États principaux
//   const [activeTab, setActiveTab] = useState("1");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isExportCSV, setIsExportCSV] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   // Hook personnalisé pour la gestion des données
//   const {
//     loading,
//     currentData,
//     filteredData,
//     exportData,
//     formatAmount,
//     fetchData,
//     getActiveTabTitle
//   } = useEtatsData(activeTab, searchTerm);

//   // Chargement initial
//   useEffect(() => {
//     document.title = "États Comptables | INAWO - Suite de Gestion";
//     fetchData();
//   }, [activeTab]);

//   // Gestionnaire de suppression
//   const handleDeleteItem = async () => {
//     if (!itemToDelete?.id) return;
    
//     setTimeout(() => {
//       // TODO: Implémenter la suppression réelle
//       setDeleteModal(false);
//       setItemToDelete(null);
//     }, 600);
//   };

//   // Rendu du tableau selon l'onglet actif
//   const renderTableContent = () => {
//     if (loading) {
//       return (
//         <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: "300px" }}>
//           <div className="text-center">
//             <Loader />
//             <p className="mt-3 text-muted">Chargement des données...</p>
//           </div>
//         </div>
//       );
//     }

//     if (filteredData.length === 0) {
//       return (
//         <EmptyDataCard
//           title="Aucune donnée trouvée"
//           description={
//             searchTerm
//               ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
//               : "Aucune donnée disponible pour cet état comptable."
//           }
//           actionButton={
//             <button
//               className="btn btn-success rounded-pill"
//               onClick={() => setSearchTerm("")}
//             >
//               <i className="ri-refresh-line me-1"></i>
//               Réinitialiser la recherche
//             </button>
//           }
//         />
//       );
//     }

//     // Sélection du composant de tableau selon l'onglet
//     const tableComponents = {
//     //   "1": <CodesTable data={filteredData} formatAmount={formatAmount} />,
//     //   "2": <NomenclatureTable data={filteredData} formatAmount={formatAmount} />,
//     //   "3": <FicheR3Table data={filteredData} formatAmount={formatAmount} />,
//     //   "4": <BilanTable data={filteredData} formatAmount={formatAmount} type="complet" />,
//     //   "5": <BilanTable data={filteredData} formatAmount={formatAmount} type="actif" />,
//     //   "6": <BilanTable data={filteredData} formatAmount={formatAmount} type="passif" />,
//     //   "7": <ResultatTable data={filteredData} formatAmount={formatAmount} />,
//     //   "8": <TFTTable data={filteredData} formatAmount={formatAmount} />,
//     //   "9": <Fiche4Table data={filteredData} formatAmount={formatAmount} />,
//       "10": <Note1 data={filteredData} formatAmount={formatAmount} />,
//     //   "11": <Note2Table data={filteredData} formatAmount={formatAmount} />,
//       // Pour les notes 12 à 16, vous pourriez créer un composant générique
//       // Pour les notes 17 à 35, utiliser un composant configurable
//     //   "37": <Note17_35Table data={filteredData} formatAmount={formatAmount} type="engagements" />,
//     //   "38": <Note17_35Table data={filteredData} formatAmount={formatAmount} type="devises" />,
//       // ... etc pour les autres onglets
//     };

//     return tableComponents[activeTab] || (
//       <div className="alert alert-warning">
//         Composant pour l'onglet {activeTab} non implémenté
//       </div>
//     );
//   };

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           {/* Toast Container */}
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             style={{ marginTop: "70px" }}
//           />

//           {/* Modals */}
//           <ExportCSVModal
//             show={isExportCSV}
//             onCloseClick={() => setIsExportCSV(false)}
//             data={exportData}
//             filename={`${getActiveTabTitle.replace(/ /g, "_")}_${
//               new Date().toISOString().split("T")[0]
//             }`}
//           />

//           <DeleteModal
//             show={deleteModal}
//             onDeleteClick={handleDeleteItem}
//             onCloseClick={() => {
//               setDeleteModal(false);
//               setItemToDelete(null);
//             }}
//             deleteMessage="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
//           />

//           {/* Breadcrumb */}
//           <BreadCrumb
//             title={getActiveTabTitle}
//             pageTitle={
//               <>
//                 <i className="ri-file-text-line me-1 align-bottom"></i>
//                 &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
//               </>
//             }
//           />

//           {/* Barre de recherche et actions */}
//           <Row>
//             <Col lg={12}>
//               <SearchAndActions
//                 searchTerm={searchTerm}
//                 onSearchChange={setSearchTerm}
//                 activeTabTitle={getActiveTabTitle}
//                 filteredDataLength={filteredData.length}
//                 onExportClick={() => setIsExportCSV(true)}
//                 onAddClick={() => {}} // Si nécessaire
//               />
//             </Col>
//           </Row>

//           {/* Contenu principal */}
//           <Row className="mb-3">
//             <Col lg={12}>
//               <div className="card rounded-4">
//                 <div className="card-body p-0">
//                   {/* Navigation par onglets */}
//                   <NavigationTabs
//                     activeTab={activeTab}
//                     setActiveTab={setActiveTab}
//                   />

//                   {/* Contenu de l'onglet */}
//                   <div className="p-3">
//                     {renderTableContent()}
//                   </div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Etats;





import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../../../Components/Common/Loader";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import Pagination from "../../../../Components/Common/Pagination";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Button,
  FormFeedback,
  Badge,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Alert,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import classnames from "classnames";

// ============================================================================
// DONNÉES FICTIVES POUR TOUS LES TABLEAUX
// ============================================================================

// Données pour TFT (Tableau de Financement par Tiers)
// Dans la section des données existantes (après les autres données)
const TFT_COMPLET_DATA = [
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
const RESULTAT_DATA = [
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

const TFT_DATA = [
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

const FICHE_4_DATA = [
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

const NOTE_1_DATA = [
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
const NOTE_2_DATA = [
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
const NOTE_3A_DATA = [
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
const NOTE_3B_DATA = [
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
const NOTE_3C_DATA = [
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
const NOTE_3D_DATA = [
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
const NOTE_3E_DATA = [
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
const NOTE_4_DATA = [
  { id: 1, designation: "IS théorique (25%)", base: 1800000, montant: 450000 },
  { id: 2, designation: "Crédits d'impôt", base: 50000, montant: 50000 },
  { id: 3, designation: "Déficits reportables", base: 100000, montant: 25000 },
  { id: 4, designation: "IS dû", base: 1650000, montant: 412500 },
  { id: 5, designation: "IS payé d'avance", base: 400000, montant: 400000 },
  { id: 6, designation: "IS à payer", base: 12500, montant: 12500 },
];

// Données pour Note 5 (Immobilisations)
const NOTE_5_DATA = [
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
const NOTE_6_DATA = [
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
const NOTE_7_DATA = [
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
const NOTE_8_DATA = [
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
const NOTE_8A_DATA = [
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
const NOTE_8B_DATA = [
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
const NOTE_8C_DATA = [
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
const NOTE_9_DATA = [
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
const NOTE_10_DATA = [
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
const NOTE_11_DATA = [
  { id: 1, exercice: "N-2", montant: 200000, affectation: "Report" },
  { id: 2, exercice: "N-1", montant: 400000, affectation: "Report" },
  { id: 3, exercice: "N", montant: 500000, affectation: "En instance" },
  { id: 4, exercice: "Solde", montant: 1100000, affectation: "Cumul" },
];

// Données pour Note 12 (Résultat de l'exercice)
const NOTE_12_DATA = [
  { id: 1, rubrique: "Résultat d'exploitation", montant: 2500000 },
  { id: 2, rubrique: "Résultat financier", montant: 300000 },
  { id: 3, rubrique: "Résultat exceptionnel", montant: 200000 },
  { id: 4, rubrique: "Résultat avant impôts", montant: 3000000 },
  { id: 5, rubrique: "Impôts sur les bénéfices", montant: 450000 },
  { id: 6, rubrique: "Résultat net", montant: 2550000 },
];

// Données pour Note 13 (Provisions)
const NOTE_13_DATA = [
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
const NOTE_14_DATA = [
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
const NOTE_15_DATA = [
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
const NOTE_15A_DATA = [
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
const NOTE_15B_DATA = [
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
const NOTE_15C_DATA = [
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
const NOTE_16BIS_DATA = [
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
const NOTE_16C_DATA = [
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

// ============================================================================
// NOUVELLES NOTES 17 À 35 (CHACUNE AVEC SON TABLEAU SPÉCIFIQUE)
// ============================================================================

// Note 17 - Engagements donnés et reçus
const NOTE_17_DATA = [
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
const NOTE_18_DATA = [
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
const NOTE_19_DATA = [
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

// Note 20 - Salaires et rémunérations
const NOTE_20_DATA = [
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
const NOTE_21_DATA = [
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
const NOTE_22_DATA = [
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
const NOTE_23_DATA = [
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
const NOTE_24_DATA = [
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
const NOTE_25_DATA = [
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
const NOTE_26_DATA = [
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
const NOTE_27_DATA = [
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
const NOTE_28_DATA = [
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
const NOTE_29_DATA = [
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
const NOTE_30_DATA = [
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
const NOTE_31_DATA = [
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
const NOTE_32_DATA = [
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
const NOTE_33_DATA = [
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
const NOTE_34_DATA = [
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
const NOTE_35_DATA = [
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
const NOTE_36_CODES = [
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

const NOMENCLATURE_DATA = [
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

const FICHE_R3_DATA = [
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

const BILAN_ACTIF_DATA = [
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

const BILAN_PASSIF_DATA = [
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

const BILAN_RESULTAT_DATA = [
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

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const Etats = () => {
  const { t } = useTranslation();

  // États principaux
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);

  // États des modals
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // États pour la suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const itemsPerPage = 10;

  // ✅ Fonction pour formater les montants
  const formatAmount = useCallback((amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // ✅ Fonction pour récupérer les données selon l'onglet actif
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case "1":
        return NOTE_36_CODES;
      case "2":
        return NOMENCLATURE_DATA;
      case "3":
        return FICHE_R3_DATA;
      case "4":
        return [
          ...BILAN_ACTIF_DATA,
          ...BILAN_PASSIF_DATA.map((p) => ({ ...p, type: "passif" })),
          ...BILAN_RESULTAT_DATA.map((r) => ({ ...r, type: "resultat" })),
        ];
      case "5":
        return BILAN_ACTIF_DATA;
      case "6":
        return BILAN_PASSIF_DATA;
      case "7":
        return BILAN_RESULTAT_DATA;
      case "8":
        return TFT_COMPLET_DATA;
      case "9":
        return FICHE_4_DATA;
      // Dans le TabContent, dans le map des onglets, ajouter ce cas après le case "9":
// ...
case "10": // Note 1
  return (
    <>
      <div className="mb-4">
        <h5 className="text-success mb-3">
          <i className="ri-shield-check-line me-2"></i>
          Note 1 - Dettes garanties par des sûretés réelles et engagements financiers
        </h5>
        <Alert color="info" className="mb-3">
          <i className="ri-information-line me-2"></i>
          Cette note présente les dettes garanties par des sûretés réelles ainsi que les engagements financiers donnés et reçus par l'entité.
        </Alert>
      </div>

      {/* Tableau principal */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead>
            <tr>
              <th rowSpan="2" className="text-center align-middle" width="25%">
                LIBELLES
              </th>
              <th rowSpan="2" className="text-center align-middle" width="8%">
                Note
              </th>
              <th rowSpan="2" className="text-center align-middle" width="12%">
                Montant
                <br />
                brut (1)
              </th>
              <th colSpan="3" className="text-center" width="36%">
                SURETES REELLES (2)
              </th>
              <th rowSpan="2" className="text-center align-middle" width="12%">
                TOTAL
                <br />
                SURETES REELLES
              </th>
            </tr>
            <tr>
              <th className="text-center" width="12%">
                Hypothèques
              </th>
              <th className="text-center" width="12%">
                Nantissements
              </th>
              <th className="text-center" width="12%">
                Gages/autres
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const isTotal = item.note === "TOTAL";
              const rowClass = isTotal ? "table-primary" : "";
              
              return (
                <tr key={item.id} className={rowClass}>
                  <td className={isTotal ? "fw-bold" : ""}>
                    {item.libelle}
                  </td>
                  <td className={isTotal ? "fw-bold text-primary" : ""}>
                    {item.note}
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.montantBrut)} 
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.hypotheques)} 
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.nantissements)} 
                  </td>
                  <td className={`text-end ${isTotal ? "fw-bold" : ""}`}>
                    {formatAmount(item.gagesAutres)} 
                  </td>
                  <td className={`text-end fw-bold ${isTotal ? "text-primary" : ""}`}>
                    {formatAmount(item.totalSuretes)} 
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section de détails pour chaque ligne */}
      <Card className="mt-4 border-0 shadow-sm">
        <CardBody>
          <h6 className="mb-3">
            <i className="ri-search-eye-line me-2"></i>
            Détails des sûretés réelles et engagements
          </h6>
          <div className="accordion" id="note1DetailsAccordion">
            {filteredData
              .filter(item => item.details && item.details.length > 0)
              .map((item, index) => (
                <div className="accordion-item" key={`accordion-${item.id}`}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${item.id}`}
                    >
                      <i className="ri-file-list-line me-2"></i>
                      {item.libelle} - Détails
                    </button>
                  </h2>
                  <div
                    id={`collapse${item.id}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#note1DetailsAccordion"
                  >
                    <div className="accordion-body">
                      <div className="table-responsive">
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th width="10%">Réf.</th>
                              <th width="40%">Description</th>
                              <th width="15%">Type</th>
                              <th width="15%">Montant</th>
                              <th width="20%">Informations complémentaires</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.details.map(detail => (
                              <tr key={detail.id}>
                                <td className="fw-bold">{detail.id}</td>
                                <td>{detail.description}</td>
                                <td>
                                  <Badge
                                    color={
                                      detail.type === "hypotheque"
                                        ? "primary"
                                        : detail.type === "nantissement"
                                        ? "success"
                                        : "warning"
                                    }
                                  >
                                    {detail.type === "hypotheque"
                                      ? "Hypothèque"
                                      : detail.type === "nantissement"
                                      ? "Nantissement"
                                      : "Gage/Autre"}
                                  </Badge>
                                </td>
                                <td className="fw-semibold">
                                  {formatAmount(detail.montant)} 
                                </td>
                                <td>
                                  {detail.dateContrat && (
                                    <div>
                                      <small className="text-muted">
                                        Date: {detail.dateContrat}
                                      </small>
                                    </div>
                                  )}
                                  {detail.echeance && (
                                    <div>
                                      <small className="text-muted">
                                        Échéance: {detail.echeance}
                                      </small>
                                    </div>
                                  )}
                                  {(detail.beneficiaire || detail.donneur) && (
                                    <div>
                                      <small className="text-muted">
                                        {detail.beneficiaire
                                          ? `Bénéficiaire: ${detail.beneficiaire}`
                                          : `Donneur: ${detail.donneur}`}
                                      </small>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>

      {/* Légende et notes */}
      <Card className="mt-3 border-0 shadow-sm">
        <CardBody>
          <Row>
            <Col md={6}>
              <h6 className="mb-2">
                <i className="ri-information-line me-2"></i>
                Notes explicatives
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <strong>(1) Montant brut :</strong> Valeur nominale de la dette avant garanties
                </li>
                <li className="mb-1">
                  <strong>(2) Sûretés réelles :</strong> Garanties portant sur des biens spécifiques
                </li>
                <li className="mb-1">
                  <strong>Hypothèques :</strong> Garanties sur des immeubles
                </li>
                <li className="mb-1">
                  <strong>Nantissements :</strong> Garanties sur des biens mobiliers
                </li>
                <li className="mb-1">
                  <strong>Gages/autres :</strong> Autres types de garanties
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="mb-2">
                <i className="ri-bar-chart-line me-2"></i>
                Répartition des sûretés
              </h6>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-1">
                  <span>Hypothèques :</span>
                  <span className="fw-bold text-primary">
                    {formatAmount(15000000)} 
                    <small className="text-muted ms-1">(44%)</small>
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Nantissements :</span>
                  <span className="fw-bold text-success">
                    {formatAmount(8500000)} 
                    <small className="text-muted ms-1">(25%)</small>
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Gages/autres :</span>
                  <span className="fw-bold text-warning">
                    {formatAmount(10500000)} 
                    <small className="text-muted ms-1">(31%)</small>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
// ...
      case "11":
        return NOTE_2_DATA;
      case "12":
        return NOTE_3A_DATA;
      case "13":
        return NOTE_3B_DATA;
      case "14":
        return NOTE_3C_DATA;
      case "15":
        return NOTE_3D_DATA;
      case "16":
        return NOTE_3E_DATA;
      case "17":
        return NOTE_4_DATA;
      case "18":
        return NOTE_5_DATA;
      case "19":
        return NOTE_6_DATA;
      case "20":
        return NOTE_7_DATA;
      case "21":
        return NOTE_8_DATA;
      case "22":
        return NOTE_8A_DATA;
      case "23":
        return NOTE_8B_DATA;
      case "24":
        return NOTE_8C_DATA;
      case "25":
        return NOTE_9_DATA;
      case "26":
        return NOTE_10_DATA;
      case "27":
        return NOTE_11_DATA;
      case "28":
        return NOTE_12_DATA;
      case "29":
        return NOTE_13_DATA;
      case "30":
        return NOTE_14_DATA;
      case "31":
        return NOTE_15_DATA;
      case "32":
        return NOTE_15A_DATA;
      case "33":
        return NOTE_15B_DATA;
      case "34":
        return NOTE_15C_DATA;
      case "35":
        return NOTE_16BIS_DATA;
      case "36":
        return NOTE_16C_DATA;
      // Notes 17 à 35 (nouvelles)
      case "37":
        return NOTE_17_DATA;
      case "38":
        return NOTE_18_DATA;
      case "39":
        return NOTE_19_DATA;
      case "40":
        return NOTE_20_DATA;
      case "41":
        return NOTE_21_DATA;
      case "42":
        return NOTE_22_DATA;
      case "43":
        return NOTE_23_DATA;
      case "44":
        return NOTE_24_DATA;
      case "45":
        return NOTE_25_DATA;
      case "46":
        return NOTE_26_DATA;
      case "47":
        return NOTE_27_DATA;
      case "48":
        return NOTE_28_DATA;
      case "49":
        return NOTE_29_DATA;
      case "50":
        return NOTE_30_DATA;
      case "51":
        return NOTE_31_DATA;
      case "52":
        return NOTE_32_DATA;
      case "53":
        return NOTE_33_DATA;
      case "54":
        return NOTE_34_DATA;
      case "55":
        return NOTE_35_DATA;
      default:
        return [];
    }
  }, [activeTab]);

  // ✅ Filtrage optimisé des données
  const filteredData = useMemo(() => {
    const data = getCurrentData();
    if (!searchTerm.trim()) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [getCurrentData, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Fonction pour récupérer les données
  const fetchData = useCallback(async () => {
    setLoading(true);

    setTimeout(() => {
      try {
        const data = getCurrentData();
        let exportDataFormatted = [];

        // Formatage spécifique selon le type de données
        exportDataFormatted = data.map((item, index) => {
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

  // ✅ Chargement initial et rechargement à chaque changement d'onglet
  useEffect(() => {
    document.title = "États Comptables | INAWO - Suite de Gestion";
    fetchData();
  }, [fetchData]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // ✅ Fonction de suppression
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;

    setTimeout(() => {
      try {
        toast.success("Élément supprimé avec succès !");
        setDeleteModal(false);
        setItemToDelete(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression");
      }
    }, 600);
  };

  // ✅ Handlers optimisés
  const handleOpenAddModal = useCallback(() => {
    setCurrentItem(null);
    setIsEdit(false);
    setModal(true);
  }, []);

  const handleOpenEditModal = useCallback((item) => {
    setCurrentItem(item);
    setIsEdit(true);
    setModal(true);
  }, []);

  const handleOpenDetailModal = useCallback((item) => {
    setCurrentItem(item);
    setDetailModal(true);
  }, []);

  const handleOpenDeleteModal = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  }, []);

  // ✅ Titre de l'onglet actif
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

  // ✅ Définition de tous les onglets
  const allTabs = useMemo(
    () => [
      { id: "1", icon: "ri-code-line", label: "Note 36 (Codes)" },
      { id: "2", icon: "ri-list-check-2", label: "Note 36 (Nomenclature)" },
      { id: "3", icon: "ri-user-fill", label: "Fiche R3" },
      { id: "4", icon: "ri-file-chart-line", label: "Bilan Complet" },
      { id: "5", icon: "ri-arrow-up-circle-line", label: "Actif" },
      { id: "6", icon: "ri-arrow-down-circle-line", label: "Passif" },
      { id: "7", icon: "ri-calculator-line", label: "Résultat" },
      { id: "8", icon: "ri-exchange-dollar-line", label: "TFT" },
      { id: "9", icon: "ri-building-4-line", label: "Fiche R4" },
      { id: "10", icon: "ri-bar-chart-line", label: "Note 1" },
      { id: "11", icon: "ri-line-chart-line", label: "Note 2" },
      { id: "12", icon: "ri-money-dollar-circle-line", label: "Note 3A" },
      { id: "13", icon: "ri-money-dollar-box-line", label: "Note 3B" },
      { id: "14", icon: "ri-bank-card-line", label: "Note 3C" },
      { id: "15", icon: "ri-bank-card-2-line", label: "Note 3D" },
      { id: "16", icon: "ri-exchange-box-line", label: "Note 3E" },
      { id: "17", icon: "ri-government-line", label: "Note 4" },
      { id: "18", icon: "ri-home-gear-line", label: "Note 5" },
      { id: "19", icon: "ri-store-2-line", label: "Note 6" },
      { id: "20", icon: "ri-hand-coin-line", label: "Note 7" },
      { id: "21", icon: "ri-wallet-3-line", label: "Note 8" },
      { id: "22", icon: "ri-bank-line", label: "Note 8A" },
      { id: "23", icon: "ri-stock-line", label: "Note 8B" },
      { id: "24", icon: "ri-pie-chart-2-line", label: "Note 8C" },
      { id: "25", icon: "ri-funds-line", label: "Note 9" },
      { id: "26", icon: "ri-safe-2-line", label: "Note 10" },
      { id: "27", icon: "ri-calendar-todo-line", label: "Note 11" },
      { id: "28", icon: "ri-pie-chart-line", label: "Note 12" },
      { id: "29", icon: "ri-shield-check-line", label: "Note 13" },
      { id: "30", icon: "ri-handshake-line", label: "Note 14" },
      { id: "31", icon: "ri-truck-line", label: "Note 15" },
      { id: "32", icon: "ri-taxi-line", label: "Note 15A" },
      { id: "33", icon: "ri-team-line", label: "Note 15B" },
      { id: "34", icon: "ri-file-list-3-line", label: "Note 15C" },
      { id: "35", icon: "ri-node-tree", label: "Note 16BIS" },
      { id: "36", icon: "ri-exchange-line", label: "Note 16C" },
      { id: "37", icon: "ri-contract-line", label: "Note 17" },
      { id: "38", icon: "ri-global-line", label: "Note 18" },
      { id: "39", icon: "ri-hand-heart-line", label: "Note 19" },
      { id: "40", icon: "ri-money-dollar-circle-fill", label: "Note 20" },
      { id: "41", icon: "ri-calendar-event-line", label: "Note 21" },
      { id: "42", icon: "ri-file-text-line", label: "Note 22" },
      { id: "43", icon: "ri-exchange-dollar-line", label: "Note 23" },
      { id: "44", icon: "ri-pie-chart-line", label: "Note 24" },
      { id: "45", icon: "ri-virus-line", label: "Note 25" },
      { id: "46", icon: "ri-home-line", label: "Note 26" },
      { id: "47", icon: "ri-line-chart-fill", label: "Note 27" },
      { id: "48", icon: "ri-funds-box-line", label: "Note 28" },
      { id: "49", icon: "ri-handshake-fill", label: "Note 29" },
      { id: "50", icon: "ri-leaf-line", label: "Note 30" },
      { id: "51", icon: "ri-flask-line", label: "Note 31" },
      { id: "52", icon: "ri-briefcase-line", label: "Note 32" },
      { id: "53", icon: "ri-gift-line", label: "Note 33" },
      { id: "54", icon: "ri-user-heart-line", label: "Note 34" },
      { id: "55", icon: "ri-information-line", label: "Note 35" },
    ],
    []
  );

  //  Colonnes dynamiques selon l'onglet actif
  const getColumns = useMemo(() => {
    const baseColumns = [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => {
          const globalIndex =
            (currentPage - 1) * itemsPerPage + cell.row.index + 1;
          return <span className="fw-medium">{globalIndex}</span>;
        },
        size: 60,
      },
    ];

    // Colonnes spécifiques pour chaque type de données
    const specificColumns = {
      // Note 36 (Nomenclature) - Structure avec deux tableaux côte à côte
      2: [
        {
          header: "Code Activité",
          accessorKey: "codeActivite",
          size: 120,
          cell: (cell) => {
            const value = cell.getValue();
            return value ? (
              <span className="fw-bold text-primary">{value}</span>
            ) : (
              <span className="fw-bold text-success">
                {cell.row.original.activite}
              </span>
            );
          },
        },
        {
          header: "Activités",
          accessorKey: "activite",
          size: 200,
          cell: (cell) => {
            const value = cell.getValue();
            // Si le codeActivite est vide, c'est une catégorie
            const code = cell.row.original.codeActivite;
            if (!code && code !== "000000") {
              return (
                <span
                  className="fw-bold text-success"
                  style={{ fontSize: "0.95em" }}
                >
                  {value}
                </span>
              );
            }
            return <span>{value}</span>;
          },
        },
        // Premières colonnes du deuxième tableau (vide pour la première moitié)
        {
          header: "Code Activité",
          accessorKey: "codeActivite2",
          size: 120,
          cell: (cell) => {
            const rowIndex = cell.row.index;
            // Pour la deuxième moitié des données, on montre les codes
            if (rowIndex >= Math.floor(filteredData.length / 2)) {
              const adjustedIndex =
                rowIndex - Math.floor(filteredData.length / 2);
              if (filteredData[adjustedIndex]) {
                const value = filteredData[adjustedIndex].codeActivite;
                return value ? (
                  <span className="fw-bold text-primary">{value}</span>
                ) : (
                  <span className="fw-bold text-success">
                    {filteredData[adjustedIndex].activite}
                  </span>
                );
              }
            }
            return <span className="text-muted">-</span>;
          },
        },
        {
          header: "Activités",
          accessorKey: "activite2",
          size: 200,
          cell: (cell) => {
            const rowIndex = cell.row.index;
            if (rowIndex >= Math.floor(filteredData.length / 2)) {
              const adjustedIndex =
                rowIndex - Math.floor(filteredData.length / 2);
              if (filteredData[adjustedIndex]) {
                const value = filteredData[adjustedIndex].activite;
                const code = filteredData[adjustedIndex].codeActivite;
                if (!code && code !== "000000") {
                  return (
                    <span
                      className="fw-bold text-success"
                      style={{ fontSize: "0.95em" }}
                    >
                      {value}
                    </span>
                  );
                }
                return <span>{value}</span>;
              }
            }
            return <span className="text-muted">-</span>;
          },
        },
      ],

      // Dans la fonction getColumns (ajouter un cas spécifique pour le TFT - onglet 8)
      // Colonnes spécifiques pour le TFT complet (onglet 8)
      8: [
        {
          header: "REF",
          accessorKey: "ref",
          size: 80,
          cell: (cell) => {
            const value = cell.getValue();
            const type = cell.row.original.type;
            const isSubTotal = type.includes("total");
            const isSection =
              type === "tresorerie_initiale" ||
              type === "flux_operationnel_total" ||
              type === "flux_investissement_total" ||
              type === "flux_financement_total" ||
              type === "synthese" ||
              type === "tresorerie_finale";

            return (
              <span className={`fw-bold ${isSection ? "text-primary" : ""}`}>
                {value}
              </span>
            );
          },
        },
        {
          header: "LIBELLES",
          accessorKey: "libelle",
          size: 300,
          cell: (cell) => {
            const value = cell.getValue();
            const type = cell.row.original.type;

            // Style différent selon le type
            let className = "";
            if (
              type.includes("total") ||
              type === "synthese" ||
              type === "tresorerie_finale" ||
              type === "tresorerie_initiale"
            ) {
              className = "fw-bold";
            }

            // Indentation pour les sous-éléments
            const isSubItem =
              value.startsWith(" - ") || value.startsWith(" + ");
            const marginLeft = isSubItem ? "20px" : "0";

            return (
              <div
                style={{ marginLeft, whiteSpace: "normal" }}
                className={className}
              >
                {value}
              </div>
            );
          },
        },
        
        {
          header: "NOTE",
          accessorKey: "note",
          size: 80,
          cell: (cell) => {
            const value = cell.getValue();
            const isNumeric = !isNaN(value) && value !== "";

            return (
              <span className={isNumeric ? "text-muted" : ""}>{value}</span>
            );
          },
        },
        {
          header: "EXERCICE N",
          accessorKey: "exerciceN",
          size: 120,
          cell: (cell) => {
            const value = cell.getValue();
            const type = cell.row.original.type;

            // Formatage spécial selon le type
            const isNegative = value < 0;
            const isTotal =
              type.includes("total") ||
              type === "synthese" ||
              type === "tresorerie_finale";

            let className = "text-end ";
            if (isTotal) {
              className += "fw-bold text-primary";
            } else if (isNegative) {
              className += "text-danger";
            } else if (value > 0) {
              className += "text-success";
            }

            return (
              <div className={className}>
                {value === 0 ? "0" : formatAmount(Math.abs(value))}
                {isNegative ? " -" : ""}
              </div>
            );
          },
        },
        {
          header: "EXERCICE N-1",
          accessorKey: "exerciceN1",
          size: 120,
          cell: (cell) => {
            const value = cell.getValue();
            const type = cell.row.original.type;

            const isNegative = value < 0;
            const isTotal =
              type.includes("total") ||
              type === "synthese" ||
              type === "tresorerie_finale";

            let className = "text-end text-muted ";
            if (isTotal) {
              className += "fw-bold";
            }

            return (
              <div className={className}>
                {value === 0 ? "0" : formatAmount(Math.abs(value))}
                {isNegative ? " -" : ""}
              </div>
            );
          },
        },
      ],

      // Dans la fonction getColumns (après le cas pour onglet 8), ajouter :

// Note 1 - Dettes garanties par des sûretés réelles
10: [
  {
    header: "LIBELLES",
    accessorKey: "libelle",
    size: 250,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = cell.row.original.note === "TOTAL";
      return (
        <div className={isTotal ? "fw-bold" : ""} style={{ whiteSpace: "normal" }}>
          {value}
        </div>
      );
    },
  },
  {
    header: "Note",
    accessorKey: "note",
    size: 80,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = value === "TOTAL";
      return (
        <span className={isTotal ? "fw-bold text-primary" : ""}>
          {value}
        </span>
      );
    },
  },
  {
    header: (
      <div>
        Montant
        <br />
        brut (1)
      </div>
    ),
    accessorKey: "montantBrut",
    size: 120,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = cell.row.original.note === "TOTAL";
      return (
        <div className={`text-end ${isTotal ? "fw-bold" : ""}`}>
          {formatAmount(value)} 
        </div>
      );
    },
  },
  {
    header: (
      <div>
        SURETES REELLES (2)
        <br />
        Hypothèques
      </div>
    ),
    accessorKey: "hypotheques",
    size: 120,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = cell.row.original.note === "TOTAL";
      return (
        <div className={`text-end ${isTotal ? "fw-bold" : ""}`}>
          {formatAmount(value)} 
        </div>
      );
    },
  },
  {
    header: (
      <div>
        SURETES REELLES (2)
        <br />
        Nantissements
      </div>
    ),
    accessorKey: "nantissements",
    size: 120,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = cell.row.original.note === "TOTAL";
      return (
        <div className={`text-end ${isTotal ? "fw-bold" : ""}`}>
          {formatAmount(value)} 
        </div>
      );
    },
  },
  {
    header: (
      <div>
        SURETES REELLES (2)
        <br />
        Gages/autres
      </div>
    ),
    accessorKey: "gagesAutres",
    size: 120,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = cell.row.original.note === "TOTAL";
      return (
        <div className={`text-end ${isTotal ? "fw-bold" : ""}`}>
          {formatAmount(value)} 
        </div>
      );
    },
  },
  {
    header: (
      <div>
        TOTAL
        <br />
        SURETES REELLES
      </div>
    ),
    accessorKey: "totalSuretes",
    size: 120,
    cell: (cell) => {
      const value = cell.getValue();
      const isTotal = cell.row.original.note === "TOTAL";
      return (
        <div className={`text-end fw-bold ${isTotal ? "text-primary" : ""}`}>
          {formatAmount(value)} 
        </div>
      );
    },
  },
],

      // Note 17 - Engagements donnés et reçus
      37: [
        { header: "Type", accessorKey: "type", size: 150 },
        {
          header: "Montant",
          accessorKey: "montant",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Bénéficiaire/Donneur",
          accessorKey: "beneficiaire",
          cell: (cell) => cell.getValue() || cell.row.original.donneur || "-",
        },
        { header: "Date émission", accessorKey: "dateEmission" },
        { header: "Date échéance", accessorKey: "dateEcheance" },
        {
          header: "Statut",
          accessorKey: "statut",
          cell: (cell) => (
            <Badge color={cell.getValue() === "Actif" ? "success" : "warning"}>
              {cell.getValue()}
            </Badge>
          ),
        },
      ],
      // Note 18 - Actifs et passifs en devises
      38: [
        {
          header: "Devise",
          accessorKey: "devise",
          cell: (cell) => <Badge color="info">{cell.getValue()}</Badge>,
        },
        { header: "Taux N", accessorKey: "tauxN" },
        { header: "Taux N-1", accessorKey: "tauxN1" },
        {
          header: "Actif N",
          accessorKey: "actifN",
          cell: (cell) => (
            <span className="text-success fw-semibold">
              {formatAmount(cell.getValue())}
            </span>
          ),
        },
        {
          header: "Passif N",
          accessorKey: "passifN",
          cell: (cell) => (
            <span className="text-danger fw-semibold">
              {formatAmount(cell.getValue())}
            </span>
          ),
        },
        {
          header: "Exposition nette N",
          accessorKey: "expositionNetteN",
          cell: (cell) => {
            const val = cell.getValue();
            return (
              <span
                className={`fw-bold ${
                  val >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatAmount(val)}
              </span>
            );
          },
        },
      ],
      // Note 19 - Transactions avec les parties liées
      39: [
        { header: "Partie liée", accessorKey: "partieLiee", size: 120 },
        { header: "Type transaction", accessorKey: "typeTransaction" },
        {
          header: "Montant N",
          accessorKey: "montantN",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Montant N-1",
          accessorKey: "montantN1",
          cell: (cell) => (
            <span className="text-muted">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Conditions", accessorKey: "conditions" },
        {
          header: "Solde",
          accessorKey: "soldeDu",
          cell: (cell) => {
            const soldeDu = cell.getValue();
            const soldeCrediteur = cell.row.original.soldeCrediteur;
            if (soldeDu)
              return (
                <span className="text-success">
                  Dû: {formatAmount(soldeDu)}
                </span>
              );
            if (soldeCrediteur)
              return (
                <span className="text-danger">
                  Créditeur: {formatAmount(soldeCrediteur)}
                </span>
              );
            return "-";
          },
        },
      ],
      // Note 20 - Salaires et rémunérations
      40: [
        { header: "Catégorie", accessorKey: "categorie", size: 120 },
        { header: "Effectif N", accessorKey: "effectifN" },
        { header: "Effectif N-1", accessorKey: "effectifN1" },
        {
          header: "Masse salariale N",
          accessorKey: "masseSalarialeN",
          cell: (cell) => (
            <span className="fw-bold text-primary">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Masse salariale N-1",
          accessorKey: "masseSalarialeN1",
          cell: (cell) => (
            <span className="text-muted">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Moyenne N",
          accessorKey: "moyenneN",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
      ],
      // Note 21 - Événements postérieurs à la clôture
      41: [
        { header: "Événement", accessorKey: "evenement", size: 150 },
        { header: "Date", accessorKey: "date" },
        { header: "Impact", accessorKey: "impact" },
        {
          header: "Statut",
          accessorKey: "statut",
          cell: (cell) => {
            const status = cell.getValue();
            let color = "secondary";
            if (status === "Finalisé") color = "success";
            if (status === "En négociation") color = "warning";
            if (status === "Expertise") color = "info";
            return <Badge color={color}>{status}</Badge>;
          },
        },
        { header: "Commentaire", accessorKey: "commentaire" },
      ],
      // Note 22 - Politiques comptables
      42: [
        { header: "Domaine", accessorKey: "domaine", size: 120 },
        { header: "Méthode", accessorKey: "methode" },
        { header: "Amortissement/Évaluation", accessorKey: "amortissement" },
        { header: "Durée/Provision", accessorKey: "duree" },
        { header: "Commentaire", accessorKey: "commentaire" },
      ],
      // Note 23 - Taux de change
      43: [
        {
          header: "Devise",
          accessorKey: "devise",
          cell: (cell) => <Badge color="info">{cell.getValue()}</Badge>,
        },
        { header: "Taux clôture N", accessorKey: "tauxClotureN" },
        { header: "Taux moyen N", accessorKey: "tauxMoyenN" },
        { header: "Taux clôture N-1", accessorKey: "tauxClotureN1" },
        { header: "Taux moyen N-1", accessorKey: "tauxMoyenN1" },
        {
          header: "Variation",
          accessorKey: "variation",
          cell: (cell) => {
            const val = cell.getValue();
            return (
              <span
                className={
                  val.includes("+")
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {val}
              </span>
            );
          },
        },
      ],
      // Note 24 - Informations sectorielles
      44: [
        { header: "Secteur", accessorKey: "secteur", size: 100 },
        {
          header: "CA N",
          accessorKey: "caN",
          cell: (cell) => (
            <span className="fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "CA N-1",
          accessorKey: "caN1",
          cell: (cell) => (
            <span className="text-muted">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Résultat N",
          accessorKey: "resultatN",
          cell: (cell) => {
            const val = cell.getValue();
            return (
              <span
                className={`fw-bold ${
                  val >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatAmount(val)} 
              </span>
            );
          },
        },
        {
          header: "Résultat N-1",
          accessorKey: "resultatN1",
          cell: (cell) => {
            const val = cell.getValue();
            return (
              <span
                className={`text-muted ${
                  val >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatAmount(val)} 
              </span>
            );
          },
        },
        {
          header: "Actifs",
          accessorKey: "actifs",
          cell: (cell) => (
            <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
          ),
        },
      ],
      // Note 25 - Impact de la COVID-19
      45: [
        { header: "Impact", accessorKey: "impact", size: 120 },
        {
          header: "Montant N",
          accessorKey: "montantN",
          cell: (cell) => (
            <span className="fw-bold text-danger">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Mesure", accessorKey: "mesure" },
        { header: "Aide", accessorKey: "aide" },
        { header: "Commentaire", accessorKey: "commentaire" },
      ],
      // Note 26 - Contrats de location
      46: [
        { header: "Type", accessorKey: "type", size: 120 },
        {
          header: "Valeur actuelle",
          accessorKey: "valeurActuelle",
          cell: (cell) => (
            <span className="fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Durée", accessorKey: "duree" },
        {
          header: "Loyer annuel",
          accessorKey: "loyerAnnuel",
          cell: (cell) => (
            <span className="text-primary fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Option d'achat",
          accessorKey: "optionAchat",
          cell: (cell) => {
            const val = cell.getValue();
            return (
              <Badge color={val === "Oui" ? "success" : "secondary"}>
                {val}
              </Badge>
            );
          },
        },
        {
          header: "Valeur option",
          accessorKey: "valeurOption",
          cell: (cell) => {
            const val = cell.getValue();
            return val !== "N/A" && val !== "-" ? (
              <span className="fw-semibold">{formatAmount(val)} </span>
            ) : (
              <span className="text-muted">{val}</span>
            );
          },
        },
      ],
      // Note 27 - Instruments financiers
      47: [
        { header: "Instrument", accessorKey: "instrument", size: 120 },
        {
          header: "Catégorie",
          accessorKey: "categorie",
          cell: (cell) => <Badge color="info">{cell.getValue()}</Badge>,
        },
        {
          header: "Valeur comptable",
          accessorKey: "valeurComptable",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Valeur marché",
          accessorKey: "valeurMarche",
          cell: (cell) => (
            <span className="fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Variation",
          accessorKey: "variation",
          cell: (cell) => {
            const val = cell.getValue();
            return (
              <span
                className={
                  val.includes("+")
                    ? "text-success fw-bold"
                    : val.includes("-")
                    ? "text-danger fw-bold"
                    : "text-muted"
                }
              >
                {val}
              </span>
            );
          },
        },
        {
          header: "Risque",
          accessorKey: "risque",
          cell: (cell) => <Badge color="warning">{cell.getValue()}</Badge>,
        },
      ],
      // Note 28 - Capital risque
      48: [
        { header: "Investisseur", accessorKey: "investisseur", size: 120 },
        {
          header: "Montant investi",
          accessorKey: "montantInvesti",
          cell: (cell) => (
            <span className="fw-bold text-success">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Date entrée", accessorKey: "dateEntree" },
        { header: "Participation", accessorKey: "participation" },
        {
          header: "Valorisation",
          accessorKey: "valorisation",
          cell: (cell) => (
            <span className="fw-bold text-primary">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Sortie prévue", accessorKey: "sortie" },
      ],
      // Note 29 - Partenariats
      49: [
        { header: "Partenaire", accessorKey: "partenaire", size: 120 },
        { header: "Objet", accessorKey: "objet" },
        { header: "Durée", accessorKey: "duree" },
        {
          header: "Investissement",
          accessorKey: "investissement",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Avantages", accessorKey: "avantages" },
        {
          header: "Statut",
          accessorKey: "statut",
          cell: (cell) => (
            <Badge color={cell.getValue() === "Actif" ? "success" : "warning"}>
              {cell.getValue()}
            </Badge>
          ),
        },
      ],
      // Note 30 - Développement durable
      50: [
        { header: "Domaine", accessorKey: "domaine", size: 120 },
        { header: "Action", accessorKey: "action" },
        {
          header: "Investissement",
          accessorKey: "investissement",
          cell: (cell) => (
            <span className="fw-semibold text-success">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Réduction/Bénéficiaires", accessorKey: "reduction" },
        { header: "Certification", accessorKey: "certification" },
        { header: "Année", accessorKey: "annee" },
      ],
      // Note 31 - Recherche et développement
      51: [
        { header: "Projet", accessorKey: "projet", size: 150 },
        {
          header: "Budget",
          accessorKey: "budget",
          cell: (cell) => (
            <span className="fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Dépense N",
          accessorKey: "depenseN",
          cell: (cell) => (
            <span className="text-primary fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Dépense N-1",
          accessorKey: "depenseN1",
          cell: (cell) => (
            <span className="text-muted">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Capitalisé N",
          accessorKey: "capitaliseN",
          cell: (cell) => (
            <span className="text-success fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Statut",
          accessorKey: "statut",
          cell: (cell) => <Badge color="info">{cell.getValue()}</Badge>,
        },
      ],
      // Note 32 - Goodwill
      52: [
        { header: "Acquisition", accessorKey: "acquisition", size: 120 },
        { header: "Date", accessorKey: "date" },
        {
          header: "Prix acquisition",
          accessorKey: "prixAcquisition",
          cell: (cell) => (
            <span className="fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Actifs nets",
          accessorKey: "actifsNets",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Goodwill",
          accessorKey: "goodwill",
          cell: (cell) => (
            <span className="text-primary fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "VNC",
          accessorKey: "vnc",
          cell: (cell) => (
            <span className="text-success fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
      ],
      // Note 33 - Stock-options
      53: [
        { header: "Bénéficiaire", accessorKey: "beneficiaire", size: 120 },
        {
          header: "Options attribuées",
          accessorKey: "optionsAttribuees",
          cell: (cell) => (
            <span className="fw-semibold">{formatAmount(cell.getValue())}</span>
          ),
        },
        {
          header: "Prix exercice",
          accessorKey: "prixExercice",
          cell: (cell) => (
            <span className="fw-bold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Valeur intrinsèque",
          accessorKey: "valeurIntrinseque",
          cell: (cell) => (
            <span className="fw-bold text-success">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Valeur totale",
          accessorKey: "valeurTotale",
          cell: (cell) => (
            <span className="fw-bold text-primary">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        { header: "Date exercice", accessorKey: "dateExercice" },
      ],
      // Note 34 - Pensions et retraites
      54: [
        { header: "Plan", accessorKey: "plan", size: 120 },
        {
          header: "Type",
          accessorKey: "type",
          cell: (cell) => <Badge color="info">{cell.getValue()}</Badge>,
        },
        {
          header: "Engagement",
          accessorKey: "engagement",
          cell: (cell) => (
            <span className="fw-bold text-danger">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Actifs",
          accessorKey: "actifs",
          cell: (cell) => (
            <span className="fw-bold text-success">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Déficit",
          accessorKey: "deficit",
          cell: (cell) => (
            <span className="fw-bold text-warning">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
        {
          header: "Provision",
          accessorKey: "provision",
          cell: (cell) => (
            <span className="fw-semibold">
              {formatAmount(cell.getValue())} 
            </span>
          ),
        },
      ],
      // Note 35 - Autres informations
      55: [
        { header: "Information", accessorKey: "information", size: 150 },
        { header: "Date", accessorKey: "date" },
        { header: "Impact", accessorKey: "impact" },
        { header: "Commentaire", accessorKey: "commentaire" },
      ],
    };

    // Si on a des colonnes spécifiques pour cet onglet
    if (specificColumns[activeTab]) {
      return [...baseColumns, ...specificColumns[activeTab]];
    }

    // Sinon, colonnes génériques
    const data = getCurrentData();
    if (data.length > 0) {
      const firstItem = data[0];
      const columns = [...baseColumns];

      Object.keys(firstItem).forEach((key) => {
        if (key !== "id") {
          const headerName = key.charAt(0).toUpperCase() + key.slice(1);
          columns.push({
            header: headerName,
            accessorKey: key,
            enableColumnFilter: false,
            cell: (cell) => {
              const value = cell.getValue();
              if (
                typeof value === "number" &&
                (key.includes("montant") ||
                  key.includes("valeur") ||
                  key.includes("solde") ||
                  key.includes("brut") ||
                  key.includes("net"))
              ) {
                return (
                  <span className="fw-semibold">{formatAmount(value)}</span>
                );
              }
              return <span>{value}</span>;
            },
          });
        }
      });

      return columns;
    }

    return baseColumns;
  }, [activeTab, currentPage, itemsPerPage, formatAmount, getCurrentData]);

  // Fonction pour obtenir l'icône selon le numéro de la note
  const getNoteIcon = (noteNum) => {
    const iconMap = {
      1: "shield-check-line",
      2: "information-line",
      "3A": "building-4-line",
      "3B": "home-line",
      "3C": "line-chart-line",
      "3D": "exchange-dollar-line",
      "3E": "refresh-line",
      4: "briefcase-line",
      5: "exchange-box-line",
      6: "store-2-line",
      7: "user-line",
      8: "hand-coin-line",
      "8A": "calendar-line",
      "8B": "calendar-2-line",
      "8C": "calendar-event-line",
      9: "stock-line",
      10: "money-dollar-circle-line",
      11: "bank-line",
      12: "exchange-line",
      13: "funds-line",
      14: "safe-line",
      "15A": "government-line",
      "15B": "database-line",
      "16A": "handshake-line",
      "16B": "user-heart-line",
      "16B_bis": "user-heart-fill",
      "16C": "alert-line",
      17: "truck-line",
      18: "taxi-line",
      19: "file-list-3-line",
      20: "bank-card-line",
      21: "bar-chart-line",
      22: "shopping-cart-line",
      23: "truck-line",
      24: "tools-line",
      25: "tax-line",
      26: "list-check",
      "27A": "team-line",
      "27B": "user-settings-line",
      28: "shield-keyhole-line",
      29: "bank-card-2-line",
      30: "exchange-box-fill",
      31: "pie-chart-line",
      32: "factory-line",
      33: "shopping-basket-line",
      34: "dashboard-line",
      35: "earth-line",
      36: "code-line",
      37: "calculator-line",
      38: "calendar-schedule-line",
      39: "settings-3-line",
      DGI_INS: "file-paper-line",
    };
    return iconMap[noteNum] || "file-text-line";
  };

  // Fonction pour rendre le contenu de chaque note
  const renderNoteContent = (note) => {
    switch (note.numero) {
      case "1":
        return (
          <div>
            <h6 className="text-secondary mb-3">
              <i className="ri-folder-line me-2"></i>
              Détails des sûretés réelles
            </h6>
            {note.sous_categories.map((categorie) => (
              <div key={categorie.id} className="mb-4">
                <h6 className="text-success mb-3">
                  <i className="ri-bookmark-line me-2"></i>
                  {categorie.libelle}
                </h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th width="10%">Réf.</th>
                        <th width="40%">Description</th>
                        <th width="15%" className="text-end">
                          Montant
                        </th>
                        <th width="15%">Date contrat</th>
                        <th width="15%">Échéance</th>
                        <th width="10%">Taux</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorie.lignes.map((ligne) => (
                        <tr key={ligne.id}>
                          <td className="fw-bold">{ligne.reference}</td>
                          <td>{ligne.description}</td>
                          <td className="text-end fw-semibold">
                            {formatAmount(ligne.montant)} 
                          </td>
                          <td>{ligne.date_contrat}</td>
                          <td>{ligne.echeance}</td>
                          <td>{ligne.taux || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total des dettes garanties :</span>
                <span className="fw-bold text-primary fs-5">
                  {formatAmount(note.total)} 
                </span>
              </div>
            </div>
          </div>
        );

      case "2":
        return (
          <div>
            <h6 className="text-secondary mb-3">
              <i className="ri-information-line me-2"></i>
              Informations comptables obligatoires
            </h6>
            {note.informations.map((info) => (
              <div key={info.id} className="mb-4">
                <h6 className="text-info mb-3">
                  <i className="ri-bookmark-line me-2"></i>
                  {info.rubrique}
                </h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th width="10%">Réf.</th>
                        <th width="30%">Description</th>
                        <th width="25%">Méthode</th>
                        <th width="20%">Norme</th>
                        <th width="15%">Valeur/Commentaire</th>
                      </tr>
                    </thead>
                    <tbody>
                      {info.details.map((detail) => (
                        <tr key={detail.reference}>
                          <td className="fw-bold">{detail.reference}</td>
                          <td>{detail.description}</td>
                          <td>{detail.methode}</td>
                          <td>{detail.norme}</td>
                          <td>{detail.valeur || detail.commentaire || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );

      // Continuez pour les autres notes...

      default:
        return (
          <div className="text-center p-4">
            <i
              className="ri-file-warning-line text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="mt-3 text-muted">
              Contenu de la note {note.numero} en cours de chargement...
            </p>
          </div>
        );
    }
  };

  const renderBilanHeader = () => {
    return (
      <Card className="mb-4 border-0 shadow-sm">
        <CardBody className="p-3">
          <div className="table-responsive">
            <table
              className="table table-bordered align-middle mb-0"
              style={{ fontSize: "0.85rem" }}
            >
              <thead>
                <tr>
                  {/* En-tête pour ACTIF */}
                  <th colSpan="9" className="text-center bg-success text-white">
                    <strong>ACTIF (1)</strong>
                  </th>
                  {/* En-tête pour PASSIF */}
                  <th colSpan="7" className="text-center bg-primary text-white">
                    <strong>PASSIF</strong>
                  </th>
                </tr>
                <tr className="">
                  {/* Colonnes ACTIF */}
                  <th rowSpan="2" className="text-center align-middle">
                    REF
                  </th>
                  <th colSpan="3" className="text-center">
                    EXERCICE au 31/12/N
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    NET
                    <br />
                    EXERCICE au 31/12/N-1
                  </th>
                  <th colSpan="3" className="text-center">
                    EXERCICE au 31/12/N
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    NET
                    <br />
                    EXERCICE au 31/12/N-1
                  </th>

                  {/* Colonnes PASSIF */}
                  <th rowSpan="2" className="text-center align-middle">
                    REF
                  </th>
                  <th rowSpan="2" className="text-center align-middle">
                    NOTE
                  </th>
                  <th colSpan="2" className="text-center">
                    EXERCICE AU 31/12/N
                  </th>
                  <th colSpan="2" className="text-center">
                    EXERCICE AU 31/12/N-1
                  </th>
                </tr>
                <tr className="">
                  {/* Sous-colonnes ACTIF - partie gauche */}
                  <th className="text-center">NOTE</th>
                  <th className="text-center">BRUT</th>
                  <th className="text-center">
                    "AMORT et
                    <br />
                    DEPREC."
                  </th>
                  <th className="text-center">NOTE</th>
                  <th className="text-center">BRUT</th>
                  <th className="text-center">
                    "AMORT et
                    <br />
                    DEPREC."
                  </th>

                  {/* Sous-colonnes PASSIF */}
                  <th className="text-center">NET</th>
                  <th className="text-center">NET</th>
                  <th className="text-center">NET</th>
                  <th className="text-center">NET</th>
                </tr>
              </thead>
            </table>
          </div>
        </CardBody>
      </Card>
    );
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ marginTop: "70px" }}
          />

          {/* Export CSV Modal */}
          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
            filename={`${getActiveTabTitle.replace(/ /g, "_")}_${
              new Date().toISOString().split("T")[0]
            }`}
          />

          {/* Delete Modal */}
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteItem}
            onCloseClick={() => {
              setDeleteModal(false);
              setItemToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
          />

          <BreadCrumb
            title={getActiveTabTitle}
            pageTitle={
              <>
                <i className="ri-file-text-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder={`Rechercher dans ${getActiveTabTitle.toLowerCase()}...`}
                showSearch={true}
                onAddClick={handleOpenAddModal}
                addButtonText={`Ajouter à ${getActiveTabTitle}`}
                addButtonIcon="ri-file-add-line"
                showAddButton={false}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} élément
                    {filteredData.length !== 1 ? "s" : ""} trouvé
                    {filteredData.length !== 1 ? "s" : ""}
                  </div>
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={12}>
              <Card className="rounded-4">
                <CardBody className="p-0">
                  {/* Onglets horizontaux avec scroll */}
                  <div
                    className="nav-tabs-horizontal-container"
                    style={{
                      position: "relative",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <div
                      className="nav-tabs-horizontal-scroll"
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                        whiteSpace: "nowrap",
                        padding: "0 15px",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#adb5bd #f8f9fa",
                      }}
                    >
                      <Nav
                        tabs
                        className="nav-tabs-custom"
                        style={{
                          display: "inline-flex",
                          flexWrap: "nowrap",
                          minWidth: "100%",
                        }}
                      >
                        {allTabs.map((tab) => (
                          <NavItem
                            key={tab.id}
                            style={{ display: "inline-block", float: "none" }}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === tab.id,
                                "text-success": activeTab === tab.id,
                              })}
                              onClick={() => setActiveTab(tab.id)}
                              style={{
                                cursor: "pointer",
                                color:
                                  activeTab === tab.id ? "#198754" : "#6c757d",
                                backgroundColor:
                                  activeTab === tab.id
                                    ? "rgba(25, 135, 84, 0.1)"
                                    : "transparent",
                                borderColor:
                                  activeTab === tab.id
                                    ? "#198754 transparent transparent"
                                    : "transparent",
                                padding: "0.75rem 1rem",
                                marginRight: "1px",
                                borderBottom:
                                  activeTab === tab.id
                                    ? "2px solid #198754"
                                    : "none",
                                display: "inline-flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <i className={`${tab.icon} me-1`}></i>
                              {tab.label}
                            </NavLink>
                          </NavItem>
                        ))}
                      </Nav>
                    </div>

                    {/* Indicateur de scroll */}
                    <div
                      className="scroll-indicator"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "30px",
                        background:
                          "linear-gradient(90deg, transparent, #f8f9fa)",
                        pointerEvents: "none",
                      }}
                    ></div>
                  </div>

                  {/* Contenu des onglets */}
                  <TabContent activeTab={activeTab} className="p-3">
                    {allTabs.map((tab) => (
                      <TabPane key={tab.id} tabId={tab.id}>
                        {loading ? (
                          <div
                            className="d-flex justify-content-center align-items-center my-5"
                            style={{ minHeight: "300px" }}
                          >
                            <div className="text-center">
                              <Loader />
                              <p className="mt-3 text-muted">
                                Chargement des données...
                              </p>
                            </div>
                          </div>
                        ) : filteredData.length > 0 ? (
                          <>
                            {/* Affichage spécial pour la nomenclature (tab 2) */}
                            {activeTab === "2" ? (
                              <>
                                <div className="mb-4">
                                  <h5 className="text-success mb-3">
                                    <i className="ri-list-check-2 me-2"></i>
                                    Nomenclature des Activités - Tableau 36B
                                  </h5>
                                  <Alert color="info" className="mb-3">
                                    <i className="ri-information-line me-2"></i>
                                    Cette nomenclature présente les activités
                                    classées selon le système national. Les
                                    données sont affichées en deux colonnes pour
                                    une meilleure lisibilité.
                                  </Alert>
                                </div>

                                {/* Tableau spécial pour la nomenclature */}
                                <div className="table-responsive">
                                  <table className="table table-bordered table-hover align-middle mb-0">
                                    <thead className="">
                                      <tr>
                                        <th width="15%" className="text-center">
                                          Code Activité
                                        </th>
                                        <th width="35%" className="text-center">
                                          Activités
                                        </th>
                                        <th width="15%" className="text-center">
                                          Code Activité
                                        </th>
                                        <th width="35%" className="text-center">
                                          Activités
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(() => {
                                        const halfLength = Math.ceil(
                                          filteredData.length / 2
                                        );
                                        const rows = [];

                                        for (let i = 0; i < halfLength; i++) {
                                          const item1 = filteredData[i];
                                          const item2 =
                                            filteredData[i + halfLength];

                                          // Déterminer si c'est une catégorie
                                          const isCategory1 =
                                            item1 &&
                                            !item1.codeActivite &&
                                            item1.codeActivite !== "000000";
                                          const isCategory2 =
                                            item2 &&
                                            !item2.codeActivite &&
                                            item2.codeActivite !== "000000";

                                          rows.push(
                                            <tr key={i}>
                                              {/* Première partie */}
                                              <td
                                                className={
                                                  isCategory1
                                                    ? "fw-bold text-success"
                                                    : "fw-medium"
                                                }
                                              >
                                                {item1?.codeActivite || ""}
                                              </td>
                                              <td
                                                className={
                                                  isCategory1
                                                    ? "fw-bold text-success"
                                                    : ""
                                                }
                                              >
                                                {item1?.activite || ""}
                                              </td>

                                              {/* Deuxième partie */}
                                              <td
                                                className={
                                                  isCategory2
                                                    ? "fw-bold text-success"
                                                    : "fw-medium"
                                                }
                                              >
                                                {item2?.codeActivite || ""}
                                              </td>
                                              <td
                                                className={
                                                  isCategory2
                                                    ? "fw-bold text-success"
                                                    : ""
                                                }
                                              >
                                                {item2?.activite || ""}
                                              </td>
                                            </tr>
                                          );
                                        }

                                        return rows;
                                      })()}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Légende */}
                                <Card className="mt-3 border-0 shadow-sm">
                                  <CardBody className="p-3">
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                      <span className="text-muted me-2">
                                        Légende :
                                      </span>
                                      <span className="badge bg-success me-2">
                                        Agriculture
                                      </span>
                                      <span className="badge bg-info me-2">
                                        Élevage/Pêche
                                      </span>
                                      <span className="badge bg-warning me-2">
                                        Industrie
                                      </span>
                                      <span className="badge bg-danger me-2">
                                        Transformation
                                      </span>
                                      <span className="badge bg-primary me-2">
                                        Services
                                      </span>
                                      <span className="fw-bold text-success me-2">
                                        <i className="ri-bookmark-line me-1"></i>
                                        Catégorie principale
                                      </span>
                                    </div>
                                  </CardBody>
                                </Card>
                              </>
                            ) : activeTab === "9" ? (
                              <>
                                <div className="mb-4">
                                  
                                  <Alert color="info" className="mb-3">
                                    <i className="ri-information-line me-2"></i>
                                    Cette fiche regroupe toutes les notes
                                    annexes selon la nomenclature réglementaire.
                                  </Alert>
                                </div>

                                {/* Tableau des notes de la Fiche 4 */}
                                <div className="table-responsive">
                                  <table className="table table-bordered rounded-4 table-hover align-middle mb-0">
                                    <thead className="rounded-top-4">
                                      <tr>
                                        <th width="10%" className="text-center">
                                          NOTES
                                        </th>
                                        <th width="60%" className="text-center">
                                          INTITULÉS
                                        </th>
                                        <th width="15%" className="text-center">
                                          A
                                        </th>
                                        <th width="15%" className="text-center">
                                          N/A
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Note 1 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 1
                                        </td>
                                        <td>
                                          DETTES GARANTIES PAR DES SURETES
                                          REELLES ET LES ENGAGEMENTS FINANCIERS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 2 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 2
                                        </td>
                                        <td>INFORMATIONS OBLIGATOIRES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 3A */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 3A
                                        </td>
                                        <td>IMMOBILISATIONS BRUTES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 3B */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 3B
                                        </td>
                                        <td>
                                          BIENS PRIS EN LOCATION-ACQUISITION
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 3C */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 3C
                                        </td>
                                        <td>
                                          IMMOBILISATIONS : AMORTISSEMENTS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 3D */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 3D
                                        </td>
                                        <td>
                                          IMMOBILISATIONS : PLUS-VALUES ET MOINS
                                          VALUE DE CESSION
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 3E */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 3E
                                        </td>
                                        <td>
                                          INFORMATIONS SUR LES REEVALUATIONS
                                          EFFECTUEES PAR L'ENTITE
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 4 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 4
                                        </td>
                                        <td>IMMOBILISATIONS FINANCIERES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 5 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 5
                                        </td>
                                        <td>
                                          ACTIF CIRCULANT ET DETTES CIRCULANTES
                                          HAO
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 6 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 6
                                        </td>
                                        <td>STOCKS ET ENCOURS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 7 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 7
                                        </td>
                                        <td>CLIENTS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 8 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 8
                                        </td>
                                        <td>AUTRES CREANCES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 8A */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 8A
                                        </td>
                                        <td>
                                          TABLEAU D'ETALEMENT DES CHARGES
                                          IMMOBILISEES
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 8B */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 8B
                                        </td>
                                        <td>
                                          TABLEAU D'ETALEMENT DES PROVISIONS
                                          POUR CHARGES A REPARTIR
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 8C */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 8C
                                        </td>
                                        <td>
                                          TABLEAU D'ETALEMENT DES PROVISIONS
                                          POUR ENGAGEMENT DE RETRAITE
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 9 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 9
                                        </td>
                                        <td>TITRES DE PLACEMENT</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 10 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 10
                                        </td>
                                        <td>VALEURS A ENCAISSER</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 11 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 11
                                        </td>
                                        <td>DISPONIBILITES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 12 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 12
                                        </td>
                                        <td>
                                          ECARTS DE CONVERSION ET TRANSFERT DE
                                          CHARGES
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 13 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 13
                                        </td>
                                        <td>
                                          CAPITAL : VALEUR NOMINALE DES ACTIONS
                                          OU PARTS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 14 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 14
                                        </td>
                                        <td>PRIMES ET RESERVES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 15A */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 15A
                                        </td>
                                        <td>
                                          SUBVENTIONS ET PROVISIONS REGLEMENTEES
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 15B */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 15B
                                        </td>
                                        <td>AUTRES FONDS PROPRES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 16A */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 16A
                                        </td>
                                        <td>
                                          DETTES FINANCIERES ET RESSOURCES
                                          ASSIMILEES
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 16B */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 16B
                                        </td>
                                        <td>
                                          ENGAGEMENTS DE RETRAITE ET AVANTAGES
                                          ASSIMILES : (METHODE ACTUARIELLE)
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 16B bis */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 16B bis
                                        </td>
                                        <td>
                                          ENGAGEMENTS DE RETRAITE ET AVANTAGES
                                          ASSIMILES : (METHODE ACTUARIELLE
                                          SUITE)
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 16C */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 16C
                                        </td>
                                        <td>ACTIFS ET PASSIFS EVENTUELS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 17 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 17
                                        </td>
                                        <td>FOURNISSEURS D'EXPLOITATION</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 18 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 18
                                        </td>
                                        <td>DETTES FISCALES ET SOCIALES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 19 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 19
                                        </td>
                                        <td>
                                          AUTRES DETTES ET PROVISIONS POUR
                                          RISQUES A COURT TERME
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 20 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 20
                                        </td>
                                        <td>
                                          BANQUES, CREDIT D'ESCOMPTE ET DE
                                          TRESORERIE
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 21 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 21
                                        </td>
                                        <td>
                                          CHIFFRE D'AFFAIRES ET AUTRES PRODUITS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 22 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 22
                                        </td>
                                        <td>ACHATS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 23 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 23
                                        </td>
                                        <td>TRANSPORTS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 24 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 24
                                        </td>
                                        <td>SERVICES EXTERIEURS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 25 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 25
                                        </td>
                                        <td>IMPOTS ET TAXES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 26 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 26
                                        </td>
                                        <td>AUTRES CHARGES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 27A */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 27A
                                        </td>
                                        <td>CHARGES DE PERSONNEL</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 27B */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 27B
                                        </td>
                                        <td>
                                          EFFECTIFS, MASSE SALARIALE ET
                                          PERSONNEL EXTERIEUR
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 28 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 28
                                        </td>
                                        <td>
                                          DOTATIONS ET CHARGES POUR PROVISIONS
                                          ET DEPRECIATIONS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 29 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 29
                                        </td>
                                        <td>CHARGES ET REVENUS FINANCIERS</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 30 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 30
                                        </td>
                                        <td>AUTRES CHARGES ET PRODUITS HAO</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 31 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 31
                                        </td>
                                        <td>
                                          REPARTITION DU RESULTAT ET AUTRES
                                          ELEMENTS CARACTERISTIQUES DES CINQ
                                          DERNIERS EXERCICES
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 32 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 32
                                        </td>
                                        <td>PRODUCTION DE L'EXERCICE</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 33 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 33
                                        </td>
                                        <td>ACHATS DESTINES A LA PRODUCTION</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 34 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 34
                                        </td>
                                        <td>
                                          FICHE DE SYNTHESE DES PRINCIPAUX
                                          INDICATEURS FINANCIERS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 35 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 35
                                        </td>
                                        <td>
                                          LISTE DES INFORMATIONS SOCIALES,
                                          ENVIRONNEMENTALES ET SOCIETALES A
                                          FOURNIR
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 36 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 36
                                        </td>
                                        <td>TABLES DES CODES</td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 37 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 37
                                        </td>
                                        <td>
                                          DETERMINATION IMPOT SUR RESULTAT
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="success"
                                            className="rounded-pill"
                                          >
                                            ✓
                                          </Badge>
                                        </td>
                                        <td className="text-center">-</td>
                                      </tr>

                                      {/* Note 38 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 38
                                        </td>
                                        <td>
                                          EVENEMENTS POSTERIEURS A LA CLOTURE DE
                                          L'EXERCICE
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Note 39 */}
                                      <tr>
                                        <td className="fw-bold text-center">
                                          NOTE 39
                                        </td>
                                        <td>
                                          CHANGEMENTS DE METHODES COMPTABLES,
                                          D'ESTIMATIONS ET CORRECTIONS D'ERREURS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="warning"
                                            className="rounded-pill"
                                          >
                                            ●
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>

                                      {/* Notes DGI & INS */}
                                      <tr className="table-primary">
                                        <td className="fw-bold text-center">
                                          NOTES DGI & INS
                                        </td>
                                        <td>
                                          ETATS SUPPLEMENTAIRES DGI et INS
                                        </td>
                                        <td className="text-center">
                                          <Badge
                                            color="info"
                                            className="rounded-pill"
                                          >
                                            !
                                          </Badge>
                                        </td>
                                        <td className="text-center">N/A</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Légende */}
                                <Card className="mt-3 border-0 shadow-sm">
                                  <CardBody className="p-3">
                                    <div className="d-flex flex-wrap gap-3 align-items-center">
                                      <span className="text-muted me-2">
                                        Légende :
                                      </span>
                                      <span className="badge bg-success me-2">
                                        <i className="ri-check-line me-1"></i>{" "}
                                        Applicable (A)
                                      </span>
                                      <span className="badge bg-warning me-2">
                                        <i className="ri-information-line me-1"></i>{" "}
                                        Non applicable (N/A)
                                      </span>
                                      <span className="badge bg-info me-2">
                                        <i className="ri-alert-line me-1"></i>{" "}
                                        Spécial DGI/INS
                                      </span>
                                    </div>
                                  </CardBody>
                                </Card>

                                {/* Information additionnelle */}
                                <Alert color="light" className="mt-3">
                                  <div className="d-flex">
                                    <div className="flex-grow-1">
                                      <h6 className="alert-heading mb-2">
                                        <i className="ri-lightbulb-flash-line me-2"></i>
                                        Information
                                      </h6>
                                      <p className="mb-0">
                                        Cette fiche présente l'ensemble des
                                        notes annexes requises par la
                                        réglementation comptable. Les notes
                                        marquées comme "Applicable" doivent être
                                        complétées, celles marquées "N/A" ne
                                        sont pas applicables à votre entité.
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0 ms-3">
                                      <Button
                                        color="primary"
                                        size="sm"
                                        className="rounded-pill"
                                      >
                                        <i className="ri-download-line me-1"></i>
                                        Exporter la fiche
                                      </Button>
                                    </div>
                                  </div>
                                </Alert>
                              </>
                            ) : // Affichage spécial pour le bilan (tab 4, 5, 6)
                            ["4", "5", "6"].includes(activeTab) ? (
                              <>
                                {/* Tableau complet du bilan avec en-tête complexe et données */}
                                <div className="table-responsive">
                                  <table
                                    className="table table-bordered align-middle mb-0"
                                    style={{ fontSize: "0.85rem" }}
                                  >
                                    <thead>
                                      <tr>
                                        {/* En-tête pour ACTIF (seulement pour BILAN complet et ACTIF seul) */}
                                        {(activeTab === "4" ||
                                          activeTab === "5") && (
                                          <th
                                            colSpan="9"
                                            className="text-center bg-success text-white"
                                          >
                                            <strong>ACTIF (1)</strong>
                                          </th>
                                        )}
                                        {/* En-tête pour PASSIF (seulement pour BILAN complet et PASSIF seul) */}
                                        {(activeTab === "4" ||
                                          activeTab === "6") && (
                                          <th
                                            colSpan={
                                              activeTab === "4" ? "7" : "6"
                                            }
                                            className="text-center bg-primary text-white"
                                          >
                                            <strong>PASSIF</strong>
                                          </th>
                                        )}
                                      </tr>
                                      <tr className="">
                                        {/* Colonnes ACTIF (seulement pour BILAN complet et ACTIF seul) */}
                                        {(activeTab === "4" ||
                                          activeTab === "5") && (
                                          <>
                                            <th
                                              rowSpan="2"
                                              className="text-center align-middle"
                                            >
                                              REF
                                            </th>
                                            <th
                                              colSpan="3"
                                              className="text-center"
                                            >
                                              EXERCICE au 31/12/N
                                            </th>
                                            <th
                                              rowSpan="2"
                                              className="text-center align-middle"
                                            >
                                              NET
                                              <br />
                                              EXERCICE au 31/12/N-1
                                            </th>
                                            <th
                                              colSpan="3"
                                              className="text-center"
                                            >
                                              EXERCICE au 31/12/N
                                            </th>
                                            <th
                                              rowSpan="2"
                                              className="text-center align-middle"
                                            >
                                              NET
                                              <br />
                                              EXERCICE au 31/12/N-1
                                            </th>
                                          </>
                                        )}

                                        {/* Colonnes PASSIF (seulement pour BILAN complet et PASSIF seul) */}
                                        {(activeTab === "4" ||
                                          activeTab === "6") && (
                                          <>
                                            <th
                                              rowSpan="2"
                                              className="text-center align-middle"
                                            >
                                              REF
                                            </th>
                                            <th
                                              rowSpan="2"
                                              className="text-center align-middle"
                                            >
                                              NOTE
                                            </th>
                                            <th
                                              colSpan="2"
                                              className="text-center"
                                            >
                                              EXERCICE AU 31/12/N
                                            </th>
                                            <th
                                              colSpan="2"
                                              className="text-center"
                                            >
                                              EXERCICE AU 31/12/N-1
                                            </th>
                                          </>
                                        )}
                                      </tr>
                                      <tr>
                                        {/* Sous-colonnes ACTIF (seulement pour BILAN complet et ACTIF seul) */}
                                        {(activeTab === "4" ||
                                          activeTab === "5") && (
                                          <>
                                            <th className="text-center">
                                              NOTE
                                            </th>
                                            <th className="text-center">
                                              BRUT
                                            </th>
                                            <th className="text-center">
                                              "AMORT et
                                              <br />
                                              DEPREC."
                                            </th>
                                            <th className="text-center">
                                              NOTE
                                            </th>
                                            <th className="text-center">
                                              BRUT
                                            </th>
                                            <th className="text-center">
                                              "AMORT et
                                              <br />
                                              DEPREC."
                                            </th>
                                          </>
                                        )}

                                        {/* Sous-colonnes PASSIF (seulement pour BILAN complet et PASSIF seul) */}
                                        {(activeTab === "4" ||
                                          activeTab === "6") && (
                                          <>
                                            <th className="text-center">NET</th>
                                            <th className="text-center">NET</th>
                                            <th className="text-center">NET</th>
                                            <th className="text-center">NET</th>
                                          </>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Données pour l'ACTIF (partie gauche du tableau) */}
                                      {(activeTab === "4" ||
                                        activeTab === "5") && (
                                        <>
                                          {/* Immobilisations incorporelles */}
                                          <tr>
                                            <td className="fw-bold">20</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(1500000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(300000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1200000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(1400000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(250000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1150000)}
                                            </td>

                                            {/* Colonnes PASSIF (vides pour l'actif, seulement pour le bilan complet) */}
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* Immobilisations corporelles */}
                                          <tr>
                                            <td className="fw-bold">21</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(5000000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(1500000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(3500000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(4500000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(1200000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(3300000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* Immobilisations financières */}
                                          <tr>
                                            <td className="fw-bold">27</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(2000000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(0)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(2000000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(1800000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(0)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1800000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* Stocks */}
                                          <tr>
                                            <td className="fw-bold">3</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(1200000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(100000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1100000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(1000000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(80000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(920000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* Créances clients */}
                                          <tr>
                                            <td className="fw-bold">40</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(2500000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(200000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(2300000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(2200000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(150000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(2050000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* Valeurs mobilières */}
                                          <tr>
                                            <td className="fw-bold">50</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(800000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(0)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(800000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(700000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(0)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(700000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* Trésorerie */}
                                          <tr>
                                            <td className="fw-bold">53</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold">
                                              {formatAmount(1200000)}
                                            </td>
                                            <td className="text-end text-danger">
                                              {formatAmount(0)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1200000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-semibold text-muted">
                                              {formatAmount(1000000)}
                                            </td>
                                            <td className="text-end text-danger text-muted">
                                              {formatAmount(0)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1000000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>

                                          {/* TOTAL ACTIF */}
                                          <tr className="table-success">
                                            <td className="fw-bold">TOTAL</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(14200000)}
                                            </td>
                                            <td className="text-end fw-bold text-danger">
                                              {formatAmount(2100000)}
                                            </td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(12100000)}
                                            </td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-muted">
                                              {formatAmount(12600000)}
                                            </td>
                                            <td className="text-end fw-bold text-danger text-muted">
                                              {formatAmount(1680000)}
                                            </td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(10920000)}
                                            </td>

                                            {activeTab === "4" && (
                                              <td
                                                colSpan="7"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}
                                          </tr>
                                        </>
                                      )}

                                      {/* Données pour le PASSIF (partie droite du tableau) - seulement pour bilan complet et passif seul */}
                                      {(activeTab === "4" ||
                                        activeTab === "6") && (
                                        <>
                                          {/* Séparateur visuel seulement pour le bilan complet */}
                                          {activeTab === "4" && (
                                            <tr>
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            </tr>
                                          )}

                                          {/* Capital social */}
                                          <tr>
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">10</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(3000000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(3000000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(3000000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(3000000)}
                                            </td>
                                          </tr>

                                          {/* Autres lignes PASSIF */}
                                          <tr>
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">11</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1500000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1500000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1200000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1200000)}
                                            </td>
                                          </tr>

                                          <tr>
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">12</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(500000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(500000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(400000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(400000)}
                                            </td>
                                          </tr>

                                          <tr>
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">13</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(800000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(800000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(600000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(600000)}
                                            </td>
                                          </tr>

                                          <tr>
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">16</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(2500000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(2500000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(2200000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(2200000)}
                                            </td>
                                          </tr>

                                          <tr>
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">40</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1800000)}
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                              {formatAmount(1800000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1500000)}
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                              {formatAmount(1500000)}
                                            </td>
                                          </tr>

                                          {/* TOTAL PASSIF */}
                                          <tr className="table-primary">
                                            {activeTab === "4" && (
                                              <td
                                                colSpan="9"
                                                className="text-center text-muted"
                                              >
                                                -
                                              </td>
                                            )}

                                            <td className="fw-bold">TOTAL</td>
                                            <td className="text-muted">-</td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(10100000)}
                                            </td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(10100000)}
                                            </td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(8900000)}
                                            </td>
                                            <td className="text-end fw-bold">
                                              {formatAmount(8900000)}
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Légende pour le bilan */}
                                <Card className="mt-3 border-0 shadow-sm">
                                  <CardBody className="p-3">
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                      <span className="text-muted me-2">
                                        Légende :
                                      </span>
                                      {activeTab === "4" && (
                                        <span className="badge bg-success me-2">
                                          ACTIF
                                        </span>
                                      )}
                                      {(activeTab === "4" ||
                                        activeTab === "6") && (
                                        <span className="badge bg-primary me-2">
                                          PASSIF
                                        </span>
                                      )}
                                      <span className="text-success me-2">
                                        <i className="ri-checkbox-blank-circle-fill me-1"></i>
                                        Valeurs N (Exercice courant)
                                      </span>
                                      <span className="text-primary me-2">
                                        <i className="ri-checkbox-blank-circle-fill me-1"></i>
                                        Valeurs N-1 (Exercice précédent)
                                      </span>
                                      {(activeTab === "4" ||
                                        activeTab === "5") && (
                                        <span className="text-danger me-2">
                                          <i className="ri-checkbox-blank-circle-fill me-1"></i>
                                          Amortissements et dépréciations
                                        </span>
                                      )}
                                    </div>
                                  </CardBody>
                                </Card>
                              </>
                            ) : // Affichage spécial pour le résultat (tab 7)
                            activeTab === "7" ? (
                              <>
                                {/* Tableau complet du compte de résultat */}
                                <div className="table-responsive">
                                  <table
                                    className="table table-bordered align-middle mb-0"
                                    style={{
                                      fontSize: "0.85rem",
                                      borderRadius: "20px",
                                      overflow: "hidden",
                                      borderCollapse: "separate",
                                      borderSpacing: 0,
                                    }}
                                  >
                                    <thead className="rounded-top-4">
                                      <tr className="rounded-top-4">
                                        <th className="text-center align-middle">
                                          REF
                                        </th>
                                        <th className="text-center align-middle">
                                          LIBELLES
                                        </th>
                                        <th className="text-center align-middle">
                                          NOTE
                                        </th>
                                        <th className="text-center align-middle">
                                          "EXERCICE AU
                                          <br />
                                          31/12/N"
                                          <br />
                                          NET (1)
                                        </th>
                                        <th className="text-center align-middle">
                                          "EXERCICE AU 31/12/N-1"
                                          <br />
                                          NET (1)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* PRODUITS - Section A */}
                                      <tr>
                                        <td
                                          colSpan="5"
                                          className="fw-bold text-success"
                                        >
                                          <i className="ri-arrow-up-line me-1"></i>
                                          PRODUITS
                                        </td>
                                      </tr>

                                      {/* Ventes de marchandises */}
                                      <tr>
                                        <td className="fw-bold">TA</td>
                                        <td>Ventes de marchandises</td>
                                        <td className="text-center">A + 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(8500000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(7200000)}
                                        </td>
                                      </tr>

                                      {/* Ventes de produits fabriqués */}
                                      <tr>
                                        <td className="fw-bold">TB</td>
                                        <td>Ventes de produits fabriqués</td>
                                        <td className="text-center">B + 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(3200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(2800000)}
                                        </td>
                                      </tr>

                                      {/* Travaux, services vendus */}
                                      <tr>
                                        <td className="fw-bold">TC</td>
                                        <td>Travaux, services vendus</td>
                                        <td className="text-center">C + 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(1500000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(1300000)}
                                        </td>
                                      </tr>

                                      {/* Produits accessoires */}
                                      <tr>
                                        <td className="fw-bold">TD</td>
                                        <td>Produits accessoires</td>
                                        <td className="text-center">D + 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(500000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(450000)}
                                        </td>
                                      </tr>

                                      {/* Chiffre d'affaires */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XB</td>
                                        <td className="fw-bold">
                                          CHIFFRE D'AFFAIRES (A + B + C + D)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold">
                                          {formatAmount(13700000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(11750000)}
                                        </td>
                                      </tr>

                                      {/* Production stockée */}
                                      <tr>
                                        <td className="fw-bold">TE</td>
                                        <td>
                                          Production stockée (ou déstockage)
                                        </td>
                                        <td className="text-center">-/+ 6</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(300000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(250000)}
                                        </td>
                                      </tr>

                                      {/* Production immobilisée */}
                                      <tr>
                                        <td className="fw-bold">TF</td>
                                        <td>Production immobilisée</td>
                                        <td className="text-center">+ 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(150000)}
                                        </td>
                                      </tr>

                                      {/* Subventions d'exploitation */}
                                      <tr>
                                        <td className="fw-bold">TG</td>
                                        <td>Subventions d'exploitation</td>
                                        <td className="text-center">+ 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(150000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(100000)}
                                        </td>
                                      </tr>

                                      {/* Autres produits */}
                                      <tr>
                                        <td className="fw-bold">TH</td>
                                        <td>Autres produits</td>
                                        <td className="text-center">+ 21</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(400000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(350000)}
                                        </td>
                                      </tr>

                                      {/* Transferts de charges d'exploitation */}
                                      <tr>
                                        <td className="fw-bold">TI</td>
                                        <td>
                                          Transferts de charges d'exploitation
                                        </td>
                                        <td className="text-center">+ 12</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(100000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(80000)}
                                        </td>
                                      </tr>

                                      {/* Revenus financiers */}
                                      <tr>
                                        <td className="fw-bold">TK</td>
                                        <td>Revenus financiers et assimilés</td>
                                        <td className="text-center">+ 29</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(400000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(350000)}
                                        </td>
                                      </tr>

                                      {/* Reprises financières */}
                                      <tr>
                                        <td className="fw-bold">TL</td>
                                        <td>
                                          Reprises de provisions et
                                          dépréciations financières
                                        </td>
                                        <td className="text-center">+ 28</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(100000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(80000)}
                                        </td>
                                      </tr>

                                      {/* Transferts de charges financières */}
                                      <tr>
                                        <td className="fw-bold">TM</td>
                                        <td>
                                          Transferts de charges financières
                                        </td>
                                        <td className="text-center">+ 12</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(50000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(40000)}
                                        </td>
                                      </tr>

                                      {/* Produits des cessions */}
                                      <tr>
                                        <td className="fw-bold">TN</td>
                                        <td>
                                          Produits des cessions
                                          d'immobilisations
                                        </td>
                                        <td className="text-center">+ 3D</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(150000)}
                                        </td>
                                      </tr>

                                      {/* Autres produits HAO */}
                                      <tr>
                                        <td className="fw-bold">TO</td>
                                        <td>Autres Produits HAO</td>
                                        <td className="text-center">+ 30</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(100000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(80000)}
                                        </td>
                                      </tr>

                                      {/* Total Produits */}
                                      <tr className="table-success">
                                        <td colSpan="3" className="fw-bold">
                                          TOTAL PRODUITS
                                        </td>
                                        <td className="text-end fw-bold">
                                          {formatAmount(16500000)}
                                        </td>
                                        <td className="text-end fw-bold">
                                          {formatAmount(14150000)}
                                        </td>
                                      </tr>

                                      {/* CHARGES - Section B */}
                                      <tr>
                                        <td
                                          colSpan="5"
                                          className="fw-bold text-danger"
                                        >
                                          <i className="ri-arrow-down-line me-1"></i>
                                          CHARGES
                                        </td>
                                      </tr>

                                      {/* Achats de marchandises */}
                                      <tr>
                                        <td className="fw-bold">RA</td>
                                        <td>Achats de marchandises</td>
                                        <td className="text-center">- 22</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(4500000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(3800000)}
                                        </td>
                                      </tr>

                                      {/* Variation de stocks de marchandises */}
                                      <tr>
                                        <td className="fw-bold">RB</td>
                                        <td>
                                          Variation de stocks de marchandises
                                        </td>
                                        <td className="text-center">-/+ 6</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(150000)}
                                        </td>
                                      </tr>

                                      {/* Marge commerciale */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XA</td>
                                        <td className="fw-bold">
                                          MARGE COMMERCIALE (Somme TA à RB)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(3800000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(3250000)}
                                        </td>
                                      </tr>

                                      {/* Achats de matières premières */}
                                      <tr>
                                        <td className="fw-bold">RC</td>
                                        <td>
                                          Achats de matières premières et
                                          fournitures liées
                                        </td>
                                        <td className="text-center">- 22</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(1200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(1000000)}
                                        </td>
                                      </tr>

                                      {/* Variation stocks matières premières */}
                                      <tr>
                                        <td className="fw-bold">RD</td>
                                        <td>
                                          Variation de stocks de matières
                                          premières et fournitures liées
                                        </td>
                                        <td className="text-center">-/+ 6</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(100000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(80000)}
                                        </td>
                                      </tr>

                                      {/* Autres achats */}
                                      <tr>
                                        <td className="fw-bold">RE</td>
                                        <td>Autres achats</td>
                                        <td className="text-center">- 22</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(600000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(500000)}
                                        </td>
                                      </tr>

                                      {/* Variation stocks autres approvisionnements */}
                                      <tr>
                                        <td className="fw-bold">RF</td>
                                        <td>
                                          Variation de stocks d'autres
                                          approvisionnements
                                        </td>
                                        <td className="text-center">-/+ 6</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(50000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(40000)}
                                        </td>
                                      </tr>

                                      {/* Transports */}
                                      <tr>
                                        <td className="fw-bold">RG</td>
                                        <td>Transports</td>
                                        <td className="text-center">- 23</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(300000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(250000)}
                                        </td>
                                      </tr>

                                      {/* Services extérieurs */}
                                      <tr>
                                        <td className="fw-bold">RH</td>
                                        <td>Services extérieurs</td>
                                        <td className="text-center">- 24</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(800000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(700000)}
                                        </td>
                                      </tr>

                                      {/* Impôts et taxes */}
                                      <tr>
                                        <td className="fw-bold">RI</td>
                                        <td>Impôts et taxes</td>
                                        <td className="text-center">- 25</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(500000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(420000)}
                                        </td>
                                      </tr>

                                      {/* Autres charges */}
                                      <tr>
                                        <td className="fw-bold">RJ</td>
                                        <td>Autres charges</td>
                                        <td className="text-center">- 26</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(400000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(350000)}
                                        </td>
                                      </tr>

                                      {/* Valeur ajoutée */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XC</td>
                                        <td className="fw-bold">
                                          VALEUR AJOUTEE (XB + RA + RB) + (somme
                                          TE à RJ)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(6500000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(5600000)}
                                        </td>
                                      </tr>

                                      {/* Charges de personnel */}
                                      <tr>
                                        <td className="fw-bold">RK</td>
                                        <td>Charges de personnel</td>
                                        <td className="text-center">- 27</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(3200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(2800000)}
                                        </td>
                                      </tr>

                                      {/* Excédent brut d'exploitation */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XD</td>
                                        <td className="fw-bold">
                                          EXCEDENT BRUT D'EXPLOITATION (XC + RK)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(3300000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(2800000)}
                                        </td>
                                      </tr>

                                      {/* Reprises d'amortissements */}
                                      <tr>
                                        <td className="fw-bold">TJ</td>
                                        <td>
                                          Reprises d'amortissements, provisions
                                          et dépréciations
                                        </td>
                                        <td className="text-center">+ 28</td>
                                        <td className="text-end fw-semibold text-success">
                                          {formatAmount(200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(180000)}
                                        </td>
                                      </tr>

                                      {/* Dotations aux amortissements */}
                                      <tr>
                                        <td className="fw-bold">RL</td>
                                        <td>
                                          Dotations aux amortissements, aux
                                          provisions et dépréciations
                                        </td>
                                        <td className="text-center">
                                          - 3C & 28
                                        </td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(900000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(750000)}
                                        </td>
                                      </tr>

                                      {/* Résultat d'exploitation */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XE</td>
                                        <td className="fw-bold">
                                          RESULTAT D'EXPLOITATION (XD + TJ + RL)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(2600000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(2230000)}
                                        </td>
                                      </tr>

                                      {/* Frais financiers */}
                                      <tr>
                                        <td className="fw-bold">RM</td>
                                        <td>
                                          Frais financiers et charges assimilées
                                        </td>
                                        <td className="text-center">- 29</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(300000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(250000)}
                                        </td>
                                      </tr>

                                      {/* Dotations financières */}
                                      <tr>
                                        <td className="fw-bold">RN</td>
                                        <td>
                                          Dotations aux provisions et aux
                                          dépréciations financières
                                        </td>
                                        <td className="text-center">
                                          - 3C & 28
                                        </td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(100000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(80000)}
                                        </td>
                                      </tr>

                                      {/* Résultat financier */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XF</td>
                                        <td className="fw-bold">
                                          RESULTAT FINANCIER (somme TK à RN)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(150000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(120000)}
                                        </td>
                                      </tr>

                                      {/* Résultat des activités ordinaires */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XG</td>
                                        <td className="fw-bold">
                                          RESULTAT DES ACTIVITES ORDINAIRES (XE
                                          + XF)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(2750000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(2350000)}
                                        </td>
                                      </tr>

                                      {/* Valeurs comptables des cessions */}
                                      <tr>
                                        <td className="fw-bold">RO</td>
                                        <td>
                                          Valeurs comptables des cessions
                                          d'immobilisations
                                        </td>
                                        <td className="text-center">- 3D</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(150000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(120000)}
                                        </td>
                                      </tr>

                                      {/* Autres charges HAO */}
                                      <tr>
                                        <td className="fw-bold">RP</td>
                                        <td>Autres Charges HAO</td>
                                        <td className="text-center">- 30</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(100000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(80000)}
                                        </td>
                                      </tr>

                                      {/* Résultat hors activités ordinaires */}
                                      <tr className="table-info">
                                        <td className="fw-bold">XH</td>
                                        <td className="fw-bold">
                                          RESULTAT HORS ACTIVITES ORDINAIRES
                                          (somme TN à RP)
                                        </td>
                                        <td className="text-center"></td>
                                        <td className="text-end fw-bold text-success">
                                          {formatAmount(50000)}
                                        </td>
                                        <td className="text-end fw-bold text-muted">
                                          {formatAmount(30000)}
                                        </td>
                                      </tr>

                                      {/* Participation des travailleurs */}
                                      <tr>
                                        <td className="fw-bold">RQ</td>
                                        <td>Participation des travailleurs</td>
                                        <td className="text-center">- 30</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(200000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(180000)}
                                        </td>
                                      </tr>

                                      {/* Impôts sur le résultat */}
                                      <tr>
                                        <td className="fw-bold">RS</td>
                                        <td>Impôts sur le résultat</td>
                                        <td className="text-center">- 37</td>
                                        <td className="text-end fw-semibold text-danger">
                                          {formatAmount(450000)}
                                        </td>
                                        <td className="text-end text-muted">
                                          {formatAmount(400000)}
                                        </td>
                                      </tr>

                                      {/* Total Charges */}
                                      <tr className="table-danger">
                                        <td colSpan="3" className="fw-bold">
                                          TOTAL CHARGES
                                        </td>
                                        <td className="text-end fw-bold">
                                          {formatAmount(13950000)}
                                        </td>
                                        <td className="text-end fw-bold">
                                          {formatAmount(11800000)}
                                        </td>
                                      </tr>

                                      {/* RÉSULTAT NET */}
                                      <tr className="table-primary">
                                        <td colSpan="3" className="fw-bold">
                                          RESULTAT NET (XG + XH + RQ + RS)
                                        </td>
                                        <td className="text-end fw-bold text-primary">
                                          {formatAmount(2550000)}
                                        </td>
                                        <td className="text-end fw-bold text-primary">
                                          {formatAmount(2180000)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Légende */}
                                <Card className="mt-3 border-0 shadow-sm">
                                  <CardBody className="p-3">
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                      <span className="text-muted me-2">
                                        Légende :
                                      </span>
                                      <span className="badge bg-success me-2">
                                        Produits
                                      </span>
                                      <span className="badge bg-danger me-2">
                                        Charges
                                      </span>
                                      <span className="badge bg-primary me-2">
                                        Résultat
                                      </span>
                                      <span className="badge bg-info me-2">
                                        Soldes intermédiaires
                                      </span>
                                      <span className="text-success me-2">
                                        <i className="ri-arrow-up-line me-1"></i>
                                        Entrées
                                      </span>
                                      <span className="text-danger me-2">
                                        <i className="ri-arrow-down-line me-1"></i>
                                        Sorties
                                      </span>
                                    </div>
                                  </CardBody>
                                </Card>
                              </>
                            ) : // Affichage spécial pour le TFT (onglet 8)
                            activeTab === "8" ? (
                              <>
                                <div className="mb-4">
                                  <h5 className="text-success mb-3">
                                    <i className="ri-exchange-dollar-line me-2"></i>
                                    Tableau de Financement par Tiers (TFT)
                                  </h5>
                                  <Alert color="info" className="mb-3">
                                    <i className="ri-information-line me-2"></i>
                                    Ce tableau retrace les flux de trésorerie
                                    selon la méthode indirecte, ventilés par
                                    catégories d'activités (exploitation,
                                    investissement, financement).
                                  </Alert>
                                </div>

                                {/* Tableau TFT avec en-tête spécifique */}
                                <div className="table-responsive">
                                  <table className="table table-bordered table-hover align-middle mb-0">
                                    <thead>
                                      <tr>
                                        <th
                                          rowSpan="2"
                                          className="text-center align-middle"
                                        >
                                          REF
                                        </th>
                                        <th
                                          rowSpan="2"
                                          className="text-center align-middle"
                                        >
                                          LIBELLES
                                        </th>
                                        <th
                                          colSpan="1"
                                          className="text-center align-middle"
                                        >
                                          (4)
                                        </th>
                                        <th
                                          rowSpan="2"
                                          className="text-center align-middle"
                                        >
                                          NOTE
                                        </th>
                                        <th
                                          rowSpan="2"
                                          className="text-center align-middle"
                                        >
                                          EXERCICE
                                          <br />N
                                        </th>
                                        <th
                                          rowSpan="2"
                                          className="text-center align-middle"
                                        >
                                          EXERCICE
                                          <br />
                                          N-1
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filteredData.map((item, index) => {
                                        // Déterminer le style de la ligne selon le type
                                        let rowClass = "";
                                        let isTotalRow = false;
                                        let isSectionRow = false;

                                        if (
                                          item.type === "tresorerie_initiale"
                                        ) {
                                          rowClass = "table-primary";
                                          isSectionRow = true;
                                        } else if (
                                          item.type.includes("total")
                                        ) {
                                          rowClass = "table-success";
                                          isTotalRow = true;
                                        } else if (
                                          item.type === "synthese" ||
                                          item.type === "tresorerie_finale"
                                        ) {
                                          rowClass = "table-warning";
                                          isTotalRow = true;
                                        } else if (item.type === "tiers") {
                                          rowClass = "table-light";
                                        }

                                        return (
                                          <tr key={index} className={rowClass}>
                                            <td
                                              className={`fw-bold ${
                                                isTotalRow ? "text-primary" : ""
                                              }`}
                                            >
                                              {item.ref}
                                            </td>
                                            <td
                                              style={{
                                                whiteSpace: "normal",
                                                paddingLeft:
                                                  item.libelle.startsWith(
                                                    " - "
                                                  ) ||
                                                  item.libelle.startsWith(" + ")
                                                    ? "30px"
                                                    : "10px",
                                              }}
                                            >
                                              {item.libelle}
                                            </td>
                                            {/* Colonnes vides pour l'alignement avec l'en-tête */}
                                            <td></td>

                                            <td
                                              className={
                                                !isNaN(item.note) &&
                                                item.note !== ""
                                                  ? "text-muted"
                                                  : ""
                                              }
                                            >
                                              {item.note}
                                            </td>
                                            <td className="text-end">
                                              {item.exerciceN === 0 ? (
                                                "0"
                                              ) : (
                                                <>
                                                  <span
                                                    className={
                                                      item.exerciceN < 0
                                                        ? "text-danger"
                                                        : "text-success"
                                                    }
                                                  >
                                                    {formatAmount(
                                                      Math.abs(item.exerciceN)
                                                    )}
                                                    {item.exerciceN < 0
                                                      ? " -"
                                                      : ""}
                                                  </span>
                                                  {isTotalRow && " "}
                                                </>
                                              )}
                                            </td>
                                            <td className="text-end text-muted">
                                              {item.exerciceN1 === 0 ? (
                                                "0"
                                              ) : (
                                                <>
                                                  {formatAmount(
                                                    Math.abs(item.exerciceN1)
                                                  )}
                                                  {item.exerciceN1 < 0
                                                    ? " -"
                                                    : ""}
                                                </>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Légende et analyse */}
                                <Card className="mt-3 border-0 shadow-sm">
                                  <CardBody>
                                    <Row>
                                      <Col md={6}>
                                        <h6 className="mb-2">
                                          <i className="ri-information-line me-2"></i>
                                          Analyse des flux de trésorerie
                                        </h6>
                                        <ul className="list-unstyled mb-0">
                                          <li className="mb-1">
                                            <Badge
                                              color="success"
                                              className="me-2"
                                            >
                                              CAFG
                                            </Badge>
                                            Capacité d'Autofinancement Globale
                                          </li>
                                          <li className="mb-1">
                                            <Badge
                                              color="primary"
                                              className="me-2"
                                            >
                                              BFR
                                            </Badge>
                                            Besoin en Fonds de Roulement
                                          </li>
                                          <li className="mb-1">
                                            <Badge
                                              color="warning"
                                              className="me-2"
                                            >
                                              ∆ Trésorerie
                                            </Badge>
                                            Variation nette de trésorerie
                                          </li>
                                        </ul>
                                      </Col>
                                      <Col md={6}>
                                        <h6 className="mb-2">
                                          <i className="ri-trending-up-line me-2"></i>
                                          Indicateurs clés
                                        </h6>
                                        <div className="d-flex flex-column">
                                          <div className="d-flex justify-content-between mb-1">
                                            <span>CAFG / CA :</span>
                                            <span className="fw-bold text-success">
                                              20.0%
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between mb-1">
                                            <span>
                                              Autofinancement / Investissements
                                              :
                                            </span>
                                            <span className="fw-bold text-info">
                                              125.0%
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <span>∆ Trésorerie nette :</span>
                                            <span className="fw-bold text-primary">
                                              +{formatAmount(2100000)} 
                                            </span>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </Card>
                              </>
                            ) : (
                              // Pour tous les autres tableaux, utiliser TableContainer normal
                              <>
                                <TableContainer
                                  columns={getColumns}
                                  data={paginatedData}
                                  isGlobalFilter={false}
                                  customPageSize={itemsPerPage}
                                >
                                  <Pagination
                                    data={filteredData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    alwaysShow={true}
                                    showInfo={true}
                                  />
                                </TableContainer>

                                {/* Totaux pour les tableaux financiers (notes 37-55) */}
                                {parseInt(activeTab) >= 37 &&
                                  parseInt(activeTab) <= 55 && (
                                    <Card className="mt-3 border-0 shadow-sm">
                                      <CardBody>
                                        <h6 className="mb-3">
                                          <i className="ri-calculator-line me-2"></i>
                                          Résumé - {getActiveTabTitle}
                                        </h6>
                                        <Row>
                                          {/* ... vos totaux existants ... */}
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  )}
                              </>
                            )}

                            {/* Pagination pour tous les tableaux (sauf ceux avec affichage spécial) */}
                            {!["2", "4", "5", "6", "7", "8", "9"].includes(
                              activeTab
                            ) && (
                              <Pagination
                                data={filteredData}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                alwaysShow={true}
                                showInfo={true}
                              />
                            )}
                          </>
                        ) : (
                          <EmptyDataCard
                            title="Aucune donnée trouvée"
                            description={
                              searchTerm
                                ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
                                : "Aucune donnée disponible pour cet état comptable."
                            }
                            actionButton={
                              <Button
                                color="success"
                                onClick={() => setSearchTerm("")}
                                className="rounded-pill"
                              >
                                <i className="ri-refresh-line me-1"></i>
                                Réinitialiser la recherche
                              </Button>
                            }
                            secondaryAction={
                              searchTerm && (
                                <Button
                                  color="outline-secondary"
                                  onClick={() => setSearchTerm("")}
                                  className="rounded-pill"
                                >
                                  <i className="ri-close-line me-1"></i>
                                  Effacer la recherche
                                </Button>
                              )
                            }
                          />
                        )}
                      </TabPane>
                    ))}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Styles CSS pour le scroll */}
      <style>
        {`
      .nav-tabs-horizontal-container::-webkit-scrollbar {
        height: 6px;
      }
      
      .nav-tabs-horizontal-container::-webkit-scrollbar-track {
        background: #f8f9fa;
        border-radius: 3px;
      }
      
      .nav-tabs-horizontal-container::-webkit-scrollbar-thumb {
        background: #adb5bd;
        border-radius: 3px;
      }
      
      .nav-tabs-horizontal-container::-webkit-scrollbar-thumb:hover {
        background: #6c757d;
      }
      
      .nav-tabs-custom .nav-link.active {
        font-weight: 600;
      }
      
      /* Styles pour le tableau du bilan */
      .table-bordered th, .table-bordered td {
        border: 1px solid #dee2e6 !important;
      }
      
      .table-bordered thead th {
        border-bottom-width: 2px !important;
      }
      
      .text-end {
        text-align: right !important;
      }
      
      @media (max-width: 768px) {
        .nav-tabs-horizontal-container {
          padding: 0 10px;
        }
        
        .nav-link {
          padding: 0.5rem 0.75rem !important;
          font-size: 0.875rem;
        }
        
        .nav-link i {
          font-size: 0.875rem;
          margin-right: 0.25rem !important;
        }
        
        /* Styles pour le tableau du bilan sur mobile */
        .table-responsive table {
          font-size: 0.7rem !important;
        }
        
        .table-responsive th,
        .table-responsive td {
          padding: 0.2rem !important;
        }
      }
    `}
      </style>
    </React.Fragment>
  );
};

export default Etats;
