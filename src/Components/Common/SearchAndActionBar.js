// SearchAndActionBar.js - Version améliorée
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../Components/Hooks/UserHooks";

const SearchAndActionBar = ({
  // Props pour la recherche
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  showSearch = true,
  
  // Props pour le bouton d'ajout
  onAddClick,
  addButtonText = "Ajouter",
  addButtonIcon = "ri-file-add-line",
  addButtonClass = "btn btn-info",
  showAddButton = true,
  addButtonLink,
  
  // Props pour le badge d'information
  badgeContent, // Contenu du badge (texte ou composant)
  badgeColor = "info", // Couleur du badge
  badgeIcon, // Icône optionnelle pour le badge
  showBadge = false,
  
  // NOUVEAU : Props pour le style global
  className = "",
  style = { borderRadius: "70px" },
  
  // Props pour les permissions spécifiques
  requiredAddPermission = null,
  requiredExportPermission = null,
  requiredCustomPermissions = {},
  
  // Props pour les boutons personnalisés additionnels
  customButtons = [],
  
  // Props pour le style
  cardStyle = { borderRadius: "70px" },
  headerStyle = { borderRadius: "70px", borderBottom: "none" },
  inputStyle = { borderRadius: "20px" },
  buttonStyle = { borderRadius: "20px" },
}) => {
  const { userProfile, token } = useProfile();
  const [userPermissions, setUserPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // Fonction pour récupérer les permissions
  useEffect(() => {
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

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const permissionsData = await response.json();
        setUserPermissions(permissionsData);
        
      } catch (error) {
        console.error(" Erreur lors de la récupération des permissions:", error);
        setUserPermissions({ is_admin: false, permissions: [] });
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [userProfile?.id, token]);

  // Fonction pour vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permissionCode) => {
    if (permissionsLoading || !userPermissions) {
      return false;
    }

    // Si l'utilisateur est admin, il a toutes les permissions
    if (userPermissions.is_admin === true) {
      return true;
    }

    // Si pas de permission spécifique demandée, autoriser par défaut
    if (!permissionCode) {
      return true;
    }

    // Vérifier dans le tableau des permissions
    return userPermissions.permissions.includes(permissionCode);
  };

  // Fonction pour déterminer si le bouton Ajouter doit être affiché
  const shouldShowAddButton = () => {
    if (!showAddButton) return false;
    if (permissionsLoading) return false;
    return hasPermission(requiredAddPermission);
  };

  // Fonction pour déterminer si un bouton personnalisé doit être affiché
  const shouldShowCustomButton = (buttonIndex) => {
    const requiredPermission = requiredCustomPermissions[buttonIndex];
    return hasPermission(requiredPermission);
  };

  // Indicateur de chargement supprimé pour éviter le flash de chargement
  // if (permissionsLoading) {
  //   return (...);
  // }

  return (
    <div className={`card ${className}`} style={style}>
      <div className="card-body p-3">
        <div className="row align-items-center justify-content-between">
          {/* Section GAUCHE : Recherche */}
          {showSearch && (
            <div className="col-md-4">
              <div className="search-box">
                <input
                  type="text"
                  className="form-control search"
                  placeholder={searchPlaceholder}
                  style={inputStyle}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          )}
          
          {/* Section CENTRE : Badge d'information */}
          <div className="col-md-4 text-center">
            {showBadge && badgeContent && (
              <div className="badge-container d-inline-block">
                <span className={`badge bg-${badgeColor} d-inline-flex align-items-center`} 
                      style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '0.9rem' }}>
                  {badgeIcon && <i className={`${badgeIcon} me-2`}></i>}
                  {badgeContent}
                </span>
              </div>
            )}
          </div>
          
          {/* Section DROITE : Boutons d'action */}
          <div className="col-md-4 text-end">
            <div className="hstack gap-2 justify-content-end">
              {/* Boutons personnalisés avec permissions */}
              {customButtons.map((button, index) => (
                shouldShowCustomButton(index) && (
                  <button
                    key={index}
                    className={button.className || "btn btn-primary"}
                    style={{ ...buttonStyle, ...(button.style || {}) }}
                    onClick={button.onClick}
                    disabled={button.disabled}
                    title={button.title}
                  >
                    {button.icon && (
                      <i className={`${button.icon} me-1 align-bottom`}></i>
                    )}
                    {button.text}
                  </button>
                )
              ))}

              {/* Bouton d'ajout */}
              {shouldShowAddButton() && (
                <div>
                  {addButtonLink ? (
                    <Link
                      to={addButtonLink}
                      className={`${addButtonClass} d-inline-flex align-items-center`}
                      style={{ ...buttonStyle, textDecoration: 'none' }}
                    >
                      <i className={`${addButtonIcon} me-1 align-bottom`}></i>
                      {addButtonText}
                    </Link>
                  ) : (
                    <button
                      className={`${addButtonClass} d-inline-flex align-items-center`}
                      style={{ ...buttonStyle }}
                      onClick={onAddClick}
                    >
                      <i className={`${addButtonIcon} me-1 align-bottom`}></i>
                      {addButtonText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndActionBar;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useProfile } from "../../Components/Hooks/UserHooks";

// const SearchAndActionBar = ({
//   // Props pour la recherche
//   searchTerm,
//   onSearchChange,
//   searchPlaceholder = "Rechercher...",
//   showSearch = true,
  
//   // Props pour le bouton d'ajout
//   onAddClick,
//   addButtonText = "Ajouter",
//   addButtonIcon = "ri-file-add-line",
//   addButtonClass = "btn btn-info add-btn",
//   showAddButton = true,
//   addButtonLink,
  
//   // Props pour le bouton d'export
//   onExportClick,
//   exportButtonText = "Exporter",
//   exportButtonIcon = "ri-file-upload-line",
//   exportButtonClass = "btn btn-success add-btn",
//   showExportButton = true,
  
//   // NOUVEAU : Props pour les permissions spécifiques
//   requiredAddPermission = null,    // Permission requise pour le bouton Ajouter
//   requiredExportPermission = null, // Permission requise pour le bouton Exporter
//   requiredCustomPermissions = {},  // Permissions pour les boutons personnalisés {index: 'permission_code'}
  
//   // Props pour les boutons personnalisés additionnels
//   customButtons = [],
  
//   // Props pour le style
//   cardStyle = { borderRadius: "70px" },
//   headerStyle = { borderRadius: "70px", borderBottom: "none" },
//   inputStyle = { borderRadius: "20px" },
//   buttonStyle = { borderRadius: "20px" },
// }) => {
//   const { userProfile, token } = useProfile();
//   const [userPermissions, setUserPermissions] = useState(null);
//   const [permissionsLoading, setPermissionsLoading] = useState(true);

//   // Fonction pour récupérer les permissions
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       if (!userProfile?.id || !token) {
//         setPermissionsLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `https://inawoapiv3.inawo.pro/utilisateurs/userspermission/${userProfile.id}/`,
//           {
//             method: "GET",
//             headers: {
//               "Authorization": `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Erreur HTTP: ${response.status}`);
//         }

//         const permissionsData = await response.json();
//         setUserPermissions(permissionsData);
        
//       } catch (error) {
//         console.error(" Erreur lors de la récupération des permissions:", error);
//         setUserPermissions({ is_admin: false, permissions: [] });
//       } finally {
//         setPermissionsLoading(false);
//       }
//     };

//     fetchUserPermissions();
//   }, [userProfile?.id, token]);

//   // Fonction pour vérifier si l'utilisateur a une permission spécifique
//   const hasPermission = (permissionCode) => {
//     if (permissionsLoading || !userPermissions) {
//       return false;
//     }

//     // Si l'utilisateur est admin, il a toutes les permissions
//     if (userPermissions.is_admin === true) {
//       return true;
//     }

//     // Si pas de permission spécifique demandée, autoriser par défaut
//     if (!permissionCode) {
//       return true;
//     }

//     // Vérifier dans le tableau des permissions
//     return userPermissions.permissions.includes(permissionCode);
//   };

//   // Fonction pour déterminer si le bouton Ajouter doit être affiché
//   const shouldShowAddButton = () => {
//     if (!showAddButton) return false;
//     if (permissionsLoading) return false;
//     return hasPermission(requiredAddPermission);
//   };

//   // Fonction pour déterminer si le bouton Exporter doit être affiché
//   const shouldShowExportButton = () => {
//     if (!showExportButton) return false;
//     if (permissionsLoading) return false;
//     if (!onExportClick) return false;
//     return hasPermission(requiredExportPermission);
//   };

//   // Fonction pour déterminer si un bouton personnalisé doit être affiché
//   const shouldShowCustomButton = (buttonIndex) => {
//     const requiredPermission = requiredCustomPermissions[buttonIndex];
//     return hasPermission(requiredPermission);
//   };

//   // Afficher un indicateur de chargement
//   if (permissionsLoading) {
//     return (
//       <div className="col-lg-12">
//         <div className="card" style={cardStyle}>
//           <div className="card-header" style={headerStyle}>
//             <div className="d-flex align-items-center justify-content-between">
//               {showSearch && (
//                 <div className="col-md-4">
//                   <div className="search-box">
//                     <input
//                       type="text"
//                       className="form-control search"
//                       placeholder={searchPlaceholder}
//                       style={inputStyle}
//                       disabled
//                     />
//                     <i className="ri-search-line search-icon"></i>
//                   </div>
//                 </div>
//               )}
//               <div className="text-muted">
//                 <i className="ri-loader-4-line spin me-2"></i>
//                 Chargement des permissions...
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="col-lg-12">
//       <div className="card" style={cardStyle}>
//         <div className="card-header" style={headerStyle}>
//           <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
//             {/* Section de recherche */}
//             {showSearch && (
//               <div className="col-md-4">
//                 <div className="search-box">
//                   <input
//                     type="text"
//                     className="form-control search"
//                     placeholder={searchPlaceholder}
//                     style={inputStyle}
//                     value={searchTerm}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                   />
//                   <i className="ri-search-line search-icon"></i>
//                 </div>
//               </div>
//             )}

//             {/* Section des boutons d'action */}
//             <div className="flex-shrink-0">
//               <div className="hstack text-nowrap gap-1">
//                 {/* Bouton d'ajout - Conditionné par les permissions */}
//                 {shouldShowAddButton() && (
//                   <div className="flex-grow-1">
//                     {addButtonLink ? (
//                       <Link
//                         to={addButtonLink}
//                         className={addButtonClass}
//                         style={{ ...buttonStyle, textDecoration: 'none', display: 'inline-block' }}
//                       >
//                         <i className={`${addButtonIcon} me-1 align-bottom`}></i>
//                         {addButtonText}
//                       </Link>
//                     ) : (
//                       <button
//                         className={addButtonClass}
//                         style={{ ...buttonStyle }}
//                         onClick={onAddClick}
//                       >
//                         <i className={`${addButtonIcon} me-1 align-bottom`}></i>
//                         {addButtonText}
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {/* Boutons personnalisés avec permissions */}
//                 {customButtons.map((button, index) => (
//                   shouldShowCustomButton(index) && (
//                     <button
//                       key={index}
//                       className={button.className || "btn btn-primary"}
//                       style={{ ...buttonStyle, ...(button.style || {}) }}
//                       onClick={button.onClick}
//                       disabled={button.disabled}
//                       title={button.title}
//                     >
//                       {button.icon && (
//                         <i className={`${button.icon} me-1 align-bottom`}></i>
//                       )}
//                       {button.text}
//                     </button>
//                   )
//                 ))}

//                 {/* Bouton d'export - Conditionné par les permissions */}
//                 {shouldShowExportButton() && (
//                   <button
//                     className={exportButtonClass}
//                     type="button"
//                     onClick={onExportClick}
//                     style={{ ...buttonStyle, overflow: "hidden" }}
//                   >
//                     <i className={`${exportButtonIcon} me-1 align-bottom`}></i>
//                     {exportButtonText}
//                   </button>
//                 )}

               
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchAndActionBar;