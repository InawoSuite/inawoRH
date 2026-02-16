import React, { useEffect, useState } from 'react';

const FullScreenDropdown = () =>
{
    /*
    mode
    */
    const [ isFullScreenMode, setIsFullScreenMode ] = useState( true );

    /*
    full screen
    */
    const toggleFullscreen = () =>
    {
        let document = window.document;
        document.body.classList.add( "fullscreen-enable" );

        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        )
        {
            // current working methods
            setIsFullScreenMode( false );
            if ( document.documentElement.requestFullscreen )
            {
                document.documentElement.requestFullscreen();
            } else if ( document.documentElement.mozRequestFullScreen )
            {
                document.documentElement.mozRequestFullScreen();
            } else if ( document.documentElement.webkitRequestFullscreen )
            {
                document.documentElement.webkitRequestFullscreen();
            }
        } else
        {
            setIsFullScreenMode( true );
            if ( document.cancelFullScreen )
            {
                document.cancelFullScreen();
            } else if ( document.mozCancelFullScreen )
            {
                document.mozCancelFullScreen();
            } else if ( document.webkitCancelFullScreen )
            {
                document.webkitCancelFullScreen();
            }
        }

        // handle fullscreen exit
        const exitHandler = () =>
        {
            if (
                !document.webkitIsFullScreen &&
                !document.mozFullScreen &&
                !document.msFullscreenElement
            )
                document.body.classList.remove( "fullscreen-enable" );
        };
        document.addEventListener( "fullscreenchange", exitHandler );
        document.addEventListener( "webkitfullscreenchange", exitHandler );
        document.addEventListener( "mozfullscreenchange", exitHandler );
    };

    const [ theme, setTheme ] = useState(
        document.documentElement.getAttribute( "data-bs-theme" ) || "light"
    );

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

    return (
        <React.Fragment>
            <div className="ms-1 header-item d-none d-sm-flex">
                <button
                    onClick={ toggleFullscreen }
                    type="button"
                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                >
                    <i
                        className={ isFullScreenMode ?
                            'bx bx-fullscreen fs-22' :
                            "bx bx-exit-fullscreen fs-22"
                        }
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

export default FullScreenDropdown;