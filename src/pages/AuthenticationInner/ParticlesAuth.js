 import React from 'react';
import withRouter from '../../Components/Common/withRouter';

const ParticlesAuth = ({ children }) => {
    return (
        <React.Fragment>
            <div className="auth-page-wrapper">
                <div className="auth-one-bg-position auth-one-bg" id="auth-particles">

                    <div className=""></div>

                    {/* <div className="shape">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
                        </svg>
                    </div> */}
                    {/* <div id="tsparticles">
                    <canvas
                    style={{
                        width: '100%',
                        height: '100vh',
                        position: 'fixed',
                        zIndex: 0, // envoie-le derrière
                        top: 0,
                        left: 0,
                        pointerEvents: 'none', // facultatif si c’est juste un effet visuel
                        backgroundColor: 'transparent', // très important !
                    }}
                    />

                    </div> */}

                    
                    {children}

                </div>
            </div>
        </React.Fragment>
    );
};

export default withRouter(ParticlesAuth);