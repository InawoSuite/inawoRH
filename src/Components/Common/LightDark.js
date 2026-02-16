// import React, { useEffect, useState } from 'react';

// //constants
// import { layoutModeTypes } from "../../Components/constants/layout";

// const LightDark = ( { layoutMode, onChangeLayoutMode } ) =>
// {

//     const mode = layoutMode === layoutModeTypes[ 'DARKMODE' ] ? layoutModeTypes[ 'LIGHTMODE' ] : layoutModeTypes[ 'DARKMODE' ];

//     const [ theme, setTheme ] = useState(
//         document.documentElement.getAttribute( "data-bs-theme" ) || "light"
//     );

//     useEffect( () =>
//     {
//         // Mettre à jour le thème quand l'attribut data-bs-theme change
//         const observer = new MutationObserver( ( mutations ) =>
//         {
//             mutations.forEach( ( mutation ) =>
//             {
//                 if ( mutation.attributeName === "data-bs-theme" )
//                 {
//                     setTheme( document.documentElement.getAttribute( "data-bs-theme" ) );
//                 }
//             } );
//         } );

//         observer.observe( document.documentElement, {
//             attributes: true,
//             attributeFilter: [ "data-bs-theme" ],
//         } );

//         return () => observer.disconnect();
//     }, [] );

//     return (
//         <div className="ms-1 header-item d-none d-sm-flex">
//             <button
//                 onClick={ () => onChangeLayoutMode( mode ) }
//                 type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode">
//                 <i className='bx bx-moon fs-22'
//                     style={ {
//                         color: theme === "dark" ? "white" : "black",
//                         color: theme === "light" ? "#62748e" : "#fff",
//                     } }
//                 ></i>
//             </button>
//         </div>
//     );
// };

// export default LightDark;





import React, { useEffect, useState } from 'react';

//constants
import { layoutModeTypes } from "../../Components/constants/layout";

const LightDark = ({ layoutMode, onChangeLayoutMode }) => {
    const mode = layoutMode === layoutModeTypes['DARKMODE'] ? layoutModeTypes['LIGHTMODE'] : layoutModeTypes['DARKMODE'];

    const [theme, setTheme] = useState(
        document.documentElement.getAttribute("data-bs-theme") || "light"
    );

    // Détection automatique du mode sombre du navigateur au premier chargement
    useEffect(() => {
        const browserPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = document.documentElement.getAttribute("data-bs-theme");

        // Si aucun thème n'est défini, appliquer la préférence du navigateur
        if (!currentTheme || !localStorage.getItem('theme-preference')) {
            const preferredMode = browserPrefersDark ? layoutModeTypes['DARKMODE'] : layoutModeTypes['LIGHTMODE'];
            onChangeLayoutMode(preferredMode);
        }
    }, [onChangeLayoutMode]);

    // Écouter les changements du mode du navigateur en temps réel
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Ne changer automatiquement que si l'utilisateur n'a pas déjà défini une préférence manuelle
            if (!localStorage.getItem('theme-preference')) {
                const newMode = e.matches ? layoutModeTypes['DARKMODE'] : layoutModeTypes['LIGHTMODE'];
                onChangeLayoutMode(newMode);
            }
        };

        // Écouter les changements
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [onChangeLayoutMode]);

    // Observer les changements de l'attribut data-bs-theme
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "data-bs-theme") {
                    setTheme(document.documentElement.getAttribute("data-bs-theme"));
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-bs-theme"],
        });

        return () => observer.disconnect();
    }, []);

    // Fonction pour gérer le clic sur le bouton
    const handleThemeToggle = () => {
        // Enregistrer que l'utilisateur a fait un choix manuel
        localStorage.setItem('theme-preference', 'manual');
        onChangeLayoutMode(mode);
    };

    return (
        <div className="ms-1 header-item d-none d-sm-flex">
            <button
                onClick={handleThemeToggle}
                type="button" 
                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode"
            >
                <i 
                    className='bx bx-moon fs-22'
                    style={{
                        color: theme === "dark" ? "#fff" : "#62748e",
                    }}
                ></i>
            </button>
        </div>
    );
};

export default LightDark;