import React, { useEffect, useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

//import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import bell from "../../assets/images/svg/bell.svg";

//SimpleBar
import SimpleBar from "simplebar-react";
import { color } from 'echarts';
import axios from 'axios';
import { useProfile } from '../Hooks/UserHooks';
import { BaseUrl } from '../../pages/APIKey/ApiKey';

import userdummy from "../../assets/images/users/user-dummy-img.jpg";

const NotificationDropdown = () => {
    const { userProfile, token } = useProfile();
    const navigate = useNavigate();
    //Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };

    //Tab 
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };


    const [theme, setTheme] = useState(
        document.documentElement.getAttribute("data-bs-theme") || "light"
    );

    useEffect(() => {
        // Mettre à jour le thème quand l'attribut data-bs-theme change
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

    // Récupération du nombre de messages non lus avec backoff exponentiel
    const [nbmessage, setNbmessage] = useState(0);
    const [messageNonLus, setMessageNonLus] = useState([]);
    const [consecutiveErrors, setConsecutiveErrors] = useState(0);
    
    const messagesNonLus = async () => {
        try {
            // Vérification du token avant la requête
            if (!token) {
                console.warn('[NotificationDropdown] Token manquant, polling suspendu');
                return;
            }

            // ⚠️ NOTE: Les endpoints /administration/nbr_message_admin_non_lu/ et /administration/messages_admin_non_lu/ 
            // existent mais retournent actuellement des ERR_CONNECTION_TIMED_OUT car l'IP est bloquée par fail2ban.
            // Une fois l'IP débloquée, réactiver le code ci-dessous.
            
            // Pour l'instant, initialiser avec des données vides pour éviter les timeouts répétés
            setMessageNonLus([]);
            setNbmessage(0);
            setConsecutiveErrors(0);
            
            console.log('[NotificationDropdown] Notifications indisponibles (IP bloquée - en attente de déblocage)');
            
            // Code désactivé - À réactiver une fois endpoints disponibles:
            /*
            const response = await axios.get(`${BaseUrl}/administration/nbr_message_admin_non_lu/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000 // timeout 10s
            });

            const response2 = await fetch(`${BaseUrl}/administration/messages_admin_non_lu/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data2 = await response2.json();
            setMessageNonLus(data2.messages_non_lus);
            setNbmessage(response.nombre_messages_non_lus);
            setConsecutiveErrors(0);
            console.log('[NotificationDropdown] Messages récupérés avec succès');
            */
        } catch (error) {
            const newErrorCount = consecutiveErrors + 1;
            setConsecutiveErrors(newErrorCount);
            console.error(`[NotificationDropdown] Erreur requête (tentative ${newErrorCount}):`, error.message || error);
            
            if (newErrorCount >= 5) {
                console.warn('[NotificationDropdown] 5+ erreurs consécutives, polling réduira la fréquence');
            }
        }
    }
    
    useEffect(() => {
        if (!token) return;
        messagesNonLus();
    }, [token]);

    // Polling avec backoff exponentiel (initial 30s, max 5min)
    useEffect(() => {
        if (!token) return; // Ne pas poll si pas de token
        
        messagesNonLus();
        
        // Calculer l'intervalle basé sur les erreurs consécutives
        const baseInterval = 30000; // 30 secondes
        const backoffMultiplier = Math.min(Math.pow(2, Math.max(0, consecutiveErrors - 3)), 10); // cap à 10x
        const interval = Math.min(baseInterval * backoffMultiplier, 5 * 60 * 1000); // max 5 minutes
        
        console.log(`[NotificationDropdown] Polling lancé (intervalle: ${interval / 1000}s, erreurs: ${consecutiveErrors})`);
        
        const timerId = setInterval(() => {
            messagesNonLus();
        }, interval);

        return () => clearInterval(timerId); // Nettoyage
    }, [token, consecutiveErrors]);


    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
        const divisions = [
            { amount: 60, name: 'second' },
            { amount: 60, name: 'minute' },
            { amount: 24, name: 'hour' },
            { amount: 7, name: 'day' },
            { amount: 4.34524, name: 'week' },
            { amount: 12, name: 'month' },
            { amount: Infinity, name: 'year' },
        ];

        let duration = seconds;
        for (let i = 0; i < divisions.length; i++) {
            if (Math.abs(duration) < divisions[i].amount) {
                return rtf.format(-Math.floor(duration), divisions[i].name);
            }
            duration /= divisions[i].amount;
        }
    }

    return (
        <React.Fragment>
            <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <i
                        className='bx bx-bell fs-22'
                        style={{
                            color: theme === "dark" ? "white" : "black",
                            color: theme === "light" ? "#62748e" : "#fff",
                        }}
                    ></i>
                    <span
                        className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">{nbmessage}<span
                            className="visually-hidden">unread messages</span></span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg p-0" >
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                                </Col>
                                <div className="col-auto dropdown-tabs">
                                    <span className="badge bg-light-subtle text-body fs-13"> 4 New</span>
                                </div>
                            </Row>
                        </div>

                        <div className="px-2">
                            <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={`${classnames({ active: activeTab === '1' })} p-2 pb-1`}
                                        onClick={() => { toggleTab('1'); }}
                                    >
                                        All (4)
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={`${classnames({ active: activeTab === '2' })} p-2 pb-1`}
                                        onClick={() => { toggleTab('2'); }}
                                    >
                                        Messages
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={`${classnames({ active: activeTab === '3' })} p-2 pb-1`}
                                        onClick={() => { toggleTab('3'); }}
                                    >
                                        Alerts
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>

                    </div>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                {Array.isArray(messageNonLus) && messageNonLus.length === 0 && (
                                    <div>
                                        <div className="w-25 w-sm-50 pt-3 mx-auto">
                                            <img src={bell} className="img-fluid" alt="user-pic" />
                                        </div>
                                        <div className="text-center pb-5 mt-2">
                                            <h6 className="fs-18 fw-semibold lh-base">Vous n'avez aucun message non lu ! </h6>
                                        </div>
                                    </div>

                                )}
                                {Array.isArray(messageNonLus) && messageNonLus.length > 0 && messageNonLus.map((message, index) => (
                                    <div key={index} onClick={() => { navigate(`/apps-tickets-details/${message.ticket.id}`); setIsNotificationDropdown(false) }} className="text-reset notification-item d-block dropdown-item">
                                        <div className="d-flex">
                                            <img src={message.expediteur.photo || userdummy}
                                                className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                            <div className="flex-grow-1">
                                                <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">{message.expediteur.prenom} {message.expediteur.nom}</h6></Link>
                                                <div className="fs-13 text-muted">
                                                    <p className="mb-1">{message.message}</p>
                                                </div>
                                                <p className="mb-0 fw-medium text-muted d-flex align-items-center" style={{ padding: "0", fontSize: "90%" }}>
                                                    <i className="mdi mdi-clock-outline text-muted " style={{
                                                        display: 'inline-flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        fontSize: '110%',
                                                        lineHeight: 1,
                                                        padding: 0,
                                                        margin: 0,
                                                        width: '20px',
                                                        height: '20px',
                                                    }}
                                                    ></i>
                                                    <span className=''>{timeAgo(message.date_creation)}</span>
                                                </p>
                                            </div>
                                            {/* <div className="px-2 fs-15">
                                                <div className="form-check notification-check">
                                                    <input className="form-check-input" type="checkbox" value="" id="messages-notification-check01" />
                                                    <label className="form-check-label" htmlFor="messages-notification-check01"></label>
                                                </div>
                                                <input className="form-check-input" type="checkbox" />
                                            </div> */}
                                        </div>
                                    </div>
                                ))}

                                <div className=" my-3 d-flex justify-content-center">
                                    <button type="button" className="d-flex p-0 px-1 fs-6 align-items-center btn btn-soft-success waves-effect waves-light">
                                        View All Notifications
                                        <i className="ri-arrow-right-line align-middle"></i>
                                    </button>
                                </div>
                            </SimpleBar>
                        </TabPane>

                        <TabPane tabId="2" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                {Array.isArray(messageNonLus) && messageNonLus.length === 0 && (
                                    <div>
                                        <div className="w-25 w-sm-50 pt-3 mx-auto">
                                            <img src={bell} className="img-fluid" alt="user-pic" />
                                        </div>
                                        <div className="text-center pb-5 mt-2">
                                            <h6 className="fs-18 fw-semibold lh-base">Vous n'avez aucun message non lu ! </h6>
                                        </div>
                                    </div>

                                )}
                                {Array.isArray(messageNonLus) && messageNonLus.length > 0 && messageNonLus.map((message, index) => (
                                    <div key={index} onClick={() => { navigate(`/apps-tickets-details/${message.ticket.id}`); setIsNotificationDropdown(false) }} className="text-reset notification-item d-block dropdown-item">
                                        <div className="d-flex">
                                            <img src={message.expediteur.photo || userdummy}
                                                className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                            <div className="flex-grow-1">
                                                <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">{message.expediteur.prenom} {message.expediteur.nom}</h6></Link>
                                                <div className="fs-13 text-muted">
                                                    <p className="mb-1">{message.message}</p>
                                                </div>
                                                <p className="mb-0 fw-medium text-uppercase text-muted d-flex align-items-center" style={{ padding: "0", fontSize: "90%" }}>
                                                    <i className="mdi mdi-clock-outline text-muted " style={{
                                                        display: 'inline-flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        fontSize: '110%',
                                                        lineHeight: 1,
                                                        padding: 0,
                                                        margin: 0,
                                                        width: '20px',
                                                        height: '20px',
                                                    }}
                                                    ></i>
                                                    <span className=''>{timeAgo(message.date_creation)}</span>
                                                </p>
                                            </div>
                                            {/* <div className="px-2 fs-15">
                                                <div className="form-check notification-check">
                                                    <input className="form-check-input" type="checkbox" value="" id="messages-notification-check01" />
                                                    <label className="form-check-label" htmlFor="messages-notification-check01"></label>
                                                </div>
                                                <input className="form-check-input" type="checkbox" />
                                            </div> */}
                                        </div>
                                    </div>
                                ))}


                                <div className="my-3 d-flex justify-content-center">
                                    <button type="button" className="d-flex align-items-center p-0 px-1 btn btn-soft-success waves-effect waves-light">View
                                        All Messages <i className="ri-arrow-right-line align-middle"></i>
                                    </button>
                                </div>
                            </SimpleBar>
                        </TabPane>
                        <TabPane tabId="3" className="p-4">
                            <div className="w-25 w-sm-50 pt-3 mx-auto">
                                <img src={bell} className="img-fluid" alt="user-pic" />
                            </div>
                            <div className="text-center pb-5 mt-2">
                                <h6 className="fs-18 fw-semibold lh-base">Vous n'avez aucune notification ! </h6>
                            </div>
                        </TabPane>
                    </TabContent>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default NotificationDropdown;