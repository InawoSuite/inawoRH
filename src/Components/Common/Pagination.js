// import React from "react";
// import { Link } from "react-router-dom";

// const Pagination = ({ 
//   data, 
//   currentPage, 
//   setCurrentPage, 
//   perPageData,
//   alwaysShow = false, // Nouveau prop pour forcer l'affichage
//   showInfo = true // Afficher les informations "Affichage 1-10 de 25"
// }) => {
//   const totalPages = Math.ceil(data?.length / perPageData);
//   const totalItems = data?.length || 0;
  
//   // Calculer les indices pour l'affichage des informations
//   const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPageData + 1;
//   const endItem = Math.min(currentPage * perPageData, totalItems);
  
//   const handleClick = (page) => {
//     setCurrentPage(page);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Générer les numéros de page à afficher
//   const getPageNumbers = () => {
//     const pageNumbers = [];
    
//     // Pour de petites listes, afficher toutes les pages
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//       return pageNumbers;
//     }
    
//     // Pour des listes plus importantes, utiliser la logique avec des ellipses
//     pageNumbers.push(1);
    
//     let startPage = Math.max(2, currentPage - 1);
//     let endPage = Math.min(totalPages - 1, currentPage + 1);
    
//     if (currentPage <= 3) {
//       endPage = Math.min(4, totalPages - 1);
//     }
    
//     if (currentPage >= totalPages - 2) {
//       startPage = Math.max(2, totalPages - 3);
//     }
    
//     if (startPage > 2) {
//       pageNumbers.push('...');
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       if (i !== 1 && i !== totalPages) {
//         pageNumbers.push(i);
//       }
//     }
    
//     if (endPage < totalPages - 1) {
//       pageNumbers.push('...');
//     }
    
//     if (totalPages > 1) {
//       pageNumbers.push(totalPages);
//     }
    
//     return pageNumbers;
//   };

//   // Condition d'affichage modifiée
//   if (!alwaysShow && totalPages <= 1) return null;

//   // Si alwaysShow est true mais qu'il n'y a pas de données, afficher une pagination vide
//   const displayPages = totalPages > 0 ? getPageNumbers() : [1];
//   const effectiveCurrentPage = totalPages > 0 ? currentPage : 1;
//   const effectiveTotalPages = Math.max(1, totalPages);

//   return (
//     <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
//       {/* Informations sur les éléments affichés */}
//       {showInfo && (
//         <div className="mb-2 mb-sm-0">
//           {/* <span className="text-muted">
//             {totalItems === 0 
//               ? "Aucun élément trouvé"
//               : `Affichage ${startItem}-${endItem} de ${totalItems} éléments`
//             }
//           </span> */}
//         </div>
//       )}
      
//       {/* Navigation de pagination */}
//       <nav aria-label="Page navigation">
//         <ul className="pagination pagination-separated pagination-md mb-0">
//           {/* Bouton Précédent */}
//           <li className={`page-item ${effectiveCurrentPage === 1 ? 'disabled' : ''}`}>
//             <Link 
//               className="page-link" 
//               to="#"
//               style={{ borderRadius: 20 }}
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (totalPages > 0) handlePrevPage();
//               }}
//               aria-disabled={effectiveCurrentPage === 1}
//             >
//               Précédent
//             </Link>
//           </li>
          
//           {/* Numéros de page */}
//           {displayPages.map((pageNumber, index) => (
//             <li 
//               key={index} 
//               className={`page-item ${pageNumber === '...' ? 'disabled' : ''} ${effectiveCurrentPage === pageNumber ? 'active' : ''}`}
//             >
//               {pageNumber === '...' ? (
//                 <span className="page-link">...</span>
//               ) : (
//                 <Link 
//                   className="page-link rounded-circle align-item-center align-content-center display-flex" 
//                    style={{
//                           width: "30px",
//                           height: "30px",
//                         //   padding: 0,
//                         //   margin: 0,
//                         }}
//                   to="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (totalPages > 0) handleClick(pageNumber);
//                   }}
//                 >
//                   {pageNumber}
//                 </Link>
//               )}
//             </li>
//           ))}
          
//           {/* Bouton Suivant */}
//           <li className={`page-item ${effectiveCurrentPage === effectiveTotalPages ? 'disabled' : ''}`}>
//             <Link 
//               className="page-link" 
//               to="#"
//               style={{ borderRadius: 20 }}
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (totalPages > 0) handleNextPage();
//               }}
//               aria-disabled={effectiveCurrentPage === effectiveTotalPages}
//             >
//               Suivant
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Pagination;


import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Ajouter cette importation

const Pagination = ({ 
  data, 
  currentPage, 
  setCurrentPage, 
  perPageData,
  alwaysShow = false,
  showInfo = true
}) => {
  const { t } = useTranslation(); // Utiliser le hook de traduction
  
  const totalPages = Math.ceil(data?.length / perPageData);
  const totalItems = data?.length || 0;
  
  // Calculer les indices pour l'affichage
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPageData + 1;
  const endItem = Math.min(currentPage * perPageData, totalItems);
  
  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    pageNumbers.push(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    }
    
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Condition d'affichage
  if (!alwaysShow && totalPages <= 1) return null;

  // Si alwaysShow est true mais qu'il n'y a pas de données
  const displayPages = totalPages > 0 ? getPageNumbers() : [1];
  const effectiveCurrentPage = totalPages > 0 ? currentPage : 1;
  const effectiveTotalPages = Math.max(1, totalPages);

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
      {/* Informations sur les éléments affichés */}
      {showInfo && (
        <div className="mb-2 mb-sm-0">
          {/* <span className="text-muted">
            {totalItems === 0 
              ? t("Aucun élément trouvé")
              : t("Affichage {{start}}-{{end}} de {{total}} éléments", {
                  start: startItem,
                  end: endItem,
                  total: totalItems
                })
            }
          </span> */}
        </div>
      )}
      
      {/* Navigation de pagination */}
      <nav aria-label="Page navigation">
        <ul className="pagination pagination-separated pagination-md mb-0">
          {/* Bouton Précédent */}
          <li className={`page-item ${effectiveCurrentPage === 1 ? 'disabled' : ''}`}>
            <Link 
              className="page-link" 
              to="#"
              style={{ borderRadius: 20 }}
              onClick={(e) => {
                e.preventDefault();
                if (totalPages > 0) handlePrevPage();
              }}
              aria-disabled={effectiveCurrentPage === 1}
            >
              {t("Précédent")}
            </Link>
          </li>
          
          {/* Numéros de page */}
          {displayPages.map((pageNumber, index) => (
            <li 
              key={index} 
              className={`page-item ${pageNumber === '...' ? 'disabled' : ''} ${effectiveCurrentPage === pageNumber ? 'active' : ''}`}
            >
              {pageNumber === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <Link 
                  className="page-link rounded-circle d-flex align-items-center justify-content-center" 
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (totalPages > 0) handleClick(pageNumber);
                  }}
                >
                  {pageNumber}
                </Link>
              )}
            </li>
          ))}
          
          {/* Bouton Suivant */}
          <li className={`page-item ${effectiveCurrentPage === effectiveTotalPages ? 'disabled' : ''}`}>
            <Link 
              className="page-link" 
              to="#"
              style={{ borderRadius: 20 }}
              onClick={(e) => {
                e.preventDefault();
                if (totalPages > 0) handleNextPage();
              }}
              aria-disabled={effectiveCurrentPage === effectiveTotalPages}
            >
              {t("Suivant")}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;