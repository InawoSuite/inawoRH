import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ajout de l'import


{/* <Route path="/support-tickets/list-view" element={<ListView />} /> */}
  
const NewChat = () =>
{
    /*
    mode
    */
    const [ isFullScreenMode, setIsFullScreenMode ] = useState( true );

    const [ theme, setTheme ] = useState(
        document.documentElement.getAttribute( "data-bs-theme" ) || "light"
    );

    const navigate = useNavigate(); // Initialisation du hook

    useEffect( () =>
    {
        // Mettre à jour le thème quand l'attribut data-bs-theme change
        const observer = new MutationObserver( ( mutations ) =>
        {
            mutations.forEach( ( mutation ) =>
            {
                if ( mutation.attributeName === "data-bs-theme" )
                {
                    setTheme( document.documentElement.getAttribute( "data-bs-theme" ) );
                }
            } );
        } );

        observer.observe( document.documentElement, {
            attributes: true,
            attributeFilter: [ "data-bs-theme" ],
        } );

        return () => observer.disconnect();
    }, [] );
    /*
    full screen
    */
    return (
        <React.Fragment>
            <div className="ms-1 header-item d-none d-sm-flex">
                <button
                    type="button"
                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                    onClick={ () => navigate('/:entreprise/supportClient') }
                >
                    <i className={ "ri-message-3-line  fs-22" }
                        style={ {
                            color: theme === "dark" ? "white" : "black",
                            color: theme === "light" ? "#62748e" : "#fff",
                        } }
                    ></i>
                </button>
            </div>
        </React.Fragment>
    );
};

export default NewChat;