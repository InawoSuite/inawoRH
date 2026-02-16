// import React, { useState, useEffect } from "react";
// import { Card, CardBody, Col, Row } from "reactstrap";
// import { useProfile } from "../../Components/Hooks/UserHooks";
// import { BaseUrl } from "../../pages/APIKey/ApiKey";

// const CategoryStatsDashboard = ({
//   type = "depenses", // "depenses" ou "revenus"
// }) => {
//   const [stats, setStats] = useState({
//     categories: [],
//     loading: true,
//     error: null,
//   });

//   const { userProfile, token } = useProfile();

//   // Fonction pour formater les nombres en milliers
//   const formatNumber = (num) => {
//     if (num === null || num === undefined) return "0";
//     return new Intl.NumberFormat("fr-FR").format(num);
//   };

//   // Définition des 5 catégories avec mapping vers les catégories API
//   const getCategoryConfig = () => {
//     if (type === "depenses") {
//       return [
//         { 
//           name: "Frais d'exploitation", 
//           icon: "ri-building-line",
//           apiCategories: [
//             "Entretien et maintenance des locaux",
//             "Achats de Marchandises",
//             "Appovisionnement"
//           ]
//         },
//         { 
//           name: "Marketing", 
//           icon: "ri-megaphone-line",
//           apiCategories: [
//             "Publicité et communication (réseaux sociaux, affiches, radio, etc.)"
//           ]
//         },
//         { 
//           name: "Frais du personnel", 
//           icon: "ri-team-line",
//           apiCategories: [
//             "Avantages sociaux (mutuelle, tickets restaurant)"
//           ]
//         },
//         { 
//           name: "Investissements", 
//           icon: "ri-line-chart-line",
//           apiCategories: [
//             "Achat de machines industrielles"
//           ]
//         },
//         { 
//           name: "Dépenses financières", 
//           icon: "ri-bank-line",
//           apiCategories: [
//             "Intérêts sur crédits-bails (leasing)"
//           ]
//         },
//       ];
//     } else {
//       return [
//         { 
//           name: "Exploitation", 
//           icon: "ri-store-2-line",
//           apiCategories: [
//             "Ventes de Produits et Services",
//             "ABONNEMENT"
//           ]
//         },
//         { 
//           name: "Annexes", 
//           icon: "ri-money-dollar-circle-line",
//           apiCategories: [
//             ""
//           ]
//         },
//         { 
//           name: "Financiers", 
//           icon: "ri-line-chart-line",
//           apiCategories: [
//             "INTERET"
//           ]
//         },
//         { 
//           name: "Exceptionnels", 
//           icon: "ri-gift-line",
//           apiCategories: []
//         },
//         { 
//           name: "Propriété Intellectuelle", 
//           icon: "ri-copyright-line",
//           apiCategories: []
//         },
//       ];
//     }
//   };

//   // Couleurs pour chaque bloc
//   const getCategoryColors = () => {
//     return [
//       { accent: "#014a92" },
//       { accent: "#1fa5f3" },
//       { accent: "#6dbd1c" },
//       { accent: "#f06548" },
//       { accent: "#8950fc" },
//     ];
//   };

//   // Fonction pour récupérer les données statistiques par catégorie
//   const fetchCategoryStats = async () => {
//     if (!token || !userProfile) {
//       console.log("En attente du token ou du profil utilisateur...");
//       return;
//     }

//     try {
//       setStats((prev) => ({ ...prev, loading: true, error: null }));

//       const endpoint =
//         type === "depenses"
//           ? `${BaseUrl}/facture/statistiques/depenses-par-categorie/`
//           : `${BaseUrl}/facture/statistiques/revenus-par-categorie/`;

//       console.log(`📊 Chargement des ${type} depuis:`, endpoint);

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       };

//       const response = await fetch(endpoint, { headers });

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP! statut: ${response.status}`);
//       }

//       const apiData = await response.json();
//       console.log(`✅ Données ${type} reçues de l'API:`, apiData);

//       const categoryConfig = getCategoryConfig();
//       const categoryColors = getCategoryColors();

//       const apiDataMap = {};
//       apiData.forEach((item) => {
//         apiDataMap[item.categorie] = item;
//       });

//       console.log("🗺️ Map des données API:", apiDataMap);

//       const transformedData = categoryConfig.map((config, index) => {
//         const isDepense = type === "depenses";
        
//         let montantTotal = 0;
//         let montantPayeRecu = 0;

//         config.apiCategories.forEach(apiCategory => {
//           const apiItem = apiDataMap[apiCategory];
//           if (apiItem) {
//             montantTotal += apiItem.montant_total || 0;
//             montantPayeRecu += isDepense 
//               ? apiItem.montant_paye || 0 
//               : apiItem.montant_recu || 0;
//           }
//         });

//         const colors = categoryColors[index % categoryColors.length];

//         const categoryData = {
//           id: index + 1,
//           categorie: config.name,
//           montantTotal,
//           montantPayeRecu,
//           icon: config.icon,
//           apiCategories: config.apiCategories,
//           accentColor: colors.accent,
//           hasData: montantTotal > 0
//         };

//         return categoryData;
//       });

//       setStats({
//         categories: transformedData,
//         loading: false,
//         error: null,
//       });
//     } catch (error) {
//       console.error(
//         `❌ Erreur lors du chargement des statistiques ${type}:`,
//         error
//       );

//       const categoryConfig = getCategoryConfig();
//       const categoryColors = getCategoryColors();

//       const errorData = categoryConfig.map((config, index) => {
//         const colors = categoryColors[index % categoryColors.length];

//         return {
//           id: index + 1,
//           categorie: config.name,
//           montantTotal: 0,
//           montantPayeRecu: 0,
//           icon: config.icon,
//           apiCategories: config.apiCategories,
//           accentColor: colors.accent,
//           hasData: false
//         };
//       });

//       setStats({
//         categories: errorData,
//         loading: false,
//         error: error.message || "Erreur lors du chargement des données",
//       });
//     }
//   };

//   useEffect(() => {
//     if (token && userProfile) {
//       fetchCategoryStats();
//     }
//   }, [token, userProfile, type]);

//   const totalMontant = stats.categories.reduce((sum, item) => sum + item.montantTotal, 0);
//   const categoriesAvecDonnees = stats.categories.filter(item => item.montantTotal > 0).length;

//   return (
//     <React.Fragment>
//       <Row>
//         <Col xl={12}>
//           <Card
//             className="crm-widget"
//             style={{
//               border: "none",
//               backgroundColor: "transparent",
//               boxShadow: "none",
//             }}
//           >
//             <CardBody
//               className="p-0"
//               style={{ backgroundColor: "transparent", border: "none" }}
//             >
//               {/* Bloc unique avec toutes les statistiques côte à côte */}
//               <div
//                 className="card mb-0"
//                 style={{
//                   boxShadow: "0 1px 0 rgba(56, 65, 74, 0.10)",
//                   borderRadius: "20px",
//                   border: "1px solid var(--vz-border-color)",
//                   padding: "0 15px",
//                 }}
//               >
//                 <Row className="row-cols-xxl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 g-3">
//                   {(stats.categories || []).map((item, key) => (
//                     <Col
//                       key={key}
//                       style={{ border: "none", backgroundColor: "transparent" }}
//                     >
//                       <div
//                         className="h-100 card-body"
//                         style={{
//                           borderRadius: "12px",
//                           minHeight: "110px",
//                         }}
//                       >
//                         {/* Conteneur principal avec icône à gauche et texte à droite */}
//                         <div className="d-flex h-100">
//                           {/* Icône dans un cercle - AGRANDIE */}
//                           <div
//                             className="d-flex align-items-center justify-content-center me-2 mt-4"
//                             style={{
//                               width: '60px',
//                               height: '60px',
//                               borderRadius: '50%',
//                               backgroundColor: `${item.accentColor}15`,
//                               flexShrink: 0
//                             }}
//                           >
//                             <i
//                               className={item.icon}
//                               style={{
//                                 color: item.accentColor,
//                                 fontSize: '1.6rem',
//                                 lineHeight: 1,
//                               }}
//                             ></i>
//                           </div>
                          
//                           {/* Conteneur des textes alignés verticalement */}
//                           <div className="d-flex flex-column justify-content-center flex-grow-1">
//                             {/* Ligne 1: Catégorie */}
//                             <div className="mb-0">
//                               <span
//                                 className="text-muted"
//                                 style={{
//                                   fontSize: "0.8rem",
//                                   fontWeight: "500",
//                                 }}
//                               >
//                                 {item.categorie}
//                               </span>
//                             </div>

//                             {/* Ligne 2: Montant total */}
//                             <div className="mb-0">
//                               <span
//                                 style={{
//                                   fontSize: "1.1rem",
//                                   fontWeight: "700",
//                                   lineHeight: "1.2",
//                                 }}
//                               >
//                                 {stats.loading ? (
//                                   <div
//                                     className="spinner-border spinner-border-sm"
//                                     style={{ 
//                                       color: item.accentColor,
//                                       width: "0.8rem",
//                                       height: "0.8rem"
//                                     }}
//                                   ></div>
//                                 ) : stats.error ? (
//                                   "Erreur"
//                                 ) : (
//                                   formatNumber(item.montantTotal)
//                                 )}
//                               </span>
//                             </div>

//                             {/* Ligne 3: Montant payé/reçu */}
//                             <div>
//                               <span
//                                 className="text-muted"
//                                 style={{
//                                   fontSize: "0.75rem",
//                                   fontWeight: "400",
//                                 }}
//                               >
//                                 {type === "depenses" ? "Payé : " : "Reçu : "}
//                                 <span
//                                   className="text-muted"
//                                   style={{
//                                     fontSize: "0.8rem",
//                                     fontWeight: "500",
//                                   }}
//                                 >
//                                   {stats.loading ? (
//                                     <div
//                                       className="spinner-border spinner-border-sm"
//                                       style={{ 
//                                         color: item.accentColor,
//                                         width: "0.6rem",
//                                         height: "0.6rem"
//                                       }}
//                                     ></div>
//                                   ) : stats.error ? (
//                                     "Erreur"
//                                   ) : (
//                                     formatNumber(item.montantPayeRecu)
//                                   )}
//                                 </span>
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </Col>
//                   ))}
//                 </Row>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </React.Fragment>
//   );
// };

// export default CategoryStatsDashboard;


import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../pages/APIKey/ApiKey";
import depenseTypes from "../../common/data/depenseTypes";
import revenuTypes from "../../common/data/revenuTypes";

const CategoryStatsDashboard = ({
  type = "depenses", // "depenses" ou "revenus"
}) => {
  const [stats, setStats] = useState({
    categories: [],
    loading: true,
    error: null,
  });

  const { userProfile, token } = useProfile();

  // Fonction pour formater les nombres en milliers
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  // Définition des 5 catégories avec mapping vers les catégories API
  const getCategoryConfig = () => {
    if (type === "depenses") {
      // Utilisation directe de depenseTypes
      const depenseCategories = Object.entries(depenseTypes.categories);
      
      // Prendre les 5 premières catégories ou toutes si moins de 5
      const selectedCategories = depenseCategories.slice(0, 5);
      
      return selectedCategories.map(([categoryName, subCategories], index) => {
        // Mapping des icônes selon le nom de la catégorie
        let icon = "ri-line-chart-line"; // icône par défaut
        
        if (categoryName.includes("exploitation") || categoryName.includes("Exploitation")) {
          icon = "ri-building-line";
        } else if (categoryName.includes("marketing") || categoryName.includes("Marketing") || categoryName.includes("communication") || categoryName.includes("Communication")) {
          icon = "ri-megaphone-line";
        } else if (categoryName.includes("personnel") || categoryName.includes("Personnel")) {
          icon = "ri-team-line";
        } else if (categoryName.includes("investissement") || categoryName.includes("Investissement")) {
          icon = "ri-line-chart-line";
        } else if (categoryName.includes("financier") || categoryName.includes("Financier")) {
          icon = "ri-bank-line";
        }

        return {
          name: categoryName,
          icon: icon,
          apiCategories: subCategories // Utilise directement les sous-catégories du fichier
        };
      });
    } else {
      // Utilisation directe de revenuTypes
      const revenuCategories = Object.entries(revenuTypes.categories);
      
      // Prendre les 5 premières catégories ou toutes si moins de 5
      const selectedCategories = revenuCategories.slice(0, 5);
      
      return selectedCategories.map(([categoryName, subCategories], index) => {
        // Extraction des valeurs API depuis les sous-catégories
        const apiCategories = subCategories.map(item => 
          typeof item === 'object' ? item.value : item
        );

        // Mapping des icônes selon le nom de la catégorie
        let icon = "ri-money-dollar-circle-line"; // icône par défaut
        
        if (categoryName.includes("exploitation") || categoryName.includes("Exploitation")) {
          icon = "ri-store-2-line";
        } else if (categoryName.includes("annexe") || categoryName.includes("Annexe")) {
          icon = "ri-money-dollar-circle-line";
        } else if (categoryName.includes("financier") || categoryName.includes("Financier")) {
          icon = "ri-line-chart-line";
        } else if (categoryName.includes("exceptionnel") || categoryName.includes("Exceptionnel")) {
          icon = "ri-gift-line";
        } else if (categoryName.includes("intellectuelle") || categoryName.includes("Intellectuelle")) {
          icon = "ri-copyright-line";
        }

        return {
          name: categoryName,
          icon: icon,
          apiCategories: apiCategories
        };
      });
    }
  };

  // Couleurs pour chaque bloc
  const getCategoryColors = () => {
    return [
      { accent: "#014a92" },
      { accent: "#1fa5f3" },
      { accent: "#6dbd1c" },
      { accent: "#f06548" },
      { accent: "#8950fc" },
    ];
  };

  // Fonction pour récupérer les données statistiques par catégorie
  const fetchCategoryStats = async () => {
    if (!token || !userProfile) {
      console.log("En attente du token ou du profil utilisateur...");
      return;
    }

    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      const endpoint =
        type === "depenses"
          ? `${BaseUrl}/facture/statistiques/depenses-par-categorie/`
          : `${BaseUrl}/facture/statistiques/revenus-par-categorie/`;

      console.log(`📊 Chargement des ${type} depuis:`, endpoint);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const apiData = await response.json();
      console.log(`✅ Données ${type} reçues de l'API:`, apiData);

      const categoryConfig = getCategoryConfig();
      const categoryColors = getCategoryColors();

      const apiDataMap = {};
      apiData.forEach((item) => {
        apiDataMap[item.categorie] = item;
      });

      console.log("🗺️ Map des données API:", apiDataMap);

      const transformedData = categoryConfig.map((config, index) => {
        const isDepense = type === "depenses";
        
        let montantTotal = 0;
        let montantPayeRecu = 0;

        config.apiCategories.forEach(apiCategory => {
          const apiItem = apiDataMap[apiCategory];
          if (apiItem) {
            montantTotal += apiItem.montant_total || 0;
            montantPayeRecu += isDepense 
              ? apiItem.montant_paye || 0 
              : apiItem.montant_recu || 0;
          }
        });

        const colors = categoryColors[index % categoryColors.length];

        const categoryData = {
          id: index + 1,
          categorie: config.name,
          montantTotal,
          montantPayeRecu,
          icon: config.icon,
          apiCategories: config.apiCategories,
          accentColor: colors.accent,
          hasData: montantTotal > 0
        };

        return categoryData;
      });

      setStats({
        categories: transformedData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(
        `❌ Erreur lors du chargement des statistiques ${type}:`,
        error
      );

      const categoryConfig = getCategoryConfig();
      const categoryColors = getCategoryColors();

      const errorData = categoryConfig.map((config, index) => {
        const colors = categoryColors[index % categoryColors.length];

        return {
          id: index + 1,
          categorie: config.name,
          montantTotal: 0,
          montantPayeRecu: 0,
          icon: config.icon,
          apiCategories: config.apiCategories,
          accentColor: colors.accent,
          hasData: false
        };
      });

      setStats({
        categories: errorData,
        loading: false,
        error: error.message || "Erreur lors du chargement des données",
      });
    }
  };

  useEffect(() => {
    if (token && userProfile) {
      fetchCategoryStats();
    }
  }, [token, userProfile, type]);

  const totalMontant = stats.categories.reduce((sum, item) => sum + item.montantTotal, 0);
  const categoriesAvecDonnees = stats.categories.filter(item => item.montantTotal > 0).length;

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card
            className="crm-widget"
            style={{
              border: "none",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardBody
              className="p-0"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              {/* Bloc unique avec toutes les statistiques côte à côte */}
              <div
                className="card mb-0"
                style={{
                  boxShadow: "0 1px 0 rgba(56, 65, 74, 0.10)",
                  borderRadius: "20px",
                  border: "1px solid var(--vz-border-color)",
                  padding: "0 15px",
                }}
              >
                <Row className="row-cols-xxl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 g-3">
                  {(stats.categories || []).map((item, key) => (
                    <Col
                      key={key}
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      <div
                        className="h-100 card-body"
                        style={{
                          borderRadius: "12px",
                          minHeight: "110px",
                        }}
                      >
                        {/* Conteneur principal avec icône à gauche et texte à droite */}
                        <div className="d-flex h-100">
                          {/* Icône dans un cercle - AGRANDIE */}
                          <div
                            className="d-flex align-items-center justify-content-center me-2 mt-4"
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: `${item.accentColor}15`,
                              flexShrink: 0
                            }}
                          >
                            <i
                              className={item.icon}
                              style={{
                                color: item.accentColor,
                                fontSize: '1.6rem',
                                lineHeight: 1,
                              }}
                            ></i>
                          </div>
                          
                          {/* Conteneur des textes alignés verticalement */}
                          <div className="d-flex flex-column justify-content-center flex-grow-1">
                            {/* Ligne 1: Catégorie */}
                            <div className="mb-0">
                              <span
                                className="text-muted"
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "500",
                                }}
                              >
                                {item.categorie}
                              </span>
                            </div>

                            {/* Ligne 2: Montant total */}
                            <div className="mb-0">
                              <span
                                style={{
                                  fontSize: "1.1rem",
                                  fontWeight: "700",
                                  lineHeight: "1.2",
                                }}
                              >
                                {stats.loading ? (
                                  <div
                                    className="spinner-border spinner-border-sm"
                                    style={{ 
                                      color: item.accentColor,
                                      width: "0.8rem",
                                      height: "0.8rem"
                                    }}
                                  ></div>
                                ) : stats.error ? (
                                  "Erreur"
                                ) : (
                                  formatNumber(item.montantTotal)
                                )}
                              </span>
                            </div>

                            {/* Ligne 3: Montant payé/reçu */}
                            <div>
                              <span
                                className="text-muted"
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "400",
                                }}
                              >
                                {type === "depenses" ? "Payé : " : "Reçu : "}
                                <span
                                  className="text-muted"
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  {stats.loading ? (
                                    <div
                                      className="spinner-border spinner-border-sm"
                                      style={{ 
                                        color: item.accentColor,
                                        width: "0.6rem",
                                        height: "0.6rem"
                                      }}
                                    ></div>
                                  ) : stats.error ? (
                                    "Erreur"
                                  ) : (
                                    formatNumber(item.montantPayeRecu)
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CategoryStatsDashboard;