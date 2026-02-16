import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            {new Date().getFullYear()} © Inawo. Tous droits reservés.
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end d-none d-sm-block">
                                
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;














// import React, { useCallback, useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import { Collapse, Container } from "reactstrap";
// import withRouter from "../../Components/Common/withRouter";
// import { useSelector } from "react-redux";
// import logoDark from "../../assets/images/iCone (01) Inawo.png";
// import logoLight from "../../assets/images/iCone (02) Inawo.png";
// import { withTranslation } from "react-i18next";
// import navdata from "../LayoutMenuData";
// import Simplebar from "simplebar-react";
// import { changeSidebarVisibility } from "../../slices/thunks";
// import { useDispatch } from "react-redux";
// import { getAuthData } from "../../utils/authUtils";
// import { useProfile } from "../../Components/Hooks/UserHooks";
// import styled from "@emotion/styled";
// import "../../App.css";
// import { useNavigate } from 'react-router-dom';
// import P1 from"../../assets/images/profils/P1.jpg"
// import P2 from"../../assets/images/profils/P2.jpg"
// import P3 from"../../assets/images/profils/P3.png"
// import P4 from"../../assets/images/profils/P4.webp"
// import P5 from"../../assets/images/profils/P5.jpg"

// const FaqSection = () => {
//   return (
//     <div className="col-lg-12">
//       <div className="card border-top bg-success-subtle rounded-0 mx-n4 mt-n4">
//         <div className="px-4">
//           <div className="row">
//             <div className="col-xxl-5 align-self-center">
//               <div className="py-4">
//                 <h4 className="display-6 coming-soon-text">Frequently asked questions</h4>
//                 <p className="text-success fs-15 mt-3">
//                   If you can not find answer to your question in our FAQ, you can always contact us or email us.
//                   We will answer you shortly!
//                 </p>
//                 <div className="hstack flex-wrap gap-2">
//                   <button type="button" className="btn btn-primary btn-label rounded-pill">
//                     <i className="ri-mail-line label-icon align-middle rounded-pill fs-16 me-2"></i> Email Us
//                   </button>
//                   <button type="button" className="btn btn-info btn-label rounded-pill">
//                     <i className="ri-twitter-line label-icon align-middle rounded-pill fs-16 me-2"></i> Send Us Tweet
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="col-xxl-3 ms-auto d-none d-xxl-block">
//               <div className="faq-img mb-n5 pb-1">
//                 <img src={faqImage} alt="FAQ Illustration" className="img-fluid" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row justify-content-evenly mb-4">
//         {/* Colonne 1 */}
//         <FaqCategory
//           icon="ri-question-line"
//           title="General Questions"
//           accordionId="genques-accordion"
//           questions={[
//             { title: "What is Lorem Ipsum ?", content: "If several languages coalesce..." },
//             { title: "Why do we use it ?", content: "The new common language will be more simple..." },
//             { title: "Where does it come from ?", content: "The wise man therefore always holds..." },
//             { title: "Where can I get some ?", content: "Cras ultricies mi eu turpis hendrerit..." },
//           ]}
//         />

//         {/* Colonne 2 */}
//         <FaqCategory
//           icon="ri-user-settings-line"
//           title="Manage Account"
//           accordionId="manageaccount-accordion"
//           questions={[
//             { title: "Where can I get some ?", content: "If several languages coalesce..." },
//             { title: "Where does it come from ?", content: "The new common language will be more simple..." },
//             { title: "Why do we use it ?", content: "The wise man therefore always holds..." },
//             { title: "What is Lorem Ipsum ?", content: "Cras ultricies mi eu turpis hendrerit..." },
//           ]}
//         />

//         {/* Colonne 3 */}
//         <FaqCategory
//           icon="ri-shield-keyhole-line"
//           title="Privacy & Security"
//           accordionId="privacy-accordion"
//           questions={[
//             { title: "Why do we use it ?", content: "If several languages coalesce..." },
//             { title: "Where can I get some ?", content: "The new common language will be more simple..." },
//             { title: "What is Lorem Ipsum ?", content: "The wise man therefore always holds..." },
//             { title: "Where does it come from ?", content: "Cras ultricies mi eu turpis hendrerit..." },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// const FaqCategory = ({ icon, title, accordionId, questions }) => {
//   return (
//     <div className="col-lg-4">
//       <div className="mt-3">
//         <div className="d-flex align-items-center mb-2">
//           <div className="flex-shrink-0 me-1">
//             <i className={`${icon} fs-24 align-middle text-success me-1`}></i>
//           </div>
//           <div className="flex-grow-1">
//             <h5 className="fs-16 mb-0 fw-semibold">{title}</h5>
//           </div>
//         </div>
//         <div className="accordion accordion-border-box" id={accordionId}>
//           {questions.map((q, index) => (
//             <div className="accordion-item" key={index}>
//               <h2 className="accordion-header" id={`${accordionId}-heading${index}`}>
//                 <button
//                   className={`accordion-button fw-medium ${index === 1 ? "" : "collapsed"}`}
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target={`#${accordionId}-collapse${index}`}
//                   aria-expanded={index === 1 ? "true" : "false"}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {q.title}
//                 </button>
//               </h2>
//               <div
//                 id={`${accordionId}-collapse${index}`}
//                 className={`accordion-collapse collapse ${index === 1 ? "show" : ""}`}
//                 data-bs-parent={`#${accordionId}`}
//               >
//                 <div className="accordion-body">{q.content}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//   );
// };

// const TwoColumnLayout = (props) => {
    
//   const dispatch = useDispatch();
//   const navData = navdata().props.children;
//   const [theme, setTheme] = useState(
//     document.documentElement.getAttribute("data-bs-theme") || "light"
//   );
//   const [activeSubMenu, setActiveSubMenu] = useState("");
//   const [activeMenu, setActiveMenu] = useState("");
//   const [activeMenuIcon, setActiveMenuIcon] = useState("");
//   const [selectedMainMenu, setSelectedMainMenu] = useState("Dashboard");
//   const { userProfile, token } = useProfile();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [coverPhoto, setCoverPhoto] = useState(null);
//   const [openMenus, setOpenMenus] = useState({});
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const profileRef = useRef(null);
//   const [showUpgradeCard, setShowUpgradeCard] = useState(true);
//   const navigate = useNavigate();

//   // États pour les tooltips
//   const [hoveredMenuTitle, setHoveredMenuTitle] = useState("");
//   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

//  const handleUpgradeClick = () => {
//     navigate('/:entreprise/abonnement', { 
//       state: { openUpgradeModal: true } 
//     });
//   };

//   // Fonction pour construire les URLs complètes
//   const buildImageUrl = (path) => {
//     if (!path) return null;
//     if (path.startsWith("https")) return path;
//     return `${config.API_URL}${path}`;
//   };

//   // Fermer le dropdown quand on clique à l'extérieur
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = (menuId) => {
//     setOpenMenus((prev) => ({
//       ...Object.keys(prev).reduce((acc, key) => {
//         acc[key] = false;
//         return acc;
//       }, {}),
//       [menuId]: !prev[menuId],
//     }));
//   };

//   // Fonctions pour gérer les tooltips
//   const handleMouseEnter = (menuTitle, event) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     setTooltipPosition({
//       x: rect.right + 10, // 10px à droite de l'élément
//       y: rect.top + rect.height / 2 // Centré verticalement
//     });
//     setHoveredMenuTitle(menuTitle);
//   };

//   const handleMouseLeave = () => {
//     setHoveredMenuTitle("");
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {;
//       try {
//         if (userProfile?.id) {
//           const response = await fetch(
//             `https://inawoapiv3.inawo.pro/utilisateurs/update-profile/${userProfile.id}/`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

//           const userData = await response.json();
//           setData(userData);
//                   if (userData.entreprise?.logo) {
//             // Utilisez buildImageUrl pour créer l'URL complète
//             setCoverPhoto(buildImageUrl(userData.entreprise.logo));
//           }

//         }
//       } catch (err) {
//         // console.error("Erreur lors de la récupération des données:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userProfile?.id]);

//   useEffect(() => {
//     dispatch(changeSidebarVisibility("show"));
//     document.body.classList.remove("twocolumn-panel");

//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.attributeName === "data-bs-theme") {
//           setTheme(document.documentElement.getAttribute("data-bs-theme"));
//         }
//       });
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["data-bs-theme"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   const sidebarStyle = {
//     background: theme === "dark" ? "#090b31" : "white",
//     color: theme === "dark" ? "white" : "#212529",
//     transition: "all 0.3s ease",
//     boxShadow: "4px 0 6px -4px rgba(0, 0, 0, 0.2)",
//   };

//   const simplebarStyle = {
//     background: theme === "dark" ? "#070940" : "white",
//     color: theme === "dark" ? "white" : "#212529",
//     transition: "all 0.3s ease",
//   };

//   const iconStyle = {
//     color: theme === "light" ? "#62748e" : "#fff",
//     transition: "all 0.3s ease",
//   };

//   const linkStyle = {
//     color: theme === "light" ? "#62748e" : "#fff",
//   };

//   const activeMenuIconStyle = {
//     marginRight: "12px",
//     width: "24px",
//     textAlign: "center",
//     color: "white",
//   };

//   const menuIconStyle = {
//     marginRight: "12px",
//     width: "24px",
//     textAlign: "center",
//     color: theme === "dark" ? "#e5e7eb" : "#495057",
//   };

//   const activeMenuStyle = {
//     backgroundColor: theme === "dark" ? "#2a3042" : "#f3f6f9",
//     color: theme === "dark" ? "#fff" : "#014a92",
//   };

//   const MenuItem = styled(Link)`
//     display: flex;
//     align-items: center;
//     padding: 10px 15px 10px 20px;
//     color: ${({ theme, active }) =>
//       active ? "#014a92" : theme === "light" ? "#62748e" : "#fff"};
//     transition: all 0.3s ease;

//     &:hover {
//       background-color: ${({ theme }) =>
//       theme === "dark" ? "#374151" : "#e5e7eb"};
//       color: #014a92;

//       i {
//         color: #014a92 !important;
//       }
//     }

//     i {
//       margin-right: 8px;
//       font-size: 18px;
//       color: ${({ theme, active }) =>
//       active ? "#014a92" : theme === "light" ? "#62748e" : "#fff"};
//       transition: color 0.2s;
//     }
//   `;

//   const activateParentDropdown = useCallback((item) => {
//     item.classList.add("active");
//     let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
//     if (parentCollapseDiv) {
//       parentCollapseDiv.classList.add("show");
//       parentCollapseDiv.parentElement.children[0].classList.add("active");
//       parentCollapseDiv.parentElement.children[0].setAttribute(
//         "aria-expanded",
//         "true"
//       );
//       if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
//         parentCollapseDiv.parentElement
//           .closest(".collapse")
//           .classList.add("show");
//         const parentParentCollapse =
//           parentCollapseDiv.parentElement.closest(
//             ".collapse"
//           ).previousElementSibling;
//         if (parentParentCollapse) {
//           parentParentCollapse.classList.add("active");
//           if (parentParentCollapse.closest(".collapse.menu-dropdown")) {
//             parentParentCollapse
//               .closest(".collapse.menu-dropdown")
//               .classList.add("show");
//           }
//         }
//       }
//       return false;
//     }
//     return false;
//   }, []);

//   const path = props.router.location.pathname;

//   function findSubItemByLink(linkText) {
//     if (!navData) return null;

//     for (const item of navData) {
//       if (item.subItems) {
//         for (const subItem of item.subItems) {
//           if (subItem.link === linkText) {
//             return item;
//           }
//         }
//       }
//     }
//     return null;
//   }

//   const initMenu = useCallback(() => {
//     const pathName = process.env.PUBLIC_URL + path;
//     const ul = document.getElementById("navbar-nav");
//     const items = ul.getElementsByTagName("a");
//     let itemsArray = [...items];
//     removeActivation(itemsArray);
//     let matchingMenuItem = itemsArray.find((x) => {
//       return x.pathname === pathName;
//     });

//     const foundSubItem = findSubItemByLink(pathName);
//     if (foundSubItem) {
//       setActiveMenu(foundSubItem.label);
//       setActiveMenuIcon(foundSubItem.icon);
//       foundSubItem.click({ preventDefault: () => { } });
//     }

//     if (matchingMenuItem) {
//       activateParentDropdown(matchingMenuItem);
//     }
//   }, [path, activateParentDropdown]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     initMenu();
//   }, [path, initMenu]);

//   function activateIconSidebarActive(id) {
//     var menu = document.querySelector(
//       "#two-column-menu .simplebar-content-wrapper a[subitems='" +
//       id +
//       "'].nav-icon"
//     );
//     if (menu !== null) {
//       menu.classList.add("active");
//     }
//   }

//   const removeActivation = (items) => {
//     let activeItems = items.filter((x) => x.classList.contains("active"));
//     activeItems.forEach((item) => {
//       if (item.classList.contains("menu-link")) {
//         if (!item.classList.contains("active")) {
//           item.setAttribute("aria-expanded", false);
//         }
//         item.nextElementSibling.classList.remove("show");
//       }
//       if (item.classList.contains("nav-link")) {
//         if (item.nextElementSibling) {
//           item.nextElementSibling.classList.remove("show");
//         }
//         item.setAttribute("aria-expanded", false);
//       }
//       item.classList.remove("active");
//     });

//     const ul = document.getElementById("two-column-menu");
//     const iconItems = ul.getElementsByTagName("a");
//     let itemsArray = [...iconItems];
//     let activeIconItems = itemsArray.filter((x) =>
//       x.classList.contains("active")
//     );
//     activeIconItems.forEach((item) => {
//       item.classList.remove("active");
//       var id = item.getAttribute("subitems");
//       if (document.getElementById(id))
//         document.getElementById(id).classList.remove("show");
//     });
//   };

//   const [isMenu, setIsMenu] = useState("twocolumn");
//   const windowResizeHover = () => {
//     initMenu();
//     var windowSize = document.documentElement.clientWidth;
//     if (windowSize < 767) {
//       document.documentElement.setAttribute("data-layout", "vertical");
//       setIsMenu("vertical");
//     } else {
//       document.documentElement.setAttribute("data-layout", "twocolumn");
//       setIsMenu("twocolumn");
//     }
//   };

//   useEffect(() => {
//     if (props.layoutType === "twocolumn") {
//       window.addEventListener("resize", windowResizeHover);
//       return () => {
//         window.removeEventListener("resize", windowResizeHover);
//       };
//     }
//   });

//   const auth = useSelector((state) => state.auth || {});
//   // const users = userProfile;
//   const users = auth.users || getAuthData().user;

//   const allMenus = navdata().props.children;
//   const userModule = String(users?.abonnement?.module || "INOWOGLOBAL")
//     .toUpperCase()
//     .replace(/\s+/g, "");
    
// console.log("UserModule:",userModule)

//   const filteredMenu = allMenus
//     .filter((menu) => {
//       return !menu.modules || menu.modules.includes(userModule);
//     })
//     .map((menu) => {
//       const filteredSubItems = menu.subItems?.filter((sub) => {
//         return !sub.modules || sub.modules.includes(userModule);
//       });

//       return {
//         ...menu,
//         subItems: filteredSubItems,
//       };
//     });

//   const mainMenus = [
//     {
//       id: "Dashboard",
//       label: "Tableau de bord",
//       icon: "ri-dashboard-line",
//       title: "Suite Inawo",
//     },
//     {
//       id: "Documentations",
//       label: "Documentations",
//       icon: "ri-book-line",
//       title: "Documentations",
//     },
//     // {
//     //   id: "Discussion",
//     //   label: "Discussion",
//     //   icon: "ri-chat-voice-line",
//     //   title: "Discussion",

//     // },
//     // {
//     //   id: "Recrutement",
//     //   label: "Recrutement",
//     //   icon: "ri-projector-line",
//     //   title: "Recrutement",
//     // },
//     {
//       id: "Paramètres",
//       label: "Paramètres",
//       icon: "ri-settings-5-line",
//       title: "Paramètres",
//     },
//   ];

//   const getSubMenusForMainMenu = (menuId) => {
//   if (menuId === "Recrutement") {
//     const recrutementMenu = filteredMenu.find(
//       (menu) => menu.label === "Recrutement"
//     );
//     return recrutementMenu?.subItems || [];
//   } else if (menuId === "Paramètres") {
//     const settingsMenu = filteredMenu.find(
//       (menu) => menu.label === "Paramètres"
//     );
//     return settingsMenu?.subItems || [];
//   } else if (menuId === "Documentations") {
//     return [
//       {
//         id: "Support Client",
//         label: "Supports Clients",
//         icon: "ri-message-3-line",
//         link: "/:entreprise/supportClient",
//         parentId: "Documentations",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//       },
//       {
//         id: "Guide d'utilisation",
//         label: "Guide d'utilisation",
//         icon: "ri-book-line",
//         link: "/:entreprise/guideUtilisation",
//         parentId: "Documentations",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//       },
//       {
//         id: "Tutoriels vidéos",
//         label: "Tutoriels vidéos",
//         icon: "ri-tv-line",
//         link: "/:entreprise/tutoriels",
//         parentId: "Documentations",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//       },
//     ];
//   } else if (menuId === "Discussion") {
//     // Liste des contacts/personnes pour les discussions avec images et statuts
//     return [
//       {
//         id: "marie-dubois",
//         label: "Marie Dubois",
//         icon: "ri-user-line",
//         image: "../../assets/images/profils/P1.jpg",
//         link: "/:entreprise/discussion?contact=marie-dubois",
//         parentId: "Discussion",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//         status: "online",
//         statusColor: "#28a745", 
//         unread: 2,
//         lastMessage: "Bonjour, j'ai reçu la commande, merci !",
//         role: "Commerciale"
//       },
//       {
//         id: "pierre-martin",
//         label: "Pierre Martin",
//         icon: "ri-user-line",
//         image: "../../assets/images/profils/P2.jpg",
//         link: "/:entreprise/discussion?contact=pierre-martin",
//         parentId: "Discussion",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//         status: "offline",
//         statusColor: "#6c757d", // Gris pour hors ligne
//         unread: 0,
//         lastMessage: "Le devis me convient parfaitement",
//         role: "Responsable Achats"
//       },
//       {
//         id: "sophie-lambert",
//         label: "Sophie Lambert",
//         icon: "ri-user-line",
//         image: "../../assets/images/profils/P1.jpg",
//         link: "/:entreprise/discussion?contact=sophie-lambert",
//         parentId: "Discussion",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//         status: "online",
//         statusColor: "#28a745",
//         unread: 1,
//         lastMessage: "Quand sera la prochaine livraison ?",
//         role: "Logisticienne"
//       },
//       {
//         id: "thomas-bernard",
//         label: "Thomas Bernard",
//         icon: "ri-user-line",
//         image: "../../assets/images/profils/P1.jpg",
//         link: "/:entreprise/discussion?contact=thomas-bernard",
//         parentId: "Discussion",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//         status: "away",
//         statusColor: "#ffc107", // Jaune pour absent
//         unread: 0,
//         lastMessage: "Merci pour votre réactivité",
//         role: "Directeur Technique"
//       },
//       {
//         id: "alice-moreau",
//         label: "Alice Moreau",
//         icon: "ri-user-line",
//         image: "../../assets/images/profils/P4.jpg",
//         link: "/:entreprise/discussion?contact=alice-moreau",
//         parentId: "Discussion",
//         modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
//         status: "online",
//         statusColor: "#28a745",
//         unread: 0,
//         lastMessage: "Le rendez-vous est confirmé pour demain",
//         role: "Assistante"
//       },
//     ];
//   }
//   return [];
// };

//   return (
//     <div style={{}}>
//       {isMenu === "twocolumn" ? (
//         <div id="scrollbar" style={{ ...sidebarStyle, listStyle: "none" }}>
//           <Container fluid>
//             <div
//               id="two-column-menu"
//               style={{ ...sidebarStyle, listStyle: "none" }}
//             >
//               <Simplebar
//                 className="twocolumn-iconview"
//                 style={{ ...simplebarStyle, listStyle: "none" }}
//               >
//                 <Link to="#" className="logo">
//                   <div
//                     style={{
//                       padding: "5px",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       position: "relative",
//                       margin: "10px 0",
//                     }}
//                   >
//                     <img
//                       src={theme === "dark" ? logoLight : logoDark}
//                       alt="Logo Inawo"
//                       height="35"
//                       style={{
//                         maxWidth: "100%",
//                         objectFit: "contain",
//                         transition: "all 0.3s ease",
//                       }}
//                     />
//                   </div>
//                 </Link>

//                 {mainMenus.map((item, key) => (
//                   <div
//                     key={key}
//                     style={{
//                       padding: "2px 0",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       position: "relative",
//                     }}
//                   >
//                     <Link
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setSelectedMainMenu(item.id);
//                         setActiveMenu(item.label);
//                         setActiveMenuIcon(item.icon);
//                       }}
//                       className={`nav-icon ${selectedMainMenu === item.id ? "active" : ""
//                         }`}
//                       to="#"
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         padding: "1px 0",
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "3px",
//                         backgroundColor:
//                           selectedMainMenu === item.id
//                             ? theme === "dark"
//                               ? "#2a3042"
//                               : "#f3f6f9"
//                             : "transparent",
//                         color:
//                           selectedMainMenu === item.id
//                             ? theme === "dark"
//                               ? "#fff"
//                               : "#014a92"
//                             : theme === "dark"
//                               ? "#9ca3af"
//                               : "#878a99",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseEnter={(e) => handleMouseEnter(item.title, e)}
//                       onMouseLeave={handleMouseLeave}
//                     >
//                       <i
//                         className={item.icon}
//                         style={{
//                           fontSize: "22px",
//                           transition: "color 0.2s",
//                         }}
//                       />
//                     </Link>
//                   </div>
//                 ))}

//                 {isProfileDropdownOpen && (
//                   <div
//                     style={{
//                       position: "fixed",
//                       bottom: "70px",
//                       left: "70px",
//                       width: "200px",
//                       backgroundColor: theme === "dark" ? "#1a1d21" : "#fff",
//                       borderRadius: "12px",
//                       boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
//                       zIndex: 1000,
//                       padding: "0",
//                       border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"
//                         }`,
//                       overflow: "hidden",
//                     }}
//                   >
//                     {/* Header avec photo et info utilisateur */}
//                     <div
//                       style={{
//                         padding: "20px",
//                         backgroundColor:
//                           theme === "dark" ? "#2a2f3a" : "#f8f9fa",
//                         borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"
//                           }`,
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "12px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "50px",
//                             height: "50px",
//                             borderRadius: "50%",
//                             overflow: "hidden",
//                             border: `3px solid ${theme === "dark" ? "#4b5563" : "#e5e7eb"
//                               }`,
//                             flexShrink: 0,
//                           }}
//                         >
//                           {coverPhoto ? (
//                             <img
//                               src={coverPhoto}
//                               alt="Profile"
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           ) : (
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 backgroundColor:
//                                   theme === "dark" ? "#374151" : "#f0f0f0",
//                               }}
//                             >
//                               <i
//                                 className="ri-user-line"
//                                 style={{
//                                   fontSize: "20px",
//                                   color: theme === "dark" ? "#e5e7eb" : "#666",
//                                 }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <div
//                             style={{
//                               fontWeight: "600",
//                               fontSize: "12px",
//                               color: theme === "dark" ? "#fff" : "#1f2937",
//                               marginBottom: "4px",
//                               marginLeft: "5px",
//                             }}
//                           >
//                             {userProfile?.nom || "Utilisateur"}{" "}
//                             {userProfile?.prenom || ""}
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "10px",
//                               color: theme === "dark" ? "#9ca3af" : "#6b7280",
//                               fontWeight: "400",
//                             }}
//                           >
//                             {userProfile?.entreprise?.nom || "Product Designer"}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div style={{ padding: "8px 0" }}>
//                       <Link
//                         to="/messages"
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           padding: "12px 20px",
//                           color: theme === "dark" ? "#e5e7eb" : "#374151",
//                           textDecoration: "none",
//                           transition: "all 0.2s ease",
//                           borderLeft: "3px solid transparent",
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor =
//                             theme === "dark" ? "#374151" : "#f3f4f6";
//                           e.currentTarget.style.borderLeftColor = "#10b981";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = "transparent";
//                           e.currentTarget.style.borderLeftColor = "transparent";
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "36px",
//                             height: "36px",
//                             borderRadius: "50px",
//                             backgroundColor: "#014a92",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             marginRight: "12px",
//                           }}
//                         >
//                           <i
//                             className="ri-add-line"
//                             style={{ color: "#fff", fontSize: "16px" }}
//                           />
//                         </div>
//                         <div>
//                           <div style={{ fontWeight: "400", fontSize: "11px" }}>
//                             Ajouter entreprise
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </Simplebar>

//               {/* Tooltip personnalisé pour les mainMenus */}
//               {hoveredMenuTitle && (
//                 <div
//                   style={{
//                     position: "fixed",
//                     left: `${tooltipPosition.x}px`,
//                     top: `${tooltipPosition.y}px`,
//                     transform: "translateY(-50%)", // Centré verticalement
//                     zIndex: 9999,
//                     backgroundColor: "#495057", // Fond light
//                     color: "#fff", // Texte noir
//                     padding: "8px 16px",
//                     borderRadius: "70px", // Très arrondi
//                     fontSize: "12px",
//                     fontWeight: "500",
//                     whiteSpace: "nowrap",
//                     // boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                     pointerEvents: "none",
//                     border: "1px solid #495057",
//                     animation: "fadeInTooltip 0.2s ease-in-out"
//                   }}
//                 >
//                   {hoveredMenuTitle}
//                 </div>
//               )}
//             </div>

//             <Simplebar id="navbar-nav" className="navbar-nav">
//               <div
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 10,
//                   background: theme === "dark" ? "#090b31" : "#ffffff", // ← FOND BLANC SOLIDE
//                   padding: "17px",
//                   paddingLeft: "15px",
//                   marginLeft: "0.6px",
//                   // border:"2px solid black",
//                   // border: theme === "dark" ? "#374151" : "#e5e7eb", // Bordure claire
//                   // boxShadow: theme === "dark"
//                   //   ? "1px 2px 4px rgba(0, 0, 0, 0.3)"
//                   //   : "1px 2px 4px rgba(0, 0, 0, 0.1)", // Ombre subtile
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       backgroundColor: "#f3f6f9",
//                       border: "none",
//                       borderRadius: "50%",
//                       width: "35px",
//                       height: "35px",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       background: theme === "light" ? "#f3f6f9" : "#f3f6f967",
//                     }}
//                   >
//                     <i
//                       className={activeMenuIcon}
//                       style={{
//                         color: theme === "light" ? "slategray" : "white",
//                         fontSize: "21px",
//                         fontWeight: "normal",
//                       }}
//                     ></i>
//                   </div>
//                   <h5
//                     style={{
//                       color: "slategray",
//                       margin: 0,
//                       display: "flex",
//                       alignItems: "center",
//                     }}
//                   >
//                     {activeMenu}
//                   </h5>
//                 </div>
//               </div>

//               {selectedMainMenu === "Dashboard"
//                 ? (filteredMenu || [])
//                   .filter(
//                     (item) =>
//                       item.label !== "Recrutement" &&
//                       item.label !== "Paramètres" &&
//                       item.label !== "Documentations"
//                   )
//                   .map((item, key) => (
//                     <React.Fragment key={key}>
//                       {item.subItems && (
//                         <li
//                           className="nav-item"
//                           style={{ listStyle: "none", paddingLeft: 0 }}
//                         >
//                           <Link
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setActiveMenu(item.label);
//                               setActiveMenuIcon(item.icon);
//                               toggleMenu(item.id);
//                               if (item.click) item.click(e);
//                             }}
//                             className={`nav-icon menu-item-hover ${selectedMainMenu === item.id ? "active" : ""
//                               }`}
//                             to="#"
//                             style={{
//                               fontSize: "13px",
//                               height: "40px",
//                               display: "flex",
//                               alignItems: "center",
//                               padding: "10px 15px 10px 20px",
//                               textTransform: "none",
//                               backgroundColor:
//                                 activeMenu === item.label
//                                   ? "#014a92"
//                                   : "transparent",
//                               color:
//                                 activeMenu === item.label
//                                   ? "#fff"
//                                   : theme === "light"
//                                     ? "var(--vz-vertical-menu-sub-item-color)"
//                                     : "#fff",
//                               transition: "all 0.3s ease",
//                               ":hover": {
//                                 backgroundColor:
//                                   theme === "dark" ? "#374151" : "#e5e7eb",
//                                 color: "#014a92",
//                                 "& i": {
//                                   color: "#014a92 !important",
//                                 },
//                               },
//                             }}
//                           >
//                             <i
//                               className={item.icon}
//                               style={{
//                                 marginRight: "8px",
//                                 textAlign: "center",
//                                 fontSize: "18px",
//                                 color:
//                                   activeMenu === item.label
//                                     ? "#fff"
//                                     : theme === "light"
//                                       ? "var(--vz-vertical-menu-sub-item-color)"
//                                       : "#fff",
//                                 transition: "color 0.2s",
//                               }}
//                             />
//                             {props.t(item.label)}
//                           </Link>
//                           <Collapse
//                             className="menu-dropdown"
//                             isOpen={openMenus[item.id]}
//                             id={item.id}
//                           >
//                             <ul
//                               className="nav nav-sm flex-column"
//                               style={{ listStyle: "none", paddingLeft: 0 }}
//                             >
//                               {(item.subItems || []).map(
//                                 (subItem, subKey) => (
//                                   <li
//                                     key={subKey}
//                                     className="nav-item"
//                                     style={{ paddingLeft: 13 }}
//                                   >
//                                     <Link
//                                       to={subItem.link || "/#"}
//                                       className={`nav-link submenu-item-hover ${activeSubMenu === subItem.link
//                                           ? "active"
//                                           : ""
//                                         }`}
//                                       style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         height: "40px",
//                                         backgroundColor:
//                                           activeSubMenu === subItem.link
//                                             ? "#f3f6f9"
//                                             : "transparent",
//                                         color:
//                                           activeSubMenu === subItem.link
//                                             ? "#014a92"
//                                             : theme === "light"
//                                               ? "var(--vz-vertical-menu-sub-item-color)"
//                                               : "#fff",
//                                         transition: "all 0.3s ease",
//                                         ":hover": {
//                                           backgroundColor:
//                                             theme === "dark"
//                                               ? "#374151"
//                                               : "#e5e7eb",
//                                           color: "#014a92",
//                                           "& i": {
//                                             color: "#014a92 !important",
//                                           },
//                                         },
//                                       }}
//                                       onClick={() =>
//                                         setActiveSubMenu(subItem.link)
//                                       }
//                                     >
//                                       <i
//                                         className={subItem.icon}
//                                         style={{
//                                           marginRight: "12px",
//                                           width: "24px",
//                                           textAlign: "center",
//                                           color:
//                                             activeSubMenu === subItem.link
//                                               ? "#014a92"
//                                               : theme === "light"
//                                                 ? "#62748e"
//                                                 : "#fff",
//                                         }}
//                                       ></i>
//                                       {props.t(subItem.label)}
//                                       {subItem.badgeName && (
//                                         <span
//                                           className={`badge badge-pill bg-${subItem.badgeColor}`}
//                                         >
//                                           {subItem.badgeName}
//                                         </span>
//                                       )}
//                                     </Link>
//                                   </li>
//                                 )
//                               )}
//                             </ul>
//                           </Collapse>
//                         </li>
//                       )}
//                     </React.Fragment>
//                   ))
//                 : getSubMenusForMainMenu(selectedMainMenu).map(
//                   (subItem, key) => (
//                     <li
//                       key={key}
//                       className="nav-item hov-mylink"
//                       style={{
//                         paddingLeft: 13,
//                         WebkitPaddingStart: 0,
//                       }}
//                     >
//                       <Link
//                         to={subItem.link ? subItem.link : "/#"}
//                         className={`nav-link submenu-item-hover ${activeSubMenu === subItem.link ? "active" : ""
//                           }`}
//                         style={{
//                           backgroundColor:
//                             activeSubMenu === subItem.link
//                               ? "#f3f6f9"
//                               : "transparent",
//                           color:
//                             activeSubMenu === subItem.link
//                               ? "#014a92"
//                               : theme === "light"
//                                 ? "var(--vz-vertical-menu-sub-item-color)"
//                                 : "#fff",
//                           transition: "all 0.3s ease",
//                           ":hover": {
//                             backgroundColor:
//                               theme === "dark" ? "#374151" : "#e5e7eb",
//                             color: "#014a92",
//                           },
//                         }}
//                         onClick={() => setActiveSubMenu(subItem.link)}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             paddingLeft: "20px",
//                           }}
//                         >
//                           <i
//                             className={subItem.icon}
//                             style={{
//                               color:
//                                 activeSubMenu === subItem.link
//                                   ? "#014a92"
//                                   : theme === "light"
//                                     ? "#62748e"
//                                     : "#fff",
//                               marginRight: "12px",
//                               width: "24px",
//                               textAlign: "center",
//                             }}
//                           ></i>
//                           {props.t(subItem.label)}
//                         </div>
//                         {subItem.badgeName ? (
//                           <span
//                             className={
//                               "badge badge-pill bg-" + subItem.badgeColor
//                             }
//                             data-key="t-new"
//                           >
//                             {subItem.badgeName}
//                           </span>
//                         ) : null}
//                       </Link>
//                     </li>
//                   )
//                 )}
//              {showUpgradeCard && userProfile?.abonnement?.categorie_nom === "Essentiel" && (
//         <div style={{
//           margin: "20px 15px",
//           borderRadius: "20px",
//           border: `2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
//           textAlign: "center",
//           position: "relative",
//           overflow: "hidden", // Important pour que les sections se collent bien
//           backgroundColor: "white" // Fond principal blanc
//         }}>
          
//           {/* Section du haut avec fond light (couvre close button et icône fusée) */}
//           <div style={{
//             backgroundColor: theme === "dark" ? "#070940" : "#f8f9ff", // Fond light
//             padding: "20px 20px 15px 20px", // Padding pour cette section
//             position: "relative"
//           }}>

//             {/* Icon - Dans la section light */}
//             <div style={{
//               width: "45px",
//               height: "45px",
//               backgroundColor: "#6366f1",
//               borderRadius: "12px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto"
//             }}>
//               <i className="ri-rocket-line" style={{
//                 fontSize: "20px",
//                 color: "white"
//               }}></i>
//             </div>
//           </div>

//           {/* Section du bas avec fond blanc (titre, description, bouton) */}
//           <div style={{
//             backgroundColor: theme === "dark" ? "#090b31" : "white", // Fond blanc
//             padding: "15px 20px 20px 20px"
//           }}>
            
//             {/* Title */}
//             <h6 style={{
//               margin: "0 0 6px 0",
//               fontSize: "14px",
//               fontWeight: "600",
//               color: theme === "dark" ? "#fff" : "#1f2937"
//             }}>
//               Passer au Premium
//             </h6>

//             {/* Description */}
//             <p style={{
//               margin: "0 0 16px 0",
//               fontSize: "11px",
//               color: theme === "dark" ? "#9ca3af" : "#6b7280",
//               lineHeight: "1.3"
//             }}>
//               Débloquez toutes les fonctionnalités avancées
//             </p>

//             {/* Upgrade Button */}
//             <button
//               style={{
//                 width: "100%",
//                 padding: "8px 12px",
//                 backgroundColor: "#6366f1",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "70px",
//                 fontSize: "12px",
//                 fontWeight: "500",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "6px"
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = "#000000"; // Noir au hover
//                 e.currentTarget.style.transform = "translateY(-1px)";
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "#6366f1";
//                 e.currentTarget.style.transform = "translateY(0)";
//                 e.currentTarget.style.boxShadow = "none";
//               }}
//              onClick={handleUpgradeClick}
//             >
//               <i className="ri-vip-crown-line"></i>
//               Mettre à niveau
//             </button>
//           </div>
//         </div>
//       )}
//             </Simplebar>
//           </Container>
//         </div>
//       ) : (
//         <Simplebar
//           id="scrollbar"
//           className="h-100"
//           style={{ background: "white", color: "black" }}
//         >
//           <Container fluid>
//             <div id="two-column-menu"></div>
//             <ul className="navbar-nav" id="navbar-nav">
//               {/* <VerticalLayout /> */}
//             </ul>
//           </Container>
//         </Simplebar>
//       )}

//       {/* Styles CSS pour l'animation du tooltip */}
//       <style>
//         {`
//           @keyframes fadeInTooltip {
//             from {
//               opacity: 0;
//               transform: translateY(-50%) translateX(-5px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(-50%) translateX(0);
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// TwoColumnLayout.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

// export default withRouter(withTranslation()(TwoColumnLayout));