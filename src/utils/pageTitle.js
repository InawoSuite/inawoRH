// Fonction utilitaire pour définir le titre des pages
export const setPageTitle = (pageTitle) => {
    const baseTitle = "INAWO - Suite de Gestion";
    document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
};

// Fonction pour remplacer tous les titres de pages Velzon
export const replaceVelzonTitle = () => {
    // Observer pour détecter les changements de titre
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (document.title.includes("Velzon")) {
                const newTitle = document.title.replace("INAWO - Suite de Gestion");
                document.title = newTitle;
            }
        });
    });


    // Observer les changements dans le titre
    observer.observe(document.querySelector('title'), { 
        subtree: true, 
        characterData: true, 
        childList: true 
    });

    // Définir le titre initial
    if (document.title.includes("Velzon")) {
        document.title = document.title.replace("INAWO - Suite de Gestion");
    }
};


// // Fonction utilitaire pour définir le titre des pages
// export const setPageTitle = (pageTitle) => {
//     const baseTitle = "Inawo.";
//     // ← OPTION 1 : Ignorer pageTitle et toujours utiliser baseTitle
//     document.title = baseTitle;
    
//     // ← OPTION 2 : Garder la structure mais avec baseTitle par défaut
//     // document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
// };

// // Fonction améliorée pour remplacer tous les titres
// export const replaceVelzonTitle = () => {
//     const baseTitle = "INAWO - Suite de Gestion";
    
//     // Forcer le titre immédiatement
//     document.title = baseTitle;
    
//     // Observer pour détecter les changements de titre
//     const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//             // Si le titre n'est pas celui attendu, le corriger
//             if (document.title !== baseTitle) {
//                 console.log("🔧 Titre corrigé:", document.title, "→", baseTitle);
//                 document.title = baseTitle;
//             }
//         });
//     });

//     // Observer les changements dans le titre
//     const titleElement = document.querySelector('title');
//     if (titleElement) {
//         observer.observe(titleElement, { 
//             subtree: true, 
//             characterData: true, 
//             childList: true 
//         });
//     }
// };