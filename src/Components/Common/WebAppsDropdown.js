import React, { useState, useEffect } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';

//import images
import github from "../../assets/images/brands/github.png";
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

import vente from "../../assets/images/brands/vente.png";
import recruiment from "../../assets/images/brands/recruiment.png";
import stock from "../../assets/images/brands/stock.png";
import globale from "../../assets/images/brands/globale.png";
import { Link } from 'react-router-dom';

const WebAppsDropdown = () =>
{
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

    const [ isWebAppDropdown, setIsWebAppDropdown ] = useState( false );
    const toggleWebAppDropdown = () =>
    {
        setIsWebAppDropdown( !isWebAppDropdown );
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={ isWebAppDropdown } toggle={ toggleWebAppDropdown } className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle tag="button" type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <i className='bx bx-category-alt fs-22'
                        style={ {
                            color: theme === "dark" ? "white" : "black",
                            color: theme === "light" ? "#62748e" : "#fff",
                        } }
                    ></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg p-0 " >
                    <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 fw-semibold fs-15"> Suite Inawo </h6>
                            </Col>
                            {/* <div className="col-auto">
                                <Link to="#" className="btn btn-sm btn-soft-info">
                                    <div className="d-flex p-1 align-items-center justify-content-center">
                                        <span className='p-2'>View All Apps</span>
                                        <i className="ri-arrow-right-s-line"></i>
                                    </div>
                                </Link>
                            </div> */}
                        </Row>
                    </div>

                    <div className="p-2">
                        <div className="row g-0">
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={ vente } alt="Github" />
                                    <span>Vente</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={ stock } alt="bitbucket" />
                                    <span>Stock</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={ recruiment } alt="dribbble" />
                                    <span>Recrue</span>
                                </Link>
                            </Col>

                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={ globale } alt="dropbox" />
                                    <span>Global</span>
                                </Link>
                            </Col>
                        </div>

                        <div className="row g-0">
                            
                            {/* <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={ mail_chimp } alt="mail_chimp" />
                                    <span>Mail Chimp</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={ slack } alt="slack" />
                                    <span>Slack</span>
                                </Link>
                            </Col> */}
                        </div>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default WebAppsDropdown;